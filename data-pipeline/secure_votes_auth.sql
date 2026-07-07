-- ============================================================
-- Securise les votes avec une identite verifiee par Supabase (connexions
-- anonymes), a la place du device_id fourni par le client. Corrige la
-- faille confirmee : un script pouvait voter un nombre illimite de fois
-- en inventant un nouveau device_id a chaque appel, sans aucune session.
--
-- PREREQUIS (a faire une fois, dans le dashboard, avant d'executer ce
-- fichier) : Authentication -> Sign In / Providers -> activer
-- "Allow anonymous sign-ins". Sans ca, signInAnonymously() echoue et
-- personne ne peut plus voter.
--
-- La table votes est actuellement vide (verifie avant migration) :
-- suppression et recreation propres, rien a migrer.
--
-- IMPORTANT : les DROP FUNCTION explicites sont indispensables. La
-- nouvelle version a une signature differente (bigint, smallint) au lieu
-- de (bigint, uuid, smallint) : sans le DROP, Postgres creerait une
-- fonction EN PLUS de l'ancienne au lieu de la remplacer, et l'ancienne
-- (vulnerable, acceptant un device_id invente) resterait appelable.
--
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

drop view if exists public.vote_counts;
drop function if exists public.cast_vote(bigint, uuid, smallint);
drop function if exists public.remove_vote(bigint, uuid);
drop table if exists public.votes cascade;

create table public.votes (
  tool_id    bigint not null references public.tools(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  value      smallint not null check (value in (-1, 1)),  -- 1 = pour, -1 = contre
  created_at timestamptz not null default now(),
  primary key (tool_id, user_id)  -- le verrou : 1 vote par utilisateur (verifie) et par outil
);

-- RLS active sans aucune policy = personne ne lit/ecrit la table en direct
-- (inchange par rapport a avant : tout passe par les 2 fonctions ci-dessous).
alter table public.votes enable row level security;

-- Voter ou changer son vote. Plus aucun parametre d'identite : auth.uid()
-- est l'identifiant de la session verifiee par Supabase (le JWT), impossible
-- a falsifier sans une vraie session (anonyme ou connectee).
create or replace function public.cast_vote(p_tool_id bigint, p_value smallint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentification requise pour voter.';
  end if;
  insert into public.votes (tool_id, user_id, value)
  values (p_tool_id, auth.uid(), p_value)
  on conflict (tool_id, user_id)
  do update set value = excluded.value, created_at = now();
end;
$$;

-- Retirer son vote.
create or replace function public.remove_vote(p_tool_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentification requise.';
  end if;
  delete from public.votes
  where tool_id = p_tool_id and user_id = auth.uid();
end;
$$;

-- Uniquement "authenticated" (les sessions anonymes en font partie).
-- Plus jamais "anon" : ce role est utilise quand AUCUNE session n'existe,
-- et auth.uid() y est toujours NULL.
grant execute on function public.cast_vote(bigint, smallint) to authenticated;
grant execute on function public.remove_vote(bigint) to authenticated;

-- Totaux publics par outil (n'expose pas les user_id).
create view public.vote_counts as
  select
    tool_id,
    count(*) filter (where value = 1)  as up,
    count(*) filter (where value = -1) as down
  from public.votes
  group by tool_id;

grant select on public.vote_counts to anon, authenticated;

-- ============================================================
-- Votes publics (pouce haut / pouce bas) sur les outils BOAS — v2.
-- 1 vote par navigateur et par outil, MODIFIABLE (changer ou retirer).
--
-- Securite : la table n'est PAS accessible directement par l'API
-- (aucune policy RLS). On passe par deux fonctions qui ne touchent
-- que la ligne correspondant a l'appareil qui demande, et par une
-- vue d'agregation qui n'expose jamais les device_id.
--
-- Idempotent : peut etre execute meme si la v1 existait deja.
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

drop view if exists public.vote_counts;
drop table if exists public.votes cascade;

create table public.votes (
  tool_id    bigint not null references public.tools(id) on delete cascade,
  device_id  uuid not null,              -- identifiant anonyme genere par le navigateur
  value      smallint not null check (value in (-1, 1)),  -- 1 = pour, -1 = contre
  created_at timestamptz not null default now(),
  primary key (tool_id, device_id)      -- le verrou : 1 vote par appareil et par outil
);

-- RLS active sans aucune policy = personne ne lit/ecrit la table en direct.
alter table public.votes enable row level security;

-- Voter ou changer son vote (insert-ou-update sur SA ligne uniquement).
create or replace function public.cast_vote(p_tool_id bigint, p_device_id uuid, p_value smallint)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.votes (tool_id, device_id, value)
  values (p_tool_id, p_device_id, p_value)
  on conflict (tool_id, device_id)
  do update set value = excluded.value, created_at = now();
$$;

-- Retirer son vote.
create or replace function public.remove_vote(p_tool_id bigint, p_device_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.votes
  where tool_id = p_tool_id and device_id = p_device_id;
$$;

grant execute on function public.cast_vote(bigint, uuid, smallint) to anon, authenticated;
grant execute on function public.remove_vote(bigint, uuid) to anon, authenticated;

-- Totaux publics par outil (n'expose pas les device_id).
create view public.vote_counts as
  select
    tool_id,
    count(*) filter (where value = 1)  as up,
    count(*) filter (where value = -1) as down
  from public.votes
  group by tool_id;

grant select on public.vote_counts to anon, authenticated;

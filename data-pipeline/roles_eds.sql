-- Roles EDS multiples (Limoges/Bordeaux/Poitiers) - chacun ne peut
-- modifier que sa propre colonne tier_<hopital> sur la table tools.
-- Deja execute en base avant creation de ce fichier - documente ici
-- a posteriori, contenu verifie via information_schema et pg_policies.
-- Table de correspondance utilisateur <-> hopital
create table public.eds_editors (
  user_id uuid primary key references auth.users(id),
  hopital text not null check (hopital in ('limoges', 'bordeaux', 'poitiers'))
);
alter table public.eds_editors enable row level security;
-- aucune policy : meme principe que admins, illisible/inecrivable via l'API

drop policy if exists "modification admin uniquement" on public.tools;
create policy "modification admin ou editeur eds"
  on public.tools for update
  to authenticated
  using ((select public.is_admin()) or exists (select 1 from public.eds_editors where user_id = auth.uid()))
  with check ((select public.is_admin()) or exists (select 1 from public.eds_editors where user_id = auth.uid()));

create or replace function public.check_eds_column_scope()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hopital text;
  v_allowed_column text;
  v_old jsonb := to_jsonb(OLD);
  v_new jsonb := to_jsonb(NEW);
  v_key text;
begin
  if (select public.is_admin()) then
    return NEW;
  end if;

  select hopital into v_hopital from public.eds_editors where user_id = auth.uid();
  if v_hopital is null then
    raise exception 'Non autorise a modifier tools.';
  end if;

  v_allowed_column := 'tier_' || v_hopital;

  for v_key in select jsonb_object_keys(v_new) loop
    if v_key <> v_allowed_column and v_old->v_key is distinct from v_new->v_key then
      raise exception 'Non autorise a modifier la colonne %.', v_key;
    end if;
  end loop;

  return NEW;
end;
$$;

create trigger tools_eds_scope
  before update on public.tools
  for each row execute function public.check_eds_column_scope();
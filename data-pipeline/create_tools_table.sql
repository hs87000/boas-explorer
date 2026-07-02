-- ============================================================
-- Table "tools" : les 48 algorithmes du catalogue BOAS.
-- Reflete la structure des entrees de app/src/data/boas_data.json.
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

create table public.tools (
  id               bigint primary key,          -- id d'origine du JSON (1 a 48)
  name             text not null,
  fiche_url        text,                        -- ficheUrl
  author_type      text,                        -- authorType
  objectives       text[] not null default '{}',
  medical_domains  text[] not null default '{}',-- medicalDomains
  languages        text[] not null default '{}',
  data_types       text[] not null default '{}',-- dataTypes
  validation       text,
  maintenance      text,
  summary          text,
  data_description text,                        -- dataDescription
  context          text,
  repo_url         text,                        -- repoUrl
  licence          text,
  last_update      text,                        -- lastUpdate (date en toutes lettres, ex. "juin 2024")
  how_it_works     text,                        -- howItWorks
  limits           text,
  inclusion        text,
  exclusion        text,
  input_data       text,                        -- inputData
  tier             text check (tier in ('S','A','B','C','D','F')), -- rang tier list (null = non classe)
  created_at       timestamptz not null default now()
);

-- RLS : chaque requete passe par ces regles.
alter table public.tools enable row level security;

-- Lecture ouverte a tout le monde (le site est public).
create policy "lecture publique"
  on public.tools for select
  using (true);

-- Ecriture reservee aux utilisateurs connectes.
create policy "insertion authentifiee"
  on public.tools for insert
  to authenticated
  with check (true);

create policy "modification authentifiee"
  on public.tools for update
  to authenticated
  using (true)
  with check (true);

create policy "suppression authentifiee"
  on public.tools for delete
  to authenticated
  using (true);

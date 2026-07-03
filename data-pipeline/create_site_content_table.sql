-- ============================================================
-- Textes editables du site (legendes des cases au-dessus du catalogue).
-- Lecture publique, modification reservee a l'admin connecte.
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

create table public.site_content (
  key        text primary key,
  body       text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "lecture publique"
  on public.site_content for select
  using (true);

create policy "modification authentifiee"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

create policy "insertion authentifiee"
  on public.site_content for insert
  to authenticated
  with check (true);

-- Textes par defaut (modifiables ensuite depuis le site en mode admin).
insert into public.site_content (key, body) values
  ('legend_votes', 'Donnez votre avis : ▲ si l''outil vous paraît utile, ▼ sinon. Un vote par appareil, modifiable à tout moment.'),
  ('legend_eds', 'Le badge EDS indique le rang officiel attribué par l''équipe de l''Entrepôt de Données de Santé du CHU de Limoges, de S (référence) à F.')
on conflict (key) do nothing;

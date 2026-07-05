-- ============================================================
-- Classement "Methodo" : qualite de la methodologie et du niveau
-- de detail de la documentation (source : Classement_algorithmes_BOAS.xlsx).
-- A executer AVANT seed_methodo.sql.
-- ============================================================

alter table public.tools
  add column tier_methodo text check (tier_methodo in ('S','A','B','C','D','F')),
  add column methodo_justification text;

-- Legende de la nouvelle case (modifiable ensuite depuis le site).
insert into public.site_content (key, body) values
  ('legend_methodo', 'Le badge Méthodo note la qualité de la méthodologie et le niveau de détail de la documentation de chaque outil, de S (référence) à F. La justification détaillée est dans la fiche de chaque outil.')
on conflict (key) do nothing;

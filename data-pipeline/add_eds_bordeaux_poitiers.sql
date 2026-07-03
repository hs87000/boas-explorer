-- ============================================================
-- Classements EDS Bordeaux et EDS Poitiers, en plus de Limoges.
-- La colonne "tier" existante reste celle de l'EDS Limoges.
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

alter table public.tools
  add column tier_bordeaux text check (tier_bordeaux in ('S','A','B','C','D','F')),
  add column tier_poitiers text check (tier_poitiers in ('S','A','B','C','D','F'));

-- Legendes des deux nouvelles cases (modifiables ensuite depuis le site).
insert into public.site_content (key, body) values
  ('legend_eds_bordeaux', 'Le segment B du badge indique le rang attribué par l''équipe de l''Entrepôt de Données de Santé du CHU de Bordeaux, de S (référence) à F.'),
  ('legend_eds_poitiers', 'Le segment P du badge indique le rang attribué par l''équipe de l''Entrepôt de Données de Santé du CHU de Poitiers, de S (référence) à F.')
on conflict (key) do nothing;

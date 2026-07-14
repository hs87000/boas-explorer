-- ============================================================
-- Lecture de l'historique (audit_log) reservee a l'admin.
--
-- La table audit_log est alimentee automatiquement par les triggers
-- sur tools et site_content : ce fichier ne touche PAS a l'ecriture.
-- Il garantit seulement que :
--   1. RLS est active sur audit_log (comme sur toutes les tables) ;
--   2. seul un compte present dans la table "admins" (via is_admin())
--      peut LIRE l'historique — un visiteur ou une session anonyme
--      recoit une liste vide.
--
-- A executer dans l'editeur SQL du dashboard Supabase UNIQUEMENT si
-- l'onglet "Historique" de l'administration reste vide alors que des
-- modifications ont bien ete faites (signe qu'aucune policy de lecture
-- n'existe encore). Reexecutable sans risque (drop + create).
--
-- Test attendu (regle des 2 angles, cf. CLAUDE.md) :
--   - navigation privee SANS connexion admin -> l'appel REST
--     /rest/v1/audit_log renvoie []                        (rejete)
--   - connecte en admin -> l'onglet Historique liste les entrees (accepte)
-- ============================================================

alter table public.audit_log enable row level security;

drop policy if exists "lecture admin uniquement" on public.audit_log;

create policy "lecture admin uniquement"
  on public.audit_log for select
  to authenticated
  using ((select public.is_admin()));

-- Aucune policy insert/update/delete : personne ne peut ecrire dans
-- audit_log via l'API. Seuls les triggers (executes cote base) le font.

-- ============================================================
-- Restreint les ecritures sur "tools" et "site_content" au SEUL compte
-- admin (au lieu de "n'importe quel compte connecte").
--
-- Version 2 : la verification passe par public.is_admin() (fonction cote
-- base, qui consulte la table "admins") au lieu d'un UUID ecrit en dur
-- dans les policies. Avantage : changer ou ajouter un admin se fait en
-- modifiant la table "admins", plus besoin de reecrire ce fichier.
--
-- Pourquoi ce verrou existe : pour que les connexions anonymes marchent,
-- il faut aussi activer "Allow new users to sign up" (les deux reglages
-- sont lies cote Supabase). Or sans ce verrou, les policies disent
-- "to authenticated using (true)" = n'importe quel compte connecte peut
-- modifier les rangs/legendes. Des que n'importe qui peut s'auto-inscrire
-- par API, ca devient exploitable sans ce verrou.
--
-- A executer dans l'editeur SQL du dashboard Supabase.
-- ============================================================

-- --- tools ---
drop policy if exists "insertion authentifiee" on public.tools;
drop policy if exists "modification authentifiee" on public.tools;
drop policy if exists "suppression authentifiee" on public.tools;
drop policy if exists "insertion admin uniquement" on public.tools;
drop policy if exists "modification admin uniquement" on public.tools;
drop policy if exists "suppression admin uniquement" on public.tools;

create policy "insertion admin uniquement"
  on public.tools for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "modification admin uniquement"
  on public.tools for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "suppression admin uniquement"
  on public.tools for delete
  to authenticated
  using ((select public.is_admin()));

-- --- site_content ---
drop policy if exists "modification authentifiee" on public.site_content;
drop policy if exists "insertion authentifiee" on public.site_content;
drop policy if exists "modification admin uniquement" on public.site_content;
drop policy if exists "insertion admin uniquement" on public.site_content;

create policy "modification admin uniquement"
  on public.site_content for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "insertion admin uniquement"
  on public.site_content for insert
  to authenticated
  with check ((select public.is_admin()));

-- La lecture (select) reste publique et inchangee sur les deux tables.

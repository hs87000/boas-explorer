-- Permet a un compte EDS de lire sa propre ligne (savoir quel hopital 
-- il represente) - necessaire pour l'affichage du role cote front. 
-- Aucune exposition au-dela de sa propre ligne (user_id = auth.uid()).
-- Verifiee en base via pg_policies : 1 ligne, qual = (user_id = auth.uid()).
create policy "lecture de son propre role"
  on public.eds_editors for select
  to authenticated
  using (user_id = auth.uid());
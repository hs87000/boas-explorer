-- Permet a un compte EDS de lire sa propre ligne (savoir quel hopital 
-- il represente) - necessaire pour l'affichage du role cote front. 
-- Aucune exposition au-dela de sa propre ligne (user_id = auth.uid()).
-- Note : cette policy a ete executee directement en base avant creation
-- de ce fichier - documentee ici a posteriori, contenu identique a ce
-- qui tourne reellement (verifie via pg_policies).
create policy "lecture de son propre role"
  on public.eds_editors for select
  to authenticated
  using (user_id = auth.uid());
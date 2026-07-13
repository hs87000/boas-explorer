# BOAS Explorer — Contexte projet

## Quoi
Catalogue interactif d'outils/algorithmes de santé (48 entrées), avec
recherche/filtres/tri, votes publics, et édition admin des classements
(tier, badges Méthodo et EDS par CHU : Limoges, Bordeaux, Poitiers).
Projet de stage (L3 SPS), portfolio/démo, contenu jugé non confidentiel
par l'auteur.

## Stack
- Front : React + Vite + Tailwind, dans `app/`
- Backend : Supabase (PostgreSQL + Auth), pas de serveur applicatif custom
- Pipeline de données : scripts Python dans `data-pipeline/` (docx → JSON,
  usage ponctuel hors-ligne, jamais exécutés par le site)

## Structure des dossiers
- `app/` — l'application React (le site réel)
- `data-pipeline/` — scripts Python + fichiers SQL de schéma/policies
- `legacy/` — ancien prototype `.dc.html` (export Claude Design), conservé
  pour référence de comparaison, plus utilisé activement
- `scraps/`, `screenshots/` — annexes, pas de code

## Principes de sécurité (non négociables)
- RLS activé sur TOUTE nouvelle table, sans exception
- Jamais de secret, clé, ou identifiant utilisateur en dur dans un fichier
  versionné — passer par une table dédiée + fonction `security definer`
  (voir `is_admin()` comme modèle à suivre pour toute nouvelle règle de rôle)
- Ne jamais faire confiance à une donnée fournie par le client comme preuve
  d'identité (leçon du bug de vote initial : un `device_id` généré côté
  client n'est pas une identité ; `auth.uid()` après connexion, même
  anonyme via Supabase, l'est)
- Toute nouvelle policy d'écriture doit être testée sous au moins 2 angles
  avant d'être considérée valide : un utilisateur non autorisé rejeté,
  l'utilisateur autorisé accepté — idéalement testé en conditions réelles
  (appel direct à l'API), pas seulement supposé à partir du code
- `.env` toujours exclu du Git, vérifié via `git status` avant chaque commit

## Workflow établi avec l'auteur
- L'auteur ne code pas lui-même : il comprend et valide l'architecture,
  délègue l'implémentation à Claude Code
- Expliquer le vocabulaire technique en français simple à chaque usage,
  ne pas supposer de notions acquises
- Checkpoint (commit) avant toute opération risquée (migration, refactor
  de structure)
- Jamais de commit sans vérification fonctionnelle préalable
- Sur demande de vérification (`git status`, `git diff`, requête SQL,
  test API) : toujours montrer le résultat brut, jamais un résumé
  reformulé à la place d'une preuve

## Historique des grandes étapes (déjà faites)
1. Conversion du prototype `.dc.html` (Claude Design) vers app React réelle
2. Structuration Git + dépôt GitHub public (`hs87000/boas-explorer`)
3. Migration des données vers Supabase (lecture seule d'abord)
4. Authentification admin + édition de la tier list (`is_admin()`, RLS)
5. Système de votes publics, sécurisé via connexions anonymes Supabase
   (`auth.uid()`), plus aucune confiance dans un `device_id` client
6. Historique des modifications (`audit_log`, alimenté par triggers SQL
   sur `tools` et `site_content`) — en cours de vérification

## Prochaines étapes prévues (dans cet ordre)
1. Rôles multiples : 3 comptes correspondant aux EDS Limoges/Bordeaux/
   Poitiers, chacun ne pouvant modifier que son propre classement —
   schéma exact (colonnes séparées vs table dédiée) à confirmer avant
   de coder quoi que ce soit
2. MFA (TOTP) sur le compte admin principal
3. `npm audit` / `npm audit fix`
4. Audit RLS complet sur toutes les tables (une fois le point 1 en place)
5. Dockerisation (Dockerfile multi-stage) + déploiement (Render ou
   Fly.io) — dernière étape, volontairement repoussée jusqu'à
   architecture stable

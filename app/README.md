# BOAS Explorer — app

Application React qui affiche le catalogue des 48 algorithmes de la [Bibliothèque Ouverte d'Algorithmes en Santé](https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante) (Health Data Hub) — recherche, filtres combinables et tri.

Design : fond clair, accent vert, glassmorphism léger, titre en dégradé animé.

## Stack

- React 18 + Vite 6
- Aucun backend : `src/data/boas_data.json` est la source de vérité, importée directement au build.

## Démarrer

```bash
npm install
npm run dev       # serveur de dev (http://localhost:5173)
npm run build     # build statique -> dist/
npm run preview   # prévisualise le build
```

## Fonctionnalités

- **Recherche** plein texte (nom, résumé, fonctionnement, données d'entrée), tolérante aux accents.
- **Filtres combinables** par chips : statut de validation, langage, type de
  données, domaine médical, objectif, maintenance, type d'auteur.
  Logique **ET** entre catégories, **OU** à l'intérieur d'une catégorie.
  Bouton « Réinitialiser ».
- **Tri** : par rang (S → F) · A → Z · statut (validé d'abord) · dernière mise à jour.
- **Trois vues** : grille de cartes, tableau dense, tier list.
- **Tier list** : classement personnel (S à F) attribué algorithme par algorithme,
  sauvegardé dans `localStorage`.
- **Compteur** de résultats en direct (`X / 48`).
- **Fiche détail** (modale) avec liens « Voir le code » (si dépôt disponible) et
  « Fiche HDH ».

## Déploiement

`vite.config.js` utilise `base: "./"` (chemins relatifs) : le contenu de `dist/`
fonctionne tel quel sur **Netlify**, **GitHub Pages** (y compris sous-dossier) ou
tout hébergement statique.

- **Netlify** : build command `npm run build`, publish directory `dist`.
- **GitHub Pages** : publier le dossier `dist/` (par ex. via GitHub Actions ou la
  branche `gh-pages`).

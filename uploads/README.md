# BOAS Explorer

Site vitrine statique qui catalogue les **48 algorithmes** de la
[Bibliothèque Ouverte d'Algorithmes en Santé](https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante)
(Health Data Hub) — avec recherche, filtres combinables et tri.

Direction visuelle « subnet » : fond quasi-noir, halos néon cyan / violet / rose,
glassmorphism, titre en dégradé animé.

## Stack

- **React 18 + Vite 6 + Tailwind CSS 4**
- `lucide-react` (icônes) · `framer-motion` (animation de la fiche)
- Aucun backend : `src/data/boas_data.json` est la source de vérité, importée directement.

## Démarrer

```bash
npm install
npm run dev       # serveur de dev (http://localhost:5173)
npm run build     # build statique -> dist/
npm run preview   # prévisualise le build
```

## Fonctionnalités

- **Recherche** plein texte (nom + résumé), tolérante aux accents.
- **Filtres combinables** par chips : statut de validation, langage, type de
  données, domaine médical, objectif, maintenance, type d'auteur.
  Logique **ET** entre catégories, **OU** à l'intérieur d'une catégorie.
  Bouton « Réinitialiser ».
- **Tri** : A → Z · statut (validé d'abord) · dernière mise à jour.
- **Bascule de vue** : grille de cartes ↔ tableau dense.
- **Compteur** de résultats en direct (`X / 48`).
- **Fiche détail** (modale accessible : Échap, focus, `aria-*`) avec liens
  « Voir le code » (si dépôt disponible) et « Fiche HDH ».
- **État des filtres dans l'URL** (querystring) pour le partage.
- **Mode clair / sombre** : bascule dans la barre d'outils, préférence
  mémorisée (`localStorage`). Le thème sombre néon reste celui par défaut.

## Déploiement

`vite.config.js` utilise `base: "./"` (chemins relatifs) : le contenu de `dist/`
fonctionne tel quel sur **Netlify**, **GitHub Pages** (y compris sous-dossier) ou
tout hébergement statique.

- **Netlify** : build command `npm run build`, publish directory `dist`.
- **GitHub Pages** : publier le dossier `dist/` (par ex. via GitHub Actions ou la
  branche `gh-pages`).

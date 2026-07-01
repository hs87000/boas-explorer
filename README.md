# BOAS Explorer

Catalogue interactif des 48 algorithmes de la [Bibliothèque Ouverte d'Algorithmes en Santé](https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante) (BOAS), publiée par le Health Data Hub. Le site permet de chercher, filtrer, trier et consulter la fiche détaillée de chaque algorithme.

## Fonctionnalités

- Recherche plein texte (nom, résumé, fonctionnement, données d'entrée), tolérante aux accents.
- Filtres combinables par statut de validation, langage, type de données, domaine médical, objectif, maintenance et type d'auteur.
- Tri par rang, ordre alphabétique, statut de validation ou dernière mise à jour.
- Trois vues : grille de cartes, tableau dense, et tier list (classement personnel S à F, sauvegardé dans le navigateur).
- Fiche détaillée par algorithme : résumé, fonctionnement, limites, critères d'inclusion/exclusion, métadonnées, lien vers le code et vers la fiche officielle du Health Data Hub.

## Structure du dépôt

```
app/             application React (le site actuel)
data-pipeline/   scripts Python qui construisent app/src/data/boas_data.json
                 à partir des documents source (.docx)
legacy/          premier prototype du site, conservé pour référence
```

### `app/`

L'application. Voir [app/README.md](app/README.md) pour la stack technique et les commandes.

### `data-pipeline/`

Le contenu du catalogue vient à l'origine de trois documents Word remplis à la main (liste des outils, mode de fonctionnement, données d'entrée). Les scripts de ce dossier extraient ces documents et les fusionnent dans `app/src/data/boas_data.json`, qui est le fichier réellement utilisé par l'application. Ils ne tournent pas automatiquement : ce sont des outils ponctuels à relancer à la main si les documents source changent.

### `legacy/`

Version précédente du site, écrite sous forme d'un unique fichier HTML. Gardée telle quelle pour pouvoir comparer avec la version actuelle si besoin ; elle n'est plus maintenue.

## Démarrage rapide

```bash
cd app
npm install
npm run dev
```

Le site est alors accessible sur `http://localhost:5173`.

## Source des données

Les données proviennent des jeux de données ouverts du Health Data Hub : [health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante](https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante).

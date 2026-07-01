# Prompt à donner à Claude Code — BOAS Runner (jeu vidéo)

> Jeu autonome, lancé en local, indépendant du site. Avatar qui court sur une bulle pour
> déclencher une équation. 48 bulles (une par outil). Résoudre l'équation = débloquer la fiche.
> Difficulté progressive (collège → lycée). Desktop (clavier/souris). Moteur : Phaser 3.

---

## CONTEXTE
J'ai un dossier local "Site BOAS startup tech" contenant un fichier `boas_data.json` :
un catalogue de 48 algorithmes de santé (Bibliothèque Ouverte d'Algorithmes en Santé /
Health Data Hub). Structure : `{ source, count: 48, tools: [ ... ] }`.
Chaque outil de `tools` possède ces champs :
`id, name, ficheUrl, authorType, objectives[], medicalDomains[], languages[], dataTypes[],
validation, maintenance, summary, dataDescription, context, repoUrl, licence, lastUpdate,
howItWorks, limits, inclusion, exclusion`.

## OBJECTIF
Construis un JEU VIDÉO 2D autonome, "BOAS Runner", qui tourne en LOCAL, INDÉPENDAMMENT
du site existant. Concept : un avatar qui COURT SUR UNE BULLE pour déclencher une équation
de maths. Il y a EXACTEMENT 48 BULLES, une par outil du catalogue. Pour accéder à la
DESCRIPTION (la fiche) d'un outil, le joueur doit RÉSOUDRE l'équation de cette bulle.

## CONTRAINTES TECHNIQUES (non négociables)
1. Moteur : Phaser 3 (dernière v3 stable) chargé via CDN (`<script src=...>`). Pas de build,
   pas de framework lourd, pas de dépendance npm.
2. Le jeu doit se lancer en DOUBLE-CLIC sur `index.html`, sans serveur web.
   => N'utilise PAS `fetch()` sur `boas_data.json` (bloqué en `file://`).
   À la place, génère un fichier `boas_data.js` qui expose les 48 outils en constante
   globale : `window.BOAS_TOOLS = [ ...48 objets... ];`
   Écris un petit script Node (`build_data.js`) qui lit `boas_data.json` et produit
   `boas_data.js`, et exécute-le pour produire le fichier final.
3. Cible : DESKTOP uniquement. Contrôles clavier + souris (flèches ou A/D pour se déplacer,
   Espace pour sauter/monter sur une bulle, Entrée pour valider la réponse, saisie au clavier
   pour taper le résultat). Pas de support tactile requis.
4. Tout en FRANÇAIS.
5. Réutilise l'identité visuelle du site : polices Google "Space Grotesk" (titres) et
   "JetBrains Mono" (chiffres/équations), fond clair `#f6f7f9`, texte `#0f1424`, accent
   moderne. Style propre, original (aucun personnage ni asset sous copyright — dessine
   l'avatar et les bulles avec des formes/graphics Phaser ou des sprites maison simples).

## MÉCANIQUE DE JEU
- Scène principale (hub) : un univers type "océan de données" avec 48 bulles flottantes
  (animation flottement). Chaque bulle porte le N° et le nom court de l'outil + une icône
  cadenas si pas encore résolue.
- Organise les 48 bulles en 3 ZONES de difficulté croissante (16 bulles chacune) :
  Zone 1 = Facile, Zone 2 = Moyen, Zone 3 = Difficile. Difficulté PROGRESSIVE collège → lycée.
- L'avatar se déplace au clavier. Quand il s'approche d'une bulle et appuie sur Espace,
  il SAUTE et SE MET À COURIR SUR LA BULLE (animation de roulement, la bulle tourne sous ses
  pieds). Cette course DÉCLENCHE l'apparition de l'équation (modal/encart).
- Le joueur tape la réponse au clavier et valide avec Entrée :
    * Bonne réponse → la bulle ÉCLATE (animation pop + particules), un son de réussite,
      puis la FICHE de l'outil s'ouvre : `name, summary, howItWorks, limits, languages,
      medicalDomains, validation`, + lien "Voir la fiche officielle" (`ficheUrl`) et `repoUrl`.
      La bulle est marquée RÉSOLUE.
    * Mauvaise réponse → l'avatar rebondit/tombe de la bulle, petite animation d'échec,
      possibilité de réessayer (nouvelle équation du même niveau ou indice).
- Barre de progression 0/48 en haut, + score et combo. Feedback à 16/48, 32/48, 48/48.
- Persistance via localStorage : retenir les bulles déjà résolues et le score (fonctionne
  en `file://`). Bouton "Recommencer" pour réinitialiser.

## GÉNÉRATEUR D'ÉQUATIONS (progressif)
- Génère les équations procéduralement, mais de façon DÉTERMINISTE par bulle (seed = id de
  l'outil) pour qu'une bulle donnée propose toujours la même équation au premier essai.
- Réponses entières ou décimales simples, vérifiables exactement (évite les arrondis flous).
- Niveaux :
    - Zone 1 (Facile / collège) : additions, soustractions, multiplications, divisions
      exactes, fractions simples, petites équations du 1er degré (ex. `3x + 5 = 20`).
    - Zone 2 (Moyen) : équations du 1er degré avec parenthèses, pourcentages, puissances
      simples, systèmes 2x2 faciles.
    - Zone 3 (Difficile / lycée) : 2nd degré à solutions entières, factorisation simple,
      petites dérivées/évaluations, proportionnalité avancée.
- Affiche l'énoncé en JetBrains Mono, bien lisible.

## LIVRABLES (dans un nouveau dossier "BOAS-Runner" à côté de `boas_data.json`)
- `index.html` (Phaser via CDN, lance le jeu)
- `game.js` (toute la logique Phaser : scènes, avatar, bulles, équations, fiches, UI)
- `boas_data.js` (les 48 outils embarqués, généré depuis `boas_data.json`)
- `build_data.js` (script Node de génération de `boas_data.js`)
- `Lancer le jeu.bat` (Windows : ouvre `index.html` dans le navigateur par défaut)
- `README.md` (comment lancer, comment régénérer les données)

## QUALITÉ / VÉRIFICATION (fais-le avant de me rendre la main)
- Vérifie que les 48 bulles existent et correspondent aux 48 ids du JSON (aucun doublon,
  aucun manquant).
- Vérifie que chaque équation a UNE solution exacte et que la validation accepte la bonne
  réponse / rejette les mauvaises (écris un petit test Node qui résout les 48 équations).
- Vérifie que le jeu s'ouvre bien en double-clic (`file://`) sans erreur console et sans
  dépendre d'un serveur.
- Code commenté, lisible, un seul fichier `game.js` bien structuré.

Commence par m'exposer en 5 lignes ton plan (scènes Phaser, structure des bulles, générateur
d'équations), puis code.

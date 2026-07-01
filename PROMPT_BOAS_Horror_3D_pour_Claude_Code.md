# Prompt à donner à Claude Code — BOAS Horror 3D (Godot 4)

> Jeu d'horreur 3D, vue première personne, couloirs sombres "DOOM 1993", 3 portes par niveau,
> 48 niveaux. 1 porte = fiche outil BOAS, 2 portes = jumpscares (CNIL/RGPD + animatronique).
> Moteur : Godot 4 (GDScript). Mauvaise porte = jumpscare puis respawn au niveau courant.
> Bouton Respawn du menu = reset total. Difficulté croissante. Prototype jouable de bout en bout.

---

## CONTEXTE
J'ai un dossier local "Site BOAS startup tech" avec un fichier `boas_data.json` :
catalogue de 48 algorithmes de santé (Bibliothèque Ouverte d'Algorithmes en Santé /
Health Data Hub). Structure : `{ source, count: 48, tools: [ ... ] }`.
Chaque outil possède : `id, name, ficheUrl, authorType, objectives[], medicalDomains[],
languages[], dataTypes[], validation, maintenance, summary, dataDescription, context,
repoUrl, licence, lastUpdate, howItWorks, limits, inclusion, exclusion`.

## OBJECTIF
Crée un VRAI JEU 3D D'HORREUR, à la première personne, avec le moteur **Godot 4** (GDScript).
Ambiance "DOOM 1993" : couloirs sombres, brouillard, lumière vacillante, musique/drone
oppressant. Le joueur avance dans un couloir, puis arrive devant **3 PORTES**. Derrière les
portes : soit la FICHE d'un outil BOAS, soit un JUMPSCARE. **48 NIVEAUX**.

## MOTEUR & CONTRAINTES
- Godot 4.x stable, GDScript uniquement. Projet ouvrable dans l'éditeur Godot et
  exportable en `.exe` Windows. Indique précisément la version de Godot ciblée.
- Charge `boas_data.json` au runtime via `FileAccess` + `JSON.parse` (copie le fichier dans
  `res://data/`). En natif, pas de souci CORS.
- Voix robot : utilise le TTS intégré de Godot (`DisplayServer.tts_get_voices` /
  `tts_speak`) avec un réglage GRAVE et LENT pour un effet robotique. Prévois un repli :
  si aucune voix système n'est dispo, joue `res://audio/voix_rgpd.ogg` (placeholder) et
  documente comment le régénérer.
- Tout en FRANÇAIS.
- Contrôles desktop : ZQSD/WASD pour se déplacer, souris pour regarder, E (ou clic) pour
  ouvrir une porte, Échap pour le menu pause. Capture de la souris en jeu.

## BOUCLE DE JEU (48 niveaux)
- À chaque niveau N (1 → 48) : couloir sombre généré à partir de segments modulaires
  (BoxMesh/CSG), brouillard (`WorldEnvironment`), éclairage faible, une lumière qui clignote,
  sons d'ambiance + pas. Au bout : une salle avec **3 PORTES**.
- Les 3 portes sont placées en positions ALÉATOIRES. EXACTEMENT 1 porte est la "bonne"
  (porte BOAS) ; les 2 autres sont des portes-jumpscare.
- La porte BOAS révèle l'outil N (séquentiel : niveau 1 = tool id 1, …, niveau 48 = tool
  id 48). À l'ouverture : FICHE lisible (`name, summary, howItWorks, limits, languages,
  medicalDomains, validation`) + liens `ficheUrl` et `repoUrl`. Bouton "Continuer" → niveau N+1.
- **DIFFICULTÉ CROISSANTE** sur le mix des 2 portes-jumpscare et les indices :
    - Niveaux 1–16 (facile) : un INDICE subtil guide vers la bonne porte (légère lueur /
      murmure / porte légèrement différente). Scares surtout type "CNIL" (modéré).
    - Niveaux 17–32 (moyen) : l'indice s'estompe. Mix 50/50 scare CNIL / scare animatronique.
    - Niveaux 33–48 (difficile) : aucun indice. Portes-scares surtout le gros jumpscare
      animatronique, plus long et plus intense.

## LES DEUX JUMPSCARES
1. **Scare "CNIL/RGPD" (modéré)** : un LOGO STYLISÉ D'AUTORITÉ DE PROTECTION DES DONNÉES
   (ORIGINAL, inventé — NE COPIE PAS le logo officiel de la CNIL) surgit en plein écran,
   tremblement de caméra, et une VOIX ROBOT dit : « Vous avez violé le RGPD. » Flash + stinger.
2. **Scare animatronique (intense, dans le STYLE FNAF mais 100% ORIGINAL** — n'utilise AUCUN
   personnage/asset FNAF existant) : un visage d'animatronique original jaillit en plein
   écran, son très fort, secousse, durée plus longue aux niveaux avancés.

Quand le joueur ouvre une porte-jumpscare : le jumpscare joue, PUIS il RESPAWN au DÉBUT DU
NIVEAU ACTUEL (progression globale conservée — il réessaie ce niveau).

## MENU & PROGRESSION
- Écran-titre + MENU avec un **DISCLAIMER obligatoire** à valider avant de jouer :
  avertissement jumpscares / sons forts / photosensibilité, mention que c'est une FICTION
  parodique sans aucun lien avec la vraie CNIL, et que tous les visuels sont originaux.
- Bouton "RESPAWN" dans le menu : remet TOUTE la progression à zéro (retour niveau 1).
- Affiche le niveau courant (N/48) et un compteur de scares subis. Niveau 48 réussi → écran
  de fin / crédits.
- Sauvegarde la progression dans `user://` (le bouton Respawn efface cette sauvegarde).

## FINITION v1 (prototype jouable de bout en bout)
- Géométrie en primitives 3D + matériaux sombres + brouillard + post-process pour l'ambiance.
  Pas besoin de modèles détaillés pour la v1 : emplacements clairs pour remplacer les
  placeholders plus tard.
- Audio : drone d'ambiance en boucle, pas, grincement de porte, 2 stingers de jumpscare.
  Placeholders (ou génère-les) + doc pour les remplacer.
- Logo "autorité" et visage animatronique : images placeholder ORIGINALES (dessinées/
  générées), aucune IP de tiers.

## ARBORESCENCE ATTENDUE (nouveau dossier "BOAS-Horror" à côté de `boas_data.json`)
- `project.godot`
- `autoload/GameState.gd` (niveau courant, progression, RNG, reset, sauvegarde `user://`)
- `scenes/MainMenu.tscn` (+ disclaimer)
- `scenes/Level.tscn` (couloir + salle aux 3 portes)
- `scenes/Jumpscare_CNIL.tscn`, `scenes/Jumpscare_Animatronic.tscn`
- `scenes/Fiche.tscn` (UI fiche outil BOAS)
- `scripts/Player.gd` (contrôleur FPS), `scripts/Door.gd`, `scripts/LevelManager.gd`,
  `scripts/JumpscareManager.gd`
- `data/boas_data.json` (copié)
- `audio/` (placeholders + `voix_rgpd.ogg` de repli)
- `assets/` (`logo_autorite.png`, `animatronic.png` placeholders originaux)
- `README.md` : version de Godot, comment ouvrir le projet, jouer, et exporter le `.exe`.

## QUALITÉ / VÉRIFICATION (avant de me rendre la main)
- Vérifie que les 48 niveaux mappent bien les 48 ids du JSON (aucun manquant/doublon).
- Vérifie qu'il y a toujours exactement 1 porte BOAS par niveau, et que le mix des scares
  suit la courbe de difficulté.
- Vérifie qu'ouvrir une mauvaise porte déclenche le jumpscare puis respawn au niveau courant
  sans perte de progression, et que le bouton Respawn du menu remet bien à zéro.
- Vérifie que le projet s'ouvre dans Godot 4 sans erreur de script (liste les erreurs si tu
  ne peux pas lancer l'éditeur) et que le disclaimer s'affiche avant le jeu.
- Code commenté et organisé.

D'abord, expose-moi en ~8 lignes ton plan (autoloads, scènes, contrôleur FPS, génération de
couloir, système de portes/difficulté, système de jumpscare, TTS). Ensuite, code le projet.

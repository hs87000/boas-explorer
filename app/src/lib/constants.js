export const ACCENT = "#059669";
export const DENSITY = "Confortable"; // "Confortable" | "Compact"

export const ROT_WORDS = [
  "de la santé publique",
  "du diabète",
  "de l'oncologie",
  "des données OMOP",
  "de l'épidémiologie",
  "du SNDS",
];

export const FACET_DEFS = [
  { key: "validation", label: "Statut", field: "validation", multi: false, fixed: ["Validé", "Non validé", "En cours de validation", "Non précisé"] },
  { key: "languages", label: "Langage", field: "languages", multi: true, fixed: ["Python", "SAS", "SQL", "R", "Spark", "Autre"] },
  { key: "dataTypes", label: "Type de données", field: "dataTypes", multi: true },
  { key: "medicalDomains", label: "Domaine médical", field: "medicalDomains", multi: true },
  { key: "objectives", label: "Objectif", field: "objectives", multi: true },
  { key: "maintenance", label: "Maintenance", field: "maintenance", multi: false },
  { key: "authorType", label: "Type d'auteur", field: "authorType", multi: false },
];

export const ADVANCED_KEYS = ["dataTypes", "medicalDomains", "objectives", "maintenance", "authorType"];

export const VAL_ORDER = { "Validé": 0, "En cours de validation": 1, "Non validé": 2, "Non précisé": 3 };

export const LANG_COUNT = 6;

// Tier list : rangs attribués à la main (S = meilleur). Couleurs vives, texte foncé.
export const TIERS = [
  { key: "S", color: "#f43f5e" },
  { key: "A", color: "#fb923c" },
  { key: "B", color: "#eab308" },
  { key: "C", color: "#10b981" },
  { key: "D", color: "#0ea5e9" },
  { key: "F", color: "#8b5cf6" },
];

export const TIER_ORDER = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5 };

// Les Entrepôts de Données de Santé qui publient un classement.
// field = nom du champ côté front, letter = lettre du segment sur le badge.
export const EDS_LIST = [
  { key: "limoges", label: "EDS Limoges", letter: "L", field: "tier" },
  { key: "bordeaux", label: "EDS Bordeaux", letter: "B", field: "tierBordeaux" },
  { key: "poitiers", label: "EDS Poitiers", letter: "P", field: "tierPoitiers" },
];

// Classement Méthodo : qualité de la méthodologie / documentation (badge à part).
export const METHODO = { key: "methodo", label: "Méthodo", letter: "M", field: "tierMethodo" };

// Tous les classements éditables par l'admin (ordre d'affichage).
export const RANKINGS = [METHODO, ...EDS_LIST];

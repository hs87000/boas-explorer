// Script PONCTUEL : importe les 48 outils de src/data/boas_data.json
// dans la table "tools" de Supabase.
//
// La table est protegee en ecriture (RLS), la cle publique ne suffit donc pas :
// il faut la cle SECRETE du projet (Dashboard -> Project Settings -> API keys,
// cle "secret" / service_role, format sb_secret_...). Ne jamais la committer.
//
// Usage (PowerShell, depuis le dossier app/) :
//   $env:SUPABASE_SECRET_KEY = "sb_secret_..." ; node scripts/import-supabase.mjs
//
// Usage (bash) :
//   SUPABASE_SECRET_KEY="sb_secret_..." node scripts/import-supabase.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(dirname(fileURLToPath(import.meta.url)), "..");

// URL du projet : lue dans app/.env (pas de dependance dotenv pour un script ponctuel)
const env = readFileSync(join(appDir, ".env"), "utf8");
const url = env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) {
  console.error("VITE_SUPABASE_URL introuvable dans app/.env");
  process.exit(1);
}

const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!secretKey) {
  console.error("Variable SUPABASE_SECRET_KEY manquante (cle secrete du projet, voir l'en-tete de ce script).");
  process.exit(1);
}

const { tools } = JSON.parse(readFileSync(join(appDir, "src", "data", "boas_data.json"), "utf8"));
console.log(`${tools.length} outils lus depuis boas_data.json`);

// camelCase (JSON) -> snake_case (colonnes Postgres)
const rows = tools.map((t) => ({
  id: t.id,
  name: t.name,
  fiche_url: t.ficheUrl || null,
  author_type: t.authorType || null,
  objectives: t.objectives || [],
  medical_domains: t.medicalDomains || [],
  languages: t.languages || [],
  data_types: t.dataTypes || [],
  validation: t.validation || null,
  maintenance: t.maintenance || null,
  summary: t.summary || null,
  data_description: t.dataDescription || null,
  context: t.context || null,
  repo_url: t.repoUrl || null,
  licence: t.licence || null,
  last_update: t.lastUpdate || null,
  how_it_works: t.howItWorks || null,
  limits: t.limits || null,
  inclusion: t.inclusion || null,
  exclusion: t.exclusion || null,
  input_data: t.inputData || null,
  tier_limoges: null, // aucun outil classe au depart
}));

const supabase = createClient(url, secretKey);

// upsert : le script peut etre relance sans creer de doublons (cle = id)
const { error, count } = await supabase
  .from("tools")
  .upsert(rows, { onConflict: "id", count: "exact" });

if (error) {
  console.error("Echec de l'import :", error.message);
  process.exit(1);
}
console.log(`Import termine : ${count ?? rows.length} lignes dans la table tools.`);

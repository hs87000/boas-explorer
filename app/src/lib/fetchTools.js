import { supabase } from "./supabase";
import fallbackData from "../data/boas_data.json";

// Alias PostgREST "nomJs:colonne_sql" : les objets renvoyes par Supabase ont
// exactement la meme forme que ceux de boas_data.json, le reste de l'app ne
// voit aucune difference.
export const SELECT = [
  "id",
  "name",
  "ficheUrl:fiche_url",
  "authorType:author_type",
  "objectives",
  "medicalDomains:medical_domains",
  "languages",
  "dataTypes:data_types",
  "validation",
  "maintenance",
  "summary",
  "dataDescription:data_description",
  "context",
  "repoUrl:repo_url",
  "licence",
  "lastUpdate:last_update",
  "howItWorks:how_it_works",
  "limits",
  "inclusion",
  "exclusion",
  "inputData:input_data",
  "tier",
  "tierBordeaux:tier_bordeaux",
  "tierPoitiers:tier_poitiers",
  "tierMethodo:tier_methodo",
  "methodoJustification:methodo_justification",
].join(", ");

// Charge les outils depuis Supabase.
// - Client non configure (.env absent, ex. fork du repo) : JSON local embarque.
// - Table vide (import pas encore fait) : JSON local aussi.
// - Echec reseau / service indisponible : leve une erreur, c'est a l'appelant
//   d'afficher l'etat d'erreur (pas de repli silencieux, l'utilisateur doit savoir).
export async function fetchTools() {
  if (!supabase) {
    console.warn("[BOAS] Supabase non configure, utilisation du JSON local");
    return fallbackData.tools || [];
  }
  const { data, error } = await supabase.from("tools").select(SELECT).order("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    console.warn("[BOAS] Table tools vide, utilisation du JSON local (import a faire ?)");
    return fallbackData.tools || [];
  }
  return data;
}

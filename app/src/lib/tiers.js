import { supabase } from "./supabase";

// Colonne SQL correspondant a chaque EDS.
const COLUMN_BY_EDS = {
  limoges: "tier_limoges",
  bordeaux: "tier_bordeaux",
  poitiers: "tier_poitiers",
  methodo: "tier_methodo",
};

// Enregistre le rang officiel d'un outil pour un EDS donne (admin connecte
// uniquement, RLS). tier : "S".."F" ou null pour retirer le classement.
// .select() apres l'update : si la ligne ne revient pas, le RLS a refuse
// en silence (session expiree ?) et on le signale comme un echec.
export async function saveTier(toolId, edsKey, tier) {
  const column = COLUMN_BY_EDS[edsKey];
  if (!supabase || !column) return { ok: false };
  const { data, error } = await supabase
    .from("tools")
    .update({ [column]: tier })
    .eq("id", toolId)
    .select("id");
  if (error || !data || data.length === 0) {
    if (error) console.warn("[BOAS] Rang non enregistre :", error.message);
    return { ok: false };
  }
  return { ok: true };
}

import { supabase } from "./supabase";

// Enregistre le rang officiel d'un outil (admin connecte uniquement, RLS).
// tier : "S".."F" ou null pour retirer le classement.
// .select() apres l'update : si la ligne ne revient pas, le RLS a refuse
// en silence (session expiree ?) et on le signale comme un echec.
export async function saveTier(toolId, tier) {
  if (!supabase) return { ok: false };
  const { data, error } = await supabase
    .from("tools")
    .update({ tier })
    .eq("id", toolId)
    .select("id");
  if (error || !data || data.length === 0) {
    if (error) console.warn("[BOAS] Rang non enregistre :", error.message);
    return { ok: false };
  }
  return { ok: true };
}

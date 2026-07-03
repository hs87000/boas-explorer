import { supabase } from "./supabase";

// Textes des cases de legende au-dessus du catalogue (table site_content).
// Valeurs de repli si la table n'existe pas encore ou si le reseau echoue :
// les cases s'affichent toujours.
export const LEGEND_DEFAULTS = {
  legend_votes: "Donnez votre avis : ▲ si l'outil vous paraît utile, ▼ sinon. Un vote par appareil, modifiable à tout moment.",
  legend_eds: "Le segment L du badge indique le rang officiel attribué par l'équipe de l'Entrepôt de Données de Santé du CHU de Limoges, de S (référence) à F.",
  legend_eds_bordeaux: "Le segment B du badge indique le rang attribué par l'équipe de l'Entrepôt de Données de Santé du CHU de Bordeaux, de S (référence) à F.",
  legend_eds_poitiers: "Le segment P du badge indique le rang attribué par l'équipe de l'Entrepôt de Données de Santé du CHU de Poitiers, de S (référence) à F.",
};

export async function fetchLegends() {
  if (!supabase) return { ...LEGEND_DEFAULTS };
  try {
    const { data, error } = await supabase.from("site_content").select("key, body");
    if (error || !data || data.length === 0) {
      if (error) console.warn("[BOAS] Legendes indisponibles :", error.message);
      return { ...LEGEND_DEFAULTS };
    }
    return { ...LEGEND_DEFAULTS, ...Object.fromEntries(data.map((r) => [r.key, r.body])) };
  } catch (e) {
    console.warn("[BOAS] Legendes indisponibles :", e && e.message);
    return { ...LEGEND_DEFAULTS };
  }
}

// Enregistre une legende (admin connecte uniquement, RLS).
// .select() apres l'upsert : si rien ne revient, l'ecriture a ete refusee.
export async function saveLegend(key, body) {
  if (!supabase) return { ok: false };
  const { data, error } = await supabase
    .from("site_content")
    .upsert({ key, body, updated_at: new Date().toISOString() })
    .select("key");
  if (error || !data || data.length === 0) {
    if (error) console.warn("[BOAS] Legende non enregistree :", error.message);
    return { ok: false };
  }
  return { ok: true };
}

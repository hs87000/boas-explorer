import { supabase } from "./supabase";

// Role d'edition de l'utilisateur connecte, determine cote base :
//   { admin: true,  hopital: null }        -> compte admin : tout editable
//   { admin: false, hopital: "bordeaux" }  -> compte EDS : sa colonne
//   { admin: false, hopital: null }        -> aucun droit d'edition connu
//
// IMPORTANT : ce role ne sert qu'a l'AFFICHAGE (montrer ou non les menus
// d'edition). La vraie barriere est cote base : trigger + policies RLS
// qui n'acceptent que les ecritures autorisees. Meme si ce role etait
// falsifie cote client, la base rejetterait les ecritures hors droits.
// Regle UNIQUE du droit d'edition d'une colonne de classement : l'admin
// peut tout, un compte EDS peut seulement sa colonne. Utilisee par
// l'editeur admin (TierEditor) ET les badges cliquables du site public,
// pour que les deux ecrans racontent exactement la meme chose.
export function canEditRanking(role, edsKey) {
  return !!role && (role.admin || role.hopital === edsKey);
}

export async function fetchEditorRole(userId) {
  if (!supabase || !userId) return { admin: false, hopital: null };

  const [adminRes, edsRes] = await Promise.all([
    supabase.rpc("is_admin"),
    supabase.from("eds_editors").select("hopital").eq("user_id", userId).limit(1),
  ]);

  const admin = adminRes.data === true;
  // Normalisation defensive : la comparaison avec les cles d'EDS du front
  // ("limoges", "bordeaux", "poitiers") se fait en minuscules.
  const raw = edsRes.data?.[0]?.hopital;
  const hopital = typeof raw === "string" ? raw.trim().toLowerCase() : null;
  return { admin, hopital };
}

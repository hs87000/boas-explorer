import { useEffect, useState } from "react";
import { isAdminSession } from "./useSession";
import { fetchEditorRole } from "../lib/roles";

// Role d'edition attache a la session courante (voir lib/roles.js) :
// - undefined : pas de session reelle, ou verification en cours
// - objet     : { admin, hopital } determine cote base (is_admin() +
//               lecture de eds_editors)
// Partage entre l'espace admin (AdminPage) et le site public (App),
// pour que les deux utilisent exactement la meme donnee de role.
// Confort d'AFFICHAGE uniquement : la vraie barriere est cote base
// (trigger + policies RLS), meme un role falsifie ne permettrait pas
// d'ecrire hors droits.
export default function useEditorRole(session) {
  const [role, setRole] = useState(undefined);
  const admin = isAdminSession(session);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!admin || !userId) { setRole(undefined); return; }
    let cancelled = false;
    fetchEditorRole(userId).then((r) => { if (!cancelled) setRole(r); });
    return () => { cancelled = true; };
  }, [admin, userId]);

  return role;
}

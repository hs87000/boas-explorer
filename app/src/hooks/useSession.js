import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Session Supabase courante.
// - undefined : verification en cours (au premier rendu)
// - null      : pas de session (Supabase non configure, ou connexion anonyme
//               impossible — voir avertissement console)
// - objet     : session active (persistee en localStorage par supabase-js,
//               donc conservee au rechargement de la page). Peut etre soit
//               une session ADMIN reelle (email/mot de passe), soit une
//               session ANONYME silencieuse creee pour permettre de voter
//               (session.user.is_anonymous === true dans ce cas) : voir
//               isAdminSession() ci-dessous pour la difference.
//
// Au tout premier chargement (aucune session du tout, ni admin ni anonyme),
// on cree automatiquement une session anonyme : c'est elle qui fournit
// l'auth.uid() verifie utilise par cast_vote/remove_vote (lib/votes.js),
// a la place d'un identifiant invente par le client.
export default function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setSession(data.session);
        return;
      }
      // Aucune session (premiere visite, ou storage vide) : connexion
      // anonyme silencieuse, sans aucun formulaire pour le visiteur.
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (cancelled) return;
      if (error) {
        console.warn("[BOAS] Connexion anonyme impossible (les votes ne fonctionneront pas) :", error.message);
        setSession(null);
        return;
      }
      setSession(anon.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!cancelled) setSession(s ?? null);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return session;
}

// Purement cosmetique (decide juste quoi AFFICHER : l'editeur ou le
// formulaire de connexion) — ne verifie plus un compte precis. La vraie
// barriere est desormais cote base : les policies RLS de tools/site_content
// appellent public.is_admin() (qui consulte la table "admins"), voir
// data-pipeline/restrict_admin_writes.sql. Meme si ce check front etait
// contourne ou mal renseigne, un compte non-admin verrait l'interface mais
// tout INSERT/UPDATE serait quand meme rejete par la base.
export function isAdminSession(session) {
  return !!session && !!session.user && session.user.is_anonymous !== true;
}

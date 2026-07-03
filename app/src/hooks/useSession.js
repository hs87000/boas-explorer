import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Session Supabase courante.
// - undefined : verification en cours (au premier rendu)
// - null      : personne n'est connecte
// - objet     : session active (persistee en localStorage par supabase-js,
//               donc conservee au rechargement de la page)
export default function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return session;
}

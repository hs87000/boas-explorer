import { useState } from "react";
import { supabase } from "../../lib/supabase";
import useSession, { isAdminSession } from "../../hooks/useSession";
import LoginForm from "./LoginForm";
import TierEditor from "./TierEditor";

export default function AdminPage() {
  const session = useSession();
  // Tout visiteur a desormais une session (anonyme, pour voter) : il ne
  // faut PAS montrer l'editeur a une session anonyme, seulement a une
  // vraie connexion email/mot de passe.
  const admin = isAdminSession(session);
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    // useSession recoit l'evenement et l'ecran repasse au formulaire de connexion.
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 28px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 72, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(140deg, #10b981, #059669)", display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(16,185,129,.35)" }}>
              <div style={{ width: 11, height: 11, borderRadius: 3, background: "#fff" }} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-.01em" }}>
              BOAS<span style={{ color: "#059669" }}>.</span>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#b45309", padding: "4px 9px", border: "1px solid #fde68a", borderRadius: 999, background: "#fffbeb" }}>
              Administration
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#/" style={{ fontSize: 13.5, color: "#475467", textDecoration: "none", fontWeight: 500 }}>
              ← Retour au site
            </a>
            {admin && (
              <>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#98a2b3" }}>
                  {session.user?.email}
                </span>
                <button
                  onClick={signOut}
                  disabled={signingOut}
                  style={{ height: 36, border: "1px solid #e1e4ea", borderRadius: 10, background: "#fff", padding: "0 14px", fontSize: 13, color: "#475467", fontFamily: "inherit", cursor: "pointer", fontWeight: 500 }}
                >
                  {signingOut ? "Déconnexion…" : "Se déconnecter"}
                </button>
              </>
            )}
          </div>
        </nav>

        {!supabase ? (
          <p style={{ textAlign: "center", padding: "80px 20px", color: "#667085" }}>
            Administration indisponible : Supabase n'est pas configuré (fichier .env manquant).
          </p>
        ) : session === undefined ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#667085", fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>
            Vérification de la session…
          </div>
        ) : admin ? (
          <TierEditor />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

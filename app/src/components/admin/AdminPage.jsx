import { useState } from "react";
import { supabase } from "../../lib/supabase";
import useSession, { isAdminSession } from "../../hooks/useSession";
import useHashRoute from "../../hooks/useHashRoute";
import useEditorRole from "../../hooks/useEditorRole";
import LoginForm from "./LoginForm";
import TierEditor from "./TierEditor";
import AuditLog from "./AuditLog";

// Onglets internes de l'administration : classements (#/admin) et
// historique des modifications (#/admin/historique). Simples liens hash,
// visibles uniquement une fois connecte en admin.
const ADMIN_TABS = [
  { key: "classements", label: "Classements", href: "#/admin" },
  { key: "historique", label: "Historique", href: "#/admin/historique" },
];

function AdminTabs({ active }) {
  return (
    <div style={{ display: "flex", gap: 8, margin: "4px 0 22px" }}>
      {ADMIN_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <a
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "inline-flex", alignItems: "center", height: 34, padding: "0 16px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
              fontFamily: "inherit",
              color: isActive ? "#fff" : "#475467",
              background: isActive ? "linear-gradient(140deg, #10b981, #059669)" : "#fff",
              border: isActive ? "1px solid transparent" : "1px solid #e1e4ea",
              boxShadow: isActive ? "0 6px 16px rgba(16,185,129,.25)" : "none",
            }}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const session = useSession();
  const hash = useHashRoute();
  const tab = hash.startsWith("#/admin/historique") ? "historique" : "classements";

  // Tout visiteur a desormais une session (anonyme, pour voter) : il ne
  // faut PAS montrer l'editeur a une session anonyme, seulement a une
  // vraie connexion email/mot de passe.
  const admin = isAdminSession(session);
  const [signingOut, setSigningOut] = useState(false);

  // Role d'edition (admin complet ou compte EDS limite a sa colonne),
  // determine cote base au chargement de la session — hook partage avec
  // le site public (App), voir hooks/useEditorRole.js.
  const role = useEditorRole(session);

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
          role === undefined ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#667085", fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>
              Vérification des droits…
            </div>
          ) : (
            <>
              <AdminTabs active={tab} />
              {tab === "historique" ? <AuditLog /> : <TierEditor role={role} />}
            </>
          )
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}

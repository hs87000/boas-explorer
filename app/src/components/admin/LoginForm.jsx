import { useState } from "react";
import { supabase } from "../../lib/supabase";

const LABEL = { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3", display: "block", marginBottom: 6 };
const INPUT = { width: "100%", height: 42, border: "1px solid #e1e4ea", borderRadius: 11, background: "#fff", padding: "0 12px", fontSize: 14.5, color: "#0f1424", fontFamily: "inherit", outline: 0, boxSizing: "border-box" };

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (err) {
      // Message volontairement generique : ne revele pas si c'est l'email
      // ou le mot de passe qui est faux.
      setError(/invalid login credentials/i.test(err.message)
        ? "Identifiants incorrects."
        : "Connexion impossible pour le moment. Réessayez plus tard.");
    }
    // En cas de succes, useSession recoit la session et AdminPage bascule tout seul.
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, padding: "36px 32px", boxShadow: "0 12px 34px rgba(15,20,36,.07)", animation: "boasPop .3s ease both" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", color: "#0f1424", margin: 0 }}>
        Administration
      </h1>
      <p style={{ color: "#667085", fontSize: 13.5, lineHeight: 1.5, margin: "8px 0 24px" }}>
        Accès réservé. Connectez-vous pour gérer la tier list officielle.
      </p>

      <form onSubmit={onSubmit}>
        <label style={LABEL} htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...INPUT, marginBottom: 16 }}
        />

        <label style={LABEL} htmlFor="admin-password">Mot de passe</label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={INPUT}
        />

        {error && (
          <div role="alert" style={{ marginTop: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "10px 14px", color: "#b91c1c", fontSize: 13.5, animation: "boasFade .2s ease both" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{ marginTop: 22, width: "100%", fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", border: 0, padding: "12px 22px", borderRadius: 11, cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1, boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <a href="#/" style={{ display: "inline-block", marginTop: 20, color: "#667085", fontSize: 13, textDecoration: "none" }}>
        ← Retour au site
      </a>
    </div>
  );
}

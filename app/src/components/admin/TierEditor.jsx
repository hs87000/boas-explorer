import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { SELECT } from "../../lib/fetchTools";
import { TIERS } from "../../lib/constants";
import { statusColor } from "../../lib/boas";

const TIER_COLOR = Object.fromEntries(TIERS.map((t) => [t.key, t.color]));

// Editeur de la tier list OFFICIELLE : chaque changement de menu deroulant
// fait un UPDATE dans la table tools de Supabase (colonne tier).
export default function TierEditor() {
  const [tools, setTools] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const [rows, setRows] = useState({}); // etat d'enregistrement par outil : { [id]: { state, message } }
  const timersRef = useRef({});

  // Chargement direct depuis Supabase (pas de repli JSON ici : on edite la
  // vraie base, pas une copie).
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    supabase.from("tools").select(SELECT).order("id").then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) { setStatus("error"); return; }
      setTools([...data].sort((a, b) => a.name.localeCompare(b.name, "fr")));
      setStatus("ready");
    });
    return () => { cancelled = true; };
  }, [fetchAttempt]);

  useEffect(() => () => Object.values(timersRef.current).forEach(clearTimeout), []);

  const setRow = (id, value) => setRows((r) => ({ ...r, [id]: value }));

  const changeTier = async (tool, rawValue) => {
    const tier = rawValue || null;
    const prev = tool.tier ?? null;
    if (tier === prev) return;

    clearTimeout(timersRef.current[tool.id]);
    setRow(tool.id, { state: "saving" });
    setTools((ts) => ts.map((t) => (t.id === tool.id ? { ...t, tier } : t)));

    // .select() apres l'update : si la ligne revient, l'ecriture a vraiment eu
    // lieu ; si rien ne revient, le RLS l'a refusee en silence (session expiree ?).
    const { data, error } = await supabase.from("tools").update({ tier }).eq("id", tool.id).select("id");

    if (error || !data || data.length === 0) {
      if (error) console.warn("[BOAS admin] UPDATE refuse :", error.message);
      setTools((ts) => ts.map((t) => (t.id === tool.id ? { ...t, tier: prev } : t)));
      setRow(tool.id, { state: "error", message: "Échec de l'enregistrement. Réessayez (session expirée ?)." });
      return;
    }

    setRow(tool.id, { state: "saved" });
    timersRef.current[tool.id] = setTimeout(() => setRow(tool.id, undefined), 2000);
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#667085", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, animation: "boasFade .4s ease both" }}>
        Chargement du catalogue…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, padding: "36px 32px", textAlign: "center", boxShadow: "0 12px 34px rgba(15,20,36,.07)", animation: "boasPop .3s ease both" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#0f1424" }}>
          Impossible de charger le catalogue.
        </div>
        <p style={{ color: "#667085", margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.55 }}>
          Vérifiez votre connexion puis réessayez.
        </p>
        <button
          onClick={() => setFetchAttempt((n) => n + 1)}
          style={{ marginTop: 22, fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", border: 0, padding: "11px 22px", borderRadius: 11, cursor: "pointer", boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
        >
          ↺ Réessayer
        </button>
      </div>
    );
  }

  const ranked = tools.filter((t) => t.tier).length;

  return (
    <div style={{ paddingBottom: 60 }}>
      <p style={{ color: "#667085", fontSize: 13.5, lineHeight: 1.55, maxWidth: "70ch", margin: "0 0 20px" }}>
        Le rang choisi ici est enregistré dans la base et devient le classement officiel.
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#98a2b3", marginLeft: 10 }}>
          {ranked} / {tools.length} classés
        </span>
      </p>

      <div style={{ background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, overflow: "hidden" }}>
        {tools.map((tool) => {
          const row = rows[tool.id];
          return (
            <div key={tool.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderBottom: "1px solid #f1f2f5" }}>
              <span
                aria-hidden="true"
                style={{ width: 22, height: 22, borderRadius: 6, flex: "none", background: tool.tier ? TIER_COLOR[tool.tier] : "#f1f3f6", border: tool.tier ? "1px solid rgba(15,20,36,.14)" : "1px dashed #cbd2dc", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11, color: tool.tier ? "#0f1424" : "#aab2bf" }}
              >
                {tool.tier || "–"}
              </span>

              <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: "#0f1424", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {tool.name}
              </span>

              <span title={tool.validation} style={{ width: 8, height: 8, borderRadius: 999, flex: "none", background: statusColor(tool.validation) }} />

              <span aria-live="polite" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, flex: "none", minWidth: 150, textAlign: "right", color: row?.state === "error" ? "#b91c1c" : row?.state === "saved" ? "#0a8255" : "#98a2b3" }}>
                {row?.state === "saving" && "Enregistrement…"}
                {row?.state === "saved" && "✓ Enregistré"}
                {row?.state === "error" && row.message}
              </span>

              <select
                value={tool.tier ?? ""}
                onChange={(e) => changeTier(tool, e.target.value)}
                disabled={row?.state === "saving"}
                aria-label={`Rang de ${tool.name}`}
                style={{ height: 34, border: "1px solid #e1e4ea", borderRadius: 9, background: "#fff", padding: "0 8px", fontSize: 13, color: "#344054", fontFamily: "inherit", cursor: "pointer", outline: 0, flex: "none" }}
              >
                <option value="">— Non classé</option>
                {TIERS.map((t) => (
                  <option key={t.key} value={t.key}>{t.key}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { SELECT } from "../../lib/fetchTools";
import { EDS_LIST, TIERS } from "../../lib/constants";
import { saveTier } from "../../lib/tiers";
import { statusColor } from "../../lib/boas";

const TIER_COLOR = Object.fromEntries(TIERS.map((t) => [t.key, t.color]));

// Editeur en masse des tier lists OFFICIELLES (Limoges, Bordeaux, Poitiers) :
// un menu deroulant par outil et par EDS, chaque changement fait un UPDATE
// dans la table tools. L'edition est aussi possible directement sur le site.
export default function TierEditor() {
  const [tools, setTools] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [fetchAttempt, setFetchAttempt] = useState(0);
  const [cells, setCells] = useState({}); // etat par "toolId:edsKey" : { state, message }
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

  const setCell = (key, value) => setCells((c) => ({ ...c, [key]: value }));

  const changeTier = async (tool, eds, rawValue) => {
    const tier = rawValue || null;
    const prev = tool[eds.field] ?? null;
    if (tier === prev) return;
    const key = `${tool.id}:${eds.key}`;

    clearTimeout(timersRef.current[key]);
    setCell(key, { state: "saving" });
    setTools((ts) => ts.map((t) => (t.id === tool.id ? { ...t, [eds.field]: tier } : t)));

    const res = await saveTier(tool.id, eds.key, tier);
    if (!res.ok) {
      setTools((ts) => ts.map((t) => (t.id === tool.id ? { ...t, [eds.field]: prev } : t)));
      setCell(key, { state: "error" });
      timersRef.current[key] = setTimeout(() => setCell(key, undefined), 3000);
      return;
    }
    setCell(key, { state: "saved" });
    timersRef.current[key] = setTimeout(() => setCell(key, undefined), 2000);
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

  const rankedCount = (eds) => tools.filter((t) => t[eds.field]).length;

  return (
    <div style={{ paddingBottom: 60 }}>
      <p style={{ color: "#667085", fontSize: 13.5, lineHeight: 1.55, maxWidth: "80ch", margin: "0 0 8px" }}>
        Les rangs choisis ici sont enregistrés dans la base et deviennent les classements officiels.
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#98a2b3", margin: "0 0 20px" }}>
        {EDS_LIST.map((eds) => `${eds.label} : ${rankedCount(eds)}/${tools.length}`).join(" · ")}
      </p>

      <div style={{ background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderBottom: "1px solid #eceef2", background: "#fafbfc", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: "#98a2b3" }}>
          <span style={{ flex: 1 }}>Algorithme</span>
          {EDS_LIST.map((eds) => (
            <span key={eds.key} style={{ width: 96, textAlign: "center", flex: "none" }}>{eds.label.replace("EDS ", "")}</span>
          ))}
        </div>

        {tools.map((tool) => (
          <div key={tool.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 18px", borderBottom: "1px solid #f1f2f5" }}>
            <span style={{ flex: 1, minWidth: 0, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span title={tool.validation} style={{ width: 8, height: 8, borderRadius: 999, flex: "none", background: statusColor(tool.validation) }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f1424", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {tool.name}
              </span>
            </span>

            {EDS_LIST.map((eds) => {
              const key = `${tool.id}:${eds.key}`;
              const cell = cells[key];
              const tier = tool[eds.field] ?? null;
              return (
                <span key={eds.key} style={{ width: 96, flex: "none", display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                  <span
                    aria-hidden="true"
                    title={cell?.state === "error" ? "Échec de l'enregistrement" : undefined}
                    style={{ width: 10, height: 10, borderRadius: 3, flex: "none", background: cell?.state === "error" ? "#ef4444" : cell?.state === "saved" ? "#10b981" : tier ? TIER_COLOR[tier] : "#e8eaef", opacity: cell?.state === "saving" ? 0.4 : 1 }}
                  />
                  <select
                    value={tier ?? ""}
                    onChange={(e) => changeTier(tool, eds, e.target.value)}
                    disabled={cell?.state === "saving"}
                    aria-label={`Rang ${eds.label} de ${tool.name}`}
                    style={{ height: 30, width: 62, border: `1px solid ${cell?.state === "error" ? "#fecaca" : "#e1e4ea"}`, borderRadius: 8, background: "#fff", padding: "0 4px", fontSize: 13, color: "#344054", fontFamily: "inherit", cursor: "pointer", outline: 0 }}
                  >
                    <option value="">—</option>
                    {TIERS.map((t) => (
                      <option key={t.key} value={t.key}>{t.key}</option>
                    ))}
                  </select>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

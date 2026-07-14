import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// Historique des modifications, en lecture seule : affiche les 50 dernieres
// lignes de la table audit_log (alimentee automatiquement par des triggers
// SQL sur tools et site_content — rien n'est ecrit depuis ici).
//
// Chaque ligne contient old_value et new_value : la ligne complete AVANT et
// APRES le changement, en JSON. On ne montre pas tout : on compare les deux
// objets champ par champ et on n'affiche que ce qui a change.

const TABLE_LABELS = {
  tools: "Catalogue",
  site_content: "Textes du site",
};

// Libelle lisible de la ligne touchee : le nom de l'outil pour tools,
// la cle du texte pour site_content, sinon ce qu'on trouve.
function rowLabel(entry) {
  const row = entry.new_value ?? entry.old_value ?? {};
  return row.name ?? row.key ?? row.title ?? (row.id != null ? `#${row.id}` : "");
}

// Liste des champs dont la valeur differe entre l'ancienne et la nouvelle
// version. Comparaison via JSON.stringify : suffisant ici, les valeurs sont
// des types simples (texte, nombre, null) issus de jsonb.
function diffFields(oldValue, newValue) {
  const before = oldValue ?? {};
  const after = newValue ?? {};
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  return keys
    .filter((k) => JSON.stringify(before[k] ?? null) !== JSON.stringify(after[k] ?? null))
    .sort((a, b) => a.localeCompare(b))
    .map((k) => ({ key: k, before: before[k], after: after[k] }));
}

function formatValue(v) {
  if (v === null || v === undefined || v === "") return "vide";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return s.length > 90 ? s.slice(0, 87) + "…" : s;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? "";
  return d.toLocaleString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditLog() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [fetchAttempt, setFetchAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    supabase
      .from("audit_log")
      .select("id, table_name, changed_at, changed_by, old_value, new_value")
      .order("changed_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) { setStatus("error"); return; }
        setEntries(data);
        setStatus("ready");
      });
    return () => { cancelled = true; };
  }, [fetchAttempt]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#667085", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, animation: "boasFade .4s ease both" }}>
        Chargement de l'historique…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 480, margin: "40px auto", background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, padding: "36px 32px", textAlign: "center", boxShadow: "0 12px 34px rgba(15,20,36,.07)", animation: "boasPop .3s ease both" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#0f1424" }}>
          Impossible de charger l'historique.
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

  if (entries.length === 0) {
    return (
      <div style={{ maxWidth: 520, margin: "40px auto", background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, padding: "36px 32px", textAlign: "center", boxShadow: "0 12px 34px rgba(15,20,36,.07)" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#0f1424" }}>
          Aucune modification enregistrée.
        </div>
        <p style={{ color: "#667085", margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.55 }}>
          L'historique se remplit automatiquement à chaque changement de
          classement ou de texte du site.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      <p style={{ color: "#667085", fontSize: 13.5, lineHeight: 1.55, maxWidth: "80ch", margin: "0 0 20px" }}>
        Les {entries.length} dernières modifications, de la plus récente à la plus
        ancienne. Seuls les champs dont la valeur a changé sont affichés.
      </p>

      <div style={{ background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, overflow: "hidden" }}>
        {entries.map((entry) => {
          // Pas de colonne "operation" dans audit_log : on deduit le type
          // d'evenement de la presence/absence des deux versions.
          const kind = entry.old_value == null ? "création" : entry.new_value == null ? "suppression" : "modification";
          const changes = kind === "modification" ? diffFields(entry.old_value, entry.new_value) : [];
          const label = rowLabel(entry);

          return (
            <div key={entry.id} style={{ padding: "13px 18px", borderBottom: "1px solid #f1f2f5" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#475467", padding: "3px 8px", border: "1px solid #e1e4ea", borderRadius: 999, background: "#fafbfc", whiteSpace: "nowrap" }}>
                  {TABLE_LABELS[entry.table_name] ?? entry.table_name}
                </span>
                {kind !== "modification" && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#b45309", padding: "3px 8px", border: "1px solid #fde68a", borderRadius: 999, background: "#fffbeb", whiteSpace: "nowrap" }}>
                    {kind}
                  </span>
                )}
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f1424", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {label}
                </span>
                <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#98a2b3", whiteSpace: "nowrap" }}>
                  {formatDate(entry.changed_at)}
                </span>
              </div>

              {/* UUID brut volontairement temporaire : sera remplace par un
                  nom lisible (Limoges, Bordeaux, Poitiers…) une fois la table
                  des roles EDS en place. */}
              <div style={{ margin: "5px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#98a2b3" }}>
                Modifié par : {entry.changed_by ?? "inconnu"}
              </div>

              {kind === "modification" && (
                changes.length === 0 ? (
                  <div style={{ margin: "7px 0 0", fontSize: 13, color: "#98a2b3" }}>
                    Aucun champ modifié (enregistrement à l'identique).
                  </div>
                ) : (
                  <div style={{ margin: "7px 0 0", display: "grid", gap: 3 }}>
                    {changes.map(({ key, before, after }) => (
                      <div key={key} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.5, color: "#475467", overflowWrap: "anywhere" }}>
                        <span style={{ color: "#0f1424", fontWeight: 600 }}>{key}</span>
                        {" : "}
                        <span style={{ color: "#98a2b3", textDecoration: "line-through" }}>{formatValue(before)}</span>
                        {" → "}
                        <span style={{ color: "#059669", fontWeight: 600 }}>{formatValue(after)}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

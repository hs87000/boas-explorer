import { useState } from "react";
import { EdsSampleBadge } from "./EdsTierBadge";

const CARD = {
  background: "rgba(255,255,255,.7)",
  backdropFilter: "blur(6px)",
  border: "1px solid #e8eaef",
  borderRadius: 16,
  padding: "16px 18px",
};
const TITLE = { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 };
const TITLE_TXT = { fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".06em", color: "#0a8255", fontWeight: 600 };
const BODY = { fontSize: 13.5, lineHeight: 1.55, color: "#475467", margin: 0, textWrap: "pretty", whiteSpace: "pre-wrap" };

// Echantillon statique du widget de vote pour la legende.
function VoteSample() {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", height: 24, borderRadius: 8, overflow: "hidden", border: "1px solid #e8eaef", background: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, flex: "none" }}>
      <span style={{ padding: "0 8px", color: "#0a8255", background: "#ecfdf5", display: "inline-flex", alignItems: "center", height: "100%" }}>▲ 12</span>
      <span style={{ padding: "0 8px", color: "#667085", borderLeft: "1px solid #e8eaef", display: "inline-flex", alignItems: "center", height: "100%" }}>▼ 3</span>
    </span>
  );
}

function LegendCard({ sample, title, contentKey, body, admin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft(body); setEditing(true); };
  const save = async () => {
    if (saving) return;
    setSaving(true);
    const ok = await onSave(contentKey, draft.trim());
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <div style={CARD}>
      <div style={{ ...TITLE, justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {sample}
          <span style={TITLE_TXT}>{title}</span>
        </span>
        {admin && !editing && (
          <button
            onClick={startEdit}
            style={{ border: "1px solid #e1e4ea", borderRadius: 8, background: "#fff", padding: "4px 10px", fontSize: 12, color: "#475467", fontFamily: "inherit", cursor: "pointer", fontWeight: 500 }}
          >
            ✎ Modifier
          </button>
        )}
      </div>

      {editing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            aria-label={`Texte de la légende « ${title} »`}
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e1e4ea", borderRadius: 10, padding: "8px 10px", fontSize: 13.5, lineHeight: 1.5, color: "#0f1424", fontFamily: "inherit", outline: 0, resize: "vertical", background: "#fff" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={save}
              disabled={saving || !draft.trim()}
              style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", border: 0, padding: "7px 14px", borderRadius: 9, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#475467", background: "#fff", border: "1px solid #e1e4ea", padding: "7px 14px", borderRadius: 9, cursor: "pointer" }}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <p style={BODY}>{body}</p>
      )}
    </div>
  );
}

// Les deux cases de legende au-dessus du catalogue : votes du public et
// classement EDS Limoges. Textes charges depuis Supabase, editables en mode admin.
export default function LegendCards({ legends, admin, onSave }) {
  return (
    <section
      aria-label="Légende du catalogue"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, margin: "20px 0 8px", animation: "boasRise .5s ease both" }}
    >
      <LegendCard
        sample={<VoteSample />}
        title="Votes du public"
        contentKey="legend_votes"
        body={legends.legend_votes}
        admin={admin}
        onSave={onSave}
      />
      <LegendCard
        sample={<EdsSampleBadge letter="L" tier="S" />}
        title="Classement EDS Limoges"
        contentKey="legend_eds"
        body={legends.legend_eds}
        admin={admin}
        onSave={onSave}
      />
      <LegendCard
        sample={<EdsSampleBadge letter="B" tier="A" />}
        title="Classement EDS Bordeaux"
        contentKey="legend_eds_bordeaux"
        body={legends.legend_eds_bordeaux}
        admin={admin}
        onSave={onSave}
      />
      <LegendCard
        sample={<EdsSampleBadge letter="P" tier="B" />}
        title="Classement EDS Poitiers"
        contentKey="legend_eds_poitiers"
        body={legends.legend_eds_poitiers}
        admin={admin}
        onSave={onSave}
      />
    </section>
  );
}

import Hoverable from "./Hoverable";
import { badgeStyle, rankBubbleStyle } from "../lib/styles";
import { ACCENT } from "../lib/constants";

const filled = (v) => v != null && String(v).trim() !== "";

export default function ToolModal({ tool, rank, onClose }) {
  const mainFields = [
    { k: "Objectif", v: tool.summary },
    { k: "Données de fonctionnement", v: tool.dataDescription },
    { k: "Données d'entrée", v: tool.inputData },
    { k: "Contexte / source", v: tool.context },
  ].filter((f) => f.v);

  const metaFields = [
    { k: "Domaine médical", v: (tool.medicalDomains || []).join(", ") },
    { k: "Objectif (catégorie)", v: (tool.objectives || []).join(", ") },
    { k: "Type de données", v: (tool.dataTypes || []).join(", ") },
    { k: "Type d'auteur", v: tool.authorType },
    { k: "Maintenance", v: tool.maintenance },
    { k: "Licence", v: tool.licence },
    { k: "Dernière mise à jour", v: tool.lastUpdate },
  ].filter((f) => f.v);

  const enrichFields = [
    { k: "Limites", v: tool.limits },
    { k: "Critères d'inclusion", v: tool.inclusion },
    { k: "Critères d'exclusion", v: tool.exclusion },
  ].filter((f) => filled(f.v));

  const hasHowItWorks = filled(tool.howItWorks);
  const hasEnrich = enrichFields.length > 0;
  const hasRepo = !!tool.repoUrl;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,20,36,.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "6vh 20px 40px", overflowY: "auto", animation: "boasFade .18s ease both" }}
    >
      <div className="boas-scroll" style={{ position: "relative", width: "100%", maxWidth: 720, background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(15,20,36,.3)", padding: 32, animation: "boasPop .22s ease both" }}>
        <Hoverable
          as="button"
          onClick={onClose}
          aria-label="Fermer"
          style={{ position: "absolute", top: 18, right: 18, width: 36, height: 36, borderRadius: 10, border: "1px solid #e6e8ec", background: "#fff", cursor: "pointer", fontSize: 16, color: "#667085", display: "grid", placeItems: "center" }}
          hoverStyle={{ background: "#f5f6f8", color: "#0f1424" }}
        >
          ✕
        </Hoverable>

        <span style={badgeStyle(tool.validation, ACCENT)}>{tool.validation}</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 27, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.15, margin: "14px 50px 0 0", color: "#0f1424", textWrap: "balance" }}>
          {tool.name}
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          {(tool.languages || []).map((lang) => (
            <span key={lang} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 500, color: "#0a8255", background: "#f0fdf6", border: "1px solid #cdeedd", borderRadius: 6, padding: "4px 9px" }}>
              {lang}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px 12px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3" }}>
            Rang · EDS Limoges
          </span>
          <span style={{ ...rankBubbleStyle(rank, 30), cursor: "default" }}>{rank || "–"}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#b0b7c2" }}>
            {rank ? `Classé ${rank}` : "Non classé"}
          </span>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {mainFields.map((field) => (
            <div key={field.k}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3", marginBottom: 6 }}>
                {field.k}
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#344054", textWrap: "pretty" }}>{field.v}</div>
            </div>
          ))}
        </div>

        {hasHowItWorks && (
          <div style={{ marginTop: 22, background: "linear-gradient(135deg, #ecfdf5 0%, #eef6ff 100%)", border: "1px solid #b6ebd4", borderRadius: 16, padding: "18px 20px", boxShadow: "0 10px 26px rgba(16,185,129,.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(140deg, #10b981, #059669)", boxShadow: "0 6px 14px rgba(16,185,129,.35)", display: "grid", placeItems: "center", flex: "none", color: "#fff", fontSize: 13 }}>
                ⚙
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".06em", color: "#0a8255", fontWeight: 600 }}>
                Comment ça marche
              </span>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "#14342a", textWrap: "pretty" }}>{tool.howItWorks}</div>
          </div>
        )}

        {hasEnrich && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {enrichFields.map((field) => (
              <div key={field.k}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3", marginBottom: 6 }}>
                  {field.k}
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#344054", textWrap: "pretty" }}>{field.v}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", background: "#fafbfc", border: "1px solid #eceef2", borderRadius: 14, padding: "18px 20px" }}>
          {metaFields.map((field) => (
            <div key={field.k}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".05em", color: "#a4abb8", marginBottom: 4 }}>
                {field.k}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.4, color: "#344054" }}>{field.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
          {hasRepo && (
            <a
              href={tool.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", textDecoration: "none", padding: "11px 18px", borderRadius: 11, boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
            >
              &lt;/&gt; Voir le code
            </a>
          )}
          <Hoverable
            as="a"
            href={tool.ficheUrl}
            target="_blank"
            rel="noreferrer noopener"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#0f1424", background: "#fff", borderWidth: 1, borderStyle: "solid", borderColor: "#d9dde3", textDecoration: "none", padding: "11px 18px", borderRadius: 11 }}
            hoverStyle={{ borderColor: "#10b981" }}
          >
            Fiche HDH ↗
          </Hoverable>
        </div>
      </div>
    </div>
  );
}

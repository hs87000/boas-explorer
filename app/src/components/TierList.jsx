import { useState } from "react";
import TierItem from "./TierItem";
import { RANKINGS, TIERS } from "../lib/constants";

const CHIP_BASE = {
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 500,
  padding: "6px 13px",
  borderRadius: 999,
  cursor: "pointer",
  transition: "all .14s ease",
  lineHeight: 1.2,
};

// Tier list publique : affiche le classement OFFICIEL de l'EDS selectionne
// (Limoges / Bordeaux / Poitiers). Lecture seule — en mode admin, la bulle
// de rang de chaque outil est cliquable pour classer dans l'EDS affiche.
export default function TierList({ results, ranksByEds, onOpen, votes, onVote, onTierClick }) {
  const [selectedEds, setSelectedEds] = useState("methodo");
  const eds = RANKINGS.find((e) => e.key === selectedEds);
  const ranks = ranksByEds[selectedEds] || {};

  const unrankedItems = results.filter((t) => !ranks[t.id]);
  const allRanked = unrankedItems.length === 0;

  return (
    <div style={{ animation: "boasFade .35s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#0a8255", background: "#ecfdf5", border: "1px solid #b6ebd4", padding: "6px 13px", borderRadius: 999 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10b981", boxShadow: "0 0 0 4px rgba(16,185,129,.18)" }} />
          Classement officiel · {eds.label}
        </span>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }} role="tablist" aria-label="Choisir le classement affiché">
          {RANKINGS.map((e) => (
            <button
              key={e.key}
              role="tab"
              aria-selected={selectedEds === e.key}
              onClick={() => setSelectedEds(e.key)}
              style={
                selectedEds === e.key
                  ? { ...CHIP_BASE, background: "#ecfdf5", border: "1px solid #b6ebd4", color: "#0a8255", fontWeight: 600 }
                  : { ...CHIP_BASE, background: "#fff", border: "1px solid #e4e7ec", color: "#475467" }
              }
            >
              {e.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 13.5, color: "#667085" }}>
          {eds.key === "methodo"
            ? "Classement selon la qualité de la méthodologie et de la documentation (S = meilleur)."
            : `Tier list établie par l'équipe de l'${eds.label} (S = meilleur).`}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TIERS.map((tier) => {
          const items = results.filter((t) => ranks[t.id] === tier.key);
          return (
            <div key={tier.key} style={{ display: "flex", alignItems: "stretch", background: "#fff", border: "1px solid #e8eaef", borderRadius: 16, overflow: "hidden", minHeight: 64 }}>
              <div style={{ flex: "none", width: 74, display: "flex", alignItems: "center", justifyContent: "center", background: tier.color, color: "#0f1424", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26 }}>
                {tier.key}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 8, padding: 11 }}>
                {items.map((tool) => (
                  <TierItem
                    key={tool.id}
                    tool={tool}
                    rank={ranks[tool.id]}
                    onOpen={() => onOpen(tool.id)}
                    vote={votes[tool.id]}
                    onVote={onVote}
                    onTierClick={onTierClick ? (toolId, e) => onTierClick(toolId, selectedEds, e) : undefined}
                  />
                ))}
                {items.length === 0 && (
                  <span style={{ alignSelf: "center", color: "#c2c8d2", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>—</span>
                )}
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", alignItems: "stretch", background: "#fff", border: "1px solid #e8eaef", borderRadius: 16, overflow: "hidden", minHeight: 64 }}>
          <div style={{ flex: "none", width: 74, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f3f6", color: "#98a2b3", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".04em", textAlign: "center", padding: "0 8px" }}>
            Non classé
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 8, padding: 11 }}>
            {unrankedItems.map((tool) => (
              <TierItem
                key={tool.id}
                tool={tool}
                rank={ranks[tool.id]}
                onOpen={() => onOpen(tool.id)}
                vote={votes[tool.id]}
                onVote={onVote}
                onTierClick={onTierClick ? (toolId, e) => onTierClick(toolId, selectedEds, e) : undefined}
              />
            ))}
            {allRanked && (
              <span style={{ alignSelf: "center", color: "#c2c8d2", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                Tout est classé 🎉
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import TierItem from "./TierItem";
import { TIERS } from "../lib/constants";

// Tier list publique : affiche le classement OFFICIEL etabli par l'EDS Limoges
// (colonne tier de la base). Lecture seule — l'edition se fait dans #/admin.
export default function TierList({ results, ranks, onOpen }) {
  const unrankedItems = results.filter((t) => !ranks[t.id]);
  const allRanked = unrankedItems.length === 0;

  return (
    <div style={{ animation: "boasFade .35s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#0a8255", background: "#ecfdf5", border: "1px solid #b6ebd4", padding: "6px 13px", borderRadius: 999 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10b981", boxShadow: "0 0 0 4px rgba(16,185,129,.18)" }} />
          Classement officiel · EDS Limoges
        </span>
        <span style={{ fontSize: 13.5, color: "#667085" }}>
          Tier list établie par l'équipe de l'EDS Limoges (S = meilleur).
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

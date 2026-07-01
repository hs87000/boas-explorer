import Hoverable from "./Hoverable";
import TierItem from "./TierItem";
import { TIERS } from "../lib/constants";

export default function TierList({ results, ranks, onOpen, onRankClick, onClearRanks }) {
  const hasRanked = Object.keys(ranks).length > 0;
  const unrankedItems = results.filter((t) => !ranks[t.id]);
  const allRanked = unrankedItems.length === 0;

  return (
    <div style={{ animation: "boasFade .35s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 13.5, color: "#667085" }}>
          Cliquez sur la bulle{" "}
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 19, height: 19, borderRadius: 5, background: "#f43f5e", color: "#0f1424", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11, verticalAlign: -4 }}>
            S
          </span>{" "}
          d'un algorithme pour lui donner un rang. Les meilleurs remontent.
        </span>
        {hasRanked && (
          <Hoverable
            as="button"
            onClick={onClearRanks}
            style={{ height: 36, borderWidth: 1, borderStyle: "solid", borderColor: "#e1e4ea", borderRadius: 10, background: "#fff", padding: "0 14px", fontSize: 13, color: "#475467", fontFamily: "inherit", cursor: "pointer", fontWeight: 500 }}
            hoverStyle={{ borderColor: "#d0d5dd", color: "#0f1424" }}
          >
            ↺ Vider les rangs
          </Hoverable>
        )}
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
                    onRankClick={(e) => onRankClick(tool.id, e)}
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
                onRankClick={(e) => onRankClick(tool.id, e)}
                rankAriaLabel="Donner un rang"
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

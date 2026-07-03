import Hoverable from "./Hoverable";
import { badgeStyle } from "../lib/styles";
import { ACCENT } from "../lib/constants";
import VoteWidget from "./VoteWidget";

const GRID_COLS = "2.2fr 1fr 1fr 1.2fr 0.8fr 1fr";

export default function ResultsTable({ results, onOpen, votes, onVote }) {
  return (
    <div className="boas-scroll" style={{ background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, overflow: "hidden", animation: "boasFade .35s ease both" }}>
      <div style={{ display: "grid", gridTemplateColumns: GRID_COLS, gap: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", color: "#98a2b3", background: "#fafbfc", borderBottom: "1px solid #eceef2", padding: "0 4px" }}>
        <div style={{ padding: "13px 16px" }}>Algorithme</div>
        <div style={{ padding: "13px 12px" }}>Statut</div>
        <div style={{ padding: "13px 12px" }}>Langages</div>
        <div style={{ padding: "13px 12px" }}>Domaine</div>
        <div style={{ padding: "13px 12px" }}>MàJ</div>
        <div style={{ padding: "13px 12px" }}>Votes</div>
      </div>

      {results.map((tool) => (
        <Hoverable
          key={tool.id}
          as="div"
          onClick={() => onOpen(tool.id)}
          tabIndex={0}
          role="button"
          style={{ display: "grid", gridTemplateColumns: GRID_COLS, gap: 0, borderBottom: "1px solid #f1f2f5", cursor: "pointer", alignItems: "center", padding: "0 4px" }}
          hoverStyle={{ background: "#f6fdf9" }}
        >
          <div style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14, color: "#0f1424" }}>{tool.name}</div>
          <div style={{ padding: "14px 12px" }}>
            <span style={badgeStyle(tool.validation, ACCENT)}>{tool.validation}</span>
          </div>
          <div style={{ padding: "14px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0a8255" }}>
            {(tool.languages || []).join(" · ")}
          </div>
          <div style={{ padding: "14px 12px", fontSize: 13, color: "#5a6473" }}>
            {(tool.medicalDomains && tool.medicalDomains[0]) || "—"}
          </div>
          <div style={{ padding: "14px 12px", fontSize: 12.5, color: "#98a2b3", fontFamily: "'JetBrains Mono', monospace" }}>
            {tool.lastUpdate || "—"}
          </div>
          <div style={{ padding: "10px 12px" }}>
            <VoteWidget
              toolName={tool.name}
              up={votes[tool.id]?.up ?? 0}
              down={votes[tool.id]?.down ?? 0}
              myVote={votes[tool.id]?.mine ?? null}
              saving={votes[tool.id]?.saving ?? false}
              error={votes[tool.id]?.error ?? false}
              onVote={(value) => onVote(tool.id, value)}
            />
          </div>
        </Hoverable>
      ))}
    </div>
  );
}

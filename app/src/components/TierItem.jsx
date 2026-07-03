import Hoverable from "./Hoverable";
import { rankBubbleStyle } from "../lib/styles";
import { statusColor } from "../lib/boas";

// Vignette d'un outil dans la tier list publique : lecture seule, le rang
// officiel (EDS Limoges) se modifie uniquement depuis la page d'administration.
export default function TierItem({ tool, rank, onOpen }) {
  return (
    <Hoverable
      as="div"
      onClick={onOpen}
      tabIndex={0}
      role="button"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, maxWidth: 252, background: "#f7f8fa", borderWidth: 1, borderStyle: "solid", borderColor: "#e8eaef", borderRadius: 10, padding: "5px 11px 5px 6px", cursor: "pointer" }}
      hoverStyle={{ borderColor: "#10b981", background: "#f0fdf6" }}
    >
      <span style={{ ...rankBubbleStyle(rank, 24), cursor: "default" }}>
        {rank || "–"}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1424", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
        {tool.name}
      </span>
      <span style={{ width: 8, height: 8, borderRadius: 999, flex: "none", background: statusColor(tool.validation) }} />
    </Hoverable>
  );
}

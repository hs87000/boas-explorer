import Hoverable from "./Hoverable";
import { rankBubbleStyle } from "../lib/styles";
import { statusColor } from "../lib/boas";
import VoteWidget from "./VoteWidget";

// Vignette d'un outil dans la tier list publique. Le rang officiel (EDS
// Limoges) est en lecture seule ; en mode admin (onTierClick fourni), la
// bulle de rang devient cliquable pour ouvrir le menu de classement.
export default function TierItem({ tool, rank, onOpen, vote, onVote, onTierClick }) {
  const adminBubble = typeof onTierClick === "function";

  return (
    <Hoverable
      as="div"
      onClick={onOpen}
      tabIndex={0}
      role="button"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, maxWidth: 330, background: "#f7f8fa", borderWidth: 1, borderStyle: "solid", borderColor: "#e8eaef", borderRadius: 10, padding: "5px 11px 5px 6px", cursor: "pointer" }}
      hoverStyle={{ borderColor: "#10b981", background: "#f0fdf6" }}
    >
      {adminBubble ? (
        <button
          type="button"
          onClick={(e) => onTierClick(tool.id, e)}
          title="Mode admin : cliquez pour modifier le rang"
          aria-label={`Modifier le rang de ${tool.name}`}
          style={{ ...rankBubbleStyle(rank, 24), boxShadow: "0 0 0 2px rgba(16,185,129,.25)" }}
        >
          {rank || "–"}
        </button>
      ) : (
        <span style={{ ...rankBubbleStyle(rank, 24), cursor: "default" }}>
          {rank || "–"}
        </span>
      )}
      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1424", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>
        {tool.name}
      </span>
      <span style={{ width: 8, height: 8, borderRadius: 999, flex: "none", background: statusColor(tool.validation) }} />
      <VoteWidget
        toolName={tool.name}
        up={vote?.up ?? 0}
        down={vote?.down ?? 0}
        myVote={vote?.mine ?? null}
        saving={vote?.saving ?? false}
        error={vote?.error ?? false}
        onVote={(value) => onVote(tool.id, value)}
      />
    </Hoverable>
  );
}

import Hoverable from "./Hoverable";
import { TIERS } from "../lib/constants";

export default function RankMenu({ openId, ranks, pos, onPick, onClose }) {
  const currentRank = ranks[openId];
  const options = TIERS.map((tier) => ({
    key: tier.key,
    label: tier.key,
    onPick: () => onPick(tier.key),
    style: {
      display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30,
      borderRadius: 8, border: 0, cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
      background: tier.color, color: "#0f1424",
      ...(currentRank === tier.key ? { outline: "2px solid #0f1424", outlineOffset: 1 } : {}),
    },
  }));
  if (currentRank) {
    options.push({
      key: "clear",
      label: "✕",
      onPick: () => onPick(null),
      style: {
        display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30,
        borderRadius: 8, border: "1px solid #e4e7ec", cursor: "pointer", fontSize: 13,
        background: "#fff", color: "#98a2b3",
      },
    });
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 115 }} />
      <div
        style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 120, display: "flex", gap: 6, padding: 8, background: "#fff", border: "1px solid #e1e4ea", borderRadius: 14, boxShadow: "0 18px 44px rgba(15,20,36,.22)", animation: "boasPop .14s ease both" }}
        role="menu"
        aria-label="Choisir un rang"
      >
        {options.map((opt) => (
          <Hoverable key={opt.key} as="button" onClick={opt.onPick} style={opt.style} hoverStyle={{ transform: "translateY(-2px)" }}>
            {opt.label}
          </Hoverable>
        ))}
      </div>
    </>
  );
}

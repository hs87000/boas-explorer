import Hoverable from "./Hoverable";
import { TIERS } from "../lib/constants";

const BTN_BASE = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
  borderRadius: 9, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15,
  flex: "none", padding: 0, lineHeight: 1, transition: "transform .14s ease, opacity .14s ease",
};

// Rangée de boutons S..F pour classer un outil depuis sa fiche (mode admin).
export default function TierPicker({ currentTier, onPick }) {
  const buttons = TIERS.map((tier) => ({
    key: tier.key,
    label: tier.key,
    onPick: () => onPick(tier.key),
    style: {
      ...BTN_BASE,
      border: 0,
      background: tier.color,
      color: "#0f1424",
      ...(currentTier === tier.key ? { outline: "2px solid #0f1424", outlineOffset: 2 } : currentTier ? { opacity: 0.45 } : {}),
    },
  }));
  if (currentTier) {
    buttons.push({
      key: "clear",
      label: "✕",
      onPick: () => onPick(null),
      style: { ...BTN_BASE, border: "1px solid #e4e7ec", background: "#fff", color: "#98a2b3", fontSize: 14, fontWeight: 500 },
    });
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {buttons.map((b) => (
        <Hoverable key={b.key} as="button" onClick={b.onPick} aria-label={`Classer ${b.key === "clear" ? "— retirer le rang" : `en ${b.label}`}`} style={b.style} hoverStyle={{ transform: "translateY(-2px)" }}>
          {b.label}
        </Hoverable>
      ))}
    </div>
  );
}

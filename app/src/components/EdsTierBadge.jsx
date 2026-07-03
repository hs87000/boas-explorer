import { TIERS } from "../lib/constants";

const TIER_COLOR = Object.fromEntries(TIERS.map((t) => [t.key, t.color]));

// Pastille compacte du rang officiel : [EDS | lettre].
// Le segment sombre "EDS" identifie la source du classement d'un coup d'oeil,
// le detail complet est dans l'infobulle.
// En mode admin (onClick fourni), la pastille devient un bouton qui ouvre le
// menu de choix du rang.
export default function EdsTierBadge({ tier, size = 24, onClick }) {
  const clickable = typeof onClick === "function";

  const style = {
    display: "inline-flex",
    alignItems: "stretch",
    height: size,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid rgba(15,20,36,.14)",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 11,
    lineHeight: 1,
    flex: "none",
    cursor: clickable ? "pointer" : "default",
    padding: 0,
    background: "transparent",
    ...(clickable ? { boxShadow: "0 0 0 2px rgba(16,185,129,.25)" } : {}),
  };

  const segments = (
    <>
      <span style={{ background: "#0f1424", color: "#fff", padding: "0 7px", display: "inline-flex", alignItems: "center", letterSpacing: ".05em" }}>
        EDS
      </span>
      <span
        style={{
          background: tier ? TIER_COLOR[tier] : "#f1f3f6",
          color: tier ? "#0f1424" : "#aab2bf",
          minWidth: 22,
          padding: "0 4px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {tier || "–"}
      </span>
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        title="Mode admin : cliquez pour modifier le rang EDS Limoges"
        aria-label={`Modifier le rang EDS Limoges (actuellement ${tier || "non classé"})`}
        style={style}
      >
        {segments}
      </button>
    );
  }

  return (
    <span
      title={tier ? `Classement officiel EDS Limoges : rang ${tier}` : "Non classé par l'EDS Limoges"}
      style={style}
    >
      {segments}
    </span>
  );
}

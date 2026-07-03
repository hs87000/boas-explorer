import { EDS_LIST, TIERS } from "../lib/constants";

const TIER_COLOR = Object.fromEntries(TIERS.map((t) => [t.key, t.color]));

// Pastille compacte des rangs officiels : [EDS][L·S][B·A][P·–].
// Un segment par Entrepot de Donnees de Sante (lettre de la ville + rang,
// colore par le tier). Detail complet dans l'infobulle de chaque segment.
// En mode admin (onPick fourni), chaque segment ville devient un bouton qui
// ouvre le menu de classement de CET EDS.
export default function EdsTierBadge({ tiers = {}, size = 24, onPick }) {
  const clickable = typeof onPick === "function";

  const segStyle = (tier) => ({
    background: tier ? TIER_COLOR[tier] : "#f1f3f6",
    color: tier ? "#0f1424" : "#aab2bf",
    minWidth: 26,
    padding: "0 5px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    border: 0,
    borderLeft: "1px solid rgba(15,20,36,.14)",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 11,
    lineHeight: 1,
    cursor: clickable ? "pointer" : "default",
  });

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        height: size,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(15,20,36,.14)",
        flex: "none",
        ...(clickable ? { boxShadow: "0 0 0 2px rgba(16,185,129,.25)" } : {}),
      }}
    >
      <span style={{ background: "#0f1424", color: "#fff", padding: "0 6px", display: "inline-flex", alignItems: "center", letterSpacing: ".05em", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11, lineHeight: 1 }}>
        EDS
      </span>
      {EDS_LIST.map((eds) => {
        const tier = tiers[eds.key] ?? null;
        const info = tier ? `${eds.label} : rang ${tier}` : `${eds.label} : non classé`;
        if (clickable) {
          return (
            <button
              key={eds.key}
              type="button"
              onClick={(e) => onPick(eds.key, e)}
              title={`Mode admin — ${info} (cliquez pour modifier)`}
              aria-label={`Modifier le rang ${eds.label} (actuellement ${tier || "non classé"})`}
              style={segStyle(tier)}
            >
              <span style={{ fontSize: 8.5, fontWeight: 600, opacity: 0.75 }}>{eds.letter}</span>
              {tier || "–"}
            </button>
          );
        }
        return (
          <span key={eds.key} title={info} style={segStyle(tier)}>
            <span style={{ fontSize: 8.5, fontWeight: 600, opacity: 0.75 }}>{eds.letter}</span>
            {tier || "–"}
          </span>
        );
      })}
    </span>
  );
}

// Petit badge d'exemple pour les cases de legende : [EDS][X·S].
export function EdsSampleBadge({ letter = "L", tier = "S" }) {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "stretch", height: 24, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(15,20,36,.14)", flex: "none", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 11, lineHeight: 1 }}>
      <span style={{ background: "#0f1424", color: "#fff", padding: "0 6px", display: "inline-flex", alignItems: "center", letterSpacing: ".05em" }}>EDS</span>
      <span style={{ background: TIER_COLOR[tier], color: "#0f1424", minWidth: 26, padding: "0 5px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <span style={{ fontSize: 8.5, fontWeight: 600, opacity: 0.75 }}>{letter}</span>
        {tier}
      </span>
    </span>
  );
}

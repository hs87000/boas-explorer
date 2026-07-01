import { TIERS } from "./constants";

export function accentVars(accent) {
  const a = accent;
  return {
    a,
    soft: `color-mix(in oklab, ${a} 11%, #fff)`,
    softBorder: `color-mix(in oklab, ${a} 38%, #fff)`,
    ink: `color-mix(in oklab, ${a} 78%, #06281c)`,
  };
}

export function badgeStyle(v, accent) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  };
  const ac = accentVars(accent);
  if (v === "Validé") return { ...base, background: ac.soft, border: `1px solid ${ac.softBorder}`, color: ac.ink };
  if (v === "En cours de validation") return { ...base, background: "#fffbeb", border: "1px solid #fde68a", color: "#b45309" };
  if (v === "Non validé") return { ...base, background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#64748b" };
  return { ...base, background: "#f8fafc", border: "1px solid #eef0f3", color: "#94a3b8" };
}

export function chipStyle(active, accent) {
  const base = {
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 500,
    padding: "6px 13px",
    borderRadius: 999,
    cursor: "pointer",
    transition: "all .14s ease",
    lineHeight: 1.2,
  };
  const ac = accentVars(accent);
  if (active) return { ...base, background: ac.soft, border: `1px solid ${ac.softBorder}`, color: ac.ink, fontWeight: 600 };
  return { ...base, background: "#fff", border: "1px solid #e4e7ec", color: "#475467" };
}

export function rankBubbleStyle(rank, size = 28) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 13,
    flex: "none",
    padding: 0,
    lineHeight: 1,
    transition: "transform .14s ease, box-shadow .14s ease",
  };
  if (rank) {
    const color = (TIERS.find((x) => x.key === rank) || {}).color || "#94a3b8";
    return {
      ...base,
      background: color,
      color: "#0f1424",
      border: "1px solid rgba(15,20,36,.14)",
      boxShadow: `0 4px 12px color-mix(in oklab, ${color} 45%, transparent)`,
    };
  }
  return { ...base, background: "#fff", color: "#aab2bf", border: "1px dashed #cbd2dc" };
}

export function viewBtnStyle(active, accent) {
  const base = {
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    border: 0,
    borderRadius: 8,
    padding: "0 14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };
  const ac = accentVars(accent);
  if (active) return { ...base, background: ac.soft, color: ac.ink };
  return { ...base, background: "transparent", color: "#667085" };
}

export function cardBaseStyle(i) {
  return {
    position: "relative",
    background: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e8eaef",
    borderRadius: 18,
    padding: 20,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    minHeight: 200,
    overflow: "hidden",
    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
    animation: `boasPop .5s cubic-bezier(.22,1,.36,1) ${Math.min(i * 0.035, 0.55).toFixed(3)}s both`,
  };
}

export function glowColor(accent) {
  return `color-mix(in oklab, ${accent} 16%, transparent)`;
}

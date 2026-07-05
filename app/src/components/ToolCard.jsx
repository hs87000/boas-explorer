import { useRef } from "react";
import useHover from "../hooks/useHover";
import { badgeStyle, cardBaseStyle, glowColor } from "../lib/styles";
import { ACCENT } from "../lib/constants";
import VoteWidget from "./VoteWidget";
import EdsTierBadge, { MethodoBadge } from "./EdsTierBadge";

export default function ToolCard({ tool, index, onOpen, vote, onVote, onTierClick }) {
  const [hovered, hoverHandlers] = useHover();
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const g = glowRef.current;
    if (!g) return;
    const r = e.currentTarget.getBoundingClientRect();
    g.style.background = `radial-gradient(220px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, ${glowColor(ACCENT)}, transparent 65%)`;
    g.style.opacity = "1";
  };
  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    hoverHandlers.onMouseLeave();
  };

  const style = hovered
    ? { ...cardBaseStyle(index), transform: "translateY(-5px)", boxShadow: "0 20px 44px rgba(15,20,36,.12)", borderColor: "#cfeede" }
    : cardBaseStyle(index);

  return (
    <article
      onClick={onOpen}
      onMouseEnter={hoverHandlers.onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      style={style}
    >
      <div ref={glowRef} style={{ position: "absolute", inset: 0, borderRadius: 18, opacity: 0, transition: "opacity .25s ease", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <VoteWidget
            toolName={tool.name}
            up={vote?.up ?? 0}
            down={vote?.down ?? 0}
            myVote={vote?.mine ?? null}
            saving={vote?.saving ?? false}
            error={vote?.error ?? false}
            onVote={(value) => onVote(tool.id, value)}
          />
          <MethodoBadge
            tier={tool.tierMethodo}
            onPick={onTierClick ? (edsKey, e) => onTierClick(tool.id, edsKey, e) : undefined}
          />
          <EdsTierBadge
            tiers={{ limoges: tool.tier, bordeaux: tool.tierBordeaux, poitiers: tool.tierPoitiers }}
            onPick={onTierClick ? (edsKey, e) => onTierClick(tool.id, edsKey, e) : undefined}
          />
        </div>
        <span style={badgeStyle(tool.validation, ACCENT)}>{tool.validation}</span>
      </div>

      <h3 style={{ position: "relative", zIndex: 1, fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.22, letterSpacing: "-.015em", margin: "14px 0 0", color: "#0f1424", textWrap: "balance" }}>
        {tool.name}
      </h3>
      <p style={{ position: "relative", zIndex: 1, fontSize: 13.5, lineHeight: 1.5, color: "#5a6473", margin: "9px 0 0", textWrap: "pretty" }}>
        {tool.summary}
      </p>
      <div style={{ flex: 1 }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
        {(tool.languages || []).map((lang) => (
          <span key={lang} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: "#0a8255", background: "#f0fdf6", border: "1px solid #cdeedd", borderRadius: 6, padding: "3px 8px" }}>
            {lang}
          </span>
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, borderTop: "1px solid #f0f1f4", paddingTop: 12 }}>
        <span style={{ fontSize: 11.5, color: "#667085", background: "#f5f6f8", borderRadius: 6, padding: "3px 9px" }}>
          {(tool.medicalDomains && tool.medicalDomains[0]) || "—"}
        </span>
        <span style={{ fontSize: 11.5, color: "#667085", background: "#f5f6f8", borderRadius: 6, padding: "3px 9px" }}>
          {(tool.dataTypes && tool.dataTypes[0]) || "—"}
        </span>
        <span style={{ fontSize: 11.5, color: "#98a2b3", background: "#f5f6f8", borderRadius: 6, padding: "3px 9px" }}>
          {tool.authorType}
        </span>
      </div>
    </article>
  );
}

import { ROT_WORDS } from "../lib/constants";

const FLOAT_CHIPS = [
  { label: "Python", top: "8%", left: "9%", r: "-7deg", d: "0s" },
  { label: "OMOP", top: "20%", left: "84%", r: "8deg", d: "1.1s" },
  { label: "Validé ✓", top: "62%", left: "4%", r: "5deg", d: "2.0s" },
  { label: "SAS", top: "70%", left: "90%", r: "-6deg", d: ".6s" },
  { label: "Diabète", top: "2%", left: "62%", r: "4deg", d: "1.6s" },
];

export default function Hero({ query, onQuery, shown, total, rotIndex }) {
  const word = ROT_WORDS[rotIndex % ROT_WORDS.length];

  return (
    <header style={{ position: "relative", padding: "64px 0 40px", textAlign: "center" }}>
      {FLOAT_CHIPS.map((fc) => (
        <span
          key={fc.label}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: fc.top,
            left: fc.left,
            "--r": fc.r,
            transform: `rotate(${fc.r})`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            color: "#0a8255",
            background: "rgba(255,255,255,.75)",
            backdropFilter: "blur(6px)",
            border: "1px solid #cdeedd",
            borderRadius: 9,
            padding: "6px 11px",
            boxShadow: "0 8px 20px rgba(15,20,36,.06)",
            pointerEvents: "none",
            animation: `boasFloatChip 7s ease-in-out ${fc.d} infinite`,
            zIndex: 0,
          }}
        >
          {fc.label}
        </span>
      ))}

      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0a8255", background: "#ecfdf5", border: "1px solid #b6ebd4", padding: "7px 14px", borderRadius: 999, animation: "boasRise .5s ease both" }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10b981", boxShadow: "0 0 0 4px rgba(16,185,129,.18)", animation: "boasFade 1.4s ease-in-out infinite alternate" }} />
        48 algorithmes · open source · données de santé
      </div>

      <h1 style={{ position: "relative", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.04, letterSpacing: "-.035em", margin: "22px auto 0", maxWidth: "15ch", textWrap: "balance", animation: "boasRise .5s ease .04s both" }}>
        Les algorithmes{" "}
        <span
          key={rotIndex}
          style={{
            display: "inline-block",
            background: "linear-gradient(120deg, #10b981, #0ea5e9)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "boasRotWord .6s cubic-bezier(.22,1,.36,1) both",
            transformOrigin: "left center",
          }}
        >
          {word}
        </span>
        , à portée de recherche.
      </h1>

      <p style={{ fontSize: 18, color: "#475467", maxWidth: "56ch", margin: "22px auto 0", lineHeight: 1.55, textWrap: "pretty", animation: "boasRise .5s ease .08s both" }}>
        La Bibliothèque Ouverte d'Algorithmes en Santé réunie en un catalogue vivant. Cherchez, filtrez par langage, domaine ou statut, et ouvrez chaque fiche en un clic.
      </p>

      <div style={{ maxWidth: 620, margin: "34px auto 0", animation: "boasRise .5s ease .12s both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #e1e4ea", borderRadius: 16, padding: "8px 8px 8px 18px", boxShadow: "0 12px 34px rgba(15,20,36,.07)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={onQuery}
            placeholder="Rechercher un algorithme — diabète, OMOP, cartographie…"
            aria-label="Rechercher"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontSize: 16, color: "#0f1424", fontFamily: "inherit", minWidth: 0 }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", padding: "11px 18px", borderRadius: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
            {shown} / {total}
          </span>
        </div>
      </div>
    </header>
  );
}

export default function Marquee({ items }) {
  return (
    <div
      className="boas-marquee"
      style={{ position: "relative", margin: "0 -28px 30px", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)" }}
    >
      <div className="boas-track" style={{ display: "flex", gap: 12, width: "max-content", padding: "4px 6px", animation: "boasMarquee 38s linear infinite" }}>
        {items.map((label, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12.5,
              fontWeight: 500,
              color: i % 3 === 0 ? "#0a8255" : "#667085",
              background: "#fff",
              border: "1px solid #e6e8ec",
              borderRadius: 999,
              padding: "8px 15px",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

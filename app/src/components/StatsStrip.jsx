export default function StatsStrip({ stats }) {
  return (
    <section
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, margin: "8px 0 36px", animation: "boasRise .5s ease .16s both" }}
      aria-label="Statistiques"
    >
      {stats.map((stat) => (
        <div key={stat.l} style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(6px)", border: "1px solid #e8eaef", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: "-.03em", lineHeight: 1, color: "#0f1424" }}>
            {stat.n}
          </div>
          <div style={{ fontSize: 13, color: "#667085", marginTop: 8, fontWeight: 500 }}>{stat.l}</div>
        </div>
      ))}
    </section>
  );
}

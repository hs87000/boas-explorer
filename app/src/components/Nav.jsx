import Hoverable from "./Hoverable";

export default function Nav() {
  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(140deg, #10b981, #059669)", display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(16,185,129,.35)" }}>
          <div style={{ width: 11, height: 11, borderRadius: 3, background: "#fff" }} />
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-.01em" }}>
          BOAS<span style={{ color: "#059669" }}>.</span>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#667085", padding: "4px 9px", border: "1px solid #e6e8ec", borderRadius: 999, background: "#fff" }}>
          Health Data Hub
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Hoverable
          as="a"
          href="https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante"
          target="_blank"
          rel="noreferrer noopener"
          style={{ fontSize: 13.5, color: "#475467", textDecoration: "none", fontWeight: 500, padding: "8px 12px", borderRadius: 9 }}
          hoverStyle={{ background: "#eef0f3", color: "#0f1424" }}
        >
          Données ouvertes
        </Hoverable>
        <Hoverable
          as="a"
          href="https://gitlab.com/healthdatahub"
          target="_blank"
          rel="noreferrer noopener"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: "#0f1424", textDecoration: "none", padding: "8px 14px", borderWidth: 1, borderStyle: "solid", borderColor: "#d9dde3", borderRadius: 9, background: "#fff" }}
          hoverStyle={{ borderColor: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,.12)" }}
        >
          GitLab&nbsp;↗
        </Hoverable>
        <Hoverable
          as="a"
          href="#/admin"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: "#0f1424", textDecoration: "none", padding: "8px 14px", borderWidth: 1, borderStyle: "solid", borderColor: "#d9dde3", borderRadius: 9, background: "#fff" }}
          hoverStyle={{ borderColor: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,.12)" }}
        >
          Admin
        </Hoverable>
      </div>
    </nav>
  );
}

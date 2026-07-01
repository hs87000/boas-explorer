export default function Footer({ total }) {
  return (
    <footer style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "32px 0 48px", marginTop: 20, borderTop: "1px solid #e6e8ec", color: "#667085", fontSize: 13 }}>
      <div>
        BOAS Explorer · données ouvertes{" "}
        <a
          href="https://www.health-data-hub.fr/bibliotheque-ouverte-algorithmes-sante"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}
        >
          health-data-hub.fr
        </a>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
        {total} algorithmes de la Bibliothèque Ouverte d'Algorithmes en Santé
      </div>
    </footer>
  );
}

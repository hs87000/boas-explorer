import Hoverable from "./Hoverable";
import { chipStyle, viewBtnStyle } from "../lib/styles";
import { ACCENT } from "../lib/constants";

function FacetChips({ facet }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {facet.chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onToggle}
          style={chipStyle(chip.active, ACCENT)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export default function Toolbar({
  query, onQuery, sort, onSort, view, setView,
  hasActive, onReset,
  primaryFacets, advancedFacets, advancedActive,
  showAdvanced, toggleAdvanced,
}) {
  return (
    <div
      id="catalogue"
      className="boas-scroll"
      style={{ position: "sticky", top: 12, zIndex: 20, background: "rgba(246,247,249,.82)", backdropFilter: "blur(12px)", border: "1px solid #e6e8ec", borderRadius: 18, padding: 14, boxShadow: "0 8px 24px rgba(15,20,36,.05)" }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 240, background: "#fff", border: "1px solid #e1e4ea", borderRadius: 11, padding: "0 12px", height: 42 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#98a2b3" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={onQuery}
            placeholder="Filtrer le catalogue…"
            aria-label="Filtrer"
            style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontSize: 14.5, color: "#0f1424", fontFamily: "inherit", minWidth: 0 }}
          />
        </div>

        <select
          value={sort}
          onChange={onSort}
          aria-label="Trier"
          style={{ height: 42, border: "1px solid #e1e4ea", borderRadius: 11, background: "#fff", padding: "0 12px", fontSize: 14, color: "#344054", fontFamily: "inherit", cursor: "pointer", outline: 0 }}
        >
          <option value="rank">Trier : par rang (S → F)</option>
          <option value="name">Trier : A → Z</option>
          <option value="val">Trier : statut (validé d'abord)</option>
          <option value="update">Trier : dernière mise à jour</option>
        </select>

        <div style={{ display: "flex", background: "#fff", border: "1px solid #e1e4ea", borderRadius: 11, padding: 3, height: 42 }}>
          <button onClick={() => setView("grid")} style={viewBtnStyle(view === "grid", ACCENT)}>▦ Cartes</button>
          <button onClick={() => setView("table")} style={viewBtnStyle(view === "table", ACCENT)}>≣ Tableau</button>
          <button onClick={() => setView("tier")} style={viewBtnStyle(view === "tier", ACCENT)}>★ Tier list</button>
        </div>

        {hasActive && (
          <Hoverable
            as="button"
            onClick={onReset}
            style={{ height: 42, borderWidth: 1, borderStyle: "solid", borderColor: "#e1e4ea", borderRadius: 11, background: "#fff", padding: "0 14px", fontSize: 13.5, color: "#475467", fontFamily: "inherit", cursor: "pointer", fontWeight: 500 }}
            hoverStyle={{ borderColor: "#d0d5dd", color: "#0f1424" }}
          >
            ↺ Réinitialiser
          </Hoverable>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {primaryFacets.map((facet) => (
          <div key={facet.label} style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3", minWidth: 62, paddingTop: 4 }}>
              {facet.label}
            </span>
            <FacetChips facet={facet} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, borderTop: "1px dashed #e6e8ec", paddingTop: 12 }}>
        <button
          onClick={toggleAdvanced}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: 0, fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#475467", cursor: "pointer", padding: "4px 0" }}
        >
          <span style={{ fontSize: 15 }}>⚙</span> Filtres avancés
          {advancedActive > 0 && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: "#ecfdf5", color: "#0a8255", border: "1px solid #b6ebd4", borderRadius: 999, padding: "1px 7px" }}>
              {advancedActive}
            </span>
          )}
          <span style={{ display: "inline-block", transition: "transform .2s ease", fontSize: 11, color: "#98a2b3", transform: showAdvanced ? "rotate(180deg)" : undefined }}>
            ▾
          </span>
        </button>

        {showAdvanced && (
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {advancedFacets.map((facet) => (
              <div key={facet.label}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "#98a2b3", marginBottom: 8 }}>
                  {facet.label}
                </div>
                <FacetChips facet={facet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

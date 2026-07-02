import { useEffect, useMemo, useState } from "react";
import { fetchTools } from "./lib/fetchTools";
import { ADVANCED_KEYS, DENSITY, FACET_DEFS, LANG_COUNT } from "./lib/constants";
import { clearStoredRanks, computeResults, deriveOptions, emptyFilters, loadRanks, saveRanks, toggleFilter } from "./lib/boas";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import Marquee from "./components/Marquee";
import Toolbar from "./components/Toolbar";
import ResultsGrid from "./components/ResultsGrid";
import ResultsTable from "./components/ResultsTable";
import TierList from "./components/TierList";
import Footer from "./components/Footer";
import ToolModal from "./components/ToolModal";
import RankMenu from "./components/RankMenu";

const MARQUEE_FALLBACK = ["Diabète", "Python", "OMOP", "Cartographie", "SAS", "Oncologie", "SNDS", "R", "Épidémiologie"];

export default function App() {
  const [tools, setTools] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [fetchAttempt, setFetchAttempt] = useState(0); // incremente par « Réessayer »
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rank");
  const [view, setView] = useState("grid");
  const [filters, setFilters] = useState(() => emptyFilters());
  const [selectedId, setSelectedId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rotIndex, setRotIndex] = useState(0);
  const [countProgress, setCountProgress] = useState(0);
  const [ranks, setRanks] = useState(() => loadRanks());
  const [openRankId, setOpenRankId] = useState(null);
  const [rankPos, setRankPos] = useState({ top: 90, left: 20 });

  // Chargement des donnees : Supabase (JSON local si non configure).
  // Relance quand fetchAttempt change (bouton « Réessayer »), sans recharger la page.
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchTools()
      .then((list) => {
        if (cancelled) return;
        setTools(list);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("[BOAS] Echec du chargement du catalogue :", err && err.message);
        setStatus("error");
      });
    return () => { cancelled = true; };
  }, [fetchAttempt]);

  // Mot du titre en rotation toutes les 2.4s.
  useEffect(() => {
    const timer = setInterval(() => setRotIndex((i) => i + 1), 2400);
    return () => clearInterval(timer);
  }, []);

  // Compteur animé des statistiques (0 -> valeur finale), lancé à l'arrivée des données.
  const loaded = tools.length > 0;
  useEffect(() => {
    if (!loaded) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setCountProgress(1); return; }
    const dur = 1200;
    const t0 = Date.now();
    const timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCountProgress(eased);
      if (p >= 1) clearInterval(timer);
    }, 33);
    return () => clearInterval(timer);
  }, [loaded]);

  const total = tools.length || 48;
  const validatedCount = useMemo(() => tools.filter((t) => t.validation === "Validé").length, [tools]);
  const domainsCount = useMemo(
    () => new Set(tools.flatMap((t) => t.medicalDomains || []).filter((d) => d && d !== "Autre" && d !== "Tous")).size,
    [tools]
  );
  const marqueeItems = useMemo(() => {
    const raw = [...new Set([
      ...tools.flatMap((t) => t.medicalDomains || []),
      ...tools.flatMap((t) => t.languages || []),
      ...tools.flatMap((t) => t.objectives || []),
    ].filter((v) => v && v !== "Autre" && v !== "Tous" && v !== "Non précisé"))];
    const base = raw.length ? raw : MARQUEE_FALLBACK;
    return [...base, ...base];
  }, [tools]);

  const results = useMemo(
    () => computeResults(tools, { query, filters, sort, ranks }),
    [tools, query, filters, sort, ranks]
  );

  const handleToggleFilter = (key, value) => setFilters((f) => toggleFilter(f, key, value));
  const handleReset = () => { setQuery(""); setSort("rank"); setFilters(emptyFilters()); };

  const handleSetRank = (id, tier) => {
    setRanks((prev) => {
      const next = { ...prev };
      if (!tier || prev[id] === tier) delete next[id];
      else next[id] = tier;
      saveRanks(next);
      return next;
    });
    setOpenRankId(null);
  };
  const handleClearRanks = () => { clearStoredRanks(); setRanks({}); setOpenRankId(null); };

  const handleOpenRankMenu = (id, e) => {
    e.stopPropagation();
    if (openRankId === id) { setOpenRankId(null); return; }
    let top = 90, left = 20;
    const r = e.currentTarget && e.currentTarget.getBoundingClientRect && e.currentTarget.getBoundingClientRect();
    if (r) {
      top = Math.min(r.bottom + 8, window.innerHeight - 56);
      left = Math.max(8, Math.min(r.left, window.innerWidth - 252));
    }
    setOpenRankId(id);
    setRankPos({ top, left });
  };

  const buildFacet = (def) => ({
    label: def.label,
    chips: deriveOptions(def, tools).map((opt) => ({
      label: opt,
      active: (filters[def.key] || []).includes(opt),
      onToggle: () => handleToggleFilter(def.key, opt),
    })),
  });
  const primaryFacets = useMemo(() => FACET_DEFS.filter((d) => !ADVANCED_KEYS.includes(d.key)).map(buildFacet), [filters, tools]);
  const advancedFacets = useMemo(() => FACET_DEFS.filter((d) => ADVANCED_KEYS.includes(d.key)).map(buildFacet), [filters, tools]);
  const advancedActive = advancedFacets.reduce((n, f) => n + f.chips.filter((c) => c.active).length, 0);

  const activeCount = FACET_DEFS.reduce((n, d) => n + (filters[d.key]?.length || 0), 0);
  const hasActive = activeCount > 0 || query.trim().length > 0 || sort !== "rank";

  const cnt = (target) => String(Math.round((target || 0) * countProgress));
  const heroStats = [
    { n: cnt(total), l: "Algorithmes référencés" },
    { n: cnt(validatedCount), l: "Validés et reproductibles" },
    { n: cnt(LANG_COUNT), l: "Langages couverts" },
    { n: cnt(domainsCount), l: "Domaines médicaux" },
  ];

  const compact = DENSITY === "Compact";
  const showEmpty = status === "ready" && results.length === 0;
  const selectedTool = tools.find((t) => t.id === selectedId) || null;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -120, width: 560, height: 560, borderRadius: "50%", filter: "blur(70px)", opacity: 0.5, background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,.45), transparent 65%)", animation: "boasBlob 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 120, left: -160, width: 460, height: 460, borderRadius: "50%", filter: "blur(70px)", opacity: 0.4, background: "radial-gradient(circle at 60% 40%, rgba(14,165,233,.35), transparent 65%)", animation: "boasBlob 22s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", bottom: -180, left: "40%", width: 420, height: 420, borderRadius: "50%", filter: "blur(80px)", opacity: 0.35, background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,.30), transparent 65%)", animation: "boasBlob 26s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5, backgroundImage: "radial-gradient(rgba(15,20,36,.05) 1px, transparent 1px)", backgroundSize: "26px 26px", WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 60%)", maskImage: "linear-gradient(180deg, #000 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}>
        <Nav />

        <Hero
          query={query}
          onQuery={(e) => setQuery(e.target.value)}
          shown={results.length}
          total={total}
          rotIndex={rotIndex}
        />

        <StatsStrip stats={heroStats} />

        <Marquee items={marqueeItems} />

        <Toolbar
          query={query}
          onQuery={(e) => setQuery(e.target.value)}
          sort={sort}
          onSort={(e) => setSort(e.target.value)}
          view={view}
          setView={setView}
          hasActive={hasActive}
          onReset={handleReset}
          primaryFacets={primaryFacets}
          advancedFacets={advancedFacets}
          advancedActive={advancedActive}
          showAdvanced={showAdvanced}
          toggleAdvanced={() => setShowAdvanced((s) => !s)}
        />

        <main style={{ padding: "28px 0 10px", minHeight: "40vh" }}>
          {status === "loading" && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#667085", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, animation: "boasFade .4s ease both" }}>
              Chargement du catalogue…
            </div>
          )}

          {status === "error" && (
            <div style={{ maxWidth: 480, margin: "40px auto", background: "#fff", border: "1px solid #e8eaef", borderRadius: 18, padding: "36px 32px", textAlign: "center", boxShadow: "0 12px 34px rgba(15,20,36,.07)", animation: "boasPop .3s ease both" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#0f1424" }}>
                Impossible de charger le catalogue.
              </div>
              <p style={{ color: "#667085", margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.55 }}>
                Vérifiez votre connexion puis réessayez.
              </p>
              <button
                onClick={() => setFetchAttempt((n) => n + 1)}
                style={{ marginTop: 22, fontFamily: "inherit", fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(140deg, #10b981, #059669)", border: 0, padding: "11px 22px", borderRadius: 11, cursor: "pointer", boxShadow: "0 8px 20px rgba(16,185,129,.3)" }}
              >
                ↺ Réessayer
              </button>
            </div>
          )}

          {showEmpty && (
            <div style={{ textAlign: "center", padding: "80px 20px", animation: "boasFade .4s ease both" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, color: "#0f1424" }}>
                Aucun algorithme ne correspond.
              </div>
              <div style={{ color: "#667085", marginTop: 10 }}>Élargissez vos filtres ou réinitialisez la recherche.</div>
            </div>
          )}

          {status === "ready" && results.length > 0 && view === "grid" && (
            <ResultsGrid
              results={results}
              ranks={ranks}
              compact={compact}
              onOpen={setSelectedId}
              onRankClick={handleOpenRankMenu}
            />
          )}

          {status === "ready" && results.length > 0 && view === "table" && (
            <ResultsTable results={results} onOpen={setSelectedId} />
          )}

          {status === "ready" && results.length > 0 && view === "tier" && (
            <TierList
              results={results}
              ranks={ranks}
              onOpen={setSelectedId}
              onRankClick={handleOpenRankMenu}
              onClearRanks={handleClearRanks}
            />
          )}
        </main>

        <Footer total={total} />
      </div>

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          rank={ranks[selectedTool.id] || null}
          onClose={() => setSelectedId(null)}
          onPickRank={(tier) => handleSetRank(selectedTool.id, tier)}
        />
      )}

      {openRankId != null && (
        <RankMenu
          openId={openRankId}
          ranks={ranks}
          pos={rankPos}
          onPick={(tier) => handleSetRank(openRankId, tier)}
          onClose={() => setOpenRankId(null)}
        />
      )}
    </div>
  );
}

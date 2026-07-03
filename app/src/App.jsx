import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTools } from "./lib/fetchTools";
import { castVote, fetchVoteData, removeVote } from "./lib/votes";
import { fetchLegends, saveLegend, LEGEND_DEFAULTS } from "./lib/content";
import { saveTier } from "./lib/tiers";
import { supabase } from "./lib/supabase";
import { ADVANCED_KEYS, DENSITY, FACET_DEFS, LANG_COUNT } from "./lib/constants";
import { computeResults, deriveOptions, emptyFilters, toggleFilter } from "./lib/boas";
import useSession from "./hooks/useSession";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import Marquee from "./components/Marquee";
import Toolbar from "./components/Toolbar";
import LegendCards from "./components/LegendCards";
import ResultsGrid from "./components/ResultsGrid";
import ResultsTable from "./components/ResultsTable";
import TierList from "./components/TierList";
import Footer from "./components/Footer";
import ToolModal from "./components/ToolModal";
import TierMenu from "./components/TierMenu";
import Toast from "./components/Toast";

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
  const [voteCounts, setVoteCounts] = useState({}); // { toolId: { up, down } }
  const [myVotes, setMyVotes] = useState({});       // { toolId: 1 | -1 } (votes de ce navigateur)
  const [voteBusy, setVoteBusy] = useState({});     // { toolId: "saving" | "error" }
  const [legends, setLegends] = useState({ ...LEGEND_DEFAULTS });
  const [tierMenu, setTierMenu] = useState(null);   // { id, top, left } (menu admin de rang)
  const [toast, setToast] = useState(null);         // { type: "ok" | "err", message }
  const toastTimer = useRef(null);

  // Mode admin : session Supabase active (connexion via #/admin).
  const session = useSession();
  const admin = !!session;

  const showToast = (type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

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

  // Compteurs de votes + votes deja poses par ce navigateur.
  useEffect(() => {
    let cancelled = false;
    fetchVoteData().then(({ counts, mine }) => {
      if (cancelled) return;
      setVoteCounts(counts);
      setMyVotes(mine);
    });
    return () => { cancelled = true; };
  }, []);

  // Textes des cases de legende (editables en mode admin).
  useEffect(() => {
    let cancelled = false;
    fetchLegends().then((l) => { if (!cancelled) setLegends(l); });
    return () => { cancelled = true; };
  }, []);

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

  // Rangs officiels (EDS Limoges) : lus depuis la colonne tier de la base.
  // En mode admin ils sont editables directement sur le site (badge/fiche).
  const ranks = useMemo(() => {
    const r = {};
    tools.forEach((t) => { if (t.tier) r[t.id] = t.tier; });
    return r;
  }, [tools]);

  // Score net (pour - contre) par outil, pour le tri « votes du public ».
  const voteScores = useMemo(() => {
    const s = {};
    for (const [id, c] of Object.entries(voteCounts)) s[id] = (c.up || 0) - (c.down || 0);
    return s;
  }, [voteCounts]);

  const results = useMemo(
    () => computeResults(tools, { query, filters, sort, ranks, voteScores }),
    [tools, query, filters, sort, ranks, voteScores]
  );

  const handleToggleFilter = (key, value) => setFilters((f) => toggleFilter(f, key, value));
  const handleReset = () => { setQuery(""); setSort("rank"); setFilters(emptyFilters()); };

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

  // Un vote, modifiable : cliquer l'autre fleche change le vote, recliquer la
  // meme le retire. Mise a jour optimiste, retour en arriere si l'ecriture echoue.
  const handleVote = async (toolId, value) => {
    if (voteBusy[toolId] === "saving") return;
    const prev = myVotes[toolId] ?? null;
    const next = prev === value ? null : value; // re-clic sur le meme = retirer

    const applyDelta = (c, from, to) => {
      const cur = c[toolId] || { up: 0, down: 0 };
      let { up, down } = cur;
      if (from === 1) up -= 1;
      if (from === -1) down -= 1;
      if (to === 1) up += 1;
      if (to === -1) down += 1;
      return { ...c, [toolId]: { up: Math.max(0, up), down: Math.max(0, down) } };
    };

    setVoteBusy((b) => ({ ...b, [toolId]: "saving" }));
    setMyVotes((m) => {
      const n = { ...m };
      if (next == null) delete n[toolId];
      else n[toolId] = next;
      return n;
    });
    setVoteCounts((c) => applyDelta(c, prev, next));

    const res = next == null ? await removeVote(toolId) : await castVote(toolId, next);
    if (res.ok) {
      setVoteBusy((b) => { const n = { ...b }; delete n[toolId]; return n; });
      return;
    }
    // echec : on remet tout comme avant
    setMyVotes((m) => {
      const n = { ...m };
      if (prev == null) delete n[toolId];
      else n[toolId] = prev;
      return n;
    });
    setVoteCounts((c) => applyDelta(c, next, prev));
    setVoteBusy((b) => ({ ...b, [toolId]: "error" }));
  };

  // Donnees de vote par outil, pretes a afficher.
  const votes = useMemo(() => {
    const v = {};
    for (const t of tools) {
      v[t.id] = {
        up: voteCounts[t.id]?.up ?? 0,
        down: voteCounts[t.id]?.down ?? 0,
        mine: myVotes[t.id] ?? null,
        saving: voteBusy[t.id] === "saving",
        error: voteBusy[t.id] === "error",
      };
    }
    return v;
  }, [tools, voteCounts, myVotes, voteBusy]);

  // --- Edition admin directement sur le site ---

  const openTierMenu = (toolId, e) => {
    e.stopPropagation();
    if (tierMenu && tierMenu.id === toolId) { setTierMenu(null); return; }
    let top = 90, left = 20;
    const r = e.currentTarget && e.currentTarget.getBoundingClientRect && e.currentTarget.getBoundingClientRect();
    if (r) {
      top = Math.min(r.bottom + 8, window.innerHeight - 56);
      left = Math.max(8, Math.min(r.left, window.innerWidth - 292));
    }
    setTierMenu({ id: toolId, top, left });
  };

  const updateTier = async (toolId, tier) => {
    setTierMenu(null);
    const tool = tools.find((t) => t.id === toolId);
    const prev = tool?.tier ?? null;
    if (tier === prev) return;
    setTools((ts) => ts.map((t) => (t.id === toolId ? { ...t, tier } : t)));
    const res = await saveTier(toolId, tier);
    if (res.ok) {
      showToast("ok", tier ? `Rang ${tier} enregistré` : "Rang retiré");
    } else {
      setTools((ts) => ts.map((t) => (t.id === toolId ? { ...t, tier: prev } : t)));
      showToast("err", "Rang non enregistré (session expirée ?)");
    }
  };

  const handleSaveLegend = async (key, body) => {
    const res = await saveLegend(key, body);
    if (res.ok) {
      setLegends((l) => ({ ...l, [key]: body }));
      showToast("ok", "Légende enregistrée");
      return true;
    }
    showToast("err", "Légende non enregistrée (session expirée ?)");
    return false;
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    showToast("ok", "Déconnecté — le site est repassé en lecture seule");
  };

  const compact = DENSITY === "Compact";
  const showEmpty = status === "ready" && results.length === 0;
  const selectedTool = tools.find((t) => t.id === selectedId) || null;
  const menuTool = tierMenu ? tools.find((t) => t.id === tierMenu.id) : null;

  const cnt = (target) => String(Math.round((target || 0) * countProgress));
  const heroStats = [
    { n: cnt(total), l: "Algorithmes référencés" },
    { n: cnt(validatedCount), l: "Validés et reproductibles" },
    { n: cnt(LANG_COUNT), l: "Langages couverts" },
    { n: cnt(domainsCount), l: "Domaines médicaux" },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -120, width: 560, height: 560, borderRadius: "50%", filter: "blur(70px)", opacity: 0.5, background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,.45), transparent 65%)", animation: "boasBlob 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 120, left: -160, width: 460, height: 460, borderRadius: "50%", filter: "blur(70px)", opacity: 0.4, background: "radial-gradient(circle at 60% 40%, rgba(14,165,233,.35), transparent 65%)", animation: "boasBlob 22s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", bottom: -180, left: "40%", width: 420, height: 420, borderRadius: "50%", filter: "blur(80px)", opacity: 0.35, background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,.30), transparent 65%)", animation: "boasBlob 26s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5, backgroundImage: "radial-gradient(rgba(15,20,36,.05) 1px, transparent 1px)", backgroundSize: "26px 26px", WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 60%)", maskImage: "linear-gradient(180deg, #000 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}>
        <Nav admin={admin} onSignOut={handleSignOut} />

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

        <LegendCards legends={legends} admin={admin} onSave={handleSaveLegend} />

        <main style={{ padding: "20px 0 10px", minHeight: "40vh" }}>
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
              votes={votes}
              onVote={handleVote}
              onTierClick={admin ? openTierMenu : undefined}
              compact={compact}
              onOpen={setSelectedId}
            />
          )}

          {status === "ready" && results.length > 0 && view === "table" && (
            <ResultsTable results={results} onOpen={setSelectedId} votes={votes} onVote={handleVote} />
          )}

          {status === "ready" && results.length > 0 && view === "tier" && (
            <TierList
              results={results}
              ranks={ranks}
              onOpen={setSelectedId}
              votes={votes}
              onVote={handleVote}
              onTierClick={admin ? openTierMenu : undefined}
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
          vote={votes[selectedTool.id]}
          onVote={handleVote}
          admin={admin}
          onPickTier={updateTier}
        />
      )}

      {tierMenu && menuTool && (
        <TierMenu
          currentTier={menuTool.tier ?? null}
          pos={{ top: tierMenu.top, left: tierMenu.left }}
          onPick={(tier) => updateTier(tierMenu.id, tier)}
          onClose={() => setTierMenu(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

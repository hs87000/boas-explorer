import { FACET_DEFS, TIER_ORDER, VAL_ORDER } from "./constants";

const DIACRITICS_RE = /[\u0300-\u036f]/g;

export function norm(s) {
  return (s ?? "").toString().toLowerCase().normalize("NFD").replace(DIACRITICS_RE, "");
}

export function parseDate(str) {
  if (!str) return -1;
  const s = norm(str);
  const y = s.match(/(\d{4})/);
  if (!y) return -1;
  const months = { janvier: 1, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, aout: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12 };
  let month = 0;
  for (const [name, num] of Object.entries(months)) { if (s.includes(name)) { month = num; break; } }
  return parseInt(y[1], 10) * 12 + month;
}

export function deriveOptions(def, tools) {
  if (def.fixed) return def.fixed;
  const trailing = new Set(["autre", "tous", "non precise"]);
  const set = new Set();
  for (const t of tools) {
    const raw = t[def.field];
    if (def.multi) (raw || []).forEach((v) => v && set.add(v));
    else if (raw) set.add(raw);
  }
  return [...set].sort((a, b) => {
    const ta = trailing.has(norm(a)), tb = trailing.has(norm(b));
    if (ta !== tb) return ta ? 1 : -1;
    return a.localeCompare(b, "fr");
  });
}

export function emptyFilters() {
  const empty = {};
  FACET_DEFS.forEach((d) => (empty[d.key] = []));
  return empty;
}

export function toggleFilter(filters, key, value) {
  const cur = filters[key] || [];
  const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
  return { ...filters, [key]: next };
}

export function tierOrder(ranks, id) {
  const r = ranks ? ranks[id] : null;
  return (r != null && TIER_ORDER[r] != null) ? TIER_ORDER[r] : 99;
}

export function statusColor(v) {
  if (v === "Validé") return "#10b981";
  if (v === "En cours de validation") return "#f59e0b";
  if (v === "Non validé") return "#94a3b8";
  return "#cbd5e1";
}

export function computeResults(tools, { query, filters, sort, ranksByEds = {}, voteScores = {} }) {
  const q = norm(query.trim());
  let list = tools.filter((t) => {
    if (q && !(norm(t.name).includes(q) || norm(t.summary).includes(q) || norm(t.howItWorks).includes(q) || norm(t.inputData).includes(q))) return false;
    for (const def of FACET_DEFS) {
      const active = filters[def.key];
      if (!active || active.length === 0) continue;
      const values = def.multi ? t[def.field] || [] : [t[def.field]];
      if (!active.some((a) => values.includes(a))) return false;
    }
    return true;
  });
  const byName = (a, b) => a.name.localeCompare(b.name, "fr");
  list = [...list].sort((a, b) => {
    if (sort === "rank") return (tierOrder(ranksByEds.limoges, a.id) - tierOrder(ranksByEds.limoges, b.id)) || byName(a, b);
    if (sort === "rank_bordeaux") return (tierOrder(ranksByEds.bordeaux, a.id) - tierOrder(ranksByEds.bordeaux, b.id)) || byName(a, b);
    if (sort === "rank_poitiers") return (tierOrder(ranksByEds.poitiers, a.id) - tierOrder(ranksByEds.poitiers, b.id)) || byName(a, b);
    if (sort === "rank_methodo") return (tierOrder(ranksByEds.methodo, a.id) - tierOrder(ranksByEds.methodo, b.id)) || byName(a, b);
    if (sort === "votes") return ((voteScores[b.id] ?? 0) - (voteScores[a.id] ?? 0)) || byName(a, b);
    if (sort === "val") return (VAL_ORDER[a.validation] - VAL_ORDER[b.validation]) || byName(a, b);
    if (sort === "update") return (parseDate(b.lastUpdate) - parseDate(a.lastUpdate)) || byName(a, b);
    return byName(a, b);
  });
  return list;
}

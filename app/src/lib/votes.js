import { supabase } from "./supabase";
import { getDeviceId } from "./device";

// Les votes passent par deux fonctions cote base (cast_vote / remove_vote) qui
// ne touchent que la ligne de CET appareil. La table brute n'est pas lisible :
// on affiche les totaux via la vue vote_counts, et on memorise "mes votes"
// en localStorage (meme duree de vie que l'identifiant d'appareil).

const MY_VOTES_KEY = "boas-my-votes";

export function loadMyVotes() {
  try { return JSON.parse(localStorage.getItem(MY_VOTES_KEY)) || {}; } catch (e) { return {}; }
}

function persistMyVote(toolId, value) {
  try {
    const mine = loadMyVotes();
    if (value == null) delete mine[toolId];
    else mine[toolId] = value;
    localStorage.setItem(MY_VOTES_KEY, JSON.stringify(mine));
  } catch (e) { /* navigation privee stricte : tant pis, non bloquant */ }
}

// Totaux par outil + mes votes. Ne leve jamais : en cas de pepin le catalogue
// reste utilisable avec des compteurs a zero.
export async function fetchVoteData() {
  const mine = loadMyVotes();
  if (!supabase) return { counts: {}, mine };
  try {
    const { data, error } = await supabase.from("vote_counts").select("tool_id, up, down");
    if (error) {
      console.warn("[BOAS] Votes indisponibles :", error.message);
      return { counts: {}, mine };
    }
    const counts = {};
    for (const row of data || []) counts[row.tool_id] = { up: row.up, down: row.down };
    return { counts, mine };
  } catch (e) {
    console.warn("[BOAS] Votes indisponibles :", e && e.message);
    return { counts: {}, mine };
  }
}

// Voter ou changer son vote (1 = pour, -1 = contre).
export async function castVote(toolId, value) {
  if (!supabase) return { ok: false };
  const { error } = await supabase.rpc("cast_vote", {
    p_tool_id: toolId,
    p_device_id: getDeviceId(),
    p_value: value,
  });
  if (error) {
    console.warn("[BOAS] Vote non enregistre :", error.message);
    return { ok: false };
  }
  persistMyVote(toolId, value);
  return { ok: true };
}

// Retirer son vote.
export async function removeVote(toolId) {
  if (!supabase) return { ok: false };
  const { error } = await supabase.rpc("remove_vote", {
    p_tool_id: toolId,
    p_device_id: getDeviceId(),
  });
  if (error) {
    console.warn("[BOAS] Vote non retire :", error.message);
    return { ok: false };
  }
  persistMyVote(toolId, null);
  return { ok: true };
}

// Vote public pour/contre sur un outil. 1 vote par navigateur, MODIFIABLE :
// cliquer l'autre fleche change le vote, recliquer la meme le retire.
// Etats : enregistrement en cours (fige) / erreur (bordure rouge + infobulle).

const BTN_BASE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  height: 24,
  padding: "0 8px",
  border: 0,
  background: "transparent",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11.5,
  fontWeight: 600,
  lineHeight: 1,
  color: "#667085",
};

export default function VoteWidget({ toolName, up = 0, down = 0, myVote = null, saving = false, error = false, onVote }) {
  const handle = (value) => (e) => {
    e.stopPropagation(); // ne pas ouvrir la fiche de l'outil
    if (!saving) onVote(value);
  };

  const upStyle = {
    ...BTN_BASE,
    cursor: saving ? "wait" : "pointer",
    ...(myVote === 1 ? { background: "#ecfdf5", color: "#0a8255" } : {}),
    ...(myVote === -1 ? { opacity: 0.45 } : {}),
  };
  const downStyle = {
    ...BTN_BASE,
    cursor: saving ? "wait" : "pointer",
    borderLeft: "1px solid #e8eaef",
    ...(myVote === -1 ? { background: "#fef2f2", color: "#b91c1c" } : {}),
    ...(myVote === 1 ? { opacity: 0.45 } : {}),
  };

  const title = error
    ? "Vote non enregistré — réessayez"
    : myVote != null
      ? `Vous avez voté ${myVote === 1 ? "pour" : "contre"} — recliquez pour retirer, ou votez l'inverse`
      : "Votez : utile ou pas ? (1 vote par appareil, modifiable)";

  return (
    <span
      title={title}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "stretch",
        height: 24,
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid ${error ? "#fecaca" : "#e8eaef"}`,
        background: "#fff",
        flex: "none",
        opacity: saving ? 0.6 : 1,
      }}
    >
      <button
        type="button"
        onClick={handle(1)}
        disabled={saving}
        aria-pressed={myVote === 1}
        aria-label={`Voter pour ${toolName}`}
        style={upStyle}
      >
        ▲ {up}
      </button>
      <button
        type="button"
        onClick={handle(-1)}
        disabled={saving}
        aria-pressed={myVote === -1}
        aria-label={`Voter contre ${toolName}`}
        style={downStyle}
      >
        ▼ {down}
      </button>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {saving ? "Enregistrement du vote…" : error ? "Vote non enregistré, réessayez." : myVote != null ? "Vote enregistré." : ""}
      </span>
    </span>
  );
}

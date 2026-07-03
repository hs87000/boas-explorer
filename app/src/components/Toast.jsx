// Petit message de confirmation/erreur en bas de l'ecran, dans le style du site.
// Affiche par App, disparait tout seul (le minuteur est gere par App).
export default function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type === "ok";
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        pointerEvents: "none",
        background: ok ? "#ecfdf5" : "#fef2f2",
        border: `1px solid ${ok ? "#b6ebd4" : "#fecaca"}`,
        color: ok ? "#0a8255" : "#b91c1c",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
        fontWeight: 600,
        padding: "10px 18px",
        borderRadius: 12,
        boxShadow: "0 12px 34px rgba(15,20,36,.12)",
        animation: "boasPop .2s ease both",
        maxWidth: "min(92vw, 480px)",
        textAlign: "center",
      }}
    >
      {toast.message}
    </div>
  );
}

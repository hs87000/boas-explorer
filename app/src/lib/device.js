// Identifiant anonyme de CE navigateur, genere une fois puis conserve en
// localStorage. Sert de cle "1 vote par appareil" (contrainte unique en base).
// Aucune donnee personnelle : juste un UUID aleatoire.

const KEY = "boas-device-id";

function makeUuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  // repli pour les navigateurs anciens
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getDeviceId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = makeUuid();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch (e) {
    // localStorage indisponible (navigation privee stricte) : identifiant de session
    if (!window.__boasDeviceId) window.__boasDeviceId = makeUuid();
    return window.__boasDeviceId;
  }
}

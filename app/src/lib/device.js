// Identifiant anonyme de CE navigateur, genere une fois puis conserve en
// localStorage. N'a AUCUN role de securite (un identifiant auto-declare par
// le client ne peut pas en avoir : voir l'audit de mars — un script pouvait
// en inventer un nouveau a chaque appel). La vraie identite qui protege les
// votes est la session Supabase (auth.uid()), voir useSession.js et
// lib/votes.js. Ce fichier ne sert plus qu'a l'affichage local (savoir quel
// bouton de vote surligner sur CET appareil).

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

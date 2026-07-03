import { useEffect, useState } from "react";

// Routage minimal par hash (#/admin, #/...) : une seule route supplémentaire
// dans l'app, pas besoin de react-router pour ça.
export default function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

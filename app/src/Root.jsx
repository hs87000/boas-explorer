import useHashRoute from "./hooks/useHashRoute";
import App from "./App.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";

// Aiguillage : #/admin -> administration, tout le reste -> site public.
export default function Root() {
  const hash = useHashRoute();
  if (hash.startsWith("#/admin")) return <AdminPage />;
  return <App />;
}

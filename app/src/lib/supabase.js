import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null si les variables d'environnement manquent (ex. build sans .env) :
// l'app se rabat alors sur le JSON local, voir fetchTools.js
export const supabase = url && key ? createClient(url, key) : null;

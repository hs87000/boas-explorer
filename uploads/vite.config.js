import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" => chemins relatifs, le build fonctionne aussi bien sur
// GitHub Pages (sous-dossier) que sur Netlify ou en ouvrant le fichier.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../mission-001",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});

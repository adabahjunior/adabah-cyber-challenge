import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        onboarding: resolve(__dirname, "onboarding.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        leaderboard: resolve(__dirname, "leaderboard.html"),
        profile: resolve(__dirname, "profile.html"),
        admin: resolve(__dirname, "admin.html"),
        mission: resolve(__dirname, "mission.html"),
        mission001: resolve(__dirname, "mission-001/index.html"),
      },
    },
  },
  server: {
    port: 5500,
    open: "/",
  },
  preview: {
    port: 5500,
  },
});

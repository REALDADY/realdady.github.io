import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFile } from "node:fs/promises";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "portfolio-work-entry",
      apply: "build",
      async closeBundle() {
        await copyFile("vercel-dist/index.html", "vercel-dist/work.html");
      },
    },
  ],
  build: {
    outDir: "vercel-dist",
    emptyOutDir: true,
  },
});

import { build, defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "vercel-dist");
// Kept inside the project (not node_modules) so the bundle resolves react/react-dom
// from ./node_modules and is treated as ESM via package.json "type": "module".
const prerenderDir = path.join(root, ".vercel-prerender");

type PrerenderModule = {
  routes: Array<{ route: "home" | "work"; file: string }>;
  renderDocument: (template: string, route: "home" | "work") => string;
  robotsTxt: () => string;
  sitemapXml: () => string;
};

/**
 * Static prerender for the Vercel deployment. After the client bundle is
 * written, compile vercel-prerender.tsx for Node, render "/" and "/work" into
 * the built index.html template, and write index.html + work.html. The client
 * (vercel-main.tsx) hydrates that markup instead of rendering from scratch.
 */
function prerenderRoutes(): Plugin {
  return {
    name: "portfolio-prerender",
    apply: "build",
    async closeBundle() {
      try {
        await build({
          configFile: false,
          root,
          logLevel: "warn",
          plugins: [react()],
          build: {
            ssr: path.join(root, "vercel-prerender.tsx"),
            outDir: prerenderDir,
            emptyOutDir: true,
            copyPublicDir: false,
            minify: false,
            rolldownOptions: { output: { entryFileNames: "prerender.mjs" } },
          },
        });
        const prerender = (await import(pathToFileURL(path.join(prerenderDir, "prerender.mjs")).href)) as PrerenderModule;
        const template = await readFile(path.join(outDir, "index.html"), "utf8");
        for (const { route, file } of prerender.routes) {
          await writeFile(path.join(outDir, file), prerender.renderDocument(template, route));
        }
        // Crawl files follow the deployed origin (VITE_SITE_URL), not a hard-coded host.
        await writeFile(path.join(outDir, "robots.txt"), prerender.robotsTxt());
        await writeFile(path.join(outDir, "sitemap.xml"), prerender.sitemapXml());
        // GitHub Pages: serve files as-is, no Jekyll processing.
        await writeFile(path.join(outDir, ".nojekyll"), "");
      } finally {
        await rm(prerenderDir, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderRoutes()],
  build: {
    outDir: "vercel-dist",
    emptyOutDir: true,
  },
});

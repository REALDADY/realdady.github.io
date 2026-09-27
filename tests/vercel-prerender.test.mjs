import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Run after `npm run build:vercel` (see the "test:vercel" script).
// VERCEL_DIST can point the checks at another output directory.
const distDir = new URL(`../${process.env.VERCEL_DIST ?? "vercel-dist"}/`, import.meta.url);
const read = (file) => readFile(new URL(file, distDir), "utf8");
// The build's public origin (VITE_SITE_URL, e.g. GitHub Pages), escaped for RegExp.
const SITE = (process.env.VITE_SITE_URL || "https://amin-built-to-operate.vercel.app").replace(/\/+$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rootMarkup = (html) => html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? "";

test("index.html is prerendered with homepage content and head tags", async () => {
  const html = await read("index.html");
  const root = rootMarkup(html);
  assert.ok(root.length > 5000, "#root contains rendered markup");
  assert.equal((root.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(root, /I design the interface/);
  assert.match(root, /Alrawdah Digital Platform/);
  assert.match(root, /Kifaya/);
  assert.match(root, /amijbari8@gmail\.com/);
  assert.match(root, /971551959820/);
  assert.doesNotMatch(html, /seo:start|seo:end/);
  assert.match(html, /<title>Amin — Designer &amp; Full-Stack Developer in Dubai, UAE<\/title>/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}/" />`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${SITE}/" />`));
  assert.match(html, /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org"/);
  assert.doesNotMatch(html, /falcon-crm-xi|falcon-crm\.png/);
});

test("work.html is prerendered with the full index and its own head tags", async () => {
  const html = await read("work.html");
  const root = rootMarkup(html);
  assert.equal((root.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(root, /The work,/);
  assert.match(root, /Cybersecurity Hardening/);
  assert.match(root, /GamerHub UAE/);
  assert.match(root, /Filter projects by category/);
  assert.match(html, /<title>Work — Web, Product &amp; Enterprise Systems Case Studies \| Amin<\/title>/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}/work" />`));
  assert.doesNotMatch(html, /falcon-crm-xi|falcon-crm\.png/);
});

test("robots.txt and sitemap.xml are deployed", async () => {
  assert.match(await read("robots.txt"), /Sitemap:/);
  assert.match(await read("sitemap.xml"), new RegExp(`<loc>${SITE}/work</loc>`));
});

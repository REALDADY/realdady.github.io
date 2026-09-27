import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const SITE = "https://amin-built-to-operate\\.vercel\\.app";
const countMatches = (html, pattern) => (html.match(pattern) ?? []).length;

test("renders the professional portfolio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /I design the interface/);
  assert.match(html, /I build what makes it work/);
  assert.match(html, /Selected work/);
  assert.match(html, /Alrawdah Digital Platform/);
  assert.match(html, /Infrastructure Transformation/);
  assert.match(html, /Lab \/ experiments/);
  assert.match(html, /Experiments in/);
  assert.match(html, /\/projects\/rs-water\.png/);
  assert.match(html, /\/projects\/haak\.png/);
  assert.match(html, /amijbari8@gmail\.com/);
  assert.match(html, /971551959820/);
  assert.doesNotMatch(html, /cosmos-stage|shooting-star/);
  assert.doesNotMatch(html, /falcon-crm-xi|falcon-crm\.png/);
});

test("homepage tells the full story with clear calls to action", async () => {
  const html = await (await render()).text();
  assert.equal(countMatches(html, /<h1[\s>]/g), 1, "exactly one <h1>");
  assert.match(html, /Start a project/);
  assert.match(html, /wa\.me\/971551959820/);
  for (const title of ["Kifaya", "Revana", "Ticket System", "Bottle Tracking", "Dispatch Console", "GamerHub UAE"]) {
    assert.match(html, new RegExp(title), `${title} is listed`);
  }
  assert.match(html, /Real-time trading terminal/);
  assert.match(html, /Capabilities &amp; stack/);
  assert.match(html, /Process/);
  assert.match(html, /amin@dxb/);
  assert.match(html, /Jump to/);
});

test("homepage ships search metadata and structured data", async () => {
  const html = await (await render()).text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, new RegExp(`<link(?=[^>]*rel="canonical")(?=[^>]*href="${SITE}/?")[^>]*>`));
  assert.match(html, new RegExp(`og:image"[^>]*content="${SITE}/og-systems\\.png"|content="${SITE}/og-systems\\.png"[^>]*og:image"`));
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /"@type":"ProfessionalService"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.match(html, /"addressLocality":"Dubai"/);
});

test("renders the full work route", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The work,/);
  assert.match(html, /Cybersecurity Hardening/);
  assert.match(html, /HRMS &amp; Attendance/);
  assert.match(html, /CONCEPT VISUAL/);
  assert.match(html, /\/projects\/infrastructure-concept\.webp/);
  assert.match(html, /\/projects\/falcon-crm-concept\.webp/);
  assert.doesNotMatch(html, /falcon-crm-xi/);
});

test("work route has category filters, every project and its own metadata", async () => {
  const html = await (await render("/work")).text();
  assert.equal(countMatches(html, /<h1[\s>]/g), 1, "exactly one <h1>");
  assert.match(html, /Filter projects by category/);
  for (const category of ["Products", "Enterprise Systems", "Infrastructure", "Cybersecurity", "ERP / SAP", "Web"]) {
    assert.match(html, new RegExp(`aria-pressed="(true|false)"[^>]*>${category.replace("/", "\\/")}`), `${category} filter`);
  }
  for (const title of ["Kifaya", "Revana", "Ticket System", "Bottle Tracking", "Dispatch Console", "GamerHub UAE"]) {
    assert.match(html, new RegExp(title), `${title} is listed`);
  }
  assert.match(html, /<title>Work — Web, Product/);
  assert.match(html, new RegExp(`<link(?=[^>]*rel="canonical")(?=[^>]*href="${SITE}/work")[^>]*>`));
  assert.doesNotMatch(html, /falcon-crm\.png/);
});

test("uses the supplied four-color brand palette", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const color of ["#ff84ba", "#ffdf82", "#99c2ff", "#ffefe3"]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.match(css, /SPACE LAYER — the site as a flight through a WebGL universe/);
  assert.match(css, /\.space-canvas/);
});

test("homepage ships the space journey without blocking content", async () => {
  const html = await (await render()).text();
  // The WebGL canvas is an empty, decorative shell in the HTML; the scene loads client-side.
  assert.match(html, /<div class="space" aria-hidden="true">/);
  assert.match(html, /<canvas class="space-canvas"><\/canvas>/);
  assert.match(html, /data-hud="depth"/);
  assert.match(html, /data-hscroll/);
  for (const codename of ["Orbit", "Missions", "Systems", "Trajectory", "Lab", "Transmission"]) {
    assert.match(html, new RegExp(`sector-codename">${codename}<`), `${codename} sector`);
  }
  assert.doesNotMatch(html, /WebGLRenderer/, "three.js stays out of the server HTML");
});

test("publishes robots.txt and a sitemap for both routes", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(robots, new RegExp(`Sitemap: ${SITE}/sitemap\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${SITE}/</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${SITE}/work</loc>`));
});

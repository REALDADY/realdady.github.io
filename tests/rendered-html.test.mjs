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

test("renders the professional portfolio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Websites with/);
  assert.match(html, /character/);
  assert.match(html, /Selected live work/);
  assert.match(html, /Selected work/);
  assert.match(html, /Alrawdah Springs Web/);
  assert.match(html, /Infrastructure Transformation/);
  assert.match(html, /Design practice/);
  assert.match(html, /Visual clarity/);
  assert.match(html, /\/projects\/rs-water\.png/);
  assert.match(html, /\/projects\/sahaba\.png/);
  assert.match(html, /\/projects\/haak\.png/);
  assert.match(html, /cosmos-stage/);
  assert.match(html, /shooting-star/);
  assert.doesNotMatch(html, /falcon-crm-xi|falcon-crm\.png/);
});

test("renders the full work route", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The work,/);
  assert.match(html, /Cybersecurity Hardening/);
  assert.match(html, /HRMS &amp; Attendance/);
});

test("uses the supplied four-color brand palette", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const color of ["#ff84ba", "#ffdf82", "#99c2ff", "#ffefe3"]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.match(css, /Deep-space visual system/);
  assert.match(css, /@keyframes starDrift/);
});

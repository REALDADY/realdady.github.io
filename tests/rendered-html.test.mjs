import assert from "node:assert/strict";
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
  assert.match(html, /Business-critical/);
  assert.match(html, /Selected work/);
  assert.match(html, /Alrawdah Digital Platform/);
  assert.match(html, /Infrastructure Transformation/);
  assert.match(html, /Real work,/);
  assert.match(html, /\/projects\/rs-water\.png/);
  assert.match(html, /\/projects\/sahaba\.png/);
  assert.match(html, /\/projects\/haak\.png/);
  assert.doesNotMatch(html, /falcon-crm-xi|falcon-crm\.png/);
});

test("renders the full work route", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A wider view/);
  assert.match(html, /Cybersecurity Hardening/);
  assert.match(html, /HRMS &amp; Attendance/);
});

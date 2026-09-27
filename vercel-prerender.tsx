import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Home from "./app/page";
import { buildHeadTags, robotsTxt, sitemapXml, type RouteKey } from "./app/site-config";

export { robotsTxt, sitemapXml };

/**
 * Build-time entry for the Vercel deployment: renders each route to static
 * HTML so crawlers and first paint get real content. vercel-main.tsx then
 * hydrates the same tree. Must stay free of window/document access.
 */
export const routes: Array<{ route: RouteKey; file: string }> = [
  { route: "home", file: "index.html" },
  { route: "work", file: "work.html" },
];

const HEAD_REGION = /<!--\s*seo:start\b[^>]*-->[\s\S]*?<!--\s*seo:end\s*-->/;
const ROOT_ELEMENT = '<div id="root"></div>';

export function renderDocument(template: string, route: RouteKey) {
  if (!HEAD_REGION.test(template) || !template.includes(ROOT_ELEMENT)) {
    throw new Error("index.html is missing the <!-- seo:start/end --> markers or an empty <div id=\"root\"></div>.");
  }
  const markup = renderToString(
    <StrictMode>
      <Home initialView={route} />
    </StrictMode>,
  );
  return template
    .replace(HEAD_REGION, () => buildHeadTags(route))
    .replace(ROOT_ELEMENT, () => `<div id="root">${markup}</div>`);
}

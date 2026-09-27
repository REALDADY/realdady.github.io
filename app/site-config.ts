import { projects } from "./project-data";

/**
 * Single source of truth for identity, contact details and search metadata.
 * Used by app/layout.tsx (vinext build) and vercel-prerender.tsx (Vercel build),
 * so both deployments describe the site identically. Pure data — no DOM access.
 */
// The public origin, overridable per deployment (e.g. GitHub Pages sets VITE_SITE_URL at build time).
const configuredUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL;
export const SITE_URL = (configuredUrl || "https://amin-built-to-operate.vercel.app").replace(/\/+$/, "");
export const SITE_NAME = "Amin — Designer & Full-Stack Developer";
export const THEME_COLOR = "#07060b";

export const owner = {
  name: "Amin",
  jobTitle: "Designer & Full-Stack Developer",
  summary:
    "Dubai-based designer and full-stack developer. I design websites and product interfaces, build the apps and APIs behind them, and run the infrastructure, security and SAP systems they depend on.",
  locality: "Dubai",
  country: "AE",
  countryName: "United Arab Emirates",
} as const;

export const contact = {
  email: "amijbari8@gmail.com",
  phoneDisplay: "+971 55 195 9820",
  phoneE164: "+971551959820",
  whatsappUrl: "https://wa.me/971551959820",
} as const;

export const whatsappLink = (message?: string) =>
  message ? `${contact.whatsappUrl}?text=${encodeURIComponent(message)}` : contact.whatsappUrl;

export const mailtoLink = (subject?: string, body?: string) => {
  const params = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean);
  return `mailto:${contact.email}${params.length ? `?${params.join("&")}` : ""}`;
};

export const knowsAbout = [
  "Web design",
  "UI/UX design",
  "Creative front-end development",
  "Full-stack web development",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "E-commerce development",
  "Bilingual Arabic / English interfaces",
  "Technical SEO",
  "IT infrastructure",
  "Virtualisation (Proxmox)",
  "Active Directory",
  "Network security (FortiGate)",
  "Cybersecurity hardening",
  "Backup and disaster recovery",
  "SAP Business One",
  "SAP HANA",
];

export type RouteKey = "home" | "work";

export const routeSeo: Record<RouteKey, { path: string; title: string; description: string; ogTitle: string }> = {
  home: {
    path: "/",
    title: "Amin — Designer & Full-Stack Developer in Dubai, UAE",
    description:
      "Dubai-based designer and full-stack developer building websites, web apps and the enterprise systems behind them — infrastructure, cybersecurity and SAP.",
    ogTitle: "Amin — I design the interface. I build what makes it work.",
  },
  work: {
    path: "/work",
    title: "Work — Web, Product & Enterprise Systems Case Studies | Amin",
    description: `${projects.length} case studies from Dubai: commerce websites, product platforms, internal tools, IT infrastructure, cybersecurity hardening and SAP Business One.`,
    ogTitle: "The work, in full — Amin, Dubai",
  },
};

export const ogImage = {
  url: `${SITE_URL}/og-systems.png`,
  width: 1200,
  height: 630,
  alt: "Amin — designer and full-stack developer in Dubai",
} as const;

export const absoluteUrl = (path: string) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

export function buildJsonLd() {
  const personId = `${SITE_URL}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: owner.name,
        jobTitle: owner.jobTitle,
        description: owner.summary,
        url: `${SITE_URL}/`,
        image: ogImage.url,
        email: `mailto:${contact.email}`,
        telephone: contact.phoneE164,
        address: { "@type": "PostalAddress", addressLocality: owner.locality, addressCountry: owner.country },
        knowsAbout,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: routeSeo.home.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: `${owner.name} — Design & Engineering`,
        description: owner.summary,
        url: `${SITE_URL}/`,
        image: ogImage.url,
        email: contact.email,
        telephone: contact.phoneE164,
        address: { "@type": "PostalAddress", addressLocality: owner.locality, addressCountry: owner.country },
        founder: { "@id": personId },
        knowsAbout,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            "Web design and creative development",
            "Full-stack web and product development",
            "Enterprise and internal business systems",
            "IT infrastructure and disaster recovery",
            "Cybersecurity hardening",
            "SAP Business One / HANA",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/work#projects`,
        name: "Projects and case studies",
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: project.title,
            description: project.shortDescription,
            url: project.liveUrl ?? `${SITE_URL}/work#case/${project.slug}`,
            genre: project.category,
            keywords: project.technologies.join(", "),
            creator: { "@id": personId },
          },
        })),
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json"> body; `<` is escaped so it can never close the tag. */
export const serializeJsonLd = () => JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");

const escapeAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Route-specific <head> tags for the statically prerendered Vercel build. */
export function buildHeadTags(route: RouteKey) {
  const seo = routeSeo[route];
  const url = absoluteUrl(seo.path);
  const meta = (attribute: "name" | "property", key: string, content: string | number) =>
    `<meta ${attribute}="${key}" content="${escapeAttribute(String(content))}" />`;

  return [
    `<title>${escapeAttribute(seo.title)}</title>`,
    meta("name", "description", seo.description),
    `<link rel="canonical" href="${url}" />`,
    meta("name", "author", owner.name),
    meta("name", "robots", "index, follow, max-image-preview:large"),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:locale", "en_AE"),
    meta("property", "og:url", url),
    meta("property", "og:title", seo.ogTitle),
    meta("property", "og:description", seo.description),
    meta("property", "og:image", ogImage.url),
    meta("property", "og:image:width", ogImage.width),
    meta("property", "og:image:height", ogImage.height),
    meta("property", "og:image:alt", ogImage.alt),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", seo.ogTitle),
    meta("name", "twitter:description", seo.description),
    meta("name", "twitter:image", ogImage.url),
    meta("name", "twitter:image:alt", ogImage.alt),
    `<script type="application/ld+json">${serializeJsonLd()}</script>`,
  ].join("\n    ");
}

/** robots.txt and sitemap.xml for the deployed origin, written by the static build. */
export const robotsTxt = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

export const sitemapXml = (lastmod = new Date().toISOString().slice(0, 10)) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(Object.keys(routeSeo) as RouteKey[]).map((route) => `  <url>
    <loc>${absoluteUrl(routeSeo[route].path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === "home" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>
`;

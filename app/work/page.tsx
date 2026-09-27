import type { Metadata } from "next";
import Home from "../page";
import { absoluteUrl, ogImage, routeSeo, SITE_NAME } from "../site-config";

const seo = routeSeo.work;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: absoluteUrl(seo.path) },
  openGraph: {
    type: "website",
    url: absoluteUrl(seo.path),
    siteName: SITE_NAME,
    locale: "en_AE",
    title: seo.ogTitle,
    description: seo.description,
    images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.ogTitle,
    description: seo.description,
    images: [ogImage.url],
  },
};

export default function WorkPage() {
  return <Home initialView="work" />;
}

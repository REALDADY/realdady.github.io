import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Unbounded } from "next/font/google";
import "./globals.css";
import { absoluteUrl, ogImage, owner, routeSeo, serializeJsonLd, SITE_NAME, SITE_URL, THEME_COLOR } from "./site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Kept in sync with the Vercel prerender through app/site-config.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: routeSeo.home.title,
  description: routeSeo.home.description,
  applicationName: SITE_NAME,
  authors: [{ name: owner.name, url: absoluteUrl("/") }],
  creator: owner.name,
  keywords: [
    "designer Dubai",
    "full-stack developer Dubai",
    "web designer Dubai",
    "creative developer UAE",
    "UI UX designer UAE",
    "React developer Dubai",
    "Next.js developer",
    "ecommerce development UAE",
    "enterprise systems",
    "IT infrastructure engineer UAE",
    "cybersecurity hardening",
    "SAP Business One HANA",
  ],
  alternates: { canonical: absoluteUrl(routeSeo.home.path) },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: absoluteUrl(routeSeo.home.path),
    siteName: SITE_NAME,
    locale: "en_AE",
    title: routeSeo.home.ogTitle,
    description: routeSeo.home.description,
    images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: routeSeo.home.ogTitle,
    description: routeSeo.home.description,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${instrumentSerif.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd() }} />
        {children}
      </body>
    </html>
  );
}

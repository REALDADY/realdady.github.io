import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og-systems.png`;

  return {
    title: "Amin — Web Designer & Creative Developer in Dubai",
    description:
      "Web design, creative development and product experiences backed by serious software and systems expertise.",
    keywords: [
      "software developer Dubai",
      "web designer Dubai",
      "creative developer Dubai",
      "UI UX designer UAE",
      "digital solutions",
      "enterprise systems",
      "digital transformation UAE",
      "SAP Business One HANA",
      "IT infrastructure",
      "React developer",
      "ecommerce development UAE",
    ],
    openGraph: {
      title: "Amin — Web experiences, designed to work.",
      description: "Web design, creative development and product experience from Dubai.",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Amin — Business-critical systems, built well" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Amin — Web experiences, designed to work.",
      description: "Web design, creative development and product experience from Dubai.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}

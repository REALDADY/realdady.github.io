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
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Amin — Software Developer & Digital Solutions Builder",
    description:
      "Selected product work spanning secure operational systems, bilingual commerce, digital platforms and production-grade web experiences.",
    keywords: [
      "software developer Dubai",
      "digital solutions",
      "web application development",
      "React developer",
      "ecommerce development UAE",
    ],
    openGraph: {
      title: "Amin — Digital products built to operate.",
      description: "Secure systems, commerce platforms and production digital products.",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Amin — Digital products built to operate" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Amin — Digital products built to operate.",
      description: "Secure systems, commerce platforms and production digital products.",
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

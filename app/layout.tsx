import type { Metadata, Viewport } from "next";
import "../styles/base.css";

const SITE_URL = "https://dawidbubnow.com";

const TITLE = "WEBBOSS — Dawid Bubnow, Creative Web Designer & Developer";
const DESCRIPTION =
  "WEBBOSS is the studio of Dawid Bubnow — independent web design and frontend development from Warsaw, where design and code are one discipline. Selected work: Atelier 27, Matura 2027, Forge, SafeRoad, Anna Szydłowska, Veronika English.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Dawid Bubnow" }],
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: {
    type: "website",
    siteName: "WEBBOSS",
    title: TITLE,
    description:
      "Design without code is a picture. Code without design is a page. Independent design and frontend from Warsaw.",
    url: "/",
    locale: "en_GB",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Dawid Bubnow, creative web designer and developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Design without code is a picture. Code without design is a page.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "WEBBOSS",
  url: `${SITE_URL}/`,
  email: "mailto:daveditcreation@gmail.com",
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Warsaw",
    addressCountry: "PL",
  },
  founder: {
    "@type": "Person",
    name: "Dawid Bubnow",
    jobTitle: "Creative Web Designer & Developer",
    knowsAbout: ["Web design", "UI/UX", "Art direction", "React", "TypeScript"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* self-hosted: preload only the two faces used above the fold */}
        <link
          rel="preload"
          href="/fonts/archivo-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/instrument-serif-italic-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

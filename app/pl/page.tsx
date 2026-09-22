import type { Metadata } from "next";
import Portfolio from "../../components/Portfolio";

const TITLE = "WEBBOSS — Dawid Bubnow, web designer i frontend developer";
const DESCRIPTION =
  "WEBBOSS to studio Dawida Bubnowa — niezależny web design i frontend z Warszawy, gdzie projekt i kod to jedna dyscyplina. Wybrane realizacje: Atelier 27, Matura 2027, Forge, SafeRoad, Anna Szydłowska, Veronika English.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pl", languages: { en: "/", pl: "/pl" } },
  openGraph: {
    type: "website",
    siteName: "WEBBOSS",
    title: TITLE,
    description: "Design bez kodu to tylko obraz. Kod bez designu to tylko strona. Niezależny design i frontend z Warszawy.",
    url: "/pl",
    locale: "pl_PL",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Dawid Bubnow, web designer i frontend developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Design bez kodu to tylko obraz. Kod bez designu to tylko strona.",
    images: ["/og.jpg"],
  },
};

export default function HomePl() {
  return <Portfolio lang="pl" />;
}

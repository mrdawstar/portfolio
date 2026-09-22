import type { Metadata } from "next";
import Growth from "../../components/grow/Growth";

const TITLE = "Od kliknięcia do klienta — WEBBOSS";
const DESCRIPTION =
  "Reklamy Meta, landing page, formularz i follow-up jako jeden system pozyskiwania klientów. Jedna osoba odpowiada za całą drogę — od kliknięcia do klienta.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/klienci" },
  openGraph: {
    type: "website",
    siteName: "WEBBOSS",
    title: TITLE,
    description:
      "Twoje reklamy nie potrzebują więcej kliknięć. Potrzebują lepszego miejsca, do którego prowadzą.",
    url: "/klienci",
    locale: "pl_PL",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "WEBBOSS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Twoje reklamy nie potrzebują więcej kliknięć. Potrzebują lepszego miejsca, do którego prowadzą.",
    images: ["/og.jpg"],
  },
};

export default function Klienci() {
  return <Growth />;
}

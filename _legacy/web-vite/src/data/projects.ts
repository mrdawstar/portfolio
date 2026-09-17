/** A project scene in Selected Work.
 *
 *  `scene` carries art direction lifted from the real site, so each panel
 *  inherits its project's personality instead of five identical cards. The
 *  WEBBOSS system still owns the type, spacing and metadata treatment. */
export interface Project {
  id: string;
  /** display name, set in the oversized project type */
  name: string;
  /** what it is, in the metadata row */
  category: string;
  year: string;
  /** the live site this panel links to */
  url: string;
  /** domain or honest status, shown as metadata */
  link: string;
  /** one line in the project's own voice */
  tagline: string;
  /** how the panel is composed */
  layout: "figure" | "product" | "service" | "portrait" | "warm";
  scene: {
    /** panel ground */
    bg: string;
    /** type colour on that ground */
    ink: string;
    /** muted metadata colour */
    muted: string;
    /** the project's own accent, used only for its hairline and index */
    accent: string;
    /** true when the panel is light, so the stage inverts its chrome */
    light?: boolean;
  };
  images: { desktop: string; phone: string };
}

export const projects: Project[] = [
  {
    id: "atelier27",
    name: "Atelier 27",
    category: "Architecture — Digital experience",
    year: "2026",
    url: "https://atelier27-omega.vercel.app/",
    link: "atelier27.vercel.app",
    tagline: "A quieter way to belong.",
    layout: "figure",
    // pale stone, thin serif, architectural render — the one light scene
    scene: {
      bg: "#e7e5e0",
      ink: "#14110d",
      muted: "#6f6a62",
      accent: "#14110d",
      light: true,
    },
    images: { desktop: "atelier27-desktop", phone: "atelier27-phone" },
  },
  {
    id: "forge",
    name: "Forge",
    category: "Product design — Frontend",
    year: "2026",
    url: "https://forgebetter.app/",
    link: "forgebetter.app",
    tagline: "A day you earn, not one you tick.",
    layout: "product",
    // cinematic near-black with a cold blue cast
    scene: {
      bg: "#07090e",
      ink: "#f2f4f8",
      muted: "#7e8592",
      accent: "#7fa4d6",
    },
    images: { desktop: "forge-desktop", phone: "forge-phone" },
  },
  {
    id: "saferoad",
    name: "SafeRoad",
    category: "Web design — Frontend development",
    year: "2026",
    url: "https://www.szkolasr.pl/",
    link: "szkolasr.pl",
    tagline: "Clarity before persuasion.",
    layout: "service",
    // bright, real-world service — light panel, blue accent from the brand
    scene: {
      bg: "#eef0f2",
      ink: "#0d1420",
      muted: "#5d6673",
      accent: "#1b4f9c",
      light: true,
    },
    images: { desktop: "saferoad-desktop", phone: "saferoad-phone" },
  },
  {
    id: "law",
    name: "Anna Szydłowska",
    category: "Law office — Brand & website",
    year: "2026",
    url: "https://adwokat-anna-szydlowska.vercel.app/",
    link: "Kancelaria Adwokacka",
    tagline: "Composure, rendered in gold.",
    layout: "portrait",
    // deep green-black and gold, elegant serif
    scene: {
      bg: "#0b1210",
      ink: "#f0ece2",
      muted: "#8a8a7c",
      accent: "#c9a227",
    },
    images: { desktop: "law-desktop", phone: "law-phone" },
  },
  {
    id: "english",
    name: "Veronika English",
    category: "Education — Landing page",
    year: "2026",
    url: "https://wakacyjny-kurs-angielskiego.vercel.app/",
    link: "Wakacyjny kurs angielskiego",
    tagline: "Warmth is a conversion strategy.",
    layout: "warm",
    // cream ground, olive accent
    scene: {
      bg: "#f7f5e9",
      ink: "#1d2416",
      muted: "#6b7358",
      accent: "#4c6b2a",
      light: true,
    },
    images: { desktop: "english-desktop", phone: "english-phone" },
  },
];

/** Every visible string on the portfolio page, in both languages.
 *
 *  English is the default (`/`), Polish lives at `/pl`. The Polish copy is
 *  written, not translated word for word: the display lines are rebuilt so
 *  they still land as statements at display size. Project names, URLs and
 *  years are shared and stay in data/projects.ts. */

export type Lang = "en" | "pl";

const en = {
  lang: "en" as Lang,
  home: "/",
  skip: "Skip to selected work",
  sections: {
    top: { label: "Index" },
    manifesto: { label: "Manifesto" },
    work: { label: "Selected work", short: "Work" },
    discipline: { label: "One discipline" },
    about: { label: "About", short: "About" },
    contact: { label: "Contact", short: "Contact" },
  },
  nav: {
    backToTop: "back to top",
    menu: "Menu",
    close: "Close",
    sections: "Sections",
    available: "Available",
  },
  hero: {
    role: "Creative web designer & developer",
    roleMobile: ["Creative web designer", "& developer"],
    location: "Warsaw — Poland",
    city: "Warsaw",
    alt: "creative web designer and developer",
    available: "Available for select projects",
    availableShort: "Available",
    cta: "Selected work",
    ctaShort: "Work",
  },
  manifesto: {
    lineA: ["Design", "without", "code", "is", "a", "picture."],
    lineB: ["Code", "without", "design", "is", "a"],
    tail: "page",
  },
  work: {
    heading: "Selected work",
    count: (n: string) => `${n} projects`,
    open: "open the live site in a new tab",
    view: "View project",
  },
  dxc: {
    label: "One discipline",
    a: "Design",
    b: "Code",
    and: "and",
    note: "Art direction, interface and frontend — decided together, built by one pair of hands.",
  },
  about: {
    label: "About",
    role: (brand: string) => `Designer & developer behind ${brand}`,
    lineA: ["Designer's", "eye."],
    lineB: ["Developer's", "precision."],
    lede: "I design and build digital experiences where visual identity and frontend execution are treated as one discipline.",
    facts: ["Based in Warsaw", "Working remotely", "EN / PL"],
    portrait: "portrait",
  },
  contact: {
    label: "Contact",
    lineA: "Let's build",
    lineB: ["something", "memorable."],
    cta: "Start a project",
  },
  footer: {
    built: "Designed & built in Warsaw",
    grow: "Client acquisition ↗",
    top: "Back to top ↑",
  },
  projects: {} as Record<string, { category: string; tagline: string }>,
};

export type Copy = typeof en;

const pl: Copy = {
  lang: "pl",
  home: "/pl",
  skip: "Przejdź do wybranych realizacji",
  sections: {
    top: { label: "Start" },
    manifesto: { label: "Manifest" },
    work: { label: "Wybrane realizacje", short: "Projekty" },
    discipline: { label: "Jedna dyscyplina" },
    about: { label: "O mnie", short: "O mnie" },
    contact: { label: "Kontakt", short: "Kontakt" },
  },
  nav: {
    backToTop: "do góry",
    menu: "Menu",
    close: "Zamknij",
    sections: "Sekcje",
    available: "Dostępny",
  },
  hero: {
    role: "Web designer & frontend developer",
    roleMobile: ["Web designer", "& frontend developer"],
    location: "Warszawa — Polska",
    city: "Warszawa",
    alt: "web designer i frontend developer",
    available: "Przyjmuję wybrane projekty",
    availableShort: "Dostępny",
    cta: "Wybrane realizacje",
    ctaShort: "Realizacje",
  },
  manifesto: {
    lineA: ["Design", "bez", "kodu", "to", "tylko", "obraz."],
    lineB: ["Kod", "bez", "designu", "to", "tylko"],
    tail: "strona",
  },
  work: {
    heading: "Wybrane realizacje",
    count: (n: string) => `${n} projektów`,
    open: "otwórz stronę w nowej karcie",
    view: "Zobacz projekt",
  },
  dxc: {
    label: "Jedna dyscyplina",
    a: "Design",
    b: "Kod",
    and: "i",
    note: "Kierunek artystyczny, interfejs i frontend — decyzje podejmowane razem, wykonanie w jednych rękach.",
  },
  about: {
    label: "O mnie",
    role: (brand: string) => `Designer i developer stojący za ${brand}`,
    lineA: ["Oko", "projektanta."],
    lineB: ["Precyzja", "kodu."],
    lede: "Projektuję i buduję strony, w których identyfikacja wizualna i frontend są traktowane jak jedna dyscyplina.",
    facts: ["Warszawa", "Pracuję zdalnie", "PL / EN"],
    portrait: "portret",
  },
  contact: {
    label: "Kontakt",
    lineA: "Zbudujmy coś,",
    lineB: ["czego nie", "zapomną."],
    cta: "Zacznijmy projekt",
  },
  footer: {
    built: "Zaprojektowane i zbudowane w Warszawie",
    grow: "Pozyskiwanie klientów ↗",
    top: "Do góry ↑",
  },
  projects: {
    atelier27: {
      category: "Architektura — Doświadczenie cyfrowe",
      tagline: "Spokojniejszy sposób, by poczuć się u siebie.",
    },
    matura: {
      category: "Edukacja — Landing kursu",
      // the site's own line, in its original language
      tagline: "Mniej stresu. Więcej „I can”.",
    },
    forge: {
      category: "Projekt produktu — Frontend",
      tagline: "Dzień, na który się zapracowuje, a nie odhacza.",
    },
    saferoad: {
      category: "Web design — Frontend",
      tagline: "Najpierw jasność, potem perswazja.",
    },
    law: {
      category: "Kancelaria — Marka i strona",
      tagline: "Spokój, wyrażony w złocie.",
    },
    english: {
      category: "Edukacja — Landing page",
      tagline: "Ciepło to strategia konwersji.",
    },
  },
};

export const copy: Record<Lang, Copy> = { en, pl };

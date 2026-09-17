/** Identity and contact. Only verified details belong here.
 *
 *  Two names, deliberately not equal weight:
 *  `brand` is the studio the site lives under and owns the navigation;
 *  `name` is the person behind it and owns the hero and About.
 *  They should never appear side by side competing in the same bar. */
export const site = {
  brand: "WEBBOSS",
  name: "Dawid Bubnow",
  role: "Creative web designer & developer",
  location: "Warsaw — Poland",
  year: "2026",
  email: "daveditcreation@gmail.com",
  url: "https://dawidbubnow.com",
  description:
    "WEBBOSS — the studio of Dawid Bubnow. Independent web design and frontend development from Warsaw, where design and code are one discipline.",
} as const;

/** Section index — drives both the nav links and the running "01 — Index" state. */
export const sections = [
  { id: "top", num: "01", label: "Index", nav: false },
  { id: "manifesto", num: "02", label: "Manifesto", nav: false },
  { id: "work", num: "03", label: "Selected work", nav: true, short: "Work" },
  { id: "discipline", num: "04", label: "One discipline", nav: false },
  { id: "about", num: "05", label: "About", nav: true, short: "About" },
  { id: "contact", num: "06", label: "Contact", nav: true, short: "Contact" },
] as const;

export type Section = (typeof sections)[number];

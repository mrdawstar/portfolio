/** Copy and proof for /klienci — the acquisition offer.
 *
 *  Only verified facts belong in `proof`. Anything left `null` is simply not
 *  rendered: the page never shows a placeholder number. When the real figure
 *  arrives (from the client, or an Ads Manager export), fill it in here. */

export const growth = {
  path: "/klienci",
  offer: "Od kliknięcia do klienta",

  /** Optional direct channels. Rendered only when set. */
  instagram: null as string | null, // e.g. "https://instagram.com/webboss"
  whatsapp: "https://wa.me/48796425392?text=" +
    encodeURIComponent("Dzień dobry, chcę audyt wycieków. Moja strona / Instagram: "),
  phone: "+48 796 425 392",
  phoneHref: "tel:+48796425392",

  /** Capacity. Dawid runs every account himself, so the limit is real: ads,
   *  landing and follow-up for more than three new firms a month would not
   *  get done properly. Update `taken` by hand when a pilot is signed; it
   *  resets to 0 at the start of each month. */
  capacity: 3,
  taken: 1,
};

/** Veronika's words, lightly edited for length. Her message: huge thanks
 *  for the growth, she found clients very fast after searching a long time,
 *  and the strategy we built still brings her new ones. Nothing is added. */
export const testimonial = {
  pull: "Długo szukałam klientów. Z Dawidem znalazłam ich bardzo szybko.",
  body: "Ogromnie dziękuję za ten wzrost. Razem wypracowaliśmy strategię, która działa do dziś — nowi uczniowie wciąż do mnie przychodzą.",
  name: "Veronika Wise",
  role: "Veronika English · szkoła angielskiego",
  initials: "VW",
} as const;

export const proof = {
  client: "Veronika English",
  sector: "Szkoła angielskiego · kurs maturalny",
  /** The matura platform the ads sent people to — the case wears its colours. */
  url: "https://matura2027.vercel.app/",
  urlLabel: "matura2027.vercel.app",
  followersFrom: 8941,
  followersTo: 17700,
  /** +70%, derived rather than typed so the two can never disagree */
  get growthPct() {
    return Math.round((this.followersTo / this.followersFrom - 1) * 100);
  },
  /** New clients / students won through the ads — the figure the client
   *  states in her own Instagram bio. */
  newClients: "200+",
  /** Monthly gross volume in Stripe, best month of each 12-month window:
   *  Nov 2024 – Nov 2025 (before) vs Aug 2025 – Aug 2026 (after). The
   *  screenshots in captures/case-*.{jpg,webp} are the source. */
  revenueBefore: 295,
  revenueAfter: 41357,
  get revenueMultiple() {
    return Math.floor(this.revenueAfter / this.revenueBefore);
  },
  /** Where the money came from, as Dawid reports it (rounded, approximate —
   *  shown with "ok." on the page). Replace with exact figures when known. */
  streams: [
    { label: "Zapisy uczniów do szkoły", amount: 30000 },
    { label: "Kursy maturalne", amount: 10000 },
  ],
};

export const leaks = [
  {
    title: "Strona, która ładuje się za długo.",
    note: "Ludzie z Instagrama nie czekają. Zamykają kartę, zanim zobaczą ofertę.",
  },
  {
    title: "Strona o wszystkim i o niczym.",
    note: "Reklama obiecała jedno, strona mówi o czymś innym. Klient wraca do scrollowania.",
  },
  {
    title: "Formularz na dziewięć pól.",
    note: "Każde pole to kolejny powód, żeby zrezygnować. Resztę można ustalić w rozmowie.",
  },
  {
    title: "Odpowiedź po dwóch dniach.",
    note: "Zapytanie przyszło. Zanim ktoś oddzwonił, klient podpisał umowę z konkurencją.",
  },
] as const;

export const stages = [
  {
    key: "Reklama",
    usual: "Podbity post i nadzieja.",
    mine: "Kreacja, która mówi do jednej osoby z jednym problemem — i obiecuje dokładnie to, co pokaże strona.",
  },
  {
    key: "Strona",
    usual: "Link do strony głównej albo do profilu.",
    mine: "Landing pod tę jedną reklamę: jedna obietnica, dowód, jeden następny krok. Szybki na telefonie.",
  },
  {
    key: "Zapytanie",
    usual: "Formularz, który odstrasza. Dane, które nigdzie nie trafiają.",
    mine: "Krótki formularz i pełny tracking — wiesz, która reklama przyniosła które zapytanie.",
  },
  {
    key: "Follow-up",
    usual: "Ktoś oddzwoni. Kiedyś.",
    mine: "Odpowiedź w minutę, przypomnienia i jasne kolejne kroki. Żadne zapytanie nie stygnie.",
  },
  {
    key: "Klient",
    usual: "Nie wiadomo, co zadziałało.",
    mine: "Raport w złotówkach, nie w lajkach: ile kosztował klient i co poprawić w kolejnym miesiącu.",
  },
] as const;

export const caseMoves = [
  {
    title: "Reklamy Meta",
    note: "Ustawienie i prowadzenie kampanii: kreacje, grupy odbiorców, testowanie komunikatów.",
  },
  {
    title: "Platforma kursu",
    note: "Strona kursu maturalnego, na którą trafiał ruch z reklam — zaprojektowana i zakodowana przeze mnie.",
  },
  {
    title: "Całość procesu",
    note: "Prowadzenie marketingu od reklamy do zapisu — na kurs maturalny i do szkoły. Jedna osoba, jeden cel: nowi uczniowie.",
  },
] as const;

export const scope = [
  { title: "Reklamy Meta", note: "Strategia, kreacje, grupy odbiorców, testy." },
  { title: "Landing page", note: "Projekt i kod — pod konkretną reklamę i konkretnego klienta." },
  { title: "Formularz i tracking", note: "Pixel, Conversions API, GA4. Każde zapytanie ma źródło." },
  { title: "Follow-up", note: "Automatyczna odpowiedź w minutę: e-mail, SMS, przypomnienia." },
  { title: "Kreacje", note: "Grafiki i krótkie wideo, które wyglądają jak Twoja marka, nie jak reklama." },
  { title: "Raport", note: "Jeden, czytelny — dla właściciela, nie dla marketera." },
] as const;

export const industries = [
  "Meble i kuchnie na wymiar",
  "Remonty premium",
  "Architektura i wnętrza",
  "Pergole i tarasy",
  "Detailing",
  "Szkoły i edukacja",
] as const;

export const steps = [
  {
    title: "Audyt wycieków",
    tag: "Za darmo · 48 h",
    note: "Nagrywam 5–10 minut wideo: przechodzę Twoją drogę od reklamy do kontaktu i pokazuję trzy największe wycieki.",
  },
  {
    title: "Pilot 30 dni",
    tag: "Pierwszy miesiąc",
    note: "Naprawiamy najsłabsze ogniwo i uruchamiamy kampanię. Po 30 dniach patrzysz na liczby, nie na obietnice.",
  },
  {
    title: "System",
    tag: "Co miesiąc",
    note: "Reklamy, testy, poprawki strony i follow-upu. Jedna osoba odpowiada za całość.",
  },
] as const;

/** The four things a cold visitor asks before replying. Short answers: the
 *  page is read in under a minute. */
export const faq = [
  {
    q: "Ile to kosztuje?",
    a: "Audyt jest za darmo. Stawkę i budżet reklamowy ustalamy po nim — zależą od tego, ilu klientów potrzebujesz i ile jest wart jeden.",
  },
  {
    q: "Mam tylko Instagram, nie mam strony.",
    a: "Najczęstszy przypadek. Wtedy zaczynamy od strony, na którą prowadzi reklama — to ona zamienia kliknięcia w zapytania.",
  },
  {
    q: "Czy to zadziała w mojej branży?",
    a: "Działa tam, gdzie jeden klient jest wart tysiące. Jeśli nie uwierzę, że u Ciebie zadziała, powiem to w audycie i nie zaproponuję współpracy.",
  },
  {
    q: "Mam już kogoś od reklam.",
    a: "To zwykle znaczy, że problem nie leży w reklamach, tylko w tym, co dzieje się po kliknięciu. Audyt to pokaże — nikogo nie musisz zmieniać.",
  },
] as const;

export const clientValues = [
  "do 2 000 zł",
  "2 000 – 10 000 zł",
  "10 000 – 50 000 zł",
  "powyżej 50 000 zł",
] as const;

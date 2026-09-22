import { useInView } from "../../hooks/useInView";
import { Picture } from "../Picture";
import { plNum } from "../../lib/track";
import { proof, caseMoves } from "../../data/growth";

const fmt = plNum;

/** A number that rolls like a counter: every digit is a column of 0–9 that
 *  travels from the start value's digit to the end value's. Only the digits
 *  that actually change move — 10 000 → 17 000 turns one wheel. */
function Odometer({ from, to, run }: { from: number; to: number; run: boolean }) {
  const a = fmt(from);
  const b = fmt(to);
  const width = Math.max(a.length, b.length);
  const start = a.padStart(width, " ");
  const end = b.padStart(width, " ");

  return (
    <span className="odo" aria-label={`${fmt(from)} → ${fmt(to)}`}>
      {end.split("").map((ch, i) => {
        if (!/\d/.test(ch)) {
          return (
            <span key={i} className="odo__sep" aria-hidden="true">
              {ch === " " ? "\u2009" : ch}
            </span>
          );
        }
        // a digit the start value did not have (295 → 41 357) fades in as it
        // rolls, instead of showing as a leading zero before the roll
        const fresh = !/\d/.test(start[i]);
        const d0 = fresh ? 0 : Number(start[i]);
        const d = run ? Number(ch) : d0;
        return (
          <span
            key={i}
            className="odo__col"
            aria-hidden="true"
            style={fresh ? { opacity: run ? 1 : 0, transition: `opacity 900ms ease ${300 + i * 60}ms` } : undefined}
          >
            <span
              className="odo__reel"
              style={{
                transform: `translateY(${-d * 10}%)`,
                transitionDelay: `${300 + i * 60}ms`,
              }}
            >
              {Array.from({ length: 10 }, (_, k) => (
                <span key={k}>{k}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

const RECEIPTS = [
  {
    label: "instagram",
    shots: [
      {
        name: "ig-before" as const,
        when: "Przed",
        note: "Instagram · 8 941 obserwujących",
        alt: "Instagram klientki przed współpracą: 8 941 obserwujących",
      },
      {
        name: "ig-after" as const,
        when: "Po",
        note: "Instagram · 17,7 tys. obserwujących",
        alt: "Instagram klientki po współpracy: 17,7 tys. obserwujących",
      },
    ],
  },
  {
    label: "stripe",
    shots: [
      {
        name: "case-before" as const,
        when: "Przed",
        note: "Stripe · lis 2024 – lis 2025",
        alt: "Stripe, przychód listopad 2024 – listopad 2025: najlepszy miesiąc 295 zł",
      },
      {
        name: "case-after" as const,
        when: "Po",
        note: "Stripe · sie 2025 – sie 2026",
        alt: "Stripe, przychód sierpień 2025 – sierpień 2026: najlepszy miesiąc 41 357,21 zł",
      },
    ],
  },
];

/** 01 — the proof. The panel takes on the client's own ground (cream, olive),
 *  the way every project in Selected Work carries its site's personality.
 *
 *  Hierarchy is deliberate: money first (the monthly revenue rolls from the
 *  best month before to the best month after), then new clients, then reach.
 *  The raw Stripe screenshots follow as the receipt. */
export function Case({ motion }: { motion: boolean }) {
  const [root, seen] = useInView<HTMLElement>("-20% 0px -20% 0px");
  const run = seen || !motion;

  return (
    <section
      id="case"
      ref={root}
      className={`gcase${seen ? " is-seen" : ""}`}
      aria-labelledby="case-heading"
    >
      <div className="gcase__top">
        <div className="index-row">
          <span className="meta gcase__accent">01</span>
          <span className="meta nowrap">Wynik — {proof.client}</span>
        </div>
        <span className="meta nowrap gcase__sector">{proof.sector}</span>
      </div>

      <h2 id="case-heading" className="gcase__title">
        <span className="lineMask" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="lineMask__in">{proof.newClients} nowych klientów.</span>
        </span>
        <span className="lineMask" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="lineMask__in">
            Ponad 40 tys. zł <em className="serif">w miesiąc.</em>
          </span>
        </span>
      </h2>

      <div className="gcase__figures">
        <div className="gcase__big">
          <p className="gcase__money">
            <Odometer from={proof.revenueBefore} to={proof.revenueAfter} run={run} />
            <span className="gcase__unit">zł</span>
          </p>
          <p className="meta gcase__cap">
            Przychód w najlepszym miesiącu · wcześniej {fmt(proof.revenueBefore)} zł
          </p>
        </div>
        <p className="gcase__pct">
          ×{proof.revenueMultiple}
        </p>
      </div>

      <ul className="gcase__stats">
        <li>
          <span className="gcase__statV">{proof.newClients}</span>
          <span className="meta">Nowych klientów i uczniów</span>
        </li>
        <li>
          <span className="gcase__statV">
            {fmt(proof.followersFrom)} → {fmt(proof.followersTo)}
          </span>
          <span className="meta">Obserwujący na Instagramie · +{proof.growthPct}%</span>
        </li>
      </ul>

      <div className="gcase__proofs">
        <p className="meta gcase__proofsH">Zrzuty z konta klientki</p>

        {RECEIPTS.map((row) => (
          <div key={row.label} className="gcase__receipts">
            {row.shots.map((shot) => (
              <figure key={shot.name} className="gcase__receipt" data-when={shot.when}>
                <figcaption className="gcase__rcap">
                  <span className="meta gcase__accent">{shot.when}</span>
                  <span className="meta">{shot.note}</span>
                </figcaption>
                <div className="gcase__rimg">
                  <Picture name={shot.name} alt={shot.alt} sizes="(max-width: 759px) 92vw, 44vw" />
                </div>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <div className="gcase__grid">
        <ol className="gcase__moves">
          {caseMoves.map((m, i) => (
            <li key={m.title}>
              <span className="meta gcase__accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="gcase__moveT">{m.title}</p>
                <p className="gcase__moveN">{m.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <figure className="gcase__shot">
          <a href={proof.url} target="_blank" rel="noopener noreferrer" className="gcase__frame">
            <Picture
              name="english-desktop"
              alt="Landing page kursu Veronika English"
              sizes="(max-width: 759px) 92vw, 54vw"
            />
          </a>
          <figcaption className="gcase__figcap">
            Tu trafiali ludzie z reklam. <span>Tę stronę też zaprojektowałem i zbudowałem.</span>
          </figcaption>
        </figure>
      </div>

      <p className="gcase__honest">
        Każda liczba na tej stronie jest prawdziwa: przychód pochodzi ze Stripe, zasięg
        z Instagrama, liczba uczniów z profilu klientki. Zrzuty powyżej są oryginalne.
      </p>
    </section>
  );
}

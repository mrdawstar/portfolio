import { useEffect, useRef, useState } from "react";
import { useScrollEffect } from "../../hooks/useScrollEffect";
import { clamp } from "../../lib/driver";
import { plNum } from "../../lib/track";
import { proof } from "../../data/growth";
import { track } from "../../lib/track";

const fmt = plNum;

/** 00 — the result in three seconds.
 *
 *  The lead-in line strikes out "more clicks" as the headline rises, so the
 *  argument is made by the motion before it is read. Proof sits above the
 *  fold: nobody arriving from a DM should have to scroll to find a reason to
 *  believe. */
export function GrowHero({
  motion,
  isMobile,
  preparedFor,
}: {
  motion: boolean;
  isMobile: boolean;
  preparedFor: string | null;
}) {
  const shift = useRef<HTMLDivElement>(null);
  // Entrance is flipped one painted frame after mount — flipping in the same
  // commit gives the transition no closed state to start from.
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setSeen(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  useScrollEffect(({ vh, scrollY }) => {
    const el = shift.current;
    if (!el) return;
    const t = clamp(scrollY / vh, 0, 1);
    el.style.transform = `translate3d(0, ${(-t * vh * 0.12).toFixed(1)}px, 0)`;
    el.style.opacity = String(1 - t * 0.7);
  }, motion);

  const lines = isMobile
    ? [
        <>Potrzebują</>,
        <em className="serif">lepszego miejsca,</em>,
        <>do którego</>,
        <>
          prowadzą<span className="stop">.</span>
        </>,
      ]
    : [
        <>Potrzebują</>,
        <em className="serif">lepszego miejsca,</em>,
        <>
          do którego prowadzą<span className="stop">.</span>
        </>,
      ];

  return (
    <section id="top" className={`ghero${seen ? " is-seen" : ""}`} aria-labelledby="ghero-title">
      <div className="ghero__top">
        <div className="index-row">
          <span className="meta meta--accent">00</span>
          <span className="meta nowrap">Od kliknięcia do klienta</span>
        </div>
        {preparedFor && (
          <p className="meta ghero__for">
            Przygotowane dla: <strong>{preparedFor}</strong>
          </p>
        )}
      </div>

      <div ref={shift} className="ghero__shift">
        <h1 id="ghero-title" className="ghero__title">
          <span className="ghero__lead">
            Twoje reklamy nie potrzebują{" "}
            <span className="ghero__strike">więcej kliknięć</span>.
          </span>
          {lines.map((l, i) => (
            <span key={i} className="lineMask" style={{ "--i": i + 2 } as React.CSSProperties}>
              <span className="lineMask__in">{l}</span>
            </span>
          ))}
        </h1>

        <div className="ghero__foot">
          <p className="ghero__sub">
            Buduję całą drogę od reklamy do płacącego klienta: reklamę, stronę, formularz
            i follow-up. Dla firm usługowych, w których jeden klient jest wart tysiące.
          </p>
          <div className="ghero__actions">
            <a href="#audyt" className="gbtn gbtn--solid">
              Pokaż, gdzie tracę klientów <span aria-hidden="true">→</span>
            </a>
            <a href="#case" className="gbtn gbtn--ghost" onClick={() => track("ViewCase")}>
              Zobacz wynik <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <ul className="ghero__proof" aria-label="Wynik: Veronika English">
        <li>
          <span className="meta meta--sm">Case</span>
          <span className="ghero__proofV">{proof.client}</span>
        </li>
        <li>
          <span className="meta meta--sm">Przychód / miesiąc</span>
          <span className="ghero__proofV">
            {fmt(proof.revenueBefore)} zł → {fmt(proof.revenueAfter)} zł
          </span>
        </li>
        <li>
          <span className="meta meta--sm">Nowi klienci</span>
          <span className="ghero__proofV">{proof.newClients}</span>
        </li>
        <li>
          <span className="meta meta--sm">Zasięg</span>
          <span className="ghero__proofV">
            {fmt(proof.followersFrom)} → {fmt(proof.followersTo)}
            <span className="ghero__pct"> +{proof.growthPct}%</span>
          </span>
        </li>
      </ul>
    </section>
  );
}

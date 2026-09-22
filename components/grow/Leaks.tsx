import { useRef } from "react";
import { useScrollEffect } from "../../hooks/useScrollEffect";
import { centered, clamp, ease } from "../../lib/driver";
import { leaks } from "../../data/growth";
import { Calculator } from "./Calculator";

/** 01 — where the money leaks.
 *
 *  Each leak streams in from the left like the Manifesto lines, holds, and as
 *  it passes the centre a hairline strikes it through and it dims: the
 *  customer who was on the way, and left. */
export function Leaks({ motion, onBand }: { motion: boolean; onBand: (band: string) => void }) {
  const list = useRef<HTMLOListElement>(null);

  useScrollEffect(({ vw }) => {
    const rows = list.current?.querySelectorAll<HTMLElement>(".leak");
    if (!rows) return;
    const reach = Math.min(vw * 0.4, 480);
    rows.forEach((row) => {
      const c = centered(row);
      const inT = ease(clamp((c + 0.75) / 0.6, 0, 1));
      const out = ease(clamp((c - 0.05) / 0.35, 0, 1));
      const title = row.querySelector<HTMLElement>(".leak__title");
      const text = row.querySelector<HTMLElement>(".leak__text");
      if (title) {
        title.style.transform = `translate3d(${(-reach * (1 - inT)).toFixed(1)}px, 0, 0)`;
        title.style.opacity = String(0.1 + 0.9 * inT - 0.62 * out);
      }
      // a background on an inline box runs through every line it wraps onto,
      // so the strike crosses a two-line title line by line
      if (text) text.style.backgroundSize = `${(out * 100).toFixed(1)}% 2px`;
    });
  }, motion);

  return (
    <section id="wyciek" className="gsec leaks" aria-labelledby="leaks-heading">
      <div className="index-row gsec__index">
        <span className="meta meta--accent">02</span>
        <span className="meta nowrap">Wyciek</span>
      </div>

      <h2 id="leaks-heading" className="gsec__title">
        Płacisz za kliknięcia.
        <br />
        Tracisz ich <em className="serif">po drodze</em>
        <span className="stop">.</span>
      </h2>

      <ol ref={list} className="leaks__list">
        {leaks.map((l, i) => (
          <li key={l.title} className="leak">
            <span className="meta leak__num">{String(i + 1).padStart(2, "0")}</span>
            <div className="leak__body">
              <p className="leak__title">
                <span className="leak__text">{l.title}</span>
              </p>
              <p className="leak__note">{l.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="leaks__verdict">
        Reklama zrobiła swoje. <span>To nie jest problem reklamy — to problem systemu.</span>
      </p>

      {/* the leak, priced in the visitor's own numbers */}
      <Calculator onBand={onBand} />
    </section>
  );
}

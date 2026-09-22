import { useRef, useState } from "react";
import { useScrollEffect } from "../../hooks/useScrollEffect";
import { progress, between, ease } from "../../lib/driver";
import { stages } from "../../data/growth";

/** 02 — the system. The page's signature, as DESIGN × CODE is the portfolio's.
 *
 *  Desktop: a tall track with a pinned stage. One orange line — the customer's
 *  path — is drawn across five stations by the scroll; the station it has
 *  reached takes the stage, showing what usually breaks there (muted) and
 *  what I build instead (ink). At the last station the line closes on a dot
 *  and the section resolves on its one sentence.
 *
 *  Phone and reduced motion: the same content as a vertical sequence, no pin. */
export function System({ motion, isMobile }: { motion: boolean; isMobile: boolean }) {
  if (!motion || isMobile) return <SystemList motion={motion} />;
  return <SystemPinned />;
}

function Head() {
  return (
    <div className="index-row gsec__index">
      <span className="meta meta--accent">03</span>
      <span className="meta nowrap">System</span>
    </div>
  );
}

function SystemPinned() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const n = stages.length;

  useScrollEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const p = progress(sec);
    // 0.04–0.82 walks the stations; the rest holds the resolved sentence
    const walk = ease(between(p, 0.04, 0.82));
    const idx = Math.min(n - 1, Math.floor(between(p, 0.04, 0.82) * n * 0.999));
    setActive((prev) => (prev === idx ? prev : idx));
    const fin = p > 0.86;
    setDone((prev) => (prev === fin ? prev : fin));
    if (line.current) line.current.style.transform = `scaleX(${walk})`;
    if (dot.current) dot.current.style.left = `${(walk * 100).toFixed(2)}%`;
  });

  const s = stages[active];

  return (
    <section ref={section} id="system" className="gsys" aria-labelledby="sys-heading">
      <div className={`gsys__stage${done ? " is-done" : ""}`}>
        <div className="gsys__head">
          <Head />
          <h2 id="sys-heading" className="gsys__kicker">
            Jeden system. <span>Jedna osoba za niego odpowiada.</span>
          </h2>
        </div>

        <div className="gsys__rail" aria-hidden="true">
          <span className="gsys__track" />
          <span ref={line} className="gsys__line" />
          <span ref={dot} className="gsys__dot" />
          {stages.map((st, i) => (
            <span
              key={st.key}
              className={`gsys__node${i <= active ? " is-on" : ""}`}
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            >
              <span className="gsys__nodeLabel">{st.key}</span>
            </span>
          ))}
        </div>

        <div className="gsys__body">
          <div className="gsys__slideWrap">
          <div key={s.key} className="gsys__slide">
            <p className="gsys__name">
              <span className="meta meta--accent gsys__num">{String(active + 1).padStart(2, "0")}</span>
              {s.key}
            </p>
            <div className="gsys__cols">
              <p className="gsys__usual">
                <span className="meta meta--sm">Zwykle</span>
                <s>{s.usual}</s>
              </p>
              <p className="gsys__mine">
                <span className="meta meta--sm meta--strong">U mnie</span>
                {s.mine}
              </p>
            </div>
          </div>
          </div>

          <p className="gsys__final" aria-hidden={!done}>
            <span>
              Klientów się
              <br />
              <em className="serif accent">projektuje</em>
              <span className="stop">.</span>
            </span>
          </p>
        </div>

        {/* the full sequence for assistive tech; the stage above is visual */}
        <ol className="sr-only">
          {stages.map((st) => (
            <li key={st.key}>
              {st.key}. Zwykle: {st.usual} U mnie: {st.mine}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Phone: the path is the one line on screen (the page thread is off on
 *  phones). It draws down the list as it is read; each station lights up and
 *  strikes out "the usual" when the line reaches it. */
function SystemList({ motion }: { motion: boolean }) {
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useScrollEffect(({ vh }) => {
    const el = list.current;
    if (!el || !fill.current) return;
    const r = el.getBoundingClientRect();
    const head = vh * 0.62; // where the line's tip sits on screen
    const p = Math.max(0, Math.min(1, (head - r.top) / r.height));
    fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
    el.querySelectorAll<HTMLElement>(".gsysl__item").forEach((item) => {
      const on = item.getBoundingClientRect().top + 8 < head;
      item.classList.toggle("is-on", on);
    });
  }, motion);

  return (
    <section id="system" className={`gsec gsysl${motion ? "" : " is-static"}`} aria-labelledby="sysl-heading">
      <Head />
      <h2 id="sysl-heading" className="gsec__title">
        Jeden system.
        <br />
        <span className="gsec__muted">Jedna osoba za niego odpowiada.</span>
      </h2>

      <div ref={list} className="gsysl__list">
        <span className="gsysl__track" aria-hidden="true">
          <span ref={fill} className="gsysl__fill" />
        </span>
        <ol>
        {stages.map((s, i) => (
          <li key={s.key} className="gsysl__item">
            <span className="gsysl__node" aria-hidden="true" />
            <p className="gsysl__name">
              <span className="meta meta--accent">{String(i + 1).padStart(2, "0")}</span> {s.key}
            </p>
            <p className="gsys__usual">
              <span className="meta meta--sm">Zwykle</span>
              <s className="gsysl__usual">
                <span className="gsysl__strike">{s.usual}</span>
              </s>
            </p>
            <p className="gsys__mine">
              <span className="meta meta--sm meta--strong">U mnie</span>
              {s.mine}
            </p>
          </li>
        ))}
        </ol>
      </div>

      <p className="gsysl__final">
        Klientów się <em className="serif accent">projektuje</em>
        <span className="stop">.</span>
      </p>
    </section>
  );
}

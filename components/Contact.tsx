import { useRef, useState } from "react";
import { site } from "../data/site";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { useInView } from "../hooks/useInView";
import { useCopy } from "../lib/lang";
import "./Contact.css";

/** The CTA leans toward the cursor within a 240px radius — a single restrained
 *  magnetic moment, deliberately the only one on the page. */
export function Contact({ magnetic }: { magnetic: boolean }) {
  const cta = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [root, seen] = useInView<HTMLElement>();
  const t = useCopy().contact;

  useScrollEffect(({ px, py, vw, vh }) => {
    const el = cta.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = px * vw + vw / 2;
    const cy = py * vh + vh / 2;
    const dx = cx - (r.left + r.width / 2);
    const dy = cy - (r.top + r.height / 2);
    el.style.transform =
      Math.hypot(dx, dy) < 240
        ? `translate3d(${dx * 0.09}px, ${dy * 0.11}px, 0)`
        : "translate3d(0, 0, 0)";
  }, magnetic);

  return (
    <section
      id="contact"
      ref={root}
      className={`contact${seen ? " is-seen" : ""}`}
      aria-labelledby="contact-heading"
    >
      <div className="index-row contact__index">
        <span className="meta meta--accent">06</span>
        <span className="meta">{t.label}</span>
      </div>

      <h2 id="contact-heading" className="contact__title">
        <span className="lineMask" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="lineMask__in">{t.lineA}</span>
        </span>
        <span className="lineMask" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="lineMask__in">
            {t.lineB[0]} <em className="serif accent">{t.lineB[1]}</em>
          </span>
        </span>
      </h2>

      <div className="contact__row">
        <a
          ref={cta}
          href={`mailto:${site.email}`}
          className="contact__cta"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {t.cta}
          <span className={`contact__arrow${hover ? " is-hover" : ""}`} aria-hidden="true">
            →
          </span>
        </a>
        <a href={`mailto:${site.email}`} className="contact__mail">
          {site.email}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  const t = useCopy().footer;
  return (
    <footer className="footer">
      <span className="meta meta--sm nowrap">
        {site.name} — {site.year}
      </span>
      <span className="meta meta--sm nowrap">{t.built}</span>
      {/* the acquisition offer is deliberately a separate page: reachable
          from here, never announced above the fold */}
      <a href="/klienci" className="meta meta--sm nowrap footer__top">
        {t.grow}
      </a>
      <a href="#top" className="meta meta--sm nowrap footer__top">
        {t.top}
      </a>
    </footer>
  );
}

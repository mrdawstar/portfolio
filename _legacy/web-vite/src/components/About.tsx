import { useRef } from "react";
import { site } from "../data/site";
import { Picture } from "./Picture";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { useMaskReveal } from "../hooks/useMaskReveal";
import { useInView } from "../hooks/useInView";
import { centered } from "../lib/driver";
import "./About.css";

const FACTS = ["Based in Warsaw", "Working remotely", "EN / PL"];

export function About({ motion }: { motion: boolean }) {
  const mask = useMaskReveal<HTMLDivElement>(motion);
  const img = useRef<HTMLImageElement>(null);
  const [copy, copySeen] = useInView<HTMLDivElement>();

  // Slow counter-scroll inside the frame: the portrait settles as it centres.
  useScrollEffect(({ vh }) => {
    const wrap = mask.current;
    const el = img.current;
    if (!wrap || !el) return;
    const r = wrap.getBoundingClientRect();
    if (r.top > vh * 1.1 || r.bottom < -vh * 0.1) return;
    const c = centered(wrap);
    el.style.transform = `scale(${1.08 - (1 - Math.abs(c)) * 0.08}) translate3d(0, ${c * -20}px, 0)`;
  }, motion);

  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      <div className="about__inner">
        <div ref={mask} className="about__frame">
          <Picture
            name="about-bw"
            alt={`${site.name}, portrait`}
            sizes="(max-width: 759px) 100vw, 45vw"
            className="about__img"
            imgRef={img}
          />
        </div>

        <div ref={copy} className={`about__copy${copySeen ? " is-seen" : ""}`}>
          <div className="about__lead">
            <div className="index-row">
              <span className="meta meta--accent">05</span>
              <span className="meta">About</span>
            </div>
            {/* The one place the two names are stated together, and the only
                place the hierarchy between them is spelled out. */}
            <p className="about__byline">{site.name}</p>
            <p className="meta about__role">
              Designer &amp; developer behind {site.brand}
            </p>
          </div>

          {/* one mask per line, so the two halves of the claim arrive in turn */}
          <h2 id="about-heading" className="about__title">
            <span className="lineMask" style={{ "--i": 0 } as React.CSSProperties}>
              <span className="lineMask__in">
                Designer's <em className="serif accent">eye.</em>
              </span>
            </span>
            <span className="lineMask" style={{ "--i": 1 } as React.CSSProperties}>
              <span className="lineMask__in">
                Developer's <em className="serif accent">precision.</em>
              </span>
            </span>
          </h2>

          <div className="about__tail">
            <p className="about__lede">
              I design and build digital experiences where visual identity and
              frontend execution are treated as one discipline.
            </p>
            <ul className="about__facts">
              {FACTS.map((f) => (
                <li key={f} className="meta nowrap">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

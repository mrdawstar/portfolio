import { useRef } from "react";
import { site } from "../data/site";
import { Picture } from "./Picture";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { useCopy } from "../lib/lang";
import "./Hero.css";

interface HeroProps {
  isMobile: boolean;
  motion: boolean;
}

export function Hero({ isMobile, motion }: HeroProps) {
  const wordA = useRef<HTMLSpanElement>(null);
  const wordB = useRef<HTMLSpanElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const figure = useRef<HTMLImageElement>(null);
  const mFigure = useRef<HTMLImageElement>(null);
  const mWordA = useRef<HTMLSpanElement>(null); // mask wrapper, not the word
  const mWordB = useRef<HTMLSpanElement>(null);
  const mMeta = useRef<HTMLDivElement>(null);
  const t = useCopy().hero;

  // As you leave the hero the type drifts left and up while the figure sinks:
  // the name and the portrait separate rather than scrolling as one plate.
  // Pointer position adds a small lateral drift on top.
  useScrollEffect(({ vh, scrollY, px }) => {
    const a = wordA.current;
    const b = wordB.current;
    if (!a || !b) return;
    const p = Math.max(0, Math.min(1, scrollY / vh));
    const drift = px * 10;
    a.style.transform = `translate3d(${-p * 58 + drift}px, ${p * -40}px, 0)`;
    b.style.transform = `translate3d(${-p * 26 + drift * 1.7}px, ${p * -40}px, 0)`;
    if (rule.current)
      rule.current.style.transform = `translate3d(${drift * 2.2}px, ${p * -40}px, 0) scaleX(1)`;
    if (figure.current)
      figure.current.style.transform = `translate3d(${drift * -1.1}px, ${p * 58}px, 0) scale(${1 - p * 0.028})`;
  }, motion && !isMobile);

  // Mobile depth: the portrait drifts down and away while the name rises past
  // it, so the two read as layers of one composition rather than a stacked
  // image and caption. Small amplitudes — this is depth, not parallax.
  useScrollEffect(({ vh, scrollY }) => {
    const p = Math.max(0, Math.min(1, scrollY / vh));
    if (mFigure.current)
      mFigure.current.style.transform = `translate3d(0, ${p * 46}px, 0) scale(${1 + p * 0.04})`;
    if (mWordA.current)
      mWordA.current.style.transform = `translate3d(${-p * 14}px, ${p * -52}px, 0)`;
    if (mWordB.current)
      mWordB.current.style.transform = `translate3d(${p * 10}px, ${p * -34}px, 0)`;
    if (mMeta.current) {
      mMeta.current.style.transform = `translate3d(0, ${p * -18}px, 0)`;
      mMeta.current.style.opacity = String(Math.max(0, 1 - p * 1.6));
    }
  }, motion && isMobile);

  if (isMobile) {
    return (
      <section id="top" className="hero hero--mobile">
        <div className="hero__mobileFigure">
          <Picture
            name="hero-cutout"
            alt={`${site.name}, ${t.alt}`}
            sizes="100vw"
            priority
            className="hero__mobileImg"
            imgRef={mFigure}
          />
          <span className="hero__mobileVeil" aria-hidden="true" />
        </div>

        <div className="hero__mobileBody">
          {/* Each line is its own overflow mask so the name rises into the
              frame instead of fading in. BUBNOW overlaps the portrait by
              design; the veil behind it keeps every letter legible. */}
          <h1 className="hero__mobileName">
            <span ref={mWordA} className="hero__mMask">
              <span className="hero__mWord hero__mWord--a">Dawid</span>
            </span>
            <span ref={mWordB} className="hero__mMask">
              <span className="hero__mWord hero__mWord--b">Bubnow</span>
            </span>
          </h1>

          <div ref={mMeta} className="hero__metaShift">
            <div className="hero__mobileMeta">
            <span className="hero__rule" />
            <div className="hero__mobileRow">
              <span className="meta meta--sm">
                {t.roleMobile[0]}
                <br />
                {t.roleMobile[1]}
              </span>
              <span className="meta meta--sm hero__right">
                {t.city}
                <br />
                {site.year}
              </span>
            </div>
            <div className="hero__mobileRow hero__mobileRow--tight">
              <span className="meta meta--sm hero__available">
                <span className="hero__dot" />
                {t.availableShort}
              </span>
              <a href="#work" className="hero__workLink">
                {t.ctaShort} <span className="stop">↓</span>
              </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="top" className="hero">
      <div className="hero__type">
        <div className="hero__kicker">
          <span className="meta nowrap">{t.role}</span>
          <span className="meta">
            {t.location} — <em className="serif hero__yearEm">{site.year}</em>
          </span>
        </div>

        {/* Two layers on purpose: the outer span carries the scroll-driven
            transform, the inner one carries the entrance keyframes. Writing
            both to one element would let the per-frame inline transform
            overwrite the animation before it ever ran. */}
        <h1 className="hero__name">
          <span ref={wordA} className="hero__shift hero__shift--a">
            <span className="hero__word hero__word--a">Dawid</span>
          </span>
          <span ref={wordB} className="hero__shift hero__shift--b">
            <span className="hero__word hero__word--b">Bubnow</span>
          </span>
        </h1>

        <span ref={rule} className="hero__ruleShift" aria-hidden="true">
          <span className="hero__accentRule" />
        </span>
      </div>

      <Picture
        name="hero-cutout"
        alt={`${site.name}, ${t.alt}`}
        sizes="52vw"
        priority
        className="hero__figure"
        imgRef={figure}
      />

      <div className="hero__foot">
        <span className="meta meta--strong hero__available">
          <span className="hero__dot" />
          {t.available}
        </span>
        <a href="#work" className="hero__cta">
          {t.cta} <span className="stop">↓</span>
        </a>
      </div>
    </section>
  );
}

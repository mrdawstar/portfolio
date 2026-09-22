"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile, useReducedMotion, useFinePointer } from "../../hooks/useMediaQuery";
import { useScrollEffect } from "../../hooks/useScrollEffect";
import { site } from "../../data/site";
import { GrowHero } from "./GrowHero";
import { Leaks } from "./Leaks";
import { System } from "./System";
import { Case } from "./Case";
import { Scope, Fit, Steps } from "./Offer";
import { Audit } from "./Audit";
import { Analytics } from "./Analytics";
import { MobileMenu } from "../MobileMenu";
import { LangProvider } from "../../lib/lang";
import "../Nav.css";
import "../Contact.css"; // .footer
import "./Growth.css";

/** `?dla=Kuchnie-Nowak` → "Kuchnie Nowak". Display only; React escapes it,
 *  and anything but letters, digits and a little punctuation is dropped. */
function usePreparedFor() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("dla");
    if (!raw) return;
    const v = raw
      .replace(/[-_+]+/g, " ")
      .replace(/[^\p{L}\p{N} .&']/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40);
    if (v.length >= 2) setName(v);
  }, []);
  return name;
}

export default function Growth() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const motion = !reduced;
  const preparedFor = usePreparedFor();

  return (
    <LangProvider lang="pl">
    <div lang="pl" className="grow">
      <a className="skip-link" href="#audyt">
        Przejdź do formularza
      </a>

      <Analytics />
      <Thread enabled={motion} />
      <GrowNav isMobile={isMobile} />

      <main>
        <GrowHero motion={motion} isMobile={isMobile} preparedFor={preparedFor} />
        {/* cold traffic gets the proof before the pitch */}
        <Case motion={motion} />
        <CtaBand />
        <Leaks motion={motion} />
        <System motion={motion} isMobile={isMobile} />
        <Scope />
        <Fit />
        <Steps />
        <Audit magnetic={motion && finePointer} preparedFor={preparedFor} />
      </main>

      <StickyCta />
      <GrowFooter />
    </div>
    </LangProvider>
  );
}

const menuLinks = [
  { id: "case", label: "Wynik" },
  { id: "wyciek", label: "Wyciek" },
  { id: "system", label: "System" },
  { id: "zakres", label: "Zakres" },
  { id: "start", label: "Start" },
  { id: "audyt", label: "Audyt" },
] as const;

/** The same single action, repeated once where belief is highest: straight
 *  after the proof. */
function CtaBand() {
  return (
    <aside className="gband">
      <p className="gband__t">
        Chcesz zobaczyć, ile klientów tracisz <em className="serif">po drodze</em>?
      </p>
      <a href="#audyt" className="gbtn gbtn--solid">
        Pokaż, gdzie tracę klientów <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}

function GrowNav({ isMobile }: { isMobile: boolean }) {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);
  useScrollEffect(({ vh }) => {
    if (document.documentElement.classList.contains("is-menu-open")) return;
    const past = window.scrollY > vh * 0.4;
    setCondensed((prev) => (prev === past ? prev : past));
  });

  return (
    <>
      <header className={`nav gnav${condensed ? " nav--condensed" : ""}`}>
        <div className="gnav__bar">
          <a href="#top" className="nav__mark" aria-label={`${site.brand} — do góry`}>
            <span className="nav__dot" />
            <span className="nav__markText">{site.brand}</span>
          </a>
          {isMobile ? (
            <button
              type="button"
              className="nav__menuBtn"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          ) : (
            <a href="#audyt" className="nav__link gnav__cta">
              Audyt <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </header>
      {isMobile && (
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          links={menuLinks}
          showLang={false}
        />
      )}
    </>
  );
}

/** The customer's path, drawn down the left edge as the page is read. It
 *  starts at the first click (the hero) and ends in a dot at the form. */
function Thread({ enabled }: { enabled: boolean }) {
  const line = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useScrollEffect(({ vh }) => {
    const target = document.getElementById("audyt");
    if (!line.current || !dot.current || !target) return;
    const end = target.offsetTop + target.offsetHeight * 0.35 - vh;
    const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, end)));
    line.current.style.transform = `scaleY(${p})`;
    dot.current.style.transform = `translate3d(0, ${(p * vh).toFixed(1)}px, 0) scale(${p >= 1 ? 1.8 : 1})`;
  }, enabled);

  if (!enabled) return null;
  return (
    <div className="thread" aria-hidden="true">
      <div ref={line} className="thread__line" />
      <div ref={dot} className="thread__dot" />
    </div>
  );
}

/** Phone only: the one action, always a thumb away — hidden over the hero
 *  (which has its own CTA) and over the form itself. */
function StickyCta() {
  const [show, setShow] = useState(false);
  useScrollEffect(({ vh }) => {
    const form = document.getElementById("audyt");
    const pastHero = window.scrollY > vh * 0.9;
    const atForm = form ? form.getBoundingClientRect().top < vh * 0.85 : false;
    const next = pastHero && !atForm;
    setShow((prev) => (prev === next ? prev : next));
  });

  return (
    <a href="#audyt" className={`gsticky${show ? " is-on" : ""}`} tabIndex={show ? 0 : -1} aria-hidden={!show}>
      <span>Pokaż, gdzie tracę klientów</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

function GrowFooter() {
  return (
    <footer className="footer">
      <span className="meta meta--sm nowrap">
        {site.brand} — {site.name}
      </span>
      {/* the portfolio is a separate page on purpose — linked only here */}
      <a href="/pl" className="meta meta--sm nowrap footer__top">
        Portfolio ↗
      </a>
      <a href="#top" className="meta meta--sm nowrap footer__top">
        Do góry ↑
      </a>
    </footer>
  );
}

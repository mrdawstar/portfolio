import { useEffect, useRef, useState } from "react";
import { sections, site } from "../data/site";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { MobileMenu } from "./MobileMenu";
import { useCopy } from "../lib/lang";
import "./Nav.css";

/** EN / PL. The page you are on is marked; the other is a plain link. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang } = useCopy();
  return (
    <span className={`langSwitch ${className}`}>
      <a href="/" hrefLang="en" lang="en" aria-current={lang === "en" ? "page" : undefined}>
        EN
      </a>
      <span aria-hidden="true">/</span>
      <a href="/pl" hrefLang="pl" lang="pl" aria-current={lang === "pl" ? "page" : undefined}>
        PL
      </a>
    </span>
  );
}

export function Nav({ isMobile }: { isMobile: boolean }) {
  const t = useCopy();
  const navLinks = sections
    .filter((s) => s.nav)
    .map((s) => ({ ...s, ...t.sections[s.id] }));
  const header = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>(sections[0].id);
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The running section indicator. State (not textContent) so `aria-current`
  // stays truthful for assistive tech; it only changes ~7 times per page.
  useScrollEffect(({ vh }) => {
    // while the menu holds the page, scrollY reads 0 — ignore it
    if (document.documentElement.classList.contains("is-menu-open")) return;
    let current: string = sections[0].id;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= vh * 0.4) current = s.id;
    }
    setActive((prev) => (prev === current ? prev : current));
    const past = window.scrollY > vh * 0.6;
    setCondensed((prev) => (prev === past ? prev : past));
  });

  // Close the menu if the viewport grows past the mobile composition.
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const activeSection = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <>
      <header
        ref={header}
        className={`nav${condensed ? " nav--condensed" : ""}`}
        data-mobile={isMobile ? "" : undefined}
      >
        {isMobile ? (
          <div className="nav__bar">
            <a href="#top" className="nav__mark" aria-label={`${site.brand}, ${t.nav.backToTop}`}>
              <span className="nav__dot" />
              <span className="nav__markText">{site.brand}</span>
            </a>
            <LangSwitch className="langSwitch--bar" />
            <button
              type="button"
              className="nav__menuBtn"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {t.nav.menu}
            </button>
          </div>
        ) : (
          <div className="nav__grid">
            <a href="#top" className="nav__mark" aria-label={`${site.brand}, ${t.nav.backToTop}`}>
              <span className="nav__dot" />
              <span className="nav__markText">{site.brand}</span>
            </a>
            <span className="nav__state" aria-hidden="true">
              {activeSection.num} — {t.sections[activeSection.id].label}
            </span>
            <nav aria-label={t.nav.sections}>
              {navLinks.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="nav__link"
                  aria-current={active === s.id ? "true" : undefined}
                >
                  <span className="nav__linkNum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.short}
                </a>
              ))}
              <LangSwitch />
            </nav>
          </div>
        )}
      </header>

      {isMobile && (
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          links={navLinks}
        />
      )}
    </>
  );
}

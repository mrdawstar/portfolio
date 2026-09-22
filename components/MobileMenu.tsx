import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { useCopy } from "../lib/lang";
import { LangSwitch } from "./Nav";
import "./MobileMenu.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: readonly { id: string; short?: string; label: string }[];
  /** the EN / PL switch in the footer row; off where there is one language */
  showLang?: boolean;
}

/** Full-bleed editorial menu.
 *
 *  The layer wipes up, then each link rises out of its own overflow mask, then
 *  the numbers fade in behind them. Closing runs the same choreography in
 *  reverse rather than snapping — which is why the panel stays mounted through
 *  an explicit `closing` state instead of unmounting on the click. */
export function MobileMenu({ open, onClose, links, showLang = true }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  /** Where a tapped link wants to go. The page is locked (body fixed) while
   *  the menu is open, so a native anchor jump lands nowhere and the unlock
   *  would then restore the old position over it. The jump waits for the
   *  unlock instead. */
  const pending = useRef<string | null>(null);
  /** Read through a ref so the lock effect depends on `open` alone. Parents
   *  re-render while the menu is open (locking the body resets scrollY, which
   *  their scroll state reacts to); with `onClose` as a dependency every such
   *  render tore the lock down and rebuilt it — the page jumped and focus
   *  bounced. */
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const t = useCopy();

  /** Mount and "open" are deliberately two steps. Applying the open class in
   *  the same commit that inserts the node gives the browser no closed state
   *  to transition from, so the whole choreography would be skipped on the way
   *  in (it only ever played in reverse). Painting one frame closed, then
   *  flipping, is what makes the entrance run. */
  useEffect(() => {
    if (open) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), 720);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;

    // lock the page without losing scroll position
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `${-y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.documentElement.classList.add("is-menu-open");

    const node = panel.current;
    const focusTimer = setTimeout(
      () => node?.querySelector<HTMLElement>("a, button")?.focus(),
      420,
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const f = node.querySelectorAll<HTMLElement>("a[href], button");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-menu-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      // instant: `scroll-behavior: smooth` would otherwise animate from the top
      window.scrollTo({ top: y, behavior: "instant" });
      const target = pending.current && document.getElementById(pending.current);
      pending.current = null;
      if (target) {
        // Measured from layout, not the box: <main> is still easing back from
        // its receded scale(0.94), which would shorten every distance by 6%
        // (a section 10 000px down landed 600px short). Instant, because the
        // closing wipe hides it anyway.
        let top = 0;
        for (let el: HTMLElement | null = target; el; el = el.offsetParent as HTMLElement | null) {
          top += el.offsetTop;
        }
        window.scrollTo({ top, behavior: "instant" });
        history.replaceState(null, "", `#${target.id}`);
      } else {
        restoreTo.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      id="mobile-menu"
      ref={panel}
      className={`menu${entered ? " menu--open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
    >
      <div className="menu__top">
        <span className="menu__brand">
          <span className="menu__dot" />
          <span className="menu__brandText">{site.brand}</span>
        </span>
        <button type="button" className="menu__close" onClick={onClose}>
          {t.nav.close}
        </button>
      </div>

      <nav className="menu__nav" aria-label={t.nav.sections}>
        {links.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="menu__item"
            style={{ "--i": i } as React.CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              pending.current = s.id;
              onClose();
            }}
          >
            <span className="menu__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* the mask is the overflow box; the inner span is what travels */}
            <span className="menu__mask">
              <span className="menu__word">{s.short ?? s.label}</span>
            </span>
          </a>
        ))}
      </nav>

      <div
        className="menu__foot"
        style={{ "--i": links.length } as React.CSSProperties}
      >
        <span className="menu__rule" />
        <div className="menu__footRow">
          <span className="meta meta--sm menu__available">
            <span className="menu__dot" />
            {t.nav.available}
          </span>
          {showLang && <LangSwitch />}
          <span className="meta meta--sm">
            {site.name} — {site.year}
          </span>
        </div>
      </div>
    </div>
  );
}

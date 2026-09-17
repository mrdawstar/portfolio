import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import "./MobileMenu.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: readonly { id: string; short?: string; label: string }[];
}

/** Full-bleed editorial menu.
 *
 *  The layer wipes up, then each link rises out of its own overflow mask, then
 *  the numbers fade in behind them. Closing runs the same choreography in
 *  reverse rather than snapping — which is why the panel stays mounted through
 *  an explicit `closing` state instead of unmounting on the click. */
export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

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
        onClose();
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
      window.scrollTo(0, y);
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

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
          Close
        </button>
      </div>

      <nav className="menu__nav" aria-label="Sections">
        {links.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="menu__item"
            style={{ "--i": i } as React.CSSProperties}
            onClick={onClose}
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
            Available
          </span>
          <span className="meta meta--sm">
            {site.name} — {site.year}
          </span>
        </div>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { centered, clamp, ease } from "../lib/driver";
import "./DesignCode.css";

/** DESIGN × CODE.
 *
 *  A stacked, diagonal composition: DESIGN sits high and left, CODE low and
 *  right, and the cross holds the centre between them. As the section scrolls
 *  through, both words slide horizontally to meet on the centre line while the
 *  cross rotates — the whole move is on the X axis, so nothing drifts
 *  vertically out of the composition.
 *
 *  The cross is drawn, not typed. The Archivo multiplication glyph is neither
 *  square nor optically centred, which made it look crooked between two pieces
 *  of geometric display type. */
export function DesignCode({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const design = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);
  const cross = useRef<HTMLSpanElement>(null);

  useScrollEffect(({ vw }) => {
    const sec = section.current;
    const a = design.current;
    const b = code.current;
    if (!sec || !a || !b) return;

    const c = centered(sec);
    // 0 while the section is still below, 1 once it has reached the middle
    // Same window as the manifesto: the whole convergence happens while the
    // section is on screen, rather than finishing before it arrives.
    const settled = ease(clamp((c + 0.55) / 0.72, 0, 1));
    const remaining = 1 - settled;

    // DESIGN starts out to the left, CODE out to the right; both converge on
    // the centre line. Capped against the viewport so neither leaves the page.
    const spread = Math.min(vw * 0.34, 460) * remaining;

    a.style.transform = `translate3d(${-spread}px, 0, 0)`;
    b.style.transform = `translate3d(${spread}px, 0, 0)`;

    // the cross turns through a quarter as the two resolve around it
    if (cross.current) {
      cross.current.style.transform = `rotate(${remaining * 90}deg) scale(${0.8 + settled * 0.2})`;
      cross.current.style.opacity = String(0.3 + settled * 0.7);
    }
    b.style.color = settled > 0.82 ? "var(--ink-soft)" : "var(--muted)";
  }, motion);

  return (
    <section
      id="discipline"
      ref={section}
      className="dxc"
      aria-labelledby="dxc-heading"
    >
      <div className="index-row dxc__index">
        <span className="meta meta--accent">04</span>
        <span className="meta nowrap">One discipline</span>
      </div>

      <h2 id="dxc-heading" className="dxc__type">
        <span ref={design} className="dxc__word">
          Design
        </span>
        <span className="sr-only"> and </span>
        <span ref={cross} className="dxc__cross" aria-hidden="true">
          {/* equal width and height, drawn on a square viewBox: symmetric by
              construction rather than by luck of the glyph */}
          <svg viewBox="0 0 100 100" focusable="false">
            <line x1="14" y1="14" x2="86" y2="86" />
            <line x1="86" y1="14" x2="14" y2="86" />
          </svg>
        </span>
        <span ref={code} className="dxc__word dxc__word--muted">
          Code
        </span>
      </h2>

      <p className="dxc__note">
        Art direction, interface and frontend — decided together, built by one
        pair of hands.
      </p>
    </section>
  );
}

import { useRef } from "react";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { progress, between, clamp, ease } from "../lib/driver";
import "./DesignCode.css";

/** DESIGN × CODE — pinned.
 *
 *  The section is a tall track with a sticky stage, so the move lasts for
 *  well over a screen of scrolling instead of being over in a moment:
 *
 *    0.00–0.48  DESIGN slides in from the left, CODE from the right
 *    0.48–0.64  they hold, resolved on the centre line
 *    0.64–1.00  they keep travelling, crossing past each other
 *
 *  The cross turns continuously for the whole track. All word motion is on
 *  the X axis; the stage clips anything in transit, never the resolved state.
 *
 *  The cross is drawn, not typed: square by construction. */
export function DesignCode({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const design = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);
  const cross = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLParagraphElement>(null);

  useScrollEffect(({ vw }) => {
    const sec = section.current;
    const a = design.current;
    const b = code.current;
    if (!sec || !a || !b) return;

    const p = progress(sec);
    const arrive = ease(between(p, 0.02, 0.48));
    const leave = ease(between(p, 0.64, 1));

    const spread = Math.min(vw * 0.34, 460);
    const aX = -spread * (1 - arrive) + spread * 0.5 * leave;
    const bX = spread * (1 - arrive) - spread * 0.5 * leave;

    a.style.transform = `translate3d(${aX}px, 0, 0)`;
    b.style.transform = `translate3d(${bX}px, 0, 0)`;

    // resolved while the two are aligned, muted on the way in and out
    const resolved = arrive > 0.9 && leave < 0.35;
    b.style.color = resolved ? "var(--ink-soft)" : "var(--muted)";

    if (cross.current) {
      cross.current.style.transform = `rotate(${p * 360}deg) scale(${0.78 + arrive * 0.22 - leave * 0.12})`;
      cross.current.style.opacity = String(clamp(0.3 + arrive * 0.7 - leave * 0.3, 0, 1));
    }
    if (note.current) {
      note.current.style.opacity = String(clamp(arrive * 1.2 - leave * 1.4, 0, 1));
    }
  }, motion);

  return (
    <section
      id="discipline"
      ref={section}
      className="dxc"
      aria-labelledby="dxc-heading"
    >
      <div className="dxc__stage">
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
            <svg viewBox="0 0 100 100" focusable="false">
              <line x1="14" y1="14" x2="86" y2="86" />
              <line x1="86" y1="14" x2="14" y2="86" />
            </svg>
          </span>
          <span ref={code} className="dxc__word dxc__word--muted">
            Code
          </span>
        </h2>

        <p ref={note} className="dxc__note">
          Art direction, interface and frontend — decided together, built by
          one pair of hands.
        </p>
      </div>
    </section>
  );
}

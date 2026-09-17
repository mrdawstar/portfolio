import { useRef } from "react";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { centered, clamp, ease } from "../lib/driver";
import "./Manifesto.css";

/** Kinetic typography, X axis only.
 *
 *  The first line enters from the left, the second from the right, and both
 *  settle at zero offset — their resting composition is flush left and flush
 *  right respectively.
 *
 *  The travel is deliberately large enough to read as an entrance, so during
 *  it the lines sit partly outside the section. `overflow-x: clip` on the
 *  section absorbs that without creating a scroll container or adding a pixel
 *  of page overflow, and because the settled offset is exactly 0 the final
 *  composition can never be the thing that gets cut. */
export function Manifesto({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const lineA = useRef<HTMLParagraphElement>(null);
  const lineB = useRef<HTMLParagraphElement>(null);

  useScrollEffect(() => {
    const sec = section.current;
    const a = lineA.current;
    const b = lineB.current;
    if (!sec || !a || !b) return;

    // -1 below the fold, 0 centred, 1 above: settle to 0 by the time the
    // section reaches the middle of the viewport and stay settled after.
    const c = centered(sec);
    // The travel window is deliberately late: `c + 1` would finish the move
    // before the section is properly on screen. Starting at c = -0.55 (the
    // section just entering from the bottom) and finishing a little past
    // centre puts the whole entrance in view.
    const settled = ease(clamp((c + 0.55) / 0.72, 0, 1));
    const remaining = 1 - settled;

    // enough travel to read as arriving from off to the side
    const reach = Math.min(window.innerWidth * 0.5, 520);

    a.style.transform = `translate3d(${-remaining * reach}px, 0, 0)`;
    b.style.transform = `translate3d(${remaining * reach}px, 0, 0)`;
  }, motion);

  return (
    <section
      id="manifesto"
      ref={section}
      className="manifesto"
      aria-labelledby="manifesto-heading"
    >
      <div className="index-row manifesto__index">
        <span className="meta meta--accent">02</span>
        <h2 id="manifesto-heading" className="meta nowrap manifesto__label">
          Manifesto
        </h2>
      </div>

      <div className="manifesto__row">
        <p ref={lineA} className="manifesto__line">
          Design without code is a picture.
        </p>
      </div>

      <div className="manifesto__row manifesto__row--end">
        <p ref={lineB} className="manifesto__line manifesto__line--right">
          Code without design is a{" "}
          <em className="serif">
            page<span className="stop">.</span>
          </em>
        </p>
      </div>
    </section>
  );
}

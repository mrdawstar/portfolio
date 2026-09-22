import { useRef, type ReactNode } from "react";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { centered, clamp, ease } from "../lib/driver";
import { useCopy } from "../lib/lang";
import "./Manifesto.css";

/** Kinetic typography, X axis only, word by word.
 *
 *  Line one streams in from the left, line two from the right. Every word is
 *  its own traveller with a staggered start, but they all land on the same
 *  scroll position — so the composition resolves at once, cleanly, with each
 *  line flush to its own edge. Scrolling on, the lines keep moving: each
 *  carries on across in the direction it came from, so the section never
 *  goes still while it is on screen.
 *
 *  Only words move (inline-block, transform only — no reflow). The section
 *  clips them in transit; the resolved offset is exactly 0. */
export function Manifesto({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const lineA = useRef<HTMLParagraphElement>(null);
  const lineB = useRef<HTMLParagraphElement>(null);
  const t = useCopy();
  const LINE_A = t.manifesto.lineA;
  const LINE_B = t.manifesto.lineB;

  useScrollEffect(({ vw }) => {
    if (!lineA.current || !lineB.current) return;

    const reach = Math.min(vw * 0.62, 760);

    // One clock for the whole statement, taken from the FIRST line's own
    // position (the section centre sits below the text because of its top
    // padding, so timing off it played the entrance below the fold).
    //
    // Timing each line independently was worse: line one began leaving before
    // line two had landed, so the finished composition never existed on screen.
    // On one clock the sequence is a relay with a shared hold:
    //   line one streams in from the left, lands;
    //   line two streams in from the right, lands;
    //   both hold, resolved;
    //   both drift on across in the direction they came from.
    const c = centered(lineA.current);
    const leave = ease(clamp((c - 0.55) / 0.6, 0, 1));

    const drive = (
      line: HTMLElement,
      dir: -1 | 1,
      from: number,
      land: number,
    ) => {
      const words = line.querySelectorAll<HTMLElement>(".mw");
      const n = words.length;
      words.forEach((w, i) => {
        // later words start later but all finish on the same beat
        const start = from + i * (0.3 / Math.max(1, n - 1));
        const t = ease(clamp((c - start) / (land - start), 0, 1));
        const x = dir * reach * (1 - t) - dir * reach * 0.28 * leave;
        w.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
        w.style.opacity = String(0.08 + 0.92 * t);
      });
    };

    drive(lineA.current, -1, -0.9, -0.1); // from the left, lands first
    drive(lineB.current, 1, -0.55, 0.12); // from the right, lands second
  }, motion);

  const words = (list: readonly string[], tail?: ReactNode) => (
    <>
      {list.map((w, i) => (
        <span key={i}>
          <span className="mw">{w}</span>{" "}
        </span>
      ))}
      {tail}
    </>
  );

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
          {t.sections.manifesto.label}
        </h2>
      </div>

      <div className="manifesto__row">
        <p ref={lineA} className="manifesto__line">
          {words(LINE_A)}
        </p>
      </div>

      <div className="manifesto__row manifesto__row--end">
        <p ref={lineB} className="manifesto__line manifesto__line--right">
          {words(
            LINE_B,
            <span className="mw">
              <em className="serif">
                {t.manifesto.tail}<span className="stop">.</span>
              </em>
            </span>,
          )}
        </p>
      </div>
    </section>
  );
}

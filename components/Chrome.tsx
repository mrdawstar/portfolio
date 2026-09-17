import { useEffect, useRef } from "react";
import { useScrollEffect } from "../hooks/useScrollEffect";
import "./Chrome.css";

/** Hairline reading-progress rule along the top edge. */
export function ScrollProgress({ enabled }: { enabled: boolean }) {
  const bar = useRef<HTMLDivElement>(null);

  useScrollEffect(({ vh }) => {
    const el = bar.current;
    if (!el) return;
    const max = document.documentElement.scrollHeight - vh || 1;
    const p = Math.max(0, Math.min(1, window.scrollY / max));
    el.style.transform = `scaleX(${p})`;
  }, enabled);

  if (!enabled) return null;
  return <div ref={bar} className="progress" aria-hidden="true" />;
}

/** A 10px dot that swells into a "VIEW ↗" disc over project cards.
 *  Desktop pointer only — never rendered for touch or reduced motion. */
export function ContextCursor({ enabled }: { enabled: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      const el = dot.current;
      if (!el) return;
      const over = (e.target as HTMLElement)?.closest?.('[data-cursor="view"]');
      el.style.opacity = "1";
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.classList.toggle("cursor--open", !!over);
      if (label.current) label.current.style.opacity = over ? "1" : "0";
    };
    const onLeave = () => {
      if (dot.current) dot.current.style.opacity = "0";
    };

    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={dot} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label">
        View ↗
      </span>
    </div>
  );
}

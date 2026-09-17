import { useEffect, useRef } from "react";

/** Clip-path wipe as the element enters. Elements already above the fold on
 *  load are never armed, so the hero is not held back by an observer. */
export function useMaskReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.style.clipPath = "";
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    el.style.clipPath = "inset(0 0 100% 0)";
    el.style.transition = "clip-path 1200ms cubic-bezier(.16,1,.3,1)";

    const reveal = () => {
      el.style.clipPath = "inset(0 0 0% 0)";
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -14% 0px" },
    );
    io.observe(el);

    // never leave content hidden if the tab was backgrounded mid-reveal
    const bail = () => document.hidden && (reveal(), io.disconnect());
    document.addEventListener("visibilitychange", bail);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", bail);
    };
  }, [enabled]);

  return ref;
}

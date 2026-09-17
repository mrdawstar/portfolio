import { useEffect, useRef, useState } from "react";

/** Adds a one-shot "has entered" flag. Unlike the mask-reveal hook this does
 *  not touch styles itself — callers key CSS off the returned boolean, which
 *  keeps the reveal declarative and lets reduced-motion opt out in CSS. */
export function useInView<T extends HTMLElement>(margin = "-12% 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    // already on screen at mount (deep link, refresh mid-page): show at once
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);

  return [ref, seen] as const;
}

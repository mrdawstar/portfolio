import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** The reference switches composition at 760px, not at a generic tablet breakpoint. */
export const useIsMobile = () => useMediaQuery("(max-width: 759px)");
export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
/** Contextual cursor and magnetic CTA are pointer-device only. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)", true);

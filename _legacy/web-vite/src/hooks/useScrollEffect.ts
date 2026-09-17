import { useEffect } from "react";
import { addEffect, type DriverState } from "../lib/driver";

/** Runs `effect` inside the shared rAF pass. `enabled` false unregisters it
 *  entirely, which is how reduced-motion opts out of the cost as well as the
 *  movement. */
export function useScrollEffect(
  effect: (state: DriverState) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    return addEffect(effect);
    // effect is re-created per render by callers that close over props; the
    // driver is cheap to re-register, and this keeps the closure fresh.
  });
}

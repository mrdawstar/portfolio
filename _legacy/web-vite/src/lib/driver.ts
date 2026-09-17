/** One rAF-coalesced pass for every scroll-linked effect on the page.
 *
 *  The approved reference runs a single `scrollFx()` on scroll; this keeps that
 *  shape. Effects read layout and write transforms directly against refs, so a
 *  scroll frame never triggers a React render. */

type Effect = (state: DriverState) => void;

export interface DriverState {
  /** viewport height, read once per frame */
  vh: number;
  vw: number;
  scrollY: number;
  /** pointer offset from viewport centre, -0.5..0.5, or 0 before first move */
  px: number;
  py: number;
}

const effects = new Set<Effect>();
const state: DriverState = { vh: 0, vw: 0, scrollY: 0, px: 0, py: 0 };
let frame = 0;
let bound = false;

function flush() {
  frame = 0;
  state.vh = window.innerHeight;
  state.vw = window.innerWidth;
  state.scrollY = window.scrollY;
  for (const effect of effects) effect(state);
}

export function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function onPointer(e: PointerEvent) {
  state.px = e.clientX / window.innerWidth - 0.5;
  state.py = e.clientY / window.innerHeight - 0.5;
  schedule();
}

function bind() {
  if (bound) return;
  bound = true;
  // capture:true so the pass still runs when an inner element scrolls
  addEventListener("scroll", schedule, { passive: true, capture: true });
  addEventListener("resize", schedule, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
}

function unbind() {
  if (!bound) return;
  bound = false;
  removeEventListener("scroll", schedule, { capture: true });
  removeEventListener("resize", schedule);
  removeEventListener("pointermove", onPointer);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/** Register an effect. Returns the unsubscribe. */
export function addEffect(effect: Effect): () => void {
  effects.add(effect);
  bind();
  schedule();
  return () => {
    effects.delete(effect);
    if (!effects.size) unbind();
  };
}

/** Where `el` sits relative to the viewport centre: -1 below, 0 centred, 1 above.
 *  Matches the reference's `centered()` exactly. */
export function centered(el: Element): number {
  const r = el.getBoundingClientRect();
  const h = window.innerHeight;
  return Math.max(-1, Math.min(1, 1 - (r.top + r.height / 2) / (h / 2 + r.height / 2)));
}

export const clamp = (n: number, min: number, max: number) =>
  n < min ? min : n > max ? max : n;

/** How far a tall section has been scrolled through, 0..1.
 *  Designed for `height: Nvh` sections wrapping a `position: sticky` stage:
 *  0 when the section's top hits the viewport top, 1 when its bottom does. */
export function progress(el: Element): number {
  const r = el.getBoundingClientRect();
  const travel = r.height - window.innerHeight;
  if (travel <= 0) return r.top <= 0 ? 1 : 0;
  return clamp(-r.top / travel, 0, 1);
}

/** Smoothstep — eases a linear 0..1 so scroll-driven states settle instead of
 *  tracking the wheel exactly. */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** Maps t within [a, b] onto 0..1, clamped. Used to chain stages off one
 *  progress value without a timeline library. */
export const between = (t: number, a: number, b: number) =>
  clamp((t - a) / (b - a), 0, 1);

/** Linear interpolate. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

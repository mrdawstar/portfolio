/** Thin wrapper over whichever trackers are installed on the page.
 *  Every call is a no-op when a tracker is not configured. */

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
  }
}

export function track(event: "Lead" | "Contact" | "ViewCase" | "StartForm", params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const standard = event === "Lead" || event === "Contact";
  window.fbq?.(standard ? "track" : "trackCustom", event, params);
  window.gtag?.("event", event === "Lead" ? "generate_lead" : event, params);
}

/** UTM + referrer, carried into the lead so every enquiry has a source. */
export function sourceOf(search: string, referrer: string) {
  const q = new URLSearchParams(search);
  const parts = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => q.get(k) && `${k.replace("utm_", "")}=${q.get(k)}`)
    .filter(Boolean);
  if (referrer) parts.push(`ref=${referrer}`);
  return parts.join(" · ").slice(0, 280);
}

/** 8941 → "8 941". Intl skips the group separator below 10 000 in pl-PL,
 *  which made "8941 → 17 700" read as two different formats. */
export const plNum = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

import { useRef, useState } from "react";
import { site } from "../../data/site";
import { Picture } from "../Picture";
import { growth, clientValues } from "../../data/growth";
import { useScrollEffect } from "../../hooks/useScrollEffect";
import { useInView } from "../../hooks/useInView";
import { track, sourceOf } from "../../lib/track";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; at: string; autoReply: boolean }
  | { kind: "fallback"; mailto: string };

const hhmm = (d: Date) => d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

/** 07 — the one action. Four fields; the third ("what is one client worth to
 *  you?") qualifies the lead and starts the conversation on value, not cost.
 *
 *  After sending, the page shows the follow-up happening — and says so. If the
 *  delivery backend is not configured or fails, the same message opens as a
 *  prefilled e-mail, so an enquiry is never silently lost. */
export function Audit({ magnetic, preparedFor }: { magnetic: boolean; preparedFor: string | null }) {
  const [root, seen] = useInView<HTMLElement>();
  const [state, setState] = useState<State>({ kind: "idle" });
  const started = useRef(false);
  const btn = useRef<HTMLButtonElement>(null);

  useScrollEffect(({ px, py, vw, vh }) => {
    const el = btn.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = px * vw + vw / 2 - (r.left + r.width / 2);
    const dy = py * vh + vh / 2 - (r.top + r.height / 2);
    el.style.transform =
      Math.hypot(dx, dy) < 200 ? `translate3d(${dx * 0.08}px, ${dy * 0.1}px, 0)` : "translate3d(0,0,0)";
  }, magnetic);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    track("StartForm");
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      site: String(f.get("site") || ""),
      industry: String(f.get("industry") || ""),
      value: String(f.get("value") || ""),
      contact: String(f.get("contact") || ""),
      website_confirm: String(f.get("website_confirm") || ""),
      company: preparedFor ?? "",
      source: sourceOf(window.location.search, document.referrer),
    };
    setState({ kind: "sending" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; autoReply?: boolean };
      if (!res.ok || !json.ok) throw new Error(String(res.status));
      track("Lead", { value_band: data.value });
      setState({ kind: "done", at: hhmm(new Date()), autoReply: !!json.autoReply });
    } catch {
      const body = [
        `Strona / Instagram: ${data.site}`,
        `Branża: ${data.industry}`,
        `Wartość klienta: ${data.value}`,
        `Kontakt: ${data.contact}`,
      ].join("\n");
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
        "Audyt wycieków",
      )}&body=${encodeURIComponent(body)}`;
      track("Contact");
      setState({ kind: "fallback", mailto });
      window.location.href = mailto;
    }
  }

  return (
    <section
      id="audyt"
      ref={root}
      className={`gaudit${seen ? " is-seen" : ""}`}
      aria-labelledby="audit-heading"
    >
      <div className="index-row gsec__index">
        <span className="meta meta--accent">07</span>
        <span className="meta nowrap">Audyt wycieków</span>
      </div>

      <h2 id="audit-heading" className="gaudit__title">
        <span className="lineMask" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="lineMask__in">Pokaż mi, gdzie</span>
        </span>
        <span className="lineMask" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="lineMask__in">
            uciekają <em className="serif accent">moi klienci.</em>
          </span>
        </span>
      </h2>

      <div className="gaudit__grid">
        <div className="gaudit__pitch">
          <p>
            Nagrywam 5–10 minut wideo: przechodzę Twoją drogę od reklamy do kontaktu — jak
            klient — i pokazuję trzy miejsca, w których tracisz ludzi.
          </p>
          <ul className="gaudit__facts">
            <li>
              <span className="meta meta--sm">Koszt</span>0 zł
            </li>
            <li>
              <span className="meta meta--sm">Czas</span>48 godzin
            </li>
            <li>
              <span className="meta meta--sm">Zobowiązania</span>Żadnych
            </li>
          </ul>
          <div className="gaudit__sign">
            <span className="gaudit__face">
              <Picture name="about-bw" alt={site.name} sizes="54px" />
            </span>
            <span>
              Audyt nagrywam osobiście.
              <strong>
                {site.name} — {site.brand}
              </strong>
            </span>
          </div>
        </div>

        {state.kind === "done" ? (
          <div className="gaudit__done" role="status">
            <ol className="gaudit__timeline">
              <li className="is-on">
                <span className="meta meta--sm">{state.at}</span>Zgłoszenie dotarło
              </li>
              {state.autoReply && (
                <li className="is-on">
                  <span className="meta meta--sm">{state.at}</span>Potwierdzenie jest już w Twojej skrzynce
                </li>
              )}
              <li>
                <span className="meta meta--sm">≤ 48 h</span>Nagrywam audyt i wysyłam Ci link
              </li>
            </ol>
            <p className="gaudit__meta">
              {state.autoReply
                ? "To, co właśnie się stało — potwierdzenie w kilka sekund i jasny następny krok — to follow-up, który zbuduję u Ciebie."
                : "Szybka odpowiedź i jasny następny krok — dokładnie taki follow-up zbuduję u Ciebie."}
            </p>
          </div>
        ) : (
          <form className="gform" onSubmit={onSubmit} onInput={onFirstInput}>
            <label className="gform__f">
              <span className="meta meta--sm">Twoja strona lub Instagram</span>
              <input name="site" required autoComplete="url" placeholder="np. kuchnie-nowak.pl" maxLength={200} />
            </label>
            <label className="gform__f">
              <span className="meta meta--sm">Branża</span>
              <input name="industry" autoComplete="organization-title" placeholder="np. kuchnie na wymiar" maxLength={120} />
            </label>
            <fieldset className="gform__f gform__set">
              <legend className="meta meta--sm">Ile wart jest dla Ciebie jeden klient?</legend>
              <div className="gform__chips">
                {clientValues.map((v) => (
                  <label key={v} className="gform__chip">
                    <input type="radio" name="value" value={v} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="gform__f">
              <span className="meta meta--sm">E-mail lub telefon</span>
              <input name="contact" required autoComplete="email" placeholder="gdzie wysłać audyt" maxLength={200} />
            </label>
            {/* honeypot */}
            <label className="gform__hp" aria-hidden="true">
              Nie wypełniaj
              <input name="website_confirm" tabIndex={-1} autoComplete="off" />
            </label>

            <button ref={btn} type="submit" className="gbtn gbtn--solid gform__submit" disabled={state.kind === "sending"}>
              {state.kind === "sending" ? "Wysyłam…" : "Chcę audyt wycieków"}
              <span aria-hidden="true">→</span>
            </button>

            {state.kind === "fallback" && (
              <p className="gform__note" role="status">
                Otworzyłem gotową wiadomość w Twojej poczcie. Jeśli się nie pojawiła, napisz na{" "}
                <a href={state.mailto}>{site.email}</a>.
              </p>
            )}

            <p className="gform__alt">
              Wolisz napisać? <a href={`mailto:${site.email}`}>{site.email}</a>
              {growth.instagram && (
                <>
                  {" · "}
                  <a href={growth.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </>
              )}
              {growth.whatsapp && (
                <>
                  {" · "}
                  <a href={growth.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

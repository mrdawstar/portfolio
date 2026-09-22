import { useInView } from "../../hooks/useInView";
import { Picture } from "../Picture";
import { projects } from "../../data/projects";
import { scope, industries, steps, faq } from "../../data/growth";
import type { ImageName } from "../../data/images";

/** 04 — what I do. An index, not a grid of cards: one line of outcome each. */
export function Scope() {
  const [root, seen] = useInView<HTMLElement>();
  return (
    <section
      id="zakres"
      ref={root}
      className={`gsec gscope${seen ? " is-seen" : ""}`}
      aria-labelledby="scope-heading"
    >
      <div className="index-row gsec__index">
        <span className="meta meta--accent">04</span>
        <span className="meta nowrap">Co robię</span>
      </div>
      <h2 id="scope-heading" className="gsec__title">
        Wszystko między
        <br />
        reklamą a <em className="serif">klientem</em>
        <span className="stop">.</span>
      </h2>

      <ol className="gscope__list">
        {scope.map((s, i) => (
          <li key={s.title} className="gscope__row" style={{ "--i": i } as React.CSSProperties}>
            <span className="meta gscope__num">{String(i + 1).padStart(2, "0")}</span>
            <p className="gscope__t">{s.title}</p>
            <p className="gscope__n">{s.note}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 05 — who it is for, who it is not for, and the studio behind it. Saying no
 *  in public is what makes the yes worth something. */
export function Fit() {
  return (
    <section id="dla-kogo" className="gsec gfit" aria-labelledby="fit-heading">
      <div className="index-row gsec__index">
        <span className="meta meta--accent">05</span>
        <span className="meta nowrap">Dla kogo</span>
      </div>

      <div className="gfit__cols">
        <div>
          <h2 id="fit-heading" className="gfit__h">
            Dla firm, w których jeden klient jest wart{" "}
            <em className="serif">kilka tysięcy złotych</em>
            <span className="stop">.</span>
          </h2>
          <ul className="gfit__tags">
            {industries.map((x) => (
              <li key={x} className="meta">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="gfit__not">
          <span className="meta meta--sm">Nie dla</span>
          <p>Sklepów z produktem za 50 zł.</p>
          <p>Firm, które nie mają mocy przyjąć kolejnych klientów.</p>
          <p>Szukających „kogoś od postów”.</p>
        </div>
      </div>

      <div className="gfit__studio">
        <p className="gfit__studioT">
          Strony, na które kieruję ruch z reklam, projektuję i koduję sam.
        </p>
        <ul className="gfit__strip" aria-label="Wybrane strony">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="gfit__thumb" style={{ background: p.scene.bg }}>
                <Picture name={p.images.phone as ImageName} alt={p.name} sizes="(max-width: 759px) 30vw, 13vw" />
              </a>
              <span className="meta meta--sm">{p.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 06 — how we start. The first step costs the client nothing. */
export function Steps() {
  const [root, seen] = useInView<HTMLElement>();
  return (
    <section
      id="start"
      ref={root}
      className={`gsec gsteps${seen ? " is-seen" : ""}`}
      aria-labelledby="steps-heading"
    >
      <div className="index-row gsec__index">
        <span className="meta meta--accent">06</span>
        <span className="meta nowrap">Jak zaczynamy</span>
      </div>
      <h2 id="steps-heading" className="gsec__title">
        Pierwszy krok
        <br />
        <em className="serif">nic nie kosztuje</em>
        <span className="stop">.</span>
      </h2>

      <ol className="gsteps__list">
        {steps.map((s, i) => (
          <li key={s.title} className="gsteps__item" style={{ "--i": i } as React.CSSProperties}>
            <span className="gsteps__rule" aria-hidden="true" />
            <span className="meta meta--accent">{String(i + 1).padStart(2, "0")}</span>
            <p className="gsteps__t">{s.title}</p>
            <p className="meta meta--sm gsteps__tag">{s.tag}</p>
            <p className="gsteps__n">{s.note}</p>
          </li>
        ))}
      </ol>

      {/* the four things a cold visitor asks before replying */}
      <dl className="gfaq">
        {faq.map((f) => (
          <div key={f.q} className="gfaq__row">
            <dt className="gfaq__q">{f.q}</dt>
            <dd className="gfaq__a">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

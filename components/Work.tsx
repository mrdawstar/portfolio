import { useRef, useState } from "react";
import { projects, type Project } from "../data/projects";
import { Picture } from "./Picture";
import { useScrollEffect } from "../hooks/useScrollEffect";
import { useInView } from "../hooks/useInView";
import { progress, clamp } from "../lib/driver";
import type { ImageName } from "../data/images";
import { useCopy } from "../lib/lang";
import "./Work.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Metadata is identical across every scene — it is the WEBBOSS system holding
 *  five different art directions together. */
function Meta({ project, index }: { project: Project; index: number }) {
  const local = useCopy().projects[project.id];
  return (
    <div className="scene__meta">
      <span className="scene__index">{pad(index + 1)}</span>
      <span className="scene__category">{local?.category ?? project.category}</span>
      <span className="scene__link">{project.link}</span>
      <span className="scene__year">{project.year}</span>
    </div>
  );
}

function Scene({
  project,
  index,
  panelRef,
}: {
  project: Project;
  index: number;
  panelRef: (el: HTMLElement | null) => void;
}) {
  const { scene, layout } = project;
  const t = useCopy();
  const local = t.projects[project.id];

  return (
    <article
      ref={panelRef}
      className={`scene scene--${layout}${scene.light ? " scene--light" : ""}`}
      style={
        {
          "--scene-bg": scene.bg,
          "--scene-ink": scene.ink,
          "--scene-muted": scene.muted,
          "--scene-accent": scene.accent,
        } as React.CSSProperties
      }
    >
      <a
        className="scene__hit"
        href={project.url}
        target="_blank"
        rel="noreferrer noopener"
        data-cursor="view"
      >
        <span className="sr-only">
          {project.name} — {t.work.open}
        </span>
      </a>

      <span className="scene__hair" aria-hidden="true" />
      <Meta project={project} index={index} />

      <div className="scene__stage">
        <div className="scene__shot scene__shot--desktop">
          <Picture
            name={project.images.desktop as ImageName}
            alt={`${project.name} — desktop`}
            sizes="(max-width: 759px) 92vw, 62vw"
            className="scene__img"
          />
        </div>

        {/* Always rendered: the desktop `figure` staging hides it in CSS, but
            the stacked mobile composition uses it for every scene — cropping a
            wide architectural plate into a phone-shaped slot loses the work. */}
        <div className="scene__shot scene__shot--phone">
          <Picture
            name={project.images.phone as ImageName}
            alt={`${project.name} — mobile`}
            sizes="(max-width: 759px) 48vw, 15vw"
            className="scene__img"
          />
        </div>
      </div>

      <div className="scene__foot">
        <h3 className="scene__title">
          <span className="scene__titleMask">
            <span className="scene__titleWord">{project.name}</span>
          </span>
        </h3>
        <p className="scene__tagline">{local?.tagline ?? project.tagline}</p>
        <span className="scene__cta" aria-hidden="true">
          {t.work.view} <span className="scene__arrow">↗</span>
        </span>
      </div>
    </article>
  );
}

export function Work({
  motion,
  isMobile,
}: {
  motion: boolean;
  isMobile: boolean;
}) {
  const t = useCopy();
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [headRef, headSeen] = useInView<HTMLDivElement>("-4% 0px -4% 0px");

  /** The rail's travel is measured, not assumed: the panels are sized in vw
   *  and the gaps in clamp(), so the only reliable number is the real
   *  scrollWidth. Scroll progress through the tall section maps onto it 1:1. */
  useScrollEffect(() => {
    const sec = section.current;
    const r = rail.current;
    const st = stage.current;
    if (!sec || !r || !st) return;

    // scrollWidth omits a flex row's trailing padding, which would leave the
    // last scene overshooting the right gutter at the end of the rail.
    const padRight = parseFloat(getComputedStyle(r).paddingRight) || 0;
    const travel = r.scrollWidth + padRight - st.clientWidth;
    if (travel <= 0) return;

    const p = progress(sec);
    r.style.transform = `translate3d(${-p * travel}px, 0, 0)`;

    // Per-panel depth: each scene reacts to its own distance from the centre
    // of the viewport, so images counter-move and panels recede at the edges.
    const centre = st.clientWidth / 2;
    let nearest = 0;
    let nearestD = Infinity;

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const b = panel.getBoundingClientRect();
      const d = (b.left + b.width / 2 - centre) / st.clientWidth;
      const ad = Math.abs(d);
      if (ad < nearestD) {
        nearestD = ad;
        nearest = i;
      }
      panel.style.setProperty("--d", d.toFixed(4));

      // `--near` is distance from the stage centre: it drives depth only.
      panel.style.setProperty("--near", clamp(1 - ad * 1.4, 0, 1).toFixed(4));

      // `--in` is how far the scene has entered from the right edge. It
      // reaches 1 for every panel including the last, which `--near` cannot —
      // the rail stops before the final scene ever reaches the centre, so
      // anything keyed to `--near` would stay half-revealed there.
      const enter = clamp(
        (st.clientWidth - b.left) / (st.clientWidth * 0.55),
        0,
        1,
      );
      panel.style.setProperty("--in", enter.toFixed(4));
    });

    setActive((prev) => (prev === nearest ? prev : nearest));
  }, motion && !isMobile);

  // ——— mobile: stacked sticky scenes, each covering the last ———
  if (isMobile) {
    return (
      <section id="work" className="work work--stacked" aria-labelledby="work-heading">
        <div className="work__head work__head--stacked">
          <div className="index-row">
            <span className="meta meta--accent">03</span>
            <h2 id="work-heading" className="meta nowrap work__heading">
              {t.work.heading}
            </h2>
          </div>
          <span className="meta nowrap">{t.work.count(pad(projects.length))}</span>
        </div>

        <div className="work__stack">
          {projects.map((project, i) => (
            <div className="work__sticky" key={project.id}>
              <Scene project={project} index={i} panelRef={() => {}} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={section}
      className="work"
      aria-labelledby="work-heading"
      style={{ "--count": projects.length } as React.CSSProperties}
    >
      <div
        ref={stage}
        className="work__stage"
        style={{ background: projects[active].scene.bg }}
        data-light={projects[active].scene.light ? "" : undefined}
      >
        <div ref={headRef} className={`work__head${headSeen ? " is-seen" : ""}`}>
          <div className="index-row">
            <span className="meta meta--accent">03</span>
            <h2 id="work-heading" className="meta nowrap work__heading">
              {t.work.heading}
            </h2>
          </div>
          <span className="work__counter" aria-hidden="true">
            <span className="work__counterNow">{pad(active + 1)}</span>
            <span className="work__counterSep">/</span>
            <span className="work__counterAll">{pad(projects.length)}</span>
          </span>
        </div>

        <div ref={rail} className="work__rail">
          {projects.map((project, i) => (
            <Scene
              key={project.id}
              project={project}
              index={i}
              panelRef={(el) => {
                panels.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* a single hairline measuring how far through the rail you are */}
        <div className="work__progress" aria-hidden="true">
          {projects.map((p, i) => (
            <span
              key={p.id}
              className={`work__tick${i <= active ? " is-done" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

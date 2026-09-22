import { testimonial } from "../../data/growth";

/** Her words, in her platform's colours. Sits in the case straight after the
 *  numbers: the figures say what happened, she says what it felt like. */
export function Testimonial() {
  return (
    <figure className="gquote">
      <svg className="gquote__mark" viewBox="0 0 48 36" aria-hidden="true" focusable="false">
        <path d="M0 36V22C0 9 7 1 19 0l2 6C14 8 11 12 11 18h9v18H0Zm27 0V22C27 9 34 1 46 0l2 6c-7 2-10 6-10 12h9v18H27Z" />
      </svg>
      <blockquote className="gquote__q">
        <p className="gquote__pull">{testimonial.pull}</p>
        <p className="gquote__body">{testimonial.body}</p>
      </blockquote>
      <figcaption className="gquote__by">
        <span className="gquote__mono" aria-hidden="true">
          {testimonial.initials}
        </span>
        <span>
          <strong>{testimonial.name}</strong>
          <span className="meta">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** The same voice, one line, beside the form — where the doubt is. */
export function QuoteLine() {
  return (
    <figure className="gqline">
      <blockquote>„{testimonial.pull}”</blockquote>
      <figcaption className="meta meta--sm">
        {testimonial.name} · {testimonial.role}
      </figcaption>
    </figure>
  );
}

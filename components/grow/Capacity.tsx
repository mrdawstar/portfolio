import { useEffect, useState } from "react";
import { growth } from "../../data/growth";

/** Month names in the form "w ___" takes. */
const IN_MONTH = [
  "w styczniu", "w lutym", "w marcu", "w kwietniu", "w maju", "w czerwcu",
  "w lipcu", "w sierpniu", "we wrześniu", "w październiku", "w listopadzie", "w grudniu",
];

/** "Free places for a start in <month>". After the 20th the audits sent now
 *  turn into pilots next month, so the next month is the honest one to name.
 *  Rendered after mount: the date is the visitor's, not the build's. */
export function Capacity({ tone = "dark" }: { tone?: "dark" | "band" }) {
  const [month, setMonth] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    const m = d.getDate() >= 20 ? (d.getMonth() + 1) % 12 : d.getMonth();
    setMonth(IN_MONTH[m]);
  }, []);

  const free = Math.max(0, growth.capacity - growth.taken);

  return (
    <p className={`gcap gcap--${tone}`}>
      <span className="gcap__dots" aria-hidden="true">
        {Array.from({ length: growth.capacity }, (_, i) => (
          <i key={i} className={i < growth.taken ? "is-taken" : undefined} />
        ))}
      </span>
      <span>
        Pracuję osobiście, więc biorę maks. <strong>{growth.capacity} nowe firmy</strong> w miesiącu.
        {month && (
          <>
            {" "}
            Wolne miejsca na start {month}:{" "}
            <strong className="gcap__free">
              {free} z {growth.capacity}
            </strong>
          </>
        )}
      </span>
    </p>
  );
}

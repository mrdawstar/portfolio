import { useState } from "react";
import { plNum, track } from "../../lib/track";
import { clientValues } from "../../data/growth";

const fmt = plNum;
/** Display-size figures: a no-break space takes the CSS word-spacing that
 *  the narrow group separator ignores, so "50 000" does not read as "50000". */
const big = (n: number) => plNum(n).replace(/\u202f/g, "\u00a0");

/** Polish plural: 1 klient, 2 klienci, 5 klientów. */
const clientsWord = (n: number) => {
  if (n === 1) return "klient";
  const d = n % 10;
  const t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? "klienci" : "klientów";
};

const VISITS = { min: 100, max: 10000, step: 100, initial: 1000 };
/** uneven steps: a slider over 500 zł – 100 000 zł is useless linearly */
const VALUES = [500, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 50000, 75000, 100000];
const VALUE_INITIAL = VALUES.indexOf(5000);

/** The form's "what is one client worth" band for a slider value. */
export function bandOf(value: number): (typeof clientValues)[number] {
  if (value <= 2000) return clientValues[0];
  if (value <= 10000) return clientValues[1];
  if (value <= 50000) return clientValues[2];
  return clientValues[3];
}

/** The leak, priced in the visitor's own numbers. Pure arithmetic, no
 *  benchmark claims: visitors × 1% × value of a client. Touching the value
 *  slider pre-selects the same band in the form, so the number they arrive
 *  at travels with them to the audit. */
export function Calculator({ onBand }: { onBand: (band: string) => void }) {
  const [visits, setVisits] = useState(VISITS.initial);
  const [vi, setVi] = useState(VALUE_INITIAL);
  const [touched, setTouched] = useState(false);
  const value = VALUES[vi];
  const clients = visits / 100;
  const money = Math.round(clients * value);

  const first = () => {
    if (touched) return;
    setTouched(true);
    track("UseCalculator");
  };

  const pct = (n: number, min: number, max: number) => `${((n - min) / (max - min)) * 100}%`;

  return (
    <div className="gcalc">
      <div className="gcalc__head">
        <span className="meta meta--accent">Policz</span>
        <p className="gcalc__t">
          Ile jest wart <em className="serif">jeden procent</em> Twoich odwiedzających?
        </p>
      </div>

      <div className="gcalc__grid">
        <div className="gcalc__inputs">
          <label className="gcalc__f">
            <span className="gcalc__row">
              <span className="meta meta--sm">Osoby z reklam na Twojej stronie / mies.</span>
              <output className="gcalc__v">{big(visits)}</output>
            </span>
            <input
              type="range"
              min={VISITS.min}
              max={VISITS.max}
              step={VISITS.step}
              value={visits}
              style={{ "--p": pct(visits, VISITS.min, VISITS.max) } as React.CSSProperties}
              onChange={(e) => {
                first();
                setVisits(Number(e.target.value));
              }}
            />
          </label>

          <label className="gcalc__f">
            <span className="gcalc__row">
              <span className="meta meta--sm">Ile wart jest dla Ciebie jeden klient</span>
              <output className="gcalc__v">{big(value)} zł</output>
            </span>
            <input
              type="range"
              min={0}
              max={VALUES.length - 1}
              step={1}
              value={vi}
              aria-valuetext={`${fmt(value)} zł`}
              style={{ "--p": pct(vi, 0, VALUES.length - 1) } as React.CSSProperties}
              onChange={(e) => {
                first();
                const i = Number(e.target.value);
                setVi(i);
                onBand(bandOf(VALUES[i]));
              }}
            />
          </label>
        </div>

        <div className="gcalc__out">
          <p className="gcalc__money">
            {big(money)}
            <span className="serif"> zł</span>
          </p>
          <p className="gcalc__note">
            miesięcznie — tyle przynosi każdy <strong>1 na 100</strong> odwiedzających, który
            zostaje Twoim klientem ({fmt(clients)}{" "}
            {clientsWord(clients)}). Tyle kosztuje każdy procent, który
            wycieka po drodze.
          </p>
          <a href="#audyt" className="gcalc__cta" onClick={() => track("CalculatorCta")}>
            Pokaż, gdzie ucieka mój procent <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────────────────────
   OdometerDigit — a single rolling digit column.
   The column of 0–9 shifts vertically so the current digit shows through
   the viewport window, giving a mechanical counter feel.
────────────────────────────────────────────────────────────────────────────── */
function OdometerDigit({ digit }) {
  const d = parseInt(digit, 10);
  return (
    <div className="fd-odo-slot" aria-hidden="true">
      <div
        className="fd-odo-strip"
        style={{ transform: `translateY(-${d * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div key={n} className="fd-odo-digit">{n}</div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Odometer — full rolling-digit display for a number string.
   Non-digit characters (₹, comma, space) render as plain text.
────────────────────────────────────────────────────────────────────────────── */
function Odometer({ value }) {
  const formatted = value.toString();
  return (
    <div className="fd-odometer" role="text" aria-label={`₹${value}`}>
      <span className="fd-odo-prefix">₹</span>
      {formatted.split('').map((ch, i) =>
        /\d/.test(ch)
          ? <OdometerDigit key={i} digit={ch} />
          : <span key={i} className="fd-odo-sep">{ch}</span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   BudgetBar — animated stacked horizontal bar reflecting budget splits.
────────────────────────────────────────────────────────────────────────────── */
const SEGMENTS = [
  { key: 'stay',       label: 'Stay',       pct: 0.40, color: '#276667' },
  { key: 'transport',  label: 'Transport',  pct: 0.25, color: '#B8862F' },
  { key: 'food',       label: 'Food',       pct: 0.22, color: '#C43E2E' },
  { key: 'activities', label: 'Activities', pct: 0.13, color: 'rgba(255,255,255,0.22)' },
];

function BudgetBar({ total }) {
  return (
    <div>
      {/* Stacked bar */}
      <div className="fd-budget-bar-track">
        {SEGMENTS.map(s => (
          <div
            key={s.key}
            className="fd-budget-bar-seg"
            style={{
              width: `${s.pct * 100}%`,
              background: s.color,
            }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="fd-budget-legend">
        {SEGMENTS.map(s => (
          <div key={s.key} className="fd-budget-legend-item">
            <span className="fd-budget-legend-dot" style={{ background: s.color }} />
            <span className="fd-budget-legend-label">{s.label}</span>
            <span className="fd-budget-legend-val font-mono">
              ₹{Math.round(total * s.pct).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   BudgetDial — boarding-pass-styled slider + live odometer total.
   The track is a dashed "tear line"; the thumb is a paper-plane glyph.
────────────────────────────────────────────────────────────────────────────── */
const MIN_BUDGET = 5000;
const MAX_BUDGET = 150000;
const DAYS       = 7;

export default function BudgetDial({ theme = 'dark' }) {
  const [budget, setBudget] = useState(42000);
  const trackRef            = useRef(null);

  const formatted = budget.toLocaleString('en-IN');
  const pct        = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  const handleChange = useCallback((e) => {
    setBudget(Number(e.target.value));
  }, []);

  return (
    <div className={`fd-budget-dial ${theme === 'light' ? 'light-mode' : ''}`}>
      {/* Main total */}
      <div className="mb-2">
        <Odometer value={formatted} />
        <p className="fd-budget-subtitle font-mono">
          for {DAYS} days · {Math.round(budget / DAYS).toLocaleString('en-IN')} per day
        </p>
      </div>

      {/* Slider — styled as a boarding-pass tear line */}
      <div className="fd-slider-shell" ref={trackRef}>
        {/* Dashed track */}
        <div className="fd-slider-track">
          {/* Filled portion */}
          <div className="fd-slider-fill" style={{ width: `${pct}%` }} />
        </div>
        {/* Native range input (invisible, overlaid for interaction) */}
        <input
          type="range"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={500}
          value={budget}
          onChange={handleChange}
          className="fd-slider-input"
          aria-label="Trip budget"
          aria-valuemin={MIN_BUDGET}
          aria-valuemax={MAX_BUDGET}
          aria-valuenow={budget}
          aria-valuetext={`₹${formatted}`}
        />
        {/* Custom thumb — paper plane */}
        <div
          className="fd-slider-thumb"
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        >
          ✈
        </div>
      </div>

      {/* Min / Max labels */}
      <div className="fd-slider-labels font-mono">
        <span>₹{(MIN_BUDGET / 1000).toFixed(0)}K</span>
        <span>₹{(MAX_BUDGET / 1000).toFixed(0)}K</span>
      </div>

      {/* Budget breakdown bar */}
      <div className="mt-8">
        <BudgetBar total={budget} />
      </div>
    </div>
  );
}

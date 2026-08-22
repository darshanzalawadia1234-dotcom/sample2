/* ──────────────────────────────────────────────────────────────────────────────
   RadarHUD — a small fixed circular progress indicator in the corner.
   Fills clockwise as the user scrolls through the pinned Flight Deck section,
   like a flight-tracker radar sweep giving a sense of "distance remaining."
────────────────────────────────────────────────────────────────────────────── */
export default function RadarHUD({ progress = 0 }) {
  const R     = 20;           // circle radius
  const cx    = 34;           // SVG center x
  const cy    = 34;           // SVG center y
  const SIZE  = 68;           // viewBox size
  const CIRC  = 2 * Math.PI * R;
  const offset = CIRC * (1 - Math.min(1, progress));

  // Fade the whole HUD in once scrolling starts, out when done
  const opacity = progress <= 0 ? 0 : progress >= 0.98 ? 0 : 1;

  return (
    <div
      className="fd-radar-hud"
      aria-label={`Flight deck progress: ${Math.round(progress * 100)}%`}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ opacity, transition: 'opacity 0.4s' }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        fill="none"
      >
        {/* Backdrop circle */}
        <circle
          cx={cx} cy={cy} r={R}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="2.5"
        />
        {/* Sweeping arc — draws clockwise with scroll */}
        <circle
          cx={cx} cy={cy} r={R}
          stroke="#B8862F"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            filter: 'drop-shadow(0 0 4px rgba(184,134,47,0.7))',
            transition: 'stroke-dashoffset 0.2s linear',
          }}
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="#B8862F" />
        {/* Sweep line (radar hand) */}
        <line
          x1={cx} y1={cy}
          x2={cx + R * Math.cos((progress * 360 - 90) * (Math.PI / 180))}
          y2={cy + R * Math.sin((progress * 360 - 90) * (Math.PI / 180))}
          stroke="rgba(184,134,47,0.5)"
          strokeWidth="1"
        />
      </svg>
      {/* Percentage label */}
      <span className="fd-radar-pct font-mono">
        {Math.round(progress * 100)}
        <span style={{ fontSize: '0.6em' }}>%</span>
      </span>
    </div>
  );
}

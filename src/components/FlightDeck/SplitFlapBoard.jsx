import { useState, useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────────────────────
   FlapChar — a single character tile with a 3D flip animation.
   Each time `char` changes, the tile re-mounts with a CSS flip keyframe.
────────────────────────────────────────────────────────────────────────────── */
function FlapChar({ char, delay = 0 }) {
  const [shown, setShown]   = useState(char);
  const [flipKey, setKey]   = useState(0);
  const prevRef             = useRef(char);

  useEffect(() => {
    if (char === prevRef.current) return;
    // Small delay per character for a ripple effect
    const t = setTimeout(() => {
      prevRef.current = char;
      setShown(char);
      setKey(k => k + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [char, delay]);

  return (
    <span
      key={flipKey}
      className="fd-flap-char"
      style={{ animationDelay: `${delay}ms` }}
    >
      {shown === ' ' ? '\u00A0' : shown}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   SplitFlapBoard — departure board that cycles through city codes or messages.
────────────────────────────────────────────────────────────────────────────── */
export default function SplitFlapBoard({ cities = [], messages = [], scale = 1 }) {
  const isMessageMode = messages.length > 0;
  const items = isMessageMode ? messages : cities;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 2600);
    return () => clearInterval(t);
  }, [items.length]);

  const active   = items[idx] || '';
  const upcoming = isMessageMode ? [] : [1, 2, 3].map(n => items[(idx + n) % items.length]);

  return (
    <div 
      className={`fd-board ${isMessageMode ? 'fd-board-message-mode' : ''}`} 
      role="region" 
      aria-label="Departure board"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
    >
      {!isMessageMode && (
        <>
          <div className="fd-board-header">
            <span>Departures</span>
            <span className="fd-board-pulse" aria-hidden="true" />
          </div>
          <div className="fd-board-divider" aria-hidden="true" />
        </>
      )}

      {/* Active city or message */}
      <div 
        className={`fd-board-active ${isMessageMode ? 'flex-wrap justify-center py-6 px-4' : ''}`} 
        aria-live="polite" 
        aria-atomic="true"
        style={isMessageMode ? { fontSize: '2.5rem', lineHeight: '1.2', gap: '0.15em' } : {}}
      >
        {active.split('').map((ch, i) => (
          <FlapChar key={`${idx}-${i}`} char={ch} delay={i * 35} />
        ))}
      </div>

      {!isMessageMode && (
        <>
          <div className="fd-board-divider" aria-hidden="true" />
          <div className="fd-board-upcoming" aria-hidden="true">
            {upcoming.map((city, i) => (
              <div
                key={city + i}
                className="fd-board-upcoming-row"
                style={{ opacity: 0.45 - i * 0.12 }}
              >
                <span className="fd-board-seq">{String((idx + i + 1) % items.length + 1).padStart(2, '0')}</span>
                <span className="fd-board-city-name">{city}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

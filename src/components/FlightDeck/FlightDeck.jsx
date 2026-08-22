import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SplitFlapBoard from './SplitFlapBoard';
import BudgetDial     from './BudgetDial';
import ParticleCanvas from './ParticleCanvas';
import RadarHUD       from './RadarHUD';
import MagneticButton from '../MagneticButton';

/* ── Data ────────────────────────────────────────────────────────────────────── */
const BOARD_CITIES = ['TYO', 'BCN', 'CPT', 'REY', 'DXB', 'BKK', 'SYD', 'IST'];

const ROUTE = [
  { code: 'DEL', name: 'New Delhi',  px: 0.1, py: 0.65 },
  { code: 'DXB', name: 'Dubai',      px: 0.5, py: 0.35 },
  { code: 'BCN', name: 'Barcelona',  px: 0.9, py: 0.55 },
];

const ITINERARY = [
  { day: 1, city: 'New Delhi', code: 'DEL', desc: 'India Gate at sunrise · Chandni Chowk breakfast', cost: '₹2,400' },
  { day: 3, city: 'Dubai',     code: 'DXB', desc: 'Burj Khalifa observation deck · Desert safari at dusk', cost: '₹8,100' },
  { day: 6, city: 'Barcelona', code: 'BCN', desc: 'Sagrada Família · Tapas and wine in El Born quarter', cost: '₹6,700' },
];

function SplitChars({ text, className = '' }) {
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <span key={i} className="fd-char" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

function ReducedFallback() {
  return (
    <section className="py-24 bg-[var(--runway-navy)] text-center text-[var(--warm-paper)]">
      <p className="font-mono text-[var(--compass-brass)] text-xs tracking-widest uppercase mb-6">
        Personalized travel planning
      </p>
      <h2 className="font-serif mb-6 tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,4.5rem)', lineHeight: 0.92 }}>
        Plan the trip.<br />
        <span className="text-[var(--compass-brass)]">Skip the spreadsheet.</span>
      </h2>
      <Link to="/plan" className="px-8 py-3.5 rounded-full bg-[var(--coral)] text-[var(--warm-paper)] font-semibold text-sm">
        Start Planning
      </Link>
    </section>
  );
}

export default function FlightDeck() {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const outerRef   = useRef(null);
  const stickyRef  = useRef(null);
  const glowRef    = useRef(null);
  const compassRef = useRef(null);
  const svgRef     = useRef(null);

  const s1Ref = useRef(null);
  const s2Ref = useRef(null);
  const s3Ref = useRef(null);
  const s4Ref = useRef(null);

  const routePathRef = useRef(null);
  const planeRef     = useRef(null);
  const dotRefs      = [useRef(null), useRef(null), useRef(null)];
  const labelRefs    = [useRef(null), useRef(null), useRef(null)];

  const spineRef = useRef(null);
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const numRefs  = [useRef(null), useRef(null), useRef(null)];

  const [radar, setRadar] = useState(0);

  const [svgSize, setSvgSize] = useState({ w: 940, h: 260 });

  useEffect(() => {
    if (prefersReduced) return;

    let gsapCtx, lenis;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { MotionPathPlugin } = await import('gsap/MotionPathPlugin');
      const Lenis = (await import('lenis')).default;

      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

      const updateSize = () => {
        if (svgRef.current) {
          setSvgSize({ w: svgRef.current.clientWidth, h: svgRef.current.clientHeight });
        }
      };
      window.addEventListener('resize', updateSize);
      updateSize();

      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      const onMouseMove = (e) => {
        if (!stickyRef.current || !glowRef.current) return;
        const rect = stickyRef.current.getBoundingClientRect();
        if (e.clientY < rect.top || e.clientY > rect.bottom) return;
        gsap.to(glowRef.current, {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          duration: 0.9,
          ease: 'power3.out',
        });
      };
      window.addEventListener('mousemove', onMouseMove);

      gsapCtx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'none' } });

        const chars = s1Ref.current?.querySelectorAll?.('.fd-char') ?? [];
        if (chars.length) {
          tl.from(chars, { opacity: 0, y: 48, ease: 'expo.out', stagger: 0.012, duration: 0.35 }, 0);
        }
        if (compassRef.current) tl.to(compassRef.current, { rotation: 180, ease: 'back.out(3)', duration: 0.2 }, 0.28);
        tl.to(s1Ref.current, { opacity: 0, y: -50, duration: 0.18 }, 0.32);

        tl.fromTo(s2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15 }, 0.34);

        const path = routePathRef.current;
        if (path) {
          const len = path.getTotalLength?.() ?? 1500;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 0.22 }, 0.36);
          
          if (planeRef.current) {
            tl.to(planeRef.current, {
              motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: true
              },
              duration: 0.22
            }, 0.36);
            tl.fromTo(planeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.36);
          }
        }

        ROUTE.forEach((_, i) => {
          const at = 0.38 + i * 0.07;
          tl.fromTo(dotRefs[i].current, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(3)', duration: 0.14 }, at);
          tl.fromTo(labelRefs[i].current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.1 }, at + 0.05);
        });

        tl.to(s2Ref.current, { opacity: 0, duration: 0.12 }, 0.62);

        tl.fromTo(s3Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.64);
        if (spineRef.current) tl.from(spineRef.current, { scaleY: 0, transformOrigin: 'top center', duration: 0.30 }, 0.66);

        ITINERARY.forEach((_, i) => {
          const at = 0.67 + i * 0.075;
          const dir = i % 2 === 0 ? -110 : 110;
          tl.fromTo(cardRefs[i].current, { opacity: 0, x: dir, rotation: i % 2 === 0 ? -7 : 7 }, { opacity: 1, x: 0, rotation: 0, ease: 'back.out(1.7)', duration: 0.22 }, at);
          tl.fromTo(numRefs[i].current, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.16 }, at + 0.16);
        });

        tl.to(s3Ref.current, { opacity: 0, duration: 0.12 }, 0.88);

        tl.fromTo(s4Ref.current, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.14 }, 0.90);

        ScrollTrigger.create({
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          animation: tl,
          onUpdate: (self) => setRadar(self.progress),
        });
      }, outerRef);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', updateSize);
      };
    };

    let cleanup;
    init().then(fn => { cleanup = fn; });

    return () => {
      cleanup?.();
      gsapCtx?.revert();
      lenis?.destroy();
    };
  }, [prefersReduced, svgSize.w, svgSize.h]); 

  if (prefersReduced) return <ReducedFallback />;

  const pt = (p) => ({ x: p.px * svgSize.w, y: p.py * svgSize.h });
  const p0 = pt(ROUTE[0]);
  const p1 = pt(ROUTE[1]);
  const p2 = pt(ROUTE[2]);
  const cp1x = p0.x + (p1.x - p0.x) * 0.5;
  const cp1y = p0.y;
  const cp2x = p1.x - (p1.x - p0.x) * 0.5;
  const cp2y = p1.y;
  const cp3x = p1.x + (p2.x - p1.x) * 0.5;
  const cp3y = p1.y;
  const cp4x = p2.x - (p2.x - p1.x) * 0.5;
  const cp4y = p2.y;
  
  const dPath = `M ${p0.x},${p0.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y} C ${cp3x},${cp3y} ${cp4x},${cp4y} ${p2.x},${p2.y}`;

  return (
    <div ref={outerRef} style={{ height: '450vh' }} className="relative">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden fd-section bg-[var(--runway-navy)]">
        
        <div className="fd-aurora" aria-hidden="true">
          <div className="fd-blob fd-blob-brass" />
          <div className="fd-blob fd-blob-teal"  />
          <div className="fd-blob fd-blob-poppy" />
        </div>
        <div className="fd-grain" aria-hidden="true" />

        <svg className="fd-constellation" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i} cx={(i * 137.5) % 1440} cy={(i * 89.3) % 900} r={1 + (i % 3) * 0.5} fill="rgba(255,255,255,0.07)" />
          ))}
        </svg>

        <ParticleCanvas />
        <div ref={glowRef} className="fd-cursor-glow" aria-hidden="true" />

        <div ref={s1Ref} className="fd-stage">
          <div className="max-w-7xl mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 pt-20 pb-8">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[var(--compass-brass)] text-[0.68rem] tracking-[0.28em] uppercase mb-7">
                Personalized travel planning
              </p>
              <h2 className="font-serif text-[var(--warm-paper)] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.8rem)', lineHeight: 0.9 }}>
                <SplitChars text="Plan the trip." />
                <br />
                <SplitChars text="Skip the" className="text-[var(--compass-brass)]" />
                <br />
                <SplitChars text="spreadsheet." className="text-[var(--compass-brass)]" />
              </h2>
              <p className="text-[var(--warm-paper)]/60 mt-6 max-w-sm text-base leading-relaxed">
                Build multi-city itineraries, track budget, and make travel feel official.
              </p>
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <MagneticButton className="fd-cta-btn bg-[var(--coral)] hover:bg-[#E55A3D]">Start planning</MagneticButton>
                <span ref={compassRef} className="select-none text-white/25 text-3xl" aria-hidden="true">⊕</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <SplitFlapBoard cities={BOARD_CITIES} />
            </div>
          </div>
        </div>

        <div ref={s2Ref} className="fd-stage" style={{ opacity: 0 }}>
          <div className="max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
            <p className="font-mono text-[var(--compass-brass)] text-[0.68rem] tracking-[0.28em] uppercase mb-4">Your route</p>
            <h3 className="font-serif text-[var(--warm-paper)] mb-14 tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.95 }}>
              A sample journey unfolds.
            </h3>

            <div className="w-full h-[260px] relative">
              <svg ref={svgRef} className="absolute inset-0 w-full h-full overflow-visible">
                <path
                  ref={routePathRef}
                  d={dPath}
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,74,0.65))' }}
                  strokeDasharray="8 8"
                />
                
                <g ref={planeRef} style={{ opacity: 0 }}>
                  <path d="M 0,-10 L 10,10 L 0,5 L -10,10 Z" fill="var(--warm-paper)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }} />
                </g>

                {ROUTE.map((city, i) => {
                  const point = pt(city);
                  return (
                    <g key={city.code}>
                      <circle
                        ref={dotRefs[i]}
                        cx={point.x} cy={point.y} r={14}
                        fill="var(--poppy-stamp)"
                        stroke="var(--runway-navy)"
                        strokeWidth="3.5"
                        style={{
                          opacity: 0,
                          transformOrigin: `${point.x}px ${point.y}px`,
                          filter: 'drop-shadow(0 0 6px rgba(196,62,46,0.6))',
                        }}
                      />
                      <g ref={labelRefs[i]} style={{ opacity: 0 }}>
                        <text x={point.x} y={point.y + 36} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="14" fontWeight="600" fill="var(--compass-brass)">
                          {city.code}
                        </text>
                        <text x={point.x} y={point.y + 52} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill="rgba(255,255,255,0.5)">
                          {city.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div ref={s3Ref} className="fd-stage" style={{ opacity: 0 }}>
          <div className="max-w-3xl mx-auto px-6 h-full flex flex-col justify-center py-8">
            <p className="font-mono text-[var(--compass-brass)] text-[0.68rem] tracking-[0.28em] uppercase mb-6">Day by day</p>
            <div className="flex gap-8">
              <div className="flex flex-col items-center flex-shrink-0 pt-3">
                <div ref={spineRef} className="w-[3px] rounded-full" style={{ height: `${ITINERARY.length * 152}px`, background: 'linear-gradient(to bottom, var(--compass-brass) 0%, var(--horizon-mint) 100%)' }} />
              </div>
              <div className="flex flex-col gap-5 flex-1">
                {ITINERARY.map((stop, i) => (
                  <div key={stop.code} className="relative flex items-center">
                    <div ref={numRefs[i]} className="absolute -left-[3.5rem] w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0" style={{ background: 'var(--compass-brass)', opacity: 0 }}>
                      <span className="font-mono text-[var(--runway-navy)] text-[0.7rem] font-bold">{String(stop.day).padStart(2, '0')}</span>
                    </div>
                    <div ref={cardRefs[i]} className="fd-boarding-pass flex-1" style={{ opacity: 0 }}>
                      <div className="fd-perf-edge" aria-hidden="true" />
                      <div className="pr-12">
                        <div className="flex items-baseline justify-between mb-2">
                        </div>
                        <p className="text-[#20211D]/60 text-sm leading-snug">
                          {stop.desc}
                        </p>
                        <div className="mt-3 flex items-center gap-5">
                          <span className="font-mono text-sm text-[#276667] font-semibold">
                            {stop.cost}
                          </span>
                          <span className="font-mono text-xs text-[#20211D]/38 tracking-wider">
                            DAY {String(stop.day).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            STAGE 4 — BUDGET DIAL
            Live slider with rolling odometer + stacked bar chart
        ════════════════════════════════════════════════════════════════ */}
        <div ref={s4Ref} className="fd-stage" style={{ opacity: 0 }}>
          <div className="max-w-2xl mx-auto px-6 h-full flex flex-col justify-center">
            <p className="font-mono text-[#B8862F] text-[0.68rem] tracking-[0.28em] uppercase mb-6">
              Set your budget
            </p>
            <BudgetDial />
            <div className="mt-10 text-center">
              <Link
                to="/plan"
                className="fd-cta-btn"
              >
                Plan this trip
              </Link>
            </div>
          </div>
        </div>

        {/* ── Radar progress HUD ── */}
        <RadarHUD progress={radar} />

      </div>{/* /sticky */}
    </div>/* /outer */
  );
}

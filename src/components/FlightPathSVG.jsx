import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

export default function FlightPathSVG({ stops, animated = false, animateOnMount = false, className = '' }) {
  const svgRef = useRef(null);
  const routePathRef = useRef(null);
  const planeRef = useRef(null);
  const [svgSize, setSvgSize] = useState({ w: 940, h: 260 });

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);

    const updateSize = () => {
      if (svgRef.current) {
        setSvgSize({ w: svgRef.current.clientWidth, h: svgRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!animated || !animateOnMount) return;

    const path = routePathRef.current;
    if (path) {
      const len = path.getTotalLength?.() ?? 1500;
      gsap.fromTo(path, 
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }
      );
      
      if (planeRef.current) {
        gsap.to(planeRef.current, {
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: true
          },
          duration: 1.5,
          ease: 'power2.inOut'
        });
        gsap.fromTo(planeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
      }
    }
  }, [animated, animateOnMount, svgSize]);

  // Handle defaults if stops are missing
  const defaultStops = [
    { px: 0.1, py: 0.65, code: 'DEL' },
    { px: 0.5, py: 0.35, code: 'DXB' },
    { px: 0.9, py: 0.55, code: 'BCN' },
  ];
  const activeStops = stops || defaultStops;

  const pt = (p) => ({ x: p.px * svgSize.w, y: p.py * svgSize.h });

  // Generate simple bezier curve path connecting points
  let dPath = '';
  if (activeStops.length >= 2) {
    const p0 = pt(activeStops[0]);
    dPath = `M ${p0.x},${p0.y} `;
    
    for (let i = 1; i < activeStops.length; i++) {
      const prev = pt(activeStops[i - 1]);
      const curr = pt(activeStops[i]);
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.5;
      const cp2y = curr.y;
      dPath += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y} `;
    }
  }

  return (
    <svg ref={svgRef} className={`w-full h-full overflow-visible ${className}`}>
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
      
      {animated && (
        <g ref={planeRef} style={{ opacity: animateOnMount ? 0 : 1 }}>
          <path d="M 0,-10 L 10,10 L 0,5 L -10,10 Z" fill="var(--warm-paper)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }} />
        </g>
      )}

      {activeStops.map((stop, i) => {
        const point = pt(stop);
        return (
          <circle
            key={i}
            cx={point.x} cy={point.y} r={animated ? 14 : 6}
            fill={animated ? "var(--poppy-stamp)" : "var(--deep-navy)"}
            stroke={animated ? "var(--runway-navy)" : "var(--coral)"}
            strokeWidth={animated ? 3.5 : 2}
            style={animated ? { filter: 'drop-shadow(0 0 6px rgba(196,62,46,0.6))' } : {}}
          />
        );
      })}
    </svg>
  );
}

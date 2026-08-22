import { useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────────────────────
   ParticleCanvas — ~40 drifting dust/star particles on a canvas.
   Particles drift upward slowly at very low opacity to add depth to the
   dark background without becoming a focal element.
────────────────────────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 42;

function mkParticle(w, h) {
  return {
    x:       Math.random() * w,
    y:       Math.random() * h,
    r:       Math.random() * 1.6 + 0.4,
    speed:   Math.random() * 0.3 + 0.08,
    drift:   (Math.random() - 0.5) * 0.12,
    opacity: Math.random() * 0.18 + 0.04,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const raf       = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    let W = 0, H = 0;
    let particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => mkParticle(W, H));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Drift upward + slight horizontal wobble
        p.y    -= p.speed;
        p.x    += p.drift;
        // Wrap back to bottom
        if (p.y < -4) {
          p.y = H + 4;
          p.x = Math.random() * W;
        }
      }
      raf.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fd-particle-canvas"
      aria-hidden="true"
    />
  );
}

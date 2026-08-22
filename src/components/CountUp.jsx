import React, { useRef, useEffect, useState } from 'react';

export default function CountUp({ target, duration = 2000, className = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    // Prefers reduced motion check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    let start = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressNormalized = Math.min(progress / duration, 1);
      
      // easeOutExpo
      const ease = progressNormalized === 1 ? 1 : 1 - Math.pow(2, -10 * progressNormalized);
      
      setCount(Math.floor(ease * target));

      if (progress < duration) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [hasAnimated, target, duration]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {count.toLocaleString('en-IN')}
    </span>
  );
}

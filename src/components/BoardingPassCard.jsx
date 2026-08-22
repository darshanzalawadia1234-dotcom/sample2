import React from 'react';

export default function BoardingPassCard({ children, className = '', style }) {
  return (
    <div 
      className={`fd-boarding-pass shadow-lg bg-[var(--warm-paper)] ${className}`}
      style={style}
    >
      <div className="fd-perf-edge" aria-hidden="true" />
      <div className="pr-12">
        {children}
      </div>
    </div>
  );
}

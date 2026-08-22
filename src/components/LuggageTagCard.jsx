import React from 'react';

export default function LuggageTagCard({ destination, index = 0, style, className = '' }) {
  // If index is provided, alternate rotation. Else keep it flat or use provided style.
  const transform = style?.transform || `rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`;

  return (
    <div 
      className={`flex-shrink-0 w-[280px] bg-[var(--warm-paper)] rounded-2xl p-3 shadow-xl transition-all duration-300 hover:rotate-0 hover:scale-105 select-none ${className}`}
      style={{ transform, ...style }}
    >
      <div className="h-48 rounded-xl overflow-hidden mb-4 relative">
        <img 
          src={destination.image || destination.img || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop'} 
          alt={destination.name} 
          className="w-full h-full object-cover pointer-events-none" 
          draggable="false" 
        />
        <div className="absolute top-3 left-3 bg-[var(--runway-navy)] text-[var(--warm-paper)] px-3 py-1 rounded-full font-mono text-xs font-bold pointer-events-none">
          {destination.countryCode || destination.id?.substring(0,3).toUpperCase() || 'XXX'}
        </div>
      </div>
      <div className="px-2 pb-2">
        <h4 className="font-serif text-2xl text-[var(--runway-navy)] pointer-events-none">{destination.name}</h4>
        <p className="font-mono text-xs text-[var(--ink)]/50 tracking-widest uppercase mt-1 pointer-events-none">
          {destination.country || destination.tagline || 'Explore'}
        </p>
      </div>
    </div>
  );
}

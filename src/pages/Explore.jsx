import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import LuggageTagCard from '@/components/LuggageTagCard';
import { Compass, Search, X } from 'lucide-react';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const REGIONS = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];

// Map regions to country codes for simple filtering (mock data subset for demo)
const REGION_MAP = {
  'Asia': ['IN', 'JP', 'AE', 'TH', 'CN', 'KR'],
  'Europe': ['FR', 'ES', 'GB', 'IT', 'DE', 'IS', 'PT'],
  'Africa': ['ZA', 'EG', 'MA', 'KE'],
  'Americas': ['US', 'CA', 'BR', 'MX', 'AR'],
  'Oceania': ['AU', 'NZ', 'FJ']
};

export default function Explore() {
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState(null); // ISO alpha-2
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,flags')
      .then(res => res.json())
      .then(data => {
        const mapped = data
          .filter(c => c.capital && c.capital.length > 0)
          .map(c => ({
            id: c.cca2,
            name: c.capital[0],
            countryCode: c.cca2,
            country: c.name.common,
            img: c.flags.svg, // Using flag as placeholder image
            tagline: c.region
          }))
          // Sort alphabetically by country name for consistency
          .sort((a, b) => a.country.localeCompare(b.country));
        setDestinations(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch destinations", err);
        setLoading(false);
      });
  }, []);

  const filteredDestinations = useMemo(() => {
    let filtered = destinations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.country.toLowerCase().includes(q) ||
        (d.tagline && d.tagline.toLowerCase().includes(q))
      );
    }
    if (selectedCountry) {
      filtered = filtered.filter(d => d.country === selectedCountry);
    } else if (activeRegion !== 'All') {
      const allowedCodes = REGION_MAP[activeRegion] || [];
      filtered = filtered.filter(d => allowedCodes.includes(d.countryCode));
    }
    return filtered;
  }, [activeRegion, selectedCountry, searchQuery, destinations]);

  const handleCountryClick = (geo) => {
    const name = geo.properties.name;
    // Toggle selection
    if (selectedCountry === name) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(name);
      setActiveRegion('All'); // Clear region when country selected
      
      // Scroll to grid with slight offset
      setTimeout(() => {
        if (gridRef.current) {
          const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleRegionClick = (region) => {
    setActiveRegion(region);
    setSelectedCountry(null); // Clear country when region selected
  };

  return (
    <div className="min-h-screen bg-[var(--runway-navy)] text-[var(--warm-paper)] flex flex-col fade-in">
      <style>{`
        @keyframes pan {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── 1. Header & Filter Chips ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 w-full relative z-10">
        <p className="font-mono text-[var(--compass-brass)] text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4" /> Explore the Map
        </p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-8">
          Find your <em className="italic text-[var(--horizon-mint)]">next stop.</em>
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--warm-paper)]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, country, or region..."
            className="w-full bg-[var(--deep-navy)]/60 border border-[var(--deep-navy)] rounded-full py-3 pl-11 pr-10 text-[var(--warm-paper)] font-mono text-sm placeholder:text-[var(--warm-paper)]/40 focus:outline-none focus:border-[var(--compass-brass)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--warm-paper)]/40 hover:text-[var(--warm-paper)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => handleRegionClick(r)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-mono text-[13px] tracking-wider uppercase transition-all duration-300 border ${
                activeRegion === r && !selectedCountry
                  ? 'bg-[var(--compass-brass)] border-[var(--compass-brass)] text-[var(--runway-navy)] font-bold'
                  : 'bg-transparent border-[var(--deep-navy)] text-[var(--warm-paper)] hover:border-[var(--compass-brass)]/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {/* ── 2. Interactive World Map ── */}
      <section className="w-full h-[50vh] md:h-[65vh] min-h-[400px] bg-[var(--runway-navy)] border-y border-[var(--deep-navy)] relative">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} style={{ width: '100%', height: '100%' }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isSelected = selectedCountry === name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? 'var(--coral)' : 'var(--deep-navy)',
                        fillOpacity: isSelected ? 1 : 0.6,
                        stroke: 'var(--runway-navy)',
                        strokeWidth: 0.5,
                        outline: 'none',
                        transition: 'all 150ms ease-out',
                      },
                      hover: {
                        fill: isSelected ? 'var(--coral)' : 'var(--compass-brass)',
                        fillOpacity: 1,
                        stroke: 'var(--runway-navy)',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                        transform: 'translateY(-2px)',
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                      },
                      pressed: {
                        fill: 'var(--coral)',
                        outline: 'none',
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </section>

      {/* ── 4. Destination Grid ── */}
      <section ref={gridRef} className="flex-1 bg-[var(--runway-navy)] py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          {selectedCountry && (
            <div className="mb-10 flex items-center">
              <span className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase bg-[var(--deep-navy)] px-4 py-2 rounded-full inline-flex items-center gap-3">
                Showing: {selectedCountry}
                <button onClick={() => setSelectedCountry(null)} className="hover:text-[var(--coral)] transition-colors" aria-label="Clear filter">
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          )}

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredDestinations.map((d) => (
                <LuggageTagCard key={d.id} destination={d} style={{ transform: 'none' }} className="w-full hover:scale-105" />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-[var(--deep-navy)] rounded-3xl">
              <p className="font-mono text-[var(--warm-paper)]/40 text-sm tracking-widest uppercase">
                No destinations here yet
              </p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

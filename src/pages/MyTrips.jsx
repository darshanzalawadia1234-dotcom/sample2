import React, { useState } from 'react';
import BoardingPassCard from '@/components/BoardingPassCard';
import FlightPathSVG from '@/components/FlightPathSVG';
import SplitFlapBoard from '@/components/FlightDeck/SplitFlapBoard';
import MagneticButton from '@/components/MagneticButton';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Mock data
const TRIPS = [
  {
    id: 't1',
    name: 'Euro Summer',
    startDate: '12 OCT 2026',
    endDate: '19 OCT 2026',
    days: 7,
    status: 'upcoming',
    stops: [
      { px: 0.1, py: 0.5, code: 'LHR' },
      { px: 0.5, py: 0.4, code: 'CDG' },
      { px: 0.9, py: 0.6, code: 'BCN' }
    ]
  },
  {
    id: 't2',
    name: 'Tokyo Drift',
    startDate: '04 NOV 2026',
    endDate: '18 NOV 2026',
    days: 14,
    status: 'in-progress',
    stops: [
      { px: 0.2, py: 0.6, code: 'SFO' },
      { px: 0.8, py: 0.4, code: 'TYO' }
    ]
  },
  {
    id: 't3',
    name: 'Iceland Ring Road',
    startDate: '10 JAN 2025',
    endDate: '20 JAN 2025',
    days: 10,
    status: 'completed',
    stops: [
      { px: 0.1, py: 0.8, code: 'JFK' },
      { px: 0.5, py: 0.3, code: 'REY' },
      { px: 0.9, py: 0.8, code: 'LHR' }
    ]
  }
];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' }
];

export default function MyTrips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  // To test the empty state, you can toggle this to true in dev
  const forceEmptyState = false;

  const filteredTrips = forceEmptyState ? [] : TRIPS.filter(t => activeTab === 'all' || t.status === activeTab);
  const totalTrips = forceEmptyState ? 0 : TRIPS.length;

  const renderStatusPill = (status) => {
    let bg, text, label;
    if (status === 'upcoming') {
      bg = 'bg-[var(--horizon-mint)]/15';
      text = 'text-[var(--horizon-mint)]';
      label = 'Upcoming';
    } else if (status === 'in-progress') {
      bg = 'bg-[var(--compass-brass)]/15';
      text = 'text-[var(--compass-brass)]';
      label = 'In Progress';
    } else {
      bg = 'bg-[var(--ink)]/10';
      text = 'text-[var(--ink)]/60';
      label = 'Completed';
    }

    return (
      <span className={`font-mono text-[11px] px-3 py-1 rounded-full tracking-wider uppercase font-semibold ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--runway-navy)] text-[var(--warm-paper)] flex flex-col fade-in relative overflow-hidden">

      {/* ── Eye-Catching Animated Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <style>{`
          @keyframes slowPan {
            0% { transform: scale(1.1) translate(0, 0); }
            50% { transform: scale(1.15) translate(-1%, 2%); }
            100% { transform: scale(1.1) translate(0, 0); }
          }
        `}</style>
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
          alt="Travel Background"
          className="w-full h-full object-cover opacity-[0.15]"
          style={{ animation: 'slowPan 40s ease-in-out infinite' }}
        />
        {/* Gradient overlay to ensure text remains perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--runway-navy)]/60 via-[var(--runway-navy)]/80 to-[var(--runway-navy)]" />
      </div>

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 py-16 relative z-10">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-3">Your trips.</h1>
            <p className="font-mono text-[var(--compass-brass)] text-xs tracking-[0.2em] uppercase">
              {totalTrips} {totalTrips === 1 ? 'trip' : 'trips'} planned
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-mono text-[11px] tracking-wider uppercase transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-[var(--compass-brass)] text-[var(--runway-navy)] font-bold' 
                    : 'bg-[var(--deep-navy)] text-[var(--warm-paper)]/70 hover:bg-[var(--deep-navy)]/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 w-full">
          {totalTrips === 0 ? (
            /* ── Global Empty State ── */
            <div className="h-full min-h-[50vh] flex flex-col items-center justify-center">
              <div className="mb-12">
                <SplitFlapBoard 
                  messages={["NO TRIPS YET", "LET'S CHANGE THAT", "PLAN ONE ->"]} 
                  scale={0.6} 
                />
              </div>
              <MagneticButton 
                onClick={() => navigate('/plan')}
                className="bg-[var(--coral)] text-[var(--warm-paper)] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#E55A3D] transition-colors"
              >
                Plan a trip
              </MagneticButton>
            </div>
          ) : filteredTrips.length === 0 ? (
            /* ── Filter Empty State ── */
            <div className="py-24 text-center border border-dashed border-[var(--deep-navy)] rounded-3xl">
              <p className="font-mono text-[var(--warm-paper)]/40 text-sm tracking-widest uppercase">
                No trips match this filter
              </p>
            </div>
          ) : (
            /* ── Trip Grid ── */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTrips.map(trip => (
                <div key={trip.id} onClick={() => console.log('Navigate to trip', trip.id)} className="cursor-pointer group">
                  <BoardingPassCard className="h-full transition-transform duration-300 group-hover:-translate-y-2" style={{ padding: '2rem 1rem 2rem 2.5rem' }}>
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-serif text-[var(--runway-navy)] text-2xl tracking-tight mb-2 group-hover:text-[var(--coral)] transition-colors">
                          {trip.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[var(--ink)]/60 text-xs tracking-widest uppercase">
                            {trip.startDate} – {trip.endDate}
                          </span>
                          <span className="font-mono text-[var(--compass-brass)] font-bold text-xs bg-[var(--compass-brass)]/10 px-2 py-1 rounded-sm">
                            {trip.days} DAYS
                          </span>
                        </div>
                      </div>
                      <div>
                        {renderStatusPill(trip.status)}
                      </div>
                    </div>
                    
                    {/* Static Map Thumbnail */}
                    <div className="w-full h-[60px] my-8 opacity-70 group-hover:opacity-100 transition-opacity">
                      <FlightPathSVG stops={trip.stops} animated={false} />
                    </div>

                    {/* Footer link */}
                    <div className="flex items-center text-[var(--coral)] font-semibold text-sm gap-2 border-t border-dashed border-[var(--ink)]/10 pt-4 mt-auto">
                      View itinerary <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </BoardingPassCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

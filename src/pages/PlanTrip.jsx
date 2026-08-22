import React, { useState, useRef, useEffect } from 'react';
import BoardingPassCard from '@/components/BoardingPassCard';
import BudgetDial from '@/components/FlightDeck/BudgetDial';
import MagneticButton from '@/components/MagneticButton';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, Check, Plane, GripVertical } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Destination' },
  { id: 2, name: 'Dates' },
  { id: 3, name: 'Budget' },
  { id: 4, name: 'Review' }
];

const MOCK_DESTINATIONS = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA', 'Dubai, UAE', 'Barcelona, Spain'
];

const INITIAL_ITINERARY = [
  { id: 'day1', day: 1, title: 'Arrival & City Walk', desc: 'Settle in and explore the neighborhood.' },
  { id: 'day2', day: 2, title: 'Museum District', desc: 'Visit main galleries and monuments.' },
  { id: 'day3', day: 3, title: 'Local Cuisine Tour', desc: 'Tasting menu and market visits.' },
];

export default function PlanTrip() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [slideDir, setSlideDir] = useState('right');

  // Form State
  const [searchQ, setSearchQ] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);

  // Auto-fill dates string for the UI
  const dateString = dates.start && dates.end ? `${dates.start.replace(/-/g, '/')} – ${dates.end.replace(/-/g, '/')} · 7 DAYS` : '';

  const goToStep = (step) => {
    if (step === activeStep) return;
    setSlideDir(step > activeStep ? 'right' : 'left');
    setActiveStep(step);
  };

  const handleNext = () => goToStep(Math.min(4, activeStep + 1));
  const handleBack = () => goToStep(Math.max(1, activeStep - 1));

  const addDestination = (dest) => {
    if (!destinations.includes(dest)) setDestinations([...destinations, dest]);
    setSearchQ('');
  };

  const removeDestination = (dest) => {
    setDestinations(destinations.filter(d => d !== dest));
  };

  // Drag to reorder logic for Step 4
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag image to generate before we might add classes
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItin = [...itinerary];
    const draggedItem = newItin[draggedIdx];
    newItin.splice(draggedIdx, 1);
    newItin.splice(index, 0, draggedItem);
    
    // Update days sequential numbering
    const updatedItin = newItin.map((item, i) => ({ ...item, day: i + 1 }));
    setDraggedIdx(index);
    setItinerary(updatedItin);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIdx(null);
  };

  const renderStepIndicator = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 max-w-4xl mx-auto w-full">
      {STEPS.map((step, idx) => {
        const isActive = activeStep === step.id;
        const isPast = activeStep > step.id;
        
        let stateClass = '';
        if (isActive) stateClass = 'bg-[var(--runway-navy)] text-[var(--warm-paper)] shadow-lg';
        else if (isPast) stateClass = 'bg-[var(--warm-paper)] border border-[var(--deep-navy)]/10 text-[var(--ink)] cursor-pointer hover:border-[var(--coral)]';
        else stateClass = 'border border-[var(--deep-navy)]/20 text-[var(--ink)]/40 opacity-70';

        return (
          <React.Fragment key={step.id}>
            <div 
              onClick={() => isPast ? goToStep(step.id) : null}
              className={`relative flex-1 flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 ${stateClass} ${isPast ? 'hover:-translate-y-1' : ''}`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(50% - 10px), calc(100% - 6px) 50%, 100% calc(50% + 10px), 100% 100%, 0 100%, 0 calc(50% + 10px), 6px 50%, 0 calc(50% - 10px))',
                borderRight: '2px dashed rgba(0,0,0,0.05)'
              }}
            >
              <span className="font-serif font-semibold text-sm">{step.name}</span>
              {isPast ? (
                <Check className="w-4 h-4 text-[var(--compass-brass)]" strokeWidth={3} />
              ) : (
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-[var(--compass-brass)]' : ''}`}>0{step.id}</span>
              )}
              {isActive && <div className="absolute bottom-2 left-6 right-12 h-[2px] bg-[var(--coral)] rounded-full" />}
            </div>
            {idx < STEPS.length - 1 && (
              <div className="hidden sm:block w-4 h-[1px] bg-[var(--deep-navy)]/20" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--warm-paper)] text-[var(--ink)] flex flex-col fade-in overflow-x-hidden">
      <style>{`
        .slide-enter {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(var(--slide-offset)); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 py-12">
        {renderStepIndicator()}

        <div 
          key={activeStep}
          className="flex-1 w-full max-w-2xl mx-auto slide-enter"
          style={{ '--slide-offset': slideDir === 'right' ? '20px' : '-20px' }}
        >
          {/* ── STEP 1: DESTINATION ── */}
          {activeStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl tracking-tight text-[var(--runway-navy)] mb-2">Where to?</h2>
                <p className="text-[var(--ink)]/60 text-sm">Search any city, country, or landmark.</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink)]/40" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search a city or country..."
                  className="w-full bg-white border border-[var(--deep-navy)]/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--ink)] font-mono text-sm focus:outline-none focus:border-[var(--coral)] focus:ring-1 focus:ring-[var(--coral)] transition-shadow shadow-sm"
                />
                
                {searchQ && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--deep-navy)]/10 rounded-xl shadow-lg z-10 overflow-hidden">
                    {MOCK_DESTINATIONS.filter(d => d.toLowerCase().includes(searchQ.toLowerCase())).map(d => (
                      <button 
                        key={d} 
                        onClick={() => addDestination(d)}
                        className="w-full text-left px-4 py-3 text-sm font-mono hover:bg-[var(--warm-paper)] transition-colors border-b border-[var(--deep-navy)]/5 last:border-0"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {destinations.map(d => (
                  <span key={d} className="inline-flex items-center gap-2 bg-[var(--runway-navy)] text-[var(--warm-paper)] px-4 py-2 rounded-full font-mono text-xs tracking-wider">
                    {d}
                    <button onClick={() => removeDestination(d)} className="hover:text-[var(--coral)] transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>

              <div className="pt-8">
                <MagneticButton onClick={handleNext} className={`w-full py-4 rounded-xl font-semibold text-sm transition-colors ${destinations.length > 0 ? 'bg-[var(--coral)] text-white hover:bg-[#E55A3D]' : 'bg-[var(--deep-navy)]/10 text-[var(--ink)]/40 cursor-not-allowed'}`}>
                  Continue
                </MagneticButton>
              </div>
            </div>
          )}

          {/* ── STEP 2: DATES ── */}
          {activeStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl tracking-tight text-[var(--runway-navy)] mb-2">When are we going?</h2>
                <p className="text-[var(--ink)]/60 text-sm">Select your travel dates.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-2">Departure</label>
                  <input type="date" value={dates.start} onChange={e => setDates({ ...dates, start: e.target.value })} className="w-full bg-white border border-[var(--deep-navy)]/10 rounded-xl py-3 px-4 font-mono text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--coral)]" />
                </div>
                <div className="relative">
                  <label className="block font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-2">Return</label>
                  <input type="date" value={dates.end} onChange={e => setDates({ ...dates, end: e.target.value })} className="w-full bg-white border border-[var(--deep-navy)]/10 rounded-xl py-3 px-4 font-mono text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--coral)]" />
                </div>
              </div>

              {dateString && (
                <div className="bg-[var(--runway-navy)]/5 rounded-xl p-4 text-center border border-[var(--deep-navy)]/10">
                  <span className="font-mono text-sm font-bold text-[var(--runway-navy)] tracking-widest">{dateString.toUpperCase()}</span>
                </div>
              )}

              <div className="pt-8 flex gap-4">
                <button onClick={handleBack} className="px-8 py-4 rounded-xl font-semibold text-sm bg-white border border-[var(--deep-navy)]/10 hover:bg-gray-50 transition-colors">Back</button>
                <MagneticButton onClick={handleNext} className="flex-1 py-4 rounded-xl font-semibold text-sm bg-[var(--coral)] text-white hover:bg-[#E55A3D] transition-colors">
                  Continue
                </MagneticButton>
              </div>
            </div>
          )}

          {/* ── STEP 3: BUDGET ── */}
          {activeStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl tracking-tight text-[var(--runway-navy)] mb-2">Set your budget</h2>
                <p className="text-[var(--ink)]/60 text-sm">Watch the breakdown adjust in real-time.</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--deep-navy)]/5">
                <BudgetDial theme="light" />
              </div>

              <div className="pt-8 flex gap-4">
                <button onClick={handleBack} className="px-8 py-4 rounded-xl font-semibold text-sm bg-white border border-[var(--deep-navy)]/10 hover:bg-gray-50 transition-colors">Back</button>
                <MagneticButton onClick={handleNext} className="flex-1 py-4 rounded-xl font-semibold text-sm bg-[var(--coral)] text-white hover:bg-[#E55A3D] transition-colors">
                  Continue
                </MagneticButton>
              </div>
            </div>
          )}

          {/* ── STEP 4: REVIEW ── */}
          {activeStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl tracking-tight text-[var(--runway-navy)] mb-2">Review & Confirm</h2>
                <p className="text-[var(--ink)]/60 text-sm">Drag days to reorder your itinerary.</p>
              </div>
              
              <BoardingPassCard className="bg-white !shadow-sm border border-[var(--deep-navy)]/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-serif text-[var(--runway-navy)] text-2xl tracking-tight mb-2">
                      {destinations.join(' · ') || 'Trip to Nowhere'}
                    </h3>
                    <div className="font-mono text-[var(--ink)]/60 text-xs tracking-widest uppercase">
                      {dateString || 'DATES TBD'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[var(--ink)]/10 pt-6 mt-6">
                  <h4 className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-4">Day-by-Day Itinerary</h4>
                  
                  <div className="space-y-3">
                    {itinerary.map((item, idx) => (
                      <div 
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-4 bg-[var(--warm-paper)] p-4 rounded-xl cursor-grab active:cursor-grabbing hover:bg-[var(--runway-navy)]/5 border border-transparent hover:border-[var(--deep-navy)]/10 transition-colors"
                      >
                        <GripVertical className="w-5 h-5 text-[var(--ink)]/20 flex-shrink-0" />
                        <div className="w-10 h-10 rounded-full bg-[var(--compass-brass)] flex items-center justify-center flex-shrink-0">
                          <span className="font-mono text-[var(--runway-navy)] text-[10px] font-bold">D{String(item.day).padStart(2, '0')}</span>
                        </div>
                        <div>
                          <h5 className="font-serif text-[var(--runway-navy)] text-lg leading-tight">{item.title}</h5>
                          <p className="text-[var(--ink)]/60 text-xs mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BoardingPassCard>

              <div className="pt-8 flex gap-4">
                <button onClick={handleBack} className="px-8 py-4 rounded-xl font-semibold text-sm bg-white border border-[var(--deep-navy)]/10 hover:bg-gray-50 transition-colors">Back</button>
                <MagneticButton onClick={() => navigate('/trips')} className="flex-1 py-4 rounded-xl font-semibold text-sm bg-[var(--coral)] text-white hover:bg-[#E55A3D] transition-colors inline-flex justify-center items-center gap-2">
                  Confirm Trip <Plane className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

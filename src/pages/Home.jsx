import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Map, Wallet, Plane } from "lucide-react";
import FlightDeck from "@/components/FlightDeck/FlightDeck";
import MagneticButton from "@/components/MagneticButton";
import CountUp from "@/components/CountUp";
import LuggageTagCard from "@/components/LuggageTagCard";

const STEPS = [
  { num: "01", title: "Choose Your Destination", body: "Search any city or landmark on the planet. Set dates and let us do the rest.", icon: Compass, gate: 'A12' },
  { num: "02", title: "Build Your Itinerary", body: "Add cities, activities, and hidden gems. We map out the best routes for you.", icon: Map, gate: 'B4' },
  { num: "03", title: "Track Your Budget", body: "Watch your budget update in real-time as you tweak stays, flights, and food.", icon: Wallet, gate: 'C9' },
];

const DESTINATIONS_LIST = [
  { id: 'goa', name: 'Goa', country: 'India', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' },
  { id: 'paris', name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602881469-447826049f4b?q=80&w=600&auto=format&fit=crop' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop' },
  { id: 'manali', name: 'Manali', country: 'India', img: 'https://images.unsplash.com/photo-1605649487212-4d43be98cc4f?q=80&w=600&auto=format&fit=crop' },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState(20000);
  const [travelers, setTravelers] = useState(2);

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    navigate("/plan", { state: { q, start, end, budget, travelers } });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="fade-in bg-[var(--warm-paper)]">
      {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--runway-navy)] pt-32 pb-20 relative overflow-hidden text-[var(--warm-paper)]">

        {/* Eye-Catching Animated Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <style>{`
            @keyframes slowZoom {
              0% { transform: scale(1.05) translate(0, 0); }
              50% { transform: scale(1.1) translate(-1%, 1%); }
              100% { transform: scale(1.05) translate(0, 0); }
            }
          `}</style>
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop"
            alt="Travel Landscape"
            className="w-full h-full object-cover opacity-[0.25]"
            style={{ animation: 'slowZoom 30s ease-in-out infinite' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--runway-navy)] via-[var(--runway-navy)]/60 to-transparent" />
          
          <svg viewBox="0 0 1440 600" className="absolute inset-0 w-full h-full object-cover opacity-[0.05]">
            <path d="M 0,300 C 300,100 600,500 1440,200" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 10" />
            <path d="M 0,400 C 400,600 800,100 1440,300" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 15" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="masked-reveal-wrapper mb-6">
            <div className="masked-reveal-inner animate-slideUp">
              <span className="font-mono text-[var(--compass-brass)] text-xs tracking-[0.25em] uppercase">
                The New Standard in Travel
              </span>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-tight max-w-4xl mx-auto">
            <div className="masked-reveal-wrapper">
              <div className="masked-reveal-inner animate-slideUp">
                Plot your journey.
              </div>
            </div>
            <br />
            <div className="masked-reveal-wrapper">
              <div className="masked-reveal-inner animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <em className="italic text-[var(--horizon-mint)]">Watch it unfold.</em>
              </div>
            </div>
          </h1>

          <div className="masked-reveal-wrapper mt-8">
            <div className="masked-reveal-inner animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <p className="text-[var(--warm-paper)]/70 max-w-xl mx-auto text-lg leading-relaxed">
                GlobeTrotter transforms the chaos of tabs and spreadsheets into a clear, playable flight path. Build multi-city itineraries that make sense.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <MagneticButton className="px-8 py-3.5 rounded-full bg-[var(--coral)]/80 backdrop-blur-md border border-[var(--coral)]/50 text-[var(--warm-paper)] text-sm font-semibold hover:bg-[var(--coral)] transition-all shadow-lg shadow-[var(--coral)]/20">
              Start Your Engine
            </MagneticButton>
            <MagneticButton className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[var(--warm-paper)] text-sm font-semibold hover:bg-white/10 transition-all shadow-lg">
              Explore Destinations
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── 2. Static Departure Ticker ─────────────────────────────────────── */}
      <div className="bg-[var(--deep-navy)] border-b border-[var(--runway-navy)] py-3 overflow-hidden flex whitespace-nowrap">
        <div className="animate-[ticker_30s_linear_infinite] flex gap-8 items-center text-[var(--compass-brass)] font-mono text-xs tracking-widest uppercase opacity-80">
          {Array(8).fill("DEPARTURES • DEL TO DXB • BCN TO TYO • LHR TO JFK •").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* ── 3. The Flight Deck ─────────────────────────────────────────────── */}
      <FlightDeck />

      {/* ── 4. Milestones Band ─────────────────────────────────────────────── */}
      <section className="bg-[var(--runway-navy)] text-[var(--warm-paper)] py-16 mt-[-1px] rounded-b-[3rem] shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 divide-x divide-[var(--warm-paper)]/10 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-mono text-[var(--compass-brass)] mb-2"><CountUp target={142} /></div>
              <div className="text-xs uppercase tracking-widest text-[var(--warm-paper)]/50 font-mono">Countries mapped</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-mono text-[var(--compass-brass)] mb-2"><CountUp target={8900} /></div>
              <div className="text-xs uppercase tracking-widest text-[var(--warm-paper)]/50 font-mono">Routes plotted</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-mono text-[var(--compass-brass)] mb-2"><CountUp target={2.4} />M</div>
              <div className="text-xs uppercase tracking-widest text-[var(--warm-paper)]/50 font-mono">Miles saved</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-mono text-[var(--compass-brass)] mb-2"><CountUp target={100} />%</div>
              <div className="text-xs uppercase tracking-widest text-[var(--warm-paper)]/50 font-mono">Wanderlust</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. How it works (Boarding Pass Cards) ────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="font-mono text-[var(--coral)] text-xs tracking-[0.2em] uppercase mb-4">Flight Manual</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[var(--runway-navy)]">Ready for takeoff.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.num} className="fd-boarding-pass shadow-lg transition-transform hover:-translate-y-2 duration-300 bg-white">
              <div className="fd-perf-edge" />
              <div className="pr-12">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[var(--runway-navy)] text-2xl font-bold">{s.num}</span>
                  <s.icon className="w-6 h-6 text-[var(--horizon-mint)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-[var(--runway-navy)] tracking-tight">{s.title}</h3>
                <p className="text-[var(--ink)]/60 text-sm leading-relaxed mb-6">{s.body}</p>
                <div className="pt-4 border-t border-dashed border-[var(--ink)]/10 flex justify-between items-center">
                  <span className="font-mono text-xs text-[var(--ink)]/40 uppercase tracking-widest">GATE</span>
                  <span className="font-mono text-sm text-[var(--compass-brass)] font-bold">{s.gate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Drag-to-scroll Destinations ───────────────────────────────── */}
      <section className="py-20 overflow-hidden bg-[var(--runway-navy)] rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <p className="font-mono text-[var(--horizon-mint)] text-xs tracking-[0.2em] uppercase mb-4">Arrivals</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[var(--warm-paper)]">Trending Tags</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <span className="font-mono text-xs text-[var(--warm-paper)]/40 tracking-widest uppercase">Drag to explore</span>
          </div>
        </div>
        
        <div
          ref={scrollContainerRef}
          className="flex gap-6 px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-12"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {DESTINATIONS_LIST.map((d, i) => (
            <LuggageTagCard key={d.id} destination={d} index={i} />
          ))}
        </div>
      </section>

      {/* ── 7. CTA Banner ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[var(--coral)] to-[#d95033] py-24 text-center px-6">
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-[var(--warm-paper)] mb-8">
          Your itinerary is waiting.
        </h2>
        <MagneticButton onClick={() => navigate('/plan')} className="bg-[var(--runway-navy)] text-[var(--warm-paper)] px-10 py-4 rounded-full font-semibold text-lg shadow-2xl hover:bg-[var(--deep-navy)] transition-colors inline-flex items-center gap-3">
          Start building <Plane className="w-5 h-5" />
        </MagneticButton>
      </section>

      {/* ── 8. Footer ────────────────────────────────────────────────────── */}
    </div>
  );
}


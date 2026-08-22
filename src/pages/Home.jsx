import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Users, Calendar, Wallet, ArrowRight, Sparkles, Compass, Map, Wallet2 } from "lucide-react";
import DestinationCard from "@/components/DestinationCard";
import { DESTINATIONS } from "@/data/mockData";

const HERO_IMG = "https://images.unsplash.com/photo-1504814532849-cff240bbc503?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0JTIwZHJvbmUlMjBzaG90fGVufDB8fHx8MTc4NzM3MDc1MHww&ixlib=rb-4.1.0&q=85";

const STEPS = [
  { num: "01", title: "Choose Your Destination", body: "Search any city or landmark on the planet.", icon: Compass },
  { num: "02", title: "Customize Your Trip", body: "Set dates, budget and personal interests.", icon: Sparkles },
  { num: "03", title: "Build Your Itinerary", body: "Add cities, activities and hidden gems.", icon: Map },
  { num: "04", title: "Travel With Confidence", body: "Track budget and visualize your entire journey.", icon: Wallet2 },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState(20000);
  const [travelers, setTravelers] = useState(2);

  const submit = (e) => {
    e.preventDefault();
    navigate("/plan", { state: { q, start, end, budget, travelers } });
  };

  const popular = DESTINATIONS.filter((d) => ["goa","paris","tokyo","dubai","manali","bali"].includes(d.id));

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1B1A]/60 via-[#1A1B1A]/40 to-[#1A1B1A]/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-40 md:pt-32 md:pb-52 text-white">
          <div className="max-w-3xl">
            <div className="eyebrow text-white/80 mb-6">Personalized Travel Planning</div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Plan Your Journey.<br /><em className="not-italic text-[#D4A373]">Your Way.</em>
            </h1>
            <p className="mt-6 text-base md:text-lg max-w-xl text-white/85">
              Create personalized multi-city itineraries, discover amazing places, and keep your entire trip within budget.
            </p>
          </div>
        </div>

        {/* Search card */}
        <div className="relative -mt-28 md:-mt-32 max-w-6xl mx-auto px-6 z-10">
          <form
            onSubmit={submit}
            data-testid="hero-plan-form"
            className="rounded-3xl bg-white shadow-xl border border-border p-6 md:p-8 grid md:grid-cols-5 gap-4"
          >
            <div className="md:col-span-2">
              <label className="eyebrow text-muted-foreground block mb-2">Where to?</label>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="hero-search-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search any city or destination..."
                  className="w-full bg-transparent outline-none text-base placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Dates</label>
              <div className="flex items-center gap-1 border-b border-border pb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input data-testid="hero-start-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="bg-transparent outline-none w-full text-sm" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <input data-testid="hero-end-date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-transparent outline-none w-full text-sm border-b border-border pb-2" />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Budget</label>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">₹</span>
                <input data-testid="hero-budget" type="number" value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Travellers</label>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <input data-testid="hero-travelers" type="number" min="1" value={travelers} onChange={(e) => setTravelers(+e.target.value)} className="w-full bg-transparent outline-none" />
                <span className="text-sm text-muted-foreground">travellers</span>
              </div>
            </div>
            <div className="md:col-span-5 flex flex-col md:flex-row gap-3 pt-2">
              <button
                type="submit"
                data-testid="start-planning-btn"
                className="flex-1 md:flex-none px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors flex items-center justify-center gap-2"
              >
                Start Planning <span aria-hidden>✈️</span>
              </button>
              <Link
                to="/explore"
                data-testid="explore-destinations-btn"
                className="flex-1 md:flex-none px-6 py-3 rounded-full border border-border text-sm font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                Explore Destinations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="eyebrow text-muted-foreground mb-2">Trending Now</div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Popular Destinations</h2>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-primary hover:gap-3 flex items-center gap-2 transition-all">See all destinations <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popular.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F1EDDE]/60 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow text-muted-foreground mb-2">How it works</div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">From daydream to boarding pass in four steps.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.num} className="rounded-3xl bg-white border border-border p-6 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl text-primary">{s.num}</span>
                  <s.icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-none">Your next chapter <em className="not-italic text-primary">starts here.</em></h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Craft an itinerary that respects your interests, your pace and your wallet.</p>
        <Link to="/plan" data-testid="cta-plan-btn" className="inline-flex mt-8 items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors">
          Plan a New Trip <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, GripVertical, Plus, Search, Trash2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { DESTINATIONS, INTERESTS, TRAVEL_STYLES, TRANSPORT_MODES, findDestination, computeDays } from "@/data/mockData";
import { useTrips } from "@/context/TripContext";
import { BudgetDonut } from "@/components/BudgetChart";

const STEPS = ["Trip Details", "Destinations", "Preferences", "Budget", "Review"];

export default function CreateTrip() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80");
  const [start, setStart] = useState(state?.start || "");
  const [end, setEnd] = useState(state?.end || "");
  const [stops, setStops] = useState(state?.preselected ? [state.preselected] : []);
  const [interests, setInterests] = useState([]);
  const [style, setStyle] = useState("Balanced");
  const [transport, setTransport] = useState("Mixed");
  const [budget, setBudget] = useState(state?.budget || 20000);
  const [currency, setCurrency] = useState("INR");
  const [travelers, setTravelers] = useState(state?.travelers || 2);

  const days = computeDays(start, end);
  const canNext = [
    () => name.trim() && start && end,
    () => stops.length > 0,
    () => interests.length > 0,
    () => budget > 0 && travelers > 0,
    () => true,
  ][step]();

  const breakdown = useMemo(() => {
    const nights = Math.max(1, days - 1);
    const acc = Math.round(budget * 0.3);
    const food = Math.round(budget * 0.2);
    const trans = Math.round(budget * 0.15);
    const act = Math.round(budget * 0.2);
    const misc = budget - acc - food - trans - act;
    return { accommodation: acc, food, transport: trans, activities: act, misc };
  }, [budget, days]);

  const buildTrip = ({ ai }) => {
    const trip = createTrip({
      name,
      description,
      cover,
      startDate: start,
      endDate: end,
      travelers,
      budget,
      currency,
      estimatedCost: Math.round(budget * 0.92),
      interests: interests.map((i) => INTERESTS.find((x) => x.id === i)?.label).filter(Boolean),
      style,
      transport,
      stops: stops.map((id, idx) => ({ destinationId: id, nights: Math.max(1, Math.floor(days / stops.length) + (idx === 0 ? days % stops.length : 0)) })),
      breakdown,
      days: [],
    });
    toast.success(ai ? "AI generated your itinerary" : "Trip created");
    navigate(`/trip/${trip.id}/build`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 fade-in">
      <div className="mb-8">
        <div className="eyebrow text-muted-foreground mb-2">New Journey</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Plan a New Trip</h1>
      </div>

      {/* Stepper */}
      <div className="rounded-3xl bg-white border border-border p-3 md:p-4 mb-8 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                data-testid={`step-${i}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                  i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-[#EDF3EA] text-primary" : "text-muted-foreground"
                }`}
              >
                <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] ${i === step ? "bg-white/20" : i < step ? "bg-primary text-white" : "bg-secondary"}`}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div className="rounded-3xl bg-white border border-border p-6 md:p-10">
        {step === 0 && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="font-serif text-3xl">Trip Details</h2>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Trip Name</label>
              <input data-testid="trip-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Summer Escape" className="w-full border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow text-muted-foreground block mb-2">Start Date</label>
                <input data-testid="trip-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="eyebrow text-muted-foreground block mb-2">End Date</label>
                <input data-testid="trip-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Description</label>
              <textarea data-testid="trip-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="An adventurous trip exploring beaches, food and local culture." rows={4} className="w-full border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary resize-none" />
            </div>
            <div>
              <label className="eyebrow text-muted-foreground block mb-2">Cover Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 rounded-2xl overflow-hidden border border-border">
                  <img src={cover} alt="cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 grid grid-cols-3 md:grid-cols-5 gap-2">
                  {DESTINATIONS.slice(0, 5).map((d) => (
                    <button key={d.id} onClick={() => setCover(d.image)} className={`aspect-video rounded-xl overflow-hidden border-2 transition-colors ${cover === d.image ? "border-primary" : "border-transparent hover:border-border"}`}>
                      <img src={d.image} alt={d.city} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && <StepDestinations stops={stops} setStops={setStops} />}
        {step === 2 && <StepPreferences interests={interests} setInterests={setInterests} style={style} setStyle={setStyle} transport={transport} setTransport={setTransport} />}
        {step === 3 && <StepBudget budget={budget} setBudget={setBudget} currency={currency} setCurrency={setCurrency} travelers={travelers} setTravelers={setTravelers} breakdown={breakdown} />}
        {step === 4 && <StepReview data={{ name, description, start, end, days, travelers, budget, currency, stops, interests, style, transport }} onBuild={buildTrip} />}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            data-testid="step-back"
            className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold disabled:opacity-40 hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              data-testid="step-next"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-[#1F382A] transition-colors flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepDestinations({ stops, setStops }) {
  const [q, setQ] = useState("");
  const suggestions = q
    ? DESTINATIONS.filter((d) => `${d.city} ${d.country}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : DESTINATIONS.slice(0, 6);

  const add = (id) => {
    if (stops.includes(id)) return toast.info("Already added");
    setStops([...stops, id]);
    setQ("");
    toast.success(`${findDestination(id).city} added`);
  };
  const remove = (id) => setStops(stops.filter((s) => s !== id));
  const move = (from, to) => {
    if (to < 0 || to >= stops.length) return;
    const next = [...stops];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setStops(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Where do you want to go?</h2>
        <p className="text-muted-foreground mt-1">Add one or more cities. Drag to reorder.</p>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 border border-border rounded-full px-5 py-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            data-testid="dest-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any city, country or destination..."
            className="bg-transparent outline-none w-full"
          />
        </div>
        {q && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-border shadow-xl z-20 overflow-hidden">
            {suggestions.length ? suggestions.map((d) => (
              <button
                key={d.id}
                onClick={() => add(d.id)}
                data-testid={`suggest-${d.id}`}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors"
              >
                <span>📍</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{d.city}, {d.country}</div>
                  <div className="text-xs text-muted-foreground">{d.region}</div>
                </div>
                <Plus className="w-4 h-4 text-primary" />
              </button>
            )) : (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">Unable to find this destination.</div>
            )}
          </div>
        )}
      </div>

      {!q && (
        <div>
          <div className="eyebrow text-muted-foreground mb-3">Suggested</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {suggestions.slice(0, 6).map((d) => (
              <button key={d.id} onClick={() => add(d.id)} className="rounded-2xl border border-border p-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left">
                <img src={d.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{d.city}</div>
                  <div className="text-xs text-muted-foreground">{d.country}</div>
                </div>
                <Plus className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      {stops.length > 0 && (
        <div>
          <div className="eyebrow text-muted-foreground mb-3">Your Route</div>
          <div className="space-y-2">
            {stops.map((id, idx) => {
              const d = findDestination(id);
              return (
                <div key={id} data-testid={`stop-${id}`} className="flex items-center gap-3 rounded-2xl bg-[#FAF9F6] border border-border p-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <img src={d.image} alt={d.city} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{d.city} <span className="text-muted-foreground text-xs">🇺🇳 {d.country}</span></div>
                    <div className="text-xs text-muted-foreground">Rating {d.rating} • {d.costIndex}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="w-8 h-8 rounded-full hover:bg-secondary disabled:opacity-30 grid place-items-center">↑</button>
                    <button onClick={() => move(idx, idx + 1)} disabled={idx === stops.length - 1} className="w-8 h-8 rounded-full hover:bg-secondary disabled:opacity-30 grid place-items-center">↓</button>
                    <button onClick={() => remove(id)} data-testid={`remove-stop-${id}`} className="w-8 h-8 rounded-full hover:bg-destructive/10 text-destructive grid place-items-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StepPreferences({ interests, setInterests, style, setStyle, transport, setTransport }) {
  const toggle = (id) => setInterests(interests.includes(id) ? interests.filter((x) => x !== id) : [...interests, id]);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl">What do you enjoy?</h2>
        <p className="text-muted-foreground mt-1">Pick a handful — we'll tailor activity picks to your taste.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i) => (
          <button
            key={i.id}
            data-testid={`interest-${i.id}`}
            onClick={() => toggle(i.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${interests.includes(i.id) ? "chip-selected" : "border-border hover:bg-secondary"}`}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div>
        <div className="eyebrow text-muted-foreground mb-3">Travel Style</div>
        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {TRAVEL_STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              data-testid={`style-${s.toLowerCase()}`}
              className={`p-4 rounded-2xl border text-sm font-semibold transition-colors ${style === s ? "border-primary bg-[#EDF3EA] text-primary" : "border-border hover:bg-secondary"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow text-muted-foreground mb-3">Transportation</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TRANSPORT_MODES.map((t) => (
            <button
              key={t}
              onClick={() => setTransport(t)}
              className={`p-3 rounded-2xl border text-sm font-medium transition-colors ${transport === t ? "border-accent bg-[#FBF0E1]" : "border-border hover:bg-secondary"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ budget, setBudget, currency, setCurrency, travelers, setTravelers, breakdown }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl">What's your total budget?</h2>
          <p className="text-muted-foreground mt-1">We'll auto-allocate across stay, food, transport & experiences.</p>
        </div>
        <div>
          <label className="eyebrow text-muted-foreground block mb-2">Total Budget</label>
          <div className="flex items-center gap-3 border border-border rounded-2xl p-3">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent outline-none font-semibold">
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <input
              type="number"
              data-testid="budget-input"
              value={budget}
              onChange={(e) => setBudget(+e.target.value)}
              className="flex-1 bg-transparent outline-none text-2xl font-serif"
            />
          </div>
        </div>
        <div>
          <label className="eyebrow text-muted-foreground block mb-2">Travellers</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-10 h-10 rounded-full border border-border hover:bg-secondary">−</button>
            <input type="number" value={travelers} onChange={(e) => setTravelers(+e.target.value)} className="w-16 text-center text-lg font-semibold bg-transparent outline-none" />
            <button onClick={() => setTravelers(travelers + 1)} className="w-10 h-10 rounded-full border border-border hover:bg-secondary">+</button>
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-[#FAF9F6] border border-border p-6">
        <div className="eyebrow text-muted-foreground mb-2">Estimated Allocation</div>
        <BudgetDonut breakdown={breakdown} />
        <div className="mt-4 space-y-2 text-sm">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between capitalize">
              <span>{k}</span>
              <span className="font-semibold">₹{v.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReview({ data, onBuild }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Ready to build your itinerary?</h2>
        <p className="text-muted-foreground mt-1">Review your trip and choose how you'd like to plan it.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border p-5 space-y-3">
          <Row label="Trip Name" value={data.name} />
          <Row label="Dates" value={`${data.start} → ${data.end} (${data.days} days)`} />
          <Row label="Travellers" value={data.travelers} />
          <Row label="Budget" value={`${data.currency} ${data.budget.toLocaleString()}`} />
          <Row label="Travel Style" value={data.style} />
          <Row label="Transport" value={data.transport} />
        </div>
        <div className="rounded-2xl border border-border p-5 space-y-3">
          <div>
            <div className="eyebrow text-muted-foreground mb-2">Destinations</div>
            <div className="flex flex-wrap gap-2">
              {data.stops.map((id) => {
                const d = findDestination(id);
                return <span key={id} className="px-3 py-1 rounded-full bg-secondary text-sm">{d.city}</span>;
              })}
            </div>
          </div>
          <div>
            <div className="eyebrow text-muted-foreground mb-2">Interests</div>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((id) => {
                const i = INTERESTS.find((x) => x.id === id);
                return <span key={id} className="px-3 py-1 rounded-full bg-[#FBF0E1] text-sm">{i?.label}</span>;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 pt-2">
        <button
          onClick={() => onBuild({ ai: true })}
          data-testid="generate-ai-btn"
          className="flex-1 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Generate My Itinerary
        </button>
        <button
          onClick={() => onBuild({ ai: false })}
          data-testid="build-manual-btn"
          className="flex-1 px-6 py-3.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" /> Build Manually
        </button>
      </div>
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

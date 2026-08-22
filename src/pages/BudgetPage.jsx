import { useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { BudgetDonut, BudgetBar, DailySpendChart } from "@/components/BudgetChart";
import { computeDays } from "@/data/mockData";
import { toast } from "sonner";

const SUGGESTIONS = [
  "Swap paid attractions for free walking tours",
  "Use public transport instead of taxis",
  "Choose neighbourhood eateries over hotel dining",
  "Consolidate cities to cut inter-city transport",
  "Opt for guesthouses instead of resorts",
];

export default function BudgetPage() {
  const { id } = useParams();
  const { getTrip, updateTrip } = useTrips();
  const trip = getTrip(id);
  const [applied, setApplied] = useState(false);

  if (!trip) return <Navigate to="/trips" />;

  const remaining = trip.budget - trip.estimatedCost;
  const over = remaining < 0;
  const days = computeDays(trip.startDate, trip.endDate);
  const perDay = Math.round(trip.estimatedCost / Math.max(1, days));
  const perTraveler = Math.round(trip.estimatedCost / Math.max(1, trip.travelers));

  const dailySpend = useMemo(() => {
    return Array.from({ length: days }, (_, i) => ({ spend: Math.round(perDay * (0.85 + Math.random() * 0.3)) }));
  }, [days, perDay]);

  const optimize = () => {
    const newCost = Math.round(trip.budget * 0.9);
    const newBreakdown = {
      accommodation: Math.round(newCost * 0.28),
      food: Math.round(newCost * 0.22),
      transport: Math.round(newCost * 0.15),
      activities: Math.round(newCost * 0.25),
      misc: Math.round(newCost * 0.1),
    };
    updateTrip(trip.id, { estimatedCost: newCost, breakdown: newBreakdown, status: "upcoming" });
    setApplied(true);
    toast.success("Trip optimised — you're back within budget");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 fade-in">
      <Link to={`/trip/${trip.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Back to trip</Link>
      <div className="mb-8">
        <div className="eyebrow text-muted-foreground mb-2">Budget Dashboard</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{trip.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Budget" value={`₹${trip.budget.toLocaleString()}`} />
        <Stat label="Estimated Cost" value={`₹${trip.estimatedCost.toLocaleString()}`} />
        <Stat label={over ? "Over Budget" : "Remaining"} value={`₹${Math.abs(remaining).toLocaleString()}`} tone={over ? "danger" : "success"} />
      </div>

      {over && (
        <div className="rounded-3xl bg-[#FDECEC] border border-[#9E2A2B]/30 p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-7 h-7 text-[#9E2A2B] shrink-0" />
            <div className="flex-1">
              <h3 className="font-serif text-2xl">You're ₹{Math.abs(remaining).toLocaleString()} over budget</h3>
              <p className="text-sm text-muted-foreground mt-1">Try a few tweaks to bring costs down without sacrificing the fun bits.</p>
              <ul className="mt-4 grid md:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s} className="text-sm flex items-start gap-2"><span className="text-primary">✓</span>{s}</li>
                ))}
              </ul>
              <button
                onClick={optimize}
                data-testid="optimize-btn"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A]"
              >
                <Sparkles className="w-4 h-4" /> Optimise My Trip
              </button>
            </div>
          </div>
        </div>
      )}
      {!over && applied && (
        <div className="rounded-3xl bg-[#EDF3EA] border border-[#3A5A40]/30 p-6 md:p-8 mb-8 flex items-center gap-4">
          <CheckCircle2 className="w-7 h-7 text-[#3A5A40]" />
          <div>
            <h3 className="font-serif text-xl">You're within budget</h3>
            <p className="text-sm text-muted-foreground">Optimisations applied — enjoy the trip.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl bg-white border border-border p-6">
          <div className="eyebrow text-muted-foreground mb-2">Cost Breakdown</div>
          <BudgetDonut breakdown={trip.breakdown || {}} />
          <div className="mt-4 space-y-2 text-sm">
            {Object.entries(trip.breakdown || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between capitalize">
                <span>{k}</span>
                <span className="font-semibold">₹{v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-border p-6">
          <div className="eyebrow text-muted-foreground mb-2">By Category</div>
          <BudgetBar breakdown={trip.breakdown || {}} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="rounded-2xl bg-[#FAF9F6] p-4">
              <div className="eyebrow text-muted-foreground">Per Day</div>
              <div className="font-serif text-2xl">₹{perDay.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-[#FAF9F6] p-4">
              <div className="eyebrow text-muted-foreground">Per Traveller</div>
              <div className="font-serif text-2xl">₹{perTraveler.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-border p-6">
        <div className="eyebrow text-muted-foreground mb-2">Daily Spend Estimate</div>
        <DailySpendChart days={dailySpend} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`rounded-3xl p-6 border ${tone === "danger" ? "bg-[#FDECEC] border-[#9E2A2B]/30" : tone === "success" ? "bg-[#EDF3EA] border-[#3A5A40]/30" : "bg-white border-border"}`}>
      <div className="eyebrow text-muted-foreground mb-2">{label}</div>
      <div className="font-serif text-3xl">{value}</div>
    </div>
  );
}

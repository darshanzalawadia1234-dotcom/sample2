import { Link } from "react-router-dom";
import { Plus, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import TripCard from "@/components/TripCard";
import DestinationCard from "@/components/DestinationCard";
import { BudgetDonut } from "@/components/BudgetChart";
import { DESTINATIONS } from "@/data/mockData";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { trips, user } = useTrips();
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const recent = trips.filter((t) => t.status !== "upcoming").slice(0, 3);
  const totalBudget = trips.reduce((s, t) => s + t.budget, 0);
  const totalSpent = trips.reduce((s, t) => s + t.estimatedCost, 0);
  const remaining = totalBudget - totalSpent;
  const breakdown = trips.reduce(
    (acc, t) => {
      Object.entries(t.breakdown || {}).forEach(([k, v]) => (acc[k] = (acc[k] || 0) + v));
      return acc;
    },
    { accommodation: 0, food: 0, transport: 0, activities: 0, misc: 0 }
  );
  const recommended = DESTINATIONS.filter((d) => !trips.some((t) => t.stops[0]?.destinationId === d.id)).slice(0, 4);

  const savingsTrip = upcoming[0];
  const savings = savingsTrip ? savingsTrip.budget - savingsTrip.estimatedCost : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <div className="eyebrow text-[#20211D]/70 mb-2">Dashboard</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#12213F]">{greeting()}, {user.name}</h1>
          <p className="text-[#20211D]/75 mt-2">Ready to plan your next adventure?</p>
        </div>
        <Link
          to="/plan"
          data-testid="plan-new-trip-btn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#12213F] text-[#F1ECDF] text-sm font-semibold hover:opacity-95 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Plan New Trip
        </Link>
      </div>

      {savingsTrip && (
        <div className={`mb-10 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border ${savings >= 0 ? "bg-[#EDF4F2] border-[#276667]/30" : "bg-[#FCEAE5] border-[#C43E2E]/30"}`}>
          <div className="flex items-center gap-4">
            {savings >= 0 ? <TrendingDown className="w-7 h-7 text-[#276667]" /> : <TrendingUp className="w-7 h-7 text-[#C43E2E]" />}
            <div>
              <div className="eyebrow mb-1 text-[#20211D]/70">{savings >= 0 ? "Under Budget" : "Over Budget"}</div>
              <p className="text-lg text-[#12213F]">
                Your upcoming <span className="font-semibold">{savingsTrip.name}</span> is <span className={`font-bold ${savings >= 0 ? "text-[#276667]" : "text-[#C43E2E]"}`}>₹{Math.abs(savings).toLocaleString()}</span> {savings >= 0 ? "under" : "over"} budget.
              </p>
            </div>
          </div>
          <Link to={`/trip/${savingsTrip.id}/budget`} className="text-sm font-semibold text-[#12213F] flex items-center gap-2 hover:gap-3 transition-all">
            View breakdown <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-[#12213F]">Upcoming Trips</h2>
          <Link to="/trips" className="text-sm font-semibold text-[#12213F] hover:underline">See all</Link>
        </div>
        {upcoming.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#d8cfbc] bg-[#f6f1e7] p-12 text-center">
            <p className="text-[#20211D]/75">No upcoming trips yet.</p>
            <Link to="/plan" className="inline-flex mt-4 text-[#12213F] font-semibold">Plan your first trip →</Link>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-[#12213F]">Recent Trips</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 stagger">
            {recent.map((t) => <TripCard key={t.id} trip={t} variant="compact" />)}
          </div>
        </section>
        <section className="ticket-card p-6">
          <div className="eyebrow text-[#20211D]/70 mb-2">Budget Overview</div>
          <h3 className="font-serif text-2xl mb-4 text-[#12213F]">All trips</h3>
          <BudgetDonut breakdown={breakdown} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="eyebrow text-[#20211D]/70">Total</div>
              <div className="text-sm font-semibold text-[#12213F]">₹{totalBudget.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-[#20211D]/70">Spent</div>
              <div className="text-sm font-semibold text-[#12213F]">₹{totalSpent.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-[#20211D]/70">Remaining</div>
              <div className={`text-sm font-semibold ${remaining < 0 ? "text-[#C43E2E]" : "text-[#276667]"}`}>₹{remaining.toLocaleString()}</div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-[#12213F]">Recommended for you</h2>
          <Link to="/explore" className="text-sm font-semibold text-[#12213F] hover:underline">Explore more</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>
    </div>
  );
}

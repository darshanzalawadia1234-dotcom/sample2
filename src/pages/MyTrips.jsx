import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import TripCard from "@/components/TripCard";
import { useTrips } from "@/context/TripContext";

const FILTERS = ["All", "Upcoming", "Past", "Over Budget"];

export default function MyTrips() {
  const { trips } = useTrips();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = trips.filter((t) => {
    if (filter === "Upcoming" && t.status !== "upcoming") return false;
    if (filter === "Past" && t.status !== "past") return false;
    if (filter === "Over Budget" && t.status !== "over-budget") return false;
    if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow text-muted-foreground mb-2">Your Journeys</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-2">{trips.length} trips saved so far.</p>
        </div>
        <Link
          to="/plan"
          data-testid="new-trip-btn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> New Trip
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-border p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-8">
        <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            data-testid="trips-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your trips..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              data-testid={`filter-${f.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => <TripCard key={t.id} trip={t} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <h3 className="font-serif text-2xl mb-2">Nothing here yet</h3>
          <p className="text-muted-foreground mb-6">Start planning to see your trips populate this space.</p>
          <Link to="/plan" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors">
            <Plus className="w-4 h-4" /> Create a Trip
          </Link>
        </div>
      )}
    </div>
  );
}

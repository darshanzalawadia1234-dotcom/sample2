import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { DESTINATIONS } from "@/data/mockData";
import DestinationCard from "@/components/DestinationCard";

const REGIONS = ["All", "South Asia", "Europe", "East Asia", "Middle East", "Southeast Asia", "North America"];
const COSTS = ["All", "$", "$$", "$$$", "$$$$"];

export default function Explore() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [cost, setCost] = useState("All");
  const [sort, setSort] = useState("popularity");

  const results = useMemo(() => {
    let list = DESTINATIONS.filter((d) => {
      if (q && !`${d.city} ${d.country} ${d.description}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (region !== "All" && d.region !== region) return false;
      if (cost !== "All" && d.costIndex !== cost) return false;
      return true;
    });
    if (sort === "popularity") list = [...list].sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "cost") list = [...list].sort((a, b) => a.costIndex.length - b.costIndex.length);
    return list;
  }, [q, region, cost, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 fade-in">
      <div className="max-w-2xl mb-8">
        <div className="eyebrow text-muted-foreground mb-2">Discover</div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Explore the world.</h1>
        <p className="text-muted-foreground mt-3">Search any destination on earth — from famous capitals to hidden mountain villages.</p>
      </div>

      <div className="rounded-3xl bg-white border border-border p-4 md:p-6 mb-10">
        <div className="flex items-center gap-2 border border-border rounded-full px-5 py-3 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            data-testid="explore-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any city, country or landmark..."
            className="bg-transparent outline-none w-full"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="eyebrow text-muted-foreground">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  region === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            {COSTS.map((c) => (
              <button
                key={c}
                onClick={() => setCost(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  cost === c ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            data-testid="explore-sort"
            className="px-4 py-2 rounded-full border border-border bg-white text-sm font-semibold"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="cost">Cost</option>
          </select>
        </div>
      </div>

      {results.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">Unable to find this destination. Try another search.</p>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Save, Share2, Sparkles, Plus, X, Clock, MapPin, Trash2, Search, Filter, GripVertical, ArrowUp, ArrowDown, Map as MapIcon } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { ACTIVITIES, findActivity, findDestination, formatDateRange, computeDays } from "@/data/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import MapView from "@/components/MapView";

export default function ItineraryBuilder() {
  const { id } = useParams();
  const { getTrip, updateTrip } = useTrips();
  const trip = getTrip(id);
  const [openMap, setOpenMap] = useState(false);
  const [addTo, setAddTo] = useState(null); // { dayIdx, city }

  if (!trip) return <Navigate to="/trips" />;

  const days = ensureDays(trip);

  const removeBlock = (dayIdx, blockIdx) => {
    const next = [...days];
    next[dayIdx].blocks.splice(blockIdx, 1);
    updateTrip(trip.id, { days: next });
    toast.success("Activity removed");
  };

  const moveBlock = (dayIdx, blockIdx, dir) => {
    const target = blockIdx + dir;
    if (target < 0 || target >= days[dayIdx].blocks.length) return;
    const next = [...days];
    const b = next[dayIdx].blocks.splice(blockIdx, 1)[0];
    next[dayIdx].blocks.splice(target, 0, b);
    updateTrip(trip.id, { days: next });
  };

  const updateBlockTime = (dayIdx, blockIdx, time) => {
    const next = [...days];
    next[dayIdx].blocks[blockIdx].time = time;
    updateTrip(trip.id, { days: next });
  };

  const addActivity = (activity) => {
    if (!addTo) return;
    const next = [...days];
    next[addTo.dayIdx].blocks.push({ time: "10:00", activityId: activity.id, city: addTo.city });
    updateTrip(trip.id, { days: next });
    setAddTo(null);
    toast.success(`${activity.name} added`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow text-muted-foreground mb-2">Itinerary Builder</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{trip.name}</h1>
          <p className="text-muted-foreground mt-2">{formatDateRange(trip.startDate, trip.endDate)} • {computeDays(trip.startDate, trip.endDate)} days</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => toast.success("Trip saved")} data-testid="save-btn" className="px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
          <Link to={`/share/${trip.id}`} data-testid="share-btn" className="px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Link>
          <button onClick={() => { updateTrip(trip.id, { days: generateAIDays(trip) }); toast.success("AI regenerated itinerary"); }} data-testid="ai-generate-btn" className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate with AI</button>
          <button onClick={() => setOpenMap((o) => !o)} data-testid="view-map-btn" className="px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary flex items-center gap-2"><MapIcon className="w-4 h-4" /> View Map</button>
        </div>
      </div>

      {openMap && (
        <div className="mb-8">
          <MapView title="Trip Route" points={trip.stops.map((s) => ({ ...findDestination(s.destinationId), name: findDestination(s.destinationId).city }))} />
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        {/* Day-by-day timeline */}
        <div className="space-y-6">
          {days.map((day, dayIdx) => {
            const city = day.city || findDestination(trip.stops[0]?.destinationId)?.city;
            return (
              <div key={day.date} data-testid={`day-${dayIdx}`} className="rounded-3xl bg-white border border-border overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#FAF9F6]">
                  <div>
                    <div className="eyebrow text-muted-foreground">Day {dayIdx + 1}</div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-serif text-2xl">{new Date(day.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{city}</span>
                    </div>
                  </div>
                  <button onClick={() => setAddTo({ dayIdx, city: (city || "").toLowerCase() })} data-testid={`add-activity-${dayIdx}`} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-[#1F382A] flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Add Activity</button>
                </div>
                <div className="p-4 md:p-6 space-y-3">
                  {day.blocks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No activities yet — click "Add Activity" to start planning this day.</div>
                  )}
                  {day.blocks.map((b, bi) => {
                    const a = findActivity(b.city, b.activityId) || findActivity(trip.stops[0].destinationId, b.activityId);
                    if (!a) return null;
                    return (
                      <div key={bi} data-testid={`block-${dayIdx}-${bi}`} className="group flex flex-col md:flex-row gap-4 rounded-2xl border border-border p-4 hover:border-primary/40 transition-colors">
                        <div className="flex items-start gap-3 md:w-32">
                          <GripVertical className="w-4 h-4 mt-1 text-muted-foreground cursor-grab" />
                          <div>
                            <div className="eyebrow text-muted-foreground">Time</div>
                            <input
                              type="time"
                              value={b.time}
                              onChange={(e) => updateBlockTime(dayIdx, bi, e.target.value)}
                              className="text-lg font-serif bg-transparent outline-none w-24"
                            />
                          </div>
                        </div>
                        <img src={a.image} alt={a.name} className="w-full md:w-24 h-24 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-[#FBF0E1] text-[10px] font-semibold uppercase tracking-widest">{a.category}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}h</span>
                            <span className="text-xs text-muted-foreground">{a.cost === 0 ? "Free" : `₹${a.cost.toLocaleString()}`}</span>
                          </div>
                          <div className="font-serif text-lg">{a.name}</div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                        </div>
                        <div className="flex md:flex-col items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveBlock(dayIdx, bi, -1)} className="w-8 h-8 rounded-full hover:bg-secondary grid place-items-center"><ArrowUp className="w-4 h-4" /></button>
                          <button onClick={() => moveBlock(dayIdx, bi, 1)} className="w-8 h-8 rounded-full hover:bg-secondary grid place-items-center"><ArrowDown className="w-4 h-4" /></button>
                          <button onClick={() => removeBlock(dayIdx, bi)} data-testid={`remove-block-${dayIdx}-${bi}`} className="w-8 h-8 rounded-full hover:bg-destructive/10 text-destructive grid place-items-center"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-white border border-border p-5">
            <div className="eyebrow text-muted-foreground mb-2">Trip Snapshot</div>
            <div className="space-y-2 text-sm">
              <Row label="Destinations" value={trip.stops.length} />
              <Row label="Days" value={computeDays(trip.startDate, trip.endDate)} />
              <Row label="Travellers" value={trip.travelers} />
              <Row label="Budget" value={`₹${trip.budget.toLocaleString()}`} />
              <Row label="Estimated" value={`₹${trip.estimatedCost.toLocaleString()}`} />
            </div>
            <Link to={`/trip/${trip.id}/budget`} className="block text-center mt-4 text-sm font-semibold text-primary hover:underline">Full budget breakdown →</Link>
          </div>
          <div className="rounded-3xl bg-[#FAF9F6] border border-border p-5">
            <div className="eyebrow text-muted-foreground mb-2">Stops</div>
            {trip.stops.map((s) => {
              const d = findDestination(s.destinationId);
              return (
                <div key={s.destinationId} className="flex items-center gap-3 py-2">
                  <img src={d.image} alt={d.city} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{d.city}</div>
                    <div className="text-xs text-muted-foreground">{s.nights} nights</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Activity search sheet */}
      <Sheet open={!!addTo} onOpenChange={(o) => !o && setAddTo(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <ActivitySearch city={addTo?.city} onAdd={addActivity} onClose={() => setAddTo(null)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ActivitySearch({ city, onAdd, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = useMemo(() => {
    const base = ACTIVITIES[city] || Object.values(ACTIVITIES).flat();
    return base.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "All" && a.category !== cat) return false;
      return true;
    });
  }, [city, q, cat]);
  const cats = ["All", ...new Set(Object.values(ACTIVITIES).flat().map((a) => a.category))];
  return (
    <div>
      <SheetHeader className="mb-4">
        <SheetTitle className="font-serif text-2xl">Discover Things To Do</SheetTitle>
      </SheetHeader>
      <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2 mb-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search activities..." className="w-full bg-transparent outline-none text-sm" />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((a) => (
          <div key={a.id} className="flex gap-3 rounded-2xl border border-border p-3">
            <img src={a.image} alt={a.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#FBF0E1] text-[10px] font-semibold uppercase tracking-widest">{a.category}</span>
                <span className="text-xs text-muted-foreground">⭐ {a.rating}</span>
              </div>
              <div className="text-sm font-semibold">{a.name}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs">{a.duration}h • {a.cost === 0 ? "Free" : `₹${a.cost}`}</span>
                <button onClick={() => onAdd(a)} data-testid={`add-activity-btn-${a.id}`} className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-[#1F382A]">Add</button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No activities match your filters.</div>}
      </div>
    </div>
  );
}

function ensureDays(trip) {
  if (trip.days && trip.days.length) return trip.days;
  // build empty days across the trip range
  const start = new Date(trip.startDate);
  const total = computeDays(trip.startDate, trip.endDate);
  const primaryCity = findDestination(trip.stops[0]?.destinationId)?.city || "";
  const out = [];
  for (let i = 0; i < total; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ date: d.toISOString().slice(0, 10), city: primaryCity, blocks: [] });
  }
  return out;
}

function generateAIDays(trip) {
  const total = computeDays(trip.startDate, trip.endDate);
  const start = new Date(trip.startDate);
  const primary = trip.stops[0]?.destinationId;
  const pool = ACTIVITIES[primary] || [];
  const days = [];
  for (let i = 0; i < total; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const picks = pool.slice(i % pool.length, (i % pool.length) + 3);
    const times = ["09:00", "13:00", "17:30"];
    days.push({
      date: d.toISOString().slice(0, 10),
      city: findDestination(primary)?.city,
      blocks: picks.map((a, idx) => ({ time: times[idx] || "18:00", activityId: a.id, city: primary })),
    });
  }
  return days;
}

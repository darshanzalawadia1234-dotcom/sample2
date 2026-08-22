import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Calendar as CalIcon, List, Map as MapIcon, Wallet, Users, MapPin, Clock, Share2, Sun, CloudRain, Cloud, Thermometer } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { findActivity, findDestination, formatDateRange, computeDays } from "@/data/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MapView from "@/components/MapView";
import { BudgetDonut, BudgetBar } from "@/components/BudgetChart";
import { fetchWeatherForecast } from "@/lib/weather";

const TIME_OF_DAY = (t) => {
  const h = parseInt(t.split(":")[0], 10);
  if (h < 12) return "Morning";
  if (h < 15) return "Lunch";
  if (h < 18) return "Afternoon";
  return "Evening";
};

const WEATHER = [
  { icon: Sun, temp: 28, cond: "Sunny", rain: "10%" },
  { icon: Cloud, temp: 26, cond: "Partly Cloudy", rain: "20%" },
  { icon: CloudRain, temp: 24, cond: "Light Rain", rain: "70%" },
  { icon: Sun, temp: 30, cond: "Clear", rain: "5%" },
];

export default function ItineraryView() {
  const { id } = useParams();
  const { getTrip } = useTrips();
  const trip = getTrip(id);
  const [tab, setTab] = useState("timeline");

  if (!trip) return <Navigate to="/trips" />;
  const days = trip.days && trip.days.length ? trip.days : [];
  const points = trip.stops.map((s) => ({ ...findDestination(s.destinationId), name: findDestination(s.destinationId).city }));

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="relative h-72 md:h-96">
        <img src={trip.cover} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A]/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8 text-white">
          <div className="eyebrow text-white/80 mb-2">Trip Overview</div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1"><CalIcon className="w-4 h-4" /> {formatDateRange(trip.startDate, trip.endDate)}</span>
            <span>•</span>
            <span>{computeDays(trip.startDate, trip.endDate)} Days</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {trip.travelers} Travellers</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> ₹{trip.estimatedCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <TabsList className="bg-white border border-border rounded-full p-1">
                <TabsTrigger value="timeline" data-testid="tab-timeline" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"><List className="w-4 h-4 mr-1" /> Timeline</TabsTrigger>
                <TabsTrigger value="calendar" data-testid="tab-calendar" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"><CalIcon className="w-4 h-4 mr-1" /> Calendar</TabsTrigger>
                <TabsTrigger value="map" data-testid="tab-map" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"><MapIcon className="w-4 h-4 mr-1" /> Map</TabsTrigger>
                <TabsTrigger value="budget" data-testid="tab-budget" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"><Wallet className="w-4 h-4 mr-1" /> Budget</TabsTrigger>
              </TabsList>
              <Link to={`/share/${trip.id}`} className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-secondary flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Link>
            </div>

            <TabsContent value="timeline" className="mt-6">
              <Timeline trip={trip} days={days} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-6">
              <Calendar trip={trip} days={days} />
            </TabsContent>
            <TabsContent value="map" className="mt-6">
              <MapView title={`${trip.name} — Route`} points={points} />
            </TabsContent>
            <TabsContent value="budget" className="mt-6">
              <BudgetSummary trip={trip} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Timeline({ trip, days }) {
  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-6">
        {days.map((day, di) => (
          <DayTimelineCard key={day.date} trip={trip} day={day} di={di} />
        ))}
      </div>
      <div className="space-y-6">
        <BudgetSnap trip={trip} days={days} />
      </div>
    </div>
  );
}

function DayTimelineCard({ trip, day, di }) {
  const defaultWeather = WEATHER[di % WEATHER.length];
  const [weather, setWeather] = useState({
    temp: defaultWeather.temp,
    cond: defaultWeather.cond,
    icon: defaultWeather.icon,
  });

  useEffect(() => {
    const dest = findDestination(day.city?.toLowerCase()) || findDestination(trip.stops[0]?.destinationId);
    const lat = dest?.lat || 52.52;
    const lng = dest?.lng || 13.41;

    fetchWeatherForecast(lat, lng).then((forecast) => {
      if (forecast && forecast.currentTemp !== undefined) {
        setWeather({
          temp: forecast.currentTemp,
          cond: forecast.cond,
          icon: forecast.currentTemp > 25 ? Sun : forecast.currentTemp > 18 ? Cloud : CloudRain,
        });
      }
    });
  }, [day.city, trip.stops]);

  const WeatherIcon = weather.icon;

  return (
    <div className="rounded-3xl bg-white border border-border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#FAF9F6]">
        <div>
          <div className="eyebrow text-muted-foreground">Day {di + 1}</div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-serif text-2xl">{new Date(day.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{day.city}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-1.5 rounded-full shadow-xs">
          <WeatherIcon className="w-4 h-4 text-[#B8862F]" />
          <span className="font-semibold text-xs">{weather.temp}°C</span>
          <span className="text-xs text-muted-foreground">{weather.cond}</span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {Object.entries(groupByTime(day.blocks)).map(([slot, blocks]) => (
          <div key={slot}>
            <div className="eyebrow text-muted-foreground mb-3">{slot}</div>
            <div className="space-y-3">
              {blocks.map((b, bi) => {
                const a = findActivity(b.city, b.activityId) || findActivity(trip.stops[0].destinationId, b.activityId);
                if (!a) return null;
                return (
                  <div key={bi} className="flex gap-4">
                    <div className="w-16 text-right">
                      <div className="font-serif text-lg">{b.time}</div>
                    </div>
                    <div className="w-px bg-border relative">
                      <div className="w-2 h-2 rounded-full bg-primary absolute -left-[3px] top-2" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="font-serif text-lg">{a.name}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#FBF0E1] font-semibold uppercase tracking-widest text-[10px]">{a.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.duration}h</span>
                        <span>{a.cost === 0 ? "Free" : `₹${a.cost.toLocaleString()}`}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {day.blocks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nothing planned yet. <Link to={`/trip/${trip.id}/build`} className="text-primary font-semibold">Add activities →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function BudgetSnap({ trip, days }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-3xl bg-white border border-border p-5">
        <div className="eyebrow text-muted-foreground mb-3">Multi-City Journey</div>
        {trip.stops.map((s, i) => {
          const d = findDestination(s.destinationId);
          return (
            <div key={s.destinationId} className="flex items-center gap-3 py-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white grid place-items-center text-xs font-bold">{i + 1}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{d?.city || s.destinationId}</div>
                <div className="text-xs text-muted-foreground">{s.nights} nights</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-3xl bg-white border border-border p-5">
        <div className="eyebrow text-muted-foreground mb-3">Weather Forecast</div>
        <div className="space-y-2">
          {days.slice(0, 4).map((day, i) => {
            const w = WEATHER[i % WEATHER.length];
            return (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(day.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}</span>
                <div className="flex items-center gap-2">
                  <w.icon className="w-4 h-4 text-accent" />
                  <span>{w.temp}°C</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function Calendar({ trip, days }) {
  const first = new Date(trip.startDate);
  const monthStart = new Date(first.getFullYear(), first.getMonth(), 1);
  const startWeekday = monthStart.getDay();
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayMap = Object.fromEntries(days.map((d) => [d.date, d]));

  return (
    <div className="rounded-3xl bg-white border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-2xl">{first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground text-center mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="aspect-square" />;
          const dateStr = new Date(first.getFullYear(), first.getMonth(), c).toISOString().slice(0, 10);
          const day = dayMap[dateStr];
          return (
            <div key={i} className={`aspect-square rounded-2xl border p-2 text-left ${day ? "bg-[#EDF3EA] border-primary/30" : "border-border"}`}>
              <div className="text-xs font-semibold">{c}</div>
              {day && (
                <div className="mt-1 space-y-1 overflow-hidden">
                  {day.blocks.slice(0, 2).map((b, bi) => {
                    const a = findActivity(b.city, b.activityId) || findActivity(trip.stops[0].destinationId, b.activityId);
                    if (!a) return null;
                    return <div key={bi} className="text-[10px] truncate bg-white rounded px-1 py-0.5">{b.time} {a.name}</div>;
                  })}
                  {day.blocks.length > 2 && <div className="text-[10px] text-muted-foreground">+{day.blocks.length - 2} more</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BudgetSummary({ trip }) {
  const remaining = trip.budget - trip.estimatedCost;
  const over = remaining < 0;
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Budget" value={`₹${trip.budget.toLocaleString()}`} />
        <Stat label="Estimated Cost" value={`₹${trip.estimatedCost.toLocaleString()}`} />
        <Stat label="Remaining" value={`₹${Math.abs(remaining).toLocaleString()}${over ? " over" : ""}`} tone={over ? "danger" : "success"} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-border p-6">
          <div className="eyebrow text-muted-foreground mb-2">Cost Breakdown</div>
          <BudgetDonut breakdown={trip.breakdown || {}} />
        </div>
        <div className="rounded-3xl bg-white border border-border p-6">
          <div className="eyebrow text-muted-foreground mb-2">By Category</div>
          <BudgetBar breakdown={trip.breakdown || {}} />
        </div>
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

function groupByTime(blocks) {
  return blocks.reduce((acc, b) => {
    const key = TIME_OF_DAY(b.time);
    acc[key] = acc[key] || [];
    acc[key].push(b);
    return acc;
  }, {});
}

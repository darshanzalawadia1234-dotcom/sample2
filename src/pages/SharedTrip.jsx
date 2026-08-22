import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Copy, Link2, Share2, Users, Calendar as CalIcon, Wallet, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { useTrips } from "@/context/TripContext";
import { findActivity, findDestination, formatDateRange, computeDays } from "@/data/mockData";
import { BudgetDonut } from "@/components/BudgetChart";
import MapView from "@/components/MapView";

export default function SharedTrip() {
  const { id } = useParams();
  const { getTrip, duplicateTrip } = useTrips();
  const trip = getTrip(id);
  const [copied, setCopied] = useState(false);
  if (!trip) return <Navigate to="/trips" />;

  const publicUrl = `${window.location.origin}/share/${trip.id}`;
  const copy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2500);
  };

  const copyTrip = () => {
    duplicateTrip(trip.id);
    toast.success("Trip copied to your account");
  };

  const points = trip.stops.map((s) => ({ ...findDestination(s.destinationId), name: findDestination(s.destinationId).city }));

  return (
    <div className="fade-in">
      <div className="relative h-72 md:h-96">
        <img src={trip.cover} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A]/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8 text-white">
          <div className="eyebrow text-white/80 mb-2">Shared itinerary — read only</div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1"><CalIcon className="w-4 h-4" /> {formatDateRange(trip.startDate, trip.endDate)}</span>
            <span>•</span><span>{computeDays(trip.startDate, trip.endDate)} Days</span>
            <span>•</span><span className="flex items-center gap-1"><Users className="w-4 h-4" /> {trip.travelers}</span>
            <span>•</span><span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> ₹{trip.estimatedCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="rounded-3xl bg-white border border-border p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2 flex-1 bg-[#FAF9F6]">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate">{publicUrl}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copy} data-testid="copy-link-btn" className="px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary flex items-center gap-2"><Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy Link"}</button>
            <button onClick={copyTrip} data-testid="copy-trip-btn" className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] flex items-center gap-2"><Copy className="w-4 h-4" /> Copy Trip</button>
            <div className="flex items-center gap-2">
              <SocialBtn label="WhatsApp" />
              <SocialBtn label="Instagram" />
              <SocialBtn label="Facebook" />
            </div>
          </div>
        </div>

        {/* Summary + Budget */}
        <div className="grid md:grid-cols-[1fr_320px] gap-6 mb-8">
          <div className="rounded-3xl bg-white border border-border p-6">
            <div className="eyebrow text-muted-foreground mb-2">About This Trip</div>
            <p className="text-lg leading-relaxed">{trip.description || "An amazing multi-day journey to remember."}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {(trip.interests || []).map((i) => <span key={i} className="px-3 py-1 rounded-full bg-secondary text-xs font-semibold">{i}</span>)}
            </div>
          </div>
          <div className="rounded-3xl bg-white border border-border p-5">
            <div className="eyebrow text-muted-foreground mb-2">Budget Snapshot</div>
            <BudgetDonut breakdown={trip.breakdown || {}} size={180} />
          </div>
        </div>

        {/* Route Map */}
        <div className="mb-8">
          <MapView title="The Journey" points={points} />
        </div>

        {/* Itinerary */}
        <div className="rounded-3xl bg-white border border-border p-6 md:p-10">
          <h2 className="font-serif text-3xl mb-6">Day-by-day itinerary</h2>
          <div className="space-y-8">
            {(trip.days || []).map((day, di) => (
              <div key={day.date}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="eyebrow text-muted-foreground">Day {di + 1}</span>
                  <span className="font-serif text-2xl">{new Date(day.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{day.city}</span>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                  {day.blocks.map((b, bi) => {
                    const a = findActivity(b.city, b.activityId) || findActivity(trip.stops[0].destinationId, b.activityId);
                    if (!a) return null;
                    return (
                      <div key={bi} className="flex gap-3 items-start">
                        <span className="eyebrow text-primary w-12 pt-1">{b.time}</span>
                        <div>
                          <div className="font-serif text-lg">{a.name}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{a.category}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.duration}h</span>
                            <span>{a.cost === 0 ? "Free" : `₹${a.cost.toLocaleString()}`}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ label }) {
  return (
    <button
      onClick={() => toast.info(`Sharing to ${label} — connect ${label} to enable`)}
      className="w-10 h-10 rounded-full border border-border hover:bg-secondary grid place-items-center"
      aria-label={`Share to ${label}`}
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}

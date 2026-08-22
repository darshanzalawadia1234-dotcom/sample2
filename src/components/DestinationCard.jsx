import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrips } from "@/context/TripContext";

export default function DestinationCard({ d, compact = false, onExplore, className = "" }) {
  const { savedDestinations, toggleSaved } = useTrips();
  const saved = savedDestinations.includes(d.id);
  return (
    <div
      data-testid={`destination-card-${d.id}`}
      className={`group relative overflow-hidden rounded-3xl bg-white border border-border hover-lift fade-in-up ${compact ? "" : "h-full"} ${className}`.trim()}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={d.image}
          alt={d.city}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A]/70 via-transparent to-transparent" />
        <button
          data-testid={`save-dest-${d.id}`}
          onClick={(e) => { e.preventDefault(); toggleSaved(d.id); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center bg-white/85 backdrop-blur hover:bg-white transition-colors"
          aria-label="Save destination"
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-[#9E2A2B] stroke-[#9E2A2B]" : "stroke-foreground"}`} strokeWidth={1.5} />
        </button>
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold">
          {d.costIndex}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-serif text-2xl leading-tight">{d.city}</h3>
          <div className="flex items-center gap-3 text-xs mt-1 opacity-90">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d.country}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-white" />{d.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{d.description}</p>
        <Link
          to="/plan"
          state={{ preselected: d.id }}
          onClick={onExplore}
          data-testid={`explore-btn-${d.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          Explore
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

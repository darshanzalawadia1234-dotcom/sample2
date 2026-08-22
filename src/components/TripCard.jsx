import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, MoreHorizontal, Copy, Trash2, Share2, Pencil } from "lucide-react";
import { computeDays, formatDateRange, findDestination } from "@/data/mockData";
import { useTrips } from "@/context/TripContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function TripCard({ trip, variant = "default" }) {
  const { duplicateTrip, deleteTrip } = useTrips();
  const days = computeDays(trip.startDate, trip.endDate);
  const primaryDest = trip.stops?.[0] ? findDestination(trip.stops[0].destinationId) : null;
  const pct = Math.min(100, Math.round((trip.estimatedCost / trip.budget) * 100));
  const over = trip.estimatedCost > trip.budget;

  return (
    <div
      data-testid={`trip-card-${trip.id}`}
      className="group relative overflow-hidden rounded-3xl bg-white border border-border hover-lift"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={trip.cover} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B1A]/65 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            trip.status === "upcoming" ? "bg-[#3A5A40] text-white" :
            trip.status === "over-budget" ? "bg-[#9E2A2B] text-white" :
            "bg-white/85 text-foreground"
          }`}>
            {trip.status === "over-budget" ? "Over Budget" : trip.status === "upcoming" ? "Upcoming" : "Past"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid={`trip-menu-${trip.id}`}
                className="w-9 h-9 rounded-full grid place-items-center bg-white/85 hover:bg-white transition-colors"
                aria-label="Trip options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to={`/trip/${trip.id}/build`}><Pencil className="w-4 h-4 mr-2" />Edit</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to={`/share/${trip.id}`}><Share2 className="w-4 h-4 mr-2" />Share</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={() => { duplicateTrip(trip.id); toast.success("Trip duplicated"); }}><Copy className="w-4 h-4 mr-2" />Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => { deleteTrip(trip.id); toast.success("Trip deleted"); }}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-serif text-2xl leading-tight">{trip.name}</h3>
          <div className="flex items-center gap-3 text-xs mt-1 opacity-90">
            {primaryDest && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{primaryDest.city}{trip.stops.length > 1 ? ` +${trip.stops.length - 1}` : ""}</span>}
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDateRange(trip.startDate, trip.endDate)}</span>
          <span>•</span>
          <span>{days} {days === 1 ? "day" : "days"}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{trip.travelers}</span>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Budget</span>
            <span className={`text-sm font-semibold ${over ? "text-[#9E2A2B]" : "text-primary"}`}>
              ₹{trip.estimatedCost.toLocaleString()} / ₹{trip.budget.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className={`h-full rounded-full transition-all ${over ? "bg-[#9E2A2B]" : "bg-primary"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {variant !== "compact" && (
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/trip/${trip.id}`}
              data-testid={`view-trip-${trip.id}`}
              className="flex-1 text-center py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#1F382A] transition-colors"
            >
              View Trip
            </Link>
            <Link
              to={`/trip/${trip.id}/build`}
              data-testid={`edit-trip-${trip.id}`}
              className="flex-1 text-center py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

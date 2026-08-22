import { useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";

// Simple mock map: renders points on an SVG grid with a route line.
export default function MapView({ points = [], title = "Trip Route" }) {
  const { normalized, distance, duration } = useMemo(() => {
    if (!points.length) return { normalized: [], distance: 0, duration: 0 };
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const pad = 60;
    const w = 700, h = 380;
    const spanLat = Math.max(0.01, maxLat - minLat);
    const spanLng = Math.max(0.01, maxLng - minLng);
    const normalized = points.map((p, i) => ({
      x: pad + ((p.lng - minLng) / spanLng) * (w - pad * 2) || w / 2,
      y: h - pad - ((p.lat - minLat) / spanLat) * (h - pad * 2) || h / 2,
      label: String.fromCharCode(65 + i),
      name: p.name,
    }));
    // rough distance from bounding box in km
    const distance = Math.round(Math.hypot(spanLat, spanLng) * 111);
    const duration = Math.max(15, Math.round((distance / 50) * 60));
    return { normalized, distance, duration };
  }, [points]);

  return (
    <div className="rounded-3xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        <h3 className="font-serif text-lg">{title}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5" />{distance} km</span>
          <span>≈ {Math.floor(duration / 60)}h {duration % 60}m</span>
        </div>
      </div>
      <div className="relative map-canvas h-[420px]">
        <div className="absolute inset-0 map-grid" />
        <svg viewBox="0 0 700 380" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
          {/* Route */}
          {normalized.length > 1 && (
            <polyline
              points={normalized.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#2C4C3B"
              strokeWidth="3"
              strokeLinecap="round"
              className="route-dashed"
            />
          )}
          {/* Points */}
          {normalized.map((p) => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r="14" fill="#D4A373" />
              <circle cx={p.x} cy={p.y} r="20" fill="#D4A373" opacity="0.25" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1B1A">{p.label}</text>
              <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1A1B1A" style={{ fontFamily: "Manrope" }}>{p.name}</text>
            </g>
          ))}
        </svg>
        {normalized.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Add destinations to see them on the map
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

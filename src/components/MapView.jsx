import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { loadGoogleMaps } from "@/lib/googleMaps";

// Simple mock map: renders points on an SVG grid with a route line.
export default function MapView({ points = [], title = "Trip Route" }) {
  const mapRef = useRef(null);
  const [googleMapReady, setGoogleMapReady] = useState(false);
  const [googleMapError, setGoogleMapError] = useState(false);
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

  useEffect(() => {
    if (!points.length) return undefined;

    let cancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !mapRef.current) return;
        const bounds = new maps.LatLngBounds();
        points.forEach((point) => bounds.extend({ lat: point.lat, lng: point.lng }));
        const map = new maps.Map(mapRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f1ecdf" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#12213f" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#b9d8d2" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          ],
        });
        map.fitBounds(bounds, 56);
        points.forEach((point, index) => {
          new maps.Marker({
            map,
            position: { lat: point.lat, lng: point.lng },
            label: { text: String.fromCharCode(65 + index), color: "#12213f", fontWeight: "700" },
            title: point.name,
          });
        });

        if (points.length > 1) {
          const directions = new maps.DirectionsService();
          const renderer = new maps.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeColor: "#b8862f", strokeWeight: 4 } });
          directions.route({
            origin: { lat: points[0].lat, lng: points[0].lng },
            destination: { lat: points[points.length - 1].lat, lng: points[points.length - 1].lng },
            waypoints: points.slice(1, -1).map((point) => ({ location: { lat: point.lat, lng: point.lng }, stopover: true })),
            travelMode: "DRIVING",
          }, (result, status) => {
            if (!cancelled && status === "OK") renderer.setDirections(result);
          });
        }
        setGoogleMapReady(true);
      })
      .catch(() => {
        if (!cancelled) setGoogleMapError(true);
      });

    return () => { cancelled = true; };
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
        <div ref={mapRef} className={`absolute inset-0 ${googleMapReady ? "" : "hidden"}`} aria-label="Google Maps trip route" />
        <div className="absolute inset-0 map-grid" />
        <svg viewBox="0 0 700 380" preserveAspectRatio="xMidYMid meet" className={`absolute inset-0 w-full h-full ${googleMapReady ? "hidden" : ""}`}>
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
        {googleMapError && normalized.length > 0 && (
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm">
            Google Maps unavailable — showing offline route
          </div>
        )}
      </div>
    </div>
  );
}

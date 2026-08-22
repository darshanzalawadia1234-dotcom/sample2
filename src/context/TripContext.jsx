import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { INITIAL_TRIPS, SAVED_DESTINATION_IDS, findActivity } from "@/data/mockData";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [savedDestinations, setSavedDestinations] = useState(SAVED_DESTINATION_IDS);
  const [user, setUser] = useState({
    name: "User",
    email: "daksh@globetrotter.io",
    language: "English",
    photo: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&q=80",
    style: "Balanced",
    favouriteActivities: ["Food", "Adventure"],
  });

  const createTrip = useCallback((trip) => {
    const id = `trip-${Date.now()}`;
    const newTrip = { id, status: "upcoming", days: [], breakdown: {}, ...trip };
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  }, []);

  const updateTrip = useCallback((id, patch) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTrip = useCallback((id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const duplicateTrip = useCallback((id) => {
    setTrips((prev) => {
      const src = prev.find((t) => t.id === id);
      if (!src) return prev;
      const copy = { ...src, id: `trip-${Date.now()}`, name: `${src.name} (Copy)`, status: "upcoming" };
      return [copy, ...prev];
    });
  }, []);

  const toggleSaved = useCallback((destId) => {
    setSavedDestinations((prev) =>
      prev.includes(destId) ? prev.filter((x) => x !== destId) : [...prev, destId]
    );
  }, []);

  const getTrip = useCallback(
    (id) => trips.find((t) => t.id === id),
    [trips]
  );

  const computeTripCost = useCallback((trip) => {
    if (!trip) return 0;
    if (trip.days && trip.days.length) {
      let sum = 0;
      trip.days.forEach((d) => {
        d.blocks.forEach((b) => {
          const stopId = trip.stops[0]?.destinationId;
          const a = findActivity(b.city ? b.city.toLowerCase() : stopId, b.activityId);
          if (a) sum += a.cost * (trip.travelers || 1);
        });
      });
      // Add accommodation/food/transport estimates
      const nights = trip.stops.reduce((n, s) => n + (s.nights || 0), 0) || 3;
      sum += nights * 2000 + nights * 800 + nights * 500;
      return sum;
    }
    return trip.estimatedCost || 0;
  }, []);

  const value = useMemo(
    () => ({
      trips,
      user,
      setUser,
      savedDestinations,
      createTrip,
      updateTrip,
      deleteTrip,
      duplicateTrip,
      toggleSaved,
      getTrip,
      computeTripCost,
    }),
    [trips, user, savedDestinations, createTrip, updateTrip, deleteTrip, duplicateTrip, toggleSaved, getTrip, computeTripCost]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrips must be used within TripProvider");
  return ctx;
}

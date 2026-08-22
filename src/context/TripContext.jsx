import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { INITIAL_TRIPS, SAVED_DESTINATION_IDS, findActivity } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [savedDestinations, setSavedDestinations] = useState(SAVED_DESTINATION_IDS);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
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
    if (supabase && authUser) {
      supabase.from("trips").insert(toTripRow(newTrip, authUser.id)).then(({ error }) => {
        if (error) console.warn("Could not save trip to Supabase:", error.message);
      });
    }
    return newTrip;
  }, [authUser]);

  const updateTrip = useCallback((id, patch) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (supabase && authUser) {
      supabase.from("trips").update(toTripRow(patch)).eq("id", id).eq("user_id", authUser.id).then(({ error }) => {
        if (error) console.warn("Could not update trip in Supabase:", error.message);
      });
    }
  }, [authUser]);

  const deleteTrip = useCallback((id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (supabase && authUser) {
      supabase.from("trips").delete().eq("id", id).eq("user_id", authUser.id).then(({ error }) => {
        if (error) console.warn("Could not delete trip from Supabase:", error.message);
      });
    }
  }, [authUser]);

  const duplicateTrip = useCallback((idOrTrip) => {
    setTrips((prev) => {
      let src;
      if (typeof idOrTrip === 'string') {
        src = prev.find((t) => t.id === idOrTrip);
      } else {
        src = idOrTrip;
      }
      if (!src) return prev;
      const copy = { ...src, id: `trip-${Date.now()}`, name: `${src.name} (Copy)`, status: "upcoming" };
      if (supabase && authUser) {
        supabase.from("trips").insert(toTripRow(copy, authUser.id)).then(({ error }) => {
          if (error) console.warn("Could not duplicate trip in Supabase:", error.message);
        });
      }
      return [copy, ...prev];
    });
  }, [authUser]);

  const toggleSaved = useCallback((destId) => {
    setSavedDestinations((prev) => {
      const isSaved = prev.includes(destId);
      const next = isSaved ? prev.filter((x) => x !== destId) : [...prev, destId];
      if (supabase && authUser) {
        const request = isSaved
          ? supabase.from("saved_destinations").delete().eq("user_id", authUser.id).eq("destination_id", destId)
          : supabase.from("saved_destinations").upsert({ user_id: authUser.id, destination_id: destId });
        request.then(({ error }) => {
          if (error) console.warn("Could not update saved destination:", error.message);
        });
      }
      return next;
    });
  }, [authUser]);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (supabase && authUser) {
      supabase.from("profiles").upsert(toProfileRow(nextUser, authUser.id)).then(({ error }) => {
        if (error) console.warn("Could not update profile in Supabase:", error.message);
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    const loadUserData = async (sessionUser) => {
      if (!sessionUser) {
        setAuthUser(null);
        setAuthLoading(false);
        return;
      }
      setAuthUser(sessionUser);
      const [profileResult, tripsResult, savedResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", sessionUser.id).maybeSingle(),
        supabase.from("trips").select("*").eq("user_id", sessionUser.id).order("created_at", { ascending: false }),
        supabase.from("saved_destinations").select("destination_id").eq("user_id", sessionUser.id),
      ]);
      if (!active) return;
      if (profileResult.data) setUser(fromProfileRow(profileResult.data, sessionUser));
      if (tripsResult.data) setTrips(tripsResult.data.map(fromTripRow));
      if (savedResult.data) setSavedDestinations(savedResult.data.map((item) => item.destination_id));
      setAuthLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => loadUserData(data.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => loadUserData(session?.user));
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
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
      authUser,
      authLoading,
      setUser: updateUser,
      savedDestinations,
      createTrip,
      updateTrip,
      deleteTrip,
      duplicateTrip,
      toggleSaved,
      getTrip,
      computeTripCost,
    }),
    [trips, user, authUser, authLoading, savedDestinations, updateUser, createTrip, updateTrip, deleteTrip, duplicateTrip, toggleSaved, getTrip, computeTripCost]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

function toTripRow(trip, userId) {
  return {
    ...(userId ? { id: trip.id, user_id: userId } : {}),
    name: trip.name,
    description: trip.description || "",
    cover: trip.cover || "",
    start_date: trip.startDate || null,
    end_date: trip.endDate || null,
    status: trip.status || "upcoming",
    travelers: trip.travelers || 1,
    budget: trip.budget || 0,
    currency: trip.currency || "INR",
    estimated_cost: trip.estimatedCost || 0,
    interests: trip.interests || [],
    style: trip.style || "Balanced",
    transport: trip.transport || "Mixed",
    stops: trip.stops || [],
    breakdown: trip.breakdown || {},
    days: trip.days || [],
  };
}

function fromTripRow(row) {
  return {
    ...row,
    startDate: row.start_date,
    endDate: row.end_date,
    estimatedCost: row.estimated_cost,
  };
}

function toProfileRow(profile, userId) {
  return {
    id: userId,
    name: profile.name || "User",
    language: profile.language || "English",
    photo: profile.photo || "",
    style: profile.style || "Balanced",
    favourite_activities: profile.favouriteActivities || [],
  };
}

function fromProfileRow(row, sessionUser) {
  return {
    name: row.name || sessionUser.user_metadata?.full_name || "User",
    email: sessionUser.email || "",
    language: row.language || "English",
    photo: row.photo || sessionUser.user_metadata?.avatar_url || "",
    style: row.style || "Balanced",
    favouriteActivities: row.favourite_activities || [],
  };
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrips must be used within TripProvider");
  return ctx;
}

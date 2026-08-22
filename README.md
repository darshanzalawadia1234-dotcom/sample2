# GlobeTrotter

## Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Supabase project URL and anon key. Keep `.env.local` out of Git.

## Supabase backend

The app persists authenticated user profiles, trips, and saved destinations in Supabase. Apply the schema migration in the Supabase SQL Editor before testing signed-in data:

`supabase/migrations/20260822000000_initial_schema.sql`

The migration creates the tables, row-level security policies, and the trigger that creates a profile when a user signs up. Google and Apple sign-in also need to be enabled and configured under Supabase Authentication providers.

## Geoapify APIs

Set `VITE_GEOAPIFY_API_KEY` in `.env.local`. The app uses Geoapify autocomplete for destination search, Places for itinerary activity discovery, Routing for trip routes, and exposes helpers for geocoding, postcode search, place details, boundaries, geometry, and custom map icons in `src/lib/geoapify.js`.
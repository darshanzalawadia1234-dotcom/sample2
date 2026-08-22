export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const PLACES_API_KEY = import.meta.env.VITE_PLACES_API_KEY || '';
export const ROUTES_API_KEY = import.meta.env.VITE_ROUTES_API_KEY || '';

if (!GOOGLE_MAPS_API_KEY) {
  console.warn("Google Maps API Key is missing. Check your .env.local file.");
}

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const PLACES_API_KEY = import.meta.env.VITE_PLACES_API_KEY || '';
export const ROUTES_API_KEY = import.meta.env.VITE_ROUTES_API_KEY || '';
export const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'd8a87b1c41fb4cfb99db491be7c91722';
export const FORECAST_API_URL = import.meta.env.VITE_FORECAST_API_URL || 'https://api.open-meteo.com/v1/forecast';

if (!GOOGLE_MAPS_API_KEY) {
  console.warn("Google Maps API Key is missing. Check your .env.local file.");
}

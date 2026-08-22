import { GEOAPIFY_API_KEY } from './config';

const BASE_V1 = 'https://api.geoapify.com/v1';
const BASE_V2 = 'https://api.geoapify.com/v2';

/**
 * Helper to execute Geoapify API GET request
 */
async function getGeoapify(endpoint, params = {}) {
  const url = new URL(endpoint);
  Object.entries({ ...params, apiKey: GEOAPIFY_API_KEY }).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.append(k, v);
    }
  });

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.warn(`Geoapify ${endpoint} error:`, res.statusText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`Geoapify request failed (${endpoint}):`, err.message);
    return null;
  }
}

/**
 * 1. Geocode Search API
 * https://api.geoapify.com/v1/geocode/search?text=...
 */
export async function geocodeSearch(text, options = {}) {
  const data = await getGeoapify(`${BASE_V1}/geocode/search`, { text, ...options });
  return data?.features || [];
}

/**
 * 2. Routing API
 * https://api.geoapify.com/v1/routing?waypoints=lat,lon|lat,lon&mode=drive
 */
export async function calculateRoute(waypoints = [], mode = 'drive', options = {}) {
  if (waypoints.length < 2) return null;
  const waypointsStr = waypoints.map(wp => `${wp.lat},${wp.lng || wp.lon}`).join('|');
  const data = await getGeoapify(`${BASE_V1}/routing`, {
    waypoints: waypointsStr,
    mode,
    ...options
  });
  return data?.features?.[0] || null;
}

/**
 * 3. Geocode Autocomplete API
 * https://api.geoapify.com/v1/geocode/autocomplete?text=...&type=city
 */
export async function geocodeAutocomplete(text, options = {}) {
  if (!text || text.length < 2) return [];
  const data = await getGeoapify(`${BASE_V1}/geocode/autocomplete`, {
    text,
    type: 'city',
    limit: 6,
    ...options
  });
  return data?.features?.map(f => ({
    name: f.properties.formatted || f.properties.city || f.properties.name,
    city: f.properties.city || f.properties.name,
    country: f.properties.country,
    country_code: f.properties.country_code,
    lat: f.properties.lat,
    lon: f.properties.lon,
    place_id: f.properties.place_id,
  })) || [];
}

/**
 * 4. Postcode Search API
 * https://api.geoapify.com/v1/postcode/search?postcode=...
 */
export async function postcodeSearch(postcode, country = '', options = {}) {
  const data = await getGeoapify(`${BASE_V1}/postcode/search`, {
    postcode,
    country,
    ...options
  });
  return data?.features || [];
}

/**
 * 5. Places API
 * https://api.geoapify.com/v2/places?categories=catering,tourism,entertainment&filter=circle:lon,lat,radius
 */
export async function searchPlaces(categories = 'tourism,catering,entertainment', lat, lon, radiusMeters = 5000, options = {}) {
  const filter = lat && lon ? `circle:${lon},${lat},${radiusMeters}` : undefined;
  const bias = lat && lon ? `proximity:${lon},${lat}` : undefined;
  const data = await getGeoapify(`${BASE_V2}/places`, {
    categories,
    filter,
    bias,
    limit: 20,
    ...options
  });
  return data?.features?.map(f => ({
    id: f.properties.place_id,
    name: f.properties.name || f.properties.street || f.properties.formatted,
    category: f.properties.categories?.[0]?.replace(/\./g, ' ') || 'Attraction',
    address: f.properties.formatted,
    lat: f.properties.lat,
    lon: f.properties.lon,
    website: f.properties.website,
  })) || [];
}

/**
 * 6. Place Details API
 * https://api.geoapify.com/v2/place-details?id=...
 */
export async function getPlaceDetails(placeId, options = {}) {
  if (!placeId) return null;
  const data = await getGeoapify(`${BASE_V2}/place-details`, {
    id: placeId,
    ...options
  });
  return data?.features?.[0]?.properties || null;
}

/**
 * 7. Geometry / Boundaries Part-Of API
 * https://api.geoapify.com/v1/boundaries/part-of?id=...
 */
export async function getBoundariesPartOf(id, options = {}) {
  const data = await getGeoapify(`${BASE_V1}/boundaries/part-of`, {
    id,
    ...options
  });
  return data?.features || [];
}

/**
 * 8. Map Marker / Icon API URL Generator
 * https://api.geoapify.com/v2/icon?type=material&color=red&icon=cloud
 */
export function getCustomIconUrl({ type = 'material', color = '#12213F', icon = 'location_on', size = 'large' } = {}) {
  return `${BASE_V2}/icon?type=${type}&color=${encodeURIComponent(color)}&icon=${icon}&size=${size}&apiKey=${GEOAPIFY_API_KEY}`;
}

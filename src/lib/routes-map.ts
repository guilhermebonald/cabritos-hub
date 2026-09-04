export type LatLng = [number, number];

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  centerLat: number;
  centerLng: number;
}

export interface ActivityRouteInput {
  id: string;
  athleteName: string;
  name: string;
  distanceMeters: number;
  elevationGainMeters: number;
  summaryPolyline?: string;
  activityType: "Outdoor" | "Virtual" | "EBike";
}

export interface DecodedRoute {
  activityId: string;
  athleteName: string;
  activityName: string;
  distanceKm: number;
  elevationMeters: number;
  coordinates: LatLng[];
}

export interface CollectiveRoutesResult {
  totalGpsRoutes: number;
  totalDistanceKm: number;
  totalElevationMeters: number;
  routes: DecodedRoute[];
  allPoints: LatLng[];
  bounds: MapBounds | null;
}

/**
 * Decodes a Google Encoded Polyline string into an array of [lat, lng] tuples.
 * Standard Strava API polyline representation algorithm.
 */
export function decodePolyline(str?: string): LatLng[] {
  if (!str || typeof str !== "string") return [];

  let index = 0;
  const len = str.length;
  let lat = 0;
  let lng = 0;
  const coordinates: LatLng[] = [];

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([
      Math.round((lat * 1e-5) * 100000) / 100000,
      Math.round((lng * 1e-5) * 100000) / 100000,
    ]);
  }

  return coordinates;
}

/**
 * Calculates rectangular bounding box and geographic center for a set of points.
 */
export function computeMapBounds(points: LatLng[]): MapBounds {
  if (points.length === 0) {
    return {
      minLat: 0,
      maxLat: 0,
      minLng: 0,
      maxLng: 0,
      centerLat: 0,
      centerLng: 0,
    };
  }

  let minLat = points[0][0];
  let maxLat = points[0][0];
  let minLng = points[0][1];
  let maxLng = points[0][1];

  for (const [lat, lng] of points) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  const centerLat = Math.round(((minLat + maxLat) / 2) * 100000) / 100000;
  const centerLng = Math.round(((minLng + maxLng) / 2) * 100000) / 100000;

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    centerLat,
    centerLng,
  };
}

/**
 * Aggregates all club activities, decodes GPS polylines, and produces collective metrics.
 */
export function aggregateClubRoutes(activities: ActivityRouteInput[]): CollectiveRoutesResult {
  const routes: DecodedRoute[] = [];
  const allPoints: LatLng[] = [];
  let totalDistanceKm = 0;
  let totalElevationMeters = 0;

  for (const act of activities) {
    if (!act.summaryPolyline || act.activityType === "Virtual") continue;

    const coordinates = decodePolyline(act.summaryPolyline);
    if (coordinates.length === 0) continue;

    const distanceKm = Math.round((act.distanceMeters / 1000) * 10) / 10;
    totalDistanceKm += distanceKm;
    totalElevationMeters += act.elevationGainMeters;

    routes.push({
      activityId: act.id,
      athleteName: act.athleteName,
      activityName: act.name,
      distanceKm,
      elevationMeters: act.elevationGainMeters,
      coordinates,
    });

    for (const p of coordinates) {
      allPoints.push(p);
    }
  }

  const bounds = allPoints.length > 0 ? computeMapBounds(allPoints) : null;

  return {
    totalGpsRoutes: routes.length,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    totalElevationMeters,
    routes,
    allPoints,
    bounds,
  };
}

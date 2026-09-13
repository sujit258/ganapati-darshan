import { toMarathiNumber } from './marathiNumbers';

/**
 * Calculates distance in meters between two lat/lon coordinates using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance into natural Marathi representation:
 * e.g. < 1000m -> "४५० मीटर"
 * e.g. >= 1000m -> "१.२ किमी"
 */
export function formatMarathiDistance(meters: number): string {
  if (meters < 1000) {
    const roundedMeters = Math.round(meters / 10) * 10;
    return `${toMarathiNumber(roundedMeters)} मीटर`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${toMarathiNumber(km)} किमी`;
}

/**
 * Calculates estimated walking and driving minutes in Pune central area
 */
export function calculateTravelTimes(meters: number): {
  walkingMinutes: number;
  drivingMinutes: number;
} {
  // Walking speed in crowded Peth areas ~4 km/h (approx 66 meters/min)
  const walkingMinutes = Math.max(1, Math.round(meters / 66));

  // Driving / two-wheeler speed in Peth streets ~12 km/h (approx 200 meters/min)
  const drivingMinutes = Math.max(2, Math.round(meters / 200));

  return { walkingMinutes, drivingMinutes };
}

/**
 * Formats travel time estimates in Marathi
 * e.g. "🚶 १० मिनिटे / 🚗 ४ मिनिटे"
 */
export function formatMarathiTravelTime(
  walkingMinutes: number,
  drivingMinutes?: number
): string {
  const walkStr = `🚶 ${toMarathiNumber(walkingMinutes)} मिनिटे`;
  if (drivingMinutes && drivingMinutes > 0 && drivingMinutes < walkingMinutes) {
    return `${walkStr}  •  🚗 ${toMarathiNumber(drivingMinutes)} मिनिटे`;
  }
  return walkStr;
}

/**
 * Checks if coordinates are within the greater Pune area
 * (approx bounds 18.35°N to 18.68°N, 73.70°E to 73.98°E)
 */
export function isWithinPune(lat: number, lon: number): boolean {
  return lat >= 18.35 && lat <= 18.68 && lon >= 73.70 && lon <= 73.98;
}

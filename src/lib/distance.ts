import { toMarathiNumber } from './marathiNumbers';

/**
 * Centralized speed configurations (estimates in central Pune Peth areas)
 * Walking speed: approx 4.5 km/h (75 meters / minute)
 * Vehicle speed: approx 15 km/h (250 meters / minute) - estimate for Peth street traffic
 */
export const WALKING_SPEED_KMH = 4.5;
export const VEHICLE_SPEED_KMH = 15;

/**
 * Calculates straight-line distance in meters between two lat/lon coordinates using Haversine formula
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
 * Formats duration in minutes to natural Marathi duration:
 * ५ → ५ मिनिटे
 * ४५ → ४५ मिनिटे
 * ६० → १ तास
 * ७५ → १ तास १५ मिनिटे
 * १२५ → २ तास ५ मिनिटे
 * ० → ० मिनिटे
 */
export function formatDuration(minutes: number): string {
  const totalMins = Math.round(Math.max(0, minutes));
  if (totalMins === 0) {
    return `० मिनिटे`;
  }
  if (totalMins < 60) {
    return `${toMarathiNumber(totalMins)} मिनिटे`;
  }
  const hours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;

  if (remainingMins === 0) {
    return `${toMarathiNumber(hours)} तास`;
  }
  return `${toMarathiNumber(hours)} तास ${toMarathiNumber(remainingMins)} मिनिटे`;
}

/**
 * Calculates estimated walking and driving minutes based on configured speeds
 */
export function calculateTravelTimes(meters: number): {
  walkingMinutes: number;
  drivingMinutes: number;
} {
  const walkingMetersPerMin = (WALKING_SPEED_KMH * 1000) / 60; // 75 m/min
  const vehicleMetersPerMin = (VEHICLE_SPEED_KMH * 1000) / 60; // 250 m/min

  const walkingMinutes = Math.max(1, Math.round(meters / walkingMetersPerMin));
  const drivingMinutes = Math.max(1, Math.round(meters / vehicleMetersPerMin));

  return { walkingMinutes, drivingMinutes };
}

/**
 * Formats travel time estimates in Marathi for a specific leg or stop
 */
export function formatMarathiTravelTime(
  walkingMinutes: number,
  drivingMinutes?: number,
  mode: 'walking' | 'vehicle' = 'walking'
): string {
  if (mode === 'vehicle' && drivingMinutes !== undefined) {
    return `🚗 अंदाजे ${formatDuration(drivingMinutes)}`;
  }
  return `🚶 ${formatDuration(walkingMinutes)}`;
}

/**
 * Checks if coordinates are within the greater Pune area
 * (approx bounds 18.35°N to 18.68°N, 73.70°E to 73.98°E)
 */
export function isWithinPune(lat: number, lon: number): boolean {
  return lat >= 18.35 && lat <= 18.68 && lon >= 73.70 && lon <= 73.98;
}

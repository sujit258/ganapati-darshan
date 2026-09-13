import { Ganpati, DarshanStop, Coordinate, RouteSummary } from '@/types/ganpati';
import { GANPATIS } from '@/data/ganpatis';
import {
  calculateDistanceMeters,
  calculateTravelTimes,
  formatMarathiDistance,
  formatDuration,
} from './distance';

export interface RouteOptimizerOptions {
  userLocation: Coordinate;
  visitedIds?: Set<string>;
  forceTraditionalOrder?: boolean;
  startName?: string;
}

/**
 * Client-side Route Optimizer
 *
 * Nearest-Neighbor Greedy TSP heuristic from user coordinates
 * Modular architecture ready to plug in road routing providers later.
 */
export function calculateOptimalDarshanRoute(
  options: RouteOptimizerOptions
): DarshanStop[] {
  const {
    userLocation,
    visitedIds = new Set(),
    forceTraditionalOrder = false,
    startName = 'तुमच्या स्थानापासून',
  } = options;

  let orderedGanpatis: Ganpati[] = [];

  if (forceTraditionalOrder) {
    // Traditional order: 5 Manache Ganpatis strictly 1 to 5, followed by 4 Major Ganpatis
    orderedGanpatis = [...GANPATIS].sort((a, b) => {
      if (a.category === 'manache' && b.category === 'manache') {
        return (a.manacheRank || 0) - (b.manacheRank || 0);
      }
      if (a.category === 'manache') return -1;
      if (b.category === 'manache') return 1;
      return 0;
    });
  } else {
    // Nearest-Neighbor Greedy TSP heuristic from starting location
    const remaining = [...GANPATIS];
    let currentPoint: Coordinate = userLocation;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = calculateDistanceMeters(
          currentPoint.latitude,
          currentPoint.longitude,
          remaining[i].coordinates.latitude,
          remaining[i].coordinates.longitude
        );
        if (d < minDistance) {
          minDistance = d;
          nearestIndex = i;
        }
      }

      const nextGanpati = remaining.splice(nearestIndex, 1)[0];
      orderedGanpatis.push(nextGanpati);
      currentPoint = nextGanpati.coordinates;
    }
  }

  // Build DarshanStop objects with leg details and cumulative statistics
  let currentLoc = userLocation;
  let cumulativeDistance = 0;

  const stops: DarshanStop[] = orderedGanpatis.map((ganpati, index) => {
    const isVisited = visitedIds.has(ganpati.id);
    const dist = calculateDistanceMeters(
      currentLoc.latitude,
      currentLoc.longitude,
      ganpati.coordinates.latitude,
      ganpati.coordinates.longitude
    );

    cumulativeDistance += dist;
    const { walkingMinutes, drivingMinutes } = calculateTravelTimes(dist);

    // Update currentLoc to this Ganpati for the next stop's distance
    currentLoc = ganpati.coordinates;

    // Requirement 7: First stop says "तुमच्या स्थानापासून" (or preset name), subsequent says "मागील गणपतीपासून"
    const legLabel = index === 0 ? startName : 'मागील गणपतीपासून';
    const legDistanceFormatted = formatMarathiDistance(dist);

    return {
      ganpati,
      sequenceNumber: index + 1,
      distanceMeters: dist,
      cumulativeDistanceMeters: cumulativeDistance,
      walkingMinutes,
      drivingMinutes,
      isVisited,
      legLabel,
      legDistanceFormatted,
    };
  });

  return stops;
}

/**
 * Calculates complete planned route summary (Start -> all stops)
 * Independent of whether some stops have been marked visited.
 */
export function calculateRouteSummary(
  stops: DarshanStop[],
  startName: string = 'तुमचे सध्याचे स्थान'
): RouteSummary {
  const totalGanpatis = stops.length;
  const totalDistanceMeters = stops.reduce((sum, stop) => sum + stop.distanceMeters, 0);
  const totalDistanceFormatted = formatMarathiDistance(totalDistanceMeters);

  const { walkingMinutes, drivingMinutes } = calculateTravelTimes(totalDistanceMeters);

  return {
    startName,
    totalGanpatis,
    totalDistanceMeters,
    totalDistanceFormatted,
    estimatedWalkingMinutes: walkingMinutes,
    estimatedVehicleMinutes: drivingMinutes,
    formattedWalkingDuration: formatDuration(walkingMinutes),
    formattedVehicleDuration: formatDuration(drivingMinutes),
  };
}

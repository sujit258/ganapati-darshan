import { Ganpati, DarshanStop, Coordinate } from '@/types/ganpati';
import { GANPATIS } from '@/data/ganpatis';
import { calculateDistanceMeters, calculateTravelTimes } from './distance';

export interface RouteOptimizerOptions {
  userLocation: Coordinate;
  visitedIds?: Set<string>;
  forceTraditionalOrder?: boolean;
}

/**
 * Client-side Route Optimizer
 *
 * Algorithm:
 * - If forceTraditionalOrder is true:
 *   Follows the 5 Manache Ganpatis (1 to 5) then the 4 Major Ganpatis.
 * - Otherwise (Optimal Nearest-Neighbor / TSP heuristic):
 *   1. Starts from user's coordinates.
 *   2. Identifies all unvisited Ganpatis.
 *   3. Finds the nearest unvisited Ganpati from current point.
 *   4. Moves to that Ganpati, records step distance and times.
 *   5. Repeats until all Ganpatis are sequenced.
 *
 * This modular design allows swapping with a backend road-network or real-time traffic
 * routing API in future phases without affecting UI components.
 */
export function calculateOptimalDarshanRoute(
  options: RouteOptimizerOptions
): DarshanStop[] {
  const { userLocation, visitedIds = new Set(), forceTraditionalOrder = false } = options;

  let orderedGanpatis: Ganpati[] = [];

  if (forceTraditionalOrder) {
    // Traditional order: 5 Manache Ganpatis first (rank 1 to 5), then 4 Major Ganpatis
    orderedGanpatis = [...GANPATIS].sort((a, b) => {
      if (a.category === 'manache' && b.category === 'manache') {
        return (a.manacheRank || 0) - (b.manacheRank || 0);
      }
      if (a.category === 'manache') return -1;
      if (b.category === 'manache') return 1;
      return 0;
    });
  } else {
    // Nearest-Neighbor Greedy TSP heuristic from user coordinates
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

  // Build DarshanStop objects with distances and travel times
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

    // Update currentLoc to this Ganpati for subsequent stop distance
    currentLoc = ganpati.coordinates;

    return {
      ganpati,
      sequenceNumber: index + 1,
      distanceMeters: dist,
      cumulativeDistanceMeters: cumulativeDistance,
      walkingMinutes,
      drivingMinutes,
      isVisited,
    };
  });

  return stops;
}

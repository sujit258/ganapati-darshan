export type GanpatiCategory = 'manache' | 'pramukh';

export type TravelMode = 'walking' | 'vehicle';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Ganpati {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: GanpatiCategory;
  categoryLabel: string; // "मानाचा गणपती" | "प्रमुख गणपती"
  manacheRank?: number; // 1 to 5 for Manache Ganpati
  establishedYear: number | string;
  address: string;
  area: string;
  coordinates: Coordinate;
  image: string;
  description: string;
  history: string;
  significance: string;
  specialFeatures?: string[];
  tags: string[];
}

export interface DarshanStop {
  ganpati: Ganpati;
  sequenceNumber: number; // 1-based index (e.g. 1 for 1st stop)
  distanceMeters: number; // distance from previous stop or current user location
  cumulativeDistanceMeters: number;
  walkingMinutes: number;
  drivingMinutes: number;
  isVisited: boolean;
  legLabel: string; // e.g. "तुमच्या स्थानापासून" vs "मागील गणपतीपासून"
  legDistanceFormatted: string; // e.g. "६५० मीटर" or "१.२ किमी"
}

export interface VehicleAccessPoint {
  id: string;
  name: string;
  shortName: string;
  area: string;
  description: string;
  coordinates: Coordinate;
}

export interface VehicleApproachInfo {
  accessPoint: VehicleAccessPoint;
  distanceMeters: number;
  distanceFormatted: string;
  durationMinutes: number;
  durationFormatted: string;
}

export interface RouteSummary {
  startName: string;
  totalGanpatis: number;
  totalDistanceMeters: number;
  totalDistanceFormatted: string;
  estimatedWalkingMinutes: number;
  estimatedVehicleMinutes: number;
  formattedWalkingDuration: string;
  formattedVehicleDuration: string;
  // Multi-modal vehicle mode fields
  vehicleApproach?: VehicleApproachInfo;
  walkingOnlyDistanceMeters?: number;
  walkingOnlyDistanceFormatted?: string;
  walkingOnlyMinutes?: number;
  walkingOnlyDurationFormatted?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  isPreset?: boolean;
  presetName?: string;
}

export type LocationPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';

export type DekhavaCategory = 'manache' | 'pramukh' | 'itar';

export interface Dekhava {
  id: string;
  ganpatiSlug?: string;
  ganpatiName: string;
  title: string;
  description?: string;
  imageSrc?: string;
  altText?: string;
  year: number;
  location?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  category?: DekhavaCategory;
  verified?: boolean;
}

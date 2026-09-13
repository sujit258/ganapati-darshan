export type GanpatiCategory = 'manache' | 'pramukh';

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

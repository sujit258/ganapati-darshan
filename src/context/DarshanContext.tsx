'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  DarshanStop,
  UserLocation,
  LocationPermissionStatus,
  TravelMode,
  RouteSummary,
} from '@/types/ganpati';
import { GANPATIS, PRESET_START_LOCATIONS } from '@/data/ganpatis';
import { calculateOptimalDarshanRoute, calculateRouteSummary } from '@/lib/routeOptimizer';
import { isWithinPune } from '@/lib/distance';

interface DarshanContextType {
  userLocation: UserLocation | null;
  isRealLocation: boolean;
  permissionStatus: LocationPermissionStatus;
  isOutsidePune: boolean;
  routeStops: DarshanStop[];
  routeSummary: RouteSummary;
  visitedIds: Set<string>;
  isTraditionalMode: boolean;
  travelMode: TravelMode;
  setTravelMode: (mode: TravelMode) => void;
  isPlanningMode: boolean;
  setIsPlanningMode: (val: boolean) => void;
  startDarshan: () => void;
  currentStop: DarshanStop | null;
  nextStop: DarshanStop | null;
  visitedCount: number;
  totalCount: number;
  isCompleted: boolean;
  isLoadingLocation: boolean;
  locationError: string | null;
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
  requestLocation: () => Promise<boolean>;
  setPresetLocation: (presetId: string) => void;
  toggleTraditionalMode: () => void;
  markAsVisited: (id: string) => void;
  unmarkVisited: (id: string) => void;
  toggleVisited: (id: string) => void;
  resetProgress: () => void;
}

const DarshanContext = createContext<DarshanContextType | null>(null);

const STORAGE_KEY_V2 = 'pune_ganpati_darshan_v2';
const LEGACY_KEYS = {
  VISITED: 'pune_ganpati_visited_v1',
  LOCATION: 'pune_ganpati_location_v1',
  MODE: 'pune_ganpati_mode_v1',
};

// Default fallback starting point: Shaniwar Wada
const DEFAULT_COORDINATES = {
  latitude: 18.519572,
  longitude: 73.855324,
  isPreset: true,
  presetName: 'शनिवार वाडा',
};

export const DarshanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTraditionalMode, setIsTraditionalMode] = useState<boolean>(false);
  const [travelMode, setTravelModeState] = useState<TravelMode>('walking');
  const [isPlanningMode, setIsPlanningMode] = useState<boolean>(true);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load state from localStorage on mount (supporting v2 and migrating from v1)
  useEffect(() => {
    try {
      const v2Data = localStorage.getItem(STORAGE_KEY_V2);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        if (Array.isArray(parsed.visitedIds)) {
          setVisitedIds(new Set(parsed.visitedIds));
          if (parsed.visitedIds.length > 0) {
            setIsPlanningMode(false);
          }
        }
        if (parsed.userLocation && typeof parsed.userLocation.latitude === 'number') {
          const isPreset = Boolean(parsed.userLocation.isPreset);
          const LOCATION_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes freshness
          const isFresh =
            typeof parsed.userLocation.timestamp === 'number' &&
            Date.now() - parsed.userLocation.timestamp < LOCATION_MAX_AGE_MS;

          if (isPreset) {
            setUserLocation(parsed.userLocation);
            setPermissionStatus('granted');
          } else if (isFresh) {
            setUserLocation(parsed.userLocation);
            setPermissionStatus('granted');
          } else {
            // Stale GPS coordinates: reset so we do not show outdated distance
            setUserLocation(null);
            setPermissionStatus('prompt');
          }
        }
        if (parsed.travelMode === 'walking' || parsed.travelMode === 'vehicle') {
          setTravelModeState(parsed.travelMode);
        }
        if (typeof parsed.isTraditionalMode === 'boolean') {
          setIsTraditionalMode(parsed.isTraditionalMode);
        }
        if (typeof parsed.isPlanningMode === 'boolean' && (!parsed.visitedIds || parsed.visitedIds.length === 0)) {
          setIsPlanningMode(parsed.isPlanningMode);
        }
      } else {
        // Fallback to legacy v1
        const storedVisited = localStorage.getItem(LEGACY_KEYS.VISITED);
        if (storedVisited) {
          const parsed = JSON.parse(storedVisited);
          if (Array.isArray(parsed)) {
            setVisitedIds(new Set(parsed));
            if (parsed.length > 0) {
              setIsPlanningMode(false);
            }
          }
        }

        const storedLocation = localStorage.getItem(LEGACY_KEYS.LOCATION);
        if (storedLocation) {
          const parsedLoc = JSON.parse(storedLocation);
          if (parsedLoc && typeof parsedLoc.latitude === 'number' && parsedLoc.isPreset) {
            setUserLocation(parsedLoc);
            setPermissionStatus('granted');
          }
        }

        const storedMode = localStorage.getItem(LEGACY_KEYS.MODE);
        if (storedMode) {
          setIsTraditionalMode(storedMode === 'traditional');
        }
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to localStorage v2
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload = {
        visitedIds: Array.from(visitedIds),
        userLocation,
        travelMode,
        isTraditionalMode,
        isPlanningMode,
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [visitedIds, userLocation, travelMode, isTraditionalMode, isPlanningMode, isInitialized]);

  // Set travel mode without regenerating the route order
  const setTravelMode = useCallback((mode: TravelMode) => {
    setTravelModeState(mode);
  }, []);

  // Enter active darshan mode from planning screen
  const startDarshan = useCallback(() => {
    setIsPlanningMode(false);
  }, []);

  // Check if current location is outside Pune
  const isOutsidePune = useMemo(() => {
    if (!userLocation || userLocation.isPreset) return false;
    return !isWithinPune(userLocation.latitude, userLocation.longitude);
  }, [userLocation]);

  // Request browser geolocation
  const requestLocation = useCallback(async (): Promise<boolean> => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setPermissionStatus('unavailable');
      setLocationError('तुमच्या ब्राउझरमध्ये स्थान शोधण्याची सुविधा उपलब्ध नाही.');
      setIsLoadingLocation(false);
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            isPreset: false,
          };
          setUserLocation(newLoc);
          setPermissionStatus('granted');
          setIsLoadingLocation(false);
          setShowPermissionModal(false);
          resolve(true);
        },
        (error) => {
          setIsLoadingLocation(false);
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionStatus('denied');
            setLocationError('स्थानाची परवानगी नाकारण्यात आली. तुम्ही खालीलपैकी एका ठिकाणावरून सुरू करू शकता.');
          } else {
            setPermissionStatus('unavailable');
            setLocationError('सध्याचे स्थान शोधण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.');
          }
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  // Set preset location (Shaniwar Wada, Pune Station, etc.)
  const setPresetLocation = useCallback((presetId: string) => {
    const found = PRESET_START_LOCATIONS.find((p) => p.id === presetId);
    if (found) {
      const loc: UserLocation = {
        latitude: found.latitude,
        longitude: found.longitude,
        isPreset: true,
        presetName: found.name,
        timestamp: Date.now(),
      };
      setUserLocation(loc);
      setPermissionStatus('granted');
      setShowPermissionModal(false);
    }
  }, []);

  const toggleTraditionalMode = useCallback(() => {
    setIsTraditionalMode((prev) => !prev);
  }, []);

  // Mark a Ganpati as visited
  const markAsVisited = useCallback((id: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Unmark a Ganpati
  const unmarkVisited = useCallback((id: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleVisited = useCallback((id: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Reset entire darshan progress
  const resetProgress = useCallback(() => {
    setVisitedIds(new Set());
    setIsPlanningMode(true);
  }, []);

  // Check whether current userLocation is a real, fresh GPS location
  const isRealLocation = useMemo(() => {
    if (!userLocation || userLocation.isPreset) return false;
    const LOCATION_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes freshness
    if (userLocation.timestamp && Date.now() - userLocation.timestamp > LOCATION_MAX_AGE_MS) {
      return false;
    }
    return true;
  }, [userLocation]);

  // Compute active coordinates and start name
  const activeCoordinates = userLocation || DEFAULT_COORDINATES;
  const startDisplayName = userLocation?.presetName || (isRealLocation ? 'तुमचे सध्याचे स्थान' : 'शनिवार वाडा');
  const startLegName = userLocation?.presetName
    ? `${userLocation.presetName} येथून`
    : isRealLocation
    ? 'तुमच्या स्थानापासून'
    : 'शनिवार वाड्यापासून';

  // Compute the darshan route dynamically
  const routeStops = useMemo(() => {
    return calculateOptimalDarshanRoute({
      userLocation: {
        latitude: activeCoordinates.latitude,
        longitude: activeCoordinates.longitude,
      },
      visitedIds,
      forceTraditionalOrder: isTraditionalMode,
      startName: startLegName,
    });
  }, [activeCoordinates, visitedIds, isTraditionalMode, startLegName]);

  // Compute full day's route summary (Start -> all 9 Ganpatis)
  const routeSummary = useMemo(() => {
    return calculateRouteSummary(routeStops, startDisplayName);
  }, [routeStops, startDisplayName]);

  // Current target stop (the first unvisited stop in sequence)
  const currentStop = useMemo(() => {
    return routeStops.find((stop) => !visitedIds.has(stop.ganpati.id)) || null;
  }, [routeStops, visitedIds]);

  // Next stop after current
  const nextStop = useMemo(() => {
    if (!currentStop) return null;
    const currentIndex = routeStops.findIndex((s) => s.ganpati.id === currentStop.ganpati.id);
    if (currentIndex >= 0 && currentIndex < routeStops.length - 1) {
      return routeStops[currentIndex + 1];
    }
    return null;
  }, [routeStops, currentStop]);

  const visitedCount = visitedIds.size;
  const totalCount = GANPATIS.length;
  const isCompleted = visitedCount >= totalCount && totalCount > 0;

  return (
    <DarshanContext.Provider
      value={{
        userLocation,
        isRealLocation,
        permissionStatus,
        isOutsidePune,
        routeStops,
        routeSummary,
        visitedIds,
        isTraditionalMode,
        travelMode,
        setTravelMode,
        isPlanningMode,
        setIsPlanningMode,
        startDarshan,
        currentStop,
        nextStop,
        visitedCount,
        totalCount,
        isCompleted,
        isLoadingLocation,
        locationError,
        showPermissionModal,
        setShowPermissionModal,
        requestLocation,
        setPresetLocation,
        toggleTraditionalMode,
        markAsVisited,
        unmarkVisited,
        toggleVisited,
        resetProgress,
      }}
    >
      {children}
    </DarshanContext.Provider>
  );
};

export const useDarshan = () => {
  const context = useContext(DarshanContext);
  if (!context) {
    throw new Error('useDarshan must be used within a DarshanProvider');
  }
  return context;
};

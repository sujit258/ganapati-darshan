'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DarshanStop, UserLocation, LocationPermissionStatus } from '@/types/ganpati';
import { GANPATIS, PRESET_START_LOCATIONS } from '@/data/ganpatis';
import { calculateOptimalDarshanRoute } from '@/lib/routeOptimizer';
import { isWithinPune } from '@/lib/distance';

interface DarshanContextType {
  userLocation: UserLocation | null;
  permissionStatus: LocationPermissionStatus;
  isOutsidePune: boolean;
  routeStops: DarshanStop[];
  visitedIds: Set<string>;
  isTraditionalMode: boolean;
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

const STORAGE_KEYS = {
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
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedVisited = localStorage.getItem(STORAGE_KEYS.VISITED);
      if (storedVisited) {
        const parsed = JSON.parse(storedVisited);
        if (Array.isArray(parsed)) {
          setVisitedIds(new Set(parsed));
        }
      }

      const storedLocation = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (storedLocation) {
        const parsedLoc = JSON.parse(storedLocation);
        if (parsedLoc && typeof parsedLoc.latitude === 'number') {
          setUserLocation(parsedLoc);
          setPermissionStatus('granted');
        }
      }

      const storedMode = localStorage.getItem(STORAGE_KEYS.MODE);
      if (storedMode) {
        setIsTraditionalMode(storedMode === 'traditional');
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync visited to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VISITED, JSON.stringify(Array.from(visitedIds)));
    } catch (e) {
      console.error('Failed to save visited to localStorage', e);
    }
  }, [visitedIds, isInitialized]);

  // Sync mode to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, isTraditionalMode ? 'traditional' : 'optimal');
    } catch (e) {
      console.error('Failed to save mode to localStorage', e);
    }
  }, [isTraditionalMode, isInitialized]);

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
          try {
            localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(newLoc));
          } catch (e) {
            // ignore storage error
          }
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
      };
      setUserLocation(loc);
      setPermissionStatus('granted');
      setShowPermissionModal(false);
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
      } catch (e) {}
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
    try {
      localStorage.removeItem(STORAGE_KEYS.VISITED);
    } catch (e) {}
  }, []);

  // Compute the darshan route dynamically
  const activeCoordinates = userLocation || DEFAULT_COORDINATES;

  const routeStops = useMemo(() => {
    return calculateOptimalDarshanRoute({
      userLocation: {
        latitude: activeCoordinates.latitude,
        longitude: activeCoordinates.longitude,
      },
      visitedIds,
      forceTraditionalOrder: isTraditionalMode,
    });
  }, [activeCoordinates, visitedIds, isTraditionalMode]);

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
        permissionStatus,
        isOutsidePune,
        routeStops,
        visitedIds,
        isTraditionalMode,
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

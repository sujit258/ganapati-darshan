'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Compass,
  Map,
  RotateCcw,
  SlidersHorizontal,
  Navigation,
  AlertTriangle,
} from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { CurrentDarshanCard } from '@/components/CurrentDarshanCard';
import { DarshanCard } from '@/components/DarshanCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CompletionCard } from '@/components/CompletionCard';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';
import { PRESET_START_LOCATIONS } from '@/data/ganpatis';

export default function DarshanPage() {
  const {
    userLocation,
    permissionStatus,
    isOutsidePune,
    routeStops,
    currentStop,
    nextStop,
    visitedCount,
    totalCount,
    isCompleted,
    isTraditionalMode,
    toggleTraditionalMode,
    resetProgress,
    showPermissionModal,
    setShowPermissionModal,
    requestLocation,
    setPresetLocation,
    isLoadingLocation,
  } = useDarshan();

  // If user enters without having set location, open prompt
  useEffect(() => {
    if (!userLocation && permissionStatus === 'prompt') {
      setShowPermissionModal(true);
    }
  }, [userLocation, permissionStatus, setShowPermissionModal]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Location Modal */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      {/* Outside Pune notice banner */}
      {isOutsidePune && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">📍 तुम्ही सध्या पुण्याच्या बाहेर आहात असे दिसते.</p>
            <p className="text-amber-800">
              पुण्यातील दर्शनासाठी शनिवार वाड्यापासून किंवा रेल्वे स्टेशनवरून सुचवलेला क्रम खाली दाखवला आहे.
            </p>
          </div>
        </div>
      )}

      {/* Location Prompt Banner if not granted yet */}
      {!userLocation && (
        <div className="bg-white rounded-2xl border-2 border-saffron-300 p-4 shadow-soft space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                तुमच्या स्थानानुसार क्रम मिळवा
              </h2>
              <p className="text-xs text-slate-500">
                जवळचा आणि सोपा मार्ग तयार करण्यासाठी स्थान आवश्यक आहे
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLoadingLocation}
              className="flex-1 py-2.5 px-3 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Navigation size={14} />
              <span>सध्याचे स्थान द्या</span>
            </button>

            <button
              type="button"
              onClick={() => setPresetLocation('shaniwar-wada')}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              शनिवार वाडा
            </button>
          </div>
        </div>
      )}

      {/* Page Title & Controls */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              🙏 तुमचा दर्शन क्रम
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isTraditionalMode
                ? '५ मानाच्या गणपतींचा पारंपरिक क्रम'
                : userLocation?.presetName
                ? `${userLocation.presetName} येथून सुचवलेला क्रम`
                : userLocation
                ? 'तुमच्या सध्याच्या स्थानानुसार सुचवलेला क्रम'
                : 'सुचवलेला दर्शन क्रम (मध्यवर्ती पुणे)'}
            </p>
          </div>

          {/* Quick Actions: Map & Reset */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/nakasha"
              className="p-2 rounded-xl border border-border bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="नकाशावर पहा"
            >
              <Map size={15} className="text-saffron-600" />
              <span className="text-[11px] font-bold">नकाशा</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowPermissionModal(true)}
              className="p-2 rounded-xl border border-border bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="स्थान बदला"
            >
              <MapPin size={15} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-border p-3.5 shadow-soft">
          <ProgressBar completed={visitedCount} total={totalCount} />
        </div>

        {/* Mode Switcher: Optimal vs Traditional */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="text-slate-500 font-medium">
            क्रम प्रकार: <strong className="text-slate-700 font-bold">{isTraditionalMode ? 'पारंपरिक (१ ते ५)' : 'कमी चालण्याचा (जवळचा आधी)'}</strong>
          </span>
          <button
            type="button"
            onClick={toggleTraditionalMode}
            className="text-saffron-700 hover:text-saffron-800 font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={12} />
            <span>{isTraditionalMode ? 'स्थानानुसार बदला' : 'पारंपरिक क्रम पहा'}</span>
          </button>
        </div>
      </div>

      {/* Completion or Active Destination Card */}
      {isCompleted ? (
        <CompletionCard />
      ) : currentStop ? (
        <div className="space-y-1.5">
          <CurrentDarshanCard stop={currentStop} nextStop={nextStop} />
        </div>
      ) : null}

      {/* Full Sequence List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🗺️</span>
            <span>संपूर्ण दर्शन यादी</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {routeStops.length} गणपती
          </span>
        </div>

        <div className="space-y-3">
          {routeStops.map((stop) => {
            const isCurrent = currentStop?.ganpati.id === stop.ganpati.id;
            return (
              <DarshanCard
                key={stop.ganpati.id}
                stop={stop}
                isCurrentTarget={isCurrent}
              />
            );
          })}
        </div>
      </div>

      {/* Reset progress button if some are visited */}
      {visitedCount > 0 && !isCompleted && (
        <div className="text-center pt-2 pb-6">
          <button
            type="button"
            onClick={resetProgress}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <RotateCcw size={13} />
            <span>दर्शन प्रगती पुन्हा नव्याने सुरू करा</span>
          </button>
        </div>
      )}
    </div>
  );
}

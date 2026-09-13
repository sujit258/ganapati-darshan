'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Map,
  RotateCcw,
  SlidersHorizontal,
  Navigation,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { DarshanPlan } from '@/components/DarshanPlan';
import { RouteSummary } from '@/components/RouteSummary';
import { CurrentDarshanCard } from '@/components/CurrentDarshanCard';
import { DarshanCard } from '@/components/DarshanCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CompletionCard } from '@/components/CompletionCard';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';
import { toMarathiNumber } from '@/lib/marathiNumbers';

export default function DarshanPage() {
  const {
    userLocation,
    permissionStatus,
    isOutsidePune,
    routeStops,
    routeSummary,
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
    travelMode,
    setTravelMode,
    isPlanningMode,
    setIsPlanningMode,
  } = useDarshan();

  // If user enters without having set location, prompt for permission
  useEffect(() => {
    if (!userLocation && permissionStatus === 'prompt') {
      setShowPermissionModal(true);
    }
  }, [userLocation, permissionStatus, setShowPermissionModal]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
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
              पुण्यातील दर्शनासाठी शनिवार वाड्यापासून किंवा रेल्वे स्टेशनवरून सुचवलेला मार्ग खाली दाखवला आहे.
            </p>
          </div>
        </div>
      )}

      {/* RENDER PLANNER VIEW */}
      {isPlanningMode ? (
        <DarshanPlan
          onStartDarshan={() => setIsPlanningMode(false)}
          onSwitchToActive={() => setIsPlanningMode(false)}
        />
      ) : (
        /* RENDER ACTIVE DARSHAN VIEW */
        <div className="space-y-4 pb-12">
          {/* Active Header & Navigation Controls */}
          <div className="bg-white rounded-2xl border border-border p-4 shadow-soft space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-50 text-saffron-800 border border-saffron-200 mb-1">
                  <span>🪔</span>
                  <span>दर्शन सुरू आहे</span>
                  <span>•</span>
                  <span>
                    {toMarathiNumber(visitedCount)} / {toMarathiNumber(totalCount)} पूर्ण
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                  🙏 चालू गणपती दर्शन
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {currentStop
                    ? `पुढील दर्शन: ${currentStop.ganpati.name}`
                    : 'सर्व गणपतींचे दर्शन संपन्न झाले आहे'}
                </p>
              </div>

              {/* Action Buttons: Plan Overview & Map */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlanningMode(true)}
                  className="py-1.5 px-2.5 rounded-xl border border-saffron-300 bg-saffron-50 hover:bg-saffron-100 text-saffron-800 text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  title="आजचा संपूर्ण प्लॅन पहा"
                >
                  <ClipboardList size={14} className="text-saffron-700" />
                  <span>प्लॅन पहा</span>
                </button>

                <Link
                  href="/nakasha"
                  className="p-2 rounded-xl border border-border bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  title="नकाशावर पहा"
                >
                  <Map size={15} className="text-saffron-600" />
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
            <ProgressBar completed={visitedCount} total={totalCount} />
          </div>

          {/* Route Summary Overview Card */}
          <RouteSummary
            summary={routeSummary}
            travelMode={travelMode}
            onSelectMode={setTravelMode}
          />

          {/* Traditional mode vs Optimal mode indicator & switch */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 font-medium">
              मार्ग प्रकार:{' '}
              <strong className="text-slate-700 font-bold">
                {isTraditionalMode ? 'पारंपरिक (मानाचे १ ते ५)' : 'कमी चालण्याचा (जवळचा आधी)'}
              </strong>
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

          {/* Current Stop or Completion Card */}
          {isCompleted ? (
            <CompletionCard />
          ) : currentStop ? (
            <div className="space-y-1.5">
              <CurrentDarshanCard stop={currentStop} nextStop={nextStop} />
            </div>
          ) : null}

          {/* Full Stops Sequence */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🗺️</span>
                <span>संपूर्ण दर्शन यादी</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {toMarathiNumber(routeStops.length)} गणपती
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

          {/* Bottom actions: Back to Plan & Reset */}
          <div className="flex flex-col items-center gap-3 pt-3 pb-8">
            <button
              type="button"
              onClick={() => setIsPlanningMode(true)}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ClipboardList size={15} />
              <span>आजचा संपूर्ण दर्शन प्लॅन पुन्हा पहा</span>
            </button>

            {visitedCount > 0 && !isCompleted && (
              <button
                type="button"
                onClick={resetProgress}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} />
                <span>दर्शन प्रगती पुन्हा नव्याने सुरू करा</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

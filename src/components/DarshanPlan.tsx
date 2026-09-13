'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Footprints,
  Car,
  Ruler,
  Clock,
  Navigation,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { GanpatiImage } from '@/components/GanpatiImage';
import { toMarathiNumber, toMarathiOrdinal } from '@/lib/marathiNumbers';
import { formatDuration } from '@/lib/distance';
import { PRESET_START_LOCATIONS } from '@/data/ganpatis';

interface DarshanPlanProps {
  onStartDarshan?: () => void;
  onSwitchToActive?: () => void;
}

export const DarshanPlan: React.FC<DarshanPlanProps> = ({
  onStartDarshan,
  onSwitchToActive,
}) => {
  const {
    routeStops,
    routeSummary,
    travelMode,
    setTravelMode,
    startDarshan,
    userLocation,
    requestLocation,
    isLoadingLocation,
    setShowPermissionModal,
    setPresetLocation,
    visitedCount,
    isTraditionalMode,
    toggleTraditionalMode,
    currentStop,
  } = useDarshan();

  const handleStart = () => {
    startDarshan();
    if (onStartDarshan) {
      onStartDarshan();
    }
  };

  const activeDuration =
    travelMode === 'walking'
      ? routeSummary.formattedWalkingDuration
      : routeSummary.formattedVehicleDuration;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Header & Title */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-soft">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 bg-saffron-50 px-2.5 py-0.5 rounded-full mb-1.5 border border-saffron-200">
              <span>🙏</span>
              <span>आजचा दर्शन प्लॅन</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
              पुणे गणपती दर्शन मार्ग
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTraditionalMode
                ? '५ मानाच्या गणपतींचा पारंपरिक दर्शन मार्ग'
                : 'तुमच्या स्थानानुसार सर्वात सोपा व कमी चालण्याचा मार्ग'}
            </p>
          </div>

          {/* If user already started darshan, quick shortcut back */}
          {visitedCount > 0 && onSwitchToActive && (
            <button
              type="button"
              onClick={onSwitchToActive}
              className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-sm flex items-center gap-1 shrink-0 active:scale-95 transition-all"
            >
              <span>चालू दर्शन</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Start Location Banner */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={15} className="text-saffron-600 shrink-0" />
            <span className="text-slate-500 shrink-0">सुरुवात:</span>
            <span className="font-bold text-slate-900 truncate">
              {routeSummary.startName}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLoadingLocation}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-saffron-700 hover:bg-saffron-50 active:scale-95 transition-all"
              title="सध्याचे स्थान पुन्हा शोधा"
            >
              {isLoadingLocation ? 'शोधत आहे...' : '📍 स्थान पुन्हा शोधा'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setShowPermissionModal(true)}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              बदला
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (Start, Count, Total Distance, Estimated Time) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Start point */}
        <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <MapPin size={13} className="text-saffron-600 shrink-0" />
            <span>सुरुवात</span>
          </div>
          <div className="text-xs font-bold text-slate-900 line-clamp-1">
            {routeSummary.startName}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">प्रस्थान स्थान</span>
        </div>

        {/* Ganpatis count */}
        <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <span>🪔</span>
            <span>गणपती</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {toMarathiNumber(routeSummary.totalGanpatis)}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">५ मानाचे + ४ प्रमुख</span>
        </div>

        {/* Total distance */}
        <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Ruler size={13} className="text-slate-500 shrink-0" />
            <span>एकूण अंतर</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {routeSummary.totalDistanceFormatted}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">(अंदाजे अंतर)</span>
        </div>

        {/* Estimated duration */}
        <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between ring-1 ring-saffron-300/80 bg-saffron-50/30">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Clock size={13} className="text-saffron-600 shrink-0" />
            <span>अंदाजे वेळ</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {activeDuration}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {travelMode === 'walking' ? 'पायी (अंदाजे)' : 'वाहनाने (अंदाजे)'}
          </span>
        </div>
      </div>

      {/* 3. Travel Mode Selector (Segmented Control) */}
      <div className="bg-white rounded-2xl border border-border p-3.5 shadow-soft space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">दर्शनाचा प्रकार निवडा:</span>
          <span className="text-[11px] text-slate-500">
            {travelMode === 'walking' ? '🚶 पायी चालण्याचा वेग ~४.५ किमी/तास' : '🚗 वाहनाचा वेग ~१५ किमी/तास'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setTravelMode('walking')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              travelMode === 'walking'
                ? 'bg-white text-saffron-700 shadow-sm ring-1 ring-saffron-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Footprints size={16} className={travelMode === 'walking' ? 'text-saffron-600' : 'text-slate-400'} />
            <span>🚶 पायी ({routeSummary.formattedWalkingDuration})</span>
          </button>

          <button
            type="button"
            onClick={() => setTravelMode('vehicle')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              travelMode === 'vehicle'
                ? 'bg-white text-saffron-700 shadow-sm ring-1 ring-saffron-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car size={16} className={travelMode === 'vehicle' ? 'text-saffron-600' : 'text-slate-400'} />
            <span>🚗 वाहनाने ({routeSummary.formattedVehicleDuration})</span>
          </button>
        </div>

        {/* Order toggle: Optimal vs Traditional 5 Manache */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            क्रम:{' '}
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
      </div>

      {/* 4. Step-by-Step Route Timeline */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-soft space-y-1">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🗺️</span>
            <span>सुचवलेला टप्पा-टप्प्याचा मार्ग</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {toMarathiNumber(routeStops.length)} टप्पे
          </span>
        </div>

        <div className="pt-3 relative">
          {/* Starting Node */}
          <div className="flex items-start gap-3 relative pb-2">
            <div className="w-8 h-8 rounded-full bg-saffron-600 text-white flex items-center justify-center shrink-0 shadow-sm ring-4 ring-saffron-100">
              <MapPin size={16} />
            </div>
            <div className="flex-1 pt-1 min-w-0">
              <div className="text-[11px] font-semibold text-saffron-700 uppercase tracking-wide">
                सुरुवात
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                📍 {routeSummary.startName}
              </div>
              <div className="text-[11px] text-slate-500">
                येथून पहिले दर्शन सुरू होईल
              </div>
            </div>
          </div>

          {/* Stops Timeline */}
          {routeStops.map((stop, index) => {
            const isVisited = stop.isVisited;
            const isCurrentTarget = currentStop?.ganpati.id === stop.ganpati.id;
            const legTime =
              travelMode === 'walking'
                ? `${toMarathiNumber(stop.walkingMinutes)} मिनिटे`
                : `${toMarathiNumber(stop.drivingMinutes)} मिनिटे (अंदाजे)`;

            return (
              <React.Fragment key={stop.ganpati.id}>
                {/* Connector Leg between nodes */}
                <div className="flex items-center gap-3 my-1">
                  <div className="w-8 flex justify-center shrink-0">
                    <div className="w-0.5 h-10 bg-gradient-to-b from-saffron-300 via-amber-300 to-saffron-300" />
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
                    <span className="text-saffron-600 font-bold">↓</span>
                    <span className="font-bold text-slate-800">
                      {stop.legDistanceFormatted}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{legTime}</span>
                  </div>
                </div>

                {/* Ganpati Stop Node */}
                <div
                  className={`flex items-start gap-3 p-2.5 rounded-2xl border transition-all ${
                    isVisited
                      ? 'bg-slate-50/70 border-slate-200 opacity-75'
                      : isCurrentTarget
                      ? 'bg-saffron-50/40 border-saffron-400 ring-1 ring-saffron-300'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {/* Sequence number icon / thumbnail */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-slate-100 relative">
                      <GanpatiImage
                        src={stop.ganpati.image}
                        alt={stop.ganpati.name}
                        fill
                        className={`object-cover ${isVisited ? 'grayscale-[50%]' : ''}`}
                        sizes="48px"
                      />
                    </div>
                    <span
                      className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs ${
                        isVisited
                          ? 'bg-emerald-600 text-white'
                          : isCurrentTarget
                          ? 'bg-saffron-600 text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {toMarathiNumber(stop.sequenceNumber)}
                    </span>
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-saffron-700">
                        {toMarathiOrdinal(stop.sequenceNumber)} दर्शन
                      </span>
                      {isVisited ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ पूर्ण
                        </span>
                      ) : isCurrentTarget ? (
                        <span className="text-[10px] font-bold text-saffron-800 bg-saffron-100 px-2 py-0.5 rounded-full">
                          पुढील दर्शन
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      🪔 {stop.ganpati.name}
                    </h3>

                    <div className="text-[11px] text-slate-500 truncate">
                      {stop.ganpati.categoryLabel} • {stop.ganpati.area}
                    </div>

                    {/* Leg distance label */}
                    <div className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                      <span className="text-slate-400">📍</span>
                      <span>{stop.legLabel}:</span>
                      <strong className="text-slate-800">{stop.legDistanceFormatted}</strong>
                    </div>
                  </div>

                  {/* Info Link */}
                  <Link
                    href={`/ganpati/${stop.ganpati.slug}`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 shrink-0 self-center"
                    title="माहिती पहा"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 5. Sticky Bottom Action Bar with Primary CTA */}
      <div className="fixed bottom-14 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg z-30 flex justify-center">
        <div className="w-full max-w-md flex items-center gap-2">
          {visitedCount > 0 && onSwitchToActive && (
            <button
              type="button"
              onClick={onSwitchToActive}
              className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shrink-0 transition-all active:scale-[0.98]"
            >
              <span>दर्शन चालू आहे</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="flex-1 py-3 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>🙏</span>
            <span>{visitedCount > 0 ? 'दर्शन सुरू ठेवा' : 'दर्शन सुरू करा'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

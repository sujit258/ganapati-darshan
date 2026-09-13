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
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { GanpatiImage } from '@/components/GanpatiImage';
import { toMarathiNumber, toMarathiOrdinal } from '@/lib/marathiNumbers';
import { getDirectionsUrl } from '@/lib/maps';

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
    vehicleAccessPoints,
    selectedAccessPoint,
    selectedAccessPointId,
    setSelectedAccessPointId,
    recommendedAccessPoint,
    vehicleApproach,
    startDarshan,
    userLocation,
    isRealLocation,
    requestLocation,
    isLoadingLocation,
    setShowPermissionModal,
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

  const isVehicleMode = travelMode === 'vehicle' && vehicleApproach !== null;

  const accessPointDirectionsUrl = getDirectionsUrl(
    selectedAccessPoint.coordinates.latitude,
    selectedAccessPoint.coordinates.longitude,
    isRealLocation ? userLocation?.latitude : undefined,
    isRealLocation ? userLocation?.longitude : undefined,
    'vehicle'
  );

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
              {travelMode === 'vehicle'
                ? 'वाहनाने मध्यवर्ती भागापर्यंत → पुढे सर्व गणपती दर्शन पायी'
                : isTraditionalMode
                ? '५ मानाच्या गणपतींचा पारंपरिक दर्शन मार्ग (पायी)'
                : 'तुमच्या स्थानानुसार सर्वात सोपा व कमी चालण्याचा मार्ग (पायी)'}
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

      {/* 2. Clear Travel Mode Model (पायी vs वाहन + पायी) */}
      <div className="bg-white rounded-2xl border border-border p-3.5 shadow-soft space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">दर्शनाचा प्रवास:</span>
          <span className="text-[11px] text-slate-500">
            {travelMode === 'walking' ? '🚶 संपूर्ण दर्शन पायी' : '🚗 वाहन + 🚶 पायी दर्शन'}
          </span>
        </div>

        {/* Big visual mode toggle */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Walking Mode Button */}
          <button
            type="button"
            onClick={() => setTravelMode('walking')}
            className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
              travelMode === 'walking'
                ? 'bg-saffron-50/70 border-saffron-400 ring-2 ring-saffron-400/40 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  travelMode === 'walking'
                    ? 'bg-saffron-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Footprints size={16} />
              </div>
              <span
                className={`text-xs font-bold ${
                  travelMode === 'walking' ? 'text-saffron-900' : 'text-slate-800'
                }`}
              >
                🚶 पायी
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 leading-tight">
              संपूर्ण दर्शन पायी
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              ~{routeSummary.formattedWalkingDuration}
            </div>
          </button>

          {/* Vehicle + Walking Mode Button */}
          <button
            type="button"
            onClick={() => setTravelMode('vehicle')}
            className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
              travelMode === 'vehicle'
                ? 'bg-saffron-50/70 border-saffron-400 ring-2 ring-saffron-400/40 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  travelMode === 'vehicle'
                    ? 'bg-saffron-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Car size={16} />
              </div>
              <span
                className={`text-xs font-bold ${
                  travelMode === 'vehicle' ? 'text-saffron-900' : 'text-slate-800'
                }`}
              >
                🚗 वाहन + पायी
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 leading-tight">
              वाहनाने मध्यवर्ती भागापर्यंत → पुढे पायी दर्शन
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              मध्यवर्ती पेठ भागासाठी सोयीचे
            </div>
          </button>
        </div>

        {/* VEHICLE MODE ACCESS POINT SELECTION */}
        {travelMode === 'vehicle' && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🚗</span>
                <span>वाहनाने येण्यासाठी योग्य परिसर:</span>
              </span>
              <span className="text-[10px] text-slate-500">वाहन थांबवून पुढे पायी</span>
            </div>

            {/* Access Point Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {vehicleAccessPoints.map((ap) => {
                const isSelected = selectedAccessPointId === ap.id;
                const isRecommended = recommendedAccessPoint.id === ap.id;
                return (
                  <button
                    key={ap.id}
                    type="button"
                    onClick={() => setSelectedAccessPointId(ap.id)}
                    className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center text-center transition-all relative ${
                      isSelected
                        ? 'bg-saffron-600 text-white border-saffron-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isRecommended && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold mb-0.5 ${
                          isSelected ? 'bg-amber-300 text-slate-900' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        ⭐ योग्य
                      </span>
                    )}
                    <span className="leading-tight">{ap.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Recommendation Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <span>⭐</span>
                  <span>तुमच्यासाठी योग्य पर्याय:</span>
                  <strong className="text-slate-900 underline ml-0.5">
                    {recommendedAccessPoint.name}
                  </strong>
                </span>
                <p className="text-[10px] text-slate-600 mt-0.5 truncate">
                  {selectedAccessPoint.description}
                </p>
              </div>
              <span className="text-[11px] font-bold text-saffron-700 shrink-0 ml-2">
                येथून दर्शन पायी सुरू करा →
              </span>
            </div>

            {/* Safety & Traffic Disclaimer Alert */}
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-900">
              <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                ⚠️ गणेशोत्सव काळात मध्यवर्ती भागातील वाहतूक व वाहन प्रवेश परिस्थितीनुसार बदलू शकतो. पोलिसांच्या सूचनांचे पालन करा.
              </p>
            </div>
          </div>
        )}

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

      {/* 3. Summary Overview Section */}
      {isVehicleMode && vehicleApproach ? (
        <div className="bg-white rounded-2xl border border-border p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
            <span>📊 दर्शन प्रवासाचा तपशील</span>
            <span className="text-saffron-700 font-extrabold">
              एकूण {toMarathiNumber(routeSummary.totalGanpatis)} गणपती
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 🚗 वाहनाचा प्रवास Card */}
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-950 flex items-center gap-1">
                  <Car size={13} className="text-saffron-600" />
                  <span>🚗 वाहनाचा प्रवास</span>
                </span>
                <span className="text-[10px] text-orange-800 font-semibold bg-orange-100/70 px-1.5 py-0.5 rounded">
                  {selectedAccessPoint.shortName} पर्यंत
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {routeSummary.startName} → <strong>{selectedAccessPoint.name}</strong>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-orange-200/40 text-xs">
                <span className="text-slate-500 text-[11px]">🚗 वाहनाने अंदाजे अंतर:</span>
                <strong className="text-slate-900">{vehicleApproach.distanceFormatted}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">🚗 वाहनाने अंदाजे वेळ:</span>
                <strong className="text-slate-900">{vehicleApproach.durationFormatted}</strong>
              </div>
            </div>

            {/* 🚶 दर्शनाचा पायी प्रवास Card */}
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <Footprints size={13} className="text-emerald-700" />
                  <span>🚶 दर्शनाचा पायी प्रवास</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  सर्व ९ गणपती
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {selectedAccessPoint.shortName} → <strong>सर्व ९ गणपती</strong>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-200/40 text-xs">
                <span className="text-slate-500 text-[11px]">🚶 पायी अंदाजे अंतर:</span>
                <strong className="text-slate-900">
                  {routeSummary.walkingOnlyDistanceFormatted || routeSummary.totalDistanceFormatted}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">🚶 पायी अंदाजे वेळ:</span>
                <strong className="text-slate-900">
                  {routeSummary.walkingOnlyDurationFormatted || routeSummary.formattedWalkingDuration}
                </strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WALKING MODE KEY METRICS GRID */
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

          {/* Total walking distance */}
          <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
              <Ruler size={13} className="text-slate-500 shrink-0" />
              <span>🚶 पायी अंतर</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {routeSummary.totalDistanceFormatted}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">(पायी अंदाजे अंतर)</span>
          </div>

          {/* Estimated duration */}
          <div className="bg-white p-3 rounded-2xl border border-border shadow-soft flex flex-col justify-between ring-1 ring-saffron-300/80 bg-saffron-50/30">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
              <Clock size={13} className="text-saffron-600 shrink-0" />
              <span>🚶 पायी वेळ</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {routeSummary.formattedWalkingDuration}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">
              पायी दर्शन (अंदाजे)
            </span>
          </div>
        </div>
      )}

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
          {/* VEHICLE MODE: Stage 1 - Car journey to Access Point */}
          {isVehicleMode && vehicleApproach ? (
            <>
              {/* User Origin Node */}
              <div className="flex items-start gap-3 relative pb-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm ring-4 ring-slate-100">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    प्रस्थान
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    📍 {routeSummary.startName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    येथून वाहनाने प्रवास सुरू करा
                  </div>
                </div>
              </div>

              {/* Vehicle Driving Connector */}
              <div className="flex items-center gap-3 my-1">
                <div className="w-8 flex justify-center shrink-0">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-slate-400 to-orange-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-medium text-orange-950">
                  <Car size={13} className="text-saffron-600 shrink-0" />
                  <span className="font-bold">🚗 वाहनाने अंदाजे अंतर: {vehicleApproach.distanceFormatted}</span>
                  <span className="text-orange-300">•</span>
                  <span>{vehicleApproach.durationFormatted}</span>
                </div>
              </div>

              {/* Vehicle Access / Parking Node */}
              <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-300 ring-1 ring-orange-300/60 mb-2 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-saffron-600 text-white flex items-center justify-center shrink-0 shadow-sm ring-4 ring-saffron-100 mt-0.5">
                    <Car size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-saffron-800 uppercase tracking-wide">
                        🚗 वाहनाने येण्यासाठी परिसर
                      </span>
                      <span className="text-[10px] font-bold text-saffron-700 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                        ड्रॉप / पार्किंग पर्याय
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {selectedAccessPoint.name}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {selectedAccessPoint.description}
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-orange-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-600">
                    येथे वाहन थांबवा व पुढे पायी दर्शन सुरू करा
                  </span>
                  <a
                    href={accessPointDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white border border-orange-300 text-saffron-800 text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-orange-50 shrink-0 active:scale-95 transition-all"
                  >
                    <Navigation size={12} />
                    <span>येथे जा (Maps)</span>
                  </a>
                </div>
              </div>

              {/* Walking Transition Connector */}
              <div className="flex items-center gap-3 my-1">
                <div className="w-8 flex justify-center shrink-0">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-orange-400 to-saffron-500" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-xs font-bold text-saffron-800">
                  <Footprints size={13} className="text-saffron-600 shrink-0" />
                  <span>🚶 मध्यवर्ती भागातील दर्शन पायी सुरू करा ↓</span>
                </div>
              </div>
            </>
          ) : (
            /* WALKING MODE: Starting Node */
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
                  येथून पहिले दर्शन पायी सुरू होईल
                </div>
              </div>
            </div>
          )}

          {/* Stops Timeline (All 9 Ganpatis on Foot) */}
          {routeStops.map((stop, index) => {
            const isVisited = stop.isVisited;
            const isCurrentTarget = currentStop?.ganpati.id === stop.ganpati.id;

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
                      🚶 {stop.legDistanceFormatted}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{toMarathiNumber(stop.walkingMinutes)} मिनिटे पायी</span>
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

                    {/* Leg distance label (Walking only!) */}
                    <div className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                      <span className="text-slate-400">🚶</span>
                      <span>{stop.legLabel}:</span>
                      <strong className="text-slate-800">{stop.legDistanceFormatted} (पायी अंदाजे अंतर)</strong>
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

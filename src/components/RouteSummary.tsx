'use client';

import React from 'react';
import { MapPin, Footprints, Car, Ruler, Clock, ArrowRight } from 'lucide-react';
import { RouteSummary as IRouteSummary, TravelMode } from '@/types/ganpati';
import { toMarathiNumber } from '@/lib/marathiNumbers';

interface Props {
  summary: IRouteSummary;
  travelMode: TravelMode;
  onSelectMode?: (mode: TravelMode) => void;
  className?: string;
}

export const RouteSummary: React.FC<Props> = ({
  summary,
  travelMode,
  onSelectMode,
  className = '',
}) => {
  const isVehicleMode = travelMode === 'vehicle' && summary.vehicleApproach;

  return (
    <div
      className={`bg-white rounded-2xl border border-border p-4 shadow-soft space-y-3 ${className}`}
    >
      {/* Top Header: Mode Switcher & Ganpati Count */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        {onSelectMode ? (
          <div className="inline-flex p-0.5 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectMode('walking')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                travelMode === 'walking'
                  ? 'bg-white text-saffron-700 shadow-xs ring-1 ring-saffron-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints size={13} className={travelMode === 'walking' ? 'text-saffron-600' : 'text-slate-400'} />
              <span>🚶 पायी</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('vehicle')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                travelMode === 'vehicle'
                  ? 'bg-white text-saffron-700 shadow-xs ring-1 ring-saffron-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car size={13} className={travelMode === 'vehicle' ? 'text-saffron-600' : 'text-slate-400'} />
              <span>🚗 वाहन + पायी</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <MapPin size={14} className="text-saffron-600 shrink-0" />
            <span className="text-slate-500">सुरुवात:</span>
            <strong className="text-slate-900 font-bold truncate max-w-[160px]">
              {summary.startName}
            </strong>
          </div>
        )}

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
          <span>🪔</span>
          <span>{toMarathiNumber(summary.totalGanpatis)} गणपती</span>
        </span>
      </div>

      {/* CONDITIONAL RENDER: VEHICLE MODE (TWO SEPARATE SUMMARIES) */}
      {isVehicleMode ? (
        <div className="space-y-2.5">
          {/* 1. 🚗 वाहनाचा प्रवास (तुमचे स्थान → वाहन थांबवण्याचा परिसर) */}
          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-2">
            <div className="flex items-center justify-between gap-1 text-xs">
              <span className="font-bold text-orange-950 flex items-center gap-1.5">
                <Car size={14} className="text-saffron-600" />
                <span>🚗 वाहनाचा प्रवास</span>
              </span>
              <span className="text-[11px] font-semibold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded-md">
                वाहनाने येण्यासाठी योग्य परिसर
              </span>
            </div>

            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pl-0.5">
              <span className="text-slate-600">{summary.startName}</span>
              <ArrowRight size={12} className="text-slate-400" />
              <strong className="text-saffron-700 font-extrabold">
                {summary.vehicleApproach?.accessPoint.name}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-orange-200/50">
              <div className="bg-white/80 p-1.5 rounded-lg border border-orange-100">
                <span className="text-[10px] font-semibold text-slate-500 block">🚗 वाहनाने अंदाजे अंतर</span>
                <span className="text-xs font-bold text-slate-900">{summary.vehicleApproach?.distanceFormatted}</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded-lg border border-orange-100">
                <span className="text-[10px] font-semibold text-slate-500 block">🚗 वाहनाने अंदाजे वेळ</span>
                <span className="text-xs font-bold text-slate-900">{summary.vehicleApproach?.durationFormatted}</span>
              </div>
            </div>
          </div>

          {/* 2. 🚶 दर्शनाचा पायी प्रवास (वाहन थांबवण्याचा परिसर → सर्व गणपती) */}
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between gap-1 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Footprints size={14} className="text-emerald-700" />
                <span>🚶 दर्शनाचा पायी प्रवास</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                मध्यवर्ती भागातील दर्शन पायी
              </span>
            </div>

            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pl-0.5">
              <span className="text-slate-600">{summary.vehicleApproach?.accessPoint.shortName}</span>
              <ArrowRight size={12} className="text-slate-400" />
              <strong className="text-emerald-800 font-extrabold">
                सर्व {toMarathiNumber(summary.totalGanpatis)} गणपती
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-emerald-200/50">
              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] font-semibold text-slate-500 block">🚶 पायी अंदाजे अंतर</span>
                <span className="text-xs font-bold text-slate-900">
                  {summary.walkingOnlyDistanceFormatted || summary.totalDistanceFormatted}
                </span>
              </div>
              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] font-semibold text-slate-500 block">🚶 पायी अंदाजे वेळ</span>
                <span className="text-xs font-bold text-slate-900">
                  {summary.walkingOnlyDurationFormatted || summary.formattedWalkingDuration}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WALKING MODE SUMMARY */
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Start Point */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-0.5 mb-0.5">
              <MapPin size={11} className="text-slate-400" />
              <span>सुरुवात</span>
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {summary.startName}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">प्रस्थान</span>
          </div>

          {/* Walking Distance */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-0.5 mb-0.5">
              <Ruler size={11} className="text-slate-400" />
              <span>पायी अंतर</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {summary.totalDistanceFormatted}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">(अंदाजे अंतर)</span>
          </div>

          {/* Walking Time */}
          <div className="p-2 rounded-xl bg-saffron-50/70 border border-saffron-200 flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-saffron-700 flex items-center justify-center gap-0.5 mb-0.5">
              <Footprints size={11} className="text-saffron-600" />
              <span>पायी वेळ</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-saffron-900 leading-tight">
              {summary.formattedWalkingDuration}
            </span>
            <span className="text-[9px] text-saffron-600/70 font-medium">(अंदाजे वेळ)</span>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { MapPin, Footprints, Car, Ruler, Compass } from 'lucide-react';
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
  return (
    <div
      className={`bg-white rounded-2xl border border-border p-4 shadow-soft space-y-3 ${className}`}
    >
      {/* Top row: Starting point & Count */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium min-w-0">
          <MapPin size={14} className="text-saffron-600 shrink-0" />
          <span className="text-slate-500 shrink-0">सुरुवात:</span>
          <strong className="text-slate-900 font-bold truncate max-w-[180px]">
            {summary.startName}
          </strong>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
          <span>🪔</span>
          <span>{toMarathiNumber(summary.totalGanpatis)} गणपती</span>
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Total Distance */}
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
          <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-0.5 mb-0.5">
            <Ruler size={11} className="text-slate-400" />
            <span>एकूण अंतर</span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            {summary.totalDistanceFormatted}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">(अंदाजे)</span>
        </div>

        {/* Walking Time */}
        <button
          type="button"
          onClick={() => onSelectMode?.('walking')}
          disabled={!onSelectMode}
          className={`p-2 rounded-xl border flex flex-col justify-center transition-all ${
            onSelectMode ? 'cursor-pointer active:scale-95' : ''
          } ${
            travelMode === 'walking'
              ? 'bg-saffron-50/80 border-saffron-300 ring-1 ring-saffron-300/60'
              : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-0.5 mb-0.5">
            <Footprints size={11} className={travelMode === 'walking' ? 'text-saffron-600' : 'text-slate-400'} />
            <span>पायी</span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            {summary.formattedWalkingDuration}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">(अंदाजे वेळ)</span>
        </button>

        {/* Vehicle Time */}
        <button
          type="button"
          onClick={() => onSelectMode?.('vehicle')}
          disabled={!onSelectMode}
          className={`p-2 rounded-xl border flex flex-col justify-center transition-all ${
            onSelectMode ? 'cursor-pointer active:scale-95' : ''
          } ${
            travelMode === 'vehicle'
              ? 'bg-saffron-50/80 border-saffron-300 ring-1 ring-saffron-300/60'
              : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-0.5 mb-0.5">
            <Car size={11} className={travelMode === 'vehicle' ? 'text-saffron-600' : 'text-slate-400'} />
            <span>वाहनाने</span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
            {summary.formattedVehicleDuration}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">(अंदाजे वेळ)</span>
        </button>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { GanpatiImage } from '@/components/GanpatiImage';
import { Navigation, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { DarshanStop } from '@/types/ganpati';
import { formatMarathiDistance, formatMarathiTravelTime } from '@/lib/distance';
import { toMarathiOrdinal } from '@/lib/marathiNumbers';
import { getDirectionsUrl } from '@/lib/maps';
import { useDarshan } from '@/context/DarshanContext';

interface Props {
  stop: DarshanStop;
  nextStop: DarshanStop | null;
}

export const CurrentDarshanCard: React.FC<Props> = ({ stop, nextStop }) => {
  const { markAsVisited, userLocation, isRealLocation, travelMode } = useDarshan();
  const {
    ganpati,
    sequenceNumber,
    walkingMinutes,
    drivingMinutes,
    legLabel,
    legDistanceFormatted,
  } = stop;

  const directionsUrl = getDirectionsUrl(
    ganpati.coordinates.latitude,
    ganpati.coordinates.longitude,
    isRealLocation ? userLocation?.latitude : undefined,
    isRealLocation ? userLocation?.longitude : undefined,
    travelMode
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-saffron-500/80 p-5 shadow-card relative overflow-hidden transition-all">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600" />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-saffron-500 text-white shadow-sm">
          <span>🙏</span>
          <span>आता येथे दर्शन घ्या</span>
        </span>
        <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200">
          {toMarathiOrdinal(sequenceNumber)} दर्शन
        </span>
      </div>

      {/* Main Ganpati Info with Image */}
      <div className="flex gap-4 items-start mb-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border shadow-soft relative bg-slate-100">
          <GanpatiImage
            src={ganpati.image}
            alt={ganpati.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="inline-block text-[11px] font-semibold text-slate-500 mb-0.5">
            {ganpati.categoryLabel}
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">
            {ganpati.name}
          </h2>
          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
            {ganpati.area}
          </p>

          {/* Distance & Travel time */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-slate-700">
            <span className="text-saffron-700 font-bold">
              📍 {legLabel} {legDistanceFormatted}
            </span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">
              {formatMarathiTravelTime(walkingMinutes, drivingMinutes, travelMode)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Direction CTA (Primary) */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>दिशा मिळवा (Google Maps)</span>
        </a>

        {/* Mark as Visited CTA */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => markAsVisited(ganpati.id)}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 text-xs transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>✓ दर्शन पूर्ण झाले</span>
          </button>

          <Link
            href={`/ganpati/${ganpati.slug}`}
            className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 text-xs transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>इतिहास</span>
          </Link>
        </div>
      </div>

      {/* Next Preview if available */}
      {nextStop && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">
            पुढील दर्शन: <strong className="text-slate-800 font-semibold">{nextStop.ganpati.name}</strong>
          </span>
          <span className="text-saffron-600 flex items-center font-semibold">
            {formatMarathiDistance(nextStop.distanceMeters)} <ChevronRight size={14} />
          </span>
        </div>
      )}
    </div>
  );
};

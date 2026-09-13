'use client';

import React from 'react';
import Link from 'next/link';
import { GanpatiImage } from '@/components/GanpatiImage';
import { Navigation, BookOpen, Check, CheckCircle2 } from 'lucide-react';
import { DarshanStop } from '@/types/ganpati';
import { formatMarathiDistance, formatMarathiTravelTime } from '@/lib/distance';
import { toMarathiOrdinal } from '@/lib/marathiNumbers';
import { getDirectionsUrl } from '@/lib/maps';
import { useDarshan } from '@/context/DarshanContext';

interface Props {
  stop: DarshanStop;
  isCurrentTarget?: boolean;
}

export const DarshanCard: React.FC<Props> = ({ stop, isCurrentTarget = false }) => {
  const { toggleVisited, userLocation, travelMode } = useDarshan();
  const {
    ganpati,
    sequenceNumber,
    walkingMinutes,
    drivingMinutes,
    isVisited,
    legLabel,
    legDistanceFormatted,
  } = stop;

  const directionsUrl = getDirectionsUrl(
    ganpati.coordinates.latitude,
    ganpati.coordinates.longitude,
    userLocation?.latitude,
    userLocation?.longitude,
    travelMode
  );

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isVisited
          ? 'bg-slate-50/80 border-slate-200 opacity-80'
          : isCurrentTarget
          ? 'bg-white border-saffron-400 shadow-md ring-1 ring-saffron-400/50'
          : 'bg-white border-border shadow-soft hover:border-slate-300'
      }`}
    >
      <div className="p-4">
        {/* Top bar: Sequence badge + Visited toggle */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isVisited
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCurrentTarget
                  ? 'bg-saffron-500 text-white'
                  : 'bg-saffron-50 text-saffron-800 border border-saffron-200'
              }`}
            >
              {toMarathiOrdinal(sequenceNumber)} दर्शन
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {ganpati.categoryLabel}
            </span>
          </div>

          {/* Toggle visited button */}
          <button
            type="button"
            onClick={() => toggleVisited(ganpati.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              isVisited
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            title={isVisited ? 'दर्शन झाले (रद्द करण्यासाठी क्लिक करा)' : 'दर्शन पूर्ण झाले म्हणून नोंदवा'}
          >
            {isVisited ? (
              <>
                <Check size={13} strokeWidth={3} />
                <span>दर्शन पूर्ण</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span>बाकी आहे</span>
              </>
            )}
          </button>
        </div>

        {/* Content Row: Image + Text */}
        <div className="flex gap-3.5 items-start">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-slate-100 relative">
            <GanpatiImage
              src={ganpati.image}
              alt={ganpati.name}
              fill
              className={`object-cover ${isVisited ? 'grayscale-[40%]' : ''}`}
              sizes="64px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-base leading-snug truncate ${
                isVisited ? 'line-through text-slate-500' : 'text-slate-900'
              }`}
            >
              {ganpati.name}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {ganpati.area}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs font-medium text-slate-600">
              <span className="text-saffron-700 font-semibold">
                📍 {legLabel} {legDistanceFormatted}
              </span>
              <span>•</span>
              <span>{formatMarathiTravelTime(walkingMinutes, drivingMinutes, travelMode)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl border border-saffron-300 bg-saffron-50 hover:bg-saffron-100 text-saffron-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation size={13} />
            <span>दिशा मिळवा</span>
          </a>

          <Link
            href={`/ganpati/${ganpati.slug}`}
            className="py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <BookOpen size={13} />
            <span>इतिहास</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

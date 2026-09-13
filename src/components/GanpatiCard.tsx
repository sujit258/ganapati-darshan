'use client';

import React from 'react';
import Link from 'next/link';
import { GanpatiImage } from '@/components/GanpatiImage';
import { Navigation, Check, ChevronRight } from 'lucide-react';
import { Ganpati } from '@/types/ganpati';
import { calculateDistanceMeters, formatMarathiDistance } from '@/lib/distance';
import { getDirectionsUrl } from '@/lib/maps';
import { useDarshan } from '@/context/DarshanContext';

interface Props {
  ganpati: Ganpati;
}

export const GanpatiCard: React.FC<Props> = ({ ganpati }) => {
  const { userLocation, visitedIds } = useDarshan();
  const isVisited = visitedIds.has(ganpati.id);

  const distance = userLocation
    ? calculateDistanceMeters(
        userLocation.latitude,
        userLocation.longitude,
        ganpati.coordinates.latitude,
        ganpati.coordinates.longitude
      )
    : null;

  const directionsUrl = getDirectionsUrl(
    ganpati.coordinates.latitude,
    ganpati.coordinates.longitude,
    userLocation?.latitude,
    userLocation?.longitude
  );

  return (
    <div className="bg-white rounded-2xl border border-border hover:border-saffron-300 shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group">
      <Link href={`/ganpati/${ganpati.slug}`} className="block p-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              ganpati.category === 'manache'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-orange-50 text-orange-900 border border-orange-200'
            }`}
          >
            {ganpati.categoryLabel}
          </span>

          {isVisited && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Check size={12} strokeWidth={2.5} />
              <span>दर्शन झाले</span>
            </span>
          )}
        </div>

        {/* Image & Title */}
        <div className="flex gap-3.5 items-start">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border bg-slate-100 relative">
            <GanpatiImage
              src={ganpati.image}
              alt={ganpati.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="80px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-saffron-700 transition-colors">
              {ganpati.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {ganpati.area}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {ganpati.description}
            </p>
          </div>
        </div>

        {/* Distance if location known */}
        {distance !== null && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="text-saffron-700 font-semibold">
              📍 अंतर: {formatMarathiDistance(distance)}
            </span>
            <span className="text-xs text-slate-400 group-hover:text-saffron-600 font-medium flex items-center">
              माहिती पहा <ChevronRight size={14} />
            </span>
          </div>
        )}
      </Link>

      {/* Footer Navigation CTA */}
      <div className="px-4 pb-3 pt-1 border-t border-slate-50 flex items-center gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full py-2 px-3 rounded-xl bg-saffron-50 hover:bg-saffron-100 active:bg-saffron-200 text-saffron-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Navigation size={13} />
          <span>दिशा मिळवा</span>
        </a>
      </div>
    </div>
  );
};

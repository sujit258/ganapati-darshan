'use client';

import React from 'react';
import Link from 'next/link';
import { GanpatiImage } from '@/components/GanpatiImage';
import {
  ArrowLeft,
  Navigation,
  Check,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  BookOpen,
  Compass,
  Car,
  Footprints,
} from 'lucide-react';
import { Ganpati } from '@/types/ganpati';
import { useDarshan } from '@/context/DarshanContext';
import { calculateDistanceMeters, formatMarathiDistance, formatMarathiTravelTime } from '@/lib/distance';
import { toMarathiNumber, toMarathiOrdinal } from '@/lib/marathiNumbers';
import { getDirectionsUrl } from '@/lib/maps';

interface Props {
  ganpati: Ganpati;
}

export default function GanpatiDetailClient({ ganpati }: Props) {
  const {
    userLocation,
    isRealLocation,
    routeStops,
    visitedIds,
    toggleVisited,
    travelMode,
    selectedAccessPoint,
    vehicleApproach,
    requestLocation,
    isLoadingLocation,
  } = useDarshan();
  const isVisited = visitedIds.has(ganpati.id);

  // Distance from active userLocation (real GPS or preset start)
  const distance = userLocation
    ? calculateDistanceMeters(
        userLocation.latitude,
        userLocation.longitude,
        ganpati.coordinates.latitude,
        ganpati.coordinates.longitude
      )
    : null;

  // Walking distance from selected vehicle access point to this Ganpati
  const walkingFromAccessPointMeters = selectedAccessPoint
    ? calculateDistanceMeters(
        selectedAccessPoint.coordinates.latitude,
        selectedAccessPoint.coordinates.longitude,
        ganpati.coordinates.latitude,
        ganpati.coordinates.longitude
      )
    : null;

  // Directions URL: Google Maps walking navigation for central Pune Ganpati
  const walkingDirectionsUrl = getDirectionsUrl(
    ganpati.coordinates.latitude,
    ganpati.coordinates.longitude,
    isRealLocation ? userLocation?.latitude : undefined,
    isRealLocation ? userLocation?.longitude : undefined,
    'walking'
  );

  // Driving directions URL to the vehicle access point
  const accessPointDirectionsUrl = selectedAccessPoint
    ? getDirectionsUrl(
        selectedAccessPoint.coordinates.latitude,
        selectedAccessPoint.coordinates.longitude,
        isRealLocation ? userLocation?.latitude : undefined,
        isRealLocation ? userLocation?.longitude : undefined,
        'vehicle'
      )
    : walkingDirectionsUrl;

  // Find sequence position in active route
  const stopIndex = routeStops.findIndex((s) => s.ganpati.id === ganpati.id);
  const sequenceNumber = stopIndex >= 0 ? stopIndex + 1 : null;

  return (
    <div className="space-y-5 animate-in fade-in duration-150 pb-8">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/ganpati"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-saffron-700 p-1.5 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>सर्व गणपती</span>
        </Link>

        {/* Visited Toggle */}
        <button
          type="button"
          onClick={() => toggleVisited(ganpati.id)}
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            isVisited
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {isVisited ? (
            <>
              <Check size={14} strokeWidth={3} />
              <span>दर्शन पूर्ण</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              <span>दर्शन नोंदवा</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Image Card */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-card">
        <div className="relative w-full h-56 sm:h-64 bg-slate-100 overflow-hidden">
          <GanpatiImage
            src={ganpati.image}
            alt={ganpati.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, 448px"
          />
        </div>

        <div className="p-5 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                ganpati.category === 'manache'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-orange-50 text-orange-900 border border-orange-200'
              }`}
            >
              {ganpati.categoryLabel}
            </span>

            {ganpati.establishedYear && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Calendar size={12} />
                <span>स्थापना: {toMarathiNumber(ganpati.establishedYear)}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            {ganpati.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {ganpati.description}
          </p>

          {/* Darshan Sequence Indicator if active */}
          {sequenceNumber && (
            <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="font-bold text-saffron-900 flex items-center gap-1.5">
                <Compass size={15} className="text-saffron-600" />
                <span>तुमच्या मार्गातील {toMarathiOrdinal(sequenceNumber)} दर्शन</span>
              </span>
              <Link
                href="/darshan"
                className="text-saffron-700 font-bold hover:underline"
              >
                मार्ग पहा →
              </Link>
            </div>
          )}

          {/* Distance Info & Action: Walking vs Vehicle Multi-Modal */}
          {travelMode === 'vehicle' && selectedAccessPoint ? (
            /* VEHICLE MODE: Show vehicle approach + walking leg */
            <div className="space-y-2">
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-orange-950 font-bold flex items-center gap-1">
                    <Car size={13} className="text-saffron-600" />
                    <span>🚗 वाहनाने परिसर:</span>
                    <strong className="text-slate-900">{selectedAccessPoint.name}</strong>
                  </span>
                  <span className="font-bold text-saffron-800 text-xs">
                    {vehicleApproach ? `${vehicleApproach.distanceFormatted} (वाहनाने अंदाजे अंतर)` : 'अंदाजे अंतर'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-orange-200/60">
                  <span className="text-slate-700 font-medium flex items-center gap-1">
                    <Footprints size={13} className="text-emerald-700" />
                    <span>🚶 {selectedAccessPoint.shortName} येथून पायी अंतर:</span>
                  </span>
                  <span className="font-bold text-emerald-800 text-xs">
                    {walkingFromAccessPointMeters ? `${formatMarathiDistance(walkingFromAccessPointMeters)} (पायी अंदाजे अंतर)` : ''}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={walkingDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-3 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                >
                  <Footprints size={15} />
                  <span>या गणपतीकडे पायी दिशा (Maps)</span>
                </a>

                <a
                  href={accessPointDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-orange-50 hover:bg-orange-100 border border-orange-300 active:scale-[0.98] text-orange-950 font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shrink-0"
                >
                  <Car size={15} className="text-saffron-600" />
                  <span>{selectedAccessPoint.shortName} पर्यंत वाहन दिशा</span>
                </a>
              </div>
            </div>
          ) : isRealLocation && distance !== null ? (
            /* WALKING MODE: Real browser location available */
            <div className="space-y-2.5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  📍 तुमच्यापासून अंतर:
                </span>
                <span className="font-bold text-saffron-800 text-sm">
                  {formatMarathiDistance(distance)} (पायी अंदाजे अंतर)
                </span>
              </div>

              <a
                href={walkingDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Navigation size={16} />
                <span>दिशा मिळवा (Google Maps पायी)</span>
              </a>
            </div>
          ) : userLocation && userLocation.isPreset && distance !== null ? (
            /* WALKING MODE: Fallback route start selected (e.g. Shaniwar Wada) */
            <div className="space-y-2.5">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">
                    📍 सुरुवातीचे ठिकाण: <strong className="text-slate-900">{userLocation.presetName || 'शनिवार वाडा'}</strong>
                  </span>
                  <span className="font-bold text-saffron-800 text-sm">
                    {formatMarathiDistance(distance)} (पायी अंदाजे अंतर)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/60 text-[11px]">
                  <span className="text-slate-500">
                    सध्याच्या स्थानावरून अंतर हवे आहे?
                  </span>
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={isLoadingLocation}
                    className="font-bold text-saffron-700 hover:text-saffron-800 underline active:scale-95 transition-all"
                  >
                    {isLoadingLocation ? 'शोधत आहे...' : 'सध्याचे स्थान मिळवा'}
                  </button>
                </div>
              </div>

              <a
                href={walkingDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Navigation size={16} />
                <span>दिशा मिळवा (Google Maps पायी)</span>
              </a>
            </div>
          ) : (
            /* WALKING MODE: Location unavailable */
            <div className="space-y-2.5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  📍 तुमचे स्थान मिळाले नाही
                </span>
                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={isLoadingLocation}
                  className="px-3 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs active:scale-95 transition-all shadow-xs"
                >
                  {isLoadingLocation ? 'शोधत आहे...' : 'स्थान मिळवा'}
                </button>
              </div>

              <a
                href={walkingDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Navigation size={16} />
                <span>दिशा मिळवा (Google Maps)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* History Section (इतिहास) */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-2.5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-saffron-600" />
          <span>📜 इतिहास</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {ganpati.history}
        </p>
      </div>

      {/* Significance Section (महत्त्व) */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-2.5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>🙏 महत्त्व</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {ganpati.significance}
        </p>
      </div>

      {/* Special Features if available */}
      {ganpati.specialFeatures && ganpati.specialFeatures.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-2.5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>✨</span>
            <span>वैशिष्ट्ये</span>
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {ganpati.specialFeatures.map((feat, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Address & Location (ठिकाण) */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-2.5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-saffron-600" />
          <span>📍 ठिकाण व पत्ता</span>
        </h2>
        <p className="text-sm font-medium text-slate-800">
          {ganpati.address}
        </p>
        <p className="text-xs text-slate-500">
          परिसर: {ganpati.area}
        </p>
      </div>
    </div>
  );
}

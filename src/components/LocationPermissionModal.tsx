'use client';

import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle, X } from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { PRESET_START_LOCATIONS } from '@/data/ganpatis';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPermissionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    requestLocation,
    setPresetLocation,
    toggleTraditionalMode,
    isLoadingLocation,
    locationError,
    permissionStatus,
  } = useDarshan();

  if (!isOpen) return null;

  const handleUseCurrentLocation = async () => {
    const success = await requestLocation();
    if (success) {
      onClose();
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setPresetLocation(presetId);
    onClose();
  };

  const handleSelectTraditional = () => {
    toggleTraditionalMode();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-border space-y-5 animate-in slide-in-from-bottom duration-200">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-headline" className="text-lg font-bold text-slate-900">
                तुमचे स्थान वापरा
              </h2>
              <p className="text-xs text-slate-500">
                दर्शन सुलभ आणि जलद होण्यासाठी
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="बंद करा"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informative text */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
          <p className="font-medium">
            📍 तुम्ही जिथे उभे आहात, तिथून सर्वात जवळ असणाऱ्या गणपतीपासून सोपा व कमी चालण्याचा दर्शन मार्ग तयार केला जाईल.
          </p>
        </div>

        {/* Error / Denied notice */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{locationError}</p>
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full py-3.5 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all disabled:opacity-60"
        >
          {isLoadingLocation ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>स्थान शोधत आहे...</span>
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              <span>सध्याचे स्थान वापरा</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">किंवा इतर ठिकाण निवडा</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Fallback starting points */}
        <div className="space-y-2">
          {PRESET_START_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelectPreset(loc.id)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl border border-border hover:border-saffron-300 hover:bg-saffron-50/50 active:bg-saffron-100/60 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-saffron-700">
                  {loc.marathiLabel}
                </p>
                <p className="text-[11px] text-slate-500">{loc.description}</p>
              </div>
              <span className="text-xs text-saffron-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                निवडा →
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={handleSelectTraditional}
            className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>५ मानाच्या गणपतींचा पारंपरिक क्रम वापरा</span>
          </button>
        </div>
      </div>
    </div>
  );
};

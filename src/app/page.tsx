'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Scroll, ArrowRight, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { GANPATIS } from '@/data/ganpatis';
import { LocationPermissionModal } from '@/components/LocationPermissionModal';

export default function HomePage() {
  const {
    showPermissionModal,
    setShowPermissionModal,
    visitedCount,
    totalCount,
    permissionStatus,
  } = useDarshan();

  const manacheGanpatis = GANPATIS.filter((g) => g.category === 'manache');
  const pramukhGanpatis = GANPATIS.filter((g) => g.category === 'pramukh');

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Location Modal */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      {/* Hero Section - Direct, Simple, Fast */}
      <div className="text-center pt-3 pb-2 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-950 border border-amber-300/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>पुणे गणेशोत्सव विशेष</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          🪔 पुणे गणपती दर्शन
        </h1>

        <p className="text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
          पुण्यातील मानाच्या आणि प्रमुख गणपतींचे दर्शन सोप्या क्रमाने घ्या.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="pt-2 space-y-2.5 max-w-xs mx-auto">
          <Link
            href="/darshan"
            className="w-full py-3.5 px-5 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 text-base transition-all group"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>
              {visitedCount > 0 ? 'दर्शन सुरू ठेवा' : '🙏 दर्शन सुरू करा'}
            </span>
          </Link>

          <Link
            href="/ganpati"
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold rounded-xl border border-border flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <Scroll className="w-4 h-4 text-slate-500" />
            <span>🗺️ सर्व गणपती पहा (९ गणपती)</span>
          </Link>
        </div>

        {/* Value badge */}
        <p className="text-[11px] text-slate-500 font-medium pt-1">
          ५ मानाचे गणपती + ४ प्रमुख गणपती • स्थानानुसार योग्य क्रम
        </p>
      </div>

      {/* Progress banner if user has already started */}
      {visitedCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-bold text-amber-950">
              आपले दर्शन सुरू आहे
            </p>
            <p className="text-[11px] text-amber-800">
              {visitedCount} / {totalCount} गणपतींचे दर्शन पूर्ण झाले आहे.
            </p>
          </div>
          <Link
            href="/darshan"
            className="text-xs font-bold px-3 py-1.5 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors shadow-xs"
          >
            पुढे चला →
          </Link>
        </div>
      )}

      {/* Quick Summary: आजचे दर्शन (९ गणपती) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🪔</span>
            <span>आजचे दर्शन (९ गणपती)</span>
          </h2>
          <Link
            href="/ganpati"
            className="text-xs font-bold text-saffron-700 hover:text-saffron-800 flex items-center gap-0.5"
          >
            <span>सर्व पहा</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 5 Manache Ganpati Preview */}
        <div className="bg-white rounded-2xl border border-border p-3.5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 border-b border-slate-100 pb-2">
            <span>५ मानाचे गणपती</span>
            <span className="text-[11px] text-slate-500 font-normal">पारंपरिक अग्रक्रम</span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {manacheGanpatis.map((g) => (
              <Link
                key={g.id}
                href={`/ganpati/${g.slug}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-saffron-50/60 active:bg-saffron-100/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    {g.manacheRank}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-saffron-700 transition-colors">
                      {g.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{g.area}</p>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-saffron-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* 4 Major Ganpatis Preview */}
        <div className="bg-white rounded-2xl border border-border p-3.5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-orange-950 border-b border-slate-100 pb-2">
            <span>४ प्रमुख गणपती</span>
            <span className="text-[11px] text-slate-500 font-normal">पुण्याचे विशेष वैभव</span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            {pramukhGanpatis.map((g) => (
              <Link
                key={g.id}
                href={`/ganpati/${g.slug}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/60 active:bg-orange-100/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-900 font-bold text-xs flex items-center justify-center shrink-0">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-saffron-700 transition-colors">
                      {g.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{g.area}</p>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-saffron-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How to use - Simple 5 Steps */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-soft space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>कसे वापरायचे?</span>
        </h2>

        <ol className="space-y-2.5 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              १
            </span>
            <span><strong>दर्शन सुरू करा</strong> बटण दाबा.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              २
            </span>
            <span>तुमचे सध्याचे स्थान द्या (किंवा शनिवार वाड्यापासून सुरू करा).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              ३
            </span>
            <span>स्थानानुसार सर्वात जवळ असणारा योग्य क्रम मिळवा.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              ४
            </span>
            <span><strong>दिशा मिळवा</strong> दाबून Google Maps द्वारे मार्गक्रमण करा.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              ५
            </span>
            <span>दर्शन झाल्यावर <strong>दर्शन पूर्ण</strong> नोंदवून पुढील गणपतीकडे वळा.</span>
          </li>
        </ol>
      </div>

      {/* Simple Footer Note */}
      <div className="text-center pt-2 pb-4 text-[11px] text-slate-400 space-y-1">
        <p>🪔 पुणे गणपती दर्शन • पुण्याच्या गणेशोत्सवाचा डिजिटल मार्गदर्शक</p>
        <p>© २०२६ • सर्व हक्क राखीव</p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MapPin, ArrowLeft, ChevronRight, Camera } from 'lucide-react';
import { DEKHAVE } from '@/data/dekhave';
import { Dekhava, DekhavaCategory } from '@/types/ganpati';
import { toMarathiNumber } from '@/lib/marathiNumbers';

type FilterType = 'all' | DekhavaCategory;

export default function DekhaveClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredDekhave = DEKHAVE.filter((d) => {
    if (activeFilter === 'all') return true;
    return d.category === activeFilter;
  });

  return (
    <div className="space-y-3.5 animate-in fade-in duration-150 pb-8">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-saffron-700 p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>मुख्य पृष्ठ</span>
        </Link>
        <Link
          href="/ganpati"
          className="text-xs font-bold text-saffron-700 hover:underline flex items-center gap-0.5"
        >
          <span>सर्व गणपती</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300/60">
          <Sparkles size={11} className="text-amber-700" />
          <span>पुणे गणेशोत्सव विशेष देखावे</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
          ✨ गणपतीचे देखावे
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          पुण्यातील यंदाचे खास गणपती देखावे एका ठिकाणी
        </p>
      </div>

      {/* Filter Tabs: [ सर्व ] [ मानाचे ] [ प्रमुख ] [ इतर ] */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          सर्व ({toMarathiNumber(DEKHAVE.length)})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('manache')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'manache'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          मानाचे
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('pramukh')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'pramukh'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          प्रमुख
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('itar')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'itar'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          इतर
        </button>
      </div>

      {/* Dekhave Cards Grid: Compact ~12-14px spacing */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredDekhave.map((item) => (
          <DekhavaCard key={item.id} dekhava={item} />
        ))}
      </div>
    </div>
  );
}

function DekhavaCard({ dekhava }: { dekhava: Dekhava }) {
  const categoryLabel =
    dekhava.category === 'manache'
      ? 'मानाचा गणपती'
      : dekhava.category === 'pramukh'
      ? 'प्रमुख गणपती'
      : 'इतर देखावा';

  const defaultAlt = dekhava.altText || `${dekhava.ganpatiName}चा ${dekhava.title} देखावा`;

  return (
    <div className="bg-white rounded-2xl border border-border hover:border-saffron-300 shadow-soft hover:shadow-card transition-all overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Photo Container: Compact 16:9 Aspect Ratio (approx 180-210px height on mobile) */}
        {dekhava.imageSrc ? (
          <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
            <Image
              src={dekhava.imageSrc}
              alt={defaultAlt}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 448px"
              loading="lazy"
            />
            {/* Badges on Image */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/20">
                {categoryLabel}
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                {toMarathiNumber(dekhava.year)}
              </span>
            </div>
          </div>
        ) : (
          /* Empty / Missing Image Handling */
          <div className="relative w-full aspect-[16/9] bg-amber-50/60 border-b border-amber-100 flex flex-col items-center justify-center p-3 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Camera size={16} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-900">
                ✨ यंदाचा देखावा
              </p>
              <p className="text-[11px] text-amber-700">
                फोटो लवकरच उपलब्ध होईल
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Compact Content Area: Essential details only */}
        <div className="px-3.5 py-2.5 space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-saffron-700 transition-colors">
              {dekhava.title}
            </h3>
            {dekhava.category === 'manache' && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full shrink-0">
                मानाचा
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-saffron-800 leading-tight">
            {dekhava.ganpatiName}
          </p>
          {dekhava.location && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
              <MapPin size={11} className="text-slate-400 shrink-0" />
              <span>{dekhava.location}</span>
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Compact Detail Link & Source Link */}
      <div className="px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/40">
        {dekhava.ganpatiSlug ? (
          <Link
            href={`/ganpati/${dekhava.ganpatiSlug}`}
            className="inline-flex items-center gap-1 font-bold text-saffron-700 hover:text-saffron-800 hover:underline text-xs"
          >
            <span>माहिती व दर्शन</span>
            <ChevronRight size={13} />
          </Link>
        ) : (
          <span className="text-slate-400 text-[11px]">पुण्यातील सार्वजनिक मंडळ</span>
        )}

        {dekhava.sourceUrl && (
          <a
            href={dekhava.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors text-[11px]"
          >
            <span>📷</span>
            <span className="underline">फोटो स्रोत</span>
          </a>
        )}
      </div>
    </div>
  );
}

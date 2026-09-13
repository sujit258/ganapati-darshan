'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Compass, Info } from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';

// Dynamically import InteractiveMap without SSR
const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] bg-slate-100 rounded-2xl flex items-center justify-center border border-border">
        <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
          <div className="w-6 h-6 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <span>नकाशा लोड होत आहे...</span>
        </div>
      </div>
    ),
  }
);

export default function NakashaPage() {
  const { userLocation } = useDarshan();

  return (
    <div className="space-y-4 animate-in fade-in duration-150 pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/darshan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-saffron-700 p-1.5 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>दर्शनाकडे परत जा</span>
        </Link>
        <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200">
          मध्यवर्ती पुणे नकाशा
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 leading-tight">
          🗺️ दर्शन नकाशा
        </h1>
        <p className="text-xs text-slate-500">
          ९ गणपतींची ठिकाणे व तुमचा चालण्याचा सुचवलेला मार्ग
        </p>
      </div>

      {/* Interactive Map */}
      <InteractiveMap />

      {/* Legend / Info */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-soft space-y-2.5 text-xs">
        <h2 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Info size={14} className="text-saffron-600" />
          <span>नकाशा संकेत</span>
        </h2>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center text-[10px]">
              १
            </span>
            <span>सुचवलेला दर्शन क्रमांक</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
              ✓
            </span>
            <span>पूर्ण झालेले दर्शन</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
            <span>तुमचे सध्याचे स्थान</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-orange-500" />
            <span>चालण्याचा अंदाजे मार्ग</span>
          </div>
        </div>
      </div>

      {/* Direct CTA */}
      <div className="pt-1">
        <Link
          href="/darshan"
          className="w-full py-3 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Compass size={16} />
          <span>दर्शनाचा क्रम पहा</span>
        </Link>
      </div>
    </div>
  );
}

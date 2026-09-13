'use client';

import React, { useState } from 'react';
import { Scroll, Sparkles, Filter } from 'lucide-react';
import { GANPATIS } from '@/data/ganpatis';
import { GanpatiCard } from '@/components/GanpatiCard';
import { GanpatiCategory } from '@/types/ganpati';

export default function AllGanpatisPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | GanpatiCategory>('all');

  const filteredGanpatis = GANPATIS.filter((g) => {
    if (selectedFilter === 'all') return true;
    return g.category === selectedFilter;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/80 text-amber-900">
          <Sparkles size={12} />
          <span>पुण्यातील ९ आराध्य गणपती</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 leading-tight">
          🪔 सर्व गणपती
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          ५ मानाचे गणपती आणि ४ प्रमुख ऐतिहासिक गणपतींची सविस्तर माहिती
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === 'all'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          सर्व (९)
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('manache')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === 'manache'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          मानाचे (५)
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('pramukh')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
            selectedFilter === 'pramukh'
              ? 'bg-white text-saffron-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          प्रमुख (४)
        </button>
      </div>

      {/* Ganpati Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredGanpatis.map((ganpati) => (
          <GanpatiCard key={ganpati.id} ganpati={ganpati} />
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDarshan } from '@/context/DarshanContext';
import { toMarathiNumber } from '@/lib/marathiNumbers';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { visitedCount, totalCount } = useDarshan();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-left group">
          <span className="text-2xl select-none transition-transform group-active:scale-95" aria-hidden="true">
            🪔
          </span>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
              पुणे गणपती दर्शन
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              सोपा दर्शन मार्गदर्शक
            </p>
          </div>
        </Link>

        {/* Dynamic badge based on active darshan */}
        <div className="flex items-center gap-2">
          {visitedCount > 0 ? (
            <Link
              href="/darshan"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200/80 hover:bg-saffron-100 transition-colors"
              title="दर्शन प्रगती"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 animate-pulse" />
              <span>{toMarathiNumber(visitedCount)}/{toMarathiNumber(totalCount)} पूर्ण</span>
            </Link>
          ) : pathname !== '/darshan' ? (
            <Link
              href="/darshan"
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-saffron-600 text-white hover:bg-saffron-700 active:scale-95 transition-all shadow-sm"
            >
              दर्शन सुरू करा
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};

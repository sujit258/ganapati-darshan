'use client';

import React from 'react';
import { toMarathiNumber } from '@/lib/marathiNumbers';

interface Props {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<Props> = ({ completed, total, className = '' }) => {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-700">
          {toMarathiNumber(completed)} / {toMarathiNumber(total)} दर्शन पूर्ण
        </span>
        <span className="text-saffron-700 font-bold">
          {toMarathiNumber(percentage)}%
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
};

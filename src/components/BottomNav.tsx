'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Scroll, Info } from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';
import { toMarathiNumber } from '@/lib/marathiNumbers';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { visitedCount, totalCount } = useDarshan();

  const navItems = [
    {
      label: 'मुख्य',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'दर्शन',
      href: '/darshan',
      icon: Compass,
      isActive: pathname.startsWith('/darshan'),
      badge: visitedCount > 0 ? `${toMarathiNumber(visitedCount)}/${toMarathiNumber(totalCount)}` : undefined,
    },
    {
      label: 'गणपती',
      href: '/ganpati',
      icon: Scroll,
      isActive: pathname.startsWith('/ganpati'),
    },
    {
      label: 'माहिती',
      href: '/mahiti',
      icon: Info,
      isActive: pathname.startsWith('/mahiti'),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border/90 shadow-sticky-bar"
      aria-label="मुख्य नेव्हिगेशन"
    >
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative select-none ${
                active
                  ? 'text-saffron-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={`transition-transform duration-150 ${active ? 'scale-110' : ''}`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 bg-saffron-600 text-white text-[9px] font-bold rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 transition-all ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0.5 w-6 h-0.5 rounded-full bg-saffron-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

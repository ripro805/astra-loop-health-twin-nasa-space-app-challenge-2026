'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitCompare,
  ClipboardCheck,
  Radiation,
  GitBranch,
  ShieldAlert,
  Sparkles,
  History,
  Users,
  Info,
  X,
  Repeat,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: '/today', label: 'TODAY', icon: LayoutDashboard, badge: 'HERO' },
  { href: '/what-changed', label: 'WHAT CHANGED', icon: GitCompare },
  { href: '/check-in', label: 'CHECK-IN', icon: ClipboardCheck },
  { href: '/radiation', label: 'RADIATION WATCH', icon: Radiation, badge: '72H' },
  { href: '/twin', label: 'TWIN & FORECAST', icon: GitBranch },
  { href: '/countermeasures', label: 'COUNTERMEASURES', icon: ShieldAlert, badge: 'LEARN' },
  { href: '/what-if', label: 'WHAT-IF SIMULATOR', icon: Sparkles },
  { href: '/timeline', label: 'MISSION TIMELINE', icon: History },
  { href: '/crew', label: 'CREW & PRIVACY', icon: Users },
  { href: '/about', label: 'ABOUT / METHOD', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3 font-mono">
      <div className="space-y-4">
        {/* Five-step Loop Icon Brand Summary */}
        <div className="rounded-lg border border-slate-800 bg-surface/60 p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-slate-200">CLOSED LOOP</span>
            <Repeat className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div className="grid grid-cols-5 gap-1 text-[9px] text-center font-bold">
            <div className="rounded bg-sky-950/80 text-sky-300 py-1 border border-sky-800/40">SENSE</div>
            <div className="rounded bg-indigo-950/80 text-indigo-300 py-1 border border-indigo-800/40">UNDR</div>
            <div className="rounded bg-purple-950/80 text-purple-300 py-1 border border-purple-800/40">PRED</div>
            <div className="rounded bg-emerald-950/80 text-emerald-300 py-1 border border-emerald-800/40">ACT</div>
            <div className="rounded bg-amber-950/80 text-amber-300 py-1 border border-amber-800/40">LEARN</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold tracking-wider transition ${
                  isActive
                    ? 'border border-sky-500/40 bg-sky-950/60 text-sky-200 shadow-sm'
                    : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] uppercase tracking-widest ${
                      isActive
                        ? 'bg-sky-900/80 text-sky-300 border border-sky-700/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="rounded border border-slate-800/80 bg-surface/30 p-2.5 text-[10px] text-slate-500">
        <div className="flex justify-between items-center mb-1">
          <span>ASTRA ENGINE</span>
          <span className="text-emerald-400">v1.0.0</span>
        </div>
        <div>Deep-Space Autonomous Node</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-surface-border bg-surface/70">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-72 bg-surface p-3 shadow-2xl border-r border-surface-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-2">
              <span className="font-mono text-sm font-bold text-slate-200">NAVIGATION</span>
              <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

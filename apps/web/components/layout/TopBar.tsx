'use client';

import React, { useState } from 'react';
import { Orbit, Wifi, WifiOff, Clock, Sliders, Menu } from 'lucide-react';
import { SyntheticBadge } from '../common/SyntheticBadge';
import { DemoControlModal } from './DemoControlModal';
import { useOfflineSync } from '../../hooks/useOfflineSync';

interface TopBarProps {
  missionDay?: number;
  onToggleSidebar?: () => void;
  onRefresh?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ missionDay = 61, onToggleSidebar, onRefresh }) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { isOffline, pendingCount } = useOfflineSync();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden rounded p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950 border border-sky-500/40 text-sky-400 font-mono font-bold">
                <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-base font-extrabold tracking-wider text-slate-100 uppercase">
                  ASTRA-LOOP
                </span>
                <span className="hidden sm:inline text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                  Autonomous Health Twin
                </span>
              </div>
            </div>
          </div>

          {/* Center: Mission Day & Ground Telemetry Delay */}
          <div className="hidden md:flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 rounded border border-slate-800 bg-surface px-3 py-1">
              <span className="text-slate-400 font-sans">MISSION DAY:</span>
              <span className="text-sky-300 font-bold text-sm tracking-widest">
                DAY {missionDay.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>14.3m Earth Delay (DTN)</span>
            </div>
          </div>

          {/* Right: Badges, Offline Status, and Demo Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <SyntheticBadge variant="pill" className="hidden sm:inline-flex" />

            <div
              className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-mono ${
                isOffline
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                  : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>OFFLINE ({pendingCount})</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">ONLINE</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsDemoOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/60 bg-sky-950/80 px-3 py-1.5 text-xs font-mono font-bold text-sky-200 hover:bg-sky-900 transition shadow-sm"
              title="Open Judge Presentation & Storyline Simulator Controls"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>DEMO MODE</span>
            </button>
          </div>
        </div>
      </header>

      <DemoControlModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onRefresh={onRefresh}
      />
    </>
  );
};

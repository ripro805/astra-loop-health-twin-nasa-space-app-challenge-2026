'use client';

import React, { useState } from 'react';
import {
  Sliders,
  X,
  RotateCcw,
  FastForward,
  Radiation,
  EyeOff,
  ShieldCheck,
  Wifi,
  WifiOff,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useOfflineSync } from '../../hooks/useOfflineSync';

interface DemoControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const DemoControlModal: React.FC<DemoControlModalProps> = ({ isOpen, onClose, onRefresh }) => {
  const { isOffline, toggleSimulateOffline } = useOfflineSync();
  const [selectedDay, setSelectedDay] = useState(61);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (name: string, fn: () => Promise<any>) => {
    setLoadingAction(name);
    setFeedback(null);
    try {
      await fn();
      setFeedback(`Action '${name}' applied successfully.`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setFeedback(`Error: ${err.message || 'Action failed'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl border border-sky-500/40 bg-surface-elevated p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
              Mission Simulation & Demo Panel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close demo panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="rounded bg-sky-950/60 border border-sky-600/40 p-2.5 text-xs font-mono text-sky-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="space-y-4 text-xs font-mono">
          {/* Quick Mission Day Jumper */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-sans font-semibold">
              1. Mission Day Timeline Jumper:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                { day: 14, label: 'Day 14 (Baseline)' },
                { day: 50, label: 'Day 50 (Fatigue)' },
                { day: 61, label: 'Day 61 (SPE Hero)' },
                { day: 62, label: 'Day 62 (Impact)' },
                { day: 63, label: 'Day 63 (Counterm)' },
                { day: 65, label: 'Day 65 (Learn Loop)' },
              ].map(({ day, label }) => (
                <button
                  key={day}
                  onClick={() =>
                    handleAction(`Jump to Day ${day}`, async () => {
                      setSelectedDay(day);
                      await api.demoSetDay(day);
                    })
                  }
                  disabled={loadingAction !== null}
                  className={`rounded border p-2 text-center transition ${
                    selectedDay === day
                      ? 'border-sky-400 bg-sky-950/80 text-sky-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm">{day}</div>
                  <div className="text-[10px] truncate">{label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Storyline Triggers */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-slate-300 block mb-2 font-sans font-semibold">
              2. Core Event & Differentiator Triggers:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  handleAction('Trigger Radiation SPE', () => api.demoTriggerRadiation(1.45))
                }
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 rounded border border-rose-900/60 bg-rose-950/30 p-2.5 text-rose-300 hover:bg-rose-900/40 transition text-left"
              >
                <Radiation className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold">Trigger SPE Radiation Spike</div>
                  <div className="text-[10px] text-rose-400/80 font-sans">1.45 mSv/h + 72h watch window</div>
                </div>
              </button>

              <button
                onClick={() =>
                  handleAction('Apply Sleep-Phase Countermeasure', () =>
                    api.demoApplyCountermeasure('SLEEP_PHASE_ADJUSTMENT')
                  )
                }
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 rounded border border-emerald-900/60 bg-emerald-950/30 p-2.5 text-emerald-300 hover:bg-emerald-900/40 transition text-left"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">Apply Countermeasure</div>
                  <div className="text-[10px] text-emerald-400/80 font-sans">Initiate 48-72h Learn Loop</div>
                </div>
              </button>

              <button
                onClick={() =>
                  handleAction('Suppress Cardio Sensor', () => api.demoMissingSensor('cardio'))
                }
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 rounded border border-amber-900/60 bg-amber-950/30 p-2.5 text-amber-300 hover:bg-amber-900/40 transition text-left"
              >
                <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold">Simulate Missing Sensor</div>
                  <div className="text-[10px] text-amber-400/80 font-sans">Blind-Spot Fusion test</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Advance 24 Hours', () => api.demoAdvanceDay())}
                disabled={loadingAction !== null}
                className="flex items-center gap-2.5 rounded border border-cyan-900/60 bg-cyan-950/30 p-2.5 text-cyan-300 hover:bg-cyan-900/40 transition text-left"
              >
                <FastForward className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold">Advance 24 Hours</div>
                  <div className="text-[10px] text-cyan-400/80 font-sans">Progress mission day + 1</div>
                </div>
              </button>
            </div>
          </div>

          {/* Network & Reset Controls */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                toggleSimulateOffline();
                setFeedback(`Offline mode toggled: now ${!isOffline ? 'OFFLINE' : 'ONLINE'}.`);
                if (onRefresh) onRefresh();
              }}
              className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 font-bold transition ${
                isOffline
                  ? 'border-amber-500 bg-amber-950 text-amber-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-sky-400" />}
              <span>{isOffline ? 'Offline Mode ACTIVE' : 'Simulate Offline Mode'}</span>
            </button>

            <button
              onClick={() =>
                handleAction('Reset Demo', async () => {
                  setSelectedDay(61);
                  await api.demoReset();
                })
              }
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo to Day 61</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

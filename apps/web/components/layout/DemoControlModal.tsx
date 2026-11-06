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
  Wind,
  HeartPulse,
  Activity,
  Thermometer,
  Globe,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-sky-500/40 bg-surface-elevated p-6 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
              Mission Simulation & Storyline Controls (v2)
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
          {/* Section 1: Timeline Jumper */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-sans font-semibold">
              1. Mission Day Timeline Jumper (Canonical 90-Day Arc):
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { day: 14, label: 'Day 14', sub: 'Baseline' },
                { day: 50, label: 'Day 50', sub: 'Fatigue' },
                { day: 61, label: 'Day 61', sub: 'SPE Hero' },
                { day: 62, label: 'Day 62', sub: 'Impact' },
                { day: 63, label: 'Day 63', sub: 'Counterm' },
                { day: 65, label: 'Day 65', sub: 'Learn Loop' },
              ].map(({ day, label, sub }) => (
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
                  <div className="font-bold">{label}</div>
                  <div className="text-[10px] text-slate-500">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Physiological & Environmental Stress Triggers */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-sans font-semibold">
              2. Clinical & Environmental Acute Excursion Triggers:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleAction('Trigger Solar Particle Event (SPE)', () => api.demoTriggerRadiation(1.45))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-rose-900/50 bg-rose-950/40 p-2.5 text-rose-300 hover:bg-rose-900/50 transition text-left"
              >
                <Radiation className="w-4 h-4 shrink-0 text-rose-400" />
                <div>
                  <div className="font-bold">SPE Flare (1.45 mSv/h)</div>
                  <div className="text-[10px] text-rose-400/80">Radiation spike</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Spike Cabin CO2', () => api.demoSpikeCO2(3400))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-amber-900/50 bg-amber-950/40 p-2.5 text-amber-300 hover:bg-amber-900/50 transition text-left"
              >
                <Wind className="w-4 h-4 shrink-0 text-amber-400" />
                <div>
                  <div className="font-bold">Spike CO2 (3400 ppm)</div>
                  <div className="text-[10px] text-amber-400/80">Hypercapnia alert</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Raise Blood Pressure', () => api.demoRaiseBP(148, 94))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-red-900/50 bg-red-950/40 p-2.5 text-red-300 hover:bg-red-900/50 transition text-left"
              >
                <HeartPulse className="w-4 h-4 shrink-0 text-red-400" />
                <div>
                  <div className="font-bold">Hypertension (148/94)</div>
                  <div className="text-[10px] text-red-400/80">Cardio absolute check</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Glucose Excursion', () => api.demoGlucoseExcursion(165))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-orange-900/50 bg-orange-950/40 p-2.5 text-orange-300 hover:bg-orange-900/50 transition text-left"
              >
                <Activity className="w-4 h-4 shrink-0 text-orange-400" />
                <div>
                  <div className="font-bold">Glucose Peak (165 mg/dL)</div>
                  <div className="text-[10px] text-orange-400/80">Metabolic shift</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Fever Signs', () => api.demoFeverSigns(38.3))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-yellow-900/50 bg-yellow-950/40 p-2.5 text-yellow-300 hover:bg-yellow-900/50 transition text-left"
              >
                <Thermometer className="w-4 h-4 shrink-0 text-yellow-400" />
                <div>
                  <div className="font-bold">Fever Signs (38.3°C)</div>
                  <div className="text-[10px] text-yellow-400/80">Immune / pyrexia</div>
                </div>
              </button>

              <button
                onClick={() => handleAction('Apply Sleep Countermeasure', () => api.demoApplyCountermeasure('SLEEP_PHASE_ADJUSTMENT'))}
                disabled={loadingAction !== null}
                className="flex items-center gap-2 rounded border border-emerald-900/50 bg-emerald-950/40 p-2.5 text-emerald-300 hover:bg-emerald-900/50 transition text-left"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="font-bold">Sleep Schedule Protocol</div>
                  <div className="text-[10px] text-emerald-400/80">Launch Day 63 CM</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Environment Relocation */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-sans font-semibold">
              3. Operational Environment Switching:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'SPACECRAFT', label: 'Transit (0g)' },
                { type: 'STATION', label: 'ISS / Station (0g)' },
                { type: 'MOON_BASE', label: 'Moon Base (0.16g)' },
                { type: 'MARS_BASE', label: 'Mars Base (0.38g)' },
                { type: 'ROVER', label: 'Rover (0.38g)' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleAction(`Switch to ${type}`, () => api.demoSwitchEnvironment(type))}
                  disabled={loadingAction !== null}
                  className="rounded border border-indigo-900/50 bg-indigo-950/30 p-2 text-center text-indigo-300 hover:bg-indigo-900/40 transition"
                >
                  <Globe className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-400" />
                  <div className="font-bold text-[10px]">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: System Robustness & Offline DTN */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-sans font-semibold">
              4. System Integrity & Resiliency Simulators:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleSimulateOffline}
                className={`flex items-center justify-center gap-2 rounded border p-2.5 transition ${
                  isOffline
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                    : 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                }`}
              >
                {isOffline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isOffline ? 'Restore Network (Flush DTN Queue)' : 'Simulate Comms Blackout (Offline)'}</span>
              </button>

              <button
                onClick={() => handleAction('Suppress ECG Telemetry', () => api.demoMissingSensor('cardio'))}
                disabled={loadingAction !== null}
                className="flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900/80 p-2.5 text-slate-300 hover:bg-slate-800 transition"
              >
                <EyeOff className="w-4 h-4 text-slate-400" />
                <span>Drop ECG Sensor (Blind-Spot Fusion)</span>
              </button>
            </div>
          </div>

          {/* Section 5: Timeline Controls */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => handleAction('Reset Entire Demo to Baseline', () => api.demoReset())}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Day 61 Baseline</span>
            </button>

            <button
              onClick={() => handleAction('Advance 24 Hours', () => api.demoAdvanceDay())}
              disabled={loadingAction !== null}
              className="flex items-center gap-1.5 rounded bg-sky-600 hover:bg-sky-500 px-3 py-1.5 text-white font-bold transition"
            >
              <FastForward className="w-4 h-4" />
              <span>Advance 24 Hours</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { Globe, X, Check, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Environment } from '@astra-loop/shared';

interface EnvironmentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentType?: string;
  onEnvironmentChanged?: () => void;
}

export const EnvironmentSelectorModal: React.FC<EnvironmentSelectorModalProps> = ({
  isOpen,
  onClose,
  currentType = 'SPACECRAFT',
  onEnvironmentChanged,
}) => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .getEnvironments()
        .then((envs) => setEnvironments(envs))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = async (envType: string) => {
    setSwitching(envType);
    try {
      await api.switchEnvironment(envType);
      if (onEnvironmentChanged) onEnvironmentChanged();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-sky-500/40 bg-surface-elevated p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
              Mission Operational Environment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Switching environment dynamically updates gravitational loading, radiation shielding, speed-of-light comms latency, and risk engine hazard weights.
        </p>

        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 animate-pulse">
            Loading exploration environments...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {environments.map((env) => {
              const isSelected = env.type === currentType;
              const isBeingSwitched = switching === env.type;

              return (
                <div
                  key={env.id}
                  onClick={() => handleSelect(env.type)}
                  className={`rounded-lg border p-4 cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/40 text-slate-100 ring-1 ring-sky-500/50'
                      : 'border-slate-800 bg-surface hover:border-slate-700 hover:bg-surface-elevated text-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="font-bold font-mono text-sm">{env.name}</div>
                      {isSelected && (
                        <span className="flex items-center gap-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 text-[10px] font-mono">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{env.description}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500 block">GRAVITY:</span>
                      <span className="text-sky-300 font-bold">{env.gravityG} g</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SHIELDING:</span>
                      <span className="text-emerald-300 font-bold">{(env.radiationShieldingFactor * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">COMMS LAG:</span>
                      <span className="text-amber-300 font-bold">{env.commsDelayMinutes}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};


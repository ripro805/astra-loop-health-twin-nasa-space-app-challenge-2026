'use client';

import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ShieldCheck, Database, Radio } from 'lucide-react';
import { SystemStatus } from '@astra-loop/shared';

interface RiskScoreCardProps {
  missionDay: number;
  overallStatus: SystemStatus;
  riskScore: number;
  confidence: number;
  dataCompleteness: number;
  activeWatchWindow?: boolean;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  missionDay,
  overallStatus,
  riskScore,
  confidence,
  dataCompleteness,
  activeWatchWindow = false,
}) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>DEEP-SPACE HABITAT NODE</span>
            <span>•</span>
            <span className="text-sky-400 font-bold">MISSION DAY {missionDay}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-slate-100 uppercase mt-0.5">
            Mission Readiness & Risk Twin
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {activeWatchWindow && (
            <span className="inline-flex items-center gap-1.5 rounded border border-rose-600/60 bg-rose-950/40 px-2.5 py-1 text-xs font-mono text-rose-300 animate-pulse">
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>72H SPE WATCH ACTIVE</span>
            </span>
          )}
          <StatusBadge status={overallStatus} size="lg" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Simulated Risk Score */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-mono text-slate-400 block uppercase">Simulated Risk</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
              {riskScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Multi-domain compound index</span>
        </div>

        {/* Confidence */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-mono text-slate-400 block uppercase">Sensor Confidence</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-400">
              {confidence}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Blind-spot aware fusion</span>
        </div>

        {/* Data Completeness */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-mono text-slate-400 block uppercase">Data Completeness</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400">
              {dataCompleteness}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">5/5 expected streams active</span>
        </div>

        {/* Closed-Loop Status */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-mono text-slate-400 block uppercase">Closed Loop</span>
          <div className="mt-1 flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>LEARNING</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Active evaluation tracking</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
        <span>ASTRA-LOOP compares astronaut against personal baseline (not generic averages).</span>
        <span className="text-amber-400/90 font-semibold">SYNTHETIC HEALTH DATA</span>
      </div>
    </div>
  );
};

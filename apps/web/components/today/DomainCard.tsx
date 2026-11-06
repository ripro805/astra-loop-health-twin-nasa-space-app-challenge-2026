'use client';

import React from 'react';
import { DomainMetricSummary } from '@astra-loop/shared';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Heart,
  Moon,
  Brain,
  Dumbbell,
  ShieldAlert,
  Activity,
  Wind,
  Shield,
} from 'lucide-react';

interface DomainCardProps {
  summary: DomainMetricSummary;
}

export const DomainCard: React.FC<DomainCardProps> = ({ summary }) => {
  const getDomainIcon = () => {
    switch (summary.domain) {
      case 'Cardio':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Sleep':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Mind':
        return <Brain className="w-4 h-4 text-purple-400" />;
      case 'Muscle-Bone':
        return <Dumbbell className="w-4 h-4 text-sky-400" />;
      case 'Immune':
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case 'Metabolic':
        return <Activity className="w-4 h-4 text-orange-400" />;
      case 'Environment':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      default:
        return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendIcon = () => {
    if (summary.trend === 'improving') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Improving</span>
        </span>
      );
    }
    if (summary.trend === 'declining') {
      return (
        <span className="flex items-center gap-1 text-rose-400 text-xs font-mono">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Declining</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
        <Minus className="w-3.5 h-3.5" />
        <span>Stable</span>
      </span>
    );
  };

  // Sensor missing / Blind spot state
  if (!summary.dataAvailable) {
    return (
      <div className="rounded-xl border border-amber-800/60 bg-amber-950/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDomainIcon()}
            <h3 className="font-mono text-sm font-bold tracking-wider text-slate-200 uppercase">
              {summary.domain}
            </h3>
          </div>
          <StatusBadge status="INSUFFICIENT_DATA" size="sm" />
        </div>

        <div className="rounded-lg border border-amber-900/60 bg-amber-950/40 p-3 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>⚠ SENSOR BLIND SPOT DETECTED</span>
          </div>
          <p className="text-xs text-amber-200/90 font-sans">
            No telemetry stream received today for {summary.domain}. Raw data is never fabricated.
          </p>
          <div className="text-xs font-mono text-amber-400 pt-1">
            Current confidence reduced: <strong>{summary.confidence}%</strong>
          </div>
        </div>
      </div>
    );
  }

  const isCritical = summary.absoluteStatus === 'CRITICAL' || summary.status === 'ATTENTION';

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 shadow transition ${
        isCritical
          ? 'border-red-500/60 bg-red-950/20 ring-1 ring-red-500/30'
          : 'border-surface-border bg-surface hover:border-slate-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getDomainIcon()}
          <h3 className="font-mono text-sm font-bold tracking-wider text-slate-200 uppercase">
            {summary.domain}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {summary.absoluteStatus && summary.absoluteStatus !== 'NORMAL' && (
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                summary.absoluteStatus === 'CRITICAL'
                  ? 'bg-red-900/80 text-red-200 border border-red-700'
                  : 'bg-amber-900/80 text-amber-200 border border-amber-700'
              }`}
            >
              ABS: {summary.absoluteStatus}
            </span>
          )}
          <StatusBadge status={summary.status} size="sm" />
        </div>
      </div>

      {/* Main Measurement */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
            {summary.currentValueDisplay}
          </span>
          <span className="text-xs font-mono text-slate-400">{summary.unit}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          {getTrendIcon()}
          <span className="text-xs font-mono text-slate-400">
            Dev: <strong className="text-slate-200">{summary.deviationDisplay}</strong>
          </span>
        </div>
      </div>

      {/* Baseline Context */}
      <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5 text-xs font-mono flex items-center justify-between">
        <span className="text-slate-400 font-sans">Personal Baseline:</span>
        <span className="text-sky-300 font-bold">{summary.personalBaselineDisplay}</span>
      </div>

      {/* Footer: Confidence */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <ConfidenceBadge confidence={summary.confidence} />
        {summary.notes && (
          <span
            className="text-[10px] text-slate-500 font-sans truncate max-w-[140px]"
            title={summary.notes}
          >
            {summary.notes}
          </span>
        )}
      </div>
    </div>
  );
};

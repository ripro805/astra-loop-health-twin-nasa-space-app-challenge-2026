'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { DynamicTimeSeriesChart } from '../../components/twin/DynamicTimeSeriesChart';
import { api } from '../../lib/api';
import { TwinForecastData } from '@astra-loop/shared';
import { GitBranch, Sparkles, TrendingUp, TrendingDown, Minus, Info, AlertTriangle } from 'lucide-react';

export default function TwinPage() {
  const [twin, setTwin] = useState<TwinForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTwin = async () => {
    try {
      setLoading(true);
      const data = await api.getTwin();
      setTwin(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
  }, []);

  return (
    <AppShell missionDay={61} onRefresh={loadTwin}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <GitBranch className="w-4 h-4" />
              <span>INDIVIDUALIZED AUTONOMIC BASELINE & PREDICTIVE TRAJECTORY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Personal Health Twin & 30-Day Predictive Forecast
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              ASTRA-LOOP calibrates against the astronaut's personal 14-day flight baseline using exponentially weighted moving averages (EWMA) and projects multi-day recovery trajectories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-600/40 px-3 py-1.5 text-xs text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              14-DAY CALIBRATED
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Axis Time Series Chart */}
        <DynamicTimeSeriesChart />

        {/* Metric Baselines Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold tracking-wider">CALIBRATED PERSONAL BASELINE ENVELOPES</span>
            <span>EWMA α = 0.20</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {twin?.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-800 bg-surface/80 p-5 space-y-3 shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      metric.zScore !== null && Math.abs(metric.zScore) > 2.0
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    Z: {metric.zScore !== null ? (metric.zScore > 0 ? `+${metric.zScore}` : metric.zScore) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-100">
                    {metric.currentValue ?? 'N/A'}
                  </span>
                  <span className="text-xs text-slate-400">Current</span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Personal Mean:</span>
                    <strong className="text-slate-200">{metric.mean}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Dev:</span>
                    <strong className="text-slate-200">±{metric.std}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Model Confidence:</span>
                    <strong>{metric.confidence}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Prognosis Dossier */}
        {twin?.forecast30DaySummary && (
          <div className="rounded-xl border border-purple-900/50 bg-purple-950/20 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  30-Day Mission Horizon Outlook
                </h3>
              </div>
              <span className="rounded bg-purple-900/60 border border-purple-700/50 text-purple-200 px-3 py-1 text-xs font-bold">
                Projected Risk: {twin.forecast30DaySummary.overallRiskProjected}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-surface p-3.5 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase font-mono block">
                  CIRCADIAN PATTERN
                </span>
                <p className="leading-relaxed">{twin.forecast30DaySummary.sleepRiskChange}</p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-surface p-3.5 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase font-mono block">
                  ALLOSTATIC FATIGUE
                </span>
                <p className="leading-relaxed">{twin.forecast30DaySummary.fatigueRiskChange}</p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-surface p-3.5 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase font-mono block">
                  PHYSIOLOGICAL RECOVERY
                </span>
                <p className="leading-relaxed">{twin.forecast30DaySummary.recoveryProjection}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

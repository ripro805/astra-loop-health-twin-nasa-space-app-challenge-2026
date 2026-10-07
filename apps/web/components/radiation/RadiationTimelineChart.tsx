'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { RadiationWatchData } from '@astra-loop/shared';
import { Radiation, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';

interface RadiationTimelineChartProps {
  watchData: RadiationWatchData;
}

export const RadiationTimelineChart: React.FC<RadiationTimelineChartProps> = ({ watchData }) => {
  const chartData = watchData.timeline.map((point) => ({
    name: `D${point.missionDay} (${point.hoursFromEvent > 0 ? '+' : ''}${point.hoursFromEvent}h)`,
    day: point.missionDay,
    hours: point.hoursFromEvent,
    doseRate: point.doseRate,
    sleepHours: point.sleepHours,
    hrv: point.hrv,
    reactionTime: point.reactionTimeMs ? Math.round(point.reactionTimeMs) : null,
  }));

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-xl border border-rose-900/60 bg-gradient-to-r from-rose-950/40 via-surface to-surface p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-900/50 p-2.5 border border-rose-600/50 text-rose-300">
              <Radiation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-rose-400">
                <span>SOLAR PARTICLE EVENT (SPE) PROTOCOL</span>
                <span>•</span>
                <span>HERO MONITORING WINDOW</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-slate-100 uppercase">
                Radiation Watch Window (72-Hour Horizon)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {watchData.watchWindowActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500 bg-rose-950 px-3 py-1.5 font-mono text-xs font-bold text-rose-300 animate-pulse">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>ACTIVE WATCH: {watchData.watchWindowHoursRemaining}H REMAINING</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300">
                <span>BACKGROUND NOMINAL (0.04 mSv/h)</span>
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="text-[11px] text-slate-400 block uppercase">Current Dose Rate</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
                {watchData.currentDoseRate}
              </span>
              <span className="text-xs text-slate-400">mSv/h</span>
            </div>
            <span className="text-[10px] text-slate-500">Nominal background: 0.04</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="text-[11px] text-slate-400 block uppercase">Cumulative Mission Dose</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {watchData.cumulativeDose}
              </span>
              <span className="text-xs text-slate-400">mSv</span>
            </div>
            <span className="text-[10px] text-slate-500">Permissible Career Margin: 94%</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="text-[11px] text-slate-400 block uppercase">Event Classification</span>
            <div className="mt-1 text-base font-bold text-slate-200 truncate">
              {watchData.eventStatus.split(' ')[0]}
            </div>
            <span className="text-[10px] text-slate-500">Class S2 Solar Proton Influx</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="text-[11px] text-slate-400 block uppercase">Multi-Sensor Coupling</span>
            <div className="mt-1 text-base font-bold text-sky-400">
              4 Delayed Modalities
            </div>
            <span className="text-[10px] text-slate-500">Sleep, HRV, PVT, Voice</span>
          </div>
        </div>
      </div>

      {/* Multi-Sensor Overlay Chart */}
      <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
              Temporal Multi-Sensor Correlation Overlay
            </h3>
            <p className="text-xs text-slate-400">
              7 Days Prior (-168h) → Radiation Peak (Day 61) → 72-Hour Post-Event Observation Window
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Dose Rate (mSv/h)
            </span>
            <span className="inline-flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> Sleep Duration (hrs)
            </span>
            <span className="inline-flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" /> HRV rMSSD (ms)
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                yAxisId="radiation"
                orientation="right"
                stroke="#f43f5e"
                domain={[0, 2.0]}
                tick={{ fill: '#f43f5e', fontSize: 11 }}
              />
              <YAxis
                yAxisId="health"
                orientation="left"
                stroke="#38bdf8"
                domain={[0, 80]}
                tick={{ fill: '#38bdf8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e1526',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine
                yAxisId="radiation"
                x="D61 (+0h)"
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: 'SPE Spike', fill: '#f43f5e', fontSize: 11, position: 'top' }}
              />
              <Bar yAxisId="radiation" dataKey="doseRate" name="Dose Rate (mSv/h)" fill="#e11d48" opacity={0.65} barSize={24} />
              <Line yAxisId="health" type="monotone" dataKey="sleepHours" name="Sleep (hrs x10)" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="health" type="monotone" dataKey="hrv" name="HRV (ms)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Science and Association Disclaimer */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold font-mono text-slate-200 uppercase">
              Important Science & Safety Requirement:
            </span>
            <p className="text-slate-400 font-sans leading-relaxed">
              {watchData.scienceNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

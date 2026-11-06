'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  GitBranch,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

interface MetricTimeSeriesData {
  streamId: string;
  name: string;
  unit: string;
  nominalMean: number;
  nominalStd: number;
  warningThreshold: number;
  criticalThreshold: number;
  dataPoints: Array<{
    day: number;
    label: string;
    actual?: number | null;
    baselineMean: number;
    baselineUpper: number;
    baselineLower: number;
    forecastValue?: number | null;
    forecastUpper?: number | null;
    forecastLower?: number | null;
  }>;
}

export const DynamicTimeSeriesChart: React.FC = () => {
  const [activeStream, setActiveStream] = useState<string>('sleep');

  // Multi-stream historical + 7-day forecast dataset grounded in Day 61 storyline
  const streams: Record<string, MetricTimeSeriesData> = {
    sleep: {
      streamId: 'sleep',
      name: 'Sleep Duration (Circadian Recovery)',
      unit: 'hours',
      nominalMean: 7.35,
      nominalStd: 0.5,
      warningThreshold: 6.0,
      criticalThreshold: 5.0,
      dataPoints: [
        { day: 54, label: 'D54', actual: 7.2, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6 },
        { day: 56, label: 'D56', actual: 7.1, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6 },
        { day: 58, label: 'D58', actual: 6.8, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6 },
        { day: 60, label: 'D60', actual: 6.4, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6 },
        { day: 61, label: 'D61 (SPE)', actual: 6.2, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6 },
        { day: 62, label: 'D62', actual: 5.8, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6, forecastValue: 5.8, forecastUpper: 6.0, forecastLower: 5.6 },
        { day: 63, label: 'D63 (CM)', actual: null, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6, forecastValue: 6.3, forecastUpper: 6.7, forecastLower: 5.9 },
        { day: 64, label: 'D64', actual: null, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6, forecastValue: 6.7, forecastUpper: 7.2, forecastLower: 6.2 },
        { day: 65, label: 'D65', actual: null, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6, forecastValue: 7.0, forecastUpper: 7.5, forecastLower: 6.5 },
        { day: 67, label: 'D67', actual: null, baselineMean: 7.35, baselineUpper: 8.1, baselineLower: 6.6, forecastValue: 7.2, forecastUpper: 7.8, forecastLower: 6.6 },
      ],
    },
    bp: {
      streamId: 'bp',
      name: 'Systolic Arterial Pressure',
      unit: 'mmHg',
      nominalMean: 118,
      nominalStd: 5.0,
      warningThreshold: 130,
      criticalThreshold: 140,
      dataPoints: [
        { day: 54, label: 'D54', actual: 116, baselineMean: 118, baselineUpper: 125, baselineLower: 110 },
        { day: 56, label: 'D56', actual: 118, baselineMean: 118, baselineUpper: 125, baselineLower: 110 },
        { day: 58, label: 'D58', actual: 120, baselineMean: 118, baselineUpper: 125, baselineLower: 110 },
        { day: 60, label: 'D60', actual: 124, baselineMean: 118, baselineUpper: 125, baselineLower: 110 },
        { day: 61, label: 'D61 (SPE)', actual: 128, baselineMean: 118, baselineUpper: 125, baselineLower: 110 },
        { day: 62, label: 'D62', actual: 134, baselineMean: 118, baselineUpper: 125, baselineLower: 110, forecastValue: 134, forecastUpper: 138, forecastLower: 130 },
        { day: 63, label: 'D63 (CM)', actual: null, baselineMean: 118, baselineUpper: 125, baselineLower: 110, forecastValue: 128, forecastUpper: 134, forecastLower: 122 },
        { day: 64, label: 'D64', actual: null, baselineMean: 118, baselineUpper: 125, baselineLower: 110, forecastValue: 124, forecastUpper: 130, forecastLower: 118 },
        { day: 65, label: 'D65', actual: null, baselineMean: 118, baselineUpper: 125, baselineLower: 110, forecastValue: 121, forecastUpper: 127, forecastLower: 115 },
        { day: 67, label: 'D67', actual: null, baselineMean: 118, baselineUpper: 125, baselineLower: 110, forecastValue: 119, forecastUpper: 125, forecastLower: 113 },
      ],
    },
    glucose: {
      streamId: 'glucose',
      name: 'Venous Blood Glucose',
      unit: 'mg/dL',
      nominalMean: 92,
      nominalStd: 6.0,
      warningThreshold: 125,
      criticalThreshold: 140,
      dataPoints: [
        { day: 54, label: 'D54', actual: 90, baselineMean: 92, baselineUpper: 101, baselineLower: 83 },
        { day: 56, label: 'D56', actual: 93, baselineMean: 92, baselineUpper: 101, baselineLower: 83 },
        { day: 58, label: 'D58', actual: 95, baselineMean: 92, baselineUpper: 101, baselineLower: 83 },
        { day: 60, label: 'D60', actual: 99, baselineMean: 92, baselineUpper: 101, baselineLower: 83 },
        { day: 61, label: 'D61 (SPE)', actual: 108, baselineMean: 92, baselineUpper: 101, baselineLower: 83 },
        { day: 62, label: 'D62', actual: 118, baselineMean: 92, baselineUpper: 101, baselineLower: 83, forecastValue: 118, forecastUpper: 124, forecastLower: 112 },
        { day: 63, label: 'D63 (CM)', actual: null, baselineMean: 92, baselineUpper: 101, baselineLower: 83, forecastValue: 110, forecastUpper: 118, forecastLower: 102 },
        { day: 64, label: 'D64', actual: null, baselineMean: 92, baselineUpper: 101, baselineLower: 83, forecastValue: 102, forecastUpper: 110, forecastLower: 94 },
        { day: 65, label: 'D65', actual: null, baselineMean: 92, baselineUpper: 101, baselineLower: 83, forecastValue: 96, forecastUpper: 104, forecastLower: 88 },
        { day: 67, label: 'D67', actual: null, baselineMean: 92, baselineUpper: 101, baselineLower: 83, forecastValue: 93, forecastUpper: 100, forecastLower: 86 },
      ],
    },
    hrv: {
      streamId: 'hrv',
      name: 'Heart Rate Variability (rMSSD Autonomic Tone)',
      unit: 'ms',
      nominalMean: 68,
      nominalStd: 4.0,
      warningThreshold: 45,
      criticalThreshold: 35,
      dataPoints: [
        { day: 54, label: 'D54', actual: 66, baselineMean: 68, baselineUpper: 74, baselineLower: 62 },
        { day: 56, label: 'D56', actual: 64, baselineMean: 68, baselineUpper: 74, baselineLower: 62 },
        { day: 58, label: 'D58', actual: 58, baselineMean: 68, baselineUpper: 74, baselineLower: 62 },
        { day: 60, label: 'D60', actual: 52, baselineMean: 68, baselineUpper: 74, baselineLower: 62 },
        { day: 61, label: 'D61 (SPE)', actual: 47.5, baselineMean: 68, baselineUpper: 74, baselineLower: 62 },
        { day: 62, label: 'D62', actual: 43.0, baselineMean: 68, baselineUpper: 74, baselineLower: 62, forecastValue: 43.0, forecastUpper: 46.0, forecastLower: 40.0 },
        { day: 63, label: 'D63 (CM)', actual: null, baselineMean: 68, baselineUpper: 74, baselineLower: 62, forecastValue: 49.0, forecastUpper: 55.0, forecastLower: 43.0 },
        { day: 64, label: 'D64', actual: null, baselineMean: 68, baselineUpper: 74, baselineLower: 62, forecastValue: 58.0, forecastUpper: 65.0, forecastLower: 51.0 },
        { day: 65, label: 'D65', actual: null, baselineMean: 68, baselineUpper: 74, baselineLower: 62, forecastValue: 63.0, forecastUpper: 70.0, forecastLower: 56.0 },
        { day: 67, label: 'D67', actual: null, baselineMean: 68, baselineUpper: 74, baselineLower: 62, forecastValue: 66.0, forecastUpper: 72.0, forecastLower: 60.0 },
      ],
    },
  };

  const currentStream = streams[activeStream] || streams.sleep;

  return (
    <div className="rounded-xl border border-slate-800 bg-surface/80 p-6 shadow-xl space-y-6 font-mono">
      {/* Stream Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block mb-0.5">
            DYNAMIC TIME-SERIES WITH FORECAST CONE
          </span>
          <h3 className="text-base font-bold text-slate-100">{currentStream.name}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'sleep', label: 'Sleep' },
            { id: 'bp', label: 'Blood Pressure' },
            { id: 'glucose', label: 'Glucose' },
            { id: 'hrv', label: 'HRV' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStream(tab.id)}
              className={`rounded px-3 py-1.5 transition ${
                activeStream === tab.id
                  ? 'border border-sky-500 bg-sky-950/80 text-sky-200 font-bold'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentStream.dataPoints}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              domain={['auto', 'auto']}
              unit={` ${currentStream.unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            {/* Shaded Personal Baseline Zone (Mean ± 1.5 SD) */}
            <Area
              type="monotone"
              dataKey="baselineUpper"
              stroke="none"
              fill="#38bdf8"
              fillOpacity={0.12}
              name="Baseline Range (±1.5 SD)"
            />

            {/* Shaded Forecast Cone */}
            <Area
              type="monotone"
              dataKey="forecastUpper"
              stroke="none"
              fill="#a855f7"
              fillOpacity={0.15}
              name="7-Day Forecast Cone"
            />

            {/* Nominal Baseline Mean Line */}
            <Line
              type="monotone"
              dataKey="baselineMean"
              stroke="#0284c7"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              name="Personal Baseline Mean"
            />

            {/* Observed Actual Readings */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name="Telemetry Observations"
            />

            {/* Dotted Countermeasure Forecast Line */}
            <Line
              type="monotone"
              dataKey="forecastValue"
              stroke="#c084fc"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#c084fc' }}
              name="Forecast Outlook (Post-CM)"
            />

            {/* Warning Threshold Line */}
            <ReferenceLine
              y={currentStream.warningThreshold}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: `Warning (${currentStream.warningThreshold})`,
                fill: '#f59e0b',
                fontSize: 10,
                position: 'right',
              }}
            />

            {/* Critical Absolute Threshold Line */}
            <ReferenceLine
              y={currentStream.criticalThreshold}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                value: `Critical (${currentStream.criticalThreshold})`,
                fill: '#ef4444',
                fontSize: 10,
                position: 'right',
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Legend Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-sky-500/20 border border-sky-400" />
          <span>Calibrated 14-Day Baseline Mean ± 1.5 SD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-400" />
          <span>7-Day Countermeasure Response Cone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500" />
          <span>NASA-STD-3001 Absolute Safety Floor/Ceiling</span>
        </div>
      </div>
    </div>
  );
};

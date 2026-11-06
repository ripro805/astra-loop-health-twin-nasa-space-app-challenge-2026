'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { RadiationTimelineChart } from '../../components/radiation/RadiationTimelineChart';
import { api } from '../../lib/api';
import { RadiationWatchData } from '@astra-loop/shared';
import {
  Radiation,
  Shield,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function RadiationPage() {
  const [watchData, setWatchData] = useState<RadiationWatchData | null>(null);
  const [spaceWeather, setSpaceWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [watch, weather] = await Promise.all([
        api.getRadiationWatch(),
        api.getCurrentSpaceWeather(),
      ]);
      setWatchData(watch);
      setSpaceWeather(weather);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const careerLimitMsv = 600.0;
  const cumulativeDose = watchData?.cumulativeDose ?? 19.72;
  const careerPct = ((cumulativeDose / careerLimitMsv) * 100).toFixed(1);

  return (
    <AppShell missionDay={watchData?.missionDay ?? 61} onRefresh={loadData}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Radiation className="w-4 h-4" />
              <span>IONIZING RADIATION DOSIMETRY & SOLAR WATCH</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Solar Particle Event (SPE) & Space Weather Horizon
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Tracks galactic cosmic radiation (GCR) and solar particle events with NASA career limit exposure thresholds and real-time NOAA SWPC telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-rose-950/80 border border-rose-600/40 px-3 py-1.5 text-xs text-rose-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              DAY 61 SPE HERO SCENARIO
            </span>
          </div>
        </div>

        {/* 3 Overview Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. NASA Career Exposure Limit Gauge */}
          <div className="rounded-xl border border-slate-800 bg-surface/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                NASA CAREER DOSE LIMIT
              </span>
              <Shield className="w-4 h-4 text-sky-400" />
            </div>

            <div>
              <div className="text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                <span>{cumulativeDose.toFixed(2)}</span>
                <span className="text-xs font-normal text-slate-400">/ {careerLimitMsv} mSv</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {careerPct}% of NASA-STD-3001 career REID ceiling utilized
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${Math.min(100, parseFloat(careerPct))}%` }}
              />
            </div>
          </div>

          {/* 2. Space Weather Live Proton Flux */}
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-5 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                <span>NOAA SWPC TELEMETRY</span>
              </span>
              <span className="rounded bg-rose-900/60 text-rose-200 px-2 py-0.5 text-[9px] font-bold">
                {spaceWeather?.protonFluxScale || 'S3-STRONG'}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-rose-300">
                {spaceWeather?.doseRateEstimateMsvHr ?? 1.45} mSv/h
              </div>
              <span className="text-[10px] text-slate-400">
                {spaceWeather?.solarFlareAlert || 'SOLAR PARTICLE STORM ACTIVE'}
              </span>
            </div>

            <div className="text-[10px] text-slate-500 truncate" title={spaceWeather?.source}>
              Source: {spaceWeather?.source || 'NOAA SWPC GOES Satellites'}
            </div>
          </div>

          {/* 3. Storm Shelter Status & Protocol */}
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-5 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                STORM SHELTER STATUS
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <div className="text-lg font-bold text-amber-300">WATER WALL BAY ENGAGED</div>
              <span className="text-[10px] text-slate-400">
                Shielding Factor: 0.40 (60% ionizing attenuation)
              </span>
            </div>

            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>All 4 crew logged inside shielded perimeter</span>
            </div>
          </div>
        </div>

        {/* Timeline Multi-Axis Chart */}
        {watchData ? (
          <RadiationTimelineChart watchData={watchData} />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-surface p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading radiation timeline trajectory...
          </div>
        )}
      </div>
    </AppShell>
  );
}

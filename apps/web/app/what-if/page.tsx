'use client';

import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';

export default function WhatIfPage() {
  const [radiation, setRadiation] = useState(55);
  const [sleep, setSleep] = useState(6.2);
  const [exercise, setExercise] = useState(40);
  const [stress, setStress] = useState(58);

  const risk = Math.min(100, Math.round((radiation * 0.35 + (10 - sleep) * 9 + exercise * 0.25 + stress * 0.3) / 1.2));

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-white">What-If Simulator</h1>
          <p className="mt-2 text-sm text-slate-300">Simulate a 30-day continuation of the current pattern. This is a prototype storyline for communication and design, not a medical prediction.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 rounded-xl border border-surface-border bg-surface p-6">
            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-200"><span>Radiation exposure</span><span>{radiation}%</span></div>
              <input type="range" min={0} max={100} value={radiation} onChange={(e) => setRadiation(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-200"><span>Sleep duration</span><span>{sleep.toFixed(1)}h</span></div>
              <input type="range" min={4} max={10} step={0.1} value={sleep} onChange={(e) => setSleep(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-200"><span>Exercise load</span><span>{exercise}%</span></div>
              <input type="range" min={0} max={100} value={exercise} onChange={(e) => setExercise(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-200"><span>Stress</span><span>{stress}%</span></div>
              <input type="range" min={0} max={100} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="w-full" />
            </label>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-6">
            <div className="text-xs font-mono uppercase tracking-[0.2rem] text-amber-300">Projected risk</div>
            <div className="mt-3 text-5xl font-black text-white">{risk}/100</div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div>Sleep risk: {risk > 60 ? '↑ Increased' : '→ Stable'}</div>
              <div>Fatigue risk: {risk > 52 ? '↑ Increased' : '→ Stable'}</div>
              <div>Recovery: {risk > 65 ? '↓ Reduced' : '→ Stable'}</div>
              <div>Overall risk: {risk > 60 ? '↑ Increased' : '→ Stable'}</div>
            </div>
            <p className="mt-5 text-xs text-slate-400">Simulation only. This is not a medical prediction.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

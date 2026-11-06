'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { api } from '../../lib/api';
import { WhatIfInput, WhatIfOutput } from '@astra-loop/shared';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  RotateCcw,
  Activity,
  Heart,
  Wind,
  Globe,
  Users,
} from 'lucide-react';

export default function WhatIfPage() {
  const [radiation, setRadiation] = useState(55);
  const [sleep, setSleep] = useState(6.2);
  const [exercise, setExercise] = useState(65);
  const [stress, setStress] = useState(58);
  const [cabinCO2, setCabinCO2] = useState(1200);
  const [gravityG, setGravityG] = useState(0.0);
  const [systolicBP, setSystolicBP] = useState(122);
  const [bloodGlucose, setBloodGlucose] = useState(98);
  const [socialContact, setSocialContact] = useState(45);

  const [output, setOutput] = useState<WhatIfOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const input: WhatIfInput = {
      radiationExposure: radiation,
      sleepDuration: sleep,
      exerciseLoad: exercise,
      stress,
      cabinCO2ppm: cabinCO2,
      gravityG,
      systolicBP,
      bloodGlucose,
      socialContactMinutes: socialContact,
    };

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.simulateWhatIf(input);
        setOutput(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(handler);
  }, [radiation, sleep, exercise, stress, cabinCO2, gravityG, systolicBP, bloodGlucose, socialContact]);

  const handleResetDefaults = () => {
    setRadiation(55);
    setSleep(6.2);
    setExercise(65);
    setStress(58);
    setCabinCO2(1200);
    setGravityG(0.0);
    setSystolicBP(122);
    setBloodGlucose(98);
    setSocialContact(45);
  };

  const getDeltaBadge = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-bold text-sm bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
          <TrendingUp className="w-4 h-4" />
          <span>+{delta} pts Risk</span>
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
          <TrendingDown className="w-4 h-4" />
          <span>{delta} pts Recovery</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-400 font-bold text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
        <Minus className="w-4 h-4" />
        <span>No Change</span>
      </span>
    );
  };

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>MULTIDIMENSIONAL COUNTERMEASURE & RISK EXPLORER</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Interactive What-If Scenario Simulator
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Simulates dynamic interactions across radiation, microgravity unloading, hypercapnia, hemodynamic load, and metabolic excursions.
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline Telemetry</span>
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Sliders Panel */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-surface/70 p-6 space-y-5">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              Environmental & Physiological Input Levers
            </h2>

            {/* Slider 1: Sleep */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">1. Sleep Duration:</span>
                <span className="text-sky-300 font-bold">{sleep.toFixed(1)} hours/night</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={10.0}
                step={0.1}
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>4.0h (Severe debt)</span>
                <span>7.35h (Personal Baseline)</span>
                <span>10.0h</span>
              </div>
            </label>

            {/* Slider 2: Radiation */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">2. Radiation Exposure Level:</span>
                <span className="text-rose-400 font-bold">{radiation} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={radiation}
                onChange={(e) => setRadiation(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Storm shelter)</span>
                <span>50 (Nominal GCR)</span>
                <span>100 (Unshielded SPE)</span>
              </div>
            </label>

            {/* Slider 3: Cabin CO2 */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">3. Cabin CO2 Concentration:</span>
                <span className="text-amber-300 font-bold">{cabinCO2} ppm</span>
              </div>
              <input
                type="range"
                min={400}
                max={5000}
                step={50}
                value={cabinCO2}
                onChange={(e) => setCabinCO2(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>400 (Earth ambient)</span>
                <span>1800 (Nominal ISS)</span>
                <span>5000 (SMAC Hypercapnia limit)</span>
              </div>
            </label>

            {/* Slider 4: Gravity */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">4. Gravity Loading Field:</span>
                <span className="text-indigo-300 font-bold">{gravityG} g</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.02}
                value={gravityG}
                onChange={(e) => setGravityG(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0g (Transit/ISS)</span>
                <span>0.16g (Moon)</span>
                <span>0.38g (Mars)</span>
                <span>1.0g (Earth)</span>
              </div>
            </label>

            {/* Slider 5: Systolic Blood Pressure */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">5. Arterial Systolic BP:</span>
                <span className="text-red-400 font-bold">{systolicBP} mmHg</span>
              </div>
              <input
                type="range"
                min={90}
                max={180}
                value={systolicBP}
                onChange={(e) => setSystolicBP(parseInt(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>90 (Hypotension)</span>
                <span>118 (Optimal)</span>
                <span>140+ (Hypertension)</span>
              </div>
            </label>

            {/* Slider 6: Blood Glucose */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">6. Venous Blood Glucose:</span>
                <span className="text-orange-300 font-bold">{bloodGlucose} mg/dL</span>
              </div>
              <input
                type="range"
                min={60}
                max={220}
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>60 (Hypoglycemic)</span>
                <span>95 (Fasting nominal)</span>
                <span>180+ (Spike)</span>
              </div>
            </label>

            {/* Slider 7: Exercise Load */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">7. Daily Resistive/Aerobic Exercise:</span>
                <span className="text-emerald-300 font-bold">{exercise}% compliance</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={exercise}
                onChange={(e) => setExercise(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </label>

            {/* Slider 8: Social Contact */}
            <label className="block space-y-1.5">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="font-bold">8. Crew Social Interaction:</span>
                <span className="text-purple-300 font-bold">{socialContact} min/day</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={5}
                value={socialContact}
                onChange={(e) => setSocialContact(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Total Isolation)</span>
                <span>45 (Nominal)</span>
                <span>180 (High Co-op)</span>
              </div>
            </label>
          </div>

          {/* Real-Time Projected Output Dossier */}
          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-surface-elevated p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                PROJECTED COMPOSITE OUTCOME
              </span>
              {loading && <span className="text-[10px] text-slate-400 animate-pulse">Computing...</span>}
            </div>

            {output ? (
              <div className="space-y-5">
                {/* Score & Delta */}
                <div className="rounded-xl border border-slate-800 bg-surface p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">ALLOSTATIC RISK SCORE</span>
                    <div className="text-4xl font-black text-slate-100 tracking-tight mt-0.5">
                      {output.simulatedRiskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-500 block">Baseline: 42</span>
                    {getDeltaBadge(output.delta)}
                  </div>
                </div>

                {/* Sub-system Dynamics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-800 bg-slate-900/50 p-2.5">
                    <span className="text-[10px] text-slate-500 block">SLEEP RISK</span>
                    <span className="font-bold text-slate-200">{output.sleepRiskChange}</span>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/50 p-2.5">
                    <span className="text-[10px] text-slate-500 block">FATIGUE INDEX</span>
                    <span className="font-bold text-slate-200">{output.fatigueRiskChange}</span>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/50 p-2.5">
                    <span className="text-[10px] text-slate-500 block">CARDIOPULMONARY</span>
                    <span className="font-bold text-slate-200">{output.cardioRiskChange || 'STABLE'}</span>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/50 p-2.5">
                    <span className="text-[10px] text-slate-500 block">RECOVERY CAPACITY</span>
                    <span className="font-bold text-slate-200">{output.recoveryChange}</span>
                  </div>
                </div>

                {/* Algorithmic Explanation */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    <span>MECHANISTIC PROJECTION ANALYSIS:</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {output.explanation}
                  </p>
                </div>

                {/* Scientific Note */}
                <div className="text-[10px] text-slate-500 font-sans leading-relaxed border-t border-slate-800 pt-3">
                  Models non-linear compound interaction terms (e.g. radiation × sleep debt) and absolute clinical threshold overrides. Grounded in NASA HRP risk models.
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                Adjust levers to compute projected physiological trajectory.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

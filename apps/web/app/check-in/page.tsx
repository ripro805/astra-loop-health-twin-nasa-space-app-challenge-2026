'use client';

import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ReactionTest } from '../../components/checkin/ReactionTest';
import { VoiceRecorder } from '../../components/checkin/VoiceRecorder';
import { api } from '../../lib/api';
import {
  ClipboardCheck,
  HeartPulse,
  Activity,
  Thermometer,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function CheckInPage() {
  const [mood, setMood] = useState(7);
  const [fatigue, setFatigue] = useState(4);
  const [stress, setStress] = useState(4);
  const [systolicBP, setSystolicBP] = useState(118);
  const [diastolicBP, setDiastolicBP] = useState(78);
  const [bloodGlucose, setBloodGlucose] = useState(94);
  const [bodyTemp, setBodyTemp] = useState(36.8);
  const [spo2, setSpo2] = useState(98.5);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [voiceCadence, setVoiceCadence] = useState<number | null>(null);
  const [textFallback, setTextFallback] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSavedMessage(null);
    try {
      const payload = {
        mood,
        fatigue,
        stress,
        reactionTimeMs: reactionMs,
        voiceCadence,
        systolicBP,
        diastolicBP,
        bloodGlucose,
        bodyTemp,
        spo2,
      };

      const res = await api.submitCheckIn(payload);
      setSavedMessage(
        res.message || 'Daily check-in and vital signs saved successfully.'
      );
    } catch (err: any) {
      setSavedMessage(`Error: ${err.message || 'Submission failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <ClipboardCheck className="w-4 h-4" />
              <span>ASTRONAUT OPERATIONAL LOG & OBJECTIVE TELEMETRY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Daily Clinical Check-In & Vital Signs Entry
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              3-minute morning operational review combining psychomotor vigilance, acoustic voice prosody, and physiological vitals. Missing sensors reduce confidence but are never fabricated.
            </p>
          </div>
        </div>

        {savedMessage && (
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Subjective & Vital Signs Sliders */}
          <div className="lg:col-span-6 space-y-5">
            {/* Subjective Scales */}
            <div className="rounded-xl border border-slate-800 bg-surface/70 p-5 space-y-4">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                1. Subjective Neuro-Behavioral Self-Report
              </h2>

              {/* Mood */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subjective Mood:</span>
                  <span className="text-sky-300 font-bold">{mood}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Depressed/Flat)</span>
                  <span>10 (Optimal Morale)</span>
                </div>
              </div>

              {/* Fatigue */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subjective Fatigue (Samn-Perelli):</span>
                  <span className="text-amber-300 font-bold">{fatigue}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={fatigue}
                  onChange={(e) => setFatigue(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Fully Alert)</span>
                  <span>10 (Exhausted/Impaired)</span>
                </div>
              </div>

              {/* Stress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Perceived Stress Level:</span>
                  <span className="text-rose-300 font-bold">{stress}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Relaxed)</span>
                  <span>10 (Extreme Tension)</span>
                </div>
              </div>
            </div>

            {/* Objective Physiological Vitals */}
            <div className="rounded-xl border border-slate-800 bg-surface/70 p-5 space-y-4">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                2. Physiological Telemetry Entry (v2 Additions)
              </h2>

              {/* BP */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    <span>Blood Pressure (Systolic / Diastolic):</span>
                  </span>
                  <span className="text-rose-300 font-bold">
                    {systolicBP} / {diastolicBP} mmHg
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="range"
                    min={90}
                    max={180}
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <input
                    type="range"
                    min={60}
                    max={120}
                    value={diastolicBP}
                    onChange={(e) => setDiastolicBP(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Systolic (90-180)</span>
                  <span>Diastolic (60-120)</span>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Activity className="w-3.5 h-3.5 text-orange-400" />
                    <span>Venous Blood Glucose:</span>
                  </span>
                  <span className="text-orange-300 font-bold">{bloodGlucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={200}
                  value={bloodGlucose}
                  onChange={(e) => setBloodGlucose(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>60 (Low)</span>
                  <span>95 (Fasting nominal)</span>
                  <span>140+ (Postprandial/Elevated)</span>
                </div>
              </div>

              {/* Body Temp */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Thermometer className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Core Body Temperature:</span>
                  </span>
                  <span className="text-yellow-300 font-bold">{bodyTemp.toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min={35.0}
                  max={39.5}
                  step={0.1}
                  value={bodyTemp}
                  onChange={(e) => setBodyTemp(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>35.0°C (Hypothermia)</span>
                  <span>36.8°C (Nominal)</span>
                  <span>38.0°C+ (Pyrexia)</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Pulse Oximetry (SpO2):</span>
                  <span className="text-emerald-300 font-bold">{spo2.toFixed(1)} %</span>
                </div>
                <input
                  type="range"
                  min={85}
                  max={100}
                  step={0.5}
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Reaction Test & Voice Cadence */}
          <div className="lg:col-span-6 space-y-5">
            <ReactionTest onScoreCaptured={setReactionMs} initialScore={reactionMs} />
            <VoiceRecorder
              onCadenceCaptured={(cadence, isAvailable) => {
                setVoiceCadence(cadence);
                if (!isAvailable) setVoiceCadence(null);
              }}
              onTextFallbackCaptured={setTextFallback}
            />

            {/* Submission Card */}
            <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    TELEMETRY READY
                  </span>
                  <h3 className="text-base font-bold text-slate-100">
                    Transmit Mission Day 61 Packet
                  </h3>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition shadow disabled:opacity-50"
                >
                  {submitting ? 'Transmitting to DTN...' : 'Submit Daily Check-In'}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                If spacecraft is currently within ground comms line-of-sight, telemetry commits immediately to local twin. If comms link is down, packet buffers automatically in offline Delay-Tolerant Networking storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

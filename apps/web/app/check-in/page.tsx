'use client';

import { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ReactionTest } from '../../components/checkin/ReactionTest';
import { VoiceRecorder } from '../../components/checkin/VoiceRecorder';

export default function CheckInPage() {
  const [mood, setMood] = useState(5);
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(5);
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [voiceCadence, setVoiceCadence] = useState<number | null>(null);
  const [textFallback, setTextFallback] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    localStorage.setItem(
      'astra_checkin_local',
      JSON.stringify({ mood, fatigue, stress, reactionMs, voiceCadence, textFallback })
    );
    setSaved(true);
  };

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-white">Daily Check-In</h1>
          <p className="mt-2 text-sm text-slate-300">3-minute operational review for the astronaut. Voice capture is optional. Missing data is never fabricated.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-surface-border bg-surface p-5">
              <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2rem] text-slate-200">Mood</h2>
              <input type="range" min={0} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} className="mt-4 w-full" />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Calm</span>
                <span className="font-bold text-sky-300">{mood}/10</span>
                <span>Stressed</span>
              </div>
            </div>

            <div className="rounded-xl border border-surface-border bg-surface p-5">
              <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2rem] text-slate-200">Fatigue</h2>
              <input type="range" min={0} max={10} value={fatigue} onChange={(e) => setFatigue(Number(e.target.value))} className="mt-4 w-full" />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Fresh</span>
                <span className="font-bold text-amber-300">{fatigue}/10</span>
                <span>Exhausted</span>
              </div>
            </div>

            <div className="rounded-xl border border-surface-border bg-surface p-5">
              <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2rem] text-slate-200">Stress</h2>
              <input type="range" min={0} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="mt-4 w-full" />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>Low</span>
                <span className="font-bold text-rose-300">{stress}/10</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ReactionTest onScoreCaptured={setReactionMs} initialScore={reactionMs} />
            <VoiceRecorder onCadenceCaptured={(cadence, isAvailable) => { setVoiceCadence(cadence); if (!isAvailable) setVoiceCadence(null); }} onTextFallbackCaptured={setTextFallback} />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2rem] text-emerald-300">Check-in complete</div>
              <div className="mt-2 text-lg font-bold text-white">Data saved locally. Sync will occur when connectivity returns.</div>
            </div>
            <button onClick={handleSubmit} className="rounded-lg border border-emerald-500 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              Save Local Check-In
            </button>
          </div>
          {saved && <div className="mt-4 text-sm text-emerald-300">Check-in saved locally in offline-first storage.</div>}
        </div>
      </div>
    </AppShell>
  );
}

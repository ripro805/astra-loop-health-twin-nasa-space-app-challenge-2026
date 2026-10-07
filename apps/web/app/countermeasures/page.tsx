import { AppShell } from '../../components/layout/AppShell';
import { LearnLoopSummary } from '../../components/countermeasures/LearnLoopSummary';

async function getCountermeasures() {
  try {
    const res = await fetch('http://localhost:4000/api/astronauts/demo/countermeasures', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CountermeasuresPage() {
  const data = (await getCountermeasures()) ?? {
    countermeasures: [
      { type: 'SLEEP_PHASE_ADJUSTMENT', recommendation: 'Advance sleep schedule by 30 minutes and attenuate blue light before sleep.', reason: 'Sleep is 15% below personal baseline.', status: 'ACTIVE' },
      { type: 'LIGHTING_SCHEDULE', recommendation: 'Use dim warm-spectrum lighting during recovery period.', reason: 'Circadian drift is contributing to fatigue.', status: 'RECOMMENDED' },
      { type: 'RECOVERY_PERIOD', recommendation: 'Add quiet recovery period before next high-load task.', reason: 'Selective protection from overstimulation and task-load accumulation.', status: 'RECOMMENDED' },
    ],
    ranking: [
      { id: 'sleep', type: 'SLEEP_PHASE_ADJUSTMENT', title: 'Sleep Phase Adjustment', recommendation: 'Advance sleep schedule by 30 minutes with blue-light attenuation.', evaluationCount: 1, overallResult: 'PROMISING', confidence: 72, averageEffectZScore: 1.2, lastAppliedMissionDay: 63 },
      { id: 'lighting', type: 'LIGHTING_SCHEDULE', title: 'Lighting Schedule', recommendation: 'Warm light and reduced late-night stimulation.', evaluationCount: 1, overallResult: 'PROMISING', confidence: 64, averageEffectZScore: 0.8, lastAppliedMissionDay: 31 },
      { id: 'recovery', type: 'RECOVERY_PERIOD', title: 'Recovery Period', recommendation: 'Quiet recovery period between tasks.', evaluationCount: 1, overallResult: 'UNCERTAIN', confidence: 41, averageEffectZScore: 0.1, lastAppliedMissionDay: 21 },
    ],
  };

  const recommendations = Array.isArray(data?.countermeasures)
    ? data.countermeasures
    : Array.isArray(data?.recommendations)
      ? data.recommendations
      : [];

  const ranking = Array.isArray(data?.ranking) ? data.ranking : [];

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-white">Countermeasures</h1>
          <p className="mt-2 text-sm text-slate-300">Safe, non-clinical recommendations that are tracked for 48–72 hours to determine whether the action appears to improve recovery.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-xl border border-surface-border bg-surface p-6">
            <h2 className="text-lg font-bold uppercase tracking-[0.2rem] text-white">Recommended action</h2>
            {recommendations.map((item: any) => (
              <div key={item.type ?? item.id ?? item.recommendation} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-xs font-mono uppercase tracking-[0.2rem] text-sky-300">{item.type}</div>
                <h3 className="mt-2 text-lg font-bold text-white">{item.recommendation}</h3>
                <p className="mt-2 text-sm text-slate-300">Reason: {item.reason}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Expected observation window: 48–72 hours</span>
                  <span className="text-emerald-300">Safety: Non-clinical recommendation</span>
                </div>
              </div>
            ))}
          </div>

          <LearnLoopSummary ranking={ranking} latestEvaluation={{ action: 'Sleep phase adjustment', beforeScore: -1.8, afterScore: -0.6, effect: 1.2, confidence: 72, result: 'PROMISING' }} />
        </div>
      </div>
    </AppShell>
  );
}

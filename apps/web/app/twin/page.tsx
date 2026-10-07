import { AppShell } from '../../components/layout/AppShell';

async function getTwinData() {
  try {
    const res = await fetch('http://localhost:4000/api/astronauts/demo/twin', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TwinPage() {
  const twin = (await getTwinData()) ?? {
    calibrationPeriodDays: 14,
    ewmaAlpha: 0.2,
    metrics: [
      { label: 'HR', mean: 62, std: 2.4, ewma: 63.5, currentValue: 67.2, zScore: 1.5, confidence: 89 },
      { label: 'HRV', mean: 68, std: 3.6, ewma: 60.4, currentValue: 47.5, zScore: -4.2, confidence: 89 },
      { label: 'Sleep', mean: 7.35, std: 0.5, ewma: 6.7, currentValue: 6.2, zScore: -2.3, confidence: 87 },
      { label: 'Reaction Time', mean: 230, std: 18, ewma: 268, currentValue: 282, zScore: 2.9, confidence: 82 },
    ],
    forecast7Day: [
      { day: 1, fatigueTrend: 'Increasing', sleepTrend: 'Decreasing', recoveryTrend: 'Stable', simulatedFatigueRisk: 62, simulatedSleepRisk: 58, confidence: 72 },
      { day: 2, fatigueTrend: 'Increasing', sleepTrend: 'Decreasing', recoveryTrend: 'Stable', simulatedFatigueRisk: 67, simulatedSleepRisk: 61, confidence: 70 },
      { day: 3, fatigueTrend: 'Increasing', sleepTrend: 'Decreasing', recoveryTrend: 'Stable', simulatedFatigueRisk: 70, simulatedSleepRisk: 64, confidence: 68 },
    ],
    forecast30DaySummary: {
      sleepRiskChange: 'Sleep risk is projected to rise through the next 30 days if the current pattern continues.',
      fatigueRiskChange: 'Fatigue risk is projecting higher due to sustained sleep debt and elevated recovery deficit.',
      recoveryProjection: 'Recovery remains variable and should be watched closely.',
      overallRiskProjected: 71,
      confidence: 68,
    },
  };

  return (
    <AppShell missionDay={61}>
      <div className="space-y-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-white">Personal Health Twin</h1>
          <p className="mt-2 text-sm text-slate-300">ASTRA-LOOP compares the astronaut with their own historical pattern rather than a generic population average.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {twin.metrics.map((metric: any) => (
            <div key={metric.label} className="rounded-xl border border-slate-800 bg-surface p-5">
              <div className="text-xs font-mono uppercase tracking-[0.2rem] text-sky-300">{metric.label}</div>
              <div className="mt-3 text-2xl font-black text-white">{metric.currentValue ?? 'N/A'}</div>
              <div className="mt-2 text-xs text-slate-400">Mean {metric.mean} • Std {metric.std}</div>
              <div className="mt-2 text-xs text-slate-300">Z-score: {metric.zScore ?? 'N/A'}</div>
              <div className="mt-2 text-xs text-emerald-300">Confidence {metric.confidence}%</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h2 className="text-lg font-bold uppercase tracking-[0.2rem] text-white">Simulated forecast</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {twin.forecast7Day.map((item: any) => (
              <div key={item.day} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <div className="text-xs font-mono uppercase tracking-[0.2rem] text-slate-400">Day {item.day}</div>
                <div className="mt-2 text-sm text-slate-200">Fatigue: {item.fatigueTrend}</div>
                <div className="text-sm text-slate-200">Sleep: {item.sleepTrend}</div>
                <div className="text-sm text-slate-200">Recovery: {item.recoveryTrend}</div>
                <div className="mt-2 text-xs text-amber-300">Risk {item.simulatedFatigueRisk}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

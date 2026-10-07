import { AppShell } from '../../components/layout/AppShell';

async function getChanges() {
  try {
    const res = await fetch('http://localhost:4000/api/astronauts/demo/changes', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function WhatChangedPage() {
  const data = (await getChanges()) ?? {
    missionDay: 61,
    recentChanges: [
      { title: 'Sleep duration decreased', domain: 'Sleep', detectedChange: '↓ 15%', confidence: 87, dataSources: ['Wearable', 'Self-report'], whyThisMatters: 'Persistent sleep debt may contribute to fatigue and slower cognition.', riskContributionWeight: 25 },
      { title: 'HRV below personal baseline', domain: 'Cardio', detectedChange: '↓ 1.4z', confidence: 89, dataSources: ['Wearable'], whyThisMatters: 'Reduced autonomic recovery and elevated stress load.', riskContributionWeight: 20 },
      { title: 'Reaction time increased', domain: 'Mind', detectedChange: '↑ 52 ms', confidence: 82, dataSources: ['Check-in'], whyThisMatters: 'Lower alertness linked with sleep deficit and fatigue.', riskContributionWeight: 14 },
    ],
    riskContributions: [
      { name: 'Sleep debt', score: 35 },
      { name: 'Radiation event', score: 28 },
      { name: 'HRV deviation', score: 18 },
      { name: 'Mood change', score: 12 },
    ],
  };

  return (
    <AppShell missionDay={data.missionDay}>
      <div className="space-y-6">
        <div className="rounded-xl border border-surface-border bg-surface p-6">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2rem] text-white">What Changed</h1>
          <p className="mt-2 text-sm text-slate-300">Compare the latest measurements against the astronaut’s own 14-day personal baseline and highlight the drivers of simulated risk.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-xl border border-surface-border bg-surface p-6">
            {data.recentChanges.map((item: any, index: number) => (
              <div key={index} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2rem] text-sky-300">{item.domain}</span>
                  <span className="rounded border border-slate-700 px-2 py-1 text-[10px] font-mono text-slate-300">Confidence {item.confidence}%</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-white">{item.title}</h2>
                <div className="mt-3 text-lg font-mono font-bold text-amber-400">{item.detectedChange}</div>
                <p className="mt-3 text-sm text-slate-300">Compared with the astronaut’s 14-day personal baseline.</p>
                <p className="mt-2 text-sm text-slate-400">Why this matters: {item.whyThisMatters}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.12rem] text-slate-500">Data sources: {item.dataSources.join(' • ')}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-6">
            <h2 className="text-lg font-bold uppercase tracking-[0.2rem] text-white">Contribution to simulated risk</h2>
            <div className="mt-6 space-y-4">
              {data.riskContributions.map((item: any) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>{item.name}</span>
                    <span>{item.score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-400">This explanation summarizes relative influence and is not a claim about causation or clinically validated prediction.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

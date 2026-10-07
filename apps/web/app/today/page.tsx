import { AppShell } from '../../components/layout/AppShell';
import { RiskScoreCard } from '../../components/today/RiskScoreCard';
import { DomainCard } from '../../components/today/DomainCard';
import { WhatChangedList } from '../../components/today/WhatChangedList';

async function getDashboard() {
  try {
    const res = await fetch('http://localhost:4000/api/astronauts/demo/dashboard', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TodayPage() {
  const dashboard = (await getDashboard()) ?? {
    missionDay: 61,
    overallStatus: 'MONITOR',
    simulatedRiskScore: 42,
    confidence: 84,
    dataCompleteness: 91,
    domains: [
      { domain: 'Cardio', currentValueDisplay: '47 ms', currentValue: 47, unit: 'rMSSD (ms)', personalBaselineDisplay: '68 ms', personalBaseline: 68, deviationDisplay: '-21 ms', deviationZScore: -1.4, trend: 'declining', status: 'MONITOR', confidence: 89, dataAvailable: true },
      { domain: 'Sleep', currentValueDisplay: '6h 12m', currentValue: 6.2, unit: 'hours', personalBaselineDisplay: '7h 21m', personalBaseline: 7.35, deviationDisplay: '-1h 09m', deviationZScore: -1.2, trend: 'declining', status: 'MONITOR', confidence: 87, dataAvailable: true },
      { domain: 'Mind', currentValueDisplay: '282 ms', currentValue: 282, unit: 'ms latency', personalBaselineDisplay: '230 ms', personalBaseline: 230, deviationDisplay: '+52 ms', deviationZScore: 1.4, trend: 'declining', status: 'MONITOR', confidence: 82, dataAvailable: true },
      { domain: 'Muscle-Bone', currentValueDisplay: '74', currentValue: 74, unit: 'activity load', personalBaselineDisplay: '85', personalBaseline: 85, deviationDisplay: '-11', deviationZScore: -0.8, trend: 'stable', status: 'STABLE', confidence: 92, dataAvailable: true },
      { domain: 'Immune', currentValueDisplay: '6.8 / 10', currentValue: 6.8, unit: 'allostatic load', personalBaselineDisplay: '4.2 / 10', personalBaseline: 4.2, deviationDisplay: '+2.6', deviationZScore: 1.5, trend: 'declining', status: 'MONITOR', confidence: 85, dataAvailable: true },
    ],
    recentChanges: [
      { id: 'sleep', title: 'Sleep Duration Decreased', domain: 'Sleep', detectedChange: '15%', percentChange: -15, direction: 'down', baselineContext: 'Compared with your 14-day personal baseline.', whyThisMatters: 'Persistent sleep debt may contribute to fatigue and slower cognitive reaction times.', confidence: 87, dataSources: ['Wearable', 'Self-report'], riskContributionWeight: 25 },
      { id: 'hrv', title: 'HRV Below Personal Baseline', domain: 'Cardio', detectedChange: '-1.4z', percentChange: -25, direction: 'down', baselineContext: 'Autonomic tone divergence from personal baseline.', whyThisMatters: 'Reduced recovery margin and elevated stress load associated with fatigue.', confidence: 89, dataSources: ['Wearable'], riskContributionWeight: 20 },
      { id: 'reaction', title: 'Reaction Time Increased', domain: 'Mind', detectedChange: '+52 ms', percentChange: 22, direction: 'up', baselineContext: 'Psychomotor vigilance slower than baseline.', whyThisMatters: 'Likely related to sleep debt and radiation exposure watch window.', confidence: 82, dataSources: ['Check-In'], riskContributionWeight: 14 },
      { id: 'voice', title: 'Voice Cadence Changed', domain: 'Mind', detectedChange: '3.82 syll/s', percentChange: -15, direction: 'down', baselineContext: 'Voice cadence slowed relative to baseline.', whyThisMatters: 'Acoustic prosody changes may correlate with fatigue and strain.', confidence: 76, dataSources: ['Voice biomarker'], riskContributionWeight: 9 },
    ],
    activeWatchWindow: true,
    activeAlerts: [],
  };

  return (
    <AppShell missionDay={dashboard.missionDay}>
      <div className="space-y-6">
        <RiskScoreCard
          missionDay={dashboard.missionDay}
          overallStatus={dashboard.overallStatus}
          riskScore={dashboard.simulatedRiskScore}
          confidence={dashboard.confidence}
          dataCompleteness={dashboard.dataCompleteness}
          activeWatchWindow={dashboard.activeWatchWindow}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dashboard.domains.map((domain: any) => (
            <DomainCard key={domain.domain} summary={domain} />
          ))}
        </div>

        <WhatChangedList changes={dashboard.recentChanges} />
      </div>
    </AppShell>
  );
}

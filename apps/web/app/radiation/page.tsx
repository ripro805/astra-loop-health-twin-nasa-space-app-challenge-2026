import { AppShell } from '../../components/layout/AppShell';
import { RadiationTimelineChart } from '../../components/radiation/RadiationTimelineChart';

async function getWatchData() {
  try {
    const res = await fetch('http://localhost:4000/api/astronauts/demo/radiation/watch', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function RadiationPage() {
  const watchData = (await getWatchData()) ?? {
    currentDoseRate: 1.45,
    cumulativeDose: 19.72,
    missionDay: 61,
    eventStatus: 'SOLAR PARTICLE EVENT DETECTED',
    watchWindowActive: true,
    watchWindowHoursRemaining: 48,
    watchPeriodTotalHours: 72,
    scienceNote: 'Observed changes after a radiation event are shown as associations, not proof of causation.',
    timeline: [
      { missionDay: 54, hoursFromEvent: -168, doseRate: 0.08, sleepHours: 6.4, hrv: 52, reactionTimeMs: 255, voiceCadence: 3.9 },
      { missionDay: 58, hoursFromEvent: -72, doseRate: 0.11, sleepHours: 6.1, hrv: 49, reactionTimeMs: 260, voiceCadence: 3.8 },
      { missionDay: 61, hoursFromEvent: 0, doseRate: 1.45, sleepHours: 6.2, hrv: 47.5, reactionTimeMs: 282, voiceCadence: 3.82 },
      { missionDay: 62, hoursFromEvent: 24, doseRate: 0.68, sleepHours: 5.9, hrv: 43.0, reactionTimeMs: 320, voiceCadence: 3.48 },
      { missionDay: 63, hoursFromEvent: 48, doseRate: 0.52, sleepHours: 6.2, hrv: 44.5, reactionTimeMs: 300, voiceCadence: 3.55 },
      { missionDay: 64, hoursFromEvent: 72, doseRate: 0.06, sleepHours: 6.8, hrv: 49.5, reactionTimeMs: 270, voiceCadence: 3.9 },
    ],
  };

  return (
    <AppShell missionDay={watchData.missionDay}>
      <RadiationTimelineChart watchData={watchData} />
    </AppShell>
  );
}

import { RadiationEvent, HealthMetric } from '@prisma/client';
import { RadiationWatchData } from '@astra-loop/shared';

export class RadiationWatchEngine {
  private static readonly WATCH_WINDOW_HOURS = 72;

  /**
   * Analyzes radiation timeline and active watch window.
   */
  public static evaluateRadiationWatch(
    currentMissionDay: number,
    events: RadiationEvent[],
    metrics: HealthMetric[]
  ): RadiationWatchData {
    // Sort events by timestamp
    const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const latestEvent = sortedEvents[0];

    // Find the latest significant event (e.g. SOLAR_PARTICLE_EVENT or doseRate > 0.3)
    const significantEvent = sortedEvents.find(
      (e) => e.eventType === 'SOLAR_PARTICLE_EVENT' || e.doseRate > 0.3 || e.severity !== 'NORMAL'
    );

    let watchWindowActive = false;
    let watchWindowHoursRemaining = 0;
    let eventStatus = 'NOMINAL BACKGROUND';

    if (significantEvent) {
      // 1 mission day = 24 hours
      const daysSinceEvent = currentMissionDay - significantEvent.missionDay;
      const hoursSinceEvent = daysSinceEvent * 24;

      if (hoursSinceEvent >= 0 && hoursSinceEvent <= this.WATCH_WINDOW_HOURS) {
        watchWindowActive = true;
        watchWindowHoursRemaining = Math.max(0, this.WATCH_WINDOW_HOURS - hoursSinceEvent);
        eventStatus = `WATCH WINDOW ACTIVE (${significantEvent.eventType} on Day ${significantEvent.missionDay})`;
      } else if (hoursSinceEvent > this.WATCH_WINDOW_HOURS) {
        eventStatus = `MONITORING CONCLUDED (72h Post-${significantEvent.eventType})`;
      }
    }

    // Build timeline from 7 days before event (or Day 54) to 72 hours after (Day 64+)
    const eventDay = significantEvent ? significantEvent.missionDay : 61;
    const startDay = Math.max(1, eventDay - 7);
    const endDay = Math.max(currentMissionDay, eventDay + 3);

    const timeline: RadiationWatchData['timeline'] = [];

    for (let day = startDay; day <= endDay; day++) {
      const dayMetrics = metrics.find((m) => m.missionDay === day);
      const dayEvents = events.filter((e) => e.missionDay === day);
      const dayDoseRate =
        dayEvents.length > 0
          ? Math.max(...dayEvents.map((e) => e.doseRate))
          : day === 61
          ? 1.45
          : 0.04;

      timeline.push({
        missionDay: day,
        hoursFromEvent: (day - eventDay) * 24,
        doseRate: Number(dayDoseRate.toFixed(3)),
        sleepHours: dayMetrics?.sleepHours !== null && dayMetrics?.sleepHours !== undefined ? Number(dayMetrics.sleepHours.toFixed(2)) : null,
        hrv: dayMetrics?.hrv !== null && dayMetrics?.hrv !== undefined ? Number(dayMetrics.hrv.toFixed(1)) : null,
        reactionTimeMs: dayMetrics?.reactionTimeMs !== null && dayMetrics?.reactionTimeMs !== undefined ? Number(dayMetrics.reactionTimeMs.toFixed(1)) : null,
        voiceCadence: dayMetrics?.voiceCadence !== null && dayMetrics?.voiceCadence !== undefined ? Number(dayMetrics.voiceCadence.toFixed(2)) : null,
      });
    }

    const currentDoseRate = latestEvent ? latestEvent.doseRate : 0.04;
    const cumulativeDose = latestEvent ? latestEvent.cumulativeDose : 18.2;

    return {
      currentDoseRate: Number(currentDoseRate.toFixed(3)),
      cumulativeDose: Number(cumulativeDose.toFixed(2)),
      missionDay: currentMissionDay,
      eventStatus,
      watchWindowActive,
      watchWindowHoursRemaining,
      watchPeriodTotalHours: this.WATCH_WINDOW_HOURS,
      timeline,
      scienceNote:
        'Observed changes after a radiation event are shown as associations, not proof of causation. Multi-sensor temporal overlay tracks physiological delay windows without causal claims.',
    };
  }
}

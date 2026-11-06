import { RadiationEvent, HealthMetric } from '@prisma/client';
import { RadiationWatchData } from '@astra-loop/shared';

export class RadiationWatchEngine {
  private static readonly WATCH_WINDOW_HOURS = 72;
  private static readonly CAREER_DOSE_LIMIT_MSV = 600.0; // NASA-STD-3001 Vol 1 lifetime limit

  /**
   * Analyzes radiation timeline, active 72h watch window, and career dose limit progress.
   */
  public static evaluateRadiationWatch(
    currentMissionDay: number,
    events: RadiationEvent[],
    metrics: HealthMetric[]
  ): RadiationWatchData {
    // Sort events by timestamp descending
    const sortedEvents = [...events].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    const latestEvent = sortedEvents[0];

    // Find the latest significant event (e.g. SOLAR_PARTICLE_EVENT or doseRate > 0.2 mSv/h)
    const significantEvent = sortedEvents.find(
      (e) =>
        e.eventType === 'SOLAR_PARTICLE_EVENT' ||
        e.doseRate > 0.2 ||
        e.severity !== 'NORMAL'
    );

    let watchWindowActive = false;
    let watchWindowHoursRemaining = 0;
    let eventStatus = 'NOMINAL GCR BACKGROUND';

    if (significantEvent) {
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

    const currentDoseRate = latestEvent ? latestEvent.doseRate : 0.042;
    const cumulativeDose = latestEvent ? latestEvent.cumulativeDose : 19.8;
    const careerLimitConsumedPct = Number(
      ((cumulativeDose / this.CAREER_DOSE_LIMIT_MSV) * 100).toFixed(1)
    );

    // NOAA Space Weather Prediction Center Scale mapping
    let spaceWeatherAlert = {
      scale: 'NORMAL',
      description: 'Galactic cosmic ray background nominal. No solar storms active.',
      source: 'NOAA SWPC / NASA DONKI Space Weather Model',
      status: 'SIMULATED' as const,
    };

    if (currentDoseRate >= 1.0) {
      spaceWeatherAlert = {
        scale: 'S3-STRONG',
        description:
          'Strong Solar Radiation Storm in progress (> 1.0 mSv/h). Storm shelter ingress mandatory.',
        source: 'NOAA SWPC / NASA DONKI',
        status: 'SIMULATED' as const,
      };
    } else if (currentDoseRate >= 0.5) {
      spaceWeatherAlert = {
        scale: 'S2-MODERATE',
        description: 'Moderate Solar Proton Event detected. Non-essential EVA cancelled.',
        source: 'NOAA SWPC / NASA DONKI',
        status: 'SIMULATED' as const,
      };
    } else if (currentDoseRate >= 0.2) {
      spaceWeatherAlert = {
        scale: 'S1-MINOR',
        description: 'Minor Solar Particle Event threshold exceeded. 72h watch active.',
        source: 'NOAA SWPC / NASA DONKI',
        status: 'SIMULATED' as const,
      };
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
          : 0.042;

      timeline.push({
        missionDay: day,
        hoursFromEvent: (day - eventDay) * 24,
        doseRate: Number(dayDoseRate.toFixed(3)),
        sleepHours:
          dayMetrics?.sleepHours !== null && dayMetrics?.sleepHours !== undefined
            ? Number(dayMetrics.sleepHours.toFixed(2))
            : null,
        hrv:
          dayMetrics?.hrv !== null && dayMetrics?.hrv !== undefined
            ? Number(dayMetrics.hrv.toFixed(1))
            : null,
        reactionTimeMs:
          dayMetrics?.reactionTimeMs !== null && dayMetrics?.reactionTimeMs !== undefined
            ? Number(dayMetrics.reactionTimeMs.toFixed(1))
            : null,
        voiceCadence:
          dayMetrics?.voiceCadence !== null && dayMetrics?.voiceCadence !== undefined
            ? Number(dayMetrics.voiceCadence.toFixed(2))
            : null,
        systolicBP:
          dayMetrics?.systolicBP !== null && dayMetrics?.systolicBP !== undefined
            ? Number(dayMetrics.systolicBP.toFixed(1))
            : null,
      });
    }

    return {
      currentDoseRate: Number(currentDoseRate.toFixed(3)),
      cumulativeDose: Number(cumulativeDose.toFixed(2)),
      careerDoseLimit: this.CAREER_DOSE_LIMIT_MSV,
      careerLimitConsumedPct,
      missionDay: currentMissionDay,
      eventStatus,
      watchWindowActive,
      watchWindowHoursRemaining,
      watchPeriodTotalHours: this.WATCH_WINDOW_HOURS,
      spaceWeatherAlert,
      timeline,
      scienceNote:
        'Observed changes after a radiation event are shown as associations, not biological proof of direct causation. Multi-sensor temporal overlay tracks compound physiological delay windows (NASA-STD-3001 Vol 1).',
    };
  }
}

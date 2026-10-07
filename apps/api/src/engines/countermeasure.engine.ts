import { DomainMetricSummary } from '@astra-loop/shared';

export interface CountermeasureSuggestion {
  type: string;
  title: string;
  recommendation: string;
  reason: string;
  expectedObservationWindowHours: number;
  safetyNotice: string;
  isEscalation: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class CountermeasureEngine {
  /**
   * Evaluates domain anomalies and produces targeted, non-clinical countermeasures.
   */
  public static generateSuggestions(
    domains: DomainMetricSummary[],
    missionDay: number,
    consecutiveWorseningDays: number = 0
  ): CountermeasureSuggestion[] {
    const suggestions: CountermeasureSuggestion[] = [];

    // Escalation rule
    if (consecutiveWorseningDays >= 4) {
      suggestions.push({
        type: 'MEDICAL_CONSULT_NOTICE',
        title: 'Mission Medical Officer Notification',
        recommendation: 'Persistent multi-day deviation detected. Consider initiating asynchronous consult with flight surgeon.',
        reason: 'Physiological parameters show sustained divergence exceeding 4 days without recovery.',
        expectedObservationWindowHours: 24,
        safetyNotice: 'Advisory protocol only. Communication queue ready.',
        isEscalation: true,
        priority: 'HIGH',
      });
    }

    const sleepDomain = domains.find((d) => d.domain === 'Sleep');
    const cardioDomain = domains.find((d) => d.domain === 'Cardio');
    const mindDomain = domains.find((d) => d.domain === 'Mind');
    const muscleDomain = domains.find((d) => d.domain === 'Muscle-Bone');

    // 1. Sleep deficit
    if (sleepDomain && sleepDomain.dataAvailable && sleepDomain.deviationZScore < -0.8) {
      suggestions.push({
        type: 'SLEEP_PHASE_ADJUSTMENT',
        title: 'Sleep Phase Adjustment Protocol',
        recommendation: 'Advance sleep schedule by 30 minutes; dim crew quarter lighting to 10 lux 45 minutes prior to target sleep onset.',
        reason: `Sleep duration is ${Math.abs(Math.round(sleepDomain.deviationZScore * 10))}% below your 14-day personal baseline.`,
        expectedObservationWindowHours: 72,
        safetyNotice: 'Non-clinical behavioral adaptation. No pharmacological intervention.',
        isEscalation: false,
        priority: 'HIGH',
      });
    }

    // 2. Autonomic / Cardio stress (Low HRV)
    if (cardioDomain && cardioDomain.dataAvailable && cardioDomain.deviationZScore < -0.8) {
      suggestions.push({
        type: 'LIGHTING_SCHEDULE',
        title: 'Circadian Light Optimization',
        recommendation: 'Schedule 30-minute high-intensity blue-enriched light exposure during post-wake cycle to consolidate autonomic entrainment.',
        reason: 'HRV (rMSSD) indicates sympathetic nervous system dominance relative to personal baseline.',
        expectedObservationWindowHours: 48,
        safetyNotice: 'Non-clinical lighting schedule adjustment.',
        isEscalation: false,
        priority: 'MEDIUM',
      });
    }

    // 3. Cognitive fatigue or elevated reaction time
    if (mindDomain && mindDomain.dataAvailable && mindDomain.deviationZScore > 0.8) {
      suggestions.push({
        type: 'RECOVERY_PERIOD',
        title: 'Cognitive Recovery Period',
        recommendation: 'Insert two structured 20-minute sensory rest intervals between heavy task blocks.',
        reason: 'Reaction time latency and fatigue self-reports indicate mild cognitive workload strain.',
        expectedObservationWindowHours: 48,
        safetyNotice: 'Non-clinical operational pacing adjustment.',
        isEscalation: false,
        priority: 'MEDIUM',
      });
    }

    // 4. Physical activity modulation
    if (muscleDomain && muscleDomain.dataAvailable && muscleDomain.deviationZScore < -0.8) {
      suggestions.push({
        type: 'EXERCISE_LOAD_ADJUSTMENT',
        title: 'ARED / T2 Exercise Modulation',
        recommendation: 'Shift today from high-impact resistance to lower-impact aerobic cycling at 65% VO2 max.',
        reason: 'Current recovery state indicates benefit from active restorative exercise loading.',
        expectedObservationWindowHours: 48,
        safetyNotice: 'Standard mission exercise protocol modulation.',
        isEscalation: false,
        priority: 'LOW',
      });
    }

    // Default recommendation if all stable
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'CIRCADIAN_MAINTENANCE',
        title: 'Circadian Maintenance Routine',
        recommendation: 'Continue nominal flight schedule and maintain planned meal and sleep timing.',
        reason: 'All monitored biological metrics align within personal baseline boundaries.',
        expectedObservationWindowHours: 48,
        safetyNotice: 'Non-clinical routine confirmation.',
        isEscalation: false,
        priority: 'LOW',
      });
    }

    return suggestions;
  }
}

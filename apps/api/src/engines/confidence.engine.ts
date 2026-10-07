import { HealthMetric } from '@prisma/client';
import { DomainMetricSummary } from '@astra-loop/shared';

export interface BlindSpotAnalysis {
  missingDomains: string[];
  blindSpotsDetected: boolean;
  overallConfidence: number;
  dataCompleteness: number;
  disclaimer: string;
}

export class ConfidenceEngine {
  /**
   * Assesses sensor completeness and computes honest confidence without fabricating data.
   */
  public static evaluateSensorCompleteness(
    metricToday: Partial<HealthMetric> | null,
    domains: DomainMetricSummary[]
  ): BlindSpotAnalysis {
    const missingDomains: string[] = [];

    if (!metricToday) {
      return {
        missingDomains: ['Cardio', 'Sleep', 'Mind', 'Muscle-Bone', 'Immune', 'Voice'],
        blindSpotsDetected: true,
        overallConfidence: 20,
        dataCompleteness: 0,
        disclaimer: 'CRITICAL SENSOR GAP: All telemetry streams currently unlinked. Values represent uncalibrated estimates.',
      };
    }

    if (metricToday.hrv === null || metricToday.heartRate === null) {
      missingDomains.push('Cardio (Wearable Bio-Sensor)');
    }
    if (metricToday.sleepHours === null) {
      missingDomains.push('Sleep (Actigraphy / Sleep Stage Tracker)');
    }
    if (metricToday.reactionTimeMs === null) {
      missingDomains.push('Cognitive Latency (Self-Test)');
    }
    if (metricToday.voiceCadence === null) {
      missingDomains.push('Voice Biomarker (Microphone Stream)');
    }
    if (metricToday.activity === null) {
      missingDomains.push('Muscle-Bone (Exercise Telemetry)');
    }

    const totalExpectedSensors = 5;
    const availableSensors = totalExpectedSensors - missingDomains.length;
    const dataCompleteness = Math.round((availableSensors / totalExpectedSensors) * 100);

    // Confidence baseline falls progressively with missing data
    // 100% complete = ~88-94% confidence (allowing for natural biological noise)
    // 1 missing = ~65-72%
    // 2 missing = ~45-55%
    // 3+ missing = <40% (INSUFFICIENT DATA)
    let overallConfidence = Math.round(dataCompleteness * 0.85 + 5);
    if (missingDomains.some((m) => m.includes('Voice'))) {
      overallConfidence = Math.max(30, overallConfidence - 7);
    }

    const blindSpotsDetected = missingDomains.length > 0;
    const disclaimer = blindSpotsDetected
      ? `Blind spot detected: ${missingDomains.join(', ')} unavailable today. Sensor fusion confidence reduced to ${overallConfidence}%. Data is never interpolated or fabricated.`
      : 'All telemetry channels synchronized. Full confidence baseline active.';

    return {
      missingDomains,
      blindSpotsDetected,
      overallConfidence,
      dataCompleteness,
      disclaimer,
    };
  }
}

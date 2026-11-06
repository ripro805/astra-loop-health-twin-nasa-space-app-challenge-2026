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
   * Assesses telemetry completeness across all multi-domain streams.
   * NEVER fabricates or imputes missing biometric streams.
   */
  public static evaluateSensorCompleteness(
    metricToday: Partial<HealthMetric> | null,
    domains: DomainMetricSummary[]
  ): BlindSpotAnalysis {
    const missingDomains: string[] = [];

    if (!metricToday) {
      return {
        missingDomains: [
          'Cardio PPG',
          'Blood Pressure',
          'Sleep Actigraphy',
          'Blood Glucose',
          'Core Temp',
          'SpO2',
          'PVT Reaction Latency',
          'Voice Biomarker',
          'Exercise Hardware',
          'ECLSS Habitat Sensors',
        ],
        blindSpotsDetected: true,
        overallConfidence: 20,
        dataCompleteness: 0,
        disclaimer:
          'CRITICAL SENSOR GAP: All telemetry streams currently unlinked. Telemetry represented as uncalibrated estimates.',
      };
    }

    if (metricToday.hrv === null || metricToday.heartRate === null) {
      missingDomains.push('Cardio (Continuous PPG Sensor)');
    }
    if (metricToday.systolicBP === null || metricToday.diastolicBP === null) {
      missingDomains.push('Blood Pressure (Automated Arm Cuff)');
    }
    if (metricToday.sleepHours === null) {
      missingDomains.push('Sleep (Actigraphy Staging Sensor)');
    }
    if (metricToday.bloodGlucose === null) {
      missingDomains.push('Metabolic (Capillary Glucometer)');
    }
    if (metricToday.bodyTemp === null) {
      missingDomains.push('Core Body Temperature (Infrared Tympanic)');
    }
    if (metricToday.spo2 === null) {
      missingDomains.push('Respiratory (Pulse Oximeter)');
    }
    if (metricToday.reactionTimeMs === null) {
      missingDomains.push('Cognitive Latency (PVT Tablet App)');
    }
    if (metricToday.voiceCadence === null) {
      missingDomains.push('Acoustic Voice Biomarker (Microphone Stream)');
    }
    if (metricToday.activity === null && metricToday.exerciseMinutes === null) {
      missingDomains.push('Musculoskeletal (ARED / T2 Exercise Telemetry)');
    }
    if (metricToday.cabinCO2ppm === null) {
      missingDomains.push('ECLSS Habitat Gas Sensor (Cabin CO2)');
    }

    const totalExpectedSensors = 10;
    const availableSensors = totalExpectedSensors - missingDomains.length;
    const dataCompleteness = Math.round((availableSensors / totalExpectedSensors) * 100);

    // Baseline confidence curve
    let overallConfidence = Math.round(dataCompleteness * 0.85 + 7);

    // Acoustic microphone missing penalty
    if (missingDomains.some((m) => m.includes('Voice'))) {
      overallConfidence = Math.max(30, overallConfidence - 5);
    }

    // Cap confidence realistically: biological data has innate noise (~92-95% max)
    overallConfidence = Math.min(94, Math.max(25, overallConfidence));

    const blindSpotsDetected = missingDomains.length > 0;
    const disclaimer = blindSpotsDetected
      ? `Blind spot detected: ${missingDomains.join(', ')} unavailable today. Sensor fusion confidence adjusted to ${overallConfidence}%. Data is never interpolated or fabricated.`
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

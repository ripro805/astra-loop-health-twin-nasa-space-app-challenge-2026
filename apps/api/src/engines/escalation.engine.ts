import { EscalationTier, SystemStatus } from '@astra-loop/shared';
import { ThresholdEvaluationResult } from './threshold.engine.js';

export interface EscalationAssessment {
  tier: EscalationTier;
  title: string;
  reasons: string[];
  immediateActionProtocols: string[];
  requiresGroundFlightSurgeonUplink: boolean;
  autonomousEmergencyPacketsReady: boolean;
  commsDelayHandlingNote: string;
  uiBanner: {
    visible: boolean;
    tier: EscalationTier;
    headline: string;
    actionSummary: string;
  } | null;
}

export class EscalationEngine {
  /**
   * Evaluates telemetry, threshold results, risk scores, and communication delay to determine operational triage tier.
   */
  public static assessEscalation(
    thresholds: Record<string, ThresholdEvaluationResult>,
    overallRiskScore: number,
    overallStatus: SystemStatus,
    consecutiveWorseningDays: number = 0,
    commsDelayMinutes: number = 14.3
  ): EscalationAssessment {
    const reasons: string[] = [];
    const immediateActionProtocols: string[] = [];
    let tier: EscalationTier = 'SELF_MANAGE';

    // 1. Check for any CRITICAL absolute clinical thresholds
    const criticalEntries = Object.entries(thresholds).filter(
      ([, res]) => res.status === 'CRITICAL'
    );

    const warningEntries = Object.entries(thresholds).filter(
      ([, res]) => res.status === 'WARNING'
    );

    if (criticalEntries.length > 0) {
      tier = 'EMERGENCY';
      for (const [key, res] of criticalEntries) {
        reasons.push(`CRITICAL VIOLATION: ${res.ruleTriggered} (${res.citedSource})`);
        if (key.includes('CO2') || key.includes('cabinCO2ppm')) {
          immediateActionProtocols.push('Don Portable Breathing Apparatus (PBA) / Emergency Oxygen.');
          immediateActionProtocols.push('Manually verify secondary LiOH scrubber canister alignment.');
        } else if (key.includes('BP') || key.includes('systolicBP')) {
          immediateActionProtocols.push('Halt all physical activity; recline astronaut in seated quarters.');
          immediateActionProtocols.push('Prepare automated clinical kit diagnostic pack.');
        } else if (key.includes('Glucose')) {
          immediateActionProtocols.push('If conscious and glucose < 54 mg/dL: consume oral glucose paste immediately.');
        } else if (key.includes('radiation') || key.includes('DoseRate')) {
          immediateActionProtocols.push('Sound Habitat Storm Alarm; all crew ingress storm shelter immediately.');
        }
      }
    } else if (
      overallStatus === 'ATTENTION' ||
      overallRiskScore >= 60 ||
      warningEntries.length >= 2 ||
      consecutiveWorseningDays >= 4
    ) {
      tier = 'CONTACT_FLIGHT_SURGEON';
      if (overallRiskScore >= 60) {
        reasons.push(`Multi-factor compound risk score elevated to ${overallRiskScore}/100.`);
      }
      if (consecutiveWorseningDays >= 4) {
        reasons.push(`Persistent physiological deviation sustained across ${consecutiveWorseningDays} consecutive days.`);
      }
      for (const [, res] of warningEntries) {
        reasons.push(`Clinical warning: ${res.ruleTriggered}`);
      }
      immediateActionProtocols.push('Initiate asynchronous telemetry packet transmission to Ground Flight Surgeon queue.');
      immediateActionProtocols.push('Review non-clinical countermeasure recommendations.');
      immediateActionProtocols.push('Implement operational task-load pacing adjustment.');
    } else if (overallStatus === 'MONITOR' || overallRiskScore >= 30 || warningEntries.length === 1) {
      tier = 'MONITOR';
      if (warningEntries.length > 0) {
        reasons.push(`Isolated warning: ${warningEntries[0][1].ruleTriggered}`);
      } else {
        reasons.push(`Moderate baseline drift detected (Risk score ${overallRiskScore}/100).`);
      }
      immediateActionProtocols.push('Recheck telemetry during scheduled evening check-in.');
      immediateActionProtocols.push('Apply targeted behavioral or sleep countermeasure.');
    } else {
      tier = 'SELF_MANAGE';
      reasons.push('All monitored parameters align within nominal safety envelopes.');
      immediateActionProtocols.push('Continue nominal mission timeline and scheduled routine.');
    }

    // Delay-Tolerant Networking & Autonomous Handling
    const commsDelayHandlingNote =
      commsDelayMinutes > 2.0
        ? `Communication delay to Earth is ${commsDelayMinutes.toFixed(1)} minutes one-way (${(commsDelayMinutes * 2).toFixed(1)}m round-trip). Immediate clinical guidance generated fully autonomously on edge node.`
        : 'Real-time or near-instant ground flight surgeon communication link available.';

    const requiresGroundFlightSurgeonUplink =
      tier === 'CONTACT_FLIGHT_SURGEON' || tier === 'EMERGENCY';

    const uiBanner =
      tier === 'EMERGENCY'
        ? {
            visible: true,
            tier,
            headline: 'EMERGENCY OPERATIONAL ALERT: CRITICAL PHYSIOLOGICAL THRESHOLD EXCEEDED',
            actionSummary:
              immediateActionProtocols[0] ||
              'Execute immediate self-contained autonomous safety protocol.',
          }
        : tier === 'CONTACT_FLIGHT_SURGEON'
        ? {
            visible: true,
            tier,
            headline: 'ADVISORY: FLIGHT SURGEON TELEMEDICINE CONSULT RECOMMENDED',
            actionSummary:
              'Multi-day deviation detected. Clinical report queued for downlink transmission.',
          }
        : null;

    return {
      tier,
      title:
        tier === 'EMERGENCY'
          ? 'TIER 4: EMERGENCY AUTONOMOUS INTERVENTION'
          : tier === 'CONTACT_FLIGHT_SURGEON'
          ? 'TIER 3: FLIGHT SURGEON CONSULTATION RECOMMENDED'
          : tier === 'MONITOR'
          ? 'TIER 2: TARGETED MONITORING & COUNTERMEASURE'
          : 'TIER 1: NOMINAL SELF-MANAGEMENT',
      reasons,
      immediateActionProtocols,
      requiresGroundFlightSurgeonUplink,
      autonomousEmergencyPacketsReady: true,
      commsDelayHandlingNote,
      uiBanner,
    };
  }
}


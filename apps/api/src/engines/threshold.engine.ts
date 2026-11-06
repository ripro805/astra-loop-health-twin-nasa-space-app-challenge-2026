import { AbsoluteStatus, SystemStatus, INDICATOR_CATALOG, IndicatorDefinition } from '@astra-loop/shared';
import { HealthMetric } from '@prisma/client';

export interface ThresholdEvaluationResult {
  status: AbsoluteStatus;
  ruleTriggered: string;
  citedSource: string;
  escalationTierSuggested: 'SELF_MANAGE' | 'MONITOR' | 'CONTACT_FLIGHT_SURGEON' | 'EMERGENCY';
  unit: string;
  currentValue: number | null;
}

export class ThresholdEngine {
  private static catalogMap = new Map<string, IndicatorDefinition>(
    INDICATOR_CATALOG.map((def) => [def.id, def])
  );

  /**
   * Evaluates an individual metric against absolute clinical safety thresholds.
   */
  public static evaluateMetric(
    metricKey: string,
    value: number | null | undefined
  ): ThresholdEvaluationResult {
    const def = this.catalogMap.get(metricKey);

    if (value === null || value === undefined || isNaN(value)) {
      return {
        status: 'NORMAL',
        ruleTriggered: 'No telemetry reading available',
        citedSource: def?.sources[0] || 'NASA-STD-3001',
        escalationTierSuggested: 'SELF_MANAGE',
        unit: def?.unit || '',
        currentValue: null,
      };
    }

    if (!def) {
      return {
        status: 'NORMAL',
        ruleTriggered: 'Uncataloged metric',
        citedSource: 'Clinical Default',
        escalationTierSuggested: 'SELF_MANAGE',
        unit: '',
        currentValue: value,
      };
    }

    // 1. Check CRITICAL thresholds first (Safety first)
    if (def.criticalRange.high !== undefined && value >= def.criticalRange.high) {
      return {
        status: 'CRITICAL',
        ruleTriggered: `${def.name} value ${value} ${def.unit} exceeds critical limit (≥ ${def.criticalRange.high} ${def.unit}). ${def.criticalRange.criticalText}`,
        citedSource: def.sources[0],
        escalationTierSuggested: 'EMERGENCY',
        unit: def.unit,
        currentValue: value,
      };
    }

    if (def.criticalRange.low !== undefined && value <= def.criticalRange.low) {
      return {
        status: 'CRITICAL',
        ruleTriggered: `${def.name} value ${value} ${def.unit} below critical safety boundary (≤ ${def.criticalRange.low} ${def.unit}). ${def.criticalRange.criticalText}`,
        citedSource: def.sources[0],
        escalationTierSuggested: 'EMERGENCY',
        unit: def.unit,
        currentValue: value,
      };
    }

    // 2. Check WARNING thresholds
    if (def.warningRange.high !== undefined && value >= def.warningRange.high) {
      return {
        status: 'WARNING',
        ruleTriggered: `${def.name} value ${value} ${def.unit} entered warning band (≥ ${def.warningRange.high} ${def.unit}). ${def.warningRange.warningText}`,
        citedSource: def.sources[0],
        escalationTierSuggested: 'MONITOR',
        unit: def.unit,
        currentValue: value,
      };
    }

    if (def.warningRange.low !== undefined && value <= def.warningRange.low) {
      return {
        status: 'WARNING',
        ruleTriggered: `${def.name} value ${value} ${def.unit} below warning threshold (≤ ${def.warningRange.low} ${def.unit}). ${def.warningRange.warningText}`,
        citedSource: def.sources[0],
        escalationTierSuggested: 'MONITOR',
        unit: def.unit,
        currentValue: value,
      };
    }

    // 3. Normal / Stable
    return {
      status: 'NORMAL',
      ruleTriggered: `${def.name} value ${value} ${def.unit} is within nominal clinical limits (${def.referenceRange.nominalText}).`,
      citedSource: def.sources[0],
      escalationTierSuggested: 'SELF_MANAGE',
      unit: def.unit,
      currentValue: value,
    };
  }

  /**
   * Evaluates all key indicators present in a health metric record.
   */
  public static evaluateAllMetrics(
    metric: Partial<HealthMetric>
  ): Record<string, ThresholdEvaluationResult> {
    const results: Record<string, ThresholdEvaluationResult> = {};
    const evaluatableKeys: (keyof HealthMetric)[] = [
      'systolicBP',
      'diastolicBP',
      'heartRate',
      'hrv',
      'bloodGlucose',
      'bodyTemp',
      'spo2',
      'sleepHours',
      'reactionTimeMs',
      'cabinCO2ppm',
      'exerciseMinutes',
    ];

    for (const key of evaluatableKeys) {
      const val = metric[key] as number | null | undefined;
      results[key] = this.evaluateMetric(key, val);
    }

    return results;
  }

  /**
   * Dual-Layer Resolution:
   * Resolves the final status between absolute clinical boundaries and personal baseline Z-score status.
   * ABSOLUTE CRITICAL OVERRIDES ANY PERSONAL BASELINE NORMALIZATION!
   */
  public static resolveHybridStatus(
    absoluteStatus: AbsoluteStatus,
    zScoreStatus: SystemStatus
  ): SystemStatus {
    // If absolute threshold is breached critically, force ATTENTION immediately!
    if (absoluteStatus === 'CRITICAL') {
      return 'ATTENTION';
    }

    // If absolute status is WARNING, minimum status is MONITOR
    if (absoluteStatus === 'WARNING') {
      if (zScoreStatus === 'ATTENTION') return 'ATTENTION';
      return 'MONITOR';
    }

    // If absolute status is NORMAL, honor personal baseline deviation or insufficient data
    return zScoreStatus;
  }
}

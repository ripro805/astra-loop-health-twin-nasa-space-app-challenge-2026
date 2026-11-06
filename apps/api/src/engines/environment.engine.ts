import { AbsoluteStatus } from '@astra-loop/shared';

export interface EnvironmentEvaluationResult {
  overallScore: number; // 0 - 100 (100 = optimal habitability, < 60 = stressed)
  status: AbsoluteStatus;
  co2Status: AbsoluteStatus;
  tempStatus: AbsoluteStatus;
  humidityStatus: AbsoluteStatus;
  noiseStatus: AbsoluteStatus;
  co2ppm: number;
  tempC: number;
  humidityPct: number;
  noiseDb: number;
  advisories: string[];
  citedStandards: string[];
}

export class EnvironmentEngine {
  /**
   * Evaluates habitat atmospheric and environmental health.
   * Grounded in NASA-STD-3001 Vol 2 (Rev D 2023) and Spacecraft Maximum Allowable Concentrations (SMAC).
   */
  public static evaluateEnvironment(
    co2ppm: number = 1800,
    tempC: number = 21.5,
    humidityPct: number = 45,
    noiseDb: number = 52
  ): EnvironmentEvaluationResult {
    const advisories: string[] = [];

    // 1. Carbon Dioxide (CO2)
    let co2Status: AbsoluteStatus = 'NORMAL';
    if (co2ppm >= 5000) {
      co2Status = 'CRITICAL';
      advisories.push(
        `CRITICAL CO2 SPIKE: ${co2ppm} ppm (≥ 3.8 mmHg). Don Emergency Oxygen / inspect CDRA scrubbers immediately.`
      );
    } else if (co2ppm >= 3000) {
      co2Status = 'WARNING';
      advisories.push(
        `Elevated CO2: ${co2ppm} ppm. Frontal headache and cognitive slowing risk. Verify cabin circulation fans.`
      );
    } else if (co2ppm >= 2200) {
      advisories.push(`Moderate CO2 drift: ${co2ppm} ppm. Monitor localized pocket formation.`);
    }

    // 2. Cabin Temperature
    let tempStatus: AbsoluteStatus = 'NORMAL';
    if (tempC >= 29 || tempC <= 14) {
      tempStatus = 'CRITICAL';
      advisories.push(
        `Cabin Temperature Out of Safety Limits: ${tempC}°C (NASA standard: 18 - 27°C).`
      );
    } else if (tempC > 26 || tempC < 17) {
      tempStatus = 'WARNING';
      advisories.push(
        `Cabin Temperature Deviating: ${tempC}°C. Adjust ECLSS thermal loop setpoint.`
      );
    }

    // 3. Cabin Humidity
    let humidityStatus: AbsoluteStatus = 'NORMAL';
    if (humidityPct >= 78 || humidityPct <= 18) {
      humidityStatus = 'CRITICAL';
      advisories.push(
        `Cabin Humidity Extreme: ${humidityPct}% (Risk of condensation fungal bloom or acute airway dehydration).`
      );
    } else if (humidityPct > 68 || humidityPct < 28) {
      humidityStatus = 'WARNING';
      advisories.push(`Cabin Humidity Non-Optimal: ${humidityPct}% (Standard: 30 - 65%).`);
    }

    // 4. Acoustic Noise
    let noiseStatus: AbsoluteStatus = 'NORMAL';
    if (noiseDb >= 68) {
      noiseStatus = 'CRITICAL';
      advisories.push(`High Habitat Noise Level: ${noiseDb} dBA. Mandatory hearing protection.`);
    } else if (noiseDb >= 58) {
      noiseStatus = 'WARNING';
      advisories.push(
        `Elevated Acoustic Noise: ${noiseDb} dBA (Exceeds sleep quarter NC-40 threshold of 45 dBA).`
      );
    }

    // Overall Status
    let status: AbsoluteStatus = 'NORMAL';
    if (
      co2Status === 'CRITICAL' ||
      tempStatus === 'CRITICAL' ||
      humidityStatus === 'CRITICAL' ||
      noiseStatus === 'CRITICAL'
    ) {
      status = 'CRITICAL';
    } else if (
      co2Status === 'WARNING' ||
      tempStatus === 'WARNING' ||
      humidityStatus === 'WARNING' ||
      noiseStatus === 'WARNING'
    ) {
      status = 'WARNING';
    }

    // Overall Habitability Score (0-100)
    let penalty = 0;
    if (co2ppm > 2000) penalty += Math.min(40, ((co2ppm - 2000) / 2000) * 40);
    if (tempC > 24) penalty += (tempC - 24) * 4;
    if (tempC < 20) penalty += (20 - tempC) * 4;
    if (humidityPct > 60) penalty += (humidityPct - 60) * 1.5;
    if (humidityPct < 35) penalty += (35 - humidityPct) * 1.5;
    if (noiseDb > 52) penalty += (noiseDb - 52) * 2;

    const overallScore = Math.max(10, Math.min(100, Math.round(100 - penalty)));

    return {
      overallScore,
      status,
      co2Status,
      tempStatus,
      humidityStatus,
      noiseStatus,
      co2ppm,
      tempC,
      humidityPct,
      noiseDb,
      advisories,
      citedStandards: [
        'NASA-STD-3001 Vol 2 (Rev D 2023) Environmental Health',
        'NASA Spacecraft Maximum Allowable Concentrations (SMAC)',
        'Law et al. CO2 and Headaches on ISS (JOEM 2014)',
      ],
    };
  }
}


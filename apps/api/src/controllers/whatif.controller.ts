import { Request, Response, NextFunction } from 'express';
import { WhatIfInput, WhatIfOutput } from '@astra-loop/shared';

export class WhatIfController {
  public static async simulate(req: Request, res: Response, next: NextFunction) {
    try {
      const input: WhatIfInput = req.body;
      const {
        radiationExposure = 50,
        sleepDuration = 6.2,
        exerciseLoad = 75,
        stress = 60,
        cabinCO2ppm = 800,
        gravityG = 0.0,
        systolicBP = 118,
        bloodGlucose = 92,
        socialContactMinutes = 45,
      } = input;

      // Base baseline risk: 42
      const previousRiskScore = 42;

      // Compute simulated risk
      // Sleep deficit contribution: baseline 7.35h
      const sleepDeficit = Math.max(0, 7.35 - sleepDuration);
      const sleepRisk = Math.min(100, Math.max(0, (sleepDeficit / 3.0) * 80));

      // Radiation contribution
      const radRisk = Math.min(100, Math.max(0, (radiationExposure / 100) * 85));

      // CO2 hypercapnia contribution
      const co2Risk = Math.min(100, Math.max(0, ((cabinCO2ppm - 800) / 3200) * 90));

      // Gravity / exercise loading deficit
      const gravityRisk = (1.0 - gravityG) * (exerciseLoad < 60 ? 25 : 8);

      // Cardiopulmonary / BP risk
      const bpRisk = Math.min(100, Math.max(0, ((systolicBP - 120) / 60) * 85));

      // Metabolic glucose risk
      const glucoseRisk = Math.min(100, Math.max(0, (bloodGlucose > 140 ? ((bloodGlucose - 140) / 80) * 80 : bloodGlucose < 70 ? ((70 - bloodGlucose) / 30) * 80 : 0)));

      // Isolation / Social contact deficit
      const isolationRisk = Math.min(100, Math.max(0, ((45 - socialContactMinutes) / 45) * 40));

      // Compound interaction: normalizedRad * normalizedSleepDebt
      const compoundInteraction = ((radiationExposure / 100) * (sleepDeficit / 3.0)) * 30;

      // Exercise buffering effect
      const exerciseModifier = (50 - exerciseLoad) * 0.15;

      // Stress impact
      const stressModifier = (stress - 30) * 0.25;

      const rawProjected =
        0.18 * sleepRisk +
        0.18 * radRisk +
        0.14 * co2Risk +
        0.12 * bpRisk +
        0.10 * glucoseRisk +
        0.08 * gravityRisk +
        0.08 * isolationRisk +
        0.06 * compoundInteraction +
        0.06 * Math.max(0, stressModifier) +
        exerciseModifier +
        15;

      const simulatedRiskScore = Math.min(100, Math.max(5, Math.round(rawProjected)));
      const delta = simulatedRiskScore - previousRiskScore;

      const sleepRiskChange = sleepDuration < 6.5 ? 'UP' : sleepDuration > 7.5 ? 'DOWN' : 'STABLE';
      const cardioRiskChange = systolicBP > 130 ? 'UP' : systolicBP < 115 ? 'DOWN' : 'STABLE';
      const fatigueRiskChange =
        simulatedRiskScore > previousRiskScore + 5
          ? 'UP'
          : simulatedRiskScore < previousRiskScore - 5
          ? 'DOWN'
          : 'STABLE';
      const recoveryChange =
        exerciseLoad >= 70 && sleepDuration >= 7.0 && cabinCO2ppm < 1500
          ? 'UP'
          : radiationExposure > 60 || sleepDuration < 6.0 || cabinCO2ppm > 3000
          ? 'DOWN'
          : 'STABLE';

      let explanation =
        delta > 10
          ? 'Simulation demonstrates sharp risk escalation driven by compound multi-hazard stress.'
          : delta < -10
          ? 'Simulation projects marked recovery: restored sleep, normal CO2, and regulated hemodynamics realign allostatic load.'
          : 'Simulation projects marginal steady-state equilibrium under balanced countermeasure loading.';

      if (cabinCO2ppm > 3000) {
        explanation += ' Elevated cabin CO2 drives significant hypercapnia risk and cognitive slowing.';
      }
      if (systolicBP > 140) {
        explanation += ' Stage 2 arterial hypertension detected, overriding personal baseline.';
      }

      const result: WhatIfOutput = {
        sleepRiskChange,
        fatigueRiskChange,
        recoveryChange,
        cardioRiskChange,
        simulatedRiskScore,
        previousRiskScore,
        delta,
        confidence: 86,
        explanation,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

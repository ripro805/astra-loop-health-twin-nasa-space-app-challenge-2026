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
      } = input;

      // Base baseline risk: 42
      const previousRiskScore = 42;

      // Compute simulated risk
      // Sleep deficit contribution: baseline 7.35h
      const sleepDeficit = Math.max(0, 7.35 - sleepDuration);
      const sleepRisk = Math.min(100, Math.max(0, (sleepDeficit / 3.0) * 80));

      // Radiation contribution
      const radRisk = Math.min(100, Math.max(0, (radiationExposure / 100) * 85));

      // Compound interaction: normalizedRad * normalizedSleepDebt
      const compoundInteraction = ((radiationExposure / 100) * (sleepDeficit / 3.0)) * 40;

      // Exercise buffering effect (higher exercise lowers risk moderately, but too little increases risk)
      const exerciseModifier = (50 - exerciseLoad) * 0.2;

      // Stress impact
      const stressModifier = (stress - 30) * 0.3;

      const rawProjected =
        0.25 * sleepRisk +
        0.2 * radRisk +
        0.15 * compoundInteraction +
        0.2 * Math.max(0, stressModifier) +
        0.1 * exerciseModifier +
        20;

      const simulatedRiskScore = Math.min(100, Math.max(5, Math.round(rawProjected)));
      const delta = simulatedRiskScore - previousRiskScore;

      const sleepRiskChange = sleepDuration < 6.5 ? 'UP' : sleepDuration > 7.5 ? 'DOWN' : 'STABLE';
      const fatigueRiskChange =
        simulatedRiskScore > previousRiskScore + 5
          ? 'UP'
          : simulatedRiskScore < previousRiskScore - 5
          ? 'DOWN'
          : 'STABLE';
      const recoveryChange =
        exerciseLoad >= 70 && sleepDuration >= 7.0
          ? 'UP'
          : radiationExposure > 60 || sleepDuration < 6.0
          ? 'DOWN'
          : 'STABLE';

      const explanation =
        delta > 10
          ? 'Simulation demonstrates sharp risk escalation driven by compound radiation × sleep debt interaction and autonomic fatigue.'
          : delta < -10
          ? 'Simulation projects marked recovery: restored sleep duration and moderated radiation exposure realign allostatic load.'
          : 'Simulation projects marginal steady-state equilibrium under balanced countermeasure loading.';

      const result: WhatIfOutput = {
        sleepRiskChange,
        fatigueRiskChange,
        recoveryChange,
        simulatedRiskScore,
        previousRiskScore,
        delta,
        confidence: 84,
        explanation,
      };

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

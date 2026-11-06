export interface NutritionTargets {
  dailyCalorieTargetKcal: number;
  dailyFluidTargetMl: number;
  dailySodiumMaxMg: number;
  dailyCalciumTargetMg: number;
  dailyVitaminDTargetIU: number;
  currentHydrationEvaluation: {
    hydrationScore: number;
    status: 'OPTIMAL' | 'ADEQUATE' | 'DEFICIT_WARNING' | 'CRITICAL_DEHYDRATION';
    action: string;
  };
  fluidLoadingProtocol: {
    requiredNow: boolean;
    waterVolumeMl: number;
    saltTabletGrams: number;
    instructions: string;
  };
  citedSource: string;
}

export class NutritionEngine {
  /**
   * Calculates tailored metabolic, energy, and hydration targets.
   * Derived from Smith et al., "Human Adaptation to Spaceflight: The Role of Nutrition" (NASA 2021).
   */
  public static calculateTargets(
    weightKg: number = 75.0,
    exerciseMinutes: number = 120.0,
    currentHydrationScore: number = 88.0,
    gravityG: number = 0.0,
    imminentDescent: boolean = false
  ): NutritionTargets {
    const clampedWeight = Math.max(50, Math.min(110, weightKg));

    // Base energy expenditure: ~35 kcal/kg + exercise allowance (~8 kcal/min intensive loading)
    const baseKcal = clampedWeight * 34.0;
    const exerciseKcal = (exerciseMinutes / 60.0) * 350.0;
    const dailyCalorieTargetKcal = Math.round(baseKcal + exerciseKcal);

    // Fluid targets: 32 mL/kg baseline + 10 mL per exercise minute
    const dailyFluidTargetMl = Math.round(clampedWeight * 32.0 + exerciseMinutes * 10.0);

    // Sodium maximum: < 2300 mg (to blunt urinary calcium excretion and ocular venous pressure)
    const dailySodiumMaxMg = 2300;

    // Bone maintenance micronutrients
    const dailyCalciumTargetMg = 1200;
    const dailyVitaminDTargetIU = 1000;

    // Hydration evaluation
    let hydrationStatus: 'OPTIMAL' | 'ADEQUATE' | 'DEFICIT_WARNING' | 'CRITICAL_DEHYDRATION' =
      'OPTIMAL';
    let hydrationAction = 'Maintain scheduled fluid pacing (250 mL every 90 minutes).';

    if (currentHydrationScore < 50) {
      hydrationStatus = 'CRITICAL_DEHYDRATION';
      hydrationAction =
        'Drink 750 mL isotonic electrolyte solution immediately; monitor urine specific gravity.';
    } else if (currentHydrationScore < 75) {
      hydrationStatus = 'DEFICIT_WARNING';
      hydrationAction = 'Consume 500 mL water with oral electrolyte pack before next exercise block.';
    } else if (currentHydrationScore < 85) {
      hydrationStatus = 'ADEQUATE';
      hydrationAction = 'Hydration acceptable; consume 300 mL fluid post-workout.';
    }

    // Planetary landing fluid loading protocol
    const fluidLoadingProtocol = {
      requiredNow: imminentDescent || (gravityG === 0.0 && false),
      waterVolumeMl: 1000,
      saltTabletGrams: 8.0,
      instructions:
        'Ingest 1000 mL water with 8g NaCl equivalent tablets starting 2 hours prior to planetary atmospheric entry.',
    };

    return {
      dailyCalorieTargetKcal,
      dailyFluidTargetMl,
      dailySodiumMaxMg,
      dailyCalciumTargetMg,
      dailyVitaminDTargetIU,
      currentHydrationEvaluation: {
        hydrationScore: currentHydrationScore,
        status: hydrationStatus,
        action: hydrationAction,
      },
      fluidLoadingProtocol,
      citedSource: 'NASA Nutritional Biochemistry Laboratory & Smith et al. (2021)',
    };
  }
}

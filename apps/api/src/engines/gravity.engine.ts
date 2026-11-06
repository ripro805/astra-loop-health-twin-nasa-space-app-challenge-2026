export interface GravityPrescription {
  gravityG: number;
  environmentName: string;
  loadingDeficitPct: number;
  prescribedResistiveMinutes: number;
  prescribedAerobicMinutes: number;
  totalPrescribedMinutes: number;
  projectedMonthlyBoneLossWithoutExercisePct: number;
  orthostaticIntoleranceRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  fluidLoadingMandatory: boolean;
  prescribedHydrationElectrolyteVolumeMl: number;
  clinicalGuidance: string;
  citedSource: string;
}

export class GravityEngine {
  /**
   * Evaluates gravity environment and generates prescriptive exercise/fluid countermeasures.
   * Derived from NASA HRP Bone/Muscle Evidence Reports and ISS Exercise Countermeasure Guidelines.
   */
  public static evaluateGravityPrescription(
    gravityG: number = 0.0,
    environmentName = 'Deep Space Transit (0g)'
  ): GravityPrescription {
    const clampedG = Math.max(0, Math.min(1.0, gravityG));
    const loadingDeficitPct = Math.round((1.0 - clampedG) * 100);

    let prescribedResistiveMinutes = 60;
    let prescribedAerobicMinutes = 75;
    let orthostaticIntoleranceRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';
    let fluidLoadingMandatory = false;
    let prescribedHydrationElectrolyteVolumeMl = 0;

    if (clampedG <= 0.05) {
      // 0g Microgravity (Transit Spacecraft or Orbital Gateway)
      prescribedResistiveMinutes = 60;
      prescribedAerobicMinutes = 75;
      orthostaticIntoleranceRisk = 'HIGH';
      fluidLoadingMandatory = false; // Set true 48h prior to planetary EDL
      prescribedHydrationElectrolyteVolumeMl = 1000;
    } else if (clampedG <= 0.20) {
      // Moon (0.166g)
      prescribedResistiveMinutes = 45;
      prescribedAerobicMinutes = 55;
      orthostaticIntoleranceRisk = 'MODERATE';
      fluidLoadingMandatory = true;
      prescribedHydrationElectrolyteVolumeMl = 750;
    } else if (clampedG <= 0.45) {
      // Mars (0.38g)
      prescribedResistiveMinutes = 35;
      prescribedAerobicMinutes = 45;
      orthostaticIntoleranceRisk = 'MODERATE';
      fluidLoadingMandatory = true;
      prescribedHydrationElectrolyteVolumeMl = 800;
    } else {
      // Earth / 1.0g Centrifuge habitat
      prescribedResistiveMinutes = 25;
      prescribedAerobicMinutes = 35;
      orthostaticIntoleranceRisk = 'LOW';
      fluidLoadingMandatory = false;
      prescribedHydrationElectrolyteVolumeMl = 500;
    }

    const totalPrescribedMinutes = prescribedResistiveMinutes + prescribedAerobicMinutes;
    const projectedMonthlyBoneLossWithoutExercisePct = Number(
      (1.2 * (1.0 - clampedG)).toFixed(2)
    );

    const clinicalGuidance =
      clampedG === 0.0
        ? 'Microgravity (0g) requires maximum dual-regimen loading: 60 min heavy ARED axial loading to prevent trabecular osteoclast resorption + 75 min T2/CEVIS interval cardio to maintain stroke volume.'
        : clampedG < 0.3
        ? 'Lunar partial gravity (0.16g) provides partial musculoskeletal stimulus. Ground reaction forces require daily 100 min supplementary exercise countermeasure.'
        : clampedG < 0.5
        ? 'Martian partial gravity (0.38g) provides ~38% axial loading. Daily 80 min structured exercise maintains gait stabilization and bone mineral density.'
        : 'Nominal Earth gravity loading active. Maintenance conditioning recommended.';

    return {
      gravityG: clampedG,
      environmentName,
      loadingDeficitPct,
      prescribedResistiveMinutes,
      prescribedAerobicMinutes,
      totalPrescribedMinutes,
      projectedMonthlyBoneLossWithoutExercisePct,
      orthostaticIntoleranceRisk,
      fluidLoadingMandatory,
      prescribedHydrationElectrolyteVolumeMl,
      clinicalGuidance,
      citedSource: 'NASA HRP Bone & Muscle Evidence Books (2017) & NASA-STD-3001 Vol 1',
    };
  }
}


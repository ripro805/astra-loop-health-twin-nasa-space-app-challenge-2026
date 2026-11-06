export interface IsolationEvaluationResult {
  isolationStrainScore: number; // 0 - 100 (higher = higher psychological strain)
  behavioralHealthStatus: 'NOMINAL' | 'EVALUATE' | 'ADVISORY' | 'SUPPORT_REQUIRED';
  thirdQuarterRiskActive: boolean;
  socialWithdrawalDetected: boolean;
  acousticProsodyFatigueDetected: boolean;
  validatedSelfCheckItems: {
    question: string;
    subscale: 'MOOD' | 'ANXIETY' | 'COHESION' | 'SLEEP';
    suggestedAnswerRange: string;
  }[];
  recommendedSelfCare: string[];
  citedSource: string;
}

export class IsolationEngine {
  /**
   * Assesses behavioral health indicators in long-duration confinement.
   * Derived from NASA Behavioral Health & Performance (BHP) and terrestrial isolation analogs (Mars-500, Concordia).
   */
  public static evaluateIsolation(
    mood: number = 7.5,
    stress: number = 3.0,
    fatigue: number = 3.0,
    socialContactMinutes: number = 120,
    voiceCadence: number | null = 4.35,
    missionDay: number = 61,
    totalMissionDays: number = 90
  ): IsolationEvaluationResult {
    // 1. Third-Quarter Phenomenon (Dip in morale during midpoint/second half)
    const missionProgress = missionDay / totalMissionDays;
    const thirdQuarterRiskActive = missionProgress >= 0.5 && missionProgress <= 0.85;

    // 2. Social Withdrawal Detection
    const socialWithdrawalDetected = socialContactMinutes < 50 && mood < 5.5;

    // 3. Acoustic Prosody Fatigue Detection
    const acousticProsodyFatigueDetected = voiceCadence !== null && voiceCadence < 3.65;

    // 4. Calculate Isolation Strain Score (0 - 100)
    // Low mood, high stress, high fatigue, low social interaction increase strain
    const moodFactor = (10 - Math.max(1, Math.min(10, mood))) * 4.0; // 0 to 36
    const stressFactor = Math.max(1, Math.min(10, stress)) * 3.5; // 3.5 to 35
    const fatigueFactor = Math.max(1, Math.min(10, fatigue)) * 2.0; // 2 to 20
    const socialDeficit = Math.max(0, 90 - socialContactMinutes) * 0.25; // 0 to 22.5

    let rawStrain = moodFactor * 0.35 + stressFactor * 0.3 + fatigueFactor * 0.2 + socialDeficit * 0.15;
    if (thirdQuarterRiskActive) rawStrain += 6;
    if (acousticProsodyFatigueDetected) rawStrain += 5;

    const isolationStrainScore = Math.max(5, Math.min(100, Math.round(rawStrain)));

    // Categorization
    let behavioralHealthStatus: 'NOMINAL' | 'EVALUATE' | 'ADVISORY' | 'SUPPORT_REQUIRED' = 'NOMINAL';
    if (isolationStrainScore >= 65) {
      behavioralHealthStatus = 'SUPPORT_REQUIRED';
    } else if (isolationStrainScore >= 45) {
      behavioralHealthStatus = 'ADVISORY';
    } else if (isolationStrainScore >= 30) {
      behavioralHealthStatus = 'EVALUATE';
    } else {
      behavioralHealthStatus = 'NOMINAL';
    }

    const recommendedSelfCare: string[] = [];
    if (socialWithdrawalDetected) {
      recommendedSelfCare.push('Schedule shared meal or recreational joint task with crew member today.');
      recommendedSelfCare.push('Access Earth family care package / audio-video message archive.');
    }
    if (acousticProsodyFatigueDetected || fatigue > 6.0) {
      recommendedSelfCare.push('Insert 30-minute sensory deprivation quiet window in private quarters.');
      recommendedSelfCare.push('Avoid non-critical operational decision gates until tomorrow morning.');
    }
    if (thirdQuarterRiskActive) {
      recommendedSelfCare.push('Mission midpoint milestone recognition; celebrate mission progress with crew.');
    }
    if (recommendedSelfCare.length === 0) {
      recommendedSelfCare.push('Maintain nominal routine, daily social contact, and sleep schedule.');
    }

    const validatedSelfCheckItems = [
      {
        question: 'Little interest or pleasure in daily mission routines over past 3 days?',
        subscale: 'MOOD' as const,
        suggestedAnswerRange: '0 (Not at all) to 3 (Nearly every day)',
      },
      {
        question: 'Feeling anxious, nervous, or unable to relax after duty shift?',
        subscale: 'ANXIETY' as const,
        suggestedAnswerRange: '0 (Not at all) to 3 (Nearly every day)',
      },
      {
        question: 'Felt well-supported by and comfortable communicating with crew mates today?',
        subscale: 'COHESION' as const,
        suggestedAnswerRange: '1 (Strongly disagree) to 5 (Strongly agree)',
      },
      {
        question: 'Felt refreshed upon awakening today?',
        subscale: 'SLEEP' as const,
        suggestedAnswerRange: '1 (Exhausted) to 10 (Fully refreshed)',
      },
    ];

    return {
      isolationStrainScore,
      behavioralHealthStatus,
      thirdQuarterRiskActive,
      socialWithdrawalDetected,
      acousticProsodyFatigueDetected,
      validatedSelfCheckItems,
      recommendedSelfCare,
      citedSource: 'NASA HRP Behavioral Health & Performance (BHP) Evidence Book & PHQ-9 validation studies',
    };
  }
}

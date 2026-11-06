export interface GamificationAward {
  xpEarned: number;
  newTotalXp: number;
  newLevel: number;
  levelUpOccurred: boolean;
  unlockedBadgeCodes: string[];
}

export class GamificationEngine {
  private static readonly XP_PER_LEVEL_BASE = 150;

  /**
   * Calculates level from total XP using sub-quadratic level progression.
   */
  public static calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
    const safeXp = Math.max(0, xp);
    const level = Math.floor(Math.sqrt(safeXp / this.XP_PER_LEVEL_BASE)) + 1;
    const nextLevelThreshold = Math.pow(level, 2) * this.XP_PER_LEVEL_BASE;
    const xpToNextLevel = Math.max(0, nextLevelThreshold - safeXp);

    return { level, xpToNextLevel };
  }

  /**
   * Awards XP for healthy habits and checks for new badge unlocks.
   */
  public static processActivity(
    currentXp: number,
    activityType:
      | 'DAILY_CHECKIN'
      | 'MEASUREMENT_TASK'
      | 'EXERCISE_COMPLETED'
      | 'OPTIMAL_SLEEP'
      | 'COUNTERMEASURE_PROMISING',
    context: {
      exerciseMinutes?: number;
      sleepHours?: number;
      streakDays?: number;
    }
  ): GamificationAward {
    let xpAward = 0;

    // Safety check: Never reward unsafe over-exercising (> 180 min)
    if (activityType === 'EXERCISE_COMPLETED') {
      const mins = context.exerciseMinutes ?? 120;
      if (mins >= 45 && mins <= 180) {
        xpAward = 100;
      } else {
        xpAward = 25; // Safe cap
      }
    } else if (activityType === 'DAILY_CHECKIN') {
      xpAward = 50;
    } else if (activityType === 'MEASUREMENT_TASK') {
      xpAward = 25;
    } else if (activityType === 'OPTIMAL_SLEEP') {
      const hours = context.sleepHours ?? 7.0;
      if (hours >= 7.0) {
        xpAward = 50;
      }
    } else if (activityType === 'COUNTERMEASURE_PROMISING') {
      xpAward = 150; // Rewarding validated positive physiological recovery
    }

    const newTotalXp = currentXp + xpAward;
    const oldLevel = this.calculateLevel(currentXp).level;
    const newLevel = this.calculateLevel(newTotalXp).level;
    const levelUpOccurred = newLevel > oldLevel;

    const unlockedBadgeCodes: string[] = [];
    const streak = context.streakDays ?? 0;

    if (streak >= 14 && activityType === 'EXERCISE_COMPLETED') {
      unlockedBadgeCodes.push('BONE_GUARDIAN');
    }
    if (streak >= 10 && activityType === 'OPTIMAL_SLEEP') {
      unlockedBadgeCodes.push('CIRCADIAN_MASTER');
    }

    return {
      xpEarned: xpAward,
      newTotalXp,
      newLevel,
      levelUpOccurred,
      unlockedBadgeCodes,
    };
  }
}


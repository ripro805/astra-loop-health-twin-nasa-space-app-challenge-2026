import { RoutineTask, INDICATOR_CATALOG } from '@astra-loop/shared';

export class SchedulerEngine {
  /**
   * Generates standard daily routine measurement tasks for an astronaut in a given environment.
   */
  public static generateDailyRoutine(
    astronautId: string,
    missionDay: number,
    environmentType: string = 'SPACECRAFT'
  ): Omit<RoutineTask, 'id'>[] {
    const isSurface = environmentType === 'MARS_BASE' || environmentType === 'MOON_BASE';

    const tasks: Omit<RoutineTask, 'id'>[] = [
      {
        indicatorKey: 'systolicBP',
        title: 'Morning Blood Pressure & Heart Rate Evaluation',
        timeOfDay: 'MORNING',
        dueTime: '07:15',
        completed: false,
        missionDay,
        howToMeasureSnippet: 'Seated 5 min rest; automated arm cuff at heart level.',
        isOverdue: false,
      },
      {
        indicatorKey: 'bloodGlucose',
        title: 'Fasting Capillary Blood Glucose Check',
        timeOfDay: 'MORNING',
        dueTime: '07:30',
        completed: false,
        missionDay,
        howToMeasureSnippet: 'Fingerstick capillary blood test strip before breakfast.',
        isOverdue: false,
      },
      {
        indicatorKey: 'bodyTemp',
        title: 'Core Body Temperature Verification',
        timeOfDay: 'MORNING',
        dueTime: '07:45',
        completed: false,
        missionDay,
        howToMeasureSnippet: 'Infrared tympanic ear probe until confirmation tone.',
        isOverdue: false,
      },
      {
        indicatorKey: 'exerciseMinutes',
        title: isSurface
          ? 'Surface EVA / Habitat Resistance & Treadmill Workout'
          : 'ARED Heavy Resistive & T2 Aerobic Countermeasure',
        timeOfDay: 'AFTERNOON',
        dueTime: '14:00',
        completed: false,
        missionDay,
        howToMeasureSnippet: isSurface
          ? 'Log 80-100 min partial-gravity loading session.'
          : 'Log 120-150 min microgravity ARED + T2/CEVIS workout.',
        isOverdue: false,
      },
      {
        indicatorKey: 'reactionTimeMs',
        title: 'Evening Psychomotor Vigilance (PVT) & Check-In',
        timeOfDay: 'EVENING',
        dueTime: '20:30',
        completed: false,
        missionDay,
        howToMeasureSnippet: '3-minute tablet PVT tapping test followed by mood rating.',
        isOverdue: false,
      },
      {
        indicatorKey: 'cabinCO2ppm',
        title: 'Pre-Sleep Bunk Ventilation Sweep',
        timeOfDay: 'BEDTIME',
        dueTime: '21:45',
        completed: false,
        missionDay,
        howToMeasureSnippet: 'Check NDIR gas sensor display; verify personal airflow duct.',
        isOverdue: false,
      },
    ];

    return tasks;
  }

  /**
   * Evaluates completion and computes confidence penalty for overdue tasks.
   */
  public static calculateOverdueConfidencePenalty(
    tasks: { completed: boolean; dueTime: string; indicatorKey: string }[]
  ): { penaltyPoints: number; overdueCount: number } {
    const overdueTasks = tasks.filter((t) => !t.completed);
    let penaltyPoints = 0;

    for (const t of overdueTasks) {
      if (t.indicatorKey === 'systolicBP' || t.indicatorKey === 'reactionTimeMs') {
        penaltyPoints += 8; // High-priority indicators
      } else {
        penaltyPoints += 4;
      }
    }

    return {
      penaltyPoints: Math.min(30, penaltyPoints),
      overdueCount: overdueTasks.length,
    };
  }
}

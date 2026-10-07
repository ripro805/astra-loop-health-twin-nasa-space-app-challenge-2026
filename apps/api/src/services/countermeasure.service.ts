import { prisma } from '../utils/prisma.js';
import { CountermeasureEngine } from '../engines/countermeasure.engine.js';
import { LearnLoopEngine } from '../engines/learnLoop.engine.js';
import { AstronautService } from './astronaut.service.js';
import { CountermeasureRankItem } from '@astra-loop/shared';

export class CountermeasureService {
  /**
   * Retrieves all countermeasures with outcomes for an astronaut.
   */
  public static async getCountermeasures(astronautId: string) {
    return prisma.countermeasure.findMany({
      where: { astronautId },
      include: { outcomes: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Returns available suggestions based on current health state.
   */
  public static async getAvailableSuggestions(astronautId: string) {
    const dashboard = await AstronautService.getDashboardData(astronautId);
    return CountermeasureEngine.generateSuggestions(dashboard.domains, dashboard.missionDay);
  }

  /**
   * Starts tracking a new non-clinical countermeasure.
   */
  public static async startCountermeasure(
    astronautId: string,
    data: {
      type: string;
      recommendation: string;
      reason: string;
    }
  ) {
    // 72-hour evaluation window
    const now = new Date();
    const evaluationAt = new Date(now.getTime() + 72 * 3600 * 1000);

    return prisma.countermeasure.create({
      data: {
        astronautId,
        type: data.type,
        recommendation: data.recommendation,
        reason: data.reason,
        startedAt: now,
        evaluationAt,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Evaluates an active countermeasure ("Did it work?") via Learn Loop Engine.
   */
  public static async evaluateCountermeasure(countermeasureId: string) {
    const cm = await prisma.countermeasure.findUnique({
      where: { id: countermeasureId },
      include: {
        astronaut: {
          include: { healthMetrics: { orderBy: { missionDay: 'asc' } } },
        },
      },
    });

    if (!cm) {
      throw new Error(`Countermeasure ${countermeasureId} not found.`);
    }

    // Determine target metric based on countermeasure type
    let targetMetric: keyof typeof cm.astronaut.healthMetrics[0] = 'sleepHours';
    if (cm.type.includes('LIGHTING') || cm.type.includes('CARDIO')) targetMetric = 'hrv';
    if (cm.type.includes('RECOVERY') || cm.type.includes('MIND')) targetMetric = 'fatigue';
    if (cm.type.includes('EXERCISE')) targetMetric = 'activity';

    const evaluation = LearnLoopEngine.evaluateCountermeasure(
      cm,
      cm.astronaut.healthMetrics,
      targetMetric
    );

    // Save Outcome to database
    const outcome = await prisma.countermeasureOutcome.create({
      data: {
        countermeasureId: cm.id,
        targetMetric: evaluation.targetMetric,
        beforeScore: evaluation.beforeScore,
        afterScore: evaluation.afterScore,
        effect: evaluation.effect,
        confidence: evaluation.confidence,
        result: evaluation.result,
        evaluatedAt: new Date(),
      },
    });

    // Update Countermeasure status
    await prisma.countermeasure.update({
      where: { id: cm.id },
      data: { status: 'EVALUATED' },
    });

    return {
      countermeasure: cm,
      outcome,
    };
  }

  /**
   * Generates personalized Learn Loop ranking of countermeasures for this astronaut.
   */
  public static async getPersonalizedRanking(astronautId: string): Promise<CountermeasureRankItem[]> {
    const cms = await prisma.countermeasure.findMany({
      where: { astronautId },
      include: { outcomes: true },
    });

    return LearnLoopEngine.generatePersonalizedRanking(cms);
  }
}

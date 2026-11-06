import { Request, Response, NextFunction } from 'express';
import {
  TREATMENT_DECISION_TREES,
  TreatmentDecisionTree,
  DecisionNode,
} from '@astra-loop/shared';

export class GuidanceController {
  public static async getTrees(req: Request, res: Response, next: NextFunction) {
    try {
      const treesList: TreatmentDecisionTree[] = Object.values(TREATMENT_DECISION_TREES);
      res.json({
        total: treesList.length,
        trees: treesList.map((t: TreatmentDecisionTree) => ({
          id: t.id,
          title: t.title,
          triggerCondition: t.triggerCondition,
          category: t.category,
          rootNodeId: t.rootNodeId,
          nodeCount: Object.keys(t.nodes).length,
          medicalDisclaimer: t.medicalDisclaimer,
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTreeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tree = (TREATMENT_DECISION_TREES as Record<string, TreatmentDecisionTree>)[id];
      if (!tree) {
        return res.status(404).json({ error: `Treatment tree '${id}' not found.` });
      }
      res.json(tree);
    } catch (err) {
      next(err);
    }
  }

  public static async resolveStep(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nodeId, chosenOptionIndex } = req.body;
      const tree = (TREATMENT_DECISION_TREES as Record<string, TreatmentDecisionTree>)[id];
      if (!tree) {
        return res.status(404).json({ error: `Treatment tree '${id}' not found.` });
      }

      const activeNodeId = nodeId || tree.rootNodeId;
      const node = tree.nodes[activeNodeId];
      if (!node) {
        return res.status(404).json({ error: `Node '${activeNodeId}' not found in tree.` });
      }

      if (chosenOptionIndex !== undefined && node.options[chosenOptionIndex]) {
        const option = node.options[chosenOptionIndex];
        const nextNode = option.nextNodeId ? tree.nodes[option.nextNodeId] : null;

        return res.json({
          currentNode: node,
          selectedOption: option,
          nextNode,
          terminalAction: option.terminalAction ?? null,
          isTerminal: !nextNode && !!option.terminalAction,
        });
      }

      res.json({
        currentNode: node,
        options: node.options,
      });
    } catch (err) {
      next(err);
    }
  }
}

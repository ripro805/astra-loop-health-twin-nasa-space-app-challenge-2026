import {
  TREATMENT_DECISION_TREES,
  TreatmentDecisionTree,
  DecisionNode,
  EscalationTier,
} from '@astra-loop/shared';

export interface TreatmentResolution {
  treeId: string;
  title: string;
  terminalAction: {
    title: string;
    tier: EscalationTier;
    immediateSteps: string[];
    countermeasureType?: string;
    flightSurgeonNotificationNote: string;
    source: string;
    needsClinicalReview: boolean;
  };
  medicalDisclaimer: string;
}

export class TreatmentEngine {
  /**
   * Returns list of all available clinical guidance decision trees.
   */
  public static getAvailableTopics(): {
    id: string;
    title: string;
    triggerCondition: string;
    category: string;
  }[] {
    return Object.values(TREATMENT_DECISION_TREES).map((t) => ({
      id: t.id,
      title: t.title,
      triggerCondition: t.triggerCondition,
      category: t.category,
    }));
  }

  /**
   * Retrieves a decision tree by its unique identifier.
   */
  public static getTree(treeId: string): TreatmentDecisionTree | null {
    return TREATMENT_DECISION_TREES[treeId] || null;
  }

  /**
   * Traverses a decision tree according to user/clinician inputs and produces final action guidance.
   */
  public static resolveGuidance(
    treeId: string,
    selectedOptionIndexes: Record<string, number>
  ): TreatmentResolution | { nextNode: DecisionNode } | null {
    const tree = this.getTree(treeId);
    if (!tree) return null;

    let currentNodeId: string = tree.rootNodeId;

    while (currentNodeId) {
      const node: DecisionNode = tree.nodes[currentNodeId];
      if (!node) break;

      const choiceIdx = selectedOptionIndexes[currentNodeId];

      if (choiceIdx === undefined || choiceIdx === null || !node.options[choiceIdx]) {
        // Stop here; user needs to make a selection on this node
        return { nextNode: node };
      }

      const selectedOption = node.options[choiceIdx];

      if (selectedOption.terminalAction) {
        return {
          treeId: tree.id,
          title: tree.title,
          terminalAction: selectedOption.terminalAction,
          medicalDisclaimer: tree.medicalDisclaimer,
        };
      }

      if (selectedOption.nextNodeId) {
        currentNodeId = selectedOption.nextNodeId;
      } else {
        break;
      }
    }

    return null;
  }
}

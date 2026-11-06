import { EscalationTier } from './indicators.js';
export interface DecisionNode {
    id: string;
    question: string;
    explanation: string;
    options: {
        label: string;
        description?: string;
        nextNodeId?: string;
        terminalAction?: {
            title: string;
            tier: EscalationTier;
            immediateSteps: string[];
            countermeasureType?: string;
            flightSurgeonNotificationNote: string;
            source: string;
            needsClinicalReview: boolean;
        };
    }[];
}
export interface TreatmentDecisionTree {
    id: string;
    title: string;
    triggerCondition: string;
    category: 'SLEEP' | 'HEADACHE_CO2' | 'CARDIO_BP' | 'GLUCOSE' | 'FEVER_INFECTION' | 'MUSCLE_BONE' | 'DEHYDRATION' | 'RADIATION_SPE';
    rootNodeId: string;
    nodes: Record<string, DecisionNode>;
    medicalDisclaimer: string;
}
export declare const TREATMENT_DECISION_TREES: Record<string, TreatmentDecisionTree>;

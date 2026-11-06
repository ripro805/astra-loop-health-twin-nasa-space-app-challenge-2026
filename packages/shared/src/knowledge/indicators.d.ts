export type BodySystem = 'BRAIN_NERVOUS' | 'CARDIOVASCULAR' | 'RESPIRATORY' | 'IMMUNE_LYMPHATIC' | 'METABOLIC_ENDOCRINE' | 'MUSCULOSKELETAL_BONE' | 'MUSCULOSKELETAL_MUSCLE' | 'OPHTHALMIC_SANS' | 'INTEGUMENTARY_SKIN';
export type HRPHazard = 'RADIATION' | 'ISOLATION_CONFINEMENT' | 'DISTANCE_FROM_EARTH' | 'GRAVITY_FIELDS' | 'HOSTILE_CLOSED_ENVIRONMENT';
export type EscalationTier = 'SELF_MANAGE' | 'MONITOR' | 'CONTACT_FLIGHT_SURGEON' | 'EMERGENCY';
export interface IndicatorDefinition {
    id: string;
    name: string;
    unit: string;
    bodySystem: BodySystem;
    howToMeasure: string[];
    whyItMatters: string;
    hazardLinks: {
        hazard: HRPHazard;
        mechanism: string;
    }[];
    onboardMethod: {
        deviceClass: string;
        feasibilityNotes: string;
    };
    referenceRange: {
        min: number;
        max: number;
        nominalText: string;
    };
    warningRange: {
        low?: number;
        high?: number;
        warningText: string;
    };
    criticalRange: {
        low?: number;
        high?: number;
        criticalText: string;
    };
    escalation: {
        selfManageGuidance: string;
        monitorGuidance: string;
        contactSurgeonGuidance: string;
        emergencyGuidance: string;
    };
    preventiveActions: string[];
    sources: string[];
    needsClinicalReview: boolean;
}
export declare const INDICATOR_CATALOG: IndicatorDefinition[];

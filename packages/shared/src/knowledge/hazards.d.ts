import { BodySystem, HRPHazard } from './indicators.js';
export interface HRPHazardInfo {
    id: HRPHazard;
    title: string;
    shortCode: string;
    iconName: string;
    color: string;
    description: string;
    spaceflightContext: string;
    affectedSystems: {
        system: BodySystem;
        pathology: string;
    }[];
    mitigationStrategies: string[];
    operationalRules: string[];
    keyReference: string;
}
export declare const HRP_HAZARDS: Record<HRPHazard, HRPHazardInfo>;

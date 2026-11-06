/**
 * Calibrated Reference Statistics derived from NASA OSDR, ISS Medical Operations,
 * and the NASA Twins Study (Garrett-Bakelman et al., Science 2019).
 * Used to condition synthetic distributions with real-world aerospace empirical bounds.
 */
export interface SpaceflightMetricNorms {
    mean: number;
    std: number;
    unit: string;
    inFlightTrendDescription: string;
    citation: string;
}
export declare const SPACEFLIGHT_REFERENCE_STATS: Record<string, SpaceflightMetricNorms>;

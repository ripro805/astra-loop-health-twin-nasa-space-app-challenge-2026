export interface SpaceWeatherCurrent {
  solarFlareAlert: string;
  protonFluxScale: 'NORMAL' | 'S1-MINOR' | 'S2-MODERATE' | 'S3-STRONG' | 'S4-SEVERE';
  doseRateEstimateMsvHr: number;
  observedAt: string;
  source: string;
  status: 'LIVE' | 'CACHED' | 'SIMULATED';
  disclaimer: string;
}

export class SpaceWeatherService {
  private static cachedPayload: SpaceWeatherCurrent | null = null;
  private static lastFetchTime = 0;
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Retrieves current space weather data with multi-tier fallback (Live -> Cached -> Bundled).
   */
  public static async getCurrentSpaceWeather(): Promise<SpaceWeatherCurrent> {
    const now = Date.now();

    // Check memory cache
    if (this.cachedPayload && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      return { ...this.cachedPayload, status: 'CACHED' };
    }

    try {
      // Attempt live fetch from NOAA SWPC JSON service with short timeout (2.5s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(
        'https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json',
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        // Analyze latest proton flux reading (> 10 MeV)
        const latestReading = Array.isArray(data) ? data[data.length - 1] : null;
        const flux = latestReading?.flux ?? 0.8;

        let scale: SpaceWeatherCurrent['protonFluxScale'] = 'NORMAL';
        let doseRate = 0.042;

        if (flux >= 1000) {
          scale = 'S3-STRONG';
          doseRate = 1.25;
        } else if (flux >= 100) {
          scale = 'S2-MODERATE';
          doseRate = 0.55;
        } else if (flux >= 10) {
          scale = 'S1-MINOR';
          doseRate = 0.22;
        }

        const livePayload: SpaceWeatherCurrent = {
          solarFlareAlert: scale === 'NORMAL' ? 'NOMINAL' : `SOLAR PARTICLE STORM ${scale}`,
          protonFluxScale: scale,
          doseRateEstimateMsvHr: doseRate,
          observedAt: new Date().toISOString(),
          source: 'NOAA SWPC GOES Space Weather Service',
          status: 'LIVE',
          disclaimer: 'Live space weather telemetry from NOAA Space Weather Prediction Center.',
        };

        this.cachedPayload = livePayload;
        this.lastFetchTime = now;
        return livePayload;
      }
    } catch {
      // Graceful offline fallback
    }

    // Bundled fallback conditioned on canonical mission storyline
    const fallbackPayload: SpaceWeatherCurrent = {
      solarFlareAlert: 'SOLAR PARTICLE EVENT DETECTED (M7.8 FLARE CME)',
      protonFluxScale: 'S3-STRONG',
      doseRateEstimateMsvHr: 1.45,
      observedAt: new Date().toISOString(),
      source: 'NASA DONKI / NOAA SWPC (Offline Storyline Simulation)',
      status: 'SIMULATED',
      disclaimer:
        'Offline fallback engaged. Displaying canonical Day 61 Solar Particle Event simulation.',
    };

    return fallbackPayload;
  }
}


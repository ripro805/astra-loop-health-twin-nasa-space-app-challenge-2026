import {
  DashboardData,
  TwinForecastData,
  RadiationWatchData,
  Countermeasure,
  CountermeasureRankItem,
  WhatIfInput,
  WhatIfOutput,
} from '@astra-loop/shared';
import { cacheData, getCachedData, queueOfflineAction, getQueuedActions, clearQueuedActions } from './indexeddb';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Offline simulation state stored in memory / localStorage
let simulatedOffline = false;

export function setSimulatedOffline(isOffline: boolean) {
  simulatedOffline = isOffline;
  if (typeof window !== 'undefined') {
    localStorage.setItem('astra_simulated_offline', isOffline ? 'true' : 'false');
    window.dispatchEvent(new Event('offline_state_changed'));
  }
}

export function isOfflineMode(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('astra_simulated_offline');
    if (stored === 'true') return true;
    return !navigator.onLine;
  }
  return simulatedOffline;
}

export const api = {
  async getDashboard(): Promise<DashboardData> {
    const cacheKey = 'dashboard_latest';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return { ...cached, isOffline: true };
    }

    try {
      const res = await fetch(`${API_BASE}/astronauts/demo/dashboard`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DashboardData = await res.json();
      await cacheData(cacheKey, data);
      return { ...data, isOffline: isOfflineMode() };
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return { ...cached, isOffline: true };
      throw err;
    }
  },

  async getChanges() {
    const res = await fetch(`${API_BASE}/astronauts/demo/changes`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getRadiationWatch(): Promise<RadiationWatchData> {
    const cacheKey = 'radiation_watch';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    const res = await fetch(`${API_BASE}/astronauts/demo/radiation/watch`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await cacheData(cacheKey, data);
    return data;
  },

  async getTwin(): Promise<TwinForecastData> {
    const cacheKey = 'twin_forecast';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    const res = await fetch(`${API_BASE}/astronauts/demo/twin`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await cacheData(cacheKey, data);
    return data;
  },

  async getCountermeasures(): Promise<{
    countermeasures: Countermeasure[];
    suggestions: any[];
    ranking: CountermeasureRankItem[];
  }> {
    const cacheKey = 'countermeasures';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    const res = await fetch(`${API_BASE}/astronauts/demo/countermeasures`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await cacheData(cacheKey, data);
    return data;
  },

  async submitCheckIn(payload: any) {
    if (isOfflineMode()) {
      const id = await queueOfflineAction('CHECK_IN', payload);
      return {
        id,
        offline: true,
        message: 'Saved locally in delay-tolerant storage. Sync will occur when link reconnects.',
      };
    }
    try {
      const res = await fetch(`${API_BASE}/astronauts/demo/check-ins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch {
      const id = await queueOfflineAction('CHECK_IN', payload);
      return {
        id,
        offline: true,
        message: 'Network offline. Saved locally in delay-tolerant storage.',
      };
    }
  },

  async startCountermeasure(payload: any) {
    if (isOfflineMode()) {
      const id = await queueOfflineAction('COUNTERMEASURE_START', payload);
      return {
        id,
        offline: true,
        message: 'Countermeasure initiated locally in offline mode.',
      };
    }
    const res = await fetch(`${API_BASE}/astronauts/demo/countermeasures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async evaluateCountermeasure(id: string) {
    const res = await fetch(`${API_BASE}/countermeasures/evaluate/${id}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async simulateWhatIf(input: WhatIfInput): Promise<WhatIfOutput> {
    const res = await fetch(`${API_BASE}/astronauts/demo/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async flushOfflineQueue() {
    const items = await getQueuedActions();
    if (items.length === 0) return { processedCount: 0 };

    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await clearQueuedActions();
    return res.json();
  },

  // Demo Controls
  async demoReset() {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    return res.json();
  },

  async demoSetDay(missionDay: number) {
    const res = await fetch(`${API_BASE}/demo/set-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionDay }),
    });
    return res.json();
  },

  async demoAdvanceDay() {
    const res = await fetch(`${API_BASE}/demo/advance-day`, { method: 'POST' });
    return res.json();
  },

  async demoTriggerRadiation(doseRate = 1.45) {
    const res = await fetch(`${API_BASE}/demo/trigger-radiation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doseRate }),
    });
    return res.json();
  },

  async demoApplyCountermeasure(type = 'SLEEP_PHASE_ADJUSTMENT') {
    const res = await fetch(`${API_BASE}/demo/apply-countermeasure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    return res.json();
  },

  async demoMissingSensor(sensor: 'cardio' | 'voice' | 'sleep' | 'activity') {
    const res = await fetch(`${API_BASE}/demo/missing-sensor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensor }),
    });
    return res.json();
  },
};

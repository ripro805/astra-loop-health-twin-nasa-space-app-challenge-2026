import {
  DashboardData,
  TwinForecastData,
  RadiationWatchData,
  Countermeasure,
  CountermeasureRankItem,
  WhatIfInput,
  WhatIfOutput,
  OrganSystemStatus,
  RoutineTask,
  GamificationState,
  IndicatorDefinition,
  HRPHazardInfo,
  TreatmentDecisionTree,
  FlightSurgeonReportData,
  Environment,
  ImageCapturePayload,
} from '@astra-loop/shared';
import {
  cacheData,
  getCachedData,
  queueOfflineAction,
  getQueuedActions,
  clearQueuedActions,
} from './indexeddb';

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
  // --- Core Dashboard & Loop ---
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

  // --- v2: Interactive Human Body & Organ Systems ---
  async getBodyStatus(): Promise<{ astronautId: string; timestamp: string; systems: OrganSystemStatus[] }> {
    const cacheKey = 'body_systems_status';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const res = await fetch(`${API_BASE}/astronauts/demo/body`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await cacheData(cacheKey, data);
      return data;
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  // --- v2: Knowledge Hub ---
  async getKnowledgeIndicators(): Promise<{ total: number; indicators: IndicatorDefinition[] }> {
    const cacheKey = 'knowledge_indicators';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const res = await fetch(`${API_BASE}/knowledge/indicators`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await cacheData(cacheKey, data);
      return data;
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async getKnowledgeIndicator(id: string): Promise<IndicatorDefinition> {
    const res = await fetch(`${API_BASE}/knowledge/indicators/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getKnowledgeHazards(): Promise<{ total: number; hazards: HRPHazardInfo[] }> {
    const cacheKey = 'knowledge_hazards';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const res = await fetch(`${API_BASE}/knowledge/hazards`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await cacheData(cacheKey, data);
      return data;
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async getKnowledgeStats(): Promise<{ stats: any }> {
    const res = await fetch(`${API_BASE}/knowledge/reference-stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Daily Routine & Measurement Checklist ---
  async getSchedule(): Promise<RoutineTask[]> {
    const cacheKey = 'routine_schedule';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const res = await fetch(`${API_BASE}/astronauts/demo/schedule`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await cacheData(cacheKey, data);
      return data;
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  async completeRoutineTask(taskId: string, notes?: string) {
    if (isOfflineMode()) {
      await queueOfflineAction('ROUTINE_TASK_COMPLETE', { taskId, notes });
      return { success: true, offline: true, message: 'Task marked complete in offline queue.' };
    }
    const res = await fetch(`${API_BASE}/schedule/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Gamification & Badges ---
  async getGamification(): Promise<GamificationState> {
    const cacheKey = 'gamification_state';
    if (isOfflineMode()) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const res = await fetch(`${API_BASE}/astronauts/demo/gamification`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      await cacheData(cacheKey, data);
      return data;
    } catch (err) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
      throw err;
    }
  },

  // --- v2: Guidance & Clinical Decision Trees ---
  async getGuidanceTrees(): Promise<{ total: number; trees: any[] }> {
    const res = await fetch(`${API_BASE}/guidance/trees`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getGuidanceTree(id: string): Promise<TreatmentDecisionTree> {
    const res = await fetch(`${API_BASE}/guidance/trees/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async resolveGuidanceStep(treeId: string, payload: { nodeId?: string; chosenOptionIndex?: number }) {
    const res = await fetch(`${API_BASE}/guidance/trees/${treeId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Environments ---
  async getEnvironments(): Promise<Environment[]> {
    const res = await fetch(`${API_BASE}/environments`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async switchEnvironment(environmentType: string) {
    const res = await fetch(`${API_BASE}/astronauts/demo/environment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environmentType }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Space Weather Live Telemetry ---
  async getCurrentSpaceWeather() {
    const res = await fetch(`${API_BASE}/space-weather/current`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Image / Ultrasound Capture ---
  async captureImage(payload: { type: string; filePath: string; notes?: string }) {
    if (isOfflineMode()) {
      await queueOfflineAction('IMAGE_CAPTURE', payload);
      return { success: true, offline: true, message: 'Image capture queued locally.' };
    }
    const res = await fetch(`${API_BASE}/astronauts/demo/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getImages(): Promise<ImageCapturePayload[]> {
    const res = await fetch(`${API_BASE}/astronauts/demo/images`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Flight Surgeon Consolidated Report ---
  async getFlightSurgeonReport(): Promise<FlightSurgeonReportData> {
    const res = await fetch(`${API_BASE}/astronauts/demo/export/flight-surgeon-report`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- v2: Escalation Acknowledgment ---
  async acknowledgeEscalation(eventId: string) {
    if (isOfflineMode()) {
      await queueOfflineAction('ESCALATION_ACK', { eventId });
      return { success: true, offline: true };
    }
    const res = await fetch(`${API_BASE}/escalation/events/${eventId}/acknowledge`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  // --- Delay-Tolerant Networking Flush ---
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

  // --- Demo Controls ---
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

  async demoSpikeCO2(ppm = 3400) {
    const res = await fetch(`${API_BASE}/demo/spike-co2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ppm }),
    });
    return res.json();
  },

  async demoRaiseBP(systolic = 145, diastolic = 92) {
    const res = await fetch(`${API_BASE}/demo/raise-bp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systolic, diastolic }),
    });
    return res.json();
  },

  async demoGlucoseExcursion(glucose = 165) {
    const res = await fetch(`${API_BASE}/demo/glucose-excursion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glucose }),
    });
    return res.json();
  },

  async demoFeverSigns(temp = 38.2) {
    const res = await fetch(`${API_BASE}/demo/fever-signs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temp }),
    });
    return res.json();
  },

  async demoSwitchEnvironment(environmentType: string) {
    const res = await fetch(`${API_BASE}/demo/switch-environment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environmentType }),
    });
    return res.json();
  },
};

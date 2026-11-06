import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('ASTRA-LOOP v2 API Integration Tests', () => {
  it('GET /api/health returns ONLINE status with v2 service label', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.service).toContain('v2');
  });

  it('GET /api/knowledge/indicators returns catalog with >= 10 indicators', async () => {
    const res = await request(app).get('/api/knowledge/indicators');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(10);
    expect(Array.isArray(res.body.indicators)).toBe(true);

    const bp = res.body.indicators.find((i: any) => i.id === 'systolicBP');
    expect(bp).toBeDefined();
    expect(bp.unit).toBe('mmHg');
    expect(bp.hazardLinks.some((h: any) => h.hazard === 'GRAVITY_FIELDS')).toBe(true);
  });

  it('GET /api/knowledge/hazards returns all 5 HRP hazards', async () => {
    const res = await request(app).get('/api/knowledge/hazards');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
    const hazardIds = res.body.hazards.map((h: any) => h.id);
    expect(hazardIds).toContain('RADIATION');
    expect(hazardIds).toContain('ISOLATION_CONFINEMENT');
    expect(hazardIds).toContain('DISTANCE_FROM_EARTH');
    expect(hazardIds).toContain('GRAVITY_FIELDS');
    expect(hazardIds).toContain('HOSTILE_CLOSED_ENVIRONMENT');
  });

  it('GET /api/astronauts/primary/dashboard returns 7 domains and environment payload', async () => {
    const res = await request(app).get('/api/astronauts/primary/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.domains.length).toBe(7);
    expect(res.body.environment).toBeDefined();
    expect(res.body.environment.type).toBeDefined();
    expect(res.body.escalationTier).toBeDefined();

    const domainNames = res.body.domains.map((d: any) => d.domain);
    expect(domainNames).toContain('Cardio');
    expect(domainNames).toContain('Metabolic');
    expect(domainNames).toContain('Muscle-Bone');
    expect(domainNames).toContain('Environment');
    expect(domainNames).toContain('Sleep');
    expect(domainNames).toContain('Mind');
    expect(domainNames).toContain('Immune');
  });

  it('GET /api/astronauts/demo/body returns organ system statuses', async () => {
    const res = await request(app).get('/api/astronauts/demo/body');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.systems)).toBe(true);
    expect(res.body.systems.length).toBeGreaterThanOrEqual(7);

    const heart = res.body.systems.find((s: any) => s.system === 'CARDIOVASCULAR');
    expect(heart).toBeDefined();
    expect(heart.statusColor).toBeDefined();
  });

  it('GET /api/astronauts/demo/schedule returns measurement routine tasks', async () => {
    const res = await request(app).get('/api/astronauts/demo/schedule');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].indicatorKey).toBeDefined();
  });

  it('GET /api/astronauts/demo/gamification returns XP, level, streak, and badges', async () => {
    const res = await request(app).get('/api/astronauts/demo/gamification');
    expect(res.status).toBe(200);
    expect(res.body.xp).toBeGreaterThanOrEqual(0);
    expect(res.body.level).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.badges)).toBe(true);
  });

  it('GET /api/guidance/trees and step resolution work correctly', async () => {
    const treesRes = await request(app).get('/api/guidance/trees');
    expect(treesRes.status).toBe(200);
    expect(treesRes.body.total).toBeGreaterThanOrEqual(4);

    const resolveRes = await request(app)
      .post('/api/guidance/trees/sleep_loss/resolve')
      .send({ chosenOptionIndex: 0 });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.currentNode).toBeDefined();
  });

  it('GET /api/environments returns all 5 seeded exploration environments', async () => {
    const res = await request(app).get('/api/environments');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    const types = res.body.map((e: any) => e.type);
    expect(types).toContain('SPACECRAFT');
    expect(types).toContain('STATION');
    expect(types).toContain('MOON_BASE');
    expect(types).toContain('MARS_BASE');
    expect(types).toContain('ROVER');
  });

  it('GET /api/space-weather/current returns solar telemetry', async () => {
    const res = await request(app).get('/api/space-weather/current');
    expect(res.status).toBe(200);
    expect(res.body.protonFluxScale).toBeDefined();
    expect(res.body.doseRateEstimateMsvHr).toBeDefined();
    expect(res.body.source).toBeDefined();
  });

  it('POST /api/astronauts/what-if/simulate handles multidimensional inputs', async () => {
    const res = await request(app)
      .post('/api/astronauts/what-if/simulate')
      .send({
        radiationExposure: 80,
        sleepDuration: 4.5,
        exerciseLoad: 30,
        stress: 85,
        cabinCO2ppm: 3500,
        gravityG: 0.0,
        systolicBP: 148,
        bloodGlucose: 155,
      });

    expect(res.status).toBe(200);
    expect(res.body.simulatedRiskScore).toBeGreaterThan(res.body.previousRiskScore);
    expect(res.body.delta).toBeGreaterThan(0);
  });

  it('POST /api/demo/spike-co2 triggers cabin environmental hypercapnia alert', async () => {
    const res = await request(app)
      .post('/api/demo/spike-co2')
      .send({ ppm: 3600 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('3600 ppm');
  });

  it('GET /api/astronauts/demo/export/flight-surgeon-report produces complete clinical dossier', async () => {
    const res = await request(app).get('/api/astronauts/demo/export/flight-surgeon-report');
    expect(res.status).toBe(200);
    expect(res.body.astronautName).toBeDefined();
    expect(res.body.vitalSignsSummary).toBeDefined();
    expect(res.body.vitalSignsSummary.heartRate).toBeDefined();
    expect(res.body.vitalSignsSummary.bloodPressure).toBeDefined();
    expect(res.body.activeAlerts).toBeDefined();
    expect(res.body.telemetryNotes).toBeDefined();
  });
});

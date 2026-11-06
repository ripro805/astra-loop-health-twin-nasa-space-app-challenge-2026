# ASTRA-LOOP v2 — REST API Documentation

This document describes all REST endpoints exposed by the ASTRA-LOOP Mission Control API (`http://localhost:4000/api`).

All endpoints support JSON payloads and respond with strict JSON objects. In offline / communication blackout conditions, requests are queued on the client via Delay-Tolerant Networking (DTN) and synchronized via `/api/sync`.

---

## 1. System & Health Status

### `GET /api/health`
Returns the operational health and time of the spacecraft local API server.
- **Response `200 OK`**:
```json
{
  "status": "ONLINE",
  "service": "ASTRA-LOOP Autonomous Health Twin API v2",
  "missionTime": "2026-11-06T15:00:00.000Z",
  "isSynthetic": true
}
```

---

## 2. NASA Knowledge Base & Educational Hub

### `GET /api/knowledge/indicators`
Lists the complete catalog of 12+ spaceflight health indicators mapped in the NASA Challenge.
- **Response `200 OK`**:
```json
{
  "total": 12,
  "indicators": [
    {
      "id": "systolicBP",
      "name": "Systolic Blood Pressure",
      "unit": "mmHg",
      "bodySystem": "CARDIOVASCULAR",
      "howToMeasure": [
        "Rest quietly in crew seat for 5 minutes before cuff inflation.",
        "Wrap inflatable cuff around upper left arm at heart level.",
        "Keep arm relaxed during oscillometric cycle."
      ],
      "whyItMatters": "Cephalad fluid shift in microgravity elevates central venous pressure and resets baroreceptors...",
      "hazardLinks": [
        {
          "hazard": "GRAVITY_FIELDS",
          "mechanism": "Absence of hydrostatic pressure head redistributes 1.5-2L blood upward."
        }
      ],
      "onboardMethod": {
        "deviceClass": "Automated Oscillometric Arm Cuff (Welch Allyn / Omron Class II)",
        "canMeasureInSpace": true,
        "flightCertified": true
      },
      "referenceRange": { "low": 90, "high": 120, "text": "Optimal resting systolic arterial pressure" },
      "warningRange": { "low": 130, "high": 139, "text": "AHA Stage 1 Hypertensive shift" },
      "criticalRange": { "low": 80, "high": 160, "criticalText": "Urgent intervention required" },
      "escalation": {
        "defaultTier": "SELF_MANAGE",
        "monitorCondition": "Systolic > 130 mmHg",
        "flightSurgeonCondition": "Systolic > 140 mmHg sustained",
        "emergencyCondition": "Systolic > 160 mmHg or symptomatic encephalopathy"
      },
      "preventiveActions": [
        "Maintain lower body negative pressure (LBNP) session",
        "Moderate sodium intake to < 2300 mg/day"
      ],
      "sources": ["NASA-STD-3001 Vol 1", "AHA 2017 Guidelines"]
    }
  ]
}
```

### `GET /api/knowledge/indicators/:id`
Retrieves full clinical definition and procedure for a specific indicator.

### `GET /api/knowledge/hazards`
Lists all 5 NASA Human Research Program (HRP) spaceflight hazards:
1. `RADIATION` (Space Radiation)
2. `ISOLATION_CONFINEMENT` (Isolation and Confinement)
3. `DISTANCE_FROM_EARTH` (Distance from Earth)
4. `GRAVITY_FIELDS` (Gravity Fields: 0g, Moon 0.16g, Mars 0.38g)
5. `HOSTILE_CLOSED_ENVIRONMENT` (Hostile/Closed Environment: CO2, microbes, acoustics)

---

## 3. Astronaut Telemetry & Digital Twin

### `GET /api/astronauts/:id/dashboard` (or `/api/astronauts/demo/dashboard`)
Returns the complete 7-domain dashboard overview, current risk score, active alerts, environment parameters, and escalation banner.
- **7 Monitored Domains**: `Cardio`, `Sleep`, `Mind`, `Muscle-Bone`, `Immune`, `Metabolic`, `Environment`.
- **Response `200 OK`**:
```json
{
  "missionDay": 61,
  "overallStatus": "MONITOR",
  "simulatedRiskScore": 42,
  "confidence": 86,
  "dataCompleteness": 92,
  "isOffline": false,
  "lastSyncTime": "2026-11-06T15:00:00.000Z",
  "environment": {
    "type": "SPACECRAFT",
    "name": "Astra Transit Habitat (Deep Space 0g)",
    "gravityG": 0.0,
    "radiationShieldingFactor": 1.0,
    "commsDelayMinutes": 14.3
  },
  "domains": [...],
  "activeAlerts": [...],
  "escalationTier": "MONITOR",
  "escalationBanner": null
}
```

### `GET /api/astronauts/:id/body` (or `/api/astronauts/demo/body`)
Returns organ system topology statuses for the interactive clickable human body:
- `BRAIN_NERVOUS`
- `OPHTHALMIC_SANS`
- `CARDIOVASCULAR`
- `RESPIRATORY`
- `IMMUNE_LYMPHATIC`
- `METABOLIC_ENDOCRINE`
- `MUSCULOSKELETAL_MUSCLE`
- `MUSCULOSKELETAL_BONE`
- `INTEGUMENTARY_SKIN`

### `POST /api/astronauts/:id/check-ins`
Records morning or evening check-in telemetry:
- `mood`, `fatigue`, `stress`, `reactionTimeMs`, `voiceCadence`, `systolicBP`, `diastolicBP`, `bloodGlucose`, `bodyTemp`, `spo2`.

---

## 4. Daily Routine & Schedule

### `GET /api/astronauts/:id/schedule`
Returns today's measurement tasks grouped by time of day:
- `MORNING`, `AFTERNOON`, `EVENING`, `BEDTIME`.

### `POST /api/schedule/tasks/:id/complete`
Marks a task complete and logs timestamp and optional clinical notes. Awards gamification XP.

---

## 5. Gamification & Readiness

### `GET /api/astronauts/:id/gamification`
Returns astronaut level, XP, level progress bar, telemetry adherence streak, and earned badges:
- `BONE_GUARDIAN`
- `STEADY_HEART`
- `CIRCADIAN_MASTER`
- `RADIATION_READY`
- `HYDRATION_HERO`

---

## 6. Clinical Decision Trees (CDSS)

### `GET /api/guidance/trees`
Returns all registered clinical decision trees:
- `sleep_loss`: Sleep loss & circadian disruption
- `co2_hypercapnia`: Cabin CO2 elevation & headache
- `acute_hypertension`: Elevated arterial blood pressure
- `glucose_excursion`: Post-prandial hyperglycemia
- `pyrexia_infection`: Core body fever & infection

### `POST /api/guidance/trees/:id/resolve`
Steps through branching questions and resolves to immediate countermeasure protocols and flight surgeon transmission drafts.

---

## 7. Environments

### `GET /api/environments`
Lists the 5 mission operational environments:
1. `SPACECRAFT` (Deep Space Transit, 0g, 14.3m comm lag)
2. `STATION` (Low Earth Orbit ISS, 0g, 0.05m comm lag)
3. `MOON_BASE` (Artemis Lunar Base, 0.16g, 0.02m comm lag)
4. `MARS_BASE` (Ares Mars Surface Habitat, 0.38g, 14.3m comm lag)
5. `ROVER` (Pressurized Exploration Rover, 0.38g, 14.3m comm lag)

### `POST /api/astronauts/:id/environment`
Switches active environment for an astronaut.

---

## 8. Space Weather Live Telemetry

### `GET /api/space-weather/current`
Fetches real-time NOAA SWPC GOES satellite proton flux data with cached and bundled fallback. Returns solar radiation storm scale (`NORMAL`, `S1-MINOR` to `S5-EXTREME`).

---

## 9. Flight Surgeon Telemetry Dossier

### `GET /api/astronauts/:id/export/flight-surgeon-report`
Generates a printable clinical dossier formatted for ground flight surgeons.

---

## 10. Delay-Tolerant Networking (DTN) Sync

### `POST /api/sync`
Flushes queued offline actions (`CHECK_IN`, `ROUTINE_TASK_COMPLETE`, `IMAGE_CAPTURE`, `ESCALATION_ACK`) buffered during communication blackouts.


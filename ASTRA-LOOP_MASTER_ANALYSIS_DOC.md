# ASTRA-LOOP: Closed-Loop Astronaut Health Twin for Long-Duration Deep-Space Missions
## Comprehensive Technical Architecture, Algorithmic Engine & Mission Specification Document
> **Target Audience / Purpose:** This document is designed as a complete, zero-loss context primer for Claude (or any advanced LLM / system architect). By loading this document, an AI model receives exhaustive context on the project's vision, clinical/operational rationale, mathematical formulas, codebase architecture, database schemas, API contracts, frontend components, and demo workflows.

---

## 1. Executive Summary & Mission Problem Statement

### 1.1 The Challenge: Long-Duration Deep-Space Exploration (NASA Space Apps Challenge 2026)
In long-duration deep-space missions (such as Mars transit, lunar orbital habitats, or interplanetary travel):
1. **Extreme Communication Latency:** Signal delays between Earth mission control and spacecraft range from several minutes up to 22+ minutes each way (e.g. 14.3 minutes average on Mars transit). Real-time terrestrial medical intervention is physically impossible.
2. **Multi-Stressor Physiological Drift:** Astronauts endure prolonged microgravity, cosmic galactic radiation, solar particle events (SPE), circadian rhythm disruptions, sleep deprivation, and psychological isolation.
3. **Flaw of Traditional Dashboards:** Current telemetry platforms are reactive and fragmented. They display isolated data points (*"Heart rate is 85 bpm"* or *"Sleep was 5.5 hours"*), telling operators what happened in the past, but fail to answer:
   - *Is this abnormal for this specific astronaut?*
   - *What will happen to their cognitive and physical performance in 7 or 30 days?*
   - *What safe, non-clinical action should be taken right now?*
   - *Did that action actually work?*

### 1.2 The Solution: ASTRA-LOOP
**ASTRA-LOOP** is an autonomous, offline-first, closed-loop digital twin of astronaut physiology. Rather than comparing an astronaut to generic population averages, ASTRA-LOOP creates a **dynamic personal baseline** from the individual's calibrated mission history. It operates on a continuous 5-step feedback loop:

$$\mathbf{SENSE} \longrightarrow \mathbf{UNDERSTAND} \longrightarrow \mathbf{PREDICT} \longrightarrow \mathbf{ACT} \longrightarrow \mathbf{LEARN}$$

- **Sense:** Gathers multi-modal telemetry (actigraphy sleep metrics, continuous PPG heart-rate variability [rMSSD], psychomotor vigilance latency, acoustic voice biomarkers, exercise load, and active dosimeter radiation).
- **Understand:** Maps deviations against the astronaut’s 14-day personal baseline using standard deviations ($Z$-scores) and exponentially weighted moving averages (EWMA). Missing sensor streams are flagged honestly via **Blind-Spot-Aware Fusion** (confidence drops; data is never fabricated).
- **Predict:** Evaluates compound risks (e.g. radiation dose $\times$ sleep debt compound interaction) and generates explainable 7-day and 30-day health forecasts.
- **Act:** Recommends targeted, non-clinical countermeasures (e.g. circadian lighting shifts, sleep phase adjustments, task pacing).
- **Learn:** Tracks the astronaut for 48–72 hours post-intervention, recalculates $Z$-scores, answers **"Did it work?"**, and ranks countermeasures based on historical personal efficacy.

---

## 2. Core Architectural Philosophy & The 5-Step Closed Loop

```
               +---------------------------------------------------------+
               |                       1. SENSE                          |
               |  Wearable Bio-Sensors | Radiation Array | PVT | Voice   |
               +---------------------------+-----------------------------+
                                           |
                                           v
               +---------------------------------------------------------+
               |                     2. UNDERSTAND                       |
               |   Personal Baseline (14-Day) | Z-Scores | Blind Spots   |
               +---------------------------+-----------------------------+
                                           |
                                           v
               +---------------------------------------------------------+
               |                      3. PREDICT                         |
               |  Deterministic Risk Engine | 7-30 Day Linear+EWMA Trend |
               +---------------------------+-----------------------------+
                                           |
                                           v
               +---------------------------------------------------------+
               |                        4. ACT                           |
               |   Non-Clinical Countermeasure Recommendations & Pacing  |
               +---------------------------+-----------------------------+
                                           |
                                           v
               +---------------------------------------------------------+
               |                       5. LEARN                          |
               |  48-72h Evaluation Loop | Before/After Delta | Ranking  |
               +---------------------------+-----------------------------+
                                           |
                                           +---> (Feeds back into Baseline)
```

1. **Sense:** Ingests biometric telemetry from onboard wearables and crew check-ins. If an astronaut skips voice check-in or a sensor fails, the system recognizes the data gap.
2. **Understand:** Answers *"What Changed Today?"* with relative percentage shifts, $Z$-scores, and domain risk weights.
3. **Predict:** Integrates multi-system stresses. For example, radiation exposure combined with sleep debt compounds fatigue faster than sleep debt alone.
4. **Act:** Produces specific operational adjustments (e.g., *"Advance sleep onset by 30 mins; attenuate crew quarter blue light to 10 lux 45m before bed"*).
5. **Learn:** Re-evaluates target biomarkers after 48–72 hours. An effect score $\ge +0.4Z$ is tagged **PROMISING**, while $\le -0.3Z$ is tagged **WORSENING**, updating the astronaut's personalized intervention hierarchy.

---

## 3. Mathematical & Algorithmic Foundations

### 3.1 Personal Baseline & EWMA Formulation (`BaselineEngine`)
- **Calibration Window:** First 14 mission days (minimum 7 valid data points).
- **Sample Mean ($\mu$) & Sample Standard Deviation ($\sigma$):**
  $$\mu = \frac{1}{N} \sum_{i=1}^{N} x_i, \quad \sigma = \sqrt{\frac{1}{N-1}\sum_{i=1}^{N}(x_i - \mu)^2}$$
- **Exponentially Weighted Moving Average (EWMA):**
  $$\text{EWMA}_t = \alpha \cdot x_t + (1 - \alpha) \cdot \text{EWMA}_{t-1} \quad (\alpha = 0.2)$$
- **Standardized Deviation ($Z$-score):**
  $$Z = \frac{x_{\text{current}} - \mu}{\sigma}$$
- **Historical Normal Band:** $[\mu - 1.5\sigma, \; \mu + 1.5\sigma]$. Any metric escaping this band triggers an alert or domain monitor state.

### 3.2 Explainable Multi-Domain Risk Engine (`RiskEngine`)
Risk is deterministic, bounded in $[0, 100]$, and weighted across 5 biological domains plus a compound radiation-sleep interaction term:

$$\text{Risk} = 0.20 \cdot R_{\text{cardio}} + 0.25 \cdot R_{\text{sleep}} + 0.20 \cdot R_{\text{mind}} + 0.15 \cdot R_{\text{muscle}} + 0.10 \cdot R_{\text{immune}} + 0.10 \cdot R_{\text{interaction}}$$

Where:
- For beneficial metrics (HRV, Sleep hours, Exercise), negative $Z$-score increases risk:
  $$Z_{\text{effective}} = -Z$$
- For adverse metrics (Fatigue, Stress, Reaction time latency), positive $Z$-score increases risk:
  $$Z_{\text{effective}} = +Z$$
- Each domain risk is scaled linearly from clamped $Z \in [-3, +3]$ to $[0, 100]$:
  $$R_{\text{domain}} = \left(\frac{\text{clamp}(Z_{\text{effective}}, -3, 3) + 3}{6}\right) \times 100$$
  *(If a sensor stream is completely missing, the engine defaults to a neutral risk of 35 rather than assuming zero).*
- **Radiation $\times$ Sleep Debt Interaction ($R_{\text{interaction}}$):**
  $$\text{NormRad} = \min\left(1.0, \max\left(0, \frac{\text{DoseRate} - 0.05}{1.5}\right)\right)$$
  $$\text{SleepDebt} = \max(0, \text{Sleep}_{\text{baseline}} - \text{Sleep}_{\text{today}})$$
  $$\text{NormSleepDebt} = \min\left(1.0, \frac{\text{SleepDebt}}{3.0}\right)$$
  $$R_{\text{interaction}} = \text{round}(\text{NormRad} \cdot \text{NormSleepDebt} \cdot 100)$$

### 3.3 Status Level Mapping
- **`INSUFFICIENT_DATA` (GRAY):** Triggered when Overall Confidence $< 40\%$.
- **`ATTENTION` (RED):** Risk $\ge 60$. Immediate flight surgeon / operational advisory.
- **`MONITOR` (YELLOW):** $30 \le \text{Risk} < 60$. Countermeasure suggested.
- **`STABLE` (GREEN):** $\text{Risk} < 30$. Nominal flight operations.

### 3.4 Honest Sensor Completeness & Confidence Engine (`ConfidenceEngine`)
The system explicitly rejects synthetic interpolation for missing telemetry:
$$\text{DataCompleteness} = \frac{\text{AvailableSensors}}{\text{TotalSensors}} \times 100$$
$$\text{Confidence} = \text{round}\left(\text{AvgDomainConfidence} \times \left(\frac{\text{DataCompleteness}}{100}\right)^{0.7}\right)$$
If the microphone/voice cadence stream is unavailable, confidence is penalized by an additional $-7\%$, and an operational disclaimer is displayed.

### 3.5 Learn Loop Efficacy Evaluation (`LearnLoopEngine`)
Evaluates countermeasures after 48–72 hours by computing the delta in standardized deviation ($Z$-scores) between pre-intervention (3 days prior) and post-intervention (3 days after):
$$\Delta Z = Z_{\text{after}} - Z_{\text{before}}$$
- $\Delta Z \ge +0.4$: **`PROMISING`** (Intervention statistically improved recovery towards baseline).
- $\Delta Z \le -0.3$: **`WORSENING`** (Divergence deepened; alternate countermeasure needed).
- $-0.3 < \Delta Z < +0.4$: **`UNCERTAIN`** (Inconclusive response; maintain observation).

### 3.6 Explainable Forecasting Engine (`ForecastEngine`)
- Uses least-squares linear regression over the last 14 mission days to calculate trajectory slope $m$:
  $$m = \frac{n \sum (xy) - \sum x \sum y}{n \sum (x^2) - (\sum x)^2}$$
- **7-Day Daily Projection:** Projects sleep and fatigue levels for $t \in [1, 7]$ days into the future. Confidence degrades exponentially:
  $$\text{Confidence}(t) = \max\left(35, \text{round}\left(\text{OverallConfidence} \cdot 0.96^t\right)\right)$$
- **30-Day Strategic Outlook:** Categorizes trajectories into directional trends (e.g. *"Progressive Cumulative Fatigue (+34%)"*, *"High Probability of Extended Sleep Deficit (+28%)"*).

---

## 4. System & Codebase Architecture

The project is structured as an enterprise-grade TypeScript monorepo using npm workspaces:

```
astra-loop-health-twin-nasa-space-app-challenge-2026/
├── apps/
│   ├── api/                     # Node.js + Express + Prisma + PostgreSQL
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Complete database relational schema
│   │   │   ├── seed.ts          # 90-day synthetic deterministic mission seeder
│   │   │   └── seed.js
│   │   ├── src/
│   │   │   ├── controllers/     # Express route handlers
│   │   │   │   ├── astronaut.controller.ts
│   │   │   │   ├── checkin.controller.ts
│   │   │   │   ├── countermeasures.controller.ts
│   │   │   │   ├── dashboard.controller.ts
│   │   │   │   ├── demo.controller.ts
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── radiation.controller.ts
│   │   │   │   ├── sync.controller.ts
│   │   │   │   ├── twin.controller.ts
│   │   │   │   └── whatif.controller.ts
│   │   │   ├── engines/         # Pure algorithmic & mathematical logic
│   │   │   │   ├── baseline.engine.ts
│   │   │   │   ├── confidence.engine.ts
│   │   │   │   ├── countermeasure.engine.ts
│   │   │   │   ├── forecast.engine.ts
│   │   │   │   ├── learnLoop.engine.ts
│   │   │   │   ├── radiationWatch.engine.ts
│   │   │   │   └── risk.engine.ts
│   │   │   ├── middleware/
│   │   │   │   └── errorHandler.middleware.ts
│   │   │   ├── routes/          # Express route definitions
│   │   │   ├── services/        # Database integration & business workflow
│   │   │   │   ├── astronaut.service.ts
│   │   │   │   ├── countermeasure.service.ts
│   │   │   │   ├── demo.service.ts
│   │   │   │   ├── health.service.ts
│   │   │   │   └── radiation.service.ts
│   │   │   ├── utils/
│   │   │   │   ├── prisma.ts
│   │   │   │   └── seedGenerator.ts # Box-Muller Gaussian RNG generator
│   │   │   └── server.ts        # Express bootstrapping & CORS setup
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                     # Next.js 14 App Router + Tailwind CSS
│       ├── app/
│       │   ├── layout.tsx       # Root layout with font setup & metadata
│       │   ├── page.tsx         # Mission Landing & Hero Page
│       │   ├── today/           # Mission Control Operational Dashboard
│       │   ├── twin/            # Personal Twin Baseline & Forecast view
│       │   ├── radiation/       # 72-Hour Radiation Watch & Correlation view
│       │   ├── countermeasures/ # Countermeasure Recommendations & Learn Loop
│       │   ├── check-in/        # Daily 3-minute check-in (PVT + Voice Cadence)
│       │   ├── what-changed/    # What Changed Today explainability breakdown
│       │   └── what-if/         # 30-Day Scenario Simulator
│       ├── components/
│       │   ├── checkin/         # ReactionTest (PVT) & VoiceRecorder components
│       │   ├── common/          # ConfidenceBar, ExplainabilityChart, Badges
│       │   ├── countermeasures/ # LearnLoopSummary & Ranking table
│       │   ├── layout/          # AppShell, TopBar, Sidebar, DemoControlModal
│       │   ├── radiation/       # RadiationTimelineChart (Multi-axis Recharts)
│       │   └── today/           # RiskScoreCard, DomainCard, WhatChangedList
│       ├── hooks/
│       │   └── useOfflineSync.ts# Custom React hook for IndexedDB offline sync
│       ├── lib/
│       │   ├── api.ts           # Axios/Fetch client with offline interceptor
│       │   ├── indexeddb.ts     # idb library wrapper (syncQueue, cacheStore)
│       │   └── utils.ts
│       ├── package.json
│       └── tailwind.config.js
│
├── packages/
│   └── shared/                  # Shared TypeScript interfaces & types
│       ├── src/
│       │   └── index.ts         # Single Source of Truth contracts
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml           # PostgreSQL 16 Alpine container config
├── .env.example                 # Environment configuration template
├── presentation_script.txt      # 60s & full pitch presentation script
└── package.json                 # Monorepo root package definition
```

---

## 5. Database Schema & Data Models (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Astronaut {
  id              String            @id @default(cuid())
  name            String            // e.g. "CDR Alex Vance"
  missionDay      Int               // Current active mission day (default: 61)
  calibrationDone Boolean           @default(false)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  healthMetrics   HealthMetric[]
  radiationEvents RadiationEvent[]
  checkIns        CheckIn[]
  countermeasures Countermeasure[]
  alerts          Alert[]
}

model HealthMetric {
  id             String    @id @default(cuid())
  astronautId    String
  timestamp      DateTime
  missionDay     Int       @default(1)

  // Physiological Telemetry
  heartRate      Float?    // Resting HR (bpm)
  hrv            Float?    // rMSSD (ms)
  sleepHours     Float?    // Actigraphy sleep duration
  activity       Float?    // Exercise telemetry score (ARED/T2)
  mood           Float?    // Subjective scale 1-10
  fatigue        Float?    // Subjective scale 1-10
  stress         Float?    // Neuroendocrine allostatic load scale 1-10
  reactionTimeMs Float?    // Psychomotor vigilance latency (ms)
  voiceCadence   Float?    // Acoustic prosody syllables/sec

  dataSource     String    @default("WEARABLE_BIO_SENSOR")
  isSynthetic    Boolean   @default(true)

  astronaut      Astronaut @relation(fields: [astronautId], references: [id], onDelete: Cascade)

  @@index([astronautId])
  @@index([timestamp])
  @@index([missionDay])
}

model RadiationEvent {
  id             String    @id @default(cuid())
  astronautId    String
  timestamp      DateTime
  missionDay     Int       @default(1)
  doseRate       Float     // mSv/h
  cumulativeDose Float     // Cumulative mission mSv
  eventType      String    // "BACKGROUND" | "SOLAR_PARTICLE_EVENT"
  severity       String    // "NORMAL" | "ELEVATED" | "CRITICAL"

  astronaut      Astronaut @relation(fields: [astronautId], references: [id], onDelete: Cascade)

  @@index([astronautId])
  @@index([timestamp])
  @@index([missionDay])
}

model CheckIn {
  id             String    @id @default(cuid())
  astronautId    String
  timestamp      DateTime
  missionDay     Int       @default(1)
  mood           Float?
  fatigue        Float?
  stress         Float?
  reactionTimeMs Float?
  voiceAvailable Boolean   @default(false)
  voiceCadence   Float?
  notes          String?

  astronaut      Astronaut @relation(fields: [astronautId], references: [id], onDelete: Cascade)

  @@index([astronautId])
  @@index([missionDay])
}

model Countermeasure {
  id             String                  @id @default(cuid())
  astronautId    String
  type           String                  // e.g. "SLEEP_PHASE_ADJUSTMENT"
  recommendation String
  reason         String                  @default("Detected physiological deviation from baseline")
  startedAt      DateTime                @default(now())
  evaluationAt   DateTime?               // +72h evaluation mark
  status         String                  @default("ACTIVE") // ACTIVE | EVALUATED | DISMISSED

  astronaut      Astronaut               @relation(fields: [astronautId], references: [id], onDelete: Cascade)
  outcomes       CountermeasureOutcome[]

  @@index([astronautId])
  @@index([status])
}

model CountermeasureOutcome {
  id               String         @id @default(cuid())
  countermeasureId String
  targetMetric     String         @default("sleepHours")
  beforeScore      Float?         // Z-score prior to intervention
  afterScore       Float?         // Z-score post-intervention
  effect           Float?         // Improvement delta (after - before)
  confidence       Float?         // 0 - 100%
  result           String         // "PROMISING" | "UNCERTAIN" | "WORSENING"
  evaluatedAt      DateTime       @default(now())

  countermeasure   Countermeasure @relation(fields: [countermeasureId], references: [id], onDelete: Cascade)

  @@index([countermeasureId])
}

model Alert {
  id          String    @id @default(cuid())
  astronautId String
  timestamp   DateTime  @default(now())
  domain      String    // "Cardio" | "Sleep" | "Mind" | "Radiation"
  severity    String    // "INFO" | "WARNING" | "CRITICAL"
  title       String
  explanation String
  confidence  Float

  astronaut   Astronaut @relation(fields: [astronautId], references: [id], onDelete: Cascade)

  @@index([astronautId])
  @@index([timestamp])
}
```

---

## 6. End-to-End API Specification

The API server runs on port `4000` with the base route `/api`.

| HTTP Verb | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check and UTC mission timestamp. |
| `GET` | `/astronauts/demo/dashboard` | Returns full today payload: risk score, confidence, 5 domain cards, recent changes, risk contributions, alerts. |
| `GET` | `/astronauts/demo/metrics` | Returns full historical series of daily health metrics. |
| `POST` | `/astronauts/demo/checkin` | Submits astronaut check-in (mood, fatigue, stress, PVT reaction time ms, voice cadence). Synchronizes both CheckIn and HealthMetric tables. |
| `GET` | `/astronauts/demo/twin` | Returns personal baseline statistics (mean, std, EWMA, normal bands) and 7-day / 30-day forecast trends. |
| `GET` | `/astronauts/demo/radiation/watch` | Returns radiation timeline, cumulative dose, current dose rate, and 72-hour observation window countdown. |
| `GET` | `/astronauts/demo/countermeasures` | Returns active recommendations, historical interventions, and personal effectiveness rankings. |
| `POST` | `/countermeasures/start` | Initiates tracking for a recommended countermeasure with a 72-hour evaluation timestamp. |
| `POST` | `/countermeasures/:id/evaluate`| Triggers the Learn Loop engine to compute pre/post $Z$-score delta and record an outcome. |
| `POST` | `/astronauts/demo/whatif` | Simulates risk score for customizable parameters (radiation, sleep, exercise, stress). |
| `POST` | `/sync` | Ingests batched offline action queues from client IndexedDB. |
| `GET` | `/sync/status` | Reports Delay-Tolerant Networking (DTN) status, simulated Earth delay (14.3 min), and ground sync history. |
| `POST` | `/demo/reset` | Resets database to canonical Mission Day 61 demo state. |
| `POST` | `/demo/set-day` | Advances or jumps the mission timeline to any day ($1 - 90$). |
| `POST` | `/demo/advance-24h` | Progresses mission clock by 1 full day. |
| `POST` | `/demo/trigger-radiation` | Injects an acute Solar Particle Event ($1.45 \text{ mSv/h}$) and activates the 72-hour watch window. |
| `POST` | `/demo/missing-sensor` | Suppresses a sensor (e.g. `cardio`, `voice`, `sleep`) to demonstrate Blind-Spot-Aware confidence reduction. |

---

## 7. Canonical 90-Day Mission Storyline & Demo Scenarios

The database seeder employs a deterministic pseudo-random number generator (LCG + Box-Muller Gaussian noise) to construct a realistic 90-day deep space mission dataset for **Commander Alex Vance**:

```
Day 1 - 14     : Calibration Phase. Normal health, establishment of 14-day personal baseline.
Day 15 - 45    : Stable Mission Routine. Nominal microgravity operations, circadian entrainment.
Day 46 - 55    : Gradual Sleep Deterioration. Sleep decreases towards 6.2h, fatigue ticks upwards.
Day 56 - 60    : Autonomic Drift. HRV drops from 68ms to 50ms, psychomotor reaction latency increases.
Day 61 (HERO)  : Solar Particle Event (SPE)! Dose rate spikes to 1.45 mSv/h. System initiates 72-hour
                 Watch Window. Sleep falls to 6.2h, HRV to 47.5ms, PVT latency to 282ms.
Day 62 - 63    : Compound Lag Phase. Delayed biological impact window. Sleep debt × radiation interaction.
                 Countermeasure "Sleep Phase Adjustment Protocol" applied on Day 63.
Day 64 - 65    : Learn Loop Verification! Sleep recovers to 7.1h, HRV returns to 65ms, reaction time
                 improves to 225ms. Pre vs Post Z-score improvement +1.2Z -> Marked "PROMISING".
Day 66 - 90    : Stabilized Equilibrium. Crew returns to nominal operations with optimized countermeasure history.
```

---

## 8. Client-Side Offline-First Architecture & DTN Synchronization

Deep space missions cannot depend on continuous HTTP connectivity. The frontend implements an autonomous offline-first system:

```
[User Action: Check-in / Start Countermeasure]
                   |
                   v
        Is System Online / Syncable?
          /                      \
       (YES)                     (NO - Offline Mode / Delay Window)
        /                          \
   POST to API             Store in IndexedDB "syncQueue"
        |                  Update local UI optimistically
        v                          |
   Server Confirmed                v
                   Wait for Online / Reconnection Event
                                   |
                                   v
                   Flush "syncQueue" via POST /api/sync
                   Empty IndexedDB on 200 OK Response
```

- **IndexedDB Stores:**
  - `syncQueue`: Stores queued check-in entries and countermeasure actions with unique timestamps.
  - `cacheStore`: Stores cached snapshots of dashboard and telemetry data for instant offline rendering.
- **`useOfflineSync` Hook:** Listens to `window.addEventListener('online')` and `window.addEventListener('offline')`, as well as manual simulation toggles in the Demo Control Modal. Automatically flushes queues when connection is re-established.

---

## 9. Key UI/UX Modules & Capabilities

1. **Mission Control Today Dashboard (`/today`):**
   - **Risk Score Card:** Visual display of simulated risk ($0-100$), status badge (`STABLE`, `MONITOR`, `ATTENTION`, `INSUFFICIENT_DATA`), confidence meter, data completeness score, and active 72h watch indicator.
   - **5 Domain Cards:** Cardio (HRV rMSSD), Sleep, Mind (PVT Latency), Muscle-Bone (Activity score), and Immune (Allostatic load). Each card shows current value, personal baseline mean, standardized deviation ($Z$-score), 14-day trend arrow, and sensor integrity status.
   - **What Changed Today List:** Summarizes leading anomalies, percentage changes against personal baseline, explanation of operational significance, and sensor sources.
2. **Personal Health Twin & Forecast (`/twin`):**
   - Displays dynamic 14-day calibration bands $[\mu - 1.5\sigma, \mu + 1.5\sigma]$ for all biomarkers.
   - Visualizes 7-day linear projection and 30-day risk outlook.
3. **Radiation Watch Window (`/radiation`):**
   - Multi-sensor temporal chart overlaying dosimeter readings ($mSv/h$) with sleep hours, HRV, reaction time latency, and voice cadence over a $T-168h$ to $T+72h$ window.
   - Explicit scientific disclaimer: *Correlations are tracked as non-causal associations for decision support.*
4. **Countermeasures & Learn Loop (`/countermeasures`):**
   - Displays recommended non-clinical interventions with expected observation windows ($48-72h$).
   - Shows "Did it work?" evaluation cards displaying before vs. after $Z$-scores and improvement deltas.
   - Ranks countermeasures by historical effectiveness for that specific astronaut.
5. **Interactive Check-In (`/check-in`):**
   - Sliders for subjective mood, fatigue, and stress.
   - Built-in **Psychomotor Vigilance Test (PVT):** Astronaut taps a reactive element when it flashes green; records millisecond reaction latency.
   - Optional **Acoustic Voice Check:** Astronaut records 4 seconds of speech to extract syllable cadence. Includes a "Mic Unavailable" skip button that engages Blind-Spot-Aware confidence penalization.
6. **What-If Scenario Simulator (`/what-if`):**
   - Real-time interactive sliders for radiation exposure, sleep duration, exercise load, and stress.
   - Computes compound interaction effects and displays immediate 30-day projected risk shifts.
7. **Demo Control Modal:**
   - Accessible via quick-action menu; enables judges or presenters to jump timeline days, simulate missing sensors, inject SPE radiation spikes, or toggle offline mode.

---

## 10. How to Run & Verify the Project Locally

### 10.1 Prerequisites
- Node.js (v18 or v20+)
- PostgreSQL 16 (or Docker Desktop)
- npm (v9+)

### 10.2 Setup Instructions
1. **Clone repository and install dependencies:**
   ```bash
   npm install
   ```
2. **Start PostgreSQL Database:**
   ```bash
   docker-compose up -d
   ```
   *(Or point `DATABASE_URL` in `apps/api/.env` to an existing local PostgreSQL instance).*
3. **Configure Environment Variables:**
   - Root / `apps/api/.env`:
     ```env
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/astraloop?schema=public"
     PORT=4000
     API_PORT=4000
     NODE_ENV=development
     ```
   - `apps/web/.env.local`:
     ```env
     NEXT_PUBLIC_API_URL="http://localhost:4000/api"
     ```
4. **Push Database Schema & Seed Canonical Data:**
   ```bash
   npm run seed
   ```
5. **Run Development Servers:**
   ```bash
   npm run dev
   ```
   - **Frontend Dashboard:** `http://localhost:3000`
   - **Backend API:** `http://localhost:4000` (Health check: `http://localhost:4000/api/health`)

---

## 11. Claude Instruction Wrapper (Copy-Paste Prompt for Claude)

When supplying this document to Claude, prefix it with the following instruction block:

```markdown
You are an expert Space Medicine Systems Architect, Full-Stack Engineer, and Biomedical Data Scientist specializing in NASA human spaceflight digital twins.

I am providing you with the complete architectural specification, mathematical formulas, database models, and codebase documentation for "ASTRA-LOOP: Closed-Loop Astronaut Health Twin for Long-Duration Deep-Space Missions", developed for the NASA Space Apps Challenge.

Please thoroughly review the document below. Once absorbed, you will assist me with:
1. Answering deep technical questions about ASTRA-LOOP's architecture, math engines, and data flows.
2. Generating new features, algorithms, or API endpoints adhering to the existing TypeScript monorepo conventions.
3. Writing tests, improving statistical engines, or refining the offline-first Delay-Tolerant Networking sync protocols.
4. Preparing presentation responses, pitch refinement, and executive summaries for NASA judges.

Here is the complete project document:
[Insert contents of this document here]
```

---

## 12. ASTRA-LOOP v2 Upgrades & Full NASA Space Apps Challenge 2026 Gap Closure

In November 2026, the complete ASTRA-LOOP platform was upgraded to **v2** to address all specific requirements published for the NASA Space Apps Challenge 2026.

### 12.1 The 11 Gap Closures Executed

1. **Expanded Physiological Indicators:** Added Blood Pressure (Systolic & Diastolic mmHg), Venous Blood Glucose (mg/dL), Core Body Temperature (°C), Pulse Oximetry (SpO2 %), Body Mass (kg), Hydration Score, and Cabin CO2 (ppm) to `HealthMetric`.
2. **All 5 NASA HRP Hazards Fully Modeled:** Integrated Space Radiation, Isolation and Confinement, Distance from Earth, Gravity Fields (0g, 0.16g Moon, 0.38g Mars), and Hostile Closed Environments across all 7 physiological domains (`risk.engine.ts` and `environment.engine.ts`).
3. **Clickable Interactive Human Body Interface (`/body`):** Vector SVG figure with 9 interactive organ systems, color-coded status states, pulsing attention glow, organ detail cards with flight rules, and an instant **Hazard Lens** toggle.
4. **Comprehensive Educational & Procedure Hub (`/learn`):** Interactive answers to all challenge questions: What can be measured in space and with which flight device? Why is each exam needed? How do hazards affect it? When does it require flight surgeon escalation? What preventive actions resolve it?
5. **Dual-Layer Clinical Safety Override:** Unconditional override preventing drifted personal baselines from hiding clinical pathology. Absolute floors/ceilings from NASA-STD-3001 force alerts (`threshold.engine.ts`).
6. **Clinical Decision Trees & Treatment Guidance Wizard (`/guidance`):** Interactive branching decision trees for sleep debt, cabin hypercapnia, hypertension, glycemic spikes, and pyrexia (`treatment.engine.ts`).
7. **Nutrition & Metabolic Domain:** Models daily caloric intake, macronutrient balance, Vitamin D/Calcium supplementation, and fluid hydration.
8. **Gamification & Adherence Motivation (`/progress`):** Sub-quadratic XP level progression, consecutive measurement streaks, and 5 NASA lore badges with exercise safety caps (`gamification.engine.ts`).
9. **5 Operational Environment Modes:** Switch between Spacecraft (Transit 0g), Space Station (LEO 0g), Pressurized Rover (0.38g), Moon Base (0.16g), and Mars Base (0.38g), dynamically re-weighting gravity deficits and speed-of-light comms lag (`environment.engine.ts`).
10. **Onboard Image & Ultrasound Scanner (`/routine`):** Browser-based camera stream and file upload with offline DTN buffering for ocular ONSD scans, skin lesion checks, and facial fatigue telemetry.
11. **Grounded in NASA Public Data & Standards:** 25+ aerospace citations in `docs/SOURCES.md`, quantitative reference norms in `packages/shared/src/knowledge/reference-stats.ts`, and live NOAA SWPC GOES satellite proton flux integration.

### 12.2 Verification & Test Suite Summary
- **Backend Test Suite:** 34 unit and API integration tests passing with 100% success (`apps/api/test/engines.test.ts` and `apps/api/test/api.test.ts`).
- **Frontend Build:** All 17 Next.js 14 App Router pages compile and optimize statically with 0 errors (`apps/web`).
- **Visual Verification:** 13 full-resolution screenshots captured across desktop (1280x900) and mobile (390x844) viewports in `docs/screenshots/`.



# ASTRA-LOOP v2 🛰️

**Autonomous Spaceflight Health Twin & Multi-Hazard Clinical Decision Support System**  
*Built for the NASA Space Apps Challenge 2026*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-blue?logo=prisma)](https://prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Offline--Ready-003B57?logo=sqlite)](https://sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NASA Standards](https://img.shields.io/badge/NASA--STD--3001-Vol%201%20%26%202-red)](https://www.nasa.gov/)

---

## 🚀 Quick Start (Under 5 Commands)

ASTRA-LOOP is completely pre-configured with a local zero-configuration SQLite database (`file:./dev.db`). No external database server or credentials are required.

```bash
# 1. Install all monorepo workspace dependencies
npm install

# 2. Build the shared TypeScript knowledge library
npm run build -w packages/shared

# 3. Apply schema and seed 90-day Vance + 120-day Lin missions
npm run prisma:push -w apps/api
npm run seed -w apps/api

# 4. Run test suite (34 passing tests across engines & API)
npm run test -w apps/api

# 5. Launch development servers (API on :4000, Web on :3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 What is ASTRA-LOOP v2?

During long-duration missions to Mars or deep space, astronauts face **5 distinct hazards** identified by NASA's Human Research Program (HRP):
1. **Space Radiation** (SPE solar storms & GCR cosmic rays)
2. **Isolation and Confinement** (circadian desynchrony, mood, cognitive latency)
3. **Distance from Earth** (14.3 to 22-minute speed-of-light comms delay preventing real-time Earth medical support)
4. **Gravity Fields** ($0g$ microgravity, $0.16g$ Lunar, $0.38g$ Martian bone/muscle unloading and cephalad fluid shifts)
5. **Hostile Closed Environment** (cabin hypercapnia $CO_2$, acoustics, thermal shifts)

ASTRA-LOOP is a **closed-loop autonomous bio-twin decision support system** that allows astronauts to assess their own health, predict multi-day risks, act via clinical decision trees, and learn which countermeasures work.

---

## 🧬 Key Features in v2

### 1. Interactive Clickable Human Body (`/body`)
- High-fidelity vector SVG anatomical twin with 9 distinct interactive systems:
  - Brain & Nervous System (PVT reaction latency, cognitive strain)
  - Ophthalmic System (Spaceflight-Associated Neuro-ocular Syndrome - SANS)
  - Cardiovascular Heart & Arteries (Arterial blood pressure, cephalad fluid shift)
  - Respiratory Lungs (Cabin $CO_2$ ventilation response)
  - Immune & Lymphatic (Pyrexia core temperature, latent viral reactivation)
  - Metabolic & Endocrine (Spaceflight insulin resistance, glucose excursions)
  - Musculoskeletal Muscle (ARED/T2 loading, atrophy countermeasures)
  - Skeletal Bone (Cancellous bone resorption, calcium excretion)
  - Integumentary Skin (Barrier integrity, micro-environment)
- **Real-Time Color-Coding:** Emerald (`NORMAL`), Amber (`MONITOR`), Rose/Red (`ATTENTION`).
- **Hazard Lens:** Instant toggle to view body through the lens of Gravity ($0g$), Radiation, Closed Environment ($CO_2$), Isolation, or Distance.

### 2. Clinical Decision Trees & Guidance Wizard (`/guidance`)
- Interactive branching decision trees for:
  - Sleep loss & circadian disruption
  - Cabin $CO_2$ hypercapnia & headache
  - Acute arterial hypertension
  - Glycemic spikes & spaceflight insulin resistance
  - Pyrexia & immune infection signs
- Resolves to immediate crew actions, escalation triage tier (`SELF_MANAGE`, `MONITOR`, `CONTACT_FLIGHT_SURGEON`, `EMERGENCY`), and delay-tolerant ground transmission drafts.

### 3. Astronaut Education & Knowledge Hub (`/learn`)
- Addresses all NASA Space Apps Challenge core questions:
  - What can be measured in space and with which flight device class?
  - Why is each exam needed?
  - How do spaceflight hazards affect each indicator?
  - When does a result need attention from flight surgeons?
  - What preventive actions avoid critical conditions?
- Includes 12+ mapped indicators with step-by-step procedures in plain, accessible English.

### 4. Daily Measurement Schedule & Ultrasound Scanner (`/routine`)
- Time-of-day buckets (Morning, Afternoon, Evening, Bedtime).
- Quick-entry modals for Blood Pressure, Blood Glucose, Body Temp, $SpO_2$.
- Real camera and ultrasound capture tool using device camera or file upload.
- Adherence ring and overdue penalty notifications.

### 5. Gamification & Adherence Motivation (`/progress`)
- Sub-quadratic XP leveling system and consistency streaks.
- 5 Mission Badges: Bone Guardian, Steady Heart, Circadian Master, Radiation Ready, Hydration Hero.
- **Safety Guardrail:** Strict adherence-based capping prevents harmful exercise over-exertion.

### 6. Operational Environment Switching
- Switch between **Spacecraft (0g)**, **Station (0g)**, **Rover (0.38g)**, **Moon Base (0.16g)**, and **Mars Base (0.38g)**.
- Automatically adjusts gravitational loading deficits, speed-of-light comms delays (from 0.05m in LEO to 14.3m in Deep Space), and risk engine weights.

### 7. Dual-Layer Safety Resolution
- **Layer 1:** 14-day flight baseline EWMA $Z$-score for individual trends.
- **Layer 2:** NASA-STD-3001 absolute clinical safety floors and ceilings.
- Layer 2 unconditionally overrides Layer 1, preventing drifted baselines from hiding critical clinical conditions.

### 8. Delay-Tolerant Networking (DTN)
- Full client-side IndexedDB buffer queues all actions during communications blackouts.
- One-click or automated background synchronization when RF link is re-established.

---

## 📊 Telemetry Indicators Mapped

| Indicator | Primary Spaceflight Device Class | Nominal Range | Warning Limit | Critical Threshold |
| :--- | :--- | :--- | :--- | :--- |
| **Systolic BP** | Inflatable Arm Cuff (Oscillometric) | 90–120 mmHg | $\ge 130$ mmHg | $\ge 140$ mmHg |
| **Diastolic BP** | Inflatable Arm Cuff (Oscillometric) | 60–80 mmHg | $\ge 85$ mmHg | $\ge 90$ mmHg |
| **Heart Rate** | Continuous Wearable ECG | 55–80 bpm | $> 95$ or $< 48$ | $> 110$ or $< 42$ |
| **Heart Rate Variability** | Wearable rMSSD | 45–95 ms | $< 35$ ms | $< 25$ ms |
| **Blood Glucose** | Capillary Fingerstick / CGM | 70–100 mg/dL | $> 140$ mg/dL | $> 180$ or $< 60$ mg/dL |
| **Core Temperature** | Infrared Tympanic Probe | 36.5–37.2 °C | $\ge 38.0$ °C | $\ge 38.5$ °C |
| **Pulse Oximetry ($SpO_2$)** | Finger Pulse Oximeter | 96–100% | $< 95$% | $< 90$% |
| **Cabin $CO_2$** | Environmental Gas Chromatograph | 400–2,500 ppm | $> 3,000$ ppm | $> 5,000$ ppm (SMAC) |
| **Sleep Duration** | Actigraphy & Sleep Log | 7.0–8.5 h | $< 6.0$ h | $< 5.0$ h |
| **PVT Reaction Latency** | Psychomotor Vigilance Test | 200–250 ms | $> 280$ ms | $> 350$ ms |
| **Radiation Dose Rate** | Torso Radiation Dosimeter | 0.02–0.08 mSv/h | $> 0.20$ mSv/h | $> 1.00$ mSv/h (SPE) |
| **Exercise Volume** | ARED & T2 Accelerometry | 120–150 min/day | $< 60$ min/day | $< 30$ min/day |

---

## 🏛️ Monorepo Workspaces

- `apps/web`: Next.js 14 App Router, Tailwind CSS, Lucide icons, Recharts, IDB.
- `apps/api`: Node.js, Express, Prisma ORM, SQLite database, Vitest test suite.
- `packages/shared`: Shared TypeScript contracts, Zod schemas, NASA Knowledge Base.

---

## 📜 Medical & Scientific Honesty

ASTRA-LOOP is a decision-support, research, and educational demonstration tool developed for the NASA Space Apps Challenge 2026. It is not an FDA-certified Class III medical device. All clinical thresholds, flight rules, and biological mechanisms are grounded in peer-reviewed evidence documented in `docs/SOURCES.md`, `docs/RISK_MODEL.md`, and NASA Technical Standard NASA-STD-3001.

---

## 📄 License
MIT License. Developed for the NASA International Space Apps Challenge 2026.

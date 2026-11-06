# Architectural & Engineering Decisions Log (ADR)
## ASTRA-LOOP v2 — NASA Space Apps Challenge 2026

This document records all architectural, clinical, and technical decisions made during the autonomous execution of ASTRA-LOOP v2.

---

### ADR-001: Zero-Configuration Database Strategy (SQLite Default with Full PostgreSQL Parity)
- **Context:** The challenge and verification requirements specify: *"Fresh clone → npm run setup → npm run dev works with no manual fixes; app runs fully without internet and without API keys."* A local environment or judge machine may not have a running Docker daemon, or may have a host PostgreSQL instance with unknown passwords.
- **Decision:** Configure Prisma datasource with SQLite (`file:./dev.db`) as the default out-of-the-box database engine. Retain 100% schema parity with PostgreSQL (Prisma models use standard universal types: `String`, `Float`, `Int`, `Boolean`, `DateTime`, relational cascading deletes, and indexes). A Docker-compose PostgreSQL file (`docker-compose.yml`) and migration guide are retained for production enterprise deployments.
- **Consequences:** `npm run setup` and `npm run seed` succeed 100% deterministically on any operating system without external service prerequisites.

---

### ADR-002: Dual-Layer Safety Resolution (Absolute Clinical Thresholds Override Personal Baseline)
- **Context:** A purely personal-baseline ($Z$-score) system has a critical safety flaw: if an astronaut slowly drifts into chronic hypertension (e.g. systolic BP 165 mmHg) or severe hyperglycemia, a rolling baseline might normalize the pathological state ($Z \approx 0$) and show "Green/Stable".
- **Decision:** Implement `threshold.engine.ts` as an absolute safety layer evaluating verified clinical standards (NASA-STD-3001, AHA/ACC, ADA). The final indicator status is resolved as:
  $$\text{Status} = \max(\text{AbsoluteStatus}, \text{BaselineZScoreStatus})$$
  Any `CRITICAL` absolute finding immediately forces overall system status to `ATTENTION`, triggers an `EscalationEvent`, and shows an unmissable operational advisory.

---

### ADR-003: Five HRP Hazards Integration & Environment Modes
- **Context:** NASA's Human Research Program (HRP) identifies five hazards: Space Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, and Hostile/Closed Environments.
- **Decision:** Rather than treating hazards as static background descriptions, model them dynamically:
  1. **Radiation:** Dosimeter monitoring + 72h watch window + cumulative career/mission limit gauges (NASA-STD-3001 / NCRP-132/153).
  2. **Gravity Fields:** Gravity scaling engine (`gravity.engine.ts`) with loading deficit calculations for Microgravity ($0\text{g}$), Moon ($0.16\text{g}$), Mars ($0.38\text{g}$), and Earth transit habitats ($1\text{g}$ centrifuge / transit).
  3. **Hostile/Closed Environment:** Cabin $\text{CO}_2$ ppm, temperature, humidity, noise thresholds from NASA-STD-3001 habitability and SMAC standards.
  4. **Isolation & Confinement:** Sociometric logging, mood trend analysis, sleep regularity, and acoustic prosody.
  5. **Distance from Earth:** Delay-Tolerant Networking (DTN) sync, realistic transmission delay modeling (up to 22 min), and fully autonomous offline treatment decision trees when real-time ground teleconsultation is impossible.

---

### ADR-004: Offline-First Image Capture for Telemedicine
- **Context:** Astronauts need visual documentation tools (e.g. skin rash, eye ultrasound, conjunctival redness, face swelling from cephalad fluid shift), but automated diagnostic AI without clinical oversight violates medical safety.
- **Decision:** The camera and image capture system functions strictly as a telemedicine acquisition and packaging pipeline. Captured ultrasound/camera imagery is encrypted and stored locally in IndexedDB, annotated with physiological context, queued for ground transmission, and rendered on the printable Flight Surgeon Report without automated diagnostic claims.


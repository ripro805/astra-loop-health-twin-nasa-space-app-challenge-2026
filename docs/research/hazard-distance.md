# Research Note: Distance from Earth (Hazard 3)
## NASA Human Research Program (HRP) Analysis

### Mechanism & Latency Physics
As a spacecraft ventures towards Mars, the one-way speed-of-light communication latency increases from near-instantaneous (LEO $< 1\text{ second}$, Moon $\approx 1.3\text{ seconds}$) to between $3$ and $22+$ minutes one-way ($6$ to $44+$ minutes round-trip), punctuated by planetary occultations and solar conjunction blackouts (up to 2 weeks where Mars is on the opposite side of the Sun).

### Operational & Clinical Consequences
- **Loss of Real-Time Terrestrial Telemedicine:** Earth-based flight surgeons cannot verbally coach emergency CPR, acute surgical intervention, or instant triage.
- **Necessity for Autonomous Decision Support:** The onboard computational architecture must be completely self-contained. Any system requiring continuous cloud connectivity or real-time human remote control will fail in deep space.
- **Medical Packaging & Supply Constraints:** Resupply missions are impossible. Every pharmaceutical, diagnostic consumable, and surgical item is bounded by mass, volume, and shelf-life expiration.

### Onboard System Design Implications
- **Offline-First & Delay-Tolerant Networking (DTN):** The system must execute all baseline evaluations, risk computations, and treatment trees completely locally on spacecraft edge nodes.
- **Self-Contained Autonomous Clinical Decision Trees:** When acute issues arise (e.g. fever, acute hypertensive episode, radiation alert), the software must provide immediate, step-by-step, self-executable guidance without awaiting terrestrial packets.
- **Asynchronous Telemedicine Reporting:** Once connection is established, consolidated Flight Surgeon Reports and telemetry batches are transmitted via DTN queue bundles.


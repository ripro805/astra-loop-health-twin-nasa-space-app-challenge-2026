# System Limitations & Medical Disclaimers
## ASTRA-LOOP v2

### 1. Regulatory Status & Non-Diagnostic Notice
**ASTRA-LOOP is a technology demonstration, decision-support, and education prototype developed for the NASA Space Apps Challenge 2026. It is not an FDA-cleared, CE-marked, or NASA-certified Class II/III medical diagnostic device.**
- It is intended to assist astronauts and mission operations personnel in early situational awareness, routine health habit adherence, and triage preparation.
- It does **not** provide autonomous definitive medical diagnoses, nor does it override established flight surgeon operational flight directives or NASA Flight Rules.

### 2. Algorithmic Boundaries
- **Synthetic Demonstration Telemetry:** Default timeline and demo telemetry are deterministically synthesized using Box-Muller Gaussian distributions conditioned on empirical distributions from NASA Twins Study, ISS medical operations literature, and analog bed-rest trials. All synthetic values are explicitly flagged (`isSynthetic: true`) in payloads and labeled in UI.
- **Correlation vs. Causation:** The Radiation Watch and Environment compound overlays represent multi-sensor temporal associations, not biological causal proofs.
- **Sensor Blind-Spots:** In the event of sensor dropouts, the system intentionally avoids predictive data imputation (zero hallucination policy). System confidence score proportionally degrades.
- **Delay-Tolerant Networking (DTN):** The offline synchronization model assumes eventual reconnection with the spacecraft local telemetry server or Earth ground stations.

### 3. Escalation Protocol
When the system identifies a `CRITICAL` absolute metric or enters an `EMERGENCY` tier, autonomous protocols guide the astronaut to immediate self-contained stabilization steps while simultaneously queuing a high-priority packet for Ground Flight Surgeon review via Delay-Tolerant Networking.


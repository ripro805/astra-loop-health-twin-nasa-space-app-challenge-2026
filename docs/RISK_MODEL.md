# Mathematical Risk Model & Domain Weights Specification
## ASTRA-LOOP v2 — NASA Space Apps Challenge 2026

### 1. Architectural Philosophy
The ASTRA-LOOP risk model is **deterministic, bounded in $[0, 100]$, explainable, and multi-factorial**. It operates on a dual-layer foundation:
1. **Personal Health Twin Layer:** Evaluates standardized deviations ($Z$-scores) and exponentially weighted moving averages (EWMA) against each astronaut's calibrated 14-day mission baseline.
2. **Absolute Clinical Safety Layer:** Evaluates metrics against clinical guidelines (NASA-STD-3001, ACC/AHA, ADA). Any absolute `CRITICAL` finding immediately elevates system status to `ATTENTION` regardless of personal baseline trends.

---

### 2. Multi-Domain Weight Formulations

$$\text{Risk} = \sum_{d \in \text{Domains}} W_d \cdot R_d + W_{\text{rad}\times\text{sleep}} \cdot I_{\text{rad}\times\text{sleep}} + W_{\text{co2}\times\text{sleep}} \cdot I_{\text{co2}\times\text{sleep}}$$

#### Exact Sum Integrity:
$$\sum W_i \equiv 1.000$$

### Weight Matrix by Mission Environment:

| Weight Component | Transit Spacecraft ($0\text{g}$) | Orbital Station ($0\text{g}$) | Mars Base ($0.38\text{g}$) | Moon Base ($0.16\text{g}$) | Surface Rover | Clinical & Operational Rationale |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **$W_{\text{cardio}}$** | 0.18 | 0.18 | 0.16 | 0.16 | 0.15 | HRV rMSSD + Resting HR + Systolic/Diastolic BP. High in $0\text{g}$ due to cephalad fluid shift. |
| **$W_{\text{sleep}}$** | 0.20 | 0.20 | 0.18 | 0.18 | 0.18 | Primary driver of cognitive vigilance, immune suppression, and operational error rate. |
| **$W_{\text{mind}}$** | 0.16 | 0.16 | 0.16 | 0.16 | 0.18 | Psychomotor Vigilance Test (PVT) reaction latency + subjective mood & allostatic stress. |
| **$W_{\text{muscleBone}}$** | 0.15 | 0.15 | 0.12 | 0.14 | 0.10 | Mechanical loading deficit. Reduced on Mars ($0.38\text{g}$) due to partial weight-bearing. |
| **$W_{\text{immune}}$** | 0.08 | 0.08 | 0.10 | 0.10 | 0.08 | Core temperature stability ("space fever") + neuroendocrine stress biomarkers. |
| **$W_{\text{metabolic}}$** | 0.08 | 0.08 | 0.10 | 0.08 | 0.11 | Fasting capillary blood glucose + hydration score + caloric energy balance. |
| **$W_{\text{environment}}$** | 0.07 | 0.07 | 0.10 | 0.10 | 0.12 | Habitat closed loop: cabin $\text{CO}_2$ ppm + temperature + humidity + ambient acoustic noise. Higher in tight rover cabins. |
| **$W_{\text{rad}\times\text{sleep}}$** | 0.05 | 0.05 | 0.04 | 0.05 | 0.05 | Compound interaction: radiation exposure exacerbating acute sleep debt recovery. |
| **$W_{\text{co2}\times\text{sleep}}$** | 0.03 | 0.03 | 0.04 | 0.03 | 0.03 | Compound interaction: elevated $\text{CO}_2$ pooling worsening sleep fragmentation. |
| **TOTAL** | **1.00** | **1.00** | **1.00** | **1.00** | **1.00** | **Mathematically verified partition of unity.** |

---

### 3. Domain Risk Conversion Functions

For any biological domain $d$:
$$Z = \frac{x_{\text{today}} - \mu_{14\text{d}}}{\sigma_{14\text{d}}}$$

- **For beneficial parameters** (e.g. HRV, Sleep Hours, Physical Activity):
  $$Z_{\text{effective}} = -Z$$
- **For adverse parameters** (e.g. Fatigue, Stress, PVT Latency, Blood Pressure, $\text{CO}_2$):
  $$Z_{\text{effective}} = +Z$$

The standardized $Z$-score is clamped in $[-3.0, +3.0]$ and linearly mapped to $[0, 100]$:
$$R_d = \text{round}\left(\frac{\text{clamp}(Z_{\text{effective}}, -3, 3) + 3}{6} \times 100\right)$$

*Note on Missing Sensor Data:* If a telemetry stream is unlinked, the domain defaults to a neutral risk value of $35$ (rather than assuming $0$) and significantly penalizes the system confidence score via `ConfidenceEngine`.

---

### 4. Compound Interaction Formulas

1. **Radiation $\times$ Sleep Debt Interaction:**
   $$\text{NormRad} = \min\left(1.0, \max\left(0, \frac{\text{DoseRate} - 0.05}{1.5}\right)\right)$$
   $$\text{SleepDebt} = \max(0, \text{BaselineSleep} - \text{CurrentSleep})$$
   $$\text{NormSleepDebt} = \min\left(1.0, \frac{\text{SleepDebt}}{3.0}\right)$$
   $$I_{\text{rad}\times\text{sleep}} = \text{round}(\text{NormRad} \times \text{NormSleepDebt} \times 100)$$

2. **Cabin $\text{CO}_2 \times$ Sleep Debt Interaction:**
   $$\text{NormCO}_2 = \min\left(1.0, \max\left(0, \frac{\text{CO}_2\text{ ppm} - 1800}{2200}\right)\right)$$
   $$I_{\text{co2}\times\text{sleep}} = \text{round}(\text{NormCO}_2 \times \text{NormSleepDebt} \times 100)$$


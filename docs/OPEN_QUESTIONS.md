# Open Questions & Clinical Review Register
## ASTRA-LOOP v2 — Decision Support Audit

In strict accordance with medical honesty guidelines, any clinical threshold, non-standard unit conversion, or heuristic formula that cannot be 100% corroborated from official published aerospace medicine standards is registered here with the flag `needsClinicalReview: true`.

---

| Item ID | Domain / Indicator | Current Parameter / Value | Clinical Reference Status | Proposed Clinical Study / Ground Truth Source |
| :--- | :--- | :--- | :--- | :--- |
| **CQ-001** | Spaceflight Hyperglycemia | Postprandial glucose warning $> 160\text{ mg/dL}$, critical $> 220\text{ mg/dL}$ | Standard terrestrial ADA thresholds adapted; spaceflight insulin resistance during long-duration flight requires microgravity glycemic clamp calibration. | NASA Twins Study & ISS Nutritional Status Assessment Protocol (Smith et al.). |
| **CQ-002** | Cephalad Fluid Shift BP Delta | Baseline seated BP to microgravity fluid shift compensation ($+5$ to $+10\text{ mmHg}$ central venous pressure) | Calibrated from parabolic and bed-rest analog studies; continuous non-invasive arterial pressure (CNAP) validation needed. | NASA Human Research Roadmap (Risk of Cardiovascular Disease and Other Degenerative Tissue Effects). |
| **CQ-003** | Compound CO₂ × Sleep Interaction | Interaction weight $= 0.15 \times \text{CO}_2\text{ Debt} \times \text{Sleep Debt}$ | Empirical heuristic modeling crew headache and sleep fragmentation observed on ISS at $\text{CO}_2 > 3.0\text{ mmHg}$ ($3900\text{ ppm}$). | Law et al., "Relationship Between Carbon Dioxide Levels and Reported Headaches on the ISS", J Occup Environ Med. |
| **CQ-004** | Lunar vs Mars Bone Remodeling Ratio | Sourced mechanical loading threshold: Lunar ($0.16\text{g}$) requires $2.5\text{h}$ resistive loading; Mars ($0.38\text{g}$) requires $1.8\text{h}$ | Extrapolated from partial-gravity rodent suspension models and ISS ARED prescription. | NASA Human Research Program HRP-47065 (Evidence Report: Risk of Early Onset Osteoporosis). |
| **CQ-005** | Acoustic Prosody Fatigue Correlation | Voice cadence inflection threshold $< 3.6\text{ syllables/sec}$ | Speech acoustic marker adapted from terrestrial psychomotor fatigue studies; microgravity vocal tract fluid redistribution may cause acoustic formant shift. | NASA Behavioral Health & Performance (BHP) Acoustic Biomarker Feasibility Trials. |

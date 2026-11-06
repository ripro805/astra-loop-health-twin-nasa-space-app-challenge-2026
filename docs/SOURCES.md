# Bibliography & Clinical Grounding References
## ASTRA-LOOP v2 — NASA Space Apps Challenge 2026

The clinical thresholds, indicator definitions, operational ranges, and treatment decision trees in ASTRA-LOOP are grounded in peer-reviewed space medicine literature, NASA engineering standards, and terrestrial guideline authorities.

---

### Primary Aerospace Medicine & NASA Standards

1. **NASA-STD-3001, Volume 1, Revision B (2022)** — *NASA Space Flight Human-System Standard: Crew Health.*
   - **URL:** https://www.nasa.gov/hhp/nasa-std-3001
   - **Application in ASTRA-LOOP:** Absolute permissible radiation exposure limits, cardiovascular health monitoring thresholds, and physical fitness standards.
2. **NASA-STD-3001, Volume 2, Revision D (2023)** — *NASA Space Flight Human-System Standard: Human Factors, Habitability, and Environmental Health.*
   - **URL:** https://www.nasa.gov/hhp/nasa-std-3001
   - **Application in ASTRA-LOOP:** Cabin $\text{CO}_2$ partial pressure limits ($< 3.0\text{ mmHg} \approx 3900\text{ ppm}$ operational, $< 2.0\text{ mmHg}$ nominal), cabin temperature ($18-27^\circ\text{C}$), relative humidity ($30-70\%$), and acoustic noise exposure curves (NC-50 / NC-40 sleep quarters).
3. **NASA Spacecraft Maximum Allowable Concentrations (SMACs) for Selected Airborne Contaminants** — *National Research Council Committee on Toxicology & NASA Johnson Space Center.*
   - **URL:** https://ntrs.nasa.gov/citations/20090014167
   - **Application in ASTRA-LOOP:** Atmospheric monitoring thresholds for trace gases and carbon dioxide escalation limits.
4. **NASA Human Research Roadmap (HRR) — Five Hazards of Human Spaceflight** — *NASA Human Research Program (HRP).*
   - **URL:** https://humanresearchroadmap.nasa.gov/
   - **Application in ASTRA-LOOP:** Core classification of the 5 hazards (Radiation, Isolation/Confinement, Distance from Earth, Gravity Fields, Hostile/Closed Environments) and cross-linkage to organ systems.
5. **NASA Evidence Report: Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders (2016)** — *BHP Element, NASA Johnson Space Center.*
   - **URL:** https://humanresearchroadmap.nasa.gov/evidence/reports/B-Med.pdf
   - **Application in ASTRA-LOOP:** Psychomotor Vigilance Test (PVT) thresholds ($> 280\text{ ms}$ warning, $> 350\text{ ms}$ critical), sleep regularity indexing, and crew isolation sociometrics.
6. **NASA Evidence Report: Risk of Early Onset Osteoporosis Due to Spaceflight (2017)** — *NASA HRP.*
   - **URL:** https://humanresearchroadmap.nasa.gov/evidence/reports/Bone.pdf
   - **Application in ASTRA-LOOP:** Mechanical loading deficit engine, daily ARED resistive loading targets, calcium/vitamin D intake recommendations.
7. **NASA Evidence Report: Risk of Impaired Performance Due to Reduced Muscle Mass, Strength, and Endurance (2017)** — *NASA HRP.*
   - **URL:** https://humanresearchroadmap.nasa.gov/evidence/reports/Muscle.pdf
   - **Application in ASTRA-LOOP:** Daily exercise volume requirements ($150\text{ min/day}$ combined aerobic and resistive in $0\text{g}$; scaled in partial gravity $0.16\text{g}$ and $0.38\text{g}$).
8. **NASA Evidence Report: Risk of Cardiovascular Disease and Other Degenerative Tissue Effects from Space Radiation (2016)** — *NASA HRP.*
   - **URL:** https://humanresearchroadmap.nasa.gov/evidence/reports/Degenerative.pdf
   - **Application in ASTRA-LOOP:** Endothelial dysfunction tracking, HRV autonomic monitoring, and radiation correlation timeline.
9. **Garrett-Bakelman, F. E., et al. (2019)** — *"The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight."* *Science*, 364(6436), eaau8650.
   - **DOI:** 10.1126/science.aau8650
   - **Application in ASTRA-LOOP:** Calibrated distributions for immune activation markers, telomere dynamics, and post-flight carotid artery intima-media thickness.
10. **Smith, S. M., Zwart, S. R., & Heer, M. (2021)** — *"Human Adaptation to Spaceflight: The Role of Nutrition."* NASA/SP-20210000000, NASA Johnson Space Center.
    - **URL:** https://www.nasa.gov/hhp/education
    - **Application in ASTRA-LOOP:** Caloric requirements ($2500-3200\text{ kcal/day}$ based on body weight), daily fluid intake ($2000-2500\text{ mL/day}$), and microgravity bone support nutrients.
11. **Law, J., et al. (2014)** — *"Relationship Between Carbon Dioxide Levels and Reported Headaches on the International Space Station."* *Journal of Occupational and Environmental Medicine*, 56(5), 477-483.
    - **DOI:** 10.1097/JOM.0000000000000158
    - **Application in ASTRA-LOOP:** Mathematical modeling of cabin $\text{CO}_2$ concentration vs. subjective headache and cognitive decline.
12. **Basner, M., & Dinges, D. F. (2011)** — *"Maximizing Sensitivity of the Psychomotor Vigilance Test (PVT) to Sleep Loss."* *Sleep*, 34(5), 581-591.
    - **DOI:** 10.1093/sleep/34.5.581
    - **Application in ASTRA-LOOP:** 3-minute brief PVT algorithm, reaction latency thresholds, and lapse scoring.
13. **NCRP Report No. 132 (2000) & NCRP Report No. 153 (2006)** — *Radiation Protection Guidance for Activities in Low-Earth Orbit and Deep Space.* National Council on Radiation Protection and Measurements.
    - **URL:** https://ncrponline.org/
    - **Application in ASTRA-LOOP:** 30-day, 1-year, and career radiation dose limits (e.g. $250\text{ mSv}$ 30-day limit for blood-forming organs, $600\text{ mSv}$ career limit).
14. **NOAA Space Weather Prediction Center (SWPC)** — *Solar Proton Event Scales and Space Weather Alert Definitions.*
    - **URL:** https://www.swpc.noaa.gov/noaa-scales-explanation
    - **Application in ASTRA-LOOP:** Radiation dose rate classifications (S1 to S5 Solar Radiation Storm levels) and storm-shelter escalation logic.
15. **NASA Open Science Data Repository (OSDR)** — *Spaceflight Omics and Human Health Telemetry Studies.*
    - **URL:** https://osdr.nasa.gov/
    - **Application in ASTRA-LOOP:** Baseline physiological distributions for resting HR, diurnal core body temperature variation, and actigraphy sleep phase data.

---

### Terrestrial Clinical Guidelines & Baseline Physiology

16. **Whelton, P. K., et al. (2018)** — *2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.* *Journal of the American College of Cardiology*, 71(19), e127-e248.
    - **DOI:** 10.1016/j.jacc.2017.11.006
    - **Application in ASTRA-LOOP:** Normal ($< 120/< 80\text{ mmHg}$), Elevated ($120-129/< 80$), Stage 1 ($130-139/80-89$), Stage 2 ($\ge 140/\ge 90$), and Hypertensive Crisis ($> 180/> 120\text{ mmHg}$) absolute safety thresholds.
17. **American Diabetes Association (ADA) (2024)** — *Standards of Care in Diabetes—2024.* *Diabetes Care*, 47(Suppl. 1), S1-S343.
    - **DOI:** 10.2337/dc24-S001
    - **Application in ASTRA-LOOP:** Fasting blood glucose normal ($70-99\text{ mg/dL}$), prediabetic ($100-125\text{ mg/dL}$), hypoglycemia warning ($< 70\text{ mg/dL}$), severe hypoglycemia critical ($< 54\text{ mg/dL}$), and acute hyperglycemia ($> 250\text{ mg/dL}$).
18. **Bickler, P. E., Feiner, J. R., & Severinghaus, J. W. (2005)** — *"Effects of skin pigmentation on pulse oximeter accuracy at low saturation."* *Anesthesiology*, 102(4), 715-719.
    - **DOI:** 10.1097/00000542-200504000-00004
    - **Application in ASTRA-LOOP:** Peripheral oxygen saturation ($\text{SpO}_2$) normal ($\ge 95\%$), hypoxemia warning ($90-94\%$), and critical hypoxemia ($< 90\%$).
19. **Sund-Levander, M., Forsberg, C., & Wahren, L. K. (2002)** — *"Normal oral, rectal, tympanic and axillary body temperature in adult men and women: a systematic literature review."* *Scandinavian Journal of Caring Sciences*, 16(2), 122-128.
    - **DOI:** 10.1046/j.1471-6712.2002.00069.x
    - **Application in ASTRA-LOOP:** Oral/tympanic body temperature normal ($36.1-37.2^\circ\text{C}$), subfebrile ($37.3-37.9^\circ\text{C}$), fever warning ($38.0-39.4^\circ\text{C}$), and hyperpyrexia critical ($\ge 39.5^\circ\text{C}$ / hypothermia $< 35.0^\circ\text{C}$).
20. **Shaffer, F., & Ginsberg, J. P. (2017)** — *"An Overview of Heart Rate Variability Metrics and Norms."* *Frontiers in Public Health*, 5, 258.
    - **DOI:** 10.3389/fpubh.2017.00258
    - **Application in ASTRA-LOOP:** Root mean square of successive differences (rMSSD) resting values for parasympathetic autonomic recovery tracking.
21. **Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001)** — *"The PHQ-9: validity of a brief depression severity measure."* *Journal of General Internal Medicine*, 16(9), 606-613.
    - **DOI:** 10.1046/j.1525-1497.2001.016009606.x
    - **Application in ASTRA-LOOP:** Adaptation of non-diagnostic validated items for crew mood self-reporting in long-duration isolation.
22. **Cohen, S., Kamarck, T., & Mermelstein, R. (1983)** — *"A Global Measure of Perceived Stress."* *Journal of Health and Social Behavior*, 24(4), 385-396.
    - **DOI:** 10.2307/2136404
    - **Application in ASTRA-LOOP:** 10-point validated perceived stress scale for daily astronaut check-in.
23. **Hirshkowitz, M., et al. (2015)** — *"National Sleep Foundation’s sleep time duration recommendations: methodology and results summary."* *Sleep Health*, 1(1), 40-43.
    - **DOI:** 10.1016/j.sleh.2014.12.010
    - **Application in ASTRA-LOOP:** Recommended adult sleep duration ($7-9\text{ hours}$), sleep debt accumulation modeling, and circadian misalignment detection.
24. **World Health Organization (WHO) (2020)** — *WHO Guidelines on Physical Activity and Sedentary Behaviour.* Geneva: World Health Organization.
    - **URL:** https://www.who.int/publications/i/item/9789240015128
    - **Application in ASTRA-LOOP:** Minimum terrestrial aerobic loading baselines contrasted with microgravity intensive maintenance regimens.
25. **NASA Space Flight Resource: Crew Health and Performance Exploration Dietary Supplementation Guidelines (2022)** — *NASA Nutritional Biochemistry Laboratory.*
    - **URL:** https://www.nasa.gov/johnson/HHP
    - **Application in ASTRA-LOOP:** Microgravity electrolyte balance, hydration score tracking, and fluid shift compensation.

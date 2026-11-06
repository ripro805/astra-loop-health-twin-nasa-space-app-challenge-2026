"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDICATOR_CATALOG = void 0;
exports.INDICATOR_CATALOG = [
    // 1. Blood Pressure (Systolic)
    {
        id: 'systolicBP',
        name: 'Systolic Blood Pressure',
        unit: 'mmHg',
        bodySystem: 'CARDIOVASCULAR',
        howToMeasure: [
            'Rest quietly in crew seat for 5 minutes before cuff inflation.',
            'Wrap inflatable cuff around upper left arm at heart level.',
            'Keep arm relaxed and remain silent during automated oscillometric cycle.',
        ],
        whyItMatters: 'Cephalad fluid shift in microgravity elevates central venous pressure and resets baroreceptors. Chronic high systolic pressure increases risk of stroke and ocular engorgement.',
        hazardLinks: [
            {
                hazard: 'GRAVITY_FIELDS',
                mechanism: 'Absence of hydrostatic pressure head redistributes 1.5-2L blood upward.',
            },
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'Elevated cabin CO2 causes peripheral vasodilation and sympathetic compensatory vasoconstriction.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Automated Arm Cuff Sphygmomanometer / Continuous Non-Invasive Arterial Pressure (CNAP)',
            feasibilityNotes: 'Standard medical kit on ISS and Orion vehicles.',
        },
        referenceRange: { min: 90, max: 120, nominalText: '90 - 120 mmHg' },
        warningRange: { low: 85, high: 140, warningText: '< 90 mmHg (hypotension) or 130 - 139 mmHg (Stage 1)' },
        criticalRange: { low: 75, high: 180, criticalText: '< 80 mmHg (shock risk) or ≥ 180 mmHg (hypertensive crisis)' },
        escalation: {
            selfManageGuidance: 'Rest in quarters, drink 500 mL electrolyte solution, avoid intense workout for 2 hours.',
            monitorGuidance: 'Repeat measurement in 30 minutes. Log subjective symptoms (headache, dizziness).',
            contactSurgeonGuidance: 'Sustained systolic > 140 mmHg over 3 readings requires async medical consult.',
            emergencyGuidance: 'Systolic ≥ 180 mmHg or < 80 mmHg with altered mental status requires immediate emergency crew assistance.',
        },
        preventiveActions: ['Maintain scheduled daily aerobic workout', 'Manage sodium intake to < 2.5 g/day', 'Ensure hydration score ≥ 80'],
        sources: ['NASA-STD-3001 Vol 1', 'ACC/AHA 2017 Hypertension Guidelines'],
        needsClinicalReview: false,
    },
    // 2. Blood Pressure (Diastolic)
    {
        id: 'diastolicBP',
        name: 'Diastolic Blood Pressure',
        unit: 'mmHg',
        bodySystem: 'CARDIOVASCULAR',
        howToMeasure: [
            'Captured simultaneously with systolic reading on the automated arm cuff.',
        ],
        whyItMatters: 'Reflects resting vascular resistance and arterial elasticity while the heart ventricles relax between beats.',
        hazardLinks: [
            {
                hazard: 'GRAVITY_FIELDS',
                mechanism: 'Altered arterial compliance and vascular deconditioning during long-duration flight.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Automated Arm Cuff Sphygmomanometer',
            feasibilityNotes: 'Standard operational equipment.',
        },
        referenceRange: { min: 60, max: 80, nominalText: '60 - 80 mmHg' },
        warningRange: { low: 55, high: 90, warningText: '< 60 mmHg or 80 - 89 mmHg' },
        criticalRange: { low: 45, high: 120, criticalText: '< 50 mmHg or ≥ 120 mmHg (Hypertensive Crisis)' },
        escalation: {
            selfManageGuidance: 'Maintain hydration and nominal fluid intake.',
            monitorGuidance: 'Re-test in 30 minutes with systolic BP.',
            contactSurgeonGuidance: 'Diastolic > 90 mmHg across consecutive days.',
            emergencyGuidance: 'Diastolic ≥ 120 mmHg with chest tightness or visual disturbance.',
        },
        preventiveActions: ['Daily aerobic and resistive training', 'Avoid excessive caffeine prior to bedtime'],
        sources: ['NASA-STD-3001 Vol 1', 'ACC/AHA 2017 Guidelines'],
        needsClinicalReview: false,
    },
    // 3. Resting Heart Rate
    {
        id: 'heartRate',
        name: 'Resting Heart Rate',
        unit: 'bpm',
        bodySystem: 'CARDIOVASCULAR',
        howToMeasure: [
            'Captured by continuous wearable photoplethysmography (PPG) during uninterrupted sleep / resting wakefulness.',
        ],
        whyItMatters: 'Basal autonomic indicator. Elevated resting HR reflects infection, dehydration, acute stress, or cardiac deconditioning.',
        hazardLinks: [
            {
                hazard: 'GRAVITY_FIELDS',
                mechanism: 'Reduced blood volume decreases stroke volume, forcing compensatory tachycardia.',
            },
            {
                hazard: 'RADIATION',
                mechanism: 'Acute radiation exposure can trigger systemic inflammatory tachycardia.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Continuous Wearable PPG Sensor / Smart Chest Strap',
            feasibilityNotes: 'Worn continuously by crew members on ISS.',
        },
        referenceRange: { min: 50, max: 80, nominalText: '50 - 80 bpm' },
        warningRange: { low: 45, high: 100, warningText: '< 50 bpm (severe bradycardia) or 85 - 100 bpm' },
        criticalRange: { low: 40, high: 130, criticalText: '< 40 bpm or > 130 bpm at rest (uncontrolled tachyarrhythmia)' },
        escalation: {
            selfManageGuidance: 'Hydrate with 500 mL water, practice 5 minutes resonant breathing.',
            monitorGuidance: 'Inspect HRV and body temperature to check for emerging infection or dehydration.',
            contactSurgeonGuidance: 'Resting HR sustained > 100 bpm for > 4 hours.',
            emergencyGuidance: 'Resting HR > 130 bpm with syncope or chest discomfort.',
        },
        preventiveActions: ['Regular cardiovascular interval training (CEVIS/T2)', 'Avoid stimulant overuse'],
        sources: ['NASA-STD-3001 Vol 1', 'AHA Guidelines'],
        needsClinicalReview: false,
    },
    // 4. Heart Rate Variability (HRV - rMSSD)
    {
        id: 'hrv',
        name: 'Heart Rate Variability (rMSSD)',
        unit: 'ms',
        bodySystem: 'CARDIOVASCULAR',
        howToMeasure: [
            'Recorded automatically overnight during slow-wave sleep via wearable PPG sensor.',
        ],
        whyItMatters: 'Root mean square of successive RR interval differences (rMSSD) reflects parasympathetic vagal tone and autonomic recovery margin.',
        hazardLinks: [
            {
                hazard: 'ISOLATION_CONFINEMENT',
                mechanism: 'Chronic psychological stress suppresses parasympathetic modulation.',
            },
            {
                hazard: 'RADIATION',
                mechanism: 'Radiation-induced oxidative load suppresses autonomic recovery.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Wearable Biosensor Ring or Wrist PPG',
            feasibilityNotes: 'Automated nocturnal metric calculation.',
        },
        referenceRange: { min: 45, max: 110, nominalText: 'Personal 14-day baseline dependent (typically 45-110 ms)' },
        warningRange: { low: 35, warningText: '> 1.2 Z decrease below 14-day baseline' },
        criticalRange: { low: 20, criticalText: '> 2.5 Z decrease below baseline' },
        escalation: {
            selfManageGuidance: 'Prioritize recovery sleep, reduce high-intensity workload today.',
            monitorGuidance: 'Track alongside PVT reaction time and sleep duration for compound autonomic fatigue.',
            contactSurgeonGuidance: 'HRV suppressed > 50% below baseline for 4+ consecutive days.',
            emergencyGuidance: 'Severe acute arrhythmia detected on ECG.',
        },
        preventiveActions: ['Circadian light alignment', 'Adequate sleep hygiene', 'Mindfulness / paced breathing'],
        sources: ['Shaffer & Ginsberg (2017)', 'NASA HRP BHP Evidence Book'],
        needsClinicalReview: false,
    },
    // 5. Blood Glucose
    {
        id: 'bloodGlucose',
        name: 'Blood Glucose',
        unit: 'mg/dL',
        bodySystem: 'METABOLIC_ENDOCRINE',
        howToMeasure: [
            'Clean fingertip with alcohol pad, let dry.',
            'Apply standard lancet to lateral side of fingertip.',
            'Touch test strip in handheld glucometer to blood droplet; record result in 5 seconds.',
        ],
        whyItMatters: 'Microgravity and spaceflight induce transient insulin resistance and glycemic variability. Hypoglycemia directly impairs cognitive reaction time and motor coordination.',
        hazardLinks: [
            {
                hazard: 'GRAVITY_FIELDS',
                mechanism: 'Musculoskeletal unloading reduces GLUT4 transporter density in skeletal muscle, causing insulin resistance.',
            },
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'Pre-packaged space diets and disrupted circadian rhythms perturb glucose homeostasis.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Handheld Capillary Blood Glucometer / Continuous Glucose Monitor (CGM)',
            feasibilityNotes: 'Standard ISS medical kit diagnostic tool.',
        },
        referenceRange: { min: 70, max: 99, nominalText: '70 - 99 mg/dL (fasting), < 140 mg/dL (postprandial)' },
        warningRange: { low: 65, high: 160, warningText: '< 70 mg/dL (mild hypoglycemia) or 140 - 180 mg/dL' },
        criticalRange: { low: 54, high: 250, criticalText: '< 54 mg/dL (severe neuroglycopenia risk) or > 250 mg/dL (hyperglycemia crisis)' },
        escalation: {
            selfManageGuidance: 'If < 70 mg/dL, consume 15g fast-acting carbohydrates (juice/tablet) and re-test in 15 mins.',
            monitorGuidance: 'Log meal timing, exercise session timing, and re-test postprandially.',
            contactSurgeonGuidance: 'Repeated fasting glucose > 126 mg/dL or recurrent hypoglycemic dips.',
            emergencyGuidance: 'Glucose < 54 mg/dL with confusion, tremors, or glucose > 300 mg/dL with vomiting.',
        },
        preventiveActions: ['Balanced complex carbohydrate and protein meal pacing', 'Consistent meal schedules'],
        sources: ['ADA 2024 Standards of Care', 'Smith et al., Human Adaptation to Spaceflight: Nutrition (2021)'],
        needsClinicalReview: false,
    },
    // 6. Body Temperature
    {
        id: 'bodyTemp',
        name: 'Core Body Temperature',
        unit: '°C',
        bodySystem: 'IMMUNE_LYMPHATIC',
        howToMeasure: [
            'Insert infrared tympanic thermometer gently into ear canal.',
            'Press measurement trigger until audible confirmation beep sounds.',
        ],
        whyItMatters: 'Spaceflight alters thermoregulation: reduced convective heat loss in microgravity elevates baseline core temperature ("space fever"). Fever signals infectious, inflammatory, or toxic exposure.',
        hazardLinks: [
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'Impoverished convection and closed air loop elevates core temperature during and after exercise.',
            },
            {
                hazard: 'RADIATION',
                mechanism: 'Acute radiation exposure triggers systemic inflammatory cytokine cascade elevating body temperature.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Infrared Tympanic Thermometer / Double-sensor Forehead Heat Flux Patch',
            feasibilityNotes: 'Standard onboard clinical diagnostic instrument.',
        },
        referenceRange: { min: 36.1, max: 37.2, nominalText: '36.1 - 37.2 °C' },
        warningRange: { low: 35.5, high: 38.0, warningText: '37.3 - 38.4 °C (low-grade fever / thermoregulatory stress)' },
        criticalRange: { low: 35.0, high: 39.5, criticalText: '< 35.0 °C (hypothermia) or ≥ 38.5 °C (high fever) / ≥ 39.5 °C (severe pyrexia)' },
        escalation: {
            selfManageGuidance: 'Rest, hydrate with cold fluids, adjust cabin air vent towards crew bunk.',
            monitorGuidance: 'Re-check temperature every 2 hours; evaluate for rash, cough, or urinary symptoms.',
            contactSurgeonGuidance: 'Persistent fever > 38.0 °C lasting > 12 hours.',
            emergencyGuidance: 'Temperature ≥ 39.5 °C or fever accompanied by stiff neck, confusion, or rash.',
        },
        preventiveActions: ['Adequate post-exercise hydration', 'ECLSS cabin temperature regulation (21-23 °C)'],
        sources: ['Sund-Levander et al. (2002)', 'NASA-STD-3001 Vol 1'],
        needsClinicalReview: false,
    },
    // 7. Oxygen Saturation (SpO2)
    {
        id: 'spo2',
        name: 'Peripheral Capillary Oxygen Saturation (SpO2)',
        unit: '%',
        bodySystem: 'RESPIRATORY',
        howToMeasure: [
            'Warm fingertip, place pulse oximeter clip firmly on index or middle finger.',
            'Hold still for 15 seconds until waveform and saturation percentage stabilize.',
        ],
        whyItMatters: 'Directly measures oxygen transport efficiency. Drops in closed spacecraft cabins indicate ECLSS partial pressure oxygen failure or localized pulmonary pathology.',
        hazardLinks: [
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'ECLSS atmospheric nitrogen/oxygen dilution or localized gas stratification.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Fingertip Pulse Oximeter',
            feasibilityNotes: 'Available on all human spaceflight platforms.',
        },
        referenceRange: { min: 95, max: 100, nominalText: '95 - 100%' },
        warningRange: { low: 90, warningText: '90 - 94% (mild to moderate hypoxemia)' },
        criticalRange: { low: 88, criticalText: '< 90% (severe hypoxemia requiring immediate supplemental oxygen)' },
        escalation: {
            selfManageGuidance: 'Take 5 deep breaths, ensure sensor is warm and well-perfused, re-test.',
            monitorGuidance: 'Cross-check cabin atmospheric O2 partial pressure and cabin CO2 levels.',
            contactSurgeonGuidance: 'SpO2 remains 90 - 93% on ambient cabin atmosphere.',
            emergencyGuidance: 'SpO2 < 90% requires immediate donning of Emergency Oxygen Mask and ECLSS check.',
        },
        preventiveActions: ['Routine cabin gas composition verification', 'Regular aerobic exercise'],
        sources: ['Bickler et al. (2005)', 'NASA-STD-3001 Vol 2'],
        needsClinicalReview: false,
    },
    // 8. Sleep Hours
    {
        id: 'sleepHours',
        name: 'Sleep Duration',
        unit: 'hours',
        bodySystem: 'BRAIN_NERVOUS',
        howToMeasure: [
            'Computed automatically via wearable actigraphy tracking motion, skin temperature, and autonomic state.',
        ],
        whyItMatters: 'Chronic sleep deprivation (< 6h) compounds cognitive error rate, slows PVT reaction speed, impairs emotional stability, and blunts immune function.',
        hazardLinks: [
            {
                hazard: 'ISOLATION_CONFINEMENT',
                mechanism: 'Circadian desynchronosis, habitat noise, and artificial lighting perturb slow-wave sleep.',
            },
            {
                hazard: 'RADIATION',
                mechanism: 'Sub-acute radiation exposure fragments sleep architecture and increases awakenings.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Actigraphy Biosensor Wristband',
            feasibilityNotes: 'Automated nightly scoring.',
        },
        referenceRange: { min: 7.0, max: 9.0, nominalText: '7.0 - 9.0 hours' },
        warningRange: { low: 6.0, high: 10.0, warningText: '< 6.5 hours (accumulating sleep debt)' },
        criticalRange: { low: 4.5, criticalText: '< 5.0 hours (acute cognitive impairment threshold)' },
        escalation: {
            selfManageGuidance: 'Advance sleep schedule by 30 mins; dim quarters lighting to warm red spectrum.',
            monitorGuidance: 'Track sleep debt score across rolling 7-day period.',
            contactSurgeonGuidance: 'Chronic sleep duration < 5.5 hours for > 5 consecutive nights.',
            emergencyGuidance: 'Acute sleep deprivation causing hallucinations or severe motor errors.',
        },
        preventiveActions: ['Circadian lighting schedule', 'Strict sleep hygiene', 'Acoustic earplugs in crew bunk'],
        sources: ['Hirshkowitz et al. (2015)', 'NASA HRP BHP Evidence Book'],
        needsClinicalReview: false,
    },
    // 9. Psychomotor Vigilance Latency (PVT)
    {
        id: 'reactionTimeMs',
        name: 'Psychomotor Vigilance Test (PVT) Latency',
        unit: 'ms',
        bodySystem: 'BRAIN_NERVOUS',
        howToMeasure: [
            'Sit comfortably with tablet in front of you.',
            'Tap reactive target the instant it flashes green; do not anticipate or tap early.',
            'Completed in 3 minutes during daily check-in.',
        ],
        whyItMatters: 'Gold standard objective biomarker of cognitive fatigue and neurobehavioral vigilance. Slower latency directly correlates with mission-critical piloting and robotics error risk.',
        hazardLinks: [
            {
                hazard: 'ISOLATION_CONFINEMENT',
                mechanism: 'Workload strain and sleep debt degrade prefrontal cortical processing speed.',
            },
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'Elevated cabin CO2 causes cognitive slowing and vigilance lapses.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Standardized Tablet / Laptop Touchscreen App',
            feasibilityNotes: 'Used routinely on ISS (Brief PVT protocol).',
        },
        referenceRange: { min: 190, max: 250, nominalText: '190 - 250 ms (personal baseline calibrated)' },
        warningRange: { high: 280, warningText: '> 270 ms (+40 ms over baseline)' },
        criticalRange: { high: 350, criticalText: '> 350 ms or multiple lapse errors (> 500 ms)' },
        escalation: {
            selfManageGuidance: 'Take 20-minute cognitive rest window, hydrate, delay non-critical complex tasks.',
            monitorGuidance: 'Pair with subjective fatigue rating and sleep log.',
            contactSurgeonGuidance: 'Sustained latency > 300 ms across 3 consecutive days.',
            emergencyGuidance: 'Severe cognitive lapse (> 500 ms) before scheduled EVA or docking maneuvers.',
        },
        preventiveActions: ['Protect 7.5h sleep opportunity', 'Balance task load and rest cycles'],
        sources: ['Basner & Dinges (2011)', 'NASA-STD-3001 Vol 1'],
        needsClinicalReview: false,
    },
    // 10. Cabin Carbon Dioxide (CO2)
    {
        id: 'cabinCO2ppm',
        name: 'Cabin Carbon Dioxide Concentration',
        unit: 'ppm',
        bodySystem: 'RESPIRATORY',
        howToMeasure: [
            'Sampled continuously by habitat environmental sensors and Major Constituent Analyzers (MCA).',
        ],
        whyItMatters: 'In closed microgravity cabins without natural convective mixing, CO2 pools in localized bubbles. Even moderate levels cause headaches, lethargy, cognitive impairment, and visual changes.',
        hazardLinks: [
            {
                hazard: 'HOSTILE_CLOSED_ENVIRONMENT',
                mechanism: 'Human respiration in sealed habitat without adequate forced airflow causes rapid CO2 buildup.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Fixed NDIR Infrared Gas Sensor & Handheld Environmental Sniffer',
            feasibilityNotes: 'Primary ECLSS life support telemetry.',
        },
        referenceRange: { min: 400, max: 2000, nominalText: '< 2000 ppm (< 1.5 mmHg partial pressure)' },
        warningRange: { high: 3000, warningText: '2500 - 4000 ppm (headache risk and cognitive fatigue)' },
        criticalRange: { high: 5000, criticalText: '≥ 5000 ppm (hypercapnia risk; immediate scrubber intervention required)' },
        escalation: {
            selfManageGuidance: 'Ensure personal crew quarter ventilation fans are running on high.',
            monitorGuidance: 'Inspect localized module circulation; check CDRA (Carbon Dioxide Removal Assembly) status.',
            contactSurgeonGuidance: 'Habitat sustained CO2 > 3500 ppm with crew reports of frontal headaches.',
            emergencyGuidance: 'CO2 ≥ 5000 ppm requires immediate donning of portable breathing apparatus and scrubber bypass.',
        },
        preventiveActions: ['Verify cabin circulation fan speeds', 'Maintain CDRA/Amine scrubber bed maintenance'],
        sources: ['Law et al. (2014)', 'NASA-STD-3001 Vol 2', 'SMAC Guidelines'],
        needsClinicalReview: false,
    },
    // 11. Daily Exercise Load / Minutes
    {
        id: 'exerciseMinutes',
        name: 'Daily Exercise Duration & Load',
        unit: 'min',
        bodySystem: 'MUSCULOSKELETAL_BONE',
        howToMeasure: [
            'Logged automatically from ARED (resistive), T2 (treadmill), and CEVIS (cycle) ergometers.',
        ],
        whyItMatters: 'High-intensity resistive and aerobic exercise is the primary non-pharmaceutical countermeasure against bone mineral density loss, muscle sarcopenia, and cardiovascular deconditioning.',
        hazardLinks: [
            {
                hazard: 'GRAVITY_FIELDS',
                mechanism: 'Unloading removes mechanical strain on osteocytes and muscle fibers, triggering rapid catabolism.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Telemetry linked to ARED / T2 exercise devices',
            feasibilityNotes: 'Mandatory daily scheduled mission task.',
        },
        referenceRange: { min: 120, max: 150, nominalText: '120 - 150 min/day (in 0g microgravity)' },
        warningRange: { low: 90, warningText: '< 90 min/day (accelerated bone and muscle catabolism)' },
        criticalRange: { low: 45, criticalText: '< 45 min/day or missed 2 consecutive days' },
        escalation: {
            selfManageGuidance: 'Complete split session (aerobic now, resistive later in day).',
            monitorGuidance: 'Evaluate reason for missed session (fatigue, equipment maintenance, scheduling conflict).',
            contactSurgeonGuidance: 'Exercise missed for > 3 consecutive days due to physical discomfort.',
            emergencyGuidance: 'Acute musculoskeletal injury during heavy resistive loading.',
        },
        preventiveActions: ['Prioritize exercise slots in daily timeline', 'Proper biomechanical form during ARED lifts'],
        sources: ['NASA HRP Bone & Muscle Evidence Books (2017)', 'NASA-STD-3001 Vol 1'],
        needsClinicalReview: false,
    },
    // 12. Active Radiation Dose Rate
    {
        id: 'radiationDoseRate',
        name: 'Ambient Radiation Dose Rate',
        unit: 'mSv/h',
        bodySystem: 'IMMUNE_LYMPHATIC',
        howToMeasure: [
            'Continuous telemetry from silicon dosimeter array and habitat radiation area monitors.',
        ],
        whyItMatters: 'Monitors acute radiation exposure. Acute spikes indicate Solar Particle Events (SPE) requiring immediate habitat shelter to prevent radiation sickness.',
        hazardLinks: [
            {
                hazard: 'RADIATION',
                mechanism: 'Solar coronal mass ejections eject relativistic protons penetrating thin hull structures.',
            },
        ],
        onboardMethod: {
            deviceClass: 'Active Silicon Dosimeter Badges & Habitat Area Detectors',
            feasibilityNotes: 'Continuous background monitoring.',
        },
        referenceRange: { min: 0.02, max: 0.08, nominalText: '0.03 - 0.06 mSv/h (Galactic Cosmic Ray background)' },
        warningRange: { high: 0.20, warningText: '≥ 0.20 mSv/h (initiates 72-hour observation window)' },
        criticalRange: { high: 1.00, criticalText: '≥ 1.00 mSv/h (Solar Particle Event Storm - Immediate Shelter Protocol)' },
        escalation: {
            selfManageGuidance: 'Remain inside habitat central core; avoid external module berths.',
            monitorGuidance: 'Track dosimeter dose rate every 30 minutes; initiate 72h physiological watch window.',
            contactSurgeonGuidance: 'Dose rate > 0.50 mSv/h sustained; transmit dosimetry packet to ground.',
            emergencyGuidance: 'Dose rate ≥ 1.00 mSv/h: Sound storm alert, retreat to storm shelter surrounded by water bags.',
        },
        preventiveActions: ['Monitor space weather forecasts (NOAA/DONKI)', 'Configure storm shelter in advance'],
        sources: ['NCRP Report 153', 'NASA-STD-3001 Vol 1', 'NOAA SWPC Scales'],
        needsClinicalReview: false,
    },
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TREATMENT_DECISION_TREES = void 0;
exports.TREATMENT_DECISION_TREES = {
    // 1. Sleep Loss & Circadian Misalignment
    sleep_loss: {
        id: 'sleep_loss',
        title: 'Sleep Loss & Circadian Disruption Protocol',
        triggerCondition: 'Sleep duration < 6.0 hours or subjective sleep debt score elevated',
        category: 'SLEEP',
        rootNodeId: 'node_sleep_root',
        medicalDisclaimer: 'Decision support only. Follow mission flight rules and consulting flight surgeon operational directives.',
        nodes: {
            node_sleep_root: {
                id: 'node_sleep_root',
                question: 'How many consecutive nights has sleep duration been under 6 hours?',
                explanation: 'Acute vs cumulative sleep loss requires different countermeasure pacing.',
                options: [
                    {
                        label: '1 night (Acute sleep deficit)',
                        nextNodeId: 'node_sleep_acute',
                    },
                    {
                        label: '2 to 3 nights (Sub-acute accumulation)',
                        nextNodeId: 'node_sleep_subacute',
                    },
                    {
                        label: '4 or more nights (Chronic sleep debt)',
                        nextNodeId: 'node_sleep_chronic',
                    },
                ],
            },
            node_sleep_acute: {
                id: 'node_sleep_acute',
                question: 'Are you scheduled for high-criticality operations (EVA, docking, robotics) today?',
                explanation: 'Acute sleep deficit significantly increases psychomotor latency.',
                options: [
                    {
                        label: 'Yes, mission-critical tasks scheduled',
                        terminalAction: {
                            title: 'Cognitive Recovery Pacing & Task Cross-Check',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Perform 3-minute PVT test immediately to quantify current reaction latency.',
                                'Mandate second crew member visual cross-check on all safety-critical switch alignments.',
                                'Schedule 20-minute structured sensory rest interval before task execution.',
                                'Limit caffeine intake to 100mg, timed at least 6 hours before next planned sleep period.',
                            ],
                            countermeasureType: 'RECOVERY_PERIOD',
                            flightSurgeonNotificationNote: 'Logged acute sleep deficit with scheduled critical task.',
                            source: 'NASA HRP BHP Evidence Book & NASA-STD-3001 Vol 1',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'No, standard routine tasks',
                        terminalAction: {
                            title: 'Sleep Phase Adjustment Protocol',
                            tier: 'SELF_MANAGE',
                            immediateSteps: [
                                'Advance tonight’s sleep schedule by 30 minutes.',
                                'Attenuate crew quarters lighting to < 10 lux warm spectrum 45 minutes prior to sleep onset.',
                                'Ensure personal ventilation fan is angled for clear airflow to prevent localized CO2 pooling.',
                            ],
                            countermeasureType: 'SLEEP_PHASE_ADJUSTMENT',
                            flightSurgeonNotificationNote: 'Autonomous sleep phase adjustment logged.',
                            source: 'NASA-STD-3001 Vol 2',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
            node_sleep_subacute: {
                id: 'node_sleep_subacute',
                question: 'Is sleep disruption primarily due to difficulty falling asleep or nighttime awakenings?',
                explanation: 'Helps distinguish environmental noise/CO2 issues from circadian phase delay.',
                options: [
                    {
                        label: 'Difficulty falling asleep (Circadian phase delay)',
                        terminalAction: {
                            title: 'Circadian Light Entrainment Protocol',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Schedule 30-minute high-intensity blue-enriched (480nm) light exposure within 1 hour post-wake.',
                                'Eliminate screen use in crew bunk 60 minutes before scheduled sleep.',
                                'Confirm bunk temperature is within 20 - 22°C comfort band.',
                            ],
                            countermeasureType: 'LIGHTING_SCHEDULE',
                            flightSurgeonNotificationNote: 'Sub-acute sleep fragmentation managed with lighting schedule.',
                            source: 'NASA Twins Study & ISS Lighting Protocols',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'Nighttime awakenings (Noise, localized CO2, discomfort)',
                        terminalAction: {
                            title: 'Habitability & Ventilation Sweep',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Inspect crew bunk ventilation inlet/outlet for particulate obstruction.',
                                'Deploy active noise-attenuating earplugs.',
                                'Check module atmospheric CO2 reading before entering bunk.',
                            ],
                            countermeasureType: 'CIRCADIAN_MAINTENANCE',
                            flightSurgeonNotificationNote: 'Habitability check for sleep awakenings.',
                            source: 'NASA-STD-3001 Vol 2 Habitability',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
            node_sleep_chronic: {
                id: 'node_sleep_chronic',
                question: 'Has severe fatigue, daytime microsleep, or PVT latency > 300 ms occurred?',
                explanation: 'Chronic multi-day sleep deficit poses high operational safety risk.',
                options: [
                    {
                        label: 'Yes, subjective exhaustion or PVT latency > 300 ms',
                        terminalAction: {
                            title: 'Flight Surgeon Escalation: Stand-Down & Sleep Protocol',
                            tier: 'CONTACT_FLIGHT_SURGEON',
                            immediateSteps: [
                                'Initiate asynchronous consult with Ground Flight Surgeon.',
                                'Request operational mission workload relief / task reprioritization.',
                                'Flight Surgeon will evaluate authorization for approved short-acting hypnotic countermeasure (e.g. zolpidem/melatonin per medical kit rules).',
                                'Stand down from solo safety-critical piloting or EVA operations.',
                            ],
                            countermeasureType: 'MEDICAL_CONSULT_NOTICE',
                            flightSurgeonNotificationNote: 'CRITICAL: Multi-day chronic sleep debt with cognitive latency shift.',
                            source: 'NASA Space Flight Human-System Standard Vol 1',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'No, but alertness is progressively declining',
                        terminalAction: {
                            title: 'Aggressive Circadian Realignment & Workload Cap',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Advance sleep window by 60 minutes tonight.',
                                'Mandate 45-minute afternoon sensory rest block in dark quarters.',
                                'Cap continuous high-demand work shift at 6 hours.',
                            ],
                            countermeasureType: 'RECOVERY_PERIOD',
                            flightSurgeonNotificationNote: 'Chronic sleep debt under structured recovery pacing.',
                            source: 'NASA HRP BHP Evidence Book',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
        },
    },
    // 2. Headache & Elevated Carbon Dioxide (CO2)
    headache_co2: {
        id: 'headache_co2',
        title: 'Carbon Dioxide (CO2) Exposure & Headache Protocol',
        triggerCondition: 'Cabin CO2 > 2500 ppm or crew reports persistent frontal headache',
        category: 'HEADACHE_CO2',
        rootNodeId: 'node_co2_root',
        medicalDisclaimer: 'Decision support only. Hypercapnia in enclosed space habitats requires active life-support mitigation.',
        nodes: {
            node_co2_root: {
                id: 'node_co2_root',
                question: 'What is the current cabin atmospheric CO2 reading from the environmental display?',
                explanation: 'Atmospheric partial pressure determines urgency of ECLSS scrubber intervention.',
                options: [
                    {
                        label: 'CO2 is elevated: 2500 - 3500 ppm (1.9 - 2.7 mmHg)',
                        nextNodeId: 'node_co2_moderate',
                    },
                    {
                        label: 'CO2 is severely high: > 4000 ppm (> 3.0 mmHg)',
                        nextNodeId: 'node_co2_severe',
                    },
                    {
                        label: 'CO2 is normal (< 2000 ppm), but headache is present',
                        nextNodeId: 'node_co2_normal_headache',
                    },
                ],
            },
            node_co2_moderate: {
                id: 'node_co2_moderate',
                question: 'Are personal ventilation fans operating at high speed in your immediate workstation?',
                explanation: 'In microgravity, exhaled CO2 forms a stagnant bubble around a stationary astronaut.',
                options: [
                    {
                        label: 'Fans were low or turned off',
                        terminalAction: {
                            title: 'Personal Forced Air Flow Restoration',
                            tier: 'SELF_MANAGE',
                            immediateSteps: [
                                'Turn personal workstation and sleep bunk airflow ducting to HIGH.',
                                'Step into central module aisle where ventilation velocity is > 15 ft/min.',
                                'Drink 350 mL cool water; re-evaluate headache in 30 minutes.',
                            ],
                            countermeasureType: 'HABITABILITY_VENTILATION',
                            flightSurgeonNotificationNote: 'Localized CO2 pocket clearing with fan modulation.',
                            source: 'Law et al., CO2 and Headaches on ISS (2014)',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'Fans were on high; entire module air is elevated',
                        terminalAction: {
                            title: 'ECLSS Scrubber Verification & Pacing',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Inspect Carbon Dioxide Removal Assembly (CDRA) telemetry on systems console.',
                                'Confirm desiccant/amine scrubber bed cycle timing is nominal.',
                                'If exercising, pause heavy workout until cabin CO2 drops below 2500 ppm.',
                            ],
                            countermeasureType: 'EXERCISE_LOAD_ADJUSTMENT',
                            flightSurgeonNotificationNote: 'Cabin-wide CO2 elevation with crew symptom.',
                            source: 'NASA-STD-3001 Vol 2',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
            node_co2_severe: {
                id: 'node_co2_severe',
                question: 'Are multiple crew members reporting throbbing headache, dizziness, or visual changes?',
                explanation: 'High CO2 can impair all crew simultaneously.',
                options: [
                    {
                        label: 'Yes, multiple crew affected or CO2 ≥ 5000 ppm',
                        terminalAction: {
                            title: 'EMERGENCY: Hypercapnia & ECLSS Scrubber Failure Protocol',
                            tier: 'EMERGENCY',
                            immediateSteps: [
                                'Immediately sound Environmental Hazard Advisory to crew.',
                                'Don Portable Breathing Apparatus (PBA) / Oxygen Masks if CO2 exceeds 5000 ppm.',
                                'Execute emergency manual switchover to secondary LiOH (Lithium Hydroxide) scrubber canister.',
                                'Notify Ground Flight Control via High-Priority Emergency Comm Loop.',
                            ],
                            countermeasureType: 'EMERGENCY_ECLSS_PROTOCOL',
                            flightSurgeonNotificationNote: 'EMERGENCY ECLSS HYPERCAPNIA ALERT TRANSMITTED.',
                            source: 'NASA ISS Flight Rules Section B13 (Environmental Control)',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'No, isolated reading; crew symptomatic with moderate headache',
                        terminalAction: {
                            title: 'Flight Surgeon Notice & Module Ventilation Sweep',
                            tier: 'CONTACT_FLIGHT_SURGEON',
                            immediateSteps: [
                                'Log automated clinical alert with Ground Flight Surgeon.',
                                'Switch habitat air exchange valves to high-rate inter-module ventilation.',
                                'Administer oral acetaminophen or ibuprofen per onboard medicine kit guidelines.',
                            ],
                            countermeasureType: 'MEDICAL_CONSULT_NOTICE',
                            flightSurgeonNotificationNote: 'Sustained hypercapnia warning with crew headache.',
                            source: 'NASA-STD-3001 Vol 2',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
            node_co2_normal_headache: {
                id: 'node_co2_normal_headache',
                question: 'Does the headache correlate with cephalad fluid shift (facial puffiness, sinus fullness)?',
                explanation: 'Microgravity fluid shift elevates internal jugular and intracranial venous pressure.',
                options: [
                    {
                        label: 'Yes, sinus fullness and head congestion',
                        terminalAction: {
                            title: 'Cephalad Fluid Shift Pacing',
                            tier: 'SELF_MANAGE',
                            immediateSteps: [
                                'Perform 20-minute lower-body loading or cycling on CEVIS to promote peripheral pooling.',
                                'Stay well-hydrated; avoid excessive neck hyperextension.',
                                'Apply warm facial compress for sinus congestion relief.',
                            ],
                            countermeasureType: 'EXERCISE_LOAD_ADJUSTMENT',
                            flightSurgeonNotificationNote: 'Fluid shift sinus headache self-managed.',
                            source: 'NASA HRP Cardiovascular Evidence Book',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'No, headache is sharp, unilateral, or with visual aura',
                        terminalAction: {
                            title: 'Ophthalmic / Neuro Evaluation Notice',
                            tier: 'CONTACT_FLIGHT_SURGEON',
                            immediateSteps: [
                                'Perform ophthalmic self-check (visual acuity card & Amsler grid).',
                                'Prepare portable ocular ultrasound probe for optic nerve sheath diameter (ONSD) scan.',
                                'Transmit symptom summary to Flight Surgeon.',
                            ],
                            countermeasureType: 'MEDICAL_CONSULT_NOTICE',
                            flightSurgeonNotificationNote: 'Unilateral or visual headache requires SANS differential.',
                            source: 'NASA SANS Clinical Practice Guidelines (2022)',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
        },
    },
    // 3. Elevated Blood Pressure (Hypertension)
    cardio_bp: {
        id: 'cardio_bp',
        title: 'Elevated Blood Pressure & Vascular Stress Protocol',
        triggerCondition: 'Systolic BP ≥ 140 mmHg or Diastolic BP ≥ 90 mmHg',
        category: 'CARDIO_BP',
        rootNodeId: 'node_bp_root',
        medicalDisclaimer: 'Decision support only. Follow ACC/AHA clinical safety standards and NASA Flight Surgeon guidelines.',
        nodes: {
            node_bp_root: {
                id: 'node_bp_root',
                question: 'What is the measured blood pressure level upon repeated check (rested 5 minutes)?',
                explanation: 'Accurate staging requires confirming rested baseline.',
                options: [
                    {
                        label: 'Elevated / Stage 1: 130 - 139 / 80 - 89 mmHg',
                        terminalAction: {
                            title: 'Lifestyle & Hydration Regulation',
                            tier: 'SELF_MANAGE',
                            immediateSteps: [
                                'Rest quietly for 15 minutes; repeat measurement with cuff at strict heart level.',
                                'Ensure daily sodium intake is restricted to < 2.3g (avoid high-salt rehydratable pouches).',
                                'Confirm adequate hydration (target hydration score ≥ 80).',
                            ],
                            countermeasureType: 'HYDRATION_MONITORING',
                            flightSurgeonNotificationNote: 'Mild elevated BP logged for trend monitoring.',
                            source: 'ACC/AHA 2017 Hypertension Guidelines',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'Stage 2: 140 - 179 / 90 - 119 mmHg',
                        nextNodeId: 'node_bp_stage2',
                    },
                    {
                        label: 'Crisis Threshold: Systolic ≥ 180 mmHg or Diastolic ≥ 120 mmHg',
                        terminalAction: {
                            title: 'EMERGENCY: Hypertensive Crisis Protocol',
                            tier: 'EMERGENCY',
                            immediateSteps: [
                                'Immediately cease all physical activity and rest in seated/semi-reclined position.',
                                'Check for acute red-flag symptoms: chest pressure, shortness of breath, severe headache, blurred vision.',
                                'Notify Commander and Ground Flight Surgeon immediately via Emergency Audio Channel.',
                                'Stand by for emergency oral antihypertensive directive from Flight Surgeon (or offline emergency kit protocol).',
                            ],
                            countermeasureType: 'EMERGENCY_CLINICAL_PROTOCOL',
                            flightSurgeonNotificationNote: 'CRITICAL HYPERTENSIVE CRISIS TELEMETRY ALERT.',
                            source: 'ACC/AHA Guidelines & NASA Space Flight Human-System Standard',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
            node_bp_stage2: {
                id: 'node_bp_stage2',
                question: 'Are there any associated symptoms (headache, visual blurring, shortness of breath)?',
                explanation: 'Symptomatic Stage 2 hypertension requires expedited clinical review.',
                options: [
                    {
                        label: 'Symptomatic (Headache or visual disturbance present)',
                        terminalAction: {
                            title: 'Flight Surgeon Telemedicine Consult & Rest',
                            tier: 'CONTACT_FLIGHT_SURGEON',
                            immediateSteps: [
                                'Rest in quarters with dimmed lighting.',
                                'Transmit blood pressure, heart rate, and PVT metrics to Ground Flight Surgeon queue.',
                                'Postpone heavy resistive workout on ARED until medical review.',
                            ],
                            countermeasureType: 'MEDICAL_CONSULT_NOTICE',
                            flightSurgeonNotificationNote: 'Symptomatic Stage 2 Hypertension requires medical consult.',
                            source: 'NASA-STD-3001 Vol 1',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'Asymptomatic',
                        terminalAction: {
                            title: 'Blood Pressure Monitoring Schedule',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Log blood pressure twice daily (morning wake and evening pre-sleep).',
                                'Temporarily reduce high-intensity interval training intensity by 20%.',
                                'Avoid caffeine and decongestant medications.',
                            ],
                            countermeasureType: 'EXERCISE_LOAD_ADJUSTMENT',
                            flightSurgeonNotificationNote: 'Asymptomatic Stage 2 BP placed on twice-daily monitoring.',
                            source: 'ACC/AHA 2017 Guidelines',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
        },
    },
    // 4. Solar Particle Event (SPE) Radiation Storm Protocol
    radiation_spe: {
        id: 'radiation_spe',
        title: 'Solar Particle Event (SPE) & Radiation Storm Protocol',
        triggerCondition: 'Ambient dosimeter reading ≥ 0.20 mSv/h or Space Weather SPE Alert',
        category: 'RADIATION_SPE',
        rootNodeId: 'node_rad_root',
        medicalDisclaimer: 'Decision support only. Radiation storm safety procedures are safety-critical flight rules.',
        nodes: {
            node_rad_root: {
                id: 'node_rad_root',
                question: 'What is the current dosimeter dose rate reading?',
                explanation: 'Determines whether crew must seek storm shelter or maintain active surveillance.',
                options: [
                    {
                        label: 'Elevated Watch: 0.20 - 0.99 mSv/h',
                        terminalAction: {
                            title: '72-Hour Radiation Watch Protocol',
                            tier: 'MONITOR',
                            immediateSteps: [
                                'Cancel all planned Extravehicular Activities (EVAs).',
                                'Retreat to central pressurized module; avoid perimeter airlocks and observation cupolas.',
                                'Initiate 72-hour multi-sensor surveillance window (sleep, HRV, cognitive reaction time).',
                                'Hydrate with antioxidant electrolyte solution.',
                            ],
                            countermeasureType: 'RADIATION_SHELTER',
                            flightSurgeonNotificationNote: '72-hour radiation watch window engaged.',
                            source: 'NCRP Report 153 & NASA-STD-3001 Vol 1',
                            needsClinicalReview: false,
                        },
                    },
                    {
                        label: 'Severe Storm Spike: ≥ 1.00 mSv/h',
                        terminalAction: {
                            title: 'EMERGENCY: Immediate Storm Shelter Ingress Protocol',
                            tier: 'EMERGENCY',
                            immediateSteps: [
                                'Sound habitat-wide Solar Particle Event Storm Alarm.',
                                'All crew immediately ingress designated Storm Shelter (enclosed by water tanks/polyethylene).',
                                'Close all radiation blast hatches between modules.',
                                'Power down non-critical avionics in outer bays.',
                                'Record personal dosimeter cumulative dose every hour; monitor for prodromal nausea.',
                            ],
                            countermeasureType: 'EMERGENCY_STORM_SHELTER',
                            flightSurgeonNotificationNote: 'CRITICAL SPE STORM INGRESS PROTOCOL ACTIVE.',
                            source: 'NASA Flight Rules Section B6 (Space Radiation Environment)',
                            needsClinicalReview: false,
                        },
                    },
                ],
            },
        },
    },
};

import { BodySystem, HRPHazard } from './indicators.js';

export interface HRPHazardInfo {
  id: HRPHazard;
  title: string;
  shortCode: string;
  iconName: string; // lucide icon identifier
  color: string; // Tailwind accent color
  description: string;
  spaceflightContext: string;
  affectedSystems: {
    system: BodySystem;
    pathology: string;
  }[];
  mitigationStrategies: string[];
  operationalRules: string[];
  keyReference: string;
}

export const HRP_HAZARDS: Record<HRPHazard, HRPHazardInfo> = {
  RADIATION: {
    id: 'RADIATION',
    title: 'Space Radiation',
    shortCode: 'RAD',
    iconName: 'Radiation',
    color: 'rose',
    description:
      'Penetrating ionizing radiation from Galactic Cosmic Rays (GCR) and acute Solar Particle Events (SPE) traversing biological tissues.',
    spaceflightContext:
      'Outside Earth’s protective magnetosphere, astronauts encounter continuous heavy-ion GCR and unpredictable high-flux solar proton storms.',
    affectedSystems: [
      {
        system: 'IMMUNE_LYMPHATIC',
        pathology: 'DNA double-strand breaks, acute lymphocyte apoptosis, persistent oxidative stress.',
      },
      {
        system: 'CARDIOVASCULAR',
        pathology: 'Accelerated coronary endothelial fibrosis, microvascular stiffening, autonomic tone decay.',
      },
      {
        system: 'BRAIN_NERVOUS',
        pathology: 'Neuroinflammation, sleep fragmentation, long-term neurocognitive decline.',
      },
      {
        system: 'INTEGUMENTARY_SKIN',
        pathology: 'Erythema and delayed wound healing following acute proton storm exposure.',
      },
    ],
    mitigationStrategies: [
      'Polyethylene and hydrogen-rich water wall storm shelters.',
      'Active silicon dosimeter monitoring with 72-hour lag-window surveillance.',
      'Targeted antioxidant nutrition and pharmacological radioprotectants.',
    ],
    operationalRules: [
      'Dose rate > 0.20 mSv/h triggers 72h physiological watch window.',
      'Dose rate > 1.00 mSv/h requires immediate crew muster in Storm Shelter.',
    ],
    keyReference: 'NASA-STD-3001 Vol 1 & NCRP Report 153',
  },

  ISOLATION_CONFINEMENT: {
    id: 'ISOLATION_CONFINEMENT',
    title: 'Isolation & Confinement',
    shortCode: 'ISO',
    iconName: 'Users',
    color: 'amber',
    description:
      'Prolonged containment in restricted living volumes with a small crew, sensory deprivation, and separation from terrestrial society.',
    spaceflightContext:
      'Multi-year interplanetary voyages limit social contacts, alter circadian sensory zeitgebers, and demand sustained high performance under confinement.',
    affectedSystems: [
      {
        system: 'BRAIN_NERVOUS',
        pathology: 'Circadian desynchronosis, third-quarter mission morale depression, vigilance lapses.',
      },
      {
        system: 'IMMUNE_LYMPHATIC',
        pathology: 'Elevated allostatic cortisol load blunting cellular immune surveillance.',
      },
      {
        system: 'METABOLIC_ENDOCRINE',
        pathology: 'Stress-induced glycemic variability and appetite dysregulation.',
      },
    ],
    mitigationStrategies: [
      'Dynamic circadian lighting schedules (blue-enriched wake, red-shifted pre-sleep).',
      'Daily 3-minute self-check-ins with psychomotor vigilance testing (PVT).',
      'Structured sensory rest intervals, family communication packages, and autonomy pacing.',
    ],
    operationalRules: [
      'PVT latency > 280 ms triggers mandatory cognitive recovery period.',
      'Consecutive sleep duration < 5.5h triggers sleep-phase adjustment protocol.',
    ],
    keyReference: 'NASA HRP Behavioral Health & Performance (BHP) Evidence Book',
  },

  DISTANCE_FROM_EARTH: {
    id: 'DISTANCE_FROM_EARTH',
    title: 'Distance from Earth',
    shortCode: 'DIST',
    iconName: 'Orbit',
    color: 'sky',
    description:
      'Extreme interplanetary distances causing communication latencies up to 22 minutes each way and precluding emergency medical evacuation.',
    spaceflightContext:
      'Unlike Low Earth Orbit where an emergency deorbit to an ICU takes under 24 hours, deep space demands complete medical autonomy.',
    affectedSystems: [
      {
        system: 'BRAIN_NERVOUS',
        pathology: 'Psychological anxiety associated with isolation; requirement for autonomous clinical triage.',
      },
      {
        system: 'METABOLIC_ENDOCRINE',
        pathology: 'Dependence on finite pre-packaged nutrition and shelf-stable pharmaceuticals without resupply.',
      },
    ],
    mitigationStrategies: [
      'Autonomous closed-loop health twin operating fully offline with local decision trees.',
      'Delay-Tolerant Networking (DTN) for prioritized asynchronous clinical telemetry sync.',
      'Onboard ultrasound and self-guided clinical decision support protocols.',
    ],
    operationalRules: [
      'All emergency guidance must be self-executable without awaiting Earth confirmation.',
      'Clinical logs and telemedical packets queued in local IndexedDB until downlink windows open.',
    ],
    keyReference: 'NASA Exploration Medical Capability (ExMC) Roadmap',
  },

  GRAVITY_FIELDS: {
    id: 'GRAVITY_FIELDS',
    title: 'Gravity Fields (Altered Gravity)',
    shortCode: 'GRAV',
    iconName: 'Weight',
    color: 'indigo',
    description:
      'Transitions between Microgravity (0g), Lunar gravity (0.16g), Martian gravity (0.38g), and high-G launch/entry phases.',
    spaceflightContext:
      'Prolonged microgravity deprives the musculoskeletal and cardiovascular systems of vital gravitational loading forces.',
    affectedSystems: [
      {
        system: 'CARDIOVASCULAR',
        pathology: 'Cephalad fluid shift, baroreceptor resetting, stroke volume drop, orthostatic intolerance upon landing.',
      },
      {
        system: 'MUSCULOSKELETAL_BONE',
        pathology: '1-1.5% monthly trabecular bone mineral density loss; hypercalciuria and renal stone risk.',
      },
      {
        system: 'MUSCULOSKELETAL_MUSCLE',
        pathology: 'Postural muscle atrophy, slow-to-fast fiber shift, reduction in peak VO2 max.',
      },
      {
        system: 'OPHTHALMIC_SANS',
        pathology: 'Spaceflight-Associated Neuro-ocular Syndrome: optic disc edema and globe flattening from fluid shift.',
      },
    ],
    mitigationStrategies: [
      'Daily 2.5-hour scheduled countermeasure regime using ARED resistive and T2 aerobic hardware.',
      'Pre-landing fluid loading (1L electrolyte solution) and compression garments.',
      'Gravity-specific exercise prescription scaled for Moon (0.16g) vs Mars (0.38g).',
    ],
    operationalRules: [
      'Missed daily exercise reduces musculoskeletal integrity score by 15%.',
      'Fluid loading mandatory 2 hours prior to planetary descent maneuvers.',
    ],
    keyReference: 'NASA HRP Bone, Muscle, and SANS Evidence Reports',
  },

  HOSTILE_CLOSED_ENVIRONMENT: {
    id: 'HOSTILE_CLOSED_ENVIRONMENT',
    title: 'Hostile / Closed Environment',
    shortCode: 'ENV',
    iconName: 'Cpu',
    color: 'emerald',
    description:
      'Artificially recirculated habitat atmosphere, microgravity particle suspension, acoustic fan noise, and toxic gas buildup risks.',
    spaceflightContext:
      'Without atmospheric convection or open biosphere cleansing, astronauts live inside the lungs of an engineered life-support system.',
    affectedSystems: [
      {
        system: 'RESPIRATORY',
        pathology: 'Localized carbon dioxide (CO2) pocket buildup causing hypercapnia, airway mucosal drying.',
      },
      {
        system: 'BRAIN_NERVOUS',
        pathology: 'CO2-induced frontal headaches, chronic sleep fragmentation from acoustic background noise (> 55 dBA).',
      },
      {
        system: 'INTEGUMENTARY_SKIN',
        pathology: 'Microbial flora alterations, microgravity dermatitis, dust irritation from planetary regolith.',
      },
    ],
    mitigationStrategies: [
      'Continuous NDIR CO2 monitoring and cabin forced-air ventilation sweeps.',
      'ECLSS temperature regulation (20-23°C) and relative humidity management (35-60%).',
      'Acoustic muffling on avionics and active noise-cancellation sleep quarters.',
    ],
    operationalRules: [
      'Cabin CO2 > 3000 ppm triggers ventilation checks and personal airflow redirection.',
      'Cabin CO2 ≥ 5000 ppm requires immediate donning of emergency oxygen masks.',
    ],
    keyReference: 'NASA-STD-3001 Vol 2 Habitability Standards & SMAC Guidelines',
  },
};


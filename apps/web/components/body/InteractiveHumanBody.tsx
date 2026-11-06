'use client';

import React, { useState } from 'react';
import { OrganSystemStatus, HRPHazard } from '@astra-loop/shared';
import {
  Heart,
  Brain,
  Eye,
  Wind,
  Shield,
  Activity,
  Bone,
  Dumbbell,
  Layers,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Info,
  Sparkles,
} from 'lucide-react';

interface InteractiveHumanBodyProps {
  systems: OrganSystemStatus[];
  onSelectSystem?: (system: OrganSystemStatus) => void;
  selectedSystemId?: string;
}

export const InteractiveHumanBody: React.FC<InteractiveHumanBodyProps> = ({
  systems,
  onSelectSystem,
  selectedSystemId,
}) => {
  const [activeHazardLens, setActiveHazardLens] = useState<HRPHazard | 'ALL'>('ALL');
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);

  const getSystem = (id: string) => systems.find((s) => s.system === id);

  const activeSystem =
    systems.find((s) => s.system === (selectedSystemId || hoveredSystem)) ||
    systems[0] ||
    null;

  // Resolve color for a system region based on active lens and status
  const getColor = (systemId: string) => {
    const sys = getSystem(systemId);
    if (!sys) return '#334155'; // slate-700

    if (activeHazardLens !== 'ALL') {
      const isAffected = sys.primaryHazards.includes(activeHazardLens);
      if (!isAffected) return '#1e293b'; // dimmed slate-800
      // Highlight affected system with distinct hazard color
      switch (activeHazardLens) {
        case 'RADIATION':
          return '#f43f5e'; // rose-500
        case 'GRAVITY_FIELDS':
          return '#38bdf8'; // sky-400
        case 'HOSTILE_CLOSED_ENVIRONMENT':
          return '#fbbf24'; // amber-400
        case 'ISOLATION_CONFINEMENT':
          return '#a855f7'; // purple-500
        case 'DISTANCE_FROM_EARTH':
          return '#fb923c'; // orange-400
      }
    }

    switch (sys.statusColor) {
      case 'RED':
        return '#ef4444'; // red-500
      case 'ORANGE':
        return '#f97316'; // orange-500
      case 'YELLOW':
        return '#eab308'; // yellow-500
      case 'GREEN':
      default:
        return '#10b981'; // emerald-500
    }
  };

  const isPulsing = (systemId: string) => {
    const sys = getSystem(systemId);
    return sys?.status === 'ATTENTION' || sys?.status === 'MONITOR';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
      {/* Left / Center: Interactive SVG Body Figure */}
      <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-surface/70 p-5 shadow-xl flex flex-col items-center">
        {/* Hazard Lens Toggle Bar */}
        <div className="w-full mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              HAZARD LENS:
            </span>
            <span className="text-[11px] text-slate-400">
              {activeHazardLens === 'ALL'
                ? 'Clinical Health Status'
                : `Filtering: ${activeHazardLens.replace(/_/g, ' ')}`}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px]">
            <button
              onClick={() => setActiveHazardLens('ALL')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'ALL'
                  ? 'border-sky-400 bg-sky-950/80 text-sky-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              ALL HEALTH
            </button>
            <button
              onClick={() => setActiveHazardLens('GRAVITY_FIELDS')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'GRAVITY_FIELDS'
                  ? 'border-sky-400 bg-sky-950/80 text-sky-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              GRAVITY (0g)
            </button>
            <button
              onClick={() => setActiveHazardLens('RADIATION')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'RADIATION'
                  ? 'border-rose-400 bg-rose-950/80 text-rose-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              RADIATION
            </button>
            <button
              onClick={() => setActiveHazardLens('HOSTILE_CLOSED_ENVIRONMENT')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'HOSTILE_CLOSED_ENVIRONMENT'
                  ? 'border-amber-400 bg-amber-950/80 text-amber-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              CLOSED ENV
            </button>
            <button
              onClick={() => setActiveHazardLens('ISOLATION_CONFINEMENT')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'ISOLATION_CONFINEMENT'
                  ? 'border-purple-400 bg-purple-950/80 text-purple-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              ISOLATION
            </button>
            <button
              onClick={() => setActiveHazardLens('DISTANCE_FROM_EARTH')}
              className={`rounded px-2 py-1.5 border transition ${
                activeHazardLens === 'DISTANCE_FROM_EARTH'
                  ? 'border-orange-400 bg-orange-950/80 text-orange-200 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              DISTANCE
            </button>
          </div>
        </div>

        {/* SVG Interactive Silhouette Canvas */}
        <div className="relative w-full max-w-[340px] aspect-[1/2] flex items-center justify-center p-2">
          <svg
            viewBox="0 0 200 400"
            className="w-full h-full drop-shadow-2xl select-none"
            aria-label="Interactive Human Body Hologram"
          >
            <defs>
              <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Background Aura */}
            <circle cx="100" cy="200" r="160" fill="url(#bodyGlow)" />

            {/* Base anatomical outline silhouette */}
            <path
              d="M 100 25 C 88 25 82 35 82 50 C 82 62 88 70 94 75 C 80 82 72 95 68 115 L 50 170 C 46 182 40 215 42 230 C 44 240 52 240 54 230 L 64 175 L 72 175 L 72 230 C 72 250 78 270 78 300 L 75 365 C 74 380 84 385 88 385 C 92 385 94 375 95 360 L 98 250 L 102 250 L 105 360 C 106 375 108 385 112 385 C 116 385 126 380 125 365 L 122 300 C 122 270 128 250 128 230 L 128 175 L 136 175 L 146 230 C 148 240 156 240 158 230 C 160 215 154 182 150 170 L 132 115 C 128 95 120 82 106 75 C 112 70 118 62 118 50 C 118 35 112 25 100 25 Z"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* --- REGION 1: BRAIN & NERVOUS SYSTEM --- */}
            <g
              id="region-brain"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('BRAIN_NERVOUS')!)}
              onMouseEnter={() => setHoveredSystem('BRAIN_NERVOUS')}
              className="group transition-all duration-200"
            >
              <ellipse
                cx="100"
                cy="46"
                rx="14"
                ry="16"
                fill={getColor('BRAIN_NERVOUS')}
                fillOpacity={activeSystem?.system === 'BRAIN_NERVOUS' ? 0.9 : 0.65}
                stroke={activeSystem?.system === 'BRAIN_NERVOUS' ? '#ffffff' : getColor('BRAIN_NERVOUS')}
                strokeWidth={activeSystem?.system === 'BRAIN_NERVOUS' ? '2.5' : '1.5'}
                filter={isPulsing('BRAIN_NERVOUS') ? 'url(#glowEffect)' : undefined}
                className={isPulsing('BRAIN_NERVOUS') ? 'animate-pulse' : ''}
              />
              <path
                d="M 96 42 Q 100 38 104 42 Q 100 46 96 42"
                stroke="#ffffff"
                strokeWidth="1.2"
                fill="none"
                opacity="0.8"
              />
            </g>

            {/* --- REGION 2: OPHTHALMIC (EYES / SANS) --- */}
            <g
              id="region-eyes"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('OPHTHALMIC_SANS')!)}
              onMouseEnter={() => setHoveredSystem('OPHTHALMIC_SANS')}
              className="group transition-all duration-200"
            >
              <circle cx="94" cy="48" r="3.2" fill={getColor('OPHTHALMIC_SANS')} stroke="#ffffff" strokeWidth="0.8" />
              <circle cx="106" cy="48" r="3.2" fill={getColor('OPHTHALMIC_SANS')} stroke="#ffffff" strokeWidth="0.8" />
            </g>

            {/* --- REGION 3: RESPIRATORY (LUNGS / CO2 IMPACT) --- */}
            <g
              id="region-lungs"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('RESPIRATORY')!)}
              onMouseEnter={() => setHoveredSystem('RESPIRATORY')}
              className="group transition-all duration-200"
            >
              <path
                d="M 85 96 C 80 102 78 120 86 130 C 93 126 93 105 91 96 Z"
                fill={getColor('RESPIRATORY')}
                fillOpacity={activeSystem?.system === 'RESPIRATORY' ? 0.85 : 0.55}
                stroke={activeSystem?.system === 'RESPIRATORY' ? '#ffffff' : getColor('RESPIRATORY')}
                strokeWidth="1.5"
                className={isPulsing('RESPIRATORY') ? 'animate-pulse' : ''}
              />
              <path
                d="M 115 96 C 120 102 122 120 114 130 C 107 126 107 105 109 96 Z"
                fill={getColor('RESPIRATORY')}
                fillOpacity={activeSystem?.system === 'RESPIRATORY' ? 0.85 : 0.55}
                stroke={activeSystem?.system === 'RESPIRATORY' ? '#ffffff' : getColor('RESPIRATORY')}
                strokeWidth="1.5"
                className={isPulsing('RESPIRATORY') ? 'animate-pulse' : ''}
              />
            </g>

            {/* --- REGION 4: CARDIOVASCULAR (HEART / BP) --- */}
            <g
              id="region-heart"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('CARDIOVASCULAR')!)}
              onMouseEnter={() => setHoveredSystem('CARDIOVASCULAR')}
              className="group transition-all duration-200"
            >
              <circle
                cx="103"
                cy="112"
                r="9"
                fill={getColor('CARDIOVASCULAR')}
                fillOpacity={activeSystem?.system === 'CARDIOVASCULAR' ? 0.95 : 0.75}
                stroke={activeSystem?.system === 'CARDIOVASCULAR' ? '#ffffff' : getColor('CARDIOVASCULAR')}
                strokeWidth={activeSystem?.system === 'CARDIOVASCULAR' ? '2.5' : '1.5'}
                filter={isPulsing('CARDIOVASCULAR') ? 'url(#glowEffect)' : undefined}
                className={isPulsing('CARDIOVASCULAR') ? 'animate-pulse' : ''}
              />
              {/* Cardiac rhythm pulse wave */}
              <path
                d="M 98 112 L 101 112 L 103 108 L 105 116 L 107 112 L 109 112"
                stroke="#ffffff"
                strokeWidth="1.2"
                fill="none"
              />
            </g>

            {/* --- REGION 5: IMMUNE & LYMPHATIC --- */}
            <g
              id="region-immune"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('IMMUNE_LYMPHATIC')!)}
              onMouseEnter={() => setHoveredSystem('IMMUNE_LYMPHATIC')}
              className="group transition-all duration-200"
            >
              <circle cx="100" cy="85" r="4.5" fill={getColor('IMMUNE_LYMPHATIC')} opacity="0.8" />
              <circle cx="88" cy="138" r="3.5" fill={getColor('IMMUNE_LYMPHATIC')} opacity="0.8" />
              <circle cx="112" cy="138" r="3.5" fill={getColor('IMMUNE_LYMPHATIC')} opacity="0.8" />
            </g>

            {/* --- REGION 6: METABOLIC & DIGESTIVE --- */}
            <g
              id="region-metabolic"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('METABOLIC_ENDOCRINE')!)}
              onMouseEnter={() => setHoveredSystem('METABOLIC_ENDOCRINE')}
              className="group transition-all duration-200"
            >
              <rect
                x="88"
                y="145"
                width="24"
                height="22"
                rx="6"
                fill={getColor('METABOLIC_ENDOCRINE')}
                fillOpacity={activeSystem?.system === 'METABOLIC_ENDOCRINE' ? 0.9 : 0.6}
                stroke={activeSystem?.system === 'METABOLIC_ENDOCRINE' ? '#ffffff' : getColor('METABOLIC_ENDOCRINE')}
                strokeWidth="1.5"
                className={isPulsing('METABOLIC_ENDOCRINE') ? 'animate-pulse' : ''}
              />
            </g>

            {/* --- REGION 7: MUSCULOSKELETAL - MUSCLE (LIMBS) --- */}
            <g
              id="region-muscle"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('MUSCULOSKELETAL_MUSCLE')!)}
              onMouseEnter={() => setHoveredSystem('MUSCULOSKELETAL_MUSCLE')}
              className="group transition-all duration-200"
            >
              {/* Arms */}
              <ellipse cx="65" cy="140" rx="5" ry="20" fill={getColor('MUSCULOSKELETAL_MUSCLE')} opacity="0.5" />
              <ellipse cx="135" cy="140" rx="5" ry="20" fill={getColor('MUSCULOSKELETAL_MUSCLE')} opacity="0.5" />
              {/* Thighs */}
              <ellipse cx="88" cy="245" rx="8" ry="32" fill={getColor('MUSCULOSKELETAL_MUSCLE')} opacity="0.5" />
              <ellipse cx="112" cy="245" rx="8" ry="32" fill={getColor('MUSCULOSKELETAL_MUSCLE')} opacity="0.5" />
            </g>

            {/* --- REGION 8: MUSCULOSKELETAL - BONE (SPINE & FEMUR) --- */}
            <g
              id="region-bone"
              cursor="pointer"
              onClick={() => onSelectSystem && onSelectSystem(getSystem('MUSCULOSKELETAL_BONE')!)}
              onMouseEnter={() => setHoveredSystem('MUSCULOSKELETAL_BONE')}
              className="group transition-all duration-200"
            >
              {/* Vertebral column */}
              <line
                x1="100"
                y1="85"
                x2="100"
                y2="190"
                stroke={getColor('MUSCULOSKELETAL_BONE')}
                strokeWidth="3.5"
                strokeDasharray="2 2"
                opacity="0.9"
              />
              {/* Femur bones */}
              <line
                x1="88"
                y1="220"
                x2="84"
                y2="280"
                stroke={getColor('MUSCULOSKELETAL_BONE')}
                strokeWidth="2.5"
                opacity="0.9"
              />
              <line
                x1="112"
                y1="220"
                x2="116"
                y2="280"
                stroke={getColor('MUSCULOSKELETAL_BONE')}
                strokeWidth="2.5"
                opacity="0.9"
              />
            </g>

            {/* Pointer / Selected Marker Anchor */}
            {activeSystem && (
              <circle
                cx={
                  activeSystem.system === 'BRAIN_NERVOUS'
                    ? 100
                    : activeSystem.system === 'OPHTHALMIC_SANS'
                    ? 100
                    : activeSystem.system === 'CARDIOVASCULAR'
                    ? 103
                    : activeSystem.system === 'RESPIRATORY'
                    ? 90
                    : activeSystem.system === 'METABOLIC_ENDOCRINE'
                    ? 100
                    : activeSystem.system === 'IMMUNE_LYMPHATIC'
                    ? 100
                    : 100
                }
                cy={
                  activeSystem.system === 'BRAIN_NERVOUS'
                    ? 46
                    : activeSystem.system === 'OPHTHALMIC_SANS'
                    ? 48
                    : activeSystem.system === 'CARDIOVASCULAR'
                    ? 112
                    : activeSystem.system === 'RESPIRATORY'
                    ? 110
                    : activeSystem.system === 'METABOLIC_ENDOCRINE'
                    ? 155
                    : activeSystem.system === 'IMMUNE_LYMPHATIC'
                    ? 85
                    : 230
                }
                r="18"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="animate-spin"
                style={{ animationDuration: '10s' }}
              />
            )}
          </svg>
        </div>

        <div className="w-full mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Click any organ system above to inspect metrics, spaceflight hazard linkages, and clinical guidance.</span>
        </div>
      </div>

      {/* Right: Detailed Organ System Dossier Panel */}
      <div className="lg:col-span-6 space-y-4">
        {activeSystem ? (
          <div className="rounded-xl border border-slate-800 bg-surface-elevated p-5 shadow-xl space-y-5">
            {/* Header: Title, Status Badge, Escalation Tier */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block mb-0.5">
                  SYSTEM BREAKDOWN
                </span>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  {activeSystem.title}
                </h3>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    activeSystem.statusColor === 'RED'
                      ? 'border-red-500 bg-red-950/60 text-red-300'
                      : activeSystem.statusColor === 'YELLOW'
                      ? 'border-yellow-500 bg-yellow-950/60 text-yellow-300'
                      : 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                  }`}
                >
                  {activeSystem.status}
                </span>

                <span className="text-[10px] text-slate-400">
                  Tier: <strong className="text-slate-200">{activeSystem.escalationTier}</strong>
                </span>
              </div>
            </div>

            {/* Headline Metric Card */}
            <div className="rounded-lg border border-slate-800 bg-surface p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">{activeSystem.headlineMetric.label}</div>
                <div className="text-2xl font-black text-sky-300 tracking-tight">
                  {activeSystem.headlineMetric.value}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Baseline Delta</span>
                <span className="text-xs font-bold text-slate-300">
                  {activeSystem.headlineMetric.deviation}
                </span>
              </div>
            </div>

            {/* Key Indicators Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">TELEMETRY STREAMS & SAFETY ENVELOPES:</h4>
              <div className="space-y-1.5">
                {activeSystem.keyIndicators.map((ind) => (
                  <div
                    key={ind.key}
                    className="rounded border border-slate-800/80 bg-slate-900/50 p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300">{ind.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{ind.valueDisplay}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          ind.status === 'CRITICAL'
                            ? 'bg-red-900/80 text-red-200'
                            : ind.status === 'WARNING'
                            ? 'bg-amber-900/80 text-amber-200'
                            : 'bg-emerald-900/60 text-emerald-300'
                        }`}
                      >
                        {ind.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How Hazard Affects This Organ System */}
            <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>HOW SPACEFLIGHT HAZARDS AFFECT THIS ORGAN:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeSystem.howHazardAffects}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeSystem.primaryHazards.map((h) => (
                  <span
                    key={h}
                    className="rounded bg-indigo-900/40 border border-indigo-700/50 px-2 py-0.5 text-[9px] text-indigo-200 font-bold"
                  >
                    #{h.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Countermeasure Actions */}
            <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>PREVENTIVE & CORRECTIVE ACTIONS:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 font-sans list-disc list-inside">
                {activeSystem.recommendedActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Clinical Evidence & Sources */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>EVIDENCE BASE: {activeSystem.sources.join(' • ')}</span>
              <a
                href="/learn"
                className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-bold"
              >
                <span>Learn Details</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-surface p-12 text-center text-slate-500 text-xs">
            Select an organ system on the body figure to load clinical telemetry.
          </div>
        )}
      </div>
    </div>
  );
};


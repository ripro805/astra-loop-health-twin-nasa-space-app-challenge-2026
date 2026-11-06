'use client';

import React, { useState } from 'react';
import { IndicatorDefinition, HRPHazardInfo, HRPHazard } from '@astra-loop/shared';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Info,
  ChevronRight,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface LearnHubProps {
  indicators: IndicatorDefinition[];
  hazards: HRPHazardInfo[];
}

export const LearnHub: React.FC<LearnHubProps> = ({ indicators, hazards }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHazard, setSelectedHazard] = useState<string>('ALL');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [expandedIndicatorId, setExpandedIndicatorId] = useState<string | null>(
    indicators[0]?.id || null
  );

  const filteredIndicators = indicators.filter((ind) => {
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.bodySystem.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHazard =
      selectedHazard === 'ALL' ||
      ind.hazardLinks.some((h) => h.hazard === selectedHazard);

    const matchesSystem =
      selectedSystem === 'ALL' || ind.bodySystem === selectedSystem;

    return matchesSearch && matchesHazard && matchesSystem;
  });

  const activeIndicator =
    indicators.find((i) => i.id === expandedIndicatorId) || indicators[0];

  return (
    <div className="space-y-6 font-mono">
      {/* Search & Filter Controls */}
      <div className="rounded-xl border border-slate-800 bg-surface/80 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search indicators, organs, flight rules, or hazard mechanisms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">All 5 HRP Hazards</option>
              <option value="RADIATION">Radiation</option>
              <option value="ISOLATION_CONFINEMENT">Isolation & Confinement</option>
              <option value="DISTANCE_FROM_EARTH">Distance from Earth</option>
              <option value="GRAVITY_FIELDS">Gravity Fields</option>
              <option value="HOSTILE_CLOSED_ENVIRONMENT">Hostile Closed Environment</option>
            </select>

            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">All Body Systems</option>
              <option value="CARDIOVASCULAR">Cardiovascular</option>
              <option value="METABOLIC">Metabolic</option>
              <option value="NEURO_BEHAVIORAL">Neuro-Behavioral</option>
              <option value="RESPIRATORY">Respiratory</option>
              <option value="IMMUNE">Immune</option>
              <option value="MUSCULOSKELETAL">Musculoskeletal</option>
              <option value="ENVIRONMENT">Environment</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Showing {filteredIndicators.length} of {indicators.length} clinical indicators</span>
          <span>Standards: NASA-STD-3001 Vol 1 & 2 • SpaceApps 2026 Reference</span>
        </div>
      </div>

      {/* Main Grid: Indicator List on Left, Comprehensive Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selector List */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-surface/60 p-3 space-y-1.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredIndicators.map((ind) => {
            const isSelected = activeIndicator?.id === ind.id;
            return (
              <div
                key={ind.id}
                onClick={() => setExpandedIndicatorId(ind.id)}
                className={`rounded-lg border p-3 cursor-pointer transition ${
                  isSelected
                    ? 'border-sky-500 bg-sky-950/40 text-slate-100 ring-1 ring-sky-500/40'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs">{ind.name}</div>
                  <span className="text-[10px] text-sky-400 font-bold">{ind.unit}</span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span>{ind.bodySystem}</span>
                  <span className="text-slate-400">{ind.onboardMethod.deviceClass}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: In-Depth Clinical Guide Dossier */}
        <div className="lg:col-span-8">
          {activeIndicator ? (
            <div className="rounded-xl border border-slate-800 bg-surface-elevated p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 tracking-widest uppercase block mb-1">
                    NASA HUMAN RESEARCH PROGRAM • CLINICAL GUIDE
                  </span>
                  <h2 className="text-xl font-bold text-slate-100">{activeIndicator.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>Unit: <strong className="text-sky-300">{activeIndicator.unit}</strong></span>
                    <span>•</span>
                    <span>System: <strong className="text-indigo-300">{activeIndicator.bodySystem}</strong></span>
                    <span>•</span>
                    <span>Onboard Flight Device: <strong className="text-emerald-300">{activeIndicator.onboardMethod.deviceClass}</strong></span>
                  </div>
                </div>

                <div className="rounded bg-sky-950/60 border border-sky-600/40 px-3 py-1.5 text-right">
                  <span className="text-[9px] text-slate-400 block uppercase">Self-Management Rule</span>
                  <span className="text-xs font-bold text-sky-300">Level 1 Protocol</span>
                </div>
              </div>

              {/* Question 1: How to measure on-orbit (Step-by-Step) */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-sky-300 uppercase flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-sky-400" />
                  <span>1. How to Measure in Space (Procedure)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeIndicator.howToMeasure.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800 bg-surface p-3 text-xs space-y-1 font-sans"
                    >
                      <div className="text-[10px] font-bold text-sky-400 font-mono">STEP {idx + 1}</div>
                      <p className="text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 2: Why it matters */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-indigo-300 uppercase flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>2. Why This Examination is Needed</span>
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-surface/60 rounded-lg border border-slate-800 p-3.5">
                  {activeIndicator.whyItMatters}
                </p>
              </div>

              {/* Question 3: How spaceflight hazards affect this indicator */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>3. Spaceflight Hazard Linkages & Biological Mechanisms</span>
                </h3>
                <div className="space-y-2">
                  {activeIndicator.hazardLinks.map((hl, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1"
                    >
                      <div className="font-bold text-amber-400 text-[11px]">
                        Hazard: {hl.hazard.replace(/_/g, ' ')}
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed">{hl.mechanism}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 4: Reference Ranges vs Absolute Clinical Limits */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                  <span>4. Clinical Ranges & Escalation Rules</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">NOMINAL REFERENCE</span>
                    <div className="text-sm font-bold text-slate-100">
                      {activeIndicator.referenceRange.min} – {activeIndicator.referenceRange.max} {activeIndicator.unit}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{activeIndicator.referenceRange.nominalText}</p>
                  </div>

                  <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">WARNING THRESHOLD</span>
                    <div className="text-sm font-bold text-slate-100">
                      {activeIndicator.warningRange.low ?? '—'} – {activeIndicator.warningRange.high ?? '—'} {activeIndicator.unit}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{activeIndicator.warningRange.warningText}</p>
                  </div>

                  <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase">CRITICAL ESCALATION</span>
                    <div className="text-sm font-bold text-slate-100">
                      {activeIndicator.criticalRange.low ?? '—'} – {activeIndicator.criticalRange.high ?? '—'} {activeIndicator.unit}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{activeIndicator.criticalRange.criticalText}</p>
                  </div>
                </div>
              </div>

              {/* Question 5: Preventive & Countermeasure Actions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-sky-300 uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>5. Actions to Prevent or Resolve Critical Conditions</span>
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 font-sans list-disc list-inside bg-surface/60 rounded-lg border border-slate-800 p-3.5">
                  {activeIndicator.preventiveActions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Evidence citations */}
              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Sources: {activeIndicator.sources.join(' • ')}</span>
                <span className="text-slate-400 font-sans">
                  {activeIndicator.needsClinicalReview ? '⚠️ Under clinical panel review' : '✅ Peer-reviewed NASA HRP data'}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-surface p-12 text-center text-slate-500 text-xs">
              Select an indicator to view the NASA operational clinical dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

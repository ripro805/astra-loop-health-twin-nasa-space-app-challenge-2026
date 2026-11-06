'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { LearnHub } from '../../components/learn/LearnHub';
import { api } from '../../lib/api';
import { IndicatorDefinition, HRPHazardInfo } from '@astra-loop/shared';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export default function LearnPage() {
  const [indicators, setIndicators] = useState<IndicatorDefinition[]>([]);
  const [hazards, setHazards] = useState<HRPHazardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [indRes, hazRes] = await Promise.all([
        api.getKnowledgeIndicators(),
        api.getKnowledgeHazards(),
      ]);
      setIndicators(indRes.indicators);
      setHazards(hazRes.hazards);
    } catch (err: any) {
      setError(err.message || 'Failed to load knowledge database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppShell missionDay={61} onRefresh={loadData}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4" />
              <span>NASA SPACE APPS 2026 • CLINICAL & HAZARD KNOWLEDGE BASE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Astronaut Health Assessment & Education Hub
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Comprehensive decision-support knowledge: what to measure, step-by-step procedures, hazard biological pathways, warning limits, and escalation rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-600/40 px-3 py-1.5 text-xs text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              5 HRP HAZARDS COVERED
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-surface/50 p-16 text-center text-slate-400 text-xs animate-pulse">
            Loading NASA Human Research Program clinical guidelines...
          </div>
        ) : (
          <LearnHub indicators={indicators} hazards={hazards} />
        )}
      </div>
    </AppShell>
  );
}


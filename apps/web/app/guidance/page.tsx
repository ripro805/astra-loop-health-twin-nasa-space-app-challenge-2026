'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { TreatmentWizard } from '../../components/guidance/TreatmentWizard';
import { api } from '../../lib/api';
import { Stethoscope, AlertCircle, Sparkles } from 'lucide-react';

export default function GuidancePage() {
  const [trees, setTrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getGuidanceTrees();
      setTrees(res.trees);
    } catch (err: any) {
      setError(err.message || 'Failed to load treatment decision trees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrees();
  }, []);

  return (
    <AppShell missionDay={61} onRefresh={loadTrees}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Stethoscope className="w-4 h-4" />
              <span>DELAY-TOLERANT CLINICAL DECISION SUPPORT SYSTEM (CDSS)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Interactive Treatment & Guidance Wizard
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Step-by-step clinical triage trees for acute in-flight scenarios: sleep debt, hypercapnia, hypertension, glycemic shifts, and pyrexia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-600/40 px-3 py-1.5 text-xs text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              NASA FLIGHT RULES ALIGNED
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
            Loading clinical decision algorithms...
          </div>
        ) : (
          <TreatmentWizard initialTrees={trees} />
        )}
      </div>
    </AppShell>
  );
}

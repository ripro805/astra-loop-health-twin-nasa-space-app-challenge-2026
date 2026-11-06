'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { InteractiveHumanBody } from '../../components/body/InteractiveHumanBody';
import { api } from '../../lib/api';
import { OrganSystemStatus } from '@astra-loop/shared';
import { User, Activity, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function BodyPage() {
  const [systems, setSystems] = useState<OrganSystemStatus[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<OrganSystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBodyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBodyStatus();
      setSystems(res.systems);
      if (res.systems.length > 0 && !selectedSystem) {
        setSelectedSystem(res.systems[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load organ system status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBodyData();
  }, []);

  return (
    <AppShell missionDay={61} onRefresh={loadBodyData}>
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <User className="w-4 h-4" />
              <span>WHOLE-BODY DIGITAL TWIN & ORGAN TOPOLOGY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Interactive Human Body Interface
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Clickable vector anatomical twin connecting clinical vital signs directly to NASA Human Research Program (HRP) hazard pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-600/40 px-3 py-1.5 text-xs text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              9 SYSTEMS MONITORED
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-surface/50 p-16 text-center text-slate-400 text-xs animate-pulse">
            Rendering physiological twin topology and resolving multi-domain telemetry...
          </div>
        ) : (
          <InteractiveHumanBody
            systems={systems}
            onSelectSystem={(sys) => setSelectedSystem(sys)}
            selectedSystemId={selectedSystem?.system}
          />
        )}
      </div>
    </AppShell>
  );
}


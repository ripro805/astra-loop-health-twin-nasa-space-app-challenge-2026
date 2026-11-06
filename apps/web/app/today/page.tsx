'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { RiskScoreCard } from '../../components/today/RiskScoreCard';
import { DomainCard } from '../../components/today/DomainCard';
import { WhatChangedList } from '../../components/today/WhatChangedList';
import { EscalationBanner } from '../../components/today/EscalationBanner';
import { api } from '../../lib/api';
import { DashboardData } from '@astra-loop/shared';
import Link from 'next/link';
import { User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function TodayPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAcknowledge = () => {
    if (dashboard?.activeAlerts?.[0]?.id) {
      api.acknowledgeEscalation(dashboard.activeAlerts[0].id).catch(() => {});
    }
    loadDashboard();
  };

  return (
    <AppShell
      missionDay={dashboard?.missionDay ?? 61}
      environment={dashboard?.environment}
      onRefresh={loadDashboard}
    >
      <div className="space-y-6 max-w-7xl mx-auto font-mono">
        {/* Persistent Emergency / Escalation Banner */}
        {dashboard && (
          <EscalationBanner
            tier={dashboard.escalationTier}
            banner={dashboard.escalationBanner}
            commsDelayMinutes={dashboard.environment?.commsDelayMinutes ?? 14.3}
            onAcknowledge={handleAcknowledge}
          />
        )}

        {/* Hero Banner with Body Shortcut */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-surface/60 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-950 border border-sky-500/40 p-2 text-sky-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">WHOLE-BODY DIGITAL TWIN TOPOLOGY</div>
              <div className="text-[11px] text-slate-400 font-sans">
                Explore organ systems, spaceflight hazard linkages, and clinical guidance on the interactive human body.
              </div>
            </div>
          </div>

          <Link
            href="/body"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-bold text-white transition shadow shrink-0"
          >
            <span>Inspect Human Body</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Risk Score Hero Card */}
        {dashboard ? (
          <RiskScoreCard
            missionDay={dashboard.missionDay}
            overallStatus={dashboard.overallStatus}
            riskScore={dashboard.simulatedRiskScore}
            confidence={dashboard.confidence}
            dataCompleteness={dashboard.dataCompleteness}
            activeWatchWindow={dashboard.activeWatchWindow}
          />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-surface p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading astronaut digital twin telemetry...
          </div>
        )}

        {/* 7 Health Domains Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold tracking-wider">7 MONITORED PHYSIOLOGICAL DOMAINS</span>
            <span className="text-[11px]">NASA-STD-3001 Safety Standard</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {dashboard?.domains.map((domain) => (
              <DomainCard key={domain.domain} summary={domain} />
            ))}
          </div>
        </div>

        {/* What Changed List */}
        {dashboard && <WhatChangedList changes={dashboard.recentChanges} />}
      </div>
    </AppShell>
  );
}

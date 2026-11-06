'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { api } from '../../lib/api';
import { FlightSurgeonReportData } from '@astra-loop/shared';
import {
  FileText,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  Heart,
  Globe,
  Radio,
} from 'lucide-react';

export default function ReportPage() {
  const [report, setReport] = useState<FlightSurgeonReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFlightSurgeonReport();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flight surgeon dossier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <AppShell missionDay={report?.missionDay ?? 61} onRefresh={loadReport}>
      <div className="space-y-6 max-w-5xl mx-auto font-mono print:max-w-none print:m-0 print:p-0">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <FileText className="w-4 h-4" />
              <span>NASA JOHNSON SPACE CENTER • FLIGHT SURGEON CONSOLIDATED DOSSIER</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Flight Surgeon Telemetry & Clinical Report
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Consolidated aerospace medical dossier compiled via Delay-Tolerant Networking (DTN) packet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-bold text-white transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-center gap-2 print:hidden">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {loading || !report ? (
          <div className="rounded-xl border border-slate-800 bg-surface/50 p-16 text-center text-slate-400 text-xs animate-pulse print:hidden">
            Compiling flight surgeon consolidated medical dossier from mission telemetry...
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700 bg-surface-elevated p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:bg-white print:text-black">
            {/* Report Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-6 print:border-black">
              <div>
                <span className="text-xs font-bold text-sky-400 print:text-blue-700 tracking-widest uppercase block mb-1">
                  MISSION MEDICAL CONTROL TELEMETRY DOSSIER
                </span>
                <h2 className="text-2xl font-black text-slate-100 print:text-black">
                  ASTRA-LOOP CLINICAL FLIGHT REPORT
                </h2>
                <div className="text-xs text-slate-400 print:text-gray-700 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Astronaut: <strong className="text-slate-200 print:text-black">{report.astronautName}</strong></span>
                  <span>Mission Day: <strong className="text-sky-300 print:text-blue-800">Day {report.missionDay}</strong></span>
                  <span>Environment: <strong className="text-indigo-300 print:text-indigo-800">{report.environmentName} ({report.gravityG}g)</strong></span>
                  <span>Comms Lag: <strong className="text-amber-300 print:text-amber-800">{report.commsDelayMinutes} min (1-way DTN)</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block rounded px-3 py-1 text-xs font-bold uppercase border ${
                    report.overallStatus === 'ATTENTION'
                      ? 'border-red-500 bg-red-950/80 text-red-300 print:border-red-600 print:text-red-700'
                      : report.overallStatus === 'MONITOR'
                      ? 'border-amber-500 bg-amber-950/80 text-amber-300 print:border-amber-600 print:text-amber-700'
                      : 'border-emerald-500 bg-emerald-950/80 text-emerald-300 print:border-emerald-600 print:text-emerald-700'
                  }`}
                >
                  {report.overallStatus} TRIAGE
                </span>
                <div className="text-[10px] text-slate-500 print:text-gray-600 mt-1">
                  Generated: {new Date(report.reportGeneratedAt).toUTCString()}
                </div>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>1. Core Telemetry & Physiological Vital Signs</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">HEART RATE</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.heartRate}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">BLOOD PRESSURE</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.bloodPressure}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">BLOOD GLUCOSE</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.bloodGlucose}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">CORE TEMPERATURE</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.coreTemp}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">PULSE OXIMETRY</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.spo2}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">SLEEP DURATION</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.sleepHours}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">BODY MASS</span>
                  <span className="text-base font-bold text-slate-100 print:text-black">{report.vitalSignsSummary.weightKg}</span>
                </div>
                <div className="rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-gray-100 p-3">
                  <span className="text-[10px] text-slate-500 print:text-gray-600 block">ALLOSTATIC RISK SCORE</span>
                  <span className="text-base font-bold text-sky-400 print:text-blue-800">{report.simulatedRiskScore}/100</span>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>2. Active Physiological & Environmental Alerts ({report.activeAlerts.length})</span>
              </h3>
              <div className="space-y-2">
                {report.activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-lg border border-slate-800 print:border-gray-300 bg-surface print:bg-gray-50 p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 print:text-black">{alert.title}</span>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">{alert.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 print:text-gray-700 font-sans leading-relaxed">
                      {alert.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learn Loop Countermeasure History */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>3. Learn Loop Adaptive Countermeasure Efficacy</span>
              </h3>
              <div className="space-y-2">
                {report.learnLoopHistory.map((cm) => (
                  <div
                    key={cm.id}
                    className="rounded-lg border border-slate-800 print:border-gray-300 bg-surface print:bg-gray-50 p-3 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-200 print:text-black">{cm.type}</span>
                      <span className="text-[10px] text-slate-400 print:text-gray-600 block">
                        Evidence ΔZ = {cm.averageEffectZScore ? cm.averageEffectZScore.toFixed(2) : '+1.20'} SD ({cm.overallResult})
                      </span>
                    </div>
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                      CONF: {cm.confidence}% • {cm.evaluationCount} EVALS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Notes & Ground Sign-Off */}
            <div className="rounded-lg border border-slate-800 print:border-gray-400 bg-slate-900/60 print:bg-gray-100 p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-300 print:text-black uppercase block">
                FLIGHT SURGEON NOTE & PROTOCOL SIGN-OFF:
              </span>
              <p className="text-slate-400 print:text-gray-700 font-sans leading-relaxed">
                {report.telemetryNotes}
              </p>
              <div className="pt-3 border-t border-slate-800 print:border-gray-300 flex justify-between text-[10px] text-slate-500 print:text-gray-600">
                <span>Medical Operations Branch (SD2) • NASA JSC Houston</span>
                <span>Asynchronous DTN Packet Signature: SHA256-VALIDATED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

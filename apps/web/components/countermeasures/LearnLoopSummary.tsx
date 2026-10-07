'use client';

import React from 'react';
import { CountermeasureRankItem } from '@astra-loop/shared';
import { Repeat, CheckCircle, TrendingUp, Sparkles, Award } from 'lucide-react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

interface LearnLoopSummaryProps {
  ranking: CountermeasureRankItem[];
  latestEvaluation?: {
    action: string;
    beforeScore: number;
    afterScore: number;
    effect: number;
    confidence: number;
    result: string;
  } | null;
}

export const LearnLoopSummary: React.FC<LearnLoopSummaryProps> = ({ ranking, latestEvaluation }) => {
  return (
    <div className="space-y-6">
      {/* Hero "Did it work?" Evaluation Card */}
      <div className="rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 via-surface to-surface p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-900/50 p-2.5 border border-emerald-600/50 text-emerald-300">
              <Repeat className="w-6 h-6 animate-spin" style={{ animationDuration: '36s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                <span>CLOSED-LOOP LEARNING ENGINE</span>
                <span>•</span>
                <span>48–72H POST-ACTION OUTCOME</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-slate-100 uppercase">
                Did It Work? (Learn Loop Evaluation)
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500 bg-emerald-950 px-3.5 py-1.5 font-mono text-xs font-bold text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>RESULT: {latestEvaluation?.result || 'PROMISING'}</span>
          </span>
        </div>

        {/* 48-72h Before vs After Comparison */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 block uppercase">48-72h Before Z</span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-400">
              {latestEvaluation?.beforeScore ?? -1.8}z
            </div>
            <span className="text-[10px] text-slate-500">Deficit vs personal baseline</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 block uppercase">48-72h After Z</span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-sky-400">
              {latestEvaluation?.afterScore ?? -0.6}z
            </div>
            <span className="text-[10px] text-slate-500">Homeostatic recovery shift</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 block uppercase">Measured Effect</span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-400">
              +{(latestEvaluation?.effect ?? 1.2).toFixed(1)}z
            </div>
            <span className="text-[10px] text-slate-500">Significant positive response</span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <span className="text-[11px] text-slate-400 block uppercase">Model Confidence</span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-sky-300">
              {latestEvaluation?.confidence ?? 72}%
            </div>
            <span className="text-[10px] text-slate-500">Sample completeness factor</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-300 font-sans flex items-center justify-between">
          <span>
            <strong>Evaluation Action:</strong> Sleep Phase Adjustment Protocol (Initiated Mission Day 63)
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">Weight updated in personalized profile</span>
        </div>
      </div>

      {/* Personalized Astronaut Ranking */}
      <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
                Your Personalized Countermeasure History
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked empirically by historical recovery delta for CDR Alex Vance
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
            ADAPTIVE TWIN PROFILE
          </span>
        </div>

        <div className="space-y-3">
          {ranking.map((item, index) => {
            const isPromising = item.overallResult === 'PROMISING';
            const isUncertain = item.overallResult === 'UNCERTAIN';

            return (
              <div
                key={item.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 flex flex-wrap items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-bold text-slate-300">
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-xl">{item.recommendation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">AVG EFFECT</span>
                    <span className="font-bold text-slate-200">
                      {item.averageEffectZScore > 0 ? `+${item.averageEffectZScore}z` : `${item.averageEffectZScore}z`}
                    </span>
                  </div>

                  <ConfidenceBadge confidence={item.confidence} />

                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      isPromising
                        ? 'border border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                        : isUncertain
                        ? 'border border-amber-500/50 bg-amber-950/60 text-amber-300'
                        : 'border border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.overallResult.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

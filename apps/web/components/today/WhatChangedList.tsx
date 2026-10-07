'use client';

import React from 'react';
import { ChangeItem } from '@astra-loop/shared';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ArrowUpRight, ArrowDownRight, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WhatChangedListProps {
  changes: ChangeItem[];
}

export const WhatChangedList: React.FC<WhatChangedListProps> = ({ changes }) => {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
            What Changed Today
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key physiological and environmental deviations relative to personal 14-day baseline
          </p>
        </div>
        <Link
          href="/what-changed"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 font-semibold"
        >
          <span>Deep Explainability</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {changes.map((change) => {
          const isDown = change.direction === 'down';
          const isUp = change.direction === 'up';

          return (
            <div
              key={change.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  {change.domain}
                </span>
                <ConfidenceBadge confidence={change.confidence} />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{change.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{change.baselineContext}</p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded font-mono font-bold text-xs shrink-0 ${
                    isDown
                      ? 'bg-rose-950/60 border border-rose-800/40 text-rose-400'
                      : isUp
                      ? 'bg-amber-950/60 border border-amber-800/40 text-amber-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isDown ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                  <span>{change.detectedChange}</span>
                </div>
              </div>

              <div className="rounded bg-slate-950/60 border border-slate-800/80 p-2.5 text-xs space-y-1 font-sans">
                <div className="text-slate-300">
                  <strong className="text-slate-400 font-mono text-[11px] uppercase mr-1">Why this matters:</strong>
                  {change.whyThisMatters}
                </div>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Sources: {change.dataSources.join(' • ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

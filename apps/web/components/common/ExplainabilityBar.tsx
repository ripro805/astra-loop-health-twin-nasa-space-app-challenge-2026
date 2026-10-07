'use client';

import React from 'react';

interface ContributionItem {
  name: string;
  score: number;
  description?: string;
}

interface ExplainabilityBarProps {
  contributions: ContributionItem[];
  className?: string;
}

export const ExplainabilityBar: React.FC<ExplainabilityBarProps> = ({ contributions, className = '' }) => {
  const maxScore = Math.max(...contributions.map((c) => c.score), 20);

  return (
    <div className={`rounded-lg border border-surface-border bg-surface p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Contribution to Simulated Risk Score
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic physiological weights highlighting compound driver metrics
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
          EXPLAINABLE LOGIC
        </span>
      </div>

      <div className="space-y-3.5">
        {contributions.map((item) => {
          const pct = Math.min(100, Math.round((item.score / maxScore) * 100));

          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span className="text-slate-400 font-bold">{item.score} pts ({pct}%)</span>
              </div>
              <div className="h-2 w-full rounded bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded bg-gradient-to-r from-sky-600 to-amber-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              {item.description && (
                <p className="text-[11px] text-slate-500 font-sans">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 italic">
        Simulated prototype score — weights are demonstration values and are not clinically validated.
      </div>
    </div>
  );
};

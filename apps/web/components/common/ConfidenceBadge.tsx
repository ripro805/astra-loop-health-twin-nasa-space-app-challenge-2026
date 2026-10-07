'use client';

import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number; // 0 - 100
  label?: string;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  label = 'Confidence',
  className = '',
}) => {
  const isHigh = confidence >= 80;
  const isModerate = confidence >= 50 && confidence < 80;
  const isLow = confidence < 50;

  const colorClass = isHigh
    ? 'text-sky-400 border-sky-800/60 bg-sky-950/40'
    : isModerate
    ? 'text-amber-400 border-amber-800/60 bg-amber-950/40'
    : 'text-rose-400 border-rose-800/60 bg-rose-950/40';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded border px-2.5 py-1 font-mono text-xs ${colorClass} ${className}`}
      title={isLow ? 'Sensor blind spot detected: confidence degraded' : 'Sensor fusion confidence'}
    >
      {isLow ? (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      ) : (
        <Activity className="w-3.5 h-3.5 opacity-80 shrink-0" />
      )}
      <span className="text-slate-400 font-sans">{label}:</span>
      <span className="font-bold">{confidence}%</span>
    </div>
  );
};

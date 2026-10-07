'use client';

import React from 'react';
import { ShieldAlert, Database, Cpu } from 'lucide-react';

interface SyntheticBadgeProps {
  className?: string;
  variant?: 'banner' | 'pill' | 'subtle';
}

export const SyntheticBadge: React.FC<SyntheticBadgeProps> = ({ className = '', variant = 'pill' }) => {
  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center justify-between border-b border-amber-500/20 bg-amber-950/30 px-4 py-1.5 text-xs text-amber-300 font-mono ${className}`}
        role="note"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>RESEARCH & HACKATHON PROTOTYPE:</strong> All physiological metrics are <strong>SYNTHETIC DATA</strong>. Non-clinical decision support only.
          </span>
        </div>
        <span className="hidden sm:inline text-amber-400/80 uppercase tracking-widest text-[10px]">NASA Space Apps 2026</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border border-cyan-800/60 bg-cyan-950/40 px-2.5 py-0.5 font-mono text-[11px] text-cyan-300 uppercase tracking-wider ${className}`}
      title="Prototype physiological values generated from mathematical biological models"
    >
      <Cpu className="w-3 h-3 text-cyan-400" />
      <span>SYNTHETIC DATA</span>
    </span>
  );
};

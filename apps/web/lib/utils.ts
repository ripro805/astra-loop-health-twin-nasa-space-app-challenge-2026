import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZScore(z: number | null | undefined): string {
  if (z === null || z === undefined) return 'N/A';
  const prefix = z > 0 ? '+' : '';
  return `${prefix}${z.toFixed(2)}z`;
}

export function getStatusTheme(status: string) {
  switch (status) {
    case 'STABLE':
      return {
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
        label: 'STABLE',
      };
    case 'MONITOR':
      return {
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
        label: 'MONITOR',
      };
    case 'ATTENTION':
      return {
        bg: 'bg-rose-950/60',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        dot: 'bg-rose-400',
        label: 'ATTENTION',
      };
    case 'INSUFFICIENT_DATA':
    default:
      return {
        bg: 'bg-slate-900/60',
        border: 'border-slate-600/50',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
        label: 'INSUFFICIENT DATA',
      };
  }
}

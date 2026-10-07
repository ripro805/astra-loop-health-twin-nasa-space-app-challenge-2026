'use client';

import React from 'react';
import { getStatusTheme } from '../../lib/utils';
import { SystemStatus } from '@astra-loop/shared';

interface StatusBadgeProps {
  status: SystemStatus | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const theme = getStatusTheme(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs tracking-wider gap-1.5',
    md: 'px-2.5 py-1 text-xs tracking-wider gap-2',
    lg: 'px-3.5 py-1.5 text-sm tracking-wider font-semibold gap-2.5',
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border font-mono font-medium uppercase shadow-sm ${theme.bg} ${theme.border} ${theme.text} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`System status: ${theme.label}`}
    >
      <span className={`rounded-full ${theme.dot} ${dotSizes}`} aria-hidden="true" />
      <span>{theme.label}</span>
    </span>
  );
};

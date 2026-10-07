'use client';

import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { OfflineBanner } from '../common/OfflineBanner';
import { SyntheticBadge } from '../common/SyntheticBadge';

interface AppShellProps {
  children: React.ReactNode;
  missionDay?: number;
  onRefresh?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, missionDay = 61, onRefresh }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Top Prototype & Synthetic Data Banner */}
      <SyntheticBadge variant="banner" />

      {/* Primary Mission Control Top Bar */}
      <TopBar
        missionDay={missionDay}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onRefresh={onRefresh}
      />

      {/* Offline Mode / DTN Delay Alert Banner */}
      <OfflineBanner />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 telemetry-grid">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

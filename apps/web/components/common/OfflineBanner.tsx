'use client';

import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export const OfflineBanner: React.FC = () => {
  const { isOffline, pendingCount, isSyncing, triggerSync, lastSyncMessage } = useOfflineSync();

  if (!isOffline && pendingCount === 0 && !lastSyncMessage) {
    return null;
  }

  return (
    <div className="w-full border-b border-indigo-900/60 bg-indigo-950/60 px-4 py-2 text-xs font-mono text-indigo-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isOffline ? (
            <>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>OFFLINE MODE:</strong> Telemetry cached locally in IndexedDB. Pending sync:{' '}
                <span className="text-amber-300 font-bold">{pendingCount} records</span>
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>GROUND LINK READY:</strong> Earth light-time delay active (14.3 min).{' '}
                {pendingCount > 0 ? `${pendingCount} pending local telemetry records to upload.` : 'All local queues synced.'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastSyncMessage && <span className="text-slate-400 italic text-[11px]">{lastSyncMessage}</span>}
          {pendingCount > 0 && !isOffline && (
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 rounded border border-indigo-500/50 bg-indigo-900/80 px-2.5 py-1 text-xs text-white hover:bg-indigo-800 transition font-sans"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Pending Data'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

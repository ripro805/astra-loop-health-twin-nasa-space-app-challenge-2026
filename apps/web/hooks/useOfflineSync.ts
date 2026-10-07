'use client';

import { useState, useEffect, useCallback } from 'react';
import { isOfflineMode, setSimulatedOffline, api } from '../lib/api';
import { getQueuedActions } from '../lib/indexeddb';

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setIsOffline(isOfflineMode());
    const queued = await getQueuedActions();
    setPendingCount(queued.length);
  }, []);

  useEffect(() => {
    checkStatus();

    const handleOnline = () => checkStatus();
    const handleOffline = () => checkStatus();
    const handleCustomChange = () => checkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline_state_changed', handleCustomChange);

    const interval = setInterval(checkStatus, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline_state_changed', handleCustomChange);
      clearInterval(interval);
    };
  }, [checkStatus]);

  const toggleSimulateOffline = () => {
    const nextState = !isOffline;
    setSimulatedOffline(nextState);
    setIsOffline(nextState);
  };

  const triggerSync = async () => {
    if (isOffline) {
      setLastSyncMessage('Cannot sync while in offline mode.');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await api.flushOfflineQueue();
      setLastSyncMessage(`Synced ${res.processedCount || 0} queued records.`);
      await checkStatus();
    } catch {
      setLastSyncMessage('Sync failed. Telemetry queued for next transmission window.');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOffline,
    pendingCount,
    isSyncing,
    lastSyncMessage,
    toggleSimulateOffline,
    triggerSync,
    refreshStatus: checkStatus,
  };
}

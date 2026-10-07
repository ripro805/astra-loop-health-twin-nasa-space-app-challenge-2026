import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface QueuedItem {
  id: string;
  type: 'CHECK_IN' | 'COUNTERMEASURE_START';
  payload: any;
  createdAt: string;
}

interface CachedDashboard {
  key: string;
  data: any;
  updatedAt: string;
}

interface AstraLoopDB extends DBSchema {
  syncQueue: {
    key: string;
    value: QueuedItem;
  };
  cacheStore: {
    key: string;
    value: CachedDashboard;
  };
}

const DB_NAME = 'astra-loop-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AstraLoopDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<AstraLoopDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cacheStore')) {
          db.createObjectStore('cacheStore', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function queueOfflineAction(type: 'CHECK_IN' | 'COUNTERMEASURE_START', payload: any): Promise<string> {
  const db = await getDB();
  const id = `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const item: QueuedItem = {
    id,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await db.put('syncQueue', item);
  }
  return id;
}

export async function getQueuedActions(): Promise<QueuedItem[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('syncQueue');
}

export async function clearQueuedActions(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.clear('syncQueue');
}

export async function cacheData(key: string, data: any): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('cacheStore', {
    key,
    data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCachedData(key: string): Promise<any | null> {
  const db = await getDB();
  if (!db) return null;
  const entry = await db.get('cacheStore', key);
  return entry ? entry.data : null;
}

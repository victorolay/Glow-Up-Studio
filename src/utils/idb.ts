import type { SavedLookRecipe } from '@/game/types';

/** Minimal IndexedDB wrapper for the lookbook (photos stay on-device, §10). */

export interface SavedLook {
  id: string;
  challengeId: string;
  challengeTitle: string;
  createdAt: number;
  score?: number;
  stars?: number;
  thumbnail: string; // data URL
  recipe?: SavedLookRecipe;
}

const DB_NAME = 'glow-up-studio';
const STORE = 'looks';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = run(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
  });
}

export function idbPutLook(look: SavedLook): Promise<IDBValidKey> {
  return tx('readwrite', (store) => store.put(look));
}

export function idbAllLooks(): Promise<SavedLook[]> {
  return tx('readonly', (store) => store.getAll() as IDBRequest<SavedLook[]>);
}

export function idbDeleteLook(id: string): Promise<undefined> {
  return tx('readwrite', (store) => store.delete(id));
}

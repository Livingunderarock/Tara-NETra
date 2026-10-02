// TĀRĀ Storage Service — IndexedDB + localStorage for persistence

const DB_NAME = 'tara-netra-db';
const DB_VERSION = 1;
const STORES = {
  MAPPINGS: 'learnedMappings',
  HISTORY: 'analysisHistory',
  DEVICES: 'deviceProfiles',
};

// === IndexedDB ===

let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) { resolve(dbInstance); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { dbInstance = request.result; resolve(dbInstance); };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.MAPPINGS)) {
        db.createObjectStore(STORES.MAPPINGS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        db.createObjectStore(STORES.HISTORY, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.DEVICES)) {
        db.createObjectStore(STORES.DEVICES, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function dbAdd(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.add(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbDelete(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function dbClear(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function dbUpdate(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// === Learned Mappings (use localStorage for sync access, IndexedDB for persistence) ===

const MAPPINGS_KEY = 'tara-netra-learned-mappings';

export function getLearnedMappings() {
  try {
    const data = localStorage.getItem(MAPPINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLearnedMapping(mapping) {
  const mappings = getLearnedMappings();
  mapping.id = Date.now();
  mapping.timestamp = new Date().toISOString();
  mappings.push(mapping);
  localStorage.setItem(MAPPINGS_KEY, JSON.stringify(mappings));
  // Also save to IndexedDB
  dbAdd(STORES.MAPPINGS, mapping).catch(() => {});
  return mapping;
}

export function deleteLearnedMapping(id) {
  const mappings = getLearnedMappings().filter(m => m.id !== id);
  localStorage.setItem(MAPPINGS_KEY, JSON.stringify(mappings));
  dbDelete(STORES.MAPPINGS, id).catch(() => {});
}

export function clearLearnedMappings() {
  localStorage.removeItem(MAPPINGS_KEY);
  dbClear(STORES.MAPPINGS).catch(() => {});
}

export function updateLearnedMapping(mapping) {
  const mappings = getLearnedMappings().map(m => m.id === mapping.id ? mapping : m);
  localStorage.setItem(MAPPINGS_KEY, JSON.stringify(mappings));
  dbUpdate(STORES.MAPPINGS, mapping).catch(() => {});
}

// === Analysis History ===

const HISTORY_KEY = 'tara-netra-analysis-history';

export function getAnalysisHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(analysis) {
  const history = getAnalysisHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    deviceName: analysis.deviceName || 'Unknown',
    vendor: analysis.vendor?.vendor || 'Unknown',
    compliancePercent: analysis.compliancePercent || 0,
    stats: analysis.stats,
    summary: analysis.complianceSummary,
  };
  history.unshift(entry);
  // Keep last 50 entries
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  dbAdd(STORES.HISTORY, entry).catch(() => {});
  return entry;
}

// === Knowledge Export / Import ===

export function exportKnowledge() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    application: 'TARA-NETRA',
    learnedMappings: getLearnedMappings(),
    analysisHistory: getAnalysisHistory(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tara-netra-knowledge-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importKnowledge(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.application !== 'TARA-NETRA') {
      throw new Error('Invalid TĀRĀ-NETRA knowledge file');
    }
    if (data.learnedMappings) {
      const existing = getLearnedMappings();
      const merged = [...existing];
      for (const mapping of data.learnedMappings) {
        if (!merged.find(m => m.pattern === mapping.pattern)) {
          merged.push(mapping);
        }
      }
      localStorage.setItem(MAPPINGS_KEY, JSON.stringify(merged));
    }
    return { success: true, imported: data.learnedMappings?.length || 0 };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// === localStorage utilities ===

export function getSetting(key, defaultValue) {
  try {
    const val = localStorage.getItem(`tara-${key}`);
    return val !== null ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setSetting(key, value) {
  localStorage.setItem(`tara-${key}`, JSON.stringify(value));
}

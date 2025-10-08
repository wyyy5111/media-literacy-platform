// localStorage / IndexedDB 存档（简化）
export const Store = {
  key: 'truth-edit-game',
  persist(payload) {
    try { localStorage.setItem(Store.key, JSON.stringify(payload)); } catch {}
  },
  restore() {
    try { return JSON.parse(localStorage.getItem(Store.key)); } catch { return null; }
  },
  clear() {
    try { localStorage.removeItem(Store.key); } catch {}
  },

  // IndexedDB：导出记录索引
  _db: null,
  async initDB() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('truth-edit-game', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('exports')) {
          db.createObjectStore('exports', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => { this._db = e.target.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    }).catch(() => null);
  },

  async addExportRecord(record) {
    const db = await this.initDB();
    if (!db) {
      try {
        const arr = JSON.parse(localStorage.getItem('exports_log') || '[]');
        arr.push({ ...record, id: arr.length + 1 });
        localStorage.setItem('exports_log', JSON.stringify(arr));
        return { ok: true, id: arr.length };
      } catch { return { ok: false }; }
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction('exports', 'readwrite');
      tx.oncomplete = () => {};
      tx.onerror = () => reject(tx.error);
      const store = tx.objectStore('exports');
      const req = store.add(record);
      req.onsuccess = () => resolve({ ok: true, id: req.result });
      req.onerror = () => reject(req.error);
    });
  },

  async listExportRecords() {
    const db = await this.initDB();
    if (!db) {
      try { return JSON.parse(localStorage.getItem('exports_log') || '[]'); } catch { return []; }
    }
    return new Promise((resolve, reject) => {
      const tx = db.transaction('exports', 'readonly');
      const store = tx.objectStore('exports');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
};
// localStorage 安全读写（隐私模式等不可用时静默降级）
export const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* 忽略 */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* 忽略 */ } },
  getJSON(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  setJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 忽略 */ } },
};

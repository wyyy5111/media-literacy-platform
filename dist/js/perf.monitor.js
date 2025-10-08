// 轻量性能监控工具：TTI 与交互耗时
export const PerfMonitor = {
  mark(name) {
    try { performance.mark(name); } catch {}
  },
  measure(label, start, end) {
    try {
      performance.measure(label, start, end);
      const entry = performance.getEntriesByName(label).slice(-1)[0];
      return entry?.duration || 0;
    } catch { return 0; }
  },
  reportTTI(limitMs = 1500) {
    const hasMarks = performance.getEntriesByName('app_start').length && performance.getEntriesByName('app_interactive').length;
    const dur = hasMarks ? this.measure('tti', 'app_start', 'app_interactive') : 0;
    const ok = dur > 0 && dur <= limitMs;
    this._log({ type: 'TTI', ms: Math.round(dur), limit: limitMs, ok });
    this._save({ type: 'TTI', ms: Math.round(dur), limit: limitMs, ok, ts: Date.now() });
  },
  reportInteraction(limitMs = 50, label = 'interaction') {
    const dur = this.measure(label, 'inter_start', 'inter_end');
    const ok = dur > 0 && dur <= limitMs;
    this._log({ type: 'INTER', ms: Math.round(dur), limit: limitMs, ok });
    this._save({ type: 'INTER', ms: Math.round(dur), limit: limitMs, ok, ts: Date.now() });
  },
  _log({ type, ms, limit, ok }) {
    const msg = `[Perf] ${type}: ${ms}ms (≤ ${limit}ms) ${ok ? '✅' : '⚠️'}`;
    try { (ok ? console.log : console.warn)(msg); } catch {}
  },
  _save(record) {
    try {
      const key = 'perfLogs';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(record);
      while (arr.length > 30) arr.shift();
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {}
  }
};
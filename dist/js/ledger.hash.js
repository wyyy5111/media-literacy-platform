// SHA-256 指纹编号 / 导出索引
export const Ledger = {
  async hash(text) {
    const enc = new TextEncoder().encode(text);
    if (window.crypto?.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', enc);
      const arr = Array.from(new Uint8Array(buf));
      return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 5381; // djb2 回退
    for (let i = 0; i < enc.length; i++) h = (h * 33) ^ enc[i];
    return (h >>> 0).toString(16);
  },

  async hex8(name, ts, totalScore) {
    const base = `${name||''}|${ts||''}|${totalScore||0}`;
    const full = await this.hash(base);
    return String(full).slice(0, 8);
  }
};
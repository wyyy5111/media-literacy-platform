// 谣言真伪混排与证据解释：可疑点检测 + 理由生成
export const RumorVerify = {
  _lex: null,
  async _loadLexicons() {
    if (this._lex) return this._lex;
    try {
      const res = await fetch('../data/lexicons.json');
      this._lex = await res.json();
      return this._lex;
    } catch {
      this._lex = {
        vague_time: ['近日','近期','去年','上月','不久前'],
        exaggeration: ['震惊','爆炸性','神奇']
      };
      return this._lex;
    }
  },

  // UI 评估：沿用 r1/r2/r3 单选
  evalRumor() {
    let total = 0;
    ['r1', 'r2', 'r3'].forEach((name) => {
      total += Number((document.querySelector(`input[name="${name}"]:checked`)?.value || 0));
    });
    return Math.round((total / 3) * 100);
  },

  // 文本检测：返回可疑片段索引与理由
  async analyze(materialSegments = []) {
    const lex = await this._loadLexicons();
    const vague = new Set(lex?.vague_time || []);
    const hype = new Set(lex?.exaggeration || []);
    const suspicious = [];
    materialSegments.forEach((seg, idx) => {
      const s = String(seg);
      const reasons = [];
      // 模糊时点
      [...vague].forEach(v => { if (s.includes(v)) reasons.push('模糊时间'); });
      // 夸张词
      [...hype].forEach(w => { if (s.includes(w)) reasons.push('夸张/煽动性词'); });
      // 低证据线索
      if (/网友|传闻|听说|未经证实|来源单一/.test(s)) reasons.push('证据不足/来源单一');
      // 旧闻拼接线索
      if (/旧闻|拼接|截图叠加/.test(s)) reasons.push('旧闻拼接/上下文缺失');
      if (reasons.length) suspicious.push({ idx, text: s, reasons });
    });
    const score = Math.min(100, suspicious.length * 30);
    return { suspicious, score };
  }
};
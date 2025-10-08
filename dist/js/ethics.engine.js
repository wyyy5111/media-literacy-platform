// 伦理与 AI 标识：必选项校验 + 替代表述建议（结合 lexicons.json，可离线运行）
export const EthicsEngine = {
  _lex: null,
  async _loadLexicons() {
    if (this._lex) return this._lex;
    try {
      const res = await fetch('../data/lexicons.json');
      this._lex = await res.json();
      return this._lex;
    } catch {
      // 回退词表
      this._lex = {
        neutral_replacements: {
          '震惊': ['引发关注','值得注意'],
          '唯一': ['较为少见'],
          '必须': ['建议','通常应当'],
          '绝对': ['通常','在样本中']
        }
      };
      return this._lex;
    }
  },

  // UI 评估：基于 .aiopt 复选框（保留原逻辑）
  evalEthics() {
    const opts = Array.from(document.querySelectorAll('.aiopt'));
    let pos = 0, neg = 0;
    opts.forEach((o) => { if (o.checked) (o.value === '1' ? pos++ : neg++); });
    const base = Math.max(0, pos - neg);
    return Math.round(Math.min(1, base / 3) * 100);
  },

  // 校验必须项（required 列表）与禁止项（banned 列表），返回评分与解释
  validate(requiredList = [], picked = [], bannedPicked = []) {
    const requiredHit = requiredList.filter(k => picked.includes(k));
    const miss = requiredList.filter(k => !picked.includes(k));
    const penalty = Math.min(2, bannedPicked.length);
    const baseScore = Math.round(((requiredHit.length) / Math.max(requiredList.length, 1)) * 100);
    const score = Math.max(0, baseScore - penalty * 20);
    const explain = [];
    if (miss.length) explain.push(`缺失必选：${miss.join(', ')}`);
    if (bannedPicked.length) explain.push(`存在不合规：${bannedPicked.join(', ')}`);
    if (!explain.length) explain.push('合规动作齐备，未发现明显不当。');
    return { score, explain };
  },

  // 替代表述建议：根据词表将夸张或不当用语替换为中性表述
  async suggestNeutral(text) {
    const lex = await this._loadLexicons();
    const repl = lex?.neutral_replacements || {};
    let out = text || '';
    Object.keys(repl).forEach(key => {
      const arr = repl[key];
      if (!arr || !arr.length) return;
      const re = new RegExp(key, 'g');
      out = out.replace(re, arr[0]);
    });
    return out;
  }
};
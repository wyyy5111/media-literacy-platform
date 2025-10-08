// 引用占位与校验（GB/T 7714 简化版）
export const SourcesCitation = {
  // 1) 下拉评估（沿用现有 UI：#s1/#s2/#s3）
  evalSources() {
    let total = 0;
    ['s1', 's2', 's3'].forEach((id) => {
      const v = document.querySelector('#' + id)?.value;
      total += Number(v || 0);
    });
    return Math.round((total / 3) * 100);
  },

  // 2) 规范化作者（支持多作者“; ”分隔）
  _normalizeAuthor(author) {
    if (!author) return '佚名';
    const arr = String(author).split(/[,;\s]+/).filter(Boolean);
    return arr.join('; ');
  },

  // 3) 各类型 GB/T 7714 简化格式化
  formatPaper({ author, title, journal, date, page }) {
    const a = this._normalizeAuthor(author);
    const y = (date || '').toString().slice(0, 10);
    const p = page ? `${page}` : '';
    return `${a}. ${title}[J]. ${journal}, ${y}: ${p}`.replace(/:\s*$/,'');
  },
  formatPolicy({ agency, title, number, date, url }) {
    const y = (date || '').toString().slice(0, 10);
    const num = number ? `${number}` : '';
    const link = url ? `${url}` : '';
    return `${agency}. ${title}[EB/OL]. ${num}, ${y}. ${link}`.trim();
  },
  formatDataset({ source, topic, version, release, url }) {
    const v = version ? `(${version})` : '';
    const r = release || '';
    const link = url ? `${url}` : '';
    return `${source}. ${topic}[DB/OL] ${v}. ${r}. ${link}`.trim();
  },
  formatArticle({ author, title, platform, date, url }) {
    const a = this._normalizeAuthor(author);
    const y = (date || '').toString().slice(0, 10);
    const link = url ? `${url}` : '';
    return `${a}. ${title}[EB/OL]. ${platform}, ${y}. ${link}`.trim();
  },

  // 4) 校验槽位完整性并给出分数与缺失项
  validate(type, slots) {
    const reqMap = {
      paper: ['author','title','journal','date','page'],
      policy: ['agency','title','number','date','url'],
      dataset: ['source','topic','version','release','url'],
      article: ['author','title','platform','date','url']
    };
    const need = reqMap[type] || [];
    const missing = need.filter((k) => !slots?.[k] || !String(slots[k]).trim());
    const score = Math.round(((need.length - missing.length) / Math.max(need.length, 1)) * 100);
    let formatted = '';
    try {
      if (type === 'paper') formatted = this.formatPaper(slots || {});
      else if (type === 'policy') formatted = this.formatPolicy(slots || {});
      else if (type === 'dataset') formatted = this.formatDataset(slots || {});
      else if (type === 'article') formatted = this.formatArticle(slots || {});
    } catch {}
    return { score, missing, formatted };
  }
};
// 一页专题与证书PDF导出（print CSS + pdf-lib 兜底占位）
import { computeRadar } from './scoring.js';
import { Ledger } from './ledger.hash.js';
import { Store } from './store.local.js';
import { Achievements } from './achievements.js';
import { formatDateISO, getDict } from './i18n.js';

export const ReportMaker = {
  drawRadarCanvas(canvas, scores) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 20;
    const axes = [
      scores['中立度(标题)'] || 0,
      scores['图表修正'] || 0,
      scores['事实链'] || 0,
      scores['伦理与AI'] || 0
    ];
    const labels = ['中立度', '图表修正', '事实链', '伦理'];
    const n = axes.length;
    ctx.strokeStyle = '#334';
    ctx.lineWidth = 1;
    for (let g = 1; g <= 4; g++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        const rr = (r * g) / 4;
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.fillStyle = '#8aa';
    ctx.font = '12px system-ui';
    labels.forEach((lb, i) => {
      const a = (Math.PI * 2 * i) / n;
      const x = cx + (r + 10) * Math.cos(a);
      const y = cy + (r + 10) * Math.sin(a);
      ctx.fillText(lb, x - 16, y);
    });
    ctx.beginPath();
    ctx.strokeStyle = '#4ea1ff';
    ctx.fillStyle = 'rgba(78,161,255,.2)';
    axes.forEach((val, i) => {
      const a = (Math.PI * 2 * i) / n;
      const rr = (Math.max(0, Math.min(100, val)) / 100) * r;
      const x = cx + rr * Math.cos(a);
      const y = cy + rr * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
  exportSummary(scores) {
    const LANG = localStorage.getItem('lang') || 'cn';
    const d = getDict();
    const txt = Object.entries(scores).map(([k, v]) => `${k}：${v}`).join('；');
    const prefix = LANG==='en' ? 'Your editorial radar: ' : '你的编辑力雷达：';
    document.querySelector('#printSummaryText').textContent = `${prefix}${txt}`;
    this.drawRadarCanvas(document.querySelector('#printRadar'), scores);
    document.getElementById('printDate').textContent = formatDateISO(new Date());
    document.body.classList.add('print-summary');
    window.print();
    setTimeout(() => document.body.classList.remove('print-summary'), 300);
  },

  exportCertificate(name, scores, hash) {
    const LANG = localStorage.getItem('lang') || 'cn';
    const d = getDict();
    const date = formatDateISO(new Date());
    document.querySelector('#certName').textContent = `${LANG==='en'?'Name':'姓名'}：${name || (LANG==='en'?'Unnamed':'未署名')}`;
    document.querySelector('#certDate').textContent = `${LANG==='en'?'Date':'日期'}：${date}`;
    document.querySelector('#certHash').textContent = `${LANG==='en'?'Certificate ID (hash)':'证书编号（哈希）'}：${hash}`;
    const badges = Achievements.getBadges();
    const ul = document.getElementById('certBadges');
    if (ul) ul.innerHTML = badges.length ? badges.map(b=>`<li>🏅 ${b}</li>`).join('') : `<li class="muted">${(d.noBadges?.[LANG])||d.noBadges.cn}</li>`;
    this.drawRadarCanvas(document.querySelector('#certRadar'), scores);
    document.body.classList.add('print-cert');
    window.print();
    setTimeout(() => document.body.classList.remove('print-cert'), 300);
  },

  makeBundle(name, scores, overall, id8, fullHash) {
    const stamp = new Date().toISOString();
    const badges = Achievements.getBadges();
    const payload = {
      name: name || '',
      overall,
      scores,
      badges,
      id8,
      sha256: fullHash,
      timestamp: stamp,
      version: 'v1'
    };
    const json = JSON.stringify(payload, null, 2);
    const fingerprintTxt = `id8=${id8}\nsha256=${fullHash}\nname=${name}\ntimestamp=${stamp}\noverall=${overall}`;
    return { json, fingerprintTxt, payload };
  },

  download(name, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 50);
  },

  async exportZip(name, scores) {
    const overall = computeRadar(scores).overall;
    const ts = Date.now();
    const fullHash = await Ledger.hash(`${name}|${ts}|${overall}`);
    const id8 = String(fullHash).slice(0, 8);
    const { json, fingerprintTxt, payload } = this.makeBundle(name, scores, overall, id8, fullHash);

    // 记录索引
    try { await Store.addExportRecord({ kind: 'zip', id8, hash: fullHash, name, overall, ts }); } catch {}

    // JSZip 兼容（如未提供则分别下载文件）
    const JSZip = window.JSZip;
    if (JSZip) {
      const zip = new JSZip();
      zip.file('report.json', json);
      zip.file('fingerprint.txt', fingerprintTxt);
      // PDF 由用户通过打印生成后自行加入；或若提供 PDFLib，可在此合成
      const blob = await zip.generateAsync({ type: 'blob' });
      this.download(`export_${id8}.zip`, blob, 'application/zip');
      return { ok: true, id8 };
    }
    // 回退：分别导出 JSON 与指纹文本
    this.download(`report_${id8}.json`, json, 'application/json');
    this.download(`fingerprint_${id8}.txt`, fingerprintTxt, 'text/plain');
    return { ok: true, id8, fallback: true };
  }
};
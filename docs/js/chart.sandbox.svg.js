// SVG图表沙盒 + 误差自动估算
import { computeErrorDrop, estimateChartError, explainRisks } from './reverse.estimate.js';

function parseMaterialText() {
  const matEl = document.querySelector('#stage2 .play-right .question .muted');
  const text = matEl ? matEl.textContent || '' : '';
  const params = {};
  text.split(',').map(s => s.trim()).forEach(pair => {
    const m = pair.match(/^([a-zA-Z_]+)\s*=\s*(.+)$/);
    if (!m) return;
    const k = m[1]; let v = m[2];
    if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^\d+$/.test(v)) v = Number(v);
    else if (/^\[.+\]$/.test(v)) v = v.replace(/[\[\]]/g,'').split(/\s*,\s*/).map(Number);
    params[k] = v;
  });
  return params;
}

function getFixParams() {
  return {
    zero: !!document.querySelector('#fix_zero')?.checked,
    no3d: !!document.querySelector('#fix_no3d')?.checked,
    single_axis: !!document.querySelector('#fix_single_axis')?.checked,
    extend: !!document.querySelector('#fix_extend')?.checked,
  };
}

function applyFixes(before) {
  const fixes = getFixParams();
  const after = { ...before };
  if (fixes.zero) after.y_min = 0;
  if (fixes.no3d) after.use_3d = false;
  if (fixes.single_axis) after.dual_axis = false;
  if (fixes.extend) after.x_window = before.x_full || [2018, 2024];
  return { fixes, after };
}

function renderSVG(params) {
  const svg = document.querySelector('#chartSVG');
  const explainBox = document.querySelector('#chartExplain');
  if (!svg) return;
  const w = Number(svg.getAttribute('width') || 360);
  const h = Number(svg.getAttribute('height') || 220);
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const data = [10, 20, 12, 30, 18];
  const padding = 32;
  const yMin = Number(params.y_min || 0);
  const yMax = Math.max(...data, Number(params.y_max || 100));
  const scaleY = (h - padding * 2) / Math.max(yMax - yMin, 1);
  const barW = (w - padding * 2) / data.length - 12;

  // X轴
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axis.setAttribute('x1', String(padding));
  axis.setAttribute('y1', String(h - padding));
  axis.setAttribute('x2', String(w - padding));
  axis.setAttribute('y2', String(h - padding));
  axis.setAttribute('stroke', '#777');
  svg.appendChild(axis);

  // 柱
  data.forEach((v, i) => {
    const x = padding + i * (barW + 12) + 6;
    const bh = (v - yMin) * scaleY;
    const y = h - padding - bh;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(barW));
    rect.setAttribute('height', String(Math.max(bh, 0)));
    rect.setAttribute('fill', params.palette_misleading ? '#d9534f' : '#2c7be5');
    svg.appendChild(rect);
    if (params.use_3d) {
      const side = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const dx = Math.max(6, Math.round(barW * 0.15));
      side.setAttribute('points', `${x+barW},${y} ${x+barW+dx},${y-6} ${x+barW+dx},${y-6+bh} ${x+barW},${y+bh}`);
      side.setAttribute('fill', '#4ea1ff');
      side.setAttribute('opacity', '0.5');
      svg.appendChild(side);
    }
  });

  // 解释
  if (explainBox) {
    const notes = explainRisks(params);
    explainBox.innerHTML = notes.length ? notes.map(n => `<div>• ${n}</div>`).join('') : '<div class="muted">无明显风险</div>';
  }
}

function recomputeAndFillDrop(before) {
  const { after } = applyFixes(before);
  const { percent } = computeErrorDrop(before, after);
  const input = document.querySelector('#errDrop');
  if (input) input.value = Math.round(percent);
}

function bind() {
  ['#fix_zero','#fix_no3d','#fix_single_axis','#fix_extend'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el || el._bound) return;
    el.addEventListener('change', () => {
      const base = normalizeForEstimate(parseMaterialText());
      renderSVG(base);
      recomputeAndFillDrop(base);
    });
    el._bound = true;
  });
}

function normalizeForEstimate(p = {}) {
  const out = { ...p };
  out.y_max = Number(out.y_max ?? 100);
  out.true_zero = Number(out.true_zero ?? 0);
  out.x_full = out.x_full || [2018, 2024];
  out.x_window = out.window || out.x_window || out.x_full;
  return out;
}

function initIfAvailable() {
  const svg = document.querySelector('#chartSVG');
  if (!svg) return;
  const base = normalizeForEstimate(parseMaterialText());
  renderSVG(base);
  recomputeAndFillDrop(base);
  bind();
}

// 在页面加载后尝试初始化；在路由切换时，app.js 会重新渲染内容，本模块依旧能捕捉到DOM并工作
document.addEventListener('DOMContentLoaded', initIfAvailable);

// 作为模块导出便于其他脚本调用
export const ChartSandbox = { initIfAvailable };
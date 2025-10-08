// 图表误差估算（reverse.estimate.js）
// 输入原始/修正后的参数，输出各项误差及总误差，并计算误差下降百分比与解释

const EPS = 1e-6;

export const ERROR_WEIGHTS = {
  zero: 0.35,
  d3: 0.25,
  clip: 0.25,
  dual: 0.15,
};

// 规范化参数，填充默认值
function normalize(p = {}) {
  const out = { ...p };
  out.type = out.type || 'bar';
  out.y_min = Number(out.y_min ?? 0);
  out.true_zero = Number(out.true_zero ?? 0);
  out.y_max = Number(out.y_max ?? 100);
  out.use_3d = !!out.use_3d;
  out.side_ratio = Number(out.side_ratio ?? (out.use_3d ? 0.2 : 0));
  const fw = out.x_full || [2018, 2024];
  const ww = out.x_window || fw;
  out.x_full = Array.isArray(fw) ? fw : [2018, 2024];
  out.x_window = Array.isArray(ww) ? ww : out.x_full;
  out.dual_axis = !!out.dual_axis;
  out.palette_misleading = !!out.palette_misleading;
  out.legend_mismatch = !!out.legend_mismatch;
  return out;
}

export function estimateChartError(params = {}) {
  const p = normalize(params);
  const range = Math.max(p.y_max - p.true_zero, EPS);
  const E_zero = Math.max(Math.min(p.y_min / range, 1), 0);
  const k = 0.3; // 3D夸大系数可调
  const E_3d = p.use_3d ? Math.max(Math.min(p.side_ratio * k, 1), 0) : 0;
  const full = Math.max(p.x_full[1] - p.x_full[0], EPS);
  const win = Math.max(p.x_window[1] - p.x_window[0], 0);
  const cover = Math.max(Math.min(win / full, 1), 0);
  const E_clip = Math.max(1 - cover, 0);
  let E_dual = 0;
  if (p.dual_axis) {
    E_dual = (p.palette_misleading || p.legend_mismatch) ? 0.5 : 0.3; // 固定惩罚
  }
  const total = ERROR_WEIGHTS.zero * E_zero + ERROR_WEIGHTS.d3 * E_3d + ERROR_WEIGHTS.clip * E_clip + ERROR_WEIGHTS.dual * E_dual;
  const explain = [
    `截断零点 E_zero=${E_zero.toFixed(3)} (y_min=${p.y_min}, range=${range.toFixed(1)})`,
    `3D失真 E_3d=${E_3d.toFixed(3)} (side_ratio=${p.side_ratio.toFixed(2)}, k=${k})`,
    `裁窗损失 E_clip=${E_clip.toFixed(3)} (window=${p.x_window[0]}–${p.x_window[1]} vs full=${p.x_full[0]}–${p.x_full[1]})`,
    `双轴惩罚 E_dual=${E_dual.toFixed(3)} (${p.dual_axis ? '双轴' : '单轴'}${p.legend_mismatch ? '+图例错配' : ''}${p.palette_misleading ? '+误导色' : ''})`,
  ];
  return { E_zero, E_3d, E_clip, E_dual, total, explain };
}

export function computeErrorDrop(beforeParams, afterParams) {
  const b = estimateChartError(beforeParams);
  const a = estimateChartError(afterParams);
  const denom = Math.max(b.total, EPS);
  const delta = Math.max((b.total - a.total) / denom, 0);
  const points20 = Math.round(20 * Math.max(Math.min(delta, 1), 0));
  const explain = [
    `总误差前后: E_before=${b.total.toFixed(3)} → E_after=${a.total.toFixed(3)}`,
    `误差下降 Δ=${(delta * 100).toFixed(1)}% → 映射得分=${points20}/20`,
    '— Before —',
    ...b.explain,
    '— After —',
    ...a.explain,
  ];
  return { delta, percent: delta * 100, points20, before: b, after: a, explain };
}

export function explainRisks(params = {}) {
  const p = normalize(params);
  const notes = [];
  if (p.y_min > 0) notes.push(`Y轴未从零开始，差异被放大 (y_min=${p.y_min})`);
  if (p.use_3d) notes.push('3D效果引入侧面面积夸大，易误导');
  if (p.dual_axis) notes.push('双轴可能量纲不一致，需统一或显著区分');
  if (p.x_window && (p.x_window[1] - p.x_window[0]) < (p.x_full[1] - p.x_full[0])) notes.push('裁窗过窄，可能掩盖整体趋势');
  if (p.legend_mismatch) notes.push('图例与系列错配，读者易误解');
  if (p.palette_misleading) notes.push('颜色映射不友好或不一致，存在误导风险');
  return notes;
}
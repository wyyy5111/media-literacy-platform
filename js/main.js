/* 一眼真相：编辑闯关 - 主脚本（纯原生，无外部依赖） */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // 状态管理
  const state = {
    scores: {
      标题规范: 0,
      图表纠错: 0,
      事实链与引用: 0,
      伦理与AI标识: 0,
      谣言识别: 0,
    },
    name: '',
    hash: '',
  };

  // 导航与可达性
  function initTabs() {
    const tabs = $$('.tab');
    const panels = $$('.panel');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        const panel = $('#' + target);
        panel.classList.add('active');
        panel.focus();
      });
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const idx = tabs.indexOf(e.currentTarget);
          const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          tabs[next].focus();
        }
        if (e.key === 'Enter' || e.key === ' ') tab.click();
      });
    });
    $('#startBtn')?.addEventListener('click', () => {
      tabs.find((t) => t.dataset.target === 'stage1')?.click();
    });
  }

  // 主题切换
  function initTheme() {
    const themeBtn = $('#themeToggle');
    const contrastBtn = $('#contrastToggle');
    const root = document.body;
    themeBtn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      themeBtn.setAttribute('aria-pressed', String(isDark));
      persist();
    });
    contrastBtn.addEventListener('click', () => {
      const isContrast = root.classList.toggle('contrast');
      contrastBtn.setAttribute('aria-pressed', String(isContrast));
      persist();
    });
  }

  // 本地存储
  function persist() {
    const payload = {
      scores: state.scores,
      name: state.name,
      themeDark: document.body.classList.contains('dark'),
      themeContrast: document.body.classList.contains('contrast'),
    };
    try { localStorage.setItem('truth-edit-game', JSON.stringify(payload)); } catch {}
  }
  function restore() {
    try {
      const raw = localStorage.getItem('truth-edit-game');
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.themeDark) document.body.classList.add('dark');
      if (payload.themeContrast) document.body.classList.add('contrast');
      if (payload.name) $('#playerName').value = payload.name;
      if (payload.scores) {
        Object.assign(state.scores, payload.scores);
        renderScores();
        drawRadar($('#radar'), state.scores);
      }
    } catch {}
  }

  // 重置
  $('#resetProgress')?.addEventListener('click', () => {
    localStorage.removeItem('truth-edit-game');
    location.reload();
  });

  // 关卡一：标题规范评分
  function evalStage1() {
    let total = 0;
    ['t1', 't2', 't3'].forEach((name) => {
      const val = Number(($(`input[name="${name}"]:checked`)?.value || 0));
      total += val;
    });
    // 映射到 0-100
    state.scores['标题规范'] = Math.round((total / 3) * 100);
  }

  // 关卡二：图表纠错互动与评分
  const chartData = [10, 20, 12, 30, 18];
  function drawChart() {
    const cvs = $('#chartCanvas');
    const ctx = cvs.getContext('2d');
    const w = cvs.width, h = cvs.height;
    ctx.clearRect(0, 0, w, h);
    const zero = $('#optZero').checked;
    const label = $('#optLabel').checked;
    const sort = $('#optSort').checked;
    let data = [...chartData];
    if (sort) data.sort((a, b) => a - b);

    // 误导：不从零开始时放大差异
    const minY = zero ? 0 : Math.min(...data) - 8;
    const maxY = Math.max(...data);
    const padding = 40;
    const barW = (w - padding * 2) / data.length - 16;
    const scale = (h - padding * 2) / (maxY - minY);
    // 轴
    ctx.strokeStyle = '#777';
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    // 柱
    data.forEach((v, i) => {
      const x = padding + i * (barW + 16) + 8;
      const y = h - padding - (v - minY) * scale;
      const bh = (v - minY) * scale;
      ctx.fillStyle = sort ? '#2c7be5' : '#d9534f';
      ctx.fillRect(x, y, barW, bh);
      if (label) {
        ctx.fillStyle = '#333';
        ctx.font = '12px system-ui';
        ctx.fillText(String(v), x + barW / 2 - 8, y - 6);
      }
    });
    // 标签
    if (label) {
      ctx.fillStyle = '#333';
      ctx.font = '12px system-ui';
      ctx.fillText('单位：件', w - padding - 60, padding);
    }
  }
  $$('#optZero, #optLabel, #optSort').forEach((el) => el.addEventListener('change', drawChart));
  function evalStage2() {
    // 三个修正各给 33.4 分，满分 100
    const score = ($('#optZero').checked ? 33.4 : 0) + ($('#optLabel').checked ? 33.3 : 0) + ($('#optSort').checked ? 33.3 : 0);
    state.scores['图表纠错'] = Math.round(score);
  }

  // 关卡三：事实链与引用
  function evalStage3() {
    let total = 0;
    ['s1', 's2', 's3'].forEach((id) => {
      total += Number(($('#' + id).value || 0));
    });
    state.scores['事实链与引用'] = Math.round((total / 3) * 100);
  }

  // 关卡四：伦理与AI标识
  function evalStage4() {
    const opts = $$('.aiopt');
    let pos = 0, neg = 0;
    opts.forEach((o) => { if (o.checked) (o.value === '1' ? pos++ : neg++); });
    const base = Math.max(0, pos - neg);
    state.scores['伦理与AI标识'] = Math.round(Math.min(1, base / 3) * 100);
  }

  // 关卡五：谣言识别
  function evalStage5() {
    let total = 0;
    ['r1', 'r2', 'r3'].forEach((name) => {
      total += Number(($(`input[name="${name}"]:checked`)?.value || 0));
    });
    // 两个谣言+一个可信，正确选择可达满分
    state.scores['谣言识别'] = Math.round((total / 3) * 100);
  }

  // 汇总与渲染
  function renderScores() {
    const list = $('#scoreList');
    const entries = Object.entries(state.scores);
    const avg = Math.round(entries.reduce((a, [, v]) => a + v, 0) / entries.length);
    list.innerHTML = entries.map(([k, v]) => `<div>${k}：<strong>${v}</strong></div>`).join('') + `<hr /><div>综合分：<strong>${avg}</strong></div>`;
  }

  // 雷达图（Canvas 原生）
  function drawRadar(canvas, scores) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 24;
    const keys = Object.keys(scores);
    const n = keys.length;
    // 网格
    ctx.strokeStyle = '#999';
    for (let k = 1; k <= 4; k++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n;
        const rr = (r * k) / 4;
        const x = cx + rr * Math.cos(angle);
        const y = cy + rr * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    // 轴与标签
    ctx.fillStyle = '#333';
    ctx.font = '12px system-ui';
    keys.forEach((key, i) => {
      const angle = (Math.PI * 2 * i) / n;
      const x = cx + (r + 12) * Math.cos(angle);
      const y = cy + (r + 12) * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = '#bbb';
      ctx.stroke();
      ctx.fillText(key, x - 20, y);
    });
    // 数据面
    ctx.beginPath();
    keys.forEach((key, i) => {
      const val = scores[key] / 100;
      const angle = (Math.PI * 2 * i) / n;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(44, 123, 229, 0.35)';
    ctx.strokeStyle = '#2c7be5';
    ctx.fill();
    ctx.stroke();
  }

  // 哈希（优先使用 WebCrypto，回退到简易哈希）
  async function getHash(text) {
    const enc = new TextEncoder().encode(text);
    if (window.crypto?.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', enc);
      const arr = Array.from(new Uint8Array(buf));
      return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // djb2 回退
    let h = 5381;
    for (let i = 0; i < enc.length; i++) h = (h * 33) ^ enc[i];
    return (h >>> 0).toString(16);
  }

  // 导出：使用打印生成 PDF（一键式）
  function exportSummary() {
    const txt = Object.entries(state.scores).map(([k, v]) => `${k}：${v}`).join('；');
    $('#printSummaryText').textContent = `你的编辑力雷达：${txt}`;
    drawRadar($('#printRadar'), state.scores);
    document.body.classList.add('print-summary');
    window.print();
    setTimeout(() => document.body.classList.remove('print-summary'), 300);
  }
  function exportCertificate() {
    const name = state.name || '未署名';
    const date = new Date().toLocaleString();
    $('#certName').textContent = `姓名：${name}`;
    $('#certDate').textContent = `日期：${date}`;
    $('#certHash').textContent = `证书编号（哈希）：${state.hash}`;
    drawRadar($('#certRadar'), state.scores);
    document.body.classList.add('print-cert');
    window.print();
    setTimeout(() => document.body.classList.remove('print-cert'), 300);
  }

  // 事件绑定：提交评分与导出
  $$('[data-evaluate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-evaluate');
      switch (id) {
        case 'stage1': evalStage1(); break;
        case 'stage2': evalStage2(); break;
        case 'stage3': evalStage3(); break;
        case 'stage4': evalStage4(); break;
        case 'stage5': evalStage5(); break;
      }
      renderScores();
      drawRadar($('#radar'), state.scores);
      persist();
      alert('本关已提交，分数已更新。');
    });
  });

  // 姓名与哈希
  $('#playerName')?.addEventListener('input', async (e) => {
    state.name = e.target.value.trim();
    const raw = `${state.name}|${JSON.stringify(state.scores)}|${Date.now()}`;
    state.hash = await getHash(raw);
    $('#hashId').textContent = `证书编号（哈希）：${state.hash}`;
    persist();
  });

  // 导出按钮
  $('#exportSummary')?.addEventListener('click', exportSummary);
  $('#exportCertificate')?.addEventListener('click', exportCertificate);

  // 初始挂载
  initTabs();
  initTheme();
  restore();
  drawChart();
})();
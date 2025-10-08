import { qs, qsa } from '../utils.js';
import { getDict, formatNumber } from '../i18n.js';
import { computeRadar } from '../scoring.js';
import { getLanguage } from '../levels.engine.js';

export function routeTo(id) {
  qsa('.panel').forEach(p => {
    const show = p.id === id;
    p.classList.toggle('active', show);
    if ('hidden' in p) p.hidden = !show;
    if (show) {
      if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '-1');
      try { p.focus({ preventScroll: true }); } catch {}
    }
  });
  qsa('.tab').forEach(t => t.classList.toggle('active', t.dataset.target === id));
}

export function renderLevelGrid(levels, lang) {
  const grid = qs('#levelGrid');
  grid.innerHTML = '';
  levels.forEach(l => {
    const card = document.createElement('div');
    card.className = 'level-card';
    const title = typeof l.title === 'object' ? (lang === 'en' ? l.title.en : l.title.cn) : l.title;
    const meta = `类别：${l.category} · #${l.idx}`;
    card.innerHTML = `
      <h4>${title}</h4>
      <div class="level-meta">${meta}</div>
      <div class="level-actions"><button class="btn" data-enter="${l.idx}">进入</button></div>
    `;
    grid.appendChild(card);
  });
}

export function renderQuestion(Q) {
  if (!Q) return;
  const lang = getLanguage();
  const title = Q.title?.[lang] || Q.title;
  const prompt = Q.prompt?.[lang] || Q.prompt;
  if (Q.category === 'title') {
    qs('#q1_title').textContent = title;
    qs('#q1_prompt').textContent = prompt;
    qs('#q1_options').innerHTML = Q.options.map((o, i) => `<label><input type="radio" name="title_pick" value="${i}">${o}</label>`).join('');
  } else if (Q.category === 'chart') {
    qs('#q2_title').textContent = title;
    qs('#q2_prompt').textContent = prompt;
    // chart rendering is handled by another function
  } else if (Q.category === 'source') {
    qs('#q3_title').textContent = title;
    qs('#q3_prompt').textContent = prompt;
    qs('#q3_slots').innerHTML = Q.slots.map(s => `<label>${s}: <input name="${s}" placeholder="..."></label>`).join('');
  } else if (Q.category === 'ethics') {
    qs('#q4_title').textContent = title;
    qs('#q4_prompt').textContent = prompt;
    qs('#q4_options').innerHTML = Q.options.map(o => `<label><input type="checkbox" id="eth_${o.id}">${o.text}</label>`).join('');
  } else if (Q.category === 'rumor') {
    qs('#q5_title').textContent = title;
    qs('#q5_prompt').textContent = prompt;
    qs('#q5_text').innerHTML = Q.material.map(p => `<p>${p}</p>`).join('');
  }
}

export function updateProgress(scores) {
  const total = 5;
  const done = Object.values(scores).filter(v => typeof v === 'number' && v > 0).length;
  const pct = Math.round((done / total) * 100);
  const bar = qs('#progressBar');
  if (bar) {
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
  }
}

export function updateAchievements(achievements, lang) {
  const list = qs('#achievementsList');
  const badges = achievements.getBadges();
  const d = getDict();
  list.innerHTML = badges.length ? badges.map(t => `<li>🏅 ${t}</li>`).join('') : `<li class="muted">${(d.noBadges?.[lang]) || d.noBadges.cn}</li>`;
}

export function renderScoreList(scores, lang) {
  const wrap = qs('#scoreList');
  const map = [
    [lang === 'en' ? 'Neutrality (Title)' : '中立度(标题)', scores.stage1 || 0],
    [lang === 'en' ? 'Chart Fix' : '图表修正', scores.stage2 || 0],
    [lang === 'en' ? 'Fact Chain' : '事实链', scores.stage3 || 0],
    [lang === 'en' ? 'Ethics & AI' : '伦理与AI', scores.stage4 || 0],
    [lang === 'en' ? 'Rumor Check' : '谣言识别', scores.stage5 || 0],
  ];
  wrap.innerHTML = map
    .map(([k, v]) => `<div class="score-item"><span>${k}</span><strong>${formatNumber(v, lang)}</strong></div>`)
    .join('') + `<div class="score-item"><span>${lang === 'en' ? 'Weighted Overall' : '综合加权'}</span><strong>${formatNumber(computeRadar(scores).overall, lang)}</strong></div>`;
}

export function drawRadar(scores) {
  const cvs = qs('#radar');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const w = cvs.width, h = cvs.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 20;
  const axes = [scores.stage1 || 0, scores.stage2 || 0, scores.stage3 || 0, scores.stage4 || 0];
  const labels = ['中立度', '图表修正', '事实链', '伦理'];
  const n = axes.length;

  // grid
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

  // labels
  ctx.fillStyle = '#8aa';
  ctx.font = '12px system-ui';
  labels.forEach((lb, i) => {
    const a = (Math.PI * 2 * i) / n;
    const x = cx + (r + 10) * Math.cos(a);
    const y = cy + (r + 10) * Math.sin(a);
    ctx.fillText(lb, x - 16, y);
  });

  // polygon
  ctx.beginPath();
  ctx.strokeStyle = '#4ea1ff';
  ctx.fillStyle = 'rgba(78,161,255,.2)';
  axes.forEach((val, i) => {
    const a = (Math.PI * 2 * i) / n;
    const rr = (val / 100) * r;
    const x = cx + rr * Math.cos(a);
    const y = cy + rr * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function showFeedback(ok, msgCN = '', msgEN = '', lang) {
  const toast = document.createElement('div');
  toast.className = `feedback-toast ${ok ? 'ok' : 'bad'}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  const txtCN = ok ? `🎉 太棒了！答对啦${msgCN ? ' · ' + msgCN : ''}` : `😿 再想想～${msgCN ? ' · ' + msgCN : ''}`;
  const txtEN = ok ? `🎉 Nice! Correct${msgEN ? ' · ' + msgEN : ''}` : `😿 Try again${msgEN ? ' · ' + msgEN : ''}`;
  toast.textContent = lang === 'en' ? txtEN : txtCN;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 280);
  }, 1600);
}
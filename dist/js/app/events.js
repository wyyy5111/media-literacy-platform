import { qs, qsa } from '../utils.js';
import { state, saveState, resetState } from './state.js';
import { routeTo, renderLevelGrid, renderScoreList, updateProgress, updateAchievements, drawRadar, showFeedback } from './ui.js';
import { generateLevels, setLanguage } from '../levels.engine.js';
import { scoreTitle, scoreChart, scoreSource, scoreEthics, computeRadar } from '../scoring.js';
import { ReportMaker } from '../report.maker.js';
import { Ledger } from '../ledger.hash.js';
import { Store } from '../store.local.js';
import { applyLocale } from '../i18n.js';
import { PerfMonitor } from '../perf.monitor.js';
import { Achievements } from '../achievements.js';

function advanceFlow(stage, ok) {
  if (!state.flow) return routeTo(stage);
  if (ok) state.flow.correct += 1;
  if (state.flow.idx + 1 < state.flow.subs.length) {
    state.flow.idx += 1;
    renderQuestion(state.flow.subs[state.flow.idx]);
  } else {
    // 检查是否完成了所有关卡
    const completedStages = Object.keys(state.scores).filter(key => 
      key.startsWith('stage') && !key.includes('Synth') && !key.includes('Egg') && state.scores[key] > 0
    ).length;
    
    if (completedStages >= 5) { // 假设有5个主要关卡
       // 所有关卡完成，跳转到最终报告
       Achievements.award('全部完成');
       showFeedback(true, '恭喜！您已完成所有题目，正在生成最终报告...', 'Congratulations! All questions completed, generating final report...', state.lang);
       setTimeout(() => {
         generateFinalReport(state.scores);
         routeTo('finalReport');
       }, 1500);
     } else {
      // 单个关卡完成，返回关卡选择
      Achievements.award('关卡胜利');
      showFeedback(true, '本关完成，徽章已解锁', 'Level completed, badge unlocked', state.lang);
      setTimeout(() => routeTo('levelSelect'), 1500);
    }
  }
}

function makeSubFlow(level) {
  if (!level.subs) return null;
  return {
    idx: 0,
    correct: 0,
    subs: level.subs.map(s => ({ ...s, parent: level })),
  };
}

export function bindEvents() {
  qsa('.tab').forEach(btn => {
    btn.addEventListener('click', () => routeTo(btn.dataset.target));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        routeTo(btn.dataset.target);
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const tabs = qsa('.tab');
        const idx = tabs.indexOf(btn);
        const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
      }
    });
  });

  qs('#startBtn')?.addEventListener('click', () => routeTo('difficulty'));
  qsa('.diff').forEach(b => b.addEventListener('click', () => {
    state.diff = b.dataset.diff;
    saveState();
    renderLevelGrid(state.levels, state.lang);
    routeTo('levelSelect');
  }));

  qs('#levelGrid')?.addEventListener('click', e => {
    const t = e.target.closest('[data-enter]');
    if (!t) return;
    const idx = Number(t.dataset.enter) - 1;
    state.currentLevel = state.levels[idx];
    state.flow = makeSubFlow(state.currentLevel);
    const target = state.currentLevel?.stageId || 'summary';
    
    // 使用真实题库系统
    if (window.questionBank && window.questionHandler) {
      const category = state.currentLevel?.category;
      if (category) {
        const question = window.questionBank.generateQuestion(category, 1);
        window.questionHandler.renderRealQuestion(question, target);
        routeTo(target);
        return;
      }
    }
    
    // 回退到原有系统
    if (!qs(`#${target}`)) {
      qs('#summaryContent').innerHTML = `<p class="muted">舞台未定义，暂以回合总结展示：${target}</p>`;
      routeTo('summary');
    } else {
      renderQuestion(state.flow.subs[state.flow.idx]);
      routeTo(target);
    }
  });

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-evaluate]');
    if (!b) return;
    PerfMonitor.mark('inter_start');
    const stage = b.dataset.evaluate;
    let score = 0;
    let isCorrect = false;
    const Q = state.flow?.subs?.[state.flow?.idx] || state.currentLevel;
    if (Q) {
      const cat = Q.category || state.currentLevel?.category;
      if (cat === 'title') {
        const pickIdx = Number(qs('input[name=title_pick]:checked')?.value || -1);
        const pickedTitle = Q.options?.[pickIdx] || '';
        const originalTitle = Q.material || '';
        const out = scoreTitle({ pickedTitle, originalTitle });
        score = out.score;
        state.scores.stage1 = Math.round(score);
        state.scores.explain1 = out.explain;
        Achievements.recordTitle(state.scores.stage1);
        isCorrect = Array.isArray(Q.good) ? Q.good.includes(pickIdx) : state.scores.stage1 >= 60;
      } else if (cat === 'chart') {
        const fixes = {
          zero: !!qs('#fix_zero')?.checked,
          no3d: !!qs('#fix_no3d')?.checked,
          single_axis: !!qs('#fix_single_axis')?.checked,
          extend: !!qs('#fix_extend')?.checked,
        };
        const errDropPct = Number(qs('#errDrop')?.value || 0);
        const out = scoreChart({ fixes, errDropPct });
        score = out.score;
        state.scores.stage2 = score;
        state.scores.explain2 = out.explain;
        Achievements.recordChart(fixes, state.scores.stage2);
        isCorrect = state.scores.stage2 >= 60;
      } else if (cat === 'source') {
        const inputs = qsa('#sourceSlots input');
        const slots = {};
        inputs.forEach(i => { const k = i.name || i.placeholder || 'slot'; slots[k] = i.value || ''; });
        const out = scoreSource({ slots });
        score = out.score;
        state.scores.stage3 = score;
        state.scores.explain3 = out.explain;
        Achievements.recordSource(state.scores.stage3);
        isCorrect = state.scores.stage3 >= 60;
      } else if (cat === 'ethics') {
        const req = Q.required || [];
        const requiredPicked = req.filter(k => qs(`#eth_${k}`)?.checked);
        const bannedPicked = ['no_label', 'ai_real_person'].filter(k => qs(`#eth_${k}`)?.checked);
        const out = scoreEthics({ requiredPicked, bannedPicked });
        score = out.score;
        state.scores.stage4 = score;
        state.scores.explain4 = out.explain;
        Achievements.recordEthics(requiredPicked, bannedPicked);
        isCorrect = state.scores.stage4 >= 30 && bannedPicked.length === 0;
      } else if (cat === 'rumor') {
        const items = qsa('#rumorList input');
        const marked = items.filter(i => i.checked).map((i, idx) => idx);
        score = marked.length >= 2 ? 90 : 40;
        state.scores.stage5 = score;
        isCorrect = marked.length >= 2;
      } else if (cat === 'synthesis' || stage === 'synthesis') {
        const dims = [state.scores.stage1 || 0, state.scores.stage2 || 0, state.scores.stage3 || 0, state.scores.stage4 || 0];
        const avg = Math.round(dims.reduce((a, c) => a + c, 0) / Math.max(dims.length, 1));
        score = avg > 60 ? avg : 60;
        state.scores.stageSynth = score;
        isCorrect = score >= 60;
      } else if (cat === 'egg' || stage === 'egg') {
        const items = qsa('#eggChecks input');
        const done = items.filter(i => i.checked).length;
        score = Math.round((done / Math.max(items.length, 1)) * 100);
        state.scores.stageEgg = score;
        Achievements.recordEgg(state.scores.stageEgg);
        isCorrect = state.scores.stageEgg >= 60;
      }
    }
    saveState();
    renderScoreList(state.scores, state.lang);
    updateProgress(state.scores);
    updateAchievements(Achievements, state.lang);
    drawRadar(state.scores);
    showFeedback(isCorrect, '', '', state.lang);
    setTimeout(() => advanceFlow(stage, isCorrect), 900);
    PerfMonitor.mark('inter_end');
    PerfMonitor.reportInteraction(50, `interaction:${stage}`);
  });

  qs('#backToSelect')?.addEventListener('click', () => routeTo('levelSelect'));

  const themeToggle = qs('#themeToggle');
  const contrastToggle = qs('#contrastToggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('dark', state.theme === 'dark');
      saveState();
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('click', (e) => {
      e.preventDefault();
      state.contrast = state.contrast ? 0 : 1;
      document.body.classList.toggle('contrast', !!state.contrast);
      saveState();
    });
  }

  const root = document.documentElement;
  const getScale = () => Number(localStorage.getItem('fontScale') || '1');
  const applyScale = (s) => {
    const clamped = Math.max(0.8, Math.min(1.6, s));
    root.style.fontSize = `${clamped * 100}%`;
    localStorage.setItem('fontScale', String(clamped));
  };
  applyScale(getScale());

  const fontInc = qs('#fontInc');
  const fontDec = qs('#fontDec');
  const resetProgress = qs('#resetProgress');

  if (fontInc) {
    fontInc.addEventListener('click', (e) => {
      e.preventDefault();
      applyScale(getScale() + 0.1);
    });
  }

  if (fontDec) {
    fontDec.addEventListener('click', (e) => {
      e.preventDefault();
      applyScale(getScale() - 0.1);
    });
  }

  if (resetProgress) {
    resetProgress.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('确定要重置所有进度吗？')) {
        resetState();
        renderScoreList(state.scores, state.lang);
        updateProgress(state.scores);
        updateAchievements(Achievements, state.lang);
        drawRadar(state.scores);
        routeTo('intro');
      }
    });
  }



  qs('#langToggle')?.addEventListener('click', async () => {
    state.lang = state.lang === 'cn' ? 'en' : 'cn';
    setLanguage(state.lang);
    saveState();
    state.levels = await generateLevels(state.diff, 'seed-' + state.diff);
    renderLevelGrid(state.levels, state.lang);
    applyLocale(state.lang);
  });

  qs('#playerName')?.addEventListener('input', async (e) => {
    const v = e.target.value.trim();
    const overall = computeRadar(state.scores).overall;
    const ts = Date.now();
    const id8 = await Ledger.hex8(v, ts, overall);
    qs('#hashId').textContent = v ? `${state.lang === 'en' ? 'Certificate ID' : '证书编号'}：${id8}${state.lang === 'en' ? ' (based on name+time+score)' : '（基于姓名+时间+总分）'}` : '';
  });

  const exportSummary = qs('#exportSummary');
  const exportCertificate = qs('#exportCertificate');
  const exportZip = qs('#exportZip');

  if (exportSummary) {
    exportSummary.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = qs('#playerName')?.value?.trim() || '';
      const overall = computeRadar(state.scores).overall;
      const ts = Date.now();
      const id8 = await Ledger.hex8(name, ts, overall);
      try { await Store.addExportRecord({ kind: 'print', id8, name, overall, ts }); } catch {}
      ReportMaker.exportSummary({
        '中立度(标题)': state.scores.stage1 || 0,
        '图表修正': state.scores.stage2 || 0,
        '事实链': state.scores.stage3 || 0,
        '伦理与AI': state.scores.stage4 || 0,
      });
    });
  }

  if (exportCertificate) {
    exportCertificate.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = qs('#playerName')?.value?.trim() || '';
      const overall = computeRadar(state.scores).overall;
      const ts = Date.now();
      const full = await Ledger.hash(`${name}|${ts}|${overall}`);
      const id8 = String(full).slice(0, 8);
      try { await Store.addExportRecord({ kind: 'cert', id8, hash: full, name, overall, ts }); } catch {}
      ReportMaker.exportCertificate(name, {
        '中立度(标题)': state.scores.stage1 || 0,
        '图表修正': state.scores.stage2 || 0,
        '事实链': state.scores.stage3 || 0,
        '伦理与AI': state.scores.stage4 || 0,
      }, `${id8}`);
    });
  }

  if (exportZip) {
    exportZip.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = qs('#playerName')?.value?.trim() || '';
      const res = await ReportMaker.exportZip(name, {
        '中立度(标题)': state.scores.stage1 || 0,
        '图表修正': state.scores.stage2 || 0,
        '事实链': state.scores.stage3 || 0,
        '伦理与AI': state.scores.stage4 || 0,
      });
      if (res?.fallback) {
        showFeedback(false, '未检测到压缩库，已分别导出两个文件', 'JSZip missing, exported two files separately', state.lang);
      }
    });
  }

  qs('#analyticsBtn')?.addEventListener('click', () => {
    if (window.showAnalytics) window.showAnalytics();
    else alert('分析模块加载中...');
  });

  qs('#aiAssistantBtn')?.addEventListener('click', () => {
    if (window.toggleAIAssistant) window.toggleAIAssistant();
    else alert('AI助手模块加载中...');
  });

  qs('#recommendBtn')?.addEventListener('click', () => {
    if (window.showRecommendations) window.showRecommendations();
    else alert('推荐模块加载中...');
  });

  // 最终报告页面事件处理
  qs('#viewDetailedResults')?.addEventListener('click', () => {
    routeTo('results');
  });

  qs('#restartQuiz')?.addEventListener('click', () => {
    if (confirm('确定要重新开始吗？这将清除所有进度。')) {
      resetState();
      routeTo('intro');
    }
  });

  qs('#exportFinalReport')?.addEventListener('click', async () => {
    const name = qs('#playerName')?.value?.trim() || '匿名用户';
    const overall = computeRadar(state.scores).overall;
    const ts = Date.now();
    const id8 = await Ledger.hex8(name, ts, overall);
    try { 
      await Store.addExportRecord({ kind: 'final_report', id8, name, overall, ts }); 
    } catch {}
    
    // 生成最终报告PDF
    ReportMaker.exportFinalReport(name, {
      '中立度(标题)': state.scores.stage1 || 0,
      '图表修正': state.scores.stage2 || 0,
      '事实链': state.scores.stage3 || 0,
      '伦理与AI': state.scores.stage4 || 0,
      '综合评估': state.scores.stageSynth || 0,
    }, generateRecommendations(state.scores));
  });

  qsa('button, [role="button"], .btn').forEach(el => {
    const lbl = el.getAttribute('aria-label');
    if (!lbl || !lbl.trim()) {
      const txt = (el.textContent || '').trim();
      if (txt) el.setAttribute('aria-label', txt);
    }
  });
}

// 生成最终报告数据
export function generateFinalReport(scores) {
  const overallScore = Math.round((
    (scores.stage1 || 0) + 
    (scores.stage2 || 0) + 
    (scores.stage3 || 0) + 
    (scores.stage4 || 0) + 
    (scores.stageSynth || 0)
  ) / 5);

  // 更新页面元素
  const finalScoreValue = qs('#finalScoreValue');
  const performanceLevel = qs('#performanceLevel');
  const scoreBreakdown = qs('#scoreBreakdown');
  const recommendationList = qs('#recommendationList');

  if (finalScoreValue) {
    finalScoreValue.textContent = overallScore;
  }

  if (performanceLevel) {
    let level = '需要改进';
    let levelClass = 'poor';
    if (overallScore >= 90) {
      level = '优秀';
      levelClass = 'excellent';
    } else if (overallScore >= 80) {
      level = '良好';
      levelClass = 'good';
    } else if (overallScore >= 70) {
      level = '中等';
      levelClass = 'average';
    }
    performanceLevel.textContent = level;
    performanceLevel.className = `performance-level ${levelClass}`;
  }

  if (scoreBreakdown) {
    const scoreItems = [
      { name: '中立度(标题)', score: scores.stage1 || 0 },
      { name: '图表修正', score: scores.stage2 || 0 },
      { name: '事实链', score: scores.stage3 || 0 },
      { name: '伦理与AI', score: scores.stage4 || 0 },
      { name: '综合评估', score: scores.stageSynth || 0 }
    ];

    scoreBreakdown.innerHTML = scoreItems.map(item => `
      <div class="score-item">
        <span class="score-name">${item.name}</span>
        <span class="score-value-small">${item.score}分</span>
      </div>
    `).join('');
  }

  if (recommendationList) {
    const recommendations = generateRecommendations(scores);
    recommendationList.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item">${rec}</div>
    `).join('');
  }
}

// 跳过当前题目的函数
window.skipQuestion = function() {
  if (confirm('确定要跳过当前题目吗？')) {
    // 跳过当前题目，不计分
    const stage = state.currentLevel?.stageId || 'summary';
    showFeedback(false, '已跳过当前题目', 'Question skipped', state.lang);
    setTimeout(() => advanceFlow(stage, false), 900);
  }
};

// 生成个性化建议
function generateRecommendations(scores) {
  const recommendations = [];
  
  if ((scores.stage1 || 0) < 70) {
    recommendations.push('建议加强对新闻标题中立性的判断能力，多关注标题中的情感色彩和倾向性词汇。');
  }
  
  if ((scores.stage2 || 0) < 70) {
    recommendations.push('建议提高图表数据解读能力，学习识别图表中的误导性表达和数据操作。');
  }
  
  if ((scores.stage3 || 0) < 70) {
    recommendations.push('建议增强事实核查能力，学会追溯信息来源，建立完整的事实链条。');
  }
  
  if ((scores.stage4 || 0) < 70) {
    recommendations.push('建议深入了解AI伦理相关知识，提高对AI生成内容的识别和评估能力。');
  }
  
  if ((scores.stageSynth || 0) < 70) {
    recommendations.push('建议加强综合分析能力，学会将多个维度的信息整合，形成全面的判断。');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('您的表现非常优秀！建议继续保持批判性思维，持续关注媒体素养的最新发展。');
    recommendations.push('可以尝试帮助他人提高媒体素养，分享您的经验和见解。');
  }
  
  return recommendations;
}
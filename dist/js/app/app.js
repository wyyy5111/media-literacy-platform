import { state } from './state.js';
import { generateLevels, setLanguage } from '../levels.engine.js';
import { applyLocale } from '../i18n.js';
import { renderLevelGrid, renderScoreList, updateProgress, updateAchievements, drawRadar, showFeedback } from './ui.js';
import { bindEvents } from './events.js';
import { Store } from '../store.local.js';
import { Achievements } from '../achievements.js';
import { PerfMonitor } from '../perf.monitor.js';

async function loadLevels() {
  state.levels = await generateLevels(state.diff, 'seed-' + state.diff);
}

function initAdvancedFeatures() {
  // This function can be expanded to initialize advanced features
}

function showLoadingState() {
  const loadingEl = document.createElement('div');
  loadingEl.id = 'app-loading';
  loadingEl.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(255,255,255,0.9); display: flex; align-items: center; 
                justify-content: center; z-index: 9999; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; 
                    border-top: 4px solid #007bff; border-radius: 50%; 
                    animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <p>正在加载媒体素养教育平台...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(loadingEl);
}

function hideLoadingState() {
  const loadingEl = document.getElementById('app-loading');
  if (loadingEl) {
    loadingEl.style.opacity = '0';
    loadingEl.style.transition = 'opacity 0.3s ease';
    setTimeout(() => loadingEl.remove(), 300);
  }
}

export async function init() {
  try {
    showLoadingState();
    PerfMonitor.mark('app_start');

    setLanguage(state.lang);
    await loadLevels();
    applyLocale(state.lang);
    renderLevelGrid(state.levels, state.lang);
    renderScoreList(state.scores, state.lang);
    updateProgress(state.scores);
    Achievements.load();
    updateAchievements(Achievements, state.lang);
    drawRadar(state.scores);
    bindEvents();

    try { await Store.initDB(); } catch {}

    initAdvancedFeatures();

    PerfMonitor.mark('app_interactive');
    PerfMonitor.reportTTI(1500);

    hideLoadingState();

    setTimeout(() => {
      showFeedback(true, '应用加载完成！', 'App loaded successfully!', state.lang);
    }, 500);

  } catch (error) {
    console.error('应用初始化失败:', error);
    hideLoadingState();

    const errorEl = document.createElement('div');
    errorEl.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                  background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px;
                  border: 1px solid #f5c6cb; max-width: 400px; text-align: center; z-index: 10000;">
        <h3>应用加载失败</h3>
        <p>请刷新页面重试，或检查网络连接。</p>
        <button onclick="location.reload()" style="background: #dc3545; color: white; 
                border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          刷新页面
        </button>
      </div>
    `;
    document.body.appendChild(errorEl);
  }
}
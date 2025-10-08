const dict = {
  appTitle: { cn: '一眼真相：编辑闯关', en: 'Truth at a Glance: Editor Quest' },
  tabIntro: { cn: '首页', en: 'Home' },
  tabDifficulty: { cn: '难度', en: 'Difficulty' },
  tabLevelSelect: { cn: '关卡选择', en: 'Levels' },
  tabResults: { cn: '通关面板', en: 'Results' },

  introTitle: { cn: '作品简介', en: 'Introduction' },
  introDesc: { cn: '通过五个互动关卡训练并评估编辑素养：标题规范、图表纠错、事实链与引用、伦理与AI标识、谣言识别。完全离线，支持键盘与高对比度。', en: 'Train and assess editorial skills via five interactive stages: title hygiene, chart fixing, citation chain, ethics & AI labels, rumor checks. Offline, keyboard and high-contrast supported.' },
  introStart: { cn: '开始闯关', en: 'Start' },

  difficultyTitle: { cn: '选择难度', en: 'Choose Difficulty' },
  difficultyNewbie: { cn: '新手', en: 'Newbie' },
  difficultyAdvanced: { cn: '进阶', en: 'Advanced' },
  difficultyMaster: { cn: '大师', en: 'Master' },
  difficultyDesc: { cn: '难度影响题目数量、提示强度与评估阈值。', en: 'Difficulty affects item count, hint strength, and thresholds.' },

  levelSelectTitle: { cn: '选择关卡', en: 'Select Level' },
  materialTitle: { cn: '素材区', en: 'Material' },
  stage2RightTitle: { cn: '关卡二：图表纠错', en: 'Stage 2: Chart Fix' },

  achievementsTitle: { cn: '成就', en: 'Achievements' },
  btnThemeToggle: { cn: '深/浅', en: 'Light/Dark' },
  btnContrastToggle: { cn: '高对比', en: 'High Contrast' },
  btnFontInc: { cn: 'A+', en: 'A+' },
  btnFontDec: { cn: 'A-', en: 'A-' },
  btnLangToggle: { cn: '中/EN', en: 'CN/EN' },
  btnReset: { cn: '重置', en: 'Reset' },
  btnHelp: { cn: '帮助', en: 'Help' },
  btnInstall: { cn: '安装到桌面', en: 'Install App' },
  backToSelect: { cn: '返回关卡选择', en: 'Back to Levels' },
  summaryTitle: { cn: '回合总结', en: 'Round Summary' },
  summaryHint: { cn: '提示：分数≥80视为达标，可在“通关面板”查看整体表现。', en: 'Hint: Score ≥80 is passing; check Results for overall performance.' },
  noBadges: { cn: '暂无徽章，继续闯关吧！', en: 'No badges yet — keep going!' }
};

export function applyLocale(locale = 'cn') {
  const lang = locale === 'en' ? 'en' : 'cn';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const entry = dict[key];
    if (!entry) return;
    el.textContent = entry[lang] || entry.cn || '';
  });
}

export function getDict() { return dict; }

// 日期与数字国际化
export function formatDateISO(date = new Date()){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

export function formatNumber(num, locale='cn'){
  const lc = locale==='en' ? 'en-US' : 'zh-CN';
  try { return new Intl.NumberFormat(lc, { maximumFractionDigits: 0 }).format(Number(num||0)); } catch { return String(Math.round(num||0)); }
}
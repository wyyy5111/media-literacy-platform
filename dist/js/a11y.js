// 可访问性增强（键盘/ARIA/对比度 & 主题切换）
// 主题与对比度切换
export function initTheme() {
  const themeBtn = document.querySelector('#themeToggle');
  const contrastBtn = document.querySelector('#contrastToggle');
  const root = document.body;
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    themeBtn.setAttribute('aria-pressed', String(isDark));
  });
  if (contrastBtn) contrastBtn.addEventListener('click', () => {
    const isContrast = root.classList.toggle('contrast');
    contrastBtn.setAttribute('aria-pressed', String(isContrast));
  });
}

// 键盘可玩与字体缩放
export function initA11y() {
  // 1) 为可点击元素补充 aria-label（若缺失）
  document.querySelectorAll('button, [role="button"], .btn').forEach(el => {
    const hasLabel = el.getAttribute('aria-label');
    if (!hasLabel || !hasLabel.trim()) {
      const text = (el.textContent || '').trim();
      if (text) el.setAttribute('aria-label', text);
    }
  });

  // 2) 键盘触发：Space/Enter 等同 click
  document.addEventListener('keydown', (e) => {
    const el = document.activeElement;
    if (!el) return;
    const isBtn = el.matches('button, [role="button"], .btn');
    if (!isBtn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });

  // 3) Tab 页签：左右方向键在 .tab 之间移动
  const tabs = Array.from(document.querySelectorAll('.tab'));
  tabs.forEach((tab, idx) => {
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
      }
    });
  });

  // 4) 字体缩放：A+/A- 控件
  const inc = document.querySelector('#fontInc');
  const dec = document.querySelector('#fontDec');
  const root = document.documentElement;
  const getScale = () => Number(localStorage.getItem('fontScale') || '1');
  const applyScale = (s) => {
    const clamped = Math.max(0.8, Math.min(1.6, s));
    root.style.fontSize = `${clamped * 100}%`;
    localStorage.setItem('fontScale', String(clamped));
  };
  applyScale(getScale());
  if (inc) inc.addEventListener('click', () => applyScale(getScale() + 0.1));
  if (dec) dec.addEventListener('click', () => applyScale(getScale() - 0.1));
}
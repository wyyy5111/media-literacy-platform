/**
 * 布局切换功能
 * 支持单栏和双栏布局之间的切换
 */

class LayoutToggle {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // 获取布局切换按钮
    this.toggleButton = document.getElementById('layoutToggle');
    if (!this.toggleButton) return;

    // 获取当前布局状态
    this.isSingleColumn = localStorage.getItem('layoutMode') === 'single' || false;
    
    // 绑定事件
    this.toggleButton.addEventListener('click', () => this.toggleLayout());
    
    // 应用初始布局
    this.applyLayout();
    
    this.isInitialized = true;
  }

  toggleLayout() {
    this.isSingleColumn = !this.isSingleColumn;
    this.applyLayout();
    
    // 保存布局状态
    localStorage.setItem('layoutMode', this.isSingleColumn ? 'single' : 'double');
    
    // 更新按钮状态
    this.updateButtonState();
  }

  applyLayout() {
    const body = document.body;
    
    if (this.isSingleColumn) {
      body.classList.add('single-column-layout');
    } else {
      body.classList.remove('single-column-layout');
    }
    
    this.updateButtonState();
  }

  updateButtonState() {
    if (!this.toggleButton) return;
    
    if (this.isSingleColumn) {
      this.toggleButton.textContent = '📋';
      this.toggleButton.title = '切换到双栏布局';
      this.toggleButton.setAttribute('aria-label', '切换到双栏布局');
    } else {
      this.toggleButton.textContent = '📱';
      this.toggleButton.title = '切换到单栏布局';
      this.toggleButton.setAttribute('aria-label', '切换到单栏布局');
    }
  }

  // 响应式处理
  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // 移动端强制使用单栏布局
      document.body.classList.add('single-column-layout');
      if (this.toggleButton) {
        this.toggleButton.style.display = 'none';
      }
    } else {
      // 桌面端恢复用户选择的布局
      this.applyLayout();
      if (this.toggleButton) {
        this.toggleButton.style.display = '';
      }
    }
  }
}

// 初始化布局切换功能
document.addEventListener('DOMContentLoaded', () => {
  const layoutToggle = new LayoutToggle();
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    layoutToggle.handleResize();
  });
  
  // 初始检查
  layoutToggle.handleResize();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LayoutToggle;
}
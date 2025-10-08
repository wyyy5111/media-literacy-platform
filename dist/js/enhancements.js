// 现代化交互增强脚本 - 国家一等奖水准
// 提供流畅的动画、微交互和用户体验优化

class InteractionEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothTransitions();
        this.setupMicroInteractions();
        this.setupLoadingStates();
        this.setupKeyboardNavigation();
        this.setupTouchOptimizations();
        this.setupPerformanceMonitoring();
    }

    // 平滑过渡效果
    setupSmoothTransitions() {
        // 页面切换动画
        this.observeTabChanges();
        
        // 滚动平滑
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // 元素进入视口动画
        this.setupIntersectionObserver();
    }

    observeTabChanges() {
        // 与主路由保持一致：使用 .tab 与 data-target
        const tabs = document.querySelectorAll('.tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                const current = document.querySelector('.panel.active');
                const targetSection = targetId ? document.getElementById(targetId) : null;
                
                // 仅进行过渡动画，不改变显示逻辑（由 app.js 控制）
                if (current) {
                    current.style.transition = 'opacity .28s ease, transform .28s ease';
                    current.style.opacity = '0';
                    current.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        current.style.opacity = '';
                        current.style.transform = '';
                    }, 320);
                }
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.style.transition = 'opacity .28s ease, transform .28s ease';
                        targetSection.style.opacity = '0';
                        targetSection.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            targetSection.style.opacity = '1';
                            targetSection.style.transform = 'translateY(0)';
                            setTimeout(() => {
                                targetSection.style.opacity = '';
                                targetSection.style.transform = '';
                            }, 320);
                        });
                    }, 60);
                }
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.6s ease-out';
                }
            });
        }, { threshold: 0.1 });

        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.diff, .level-card, .question, .score-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // 微交互效果
    setupMicroInteractions() {
        this.setupButtonHoverEffects();
        this.setupFormInteractions();
        this.setupProgressAnimations();
    }

    setupButtonHoverEffects() {
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            // 鼠标悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '';
            });
            
            // 点击效果
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(1px)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px)';
            });
        });
    }

    setupFormInteractions() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
                input.parentElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = '';
                input.parentElement.style.boxShadow = '';
            });
        });
    }

    setupProgressAnimations() {
        // 进度条动画
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = bar.style.width || '0%';
                        bar.style.width = '0%';
                        
                        setTimeout(() => {
                            bar.style.transition = 'width 1.5s ease-out';
                            bar.style.width = width;
                        }, 200);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    }

    // 加载状态管理
    setupLoadingStates() {
        this.setupButtonLoading();
        this.setupContentLoading();
    }

    setupButtonLoading() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-loading]');
            if (button) {
                const originalText = button.textContent;
                button.innerHTML = '<div class="loading-spinner"></div>处理中...';
                button.disabled = true;
                
                // 模拟加载完成（实际应用中应根据异步操作完成）
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }
        });
    }

    setupContentLoading() {
        // 内容加载骨架屏
        this.createSkeletonLoader();
    }

    createSkeletonLoader() {
        const skeletonStyles = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .dark .skeleton {
                background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = skeletonStyles;
        document.head.appendChild(style);
    }

    // 键盘导航增强
    setupKeyboardNavigation() {
        this.setupTabNavigation();
        this.setupQuickAccess();
    }

    setupTabNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // 添加焦点指示器
                const focusedElement = document.activeElement;
                if (focusedElement) {
                    focusedElement.style.outline = '2px solid #3b82f6';
                    focusedElement.style.outlineOffset = '2px';
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                const focusedElement = document.activeElement;
                if (focusedElement) {
                    setTimeout(() => {
                        focusedElement.style.outline = '';
                    }, 100);
                }
            }
        });
    }

    setupQuickAccess() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S 保存
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.showToast('进度已自动保存', 'success');
            }
            
            // Ctrl/Cmd + H 帮助
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                const btn = document.getElementById('helpToggle');
                if (btn) btn.click();
            }
            
            // Esc 关闭模态框
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal:not([hidden])');
                if (modal) {
                    modal.hidden = true;
                }
            }
        });
    }

    // 触摸设备优化
    setupTouchOptimizations() {
        this.setupTouchFeedback();
        this.setupSwipeGestures();
    }

    setupTouchFeedback() {
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        const touchElements = document.querySelectorAll('button, .btn, .tab, .diff, .level-card');
        
        touchElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            el.addEventListener('touchend', () => {
                el.style.transform = '';
            }, { passive: true });
        });
    }

    setupSwipeGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            // 水平滑动超过50px，垂直滑动小于100px（避免与滚动冲突）
            if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
                const tabs = Array.from(document.querySelectorAll('.tab'));
                const activeTab = document.querySelector('.tab.active');
                const activeIndex = tabs.indexOf(activeTab);
                
                if (diffX > 0 && activeIndex > 0) {
                    // 右滑 - 上一个标签
                    tabs[activeIndex - 1].click();
                } else if (diffX < 0 && activeIndex < tabs.length - 1) {
                    // 左滑 - 下一个标签
                    tabs[activeIndex + 1].click();
                }
            }
        }, { passive: true });
    }

    // 性能监控和优化
    setupPerformanceMonitoring() {
        this.monitorCLS();
        this.monitorLCP();
        this.setupIdleProcessing();
    }

    monitorCLS() {
        // 累积布局偏移监控
        let cls = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
        }).observe({ type: 'layout-shift', buffered: true });
    }

    monitorLCP() {
        // 最大内容绘制监控
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
    }

    setupIdleProcessing() {
        // 空闲时处理任务
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadContent();
                this.cleanupDOM();
            });
        }
    }

    preloadContent() {
        // 预加载可能需要的资源
        const links = document.querySelectorAll('a[data-preload]');
        links.forEach(link => {
            const url = link.href;
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'prefetch';
            preloadLink.href = url;
            document.head.appendChild(preloadLink);
        });
    }

    cleanupDOM() {
        // 清理不必要的DOM元素
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(el => {
            if (!el.classList.contains('keep-alive')) {
                el.style.contentVisibility = 'auto';
            }
        });
    }

    // 工具函数
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }
}

// 初始化交互增强
document.addEventListener('DOMContentLoaded', () => {
    new InteractionEnhancer();
});

// 导出供其他脚本使用
window.InteractionEnhancer = InteractionEnhancer;
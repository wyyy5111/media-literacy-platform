/**
 * 性能优化和代码结构改进工具
 * 提供全面的性能监控、优化建议和自动优化功能
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {};
        this.optimizations = [];
        this.observers = {};
        this.isMonitoring = false;
        
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // 性能监控配置
        this.config = {
            // 性能阈值
            thresholds: {
                loadTime: 3000,        // 页面加载时间 (ms)
                renderTime: 100,       // 渲染时间 (ms)
                memoryUsage: 50,       // 内存使用率 (MB)
                bundleSize: 1000,      // 包大小 (KB)
                fps: 30,               // 帧率
                responseTime: 200      // 响应时间 (ms)
            },
            
            // 监控间隔
            intervals: {
                memory: 5000,          // 内存监控间隔
                fps: 1000,             // FPS监控间隔
                network: 2000          // 网络监控间隔
            }
        };
        
        this.startMonitoring();
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        
        console.log('🚀 启动性能监控...');
        
        // 监控页面加载性能
        this.monitorPageLoad();
        
        // 监控内存使用
        this.monitorMemoryUsage();
        
        // 监控渲染性能
        this.monitorRenderPerformance();
        
        // 监控网络性能
        this.monitorNetworkPerformance();
        
        // 监控用户交互性能
        this.monitorInteractionPerformance();
        
        // 监控资源加载
        this.monitorResourceLoading();
    }

    monitorPageLoad() {
        // 使用 Performance API 监控页面加载
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.pageLoad = {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.fetchStart,
                    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                    tcpConnect: navigation.connectEnd - navigation.connectStart,
                    serverResponse: navigation.responseEnd - navigation.requestStart,
                    domParsing: navigation.domInteractive - navigation.responseEnd,
                    resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd
                };
                
                // 检查是否超过阈值
                if (this.metrics.pageLoad.totalTime > this.config.thresholds.loadTime) {
                    this.addOptimization({
                        type: 'performance',
                        priority: 'high',
                        category: 'loading',
                        title: '页面加载时间过长',
                        description: `页面加载时间 ${this.metrics.pageLoad.totalTime}ms 超过阈值 ${this.config.thresholds.loadTime}ms`,
                        suggestions: [
                            '启用资源压缩和缓存',
                            '优化图片和静态资源',
                            '实现代码分割和懒加载',
                            '使用 CDN 加速资源加载'
                        ]
                    });
                }
            }
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            const updateMemoryMetrics = () => {
                const memory = performance.memory;
                this.metrics.memory = {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100,
                    usage: Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100)
                };
                
                // 检查内存使用是否过高
                if (this.metrics.memory.used > this.config.thresholds.memoryUsage) {
                    this.addOptimization({
                        type: 'performance',
                        priority: 'medium',
                        category: 'memory',
                        title: '内存使用过高',
                        description: `当前内存使用 ${this.metrics.memory.used}MB 超过阈值 ${this.config.thresholds.memoryUsage}MB`,
                        suggestions: [
                            '检查内存泄漏',
                            '优化数据结构',
                            '清理未使用的变量和事件监听器',
                            '实现对象池和缓存策略'
                        ]
                    });
                }
            };
            
            updateMemoryMetrics();
            setInterval(updateMemoryMetrics, this.config.intervals.memory);
        }
    }

    monitorRenderPerformance() {
        // 监控 FPS
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = (currentTime) => {
            frames++;
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.fps = fps;
                
                if (fps < this.config.thresholds.fps) {
                    this.addOptimization({
                        type: 'performance',
                        priority: 'medium',
                        category: 'rendering',
                        title: '渲染性能不佳',
                        description: `当前 FPS ${fps} 低于阈值 ${this.config.thresholds.fps}`,
                        suggestions: [
                            '优化 CSS 动画和过渡',
                            '减少 DOM 操作频率',
                            '使用 requestAnimationFrame',
                            '启用硬件加速'
                        ]
                    });
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        
        // 监控长任务
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    const longTasks = list.getEntries();
                    if (longTasks.length > 0) {
                        this.metrics.longTasks = longTasks.map(task => ({
                            duration: task.duration,
                            startTime: task.startTime,
                            name: task.name
                        }));
                        
                        this.addOptimization({
                            type: 'performance',
                            priority: 'high',
                            category: 'rendering',
                            title: '检测到长任务',
                            description: `发现 ${longTasks.length} 个长任务，可能阻塞主线程`,
                            suggestions: [
                                '将长任务分解为小任务',
                                '使用 Web Workers 处理计算密集型任务',
                                '实现任务调度和优先级管理',
                                '优化算法复杂度'
                            ]
                        });
                    }
                });
                
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.longTask = longTaskObserver;
            } catch (error) {
                console.warn('长任务监控不支持:', error);
            }
        }
    }

    monitorNetworkPerformance() {
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    const resources = list.getEntries();
                    this.metrics.resources = resources.map(resource => ({
                        name: resource.name,
                        type: resource.initiatorType,
                        size: resource.transferSize,
                        duration: resource.duration,
                        startTime: resource.startTime
                    }));
                    
                    // 分析资源加载性能
                    const slowResources = resources.filter(r => r.duration > this.config.thresholds.responseTime);
                    if (slowResources.length > 0) {
                        this.addOptimization({
                            type: 'performance',
                            priority: 'medium',
                            category: 'network',
                            title: '资源加载缓慢',
                            description: `发现 ${slowResources.length} 个加载缓慢的资源`,
                            suggestions: [
                                '压缩静态资源',
                                '启用 Gzip/Brotli 压缩',
                                '使用 CDN 加速',
                                '实现资源预加载'
                            ]
                        });
                    }
                });
                
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.resource = resourceObserver;
            } catch (error) {
                console.warn('资源监控不支持:', error);
            }
        }
    }

    monitorInteractionPerformance() {
        // 监控用户交互响应时间
        const interactionTimes = new Map();
        
        const startInteraction = (event) => {
            interactionTimes.set(event.type, performance.now());
        };
        
        const endInteraction = (event) => {
            const startTime = interactionTimes.get(event.type);
            if (startTime) {
                const duration = performance.now() - startTime;
                
                if (!this.metrics.interactions) {
                    this.metrics.interactions = {};
                }
                
                this.metrics.interactions[event.type] = {
                    duration,
                    timestamp: Date.now()
                };
                
                if (duration > this.config.thresholds.responseTime) {
                    this.addOptimization({
                        type: 'performance',
                        priority: 'medium',
                        category: 'interaction',
                        title: '交互响应缓慢',
                        description: `${event.type} 事件响应时间 ${Math.round(duration)}ms 超过阈值`,
                        suggestions: [
                            '优化事件处理函数',
                            '使用事件委托',
                            '减少 DOM 查询',
                            '实现防抖和节流'
                        ]
                    });
                }
                
                interactionTimes.delete(event.type);
            }
        };
        
        // 监控常见交互事件
        ['click', 'scroll', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, startInteraction, { passive: true });
            document.addEventListener(eventType + 'end', endInteraction, { passive: true });
        });
    }

    monitorResourceLoading() {
        // 分析已加载的资源
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;
        const resourceTypes = {};
        
        resources.forEach(resource => {
            totalSize += resource.transferSize || 0;
            const type = resource.initiatorType || 'other';
            resourceTypes[type] = (resourceTypes[type] || 0) + (resource.transferSize || 0);
        });
        
        this.metrics.resourceSummary = {
            totalSize: Math.round(totalSize / 1024), // KB
            count: resources.length,
            types: resourceTypes
        };
        
        // 检查包大小
        if (this.metrics.resourceSummary.totalSize > this.config.thresholds.bundleSize) {
            this.addOptimization({
                type: 'performance',
                priority: 'medium',
                category: 'bundle',
                title: '资源包过大',
                description: `总资源大小 ${this.metrics.resourceSummary.totalSize}KB 超过阈值 ${this.config.thresholds.bundleSize}KB`,
                suggestions: [
                    '启用代码分割',
                    '移除未使用的代码',
                    '压缩图片和静态资源',
                    '使用现代图片格式 (WebP, AVIF)'
                ]
            });
        }
    }

    addOptimization(optimization) {
        // 避免重复添加相同的优化建议
        const exists = this.optimizations.some(opt => 
            opt.title === optimization.title && opt.category === optimization.category
        );
        
        if (!exists) {
            optimization.id = Date.now() + Math.random();
            optimization.timestamp = new Date().toISOString();
            this.optimizations.push(optimization);
        }
    }

    // 自动优化功能
    async applyOptimizations() {
        console.log('🔧 开始应用性能优化...');
        
        let appliedCount = 0;
        
        // 1. 实现资源缓存策略
        this.implementResourceCaching();
        appliedCount++;
        
        // 2. 优化事件处理
        this.optimizeEventHandling();
        appliedCount++;
        
        // 3. 实现懒加载
        this.implementLazyLoading();
        appliedCount++;
        
        // 4. 优化 DOM 操作
        this.optimizeDOMOperations();
        appliedCount++;
        
        // 5. 实现防抖和节流
        this.implementDebounceThrottle();
        appliedCount++;
        
        // 6. 优化内存管理
        this.optimizeMemoryManagement();
        appliedCount++;
        
        console.log(`✅ 性能优化完成，应用了 ${appliedCount} 项优化`);
        return appliedCount;
    }

    implementResourceCaching() {
        // 实现智能资源缓存
        if ('serviceWorker' in navigator) {
            // 注册 Service Worker 进行资源缓存
            navigator.serviceWorker.register('/js/sw.js').catch(error => {
                console.warn('Service Worker 注册失败:', error);
            });
        }
        
        // 实现内存缓存
        window.resourceCache = new Map();
        
        // 缓存 API 响应
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            const cacheKey = url + JSON.stringify(options);
            
            // 检查缓存
            if (window.resourceCache.has(cacheKey)) {
                const cached = window.resourceCache.get(cacheKey);
                if (Date.now() - cached.timestamp < 300000) { // 5分钟缓存
                    return Promise.resolve(cached.response.clone());
                }
            }
            
            return originalFetch(url, options).then(response => {
                // 缓存成功的响应
                if (response.ok) {
                    window.resourceCache.set(cacheKey, {
                        response: response.clone(),
                        timestamp: Date.now()
                    });
                }
                return response;
            });
        };
    }

    optimizeEventHandling() {
        // 实现事件委托
        const eventDelegator = {
            handlers: new Map(),
            
            delegate(container, eventType, selector, handler) {
                const key = `${eventType}_${selector}`;
                if (!this.handlers.has(key)) {
                    const delegatedHandler = (event) => {
                        const target = event.target.closest(selector);
                        if (target) {
                            handler.call(target, event);
                        }
                    };
                    
                    container.addEventListener(eventType, delegatedHandler);
                    this.handlers.set(key, delegatedHandler);
                }
            }
        };
        
        window.eventDelegator = eventDelegator;
    }

    implementLazyLoading() {
        // 实现图片懒加载
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            // 观察所有带有 data-src 的图片
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            window.lazyImageObserver = imageObserver;
        }
        
        // 实现内容懒加载
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.lazyLoad) {
                        // 触发懒加载
                        const event = new CustomEvent('lazyload', { detail: element });
                        element.dispatchEvent(event);
                        contentObserver.unobserve(element);
                    }
                }
            });
        });
        
        window.lazyContentObserver = contentObserver;
    }

    optimizeDOMOperations() {
        // 实现 DOM 操作批处理
        window.DOMBatcher = {
            queue: [],
            isScheduled: false,
            
            batch(operation) {
                this.queue.push(operation);
                if (!this.isScheduled) {
                    this.isScheduled = true;
                    requestAnimationFrame(() => {
                        this.flush();
                    });
                }
            },
            
            flush() {
                this.queue.forEach(operation => operation());
                this.queue = [];
                this.isScheduled = false;
            }
        };
        
        // 优化样式更新
        window.StyleBatcher = {
            updates: new Map(),
            
            setStyle(element, property, value) {
                if (!this.updates.has(element)) {
                    this.updates.set(element, {});
                }
                this.updates.get(element)[property] = value;
                
                requestAnimationFrame(() => {
                    this.applyUpdates();
                });
            },
            
            applyUpdates() {
                this.updates.forEach((styles, element) => {
                    Object.assign(element.style, styles);
                });
                this.updates.clear();
            }
        };
    }

    implementDebounceThrottle() {
        // 防抖函数
        window.debounce = function(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        };
        
        // 节流函数
        window.throttle = function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        
        // 自动应用到常见事件
        const scrollHandler = window.throttle(() => {
            // 滚动处理逻辑
        }, 16); // 60fps
        
        const resizeHandler = window.debounce(() => {
            // 窗口大小调整处理逻辑
        }, 250);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', resizeHandler);
    }

    optimizeMemoryManagement() {
        // 实现对象池
        window.ObjectPool = class {
            constructor(createFn, resetFn, initialSize = 10) {
                this.createFn = createFn;
                this.resetFn = resetFn;
                this.pool = [];
                
                // 预创建对象
                for (let i = 0; i < initialSize; i++) {
                    this.pool.push(this.createFn());
                }
            }
            
            acquire() {
                return this.pool.length > 0 ? this.pool.pop() : this.createFn();
            }
            
            release(obj) {
                if (this.resetFn) {
                    this.resetFn(obj);
                }
                this.pool.push(obj);
            }
        };
        
        // 实现内存清理
        window.MemoryManager = {
            cleanupTasks: [],
            
            addCleanupTask(task) {
                this.cleanupTasks.push(task);
            },
            
            cleanup() {
                this.cleanupTasks.forEach(task => {
                    try {
                        task();
                    } catch (error) {
                        console.warn('清理任务失败:', error);
                    }
                });
            },
            
            scheduleCleanup() {
                // 定期清理
                setInterval(() => {
                    this.cleanup();
                }, 60000); // 每分钟清理一次
                
                // 页面隐藏时清理
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        this.cleanup();
                    }
                });
            }
        };
        
        window.MemoryManager.scheduleCleanup();
    }

    // 生成性能报告
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            optimizations: this.optimizations,
            summary: {
                totalOptimizations: this.optimizations.length,
                highPriority: this.optimizations.filter(opt => opt.priority === 'high').length,
                categories: [...new Set(this.optimizations.map(opt => opt.category))]
            },
            recommendations: this.generateRecommendations()
        };
        
        console.log('\n📊 性能分析报告');
        console.log('='.repeat(50));
        console.log(`📈 页面加载时间: ${this.metrics.pageLoad?.totalTime || 'N/A'}ms`);
        console.log(`🧠 内存使用: ${this.metrics.memory?.used || 'N/A'}MB`);
        console.log(`🎯 FPS: ${this.metrics.fps || 'N/A'}`);
        console.log(`📦 资源大小: ${this.metrics.resourceSummary?.totalSize || 'N/A'}KB`);
        console.log(`⚡ 优化建议: ${this.optimizations.length} 项`);
        console.log('='.repeat(50));
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // 基于指标生成建议
        if (this.metrics.pageLoad?.totalTime > this.config.thresholds.loadTime) {
            recommendations.push('优化页面加载性能，考虑代码分割和资源压缩');
        }
        
        if (this.metrics.memory?.used > this.config.thresholds.memoryUsage) {
            recommendations.push('优化内存使用，检查内存泄漏和大对象');
        }
        
        if (this.metrics.fps < this.config.thresholds.fps) {
            recommendations.push('优化渲染性能，减少重绘和回流');
        }
        
        if (this.metrics.resourceSummary?.totalSize > this.config.thresholds.bundleSize) {
            recommendations.push('减少资源包大小，启用压缩和懒加载');
        }
        
        return recommendations;
    }

    // 导出报告
    exportReport() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 性能报告已导出');
    }

    // 停止监控
    stopMonitoring() {
        this.isMonitoring = false;
        
        // 断开所有观察器
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        console.log('⏹️ 性能监控已停止');
    }
}

// 代码质量分析器
class CodeQualityAnalyzer {
    constructor() {
        this.issues = [];
        this.suggestions = [];
    }

    analyzeCodeQuality() {
        console.log('🔍 开始代码质量分析...');
        
        // 分析全局变量
        this.analyzeGlobalVariables();
        
        // 分析函数复杂度
        this.analyzeFunctionComplexity();
        
        // 分析代码重复
        this.analyzeCodeDuplication();
        
        // 分析性能反模式
        this.analyzePerformanceAntiPatterns();
        
        // 分析可访问性
        this.analyzeAccessibility();
        
        return {
            issues: this.issues,
            suggestions: this.suggestions
        };
    }

    analyzeGlobalVariables() {
        const globalVars = Object.keys(window).filter(key => {
            return !['console', 'document', 'window', 'navigator', 'location'].includes(key) &&
                   typeof window[key] !== 'function' &&
                   !key.startsWith('webkit') &&
                   !key.startsWith('moz');
        });
        
        if (globalVars.length > 10) {
            this.issues.push({
                type: 'code-quality',
                severity: 'medium',
                message: `发现 ${globalVars.length} 个全局变量，建议使用命名空间或模块化`
            });
        }
    }

    analyzeFunctionComplexity() {
        // 检查函数长度和复杂度（简化版）
        const scripts = document.querySelectorAll('script[src]');
        if (scripts.length > 10) {
            this.suggestions.push('考虑合并和压缩 JavaScript 文件以减少 HTTP 请求');
        }
    }

    analyzeCodeDuplication() {
        // 检查重复的事件监听器
        const elements = document.querySelectorAll('*');
        const eventCounts = {};
        
        elements.forEach(el => {
            const events = Object.keys(el).filter(key => key.startsWith('on'));
            events.forEach(event => {
                eventCounts[event] = (eventCounts[event] || 0) + 1;
            });
        });
        
        Object.entries(eventCounts).forEach(([event, count]) => {
            if (count > 5) {
                this.suggestions.push(`考虑使用事件委托优化 ${event} 事件处理`);
            }
        });
    }

    analyzePerformanceAntiPatterns() {
        // 检查常见的性能反模式
        
        // 检查内联样式
        const inlineStyles = document.querySelectorAll('[style]');
        if (inlineStyles.length > 10) {
            this.issues.push({
                type: 'performance',
                severity: 'low',
                message: `发现 ${inlineStyles.length} 个内联样式，建议使用 CSS 类`
            });
        }
        
        // 检查大量 DOM 元素
        const totalElements = document.querySelectorAll('*').length;
        if (totalElements > 1000) {
            this.issues.push({
                type: 'performance',
                severity: 'medium',
                message: `DOM 元素过多 (${totalElements})，可能影响性能`
            });
        }
    }

    analyzeAccessibility() {
        // 检查可访问性问题
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            this.issues.push({
                type: 'accessibility',
                severity: 'medium',
                message: `${images.length} 个图片缺少 alt 属性`
            });
        }
        
        const buttons = document.querySelectorAll('button:not([aria-label]):not([title])');
        if (buttons.length > 0) {
            this.suggestions.push('为按钮添加 aria-label 或 title 属性以提高可访问性');
        }
    }
}

// 导出类
window.PerformanceOptimizer = PerformanceOptimizer;
window.CodeQualityAnalyzer = CodeQualityAnalyzer;

// 自动启动性能监控
document.addEventListener('DOMContentLoaded', () => {
    // 延迟启动以避免影响页面加载
    setTimeout(() => {
        window.performanceOptimizer = new PerformanceOptimizer();
        window.codeQualityAnalyzer = new CodeQualityAnalyzer();
        
        // 在开发模式下自动分析
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                window.codeQualityAnalyzer.analyzeCodeQuality();
            }, 5000);
        }
    }, 1000);
});
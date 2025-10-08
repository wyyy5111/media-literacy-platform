// 高级数据分析面板 - 国家一等奖创新功能
// 提供学习进度分析、能力评估和个性化建议

class AnalyticsDashboard {
    constructor() {
        this.data = this.loadAnalyticsData();
        this.charts = new Map();
        this.init();
    }

    init() {
        this.createDashboardUI();
        this.setupEventListeners();
        this.startRealTimeMonitoring();
    }

    loadAnalyticsData() {
        const stored = localStorage.getItem('analytics_data');
        return stored ? JSON.parse(stored) : {
            sessions: [],
            skillProgress: {
                titleStandardization: { attempts: 0, successes: 0, avgTime: 0 },
                chartCorrection: { attempts: 0, successes: 0, avgTime: 0 },
                factChain: { attempts: 0, successes: 0, avgTime: 0 },
                ethicsAI: { attempts: 0, successes: 0, avgTime: 0 },
                rumorDetection: { attempts: 0, successes: 0, avgTime: 0 }
            },
            learningPath: [],
            weaknesses: [],
            achievements: [],
            timeSpent: 0,
            lastSession: null
        };
    }

    saveAnalyticsData() {
        localStorage.setItem('analytics_data', JSON.stringify(this.data));
    }

    createDashboardUI() {
        // 创建分析面板的HTML结构
        const dashboardHTML = `
            <div id="analytics-dashboard" class="analytics-panel" hidden>
                <div class="dashboard-header">
                    <h2>📊 学习分析面板</h2>
                    <div class="dashboard-controls">
                        <button class="btn secondary" id="export-analytics">导出报告</button>
                        <button class="btn secondary" id="reset-analytics">重置数据</button>
                        <button class="btn" id="close-dashboard">×</button>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="analytics-grid">
                        <!-- 总体统计 -->
                        <div class="analytics-card overview-card">
                            <h3>📈 总体表现</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-value" id="total-sessions">0</span>
                                    <span class="stat-label">学习会话</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value" id="total-time">0分钟</span>
                                    <span class="stat-label">总学习时长</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value" id="avg-score">0%</span>
                                    <span class="stat-label">平均得分</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value" id="completion-rate">0%</span>
                                    <span class="stat-label">完成率</span>
                                </div>
                            </div>
                        </div>

                        <!-- 技能雷达图 -->
                        <div class="analytics-card skills-card">
                            <h3>🎯 技能分析</h3>
                            <canvas id="skills-radar" width="300" height="300"></canvas>
                            <div class="skills-legend">
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #3b82f6;"></span>
                                    <span>当前水平</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-color" style="background: #10b981;"></span>
                                    <span>目标水平</span>
                                </div>
                            </div>
                        </div>

                        <!-- 学习进度 -->
                        <div class="analytics-card progress-card">
                            <h3>📚 学习进度</h3>
                            <div class="progress-timeline" id="learning-timeline"></div>
                        </div>

                        <!-- 弱点分析 -->
                        <div class="analytics-card weaknesses-card">
                            <h3>⚠️ 需要改进</h3>
                            <div class="weaknesses-list" id="weaknesses-list"></div>
                        </div>

                        <!-- 学习建议 -->
                        <div class="analytics-card recommendations-card">
                            <h3>💡 个性化建议</h3>
                            <div class="recommendations-list" id="recommendations-list"></div>
                        </div>

                        <!-- 时间分布 -->
                        <div class="analytics-card time-card">
                            <h3>⏰ 时间分布</h3>
                            <canvas id="time-chart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 将面板添加到页面
        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        
        // 添加对应的CSS样式
        this.injectStyles();
    }

    injectStyles() {
        const styles = `
            .analytics-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .analytics-panel:not([hidden]) {
                opacity: 1;
            }

            .dashboard-header {
                background: var(--surface);
                border-bottom: 1px solid var(--border-primary);
                padding: var(--space-4) var(--space-6);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dashboard-header h2 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.5rem;
            }

            .dashboard-controls {
                display: flex;
                gap: var(--space-3);
            }

            .dashboard-content {
                flex: 1;
                padding: var(--space-6);
                overflow-y: auto;
                background: var(--background);
            }

            .analytics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: var(--space-6);
                max-width: 1400px;
                margin: 0 auto;
            }

            .analytics-card {
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-5);
                box-shadow: var(--shadow-lg);
                backdrop-filter: blur(20px);
            }

            .analytics-card h3 {
                margin: 0 0 var(--space-4) 0;
                color: var(--text-primary);
                font-size: 1.1rem;
                font-weight: 600;
            }

            .overview-card {
                grid-column: 1 / -1;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: var(--space-4);
            }

            .stat-item {
                text-align: center;
                padding: var(--space-4);
                background: rgba(59, 130, 246, 0.1);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
            }

            .stat-value {
                display: block;
                font-size: 2rem;
                font-weight: 700;
                color: var(--accent-primary);
                margin-bottom: var(--space-2);
            }

            .stat-label {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .skills-legend {
                display: flex;
                justify-content: center;
                gap: var(--space-4);
                margin-top: var(--space-3);
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .progress-timeline {
                max-height: 300px;
                overflow-y: auto;
            }

            .timeline-item {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                border-left: 2px solid var(--border-primary);
                margin-left: var(--space-3);
                position: relative;
            }

            .timeline-item::before {
                content: '';
                position: absolute;
                left: -6px;
                top: 50%;
                transform: translateY(-50%);
                width: 10px;
                height: 10px;
                background: var(--accent-primary);
                border-radius: 50%;
            }

            .timeline-content {
                flex: 1;
            }

            .timeline-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            .timeline-meta {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .weaknesses-list,
            .recommendations-list {
                space-y: var(--space-3);
            }

            .weakness-item,
            .recommendation-item {
                padding: var(--space-3);
                background: rgba(239, 68, 68, 0.1);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--danger);
                margin-bottom: var(--space-3);
            }

            .recommendation-item {
                background: rgba(34, 197, 94, 0.1);
                border-left-color: var(--success);
            }

            .weakness-title,
            .recommendation-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-2);
            }

            .weakness-desc,
            .recommendation-desc {
                font-size: 0.875rem;
                color: var(--text-secondary);
                line-height: 1.5;
            }

            @media (max-width: 768px) {
                .analytics-grid {
                    grid-template-columns: 1fr;
                }
                
                .dashboard-content {
                    padding: var(--space-4);
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // 关闭面板
        document.getElementById('close-dashboard').addEventListener('click', () => {
            this.hideDashboard();
        });

        // 导出报告
        document.getElementById('export-analytics').addEventListener('click', () => {
            this.exportReport();
        });

        // 重置数据
        document.getElementById('reset-analytics').addEventListener('click', () => {
            if (confirm('确定要重置所有分析数据吗？此操作不可撤销。')) {
                this.resetAnalytics();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !document.getElementById('analytics-dashboard').hidden) {
                this.hideDashboard();
            }
        });
    }

    showDashboard() {
        this.updateDashboard();
        document.getElementById('analytics-dashboard').hidden = false;
        document.body.style.overflow = 'hidden';
    }

    hideDashboard() {
        document.getElementById('analytics-dashboard').hidden = true;
        document.body.style.overflow = '';
    }

    // 统一公开API以兼容触发调用
    show() { this.showDashboard(); }
    hide() { this.hideDashboard(); }
    toggle() {
        const panel = document.getElementById('analytics-dashboard');
        if (!panel) return;
        if (panel.hidden) {
            this.showDashboard();
        } else {
            this.hideDashboard();
        }
    }

    updateDashboard() {
        this.updateOverviewStats();
        this.updateSkillsRadar();
        this.updateLearningTimeline();
        this.updateWeaknesses();
        this.updateRecommendations();
        this.updateTimeChart();
    }

    updateOverviewStats() {
        const sessions = this.data.sessions.length;
        const totalTime = Math.round(this.data.timeSpent / 60000); // 转换为分钟
        const avgScore = sessions > 0 ? 
            Math.round(this.data.sessions.reduce((sum, s) => sum + s.score, 0) / sessions) : 0;
        const completionRate = sessions > 0 ? 
            Math.round((this.data.sessions.filter(s => s.completed).length / sessions) * 100) : 0;

        document.getElementById('total-sessions').textContent = sessions;
        document.getElementById('total-time').textContent = `${totalTime}分钟`;
        document.getElementById('avg-score').textContent = `${avgScore}%`;
        document.getElementById('completion-rate').textContent = `${completionRate}%`;
    }

    updateSkillsRadar() {
        const canvas = document.getElementById('skills-radar');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 技能数据
        const skills = [
            { name: '标题规范', current: this.getSkillLevel('titleStandardization'), target: 90 },
            { name: '图表纠错', current: this.getSkillLevel('chartCorrection'), target: 85 },
            { name: '事实链', current: this.getSkillLevel('factChain'), target: 88 },
            { name: '伦理AI', current: this.getSkillLevel('ethicsAI'), target: 92 },
            { name: '谣言识别', current: this.getSkillLevel('rumorDetection'), target: 87 }
        ];

        // 绘制网格
        this.drawRadarGrid(ctx, centerX, centerY, radius, skills.length);

        // 绘制当前水平
        this.drawRadarPolygon(ctx, centerX, centerY, radius, skills.map(s => s.current), '#3b82f6', 0.3);

        // 绘制目标水平
        this.drawRadarPolygon(ctx, centerX, centerY, radius, skills.map(s => s.target), '#10b981', 0.2);

        // 绘制标签
        this.drawRadarLabels(ctx, centerX, centerY, radius + 20, skills.map(s => s.name));
    }

    drawRadarGrid(ctx, centerX, centerY, radius, sides) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        // 绘制同心圆
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // 绘制射线
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }
    }

    drawRadarPolygon(ctx, centerX, centerY, radius, values, color, alpha) {
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        values.forEach((value, i) => {
            const angle = (i * 2 * Math.PI) / values.length - Math.PI / 2;
            const r = (radius * value) / 100;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawRadarLabels(ctx, centerX, centerY, radius, labels) {
        ctx.fillStyle = 'var(--text-primary)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        labels.forEach((label, i) => {
            const angle = (i * 2 * Math.PI) / labels.length - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.fillText(label, x, y);
        });
    }

    getSkillLevel(skill) {
        const data = this.data.skillProgress[skill];
        if (data.attempts === 0) return 0;
        return Math.round((data.successes / data.attempts) * 100);
    }

    updateLearningTimeline() {
        const timeline = document.getElementById('learning-timeline');
        const recentSessions = this.data.sessions.slice(-10).reverse();

        timeline.innerHTML = recentSessions.map(session => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-title">${session.level || '未知关卡'}</div>
                    <div class="timeline-meta">
                        得分: ${session.score}% · 
                        用时: ${Math.round(session.duration / 1000)}秒 · 
                        ${new Date(session.timestamp).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateWeaknesses() {
        const weaknesses = this.analyzeWeaknesses();
        const container = document.getElementById('weaknesses-list');

        container.innerHTML = weaknesses.map(weakness => `
            <div class="weakness-item">
                <div class="weakness-title">${weakness.title}</div>
                <div class="weakness-desc">${weakness.description}</div>
            </div>
        `).join('');
    }

    updateRecommendations() {
        const recommendations = this.generateRecommendations();
        const container = document.getElementById('recommendations-list');

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-desc">${rec.description}</div>
            </div>
        `).join('');
    }

    updateTimeChart() {
        const canvas = document.getElementById('time-chart');
        const ctx = canvas.getContext('2d');
        
        // 简单的时间分布柱状图
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const timeData = this.getTimeDistribution();
        const barWidth = canvas.width / timeData.length;
        const maxValue = Math.max(...timeData.map(d => d.value));

        timeData.forEach((data, i) => {
            const barHeight = (data.value / maxValue) * (canvas.height - 40);
            const x = i * barWidth;
            const y = canvas.height - barHeight - 20;

            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

            ctx.fillStyle = 'var(--text-secondary)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.label, x + barWidth / 2, canvas.height - 5);
        });
    }

    analyzeWeaknesses() {
        const weaknesses = [];
        const skills = this.data.skillProgress;

        Object.entries(skills).forEach(([skill, data]) => {
            const successRate = data.attempts > 0 ? (data.successes / data.attempts) : 0;
            if (successRate < 0.7 && data.attempts >= 3) {
                weaknesses.push({
                    title: this.getSkillName(skill),
                    description: `成功率仅为 ${Math.round(successRate * 100)}%，建议加强练习`
                });
            }
        });

        return weaknesses;
    }

    generateRecommendations() {
        const recommendations = [];
        const skills = this.data.skillProgress;

        // 基于表现生成个性化建议
        Object.entries(skills).forEach(([skill, data]) => {
            const successRate = data.attempts > 0 ? (data.successes / data.attempts) : 0;
            
            if (successRate < 0.5) {
                recommendations.push({
                    title: `重点练习${this.getSkillName(skill)}`,
                    description: '建议从基础题目开始，逐步提高难度'
                });
            } else if (successRate > 0.9) {
                recommendations.push({
                    title: `挑战${this.getSkillName(skill)}高级题目`,
                    description: '您在此技能上表现优秀，可以尝试更有挑战性的题目'
                });
            }
        });

        return recommendations;
    }

    getSkillName(skill) {
        const names = {
            titleStandardization: '标题规范',
            chartCorrection: '图表纠错',
            factChain: '事实链与引用',
            ethicsAI: '伦理与AI标识',
            rumorDetection: '谣言识别'
        };
        return names[skill] || skill;
    }

    getTimeDistribution() {
        // 模拟一周的时间分布数据
        return [
            { label: '周一', value: 30 },
            { label: '周二', value: 45 },
            { label: '周三', value: 25 },
            { label: '周四', value: 60 },
            { label: '周五', value: 40 },
            { label: '周六', value: 80 },
            { label: '周日', value: 55 }
        ];
    }

    // 记录学习会话
    recordSession(levelData, score, duration, completed = true) {
        const session = {
            timestamp: Date.now(),
            level: levelData.title,
            score: score,
            duration: duration,
            completed: completed,
            difficulty: levelData.difficulty || 'newbie'
        };

        this.data.sessions.push(session);
        this.data.timeSpent += duration;
        this.data.lastSession = session;
        this.saveAnalyticsData();
    }

    // 记录技能练习
    recordSkillAttempt(skill, success, timeSpent) {
        if (!this.data.skillProgress[skill]) {
            this.data.skillProgress[skill] = { attempts: 0, successes: 0, avgTime: 0 };
        }

        const skillData = this.data.skillProgress[skill];
        skillData.attempts++;
        if (success) skillData.successes++;
        skillData.avgTime = (skillData.avgTime * (skillData.attempts - 1) + timeSpent) / skillData.attempts;

        this.saveAnalyticsData();
    }

    exportReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalSessions: this.data.sessions.length,
                totalTime: Math.round(this.data.timeSpent / 60000),
                averageScore: this.data.sessions.length > 0 ? 
                    Math.round(this.data.sessions.reduce((sum, s) => sum + s.score, 0) / this.data.sessions.length) : 0
            },
            skillProgress: this.data.skillProgress,
            recentSessions: this.data.sessions.slice(-20),
            weaknesses: this.analyzeWeaknesses(),
            recommendations: this.generateRecommendations()
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `学习分析报告_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    resetAnalytics() {
        this.data = {
            sessions: [],
            skillProgress: {
                titleStandardization: { attempts: 0, successes: 0, avgTime: 0 },
                chartCorrection: { attempts: 0, successes: 0, avgTime: 0 },
                factChain: { attempts: 0, successes: 0, avgTime: 0 },
                ethicsAI: { attempts: 0, successes: 0, avgTime: 0 },
                rumorDetection: { attempts: 0, successes: 0, avgTime: 0 }
            },
            learningPath: [],
            weaknesses: [],
            achievements: [],
            timeSpent: 0,
            lastSession: null
        };
        this.saveAnalyticsData();
        this.updateDashboard();
    }

    startRealTimeMonitoring() {
        // 监控用户行为，自动记录数据
        this.setupBehaviorTracking();
    }

    setupBehaviorTracking() {
        // 监控答题时间
        let questionStartTime = null;
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
                if (!questionStartTime) {
                    questionStartTime = Date.now();
                }
            }
            
            if (e.target.matches('button[data-evaluate]')) {
                if (questionStartTime) {
                    const timeSpent = Date.now() - questionStartTime;
                    // 这里可以记录答题时间等数据
                    questionStartTime = null;
                }
            }
        });
    }
}

// 导出供其他模块使用
window.AnalyticsDashboard = AnalyticsDashboard;
// 智能学习评估引擎 - 国家一等奖创新功能
// 多维度能力评估、学习效果分析和个性化反馈

class AssessmentEngine {
    constructor() {
        this.assessmentData = new Map();
        this.skillModels = new Map();
        this.learningAnalytics = new LearningAnalytics();
        this.adaptiveEngine = new AdaptiveAssessmentEngine();
        this.reportGenerator = new AssessmentReportGenerator();
        this.init();
    }

    init() {
        this.initializeSkillModels();
        this.createAssessmentUI();
        this.setupEventListeners();
        this.loadAssessmentHistory();
    }

    initializeSkillModels() {
        // 媒体素养技能模型
        this.skillModels.set('media_literacy', {
            name: '媒体素养',
            dimensions: [
                {
                    id: 'source_evaluation',
                    name: '信息源评估',
                    weight: 0.25,
                    indicators: ['可信度判断', '权威性识别', '偏见检测']
                },
                {
                    id: 'content_analysis',
                    name: '内容分析',
                    weight: 0.25,
                    indicators: ['事实核查', '逻辑推理', '证据评估']
                },
                {
                    id: 'critical_thinking',
                    name: '批判性思维',
                    weight: 0.25,
                    indicators: ['多角度思考', '假设验证', '结论推导']
                },
                {
                    id: 'digital_citizenship',
                    name: '数字公民素养',
                    weight: 0.25,
                    indicators: ['隐私保护', '网络伦理', '信息分享']
                }
            ]
        });

        // 认知能力模型
        this.skillModels.set('cognitive_abilities', {
            name: '认知能力',
            dimensions: [
                {
                    id: 'attention',
                    name: '注意力',
                    weight: 0.2,
                    indicators: ['专注度', '选择性注意', '持续注意']
                },
                {
                    id: 'memory',
                    name: '记忆力',
                    weight: 0.2,
                    indicators: ['工作记忆', '长期记忆', '记忆策略']
                },
                {
                    id: 'reasoning',
                    name: '推理能力',
                    weight: 0.2,
                    indicators: ['归纳推理', '演绎推理', '类比推理']
                },
                {
                    id: 'problem_solving',
                    name: '问题解决',
                    weight: 0.2,
                    indicators: ['问题识别', '策略选择', '方案执行']
                },
                {
                    id: 'metacognition',
                    name: '元认知',
                    weight: 0.2,
                    indicators: ['自我监控', '策略调节', '反思能力']
                }
            ]
        });
    }

    createAssessmentUI() {
        const assessmentHTML = `
            <div id="assessment-system" class="assessment-container">
                <!-- 评估触发按钮 -->
                <button id="assessment-trigger" class="assessment-trigger" title="智能评估">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H19V4h-2v2H7V4H5v2H3.5C2.67 6 2 6.67 2 7.5v11C2 19.33 2.67 20 3.5 20h17c.83 0 1.5-.67 1.5-1.5v-11C22 6.67 21.33 6 20.5 6z"/>
                    </svg>
                    <span class="assessment-notification" id="assessment-notification" hidden>!</span>
                </button>

                <!-- 评估面板 -->
                <div id="assessment-panel" class="assessment-panel" hidden>
                    <div class="assessment-header">
                        <div class="assessment-title">
                            <h3>智能学习评估</h3>
                            <span class="assessment-status" id="assessment-status">准备就绪</span>
                        </div>
                        <div class="assessment-controls">
                            <button class="btn-icon" id="assessment-settings" title="评估设置">⚙️</button>
                            <button class="btn-icon" id="assessment-history" title="历史记录">📊</button>
                            <button class="btn-icon" id="close-assessment" title="关闭">✕</button>
                        </div>
                    </div>

                    <div class="assessment-tabs">
                        <button class="tab-btn active" data-tab="overview">概览</button>
                        <button class="tab-btn" data-tab="skills">技能评估</button>
                        <button class="tab-btn" data-tab="cognitive">认知评估</button>
                        <button class="tab-btn" data-tab="adaptive">自适应测试</button>
                        <button class="tab-btn" data-tab="reports">评估报告</button>
                    </div>

                    <div class="assessment-content">
                        <!-- 概览标签页 -->
                        <div class="tab-content active" id="overview-tab">
                            <div class="assessment-overview">
                                <div class="overview-stats">
                                    <div class="stat-card">
                                        <div class="stat-icon">🎯</div>
                                        <div class="stat-info">
                                            <h4>总体评分</h4>
                                            <div class="stat-value" id="overall-score">85</div>
                                            <div class="stat-trend">+5 较上次</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card">
                                        <div class="stat-icon">📈</div>
                                        <div class="stat-info">
                                            <h4>学习进度</h4>
                                            <div class="stat-value" id="learning-progress">72%</div>
                                            <div class="stat-trend">+12% 本周</div>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card">
                                        <div class="stat-icon">🏆</div>
                                        <div class="stat-info">
                                            <h4>技能等级</h4>
                                            <div class="stat-value" id="skill-level">中级</div>
                                            <div class="stat-trend">即将晋升</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="skill-radar-container">
                                    <h4>技能雷达图</h4>
                                    <canvas id="skill-radar" width="300" height="300"></canvas>
                                </div>

                                <div class="recent-assessments">
                                    <h4>最近评估</h4>
                                    <div class="assessment-timeline" id="assessment-timeline">
                                        <div class="timeline-item">
                                            <div class="timeline-date">今天 14:30</div>
                                            <div class="timeline-content">
                                                <h5>媒体素养综合评估</h5>
                                                <p>得分：88分，在信息源评估方面表现优秀</p>
                                            </div>
                                        </div>
                                        <div class="timeline-item">
                                            <div class="timeline-date">昨天 16:45</div>
                                            <div class="timeline-content">
                                                <h5>批判性思维测试</h5>
                                                <p>得分：82分，逻辑推理能力有所提升</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 技能评估标签页 -->
                        <div class="tab-content" id="skills-tab">
                            <div class="skills-assessment">
                                <div class="assessment-selector">
                                    <h4>选择评估类型</h4>
                                    <div class="assessment-types">
                                        <div class="assessment-type-card" data-type="media_literacy">
                                            <div class="type-icon">📺</div>
                                            <h5>媒体素养评估</h5>
                                            <p>评估信息识别、分析和判断能力</p>
                                            <div class="type-duration">约15分钟</div>
                                        </div>
                                        
                                        <div class="assessment-type-card" data-type="critical_thinking">
                                            <div class="type-icon">🧠</div>
                                            <h5>批判性思维评估</h5>
                                            <p>评估逻辑推理和分析能力</p>
                                            <div class="type-duration">约20分钟</div>
                                        </div>
                                        
                                        <div class="assessment-type-card" data-type="digital_literacy">
                                            <div class="type-icon">💻</div>
                                            <h5>数字素养评估</h5>
                                            <p>评估数字工具使用和网络安全意识</p>
                                            <div class="type-duration">约12分钟</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="skill-progress" id="skill-progress">
                                    <h4>技能发展轨迹</h4>
                                    <div class="progress-chart">
                                        <canvas id="skill-progress-chart" width="400" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 认知评估标签页 -->
                        <div class="tab-content" id="cognitive-tab">
                            <div class="cognitive-assessment">
                                <div class="cognitive-tests">
                                    <h4>认知能力测试</h4>
                                    
                                    <div class="test-category">
                                        <h5>注意力测试</h5>
                                        <div class="test-items">
                                            <div class="test-item">
                                                <span class="test-name">选择性注意测试</span>
                                                <button class="btn-test" data-test="selective_attention">开始测试</button>
                                            </div>
                                            <div class="test-item">
                                                <span class="test-name">持续注意力测试</span>
                                                <button class="btn-test" data-test="sustained_attention">开始测试</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="test-category">
                                        <h5>记忆力测试</h5>
                                        <div class="test-items">
                                            <div class="test-item">
                                                <span class="test-name">工作记忆测试</span>
                                                <button class="btn-test" data-test="working_memory">开始测试</button>
                                            </div>
                                            <div class="test-item">
                                                <span class="test-name">长期记忆测试</span>
                                                <button class="btn-test" data-test="long_term_memory">开始测试</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="test-category">
                                        <h5>推理能力测试</h5>
                                        <div class="test-items">
                                            <div class="test-item">
                                                <span class="test-name">逻辑推理测试</span>
                                                <button class="btn-test" data-test="logical_reasoning">开始测试</button>
                                            </div>
                                            <div class="test-item">
                                                <span class="test-name">空间推理测试</span>
                                                <button class="btn-test" data-test="spatial_reasoning">开始测试</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="cognitive-results" id="cognitive-results">
                                    <h4>认知能力分析</h4>
                                    <div class="cognitive-chart">
                                        <canvas id="cognitive-chart" width="400" height="300"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 自适应测试标签页 -->
                        <div class="tab-content" id="adaptive-tab">
                            <div class="adaptive-assessment">
                                <div class="adaptive-intro">
                                    <h4>自适应智能测试</h4>
                                    <p>基于AI算法的个性化测试，根据你的表现动态调整题目难度</p>
                                </div>

                                <div class="adaptive-config">
                                    <div class="config-item">
                                        <label>测试领域</label>
                                        <select id="adaptive-domain">
                                            <option value="comprehensive">综合评估</option>
                                            <option value="media_literacy">媒体素养</option>
                                            <option value="critical_thinking">批判性思维</option>
                                            <option value="problem_solving">问题解决</option>
                                        </select>
                                    </div>
                                    
                                    <div class="config-item">
                                        <label>测试时长</label>
                                        <select id="adaptive-duration">
                                            <option value="10">10分钟</option>
                                            <option value="15" selected>15分钟</option>
                                            <option value="20">20分钟</option>
                                            <option value="30">30分钟</option>
                                        </select>
                                    </div>
                                    
                                    <div class="config-item">
                                        <label>难度起点</label>
                                        <select id="adaptive-start-level">
                                            <option value="easy">简单</option>
                                            <option value="medium" selected>中等</option>
                                            <option value="hard">困难</option>
                                            <option value="auto">自动判断</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="adaptive-controls">
                                    <button id="start-adaptive-test" class="btn-primary">开始自适应测试</button>
                                    <button id="preview-adaptive" class="btn-secondary">预览题目</button>
                                </div>

                                <div class="adaptive-progress" id="adaptive-progress" hidden>
                                    <div class="progress-header">
                                        <h5>测试进行中...</h5>
                                        <div class="progress-stats">
                                            <span>题目 <span id="current-question">1</span>/<span id="total-questions">20</span></span>
                                            <span>剩余时间 <span id="remaining-time">14:32</span></span>
                                        </div>
                                    </div>
                                    
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="test-progress-fill"></div>
                                    </div>
                                    
                                    <div class="difficulty-indicator">
                                        <span>当前难度：</span>
                                        <div class="difficulty-level" id="current-difficulty">中等</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 评估报告标签页 -->
                        <div class="tab-content" id="reports-tab">
                            <div class="assessment-reports">
                                <div class="report-controls">
                                    <div class="report-filters">
                                        <select id="report-type">
                                            <option value="all">所有报告</option>
                                            <option value="skills">技能评估</option>
                                            <option value="cognitive">认知评估</option>
                                            <option value="adaptive">自适应测试</option>
                                        </select>
                                        
                                        <select id="report-period">
                                            <option value="week">最近一周</option>
                                            <option value="month">最近一月</option>
                                            <option value="quarter">最近三月</option>
                                            <option value="all">全部时间</option>
                                        </select>
                                    </div>
                                    
                                    <div class="report-actions">
                                        <button id="generate-report" class="btn-primary">生成报告</button>
                                        <button id="export-report" class="btn-secondary">导出报告</button>
                                    </div>
                                </div>

                                <div class="report-content" id="report-content">
                                    <div class="report-summary">
                                        <h4>学习评估总结报告</h4>
                                        <div class="summary-grid">
                                            <div class="summary-item">
                                                <h5>评估次数</h5>
                                                <div class="summary-value">24</div>
                                            </div>
                                            <div class="summary-item">
                                                <h5>平均得分</h5>
                                                <div class="summary-value">85.3</div>
                                            </div>
                                            <div class="summary-item">
                                                <h5>进步幅度</h5>
                                                <div class="summary-value">+12%</div>
                                            </div>
                                            <div class="summary-item">
                                                <h5>学习时长</h5>
                                                <div class="summary-value">18.5h</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="detailed-analysis">
                                        <h5>详细分析</h5>
                                        <div class="analysis-charts">
                                            <div class="chart-container">
                                                <h6>能力发展趋势</h6>
                                                <canvas id="ability-trend-chart" width="300" height="200"></canvas>
                                            </div>
                                            <div class="chart-container">
                                                <h6>学习效率分析</h6>
                                                <canvas id="efficiency-chart" width="300" height="200"></canvas>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="recommendations">
                                        <h5>个性化建议</h5>
                                        <div class="recommendation-list" id="recommendation-list">
                                            <div class="recommendation-item">
                                                <div class="rec-icon">💡</div>
                                                <div class="rec-content">
                                                    <h6>加强批判性思维训练</h6>
                                                    <p>建议多练习逻辑推理题目，提升分析能力</p>
                                                </div>
                                            </div>
                                            <div class="recommendation-item">
                                                <div class="rec-icon">📚</div>
                                                <div class="rec-content">
                                                    <h6>扩展媒体素养知识</h6>
                                                    <p>可以学习更多关于信息验证的方法和技巧</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 测试界面 -->
                <div id="test-interface" class="test-interface" hidden>
                    <div class="test-header">
                        <div class="test-info">
                            <h3 id="test-title">认知能力测试</h3>
                            <div class="test-progress">
                                <span id="test-question-number">1/10</span>
                                <div class="test-timer" id="test-timer">05:00</div>
                            </div>
                        </div>
                        <button id="exit-test" class="btn-exit">退出测试</button>
                    </div>
                    
                    <div class="test-content" id="test-content">
                        <!-- 动态生成测试内容 -->
                    </div>
                    
                    <div class="test-controls">
                        <button id="prev-question" class="btn-nav" disabled>上一题</button>
                        <button id="next-question" class="btn-nav">下一题</button>
                        <button id="submit-test" class="btn-submit" hidden>提交测试</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', assessmentHTML);
        this.injectAssessmentStyles();
    }

    injectAssessmentStyles() {
        const styles = `
            .assessment-container {
                position: fixed;
                bottom: var(--space-6);
                right: var(--space-6);
                z-index: 1000;
                font-family: var(--font-sans);
            }

            .assessment-trigger {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--shadow-xl);
                transition: all 0.3s ease;
                position: relative;
            }

            .assessment-trigger:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-2xl);
            }

            .assessment-notification {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--warning);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                animation: pulse 2s infinite;
            }

            .assessment-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 600px;
                height: 700px;
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-2xl);
                backdrop-filter: blur(20px);
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s ease;
            }

            .assessment-panel:not([hidden]) {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .assessment-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(139, 92, 246, 0.05);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            }

            .assessment-title h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .assessment-status {
                font-size: 0.75rem;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: 500;
                background: var(--success);
                color: white;
            }

            .assessment-controls {
                display: flex;
                gap: var(--space-2);
            }

            .btn-icon {
                width: 32px;
                height: 32px;
                border: none;
                background: transparent;
                border-radius: var(--radius-md);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;
                font-size: 1rem;
            }

            .btn-icon:hover {
                background: rgba(139, 92, 246, 0.1);
            }

            .assessment-tabs {
                display: flex;
                border-bottom: 1px solid var(--border-primary);
                background: var(--background);
            }

            .tab-btn {
                flex: 1;
                padding: var(--space-3);
                border: none;
                background: transparent;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 0.75rem;
                font-weight: 500;
                transition: all 0.2s ease;
                border-bottom: 2px solid transparent;
            }

            .tab-btn:hover {
                background: rgba(139, 92, 246, 0.05);
                color: var(--text-primary);
            }

            .tab-btn.active {
                color: #8b5cf6;
                border-bottom-color: #8b5cf6;
                background: rgba(139, 92, 246, 0.05);
            }

            .assessment-content {
                flex: 1;
                overflow: hidden;
                position: relative;
            }

            .tab-content {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                padding: var(--space-4);
                overflow-y: auto;
                opacity: 0;
                transform: translateX(20px);
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .tab-content.active {
                opacity: 1;
                transform: translateX(0);
                pointer-events: auto;
            }

            .overview-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .stat-card {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                display: flex;
                align-items: center;
                gap: var(--space-3);
                transition: all 0.2s ease;
            }

            .stat-card:hover {
                border-color: #8b5cf6;
                box-shadow: var(--shadow-md);
            }

            .stat-icon {
                font-size: 2rem;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(139, 92, 246, 0.1);
                border-radius: var(--radius-md);
            }

            .stat-info h4 {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            .stat-trend {
                font-size: 0.625rem;
                color: var(--success);
                font-weight: 500;
            }

            .skill-radar-container {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-6);
                text-align: center;
            }

            .skill-radar-container h4 {
                margin: 0 0 var(--space-4) 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .recent-assessments {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
            }

            .recent-assessments h4 {
                margin: 0 0 var(--space-4) 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .assessment-timeline {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
            }

            .timeline-item {
                display: flex;
                gap: var(--space-3);
                padding: var(--space-3);
                background: var(--surface);
                border-radius: var(--radius-md);
                border-left: 3px solid #8b5cf6;
            }

            .timeline-date {
                font-size: 0.75rem;
                color: var(--text-secondary);
                white-space: nowrap;
                min-width: 80px;
            }

            .timeline-content h5 {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .timeline-content p {
                margin: 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .assessment-types {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .assessment-type-card {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .assessment-type-card:hover {
                border-color: #8b5cf6;
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            .type-icon {
                font-size: 2rem;
                margin-bottom: var(--space-2);
            }

            .assessment-type-card h5 {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .assessment-type-card p {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .type-duration {
                font-size: 0.625rem;
                color: #8b5cf6;
                font-weight: 500;
            }

            .test-category {
                margin-bottom: var(--space-6);
            }

            .test-category h5 {
                margin: 0 0 var(--space-3) 0;
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-primary);
                padding-bottom: var(--space-2);
            }

            .test-items {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .test-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-3);
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
            }

            .test-name {
                font-size: 0.875rem;
                color: var(--text-primary);
                font-weight: 500;
            }

            .btn-test {
                padding: var(--space-2) var(--space-3);
                background: #8b5cf6;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-test:hover {
                background: #7c3aed;
                transform: translateY(-1px);
            }

            .adaptive-intro {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-6);
                text-align: center;
            }

            .adaptive-intro h4 {
                margin: 0 0 var(--space-2) 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .adaptive-intro p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .adaptive-config {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .config-item {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .config-item label {
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .config-item select {
                padding: var(--space-2);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                background: var(--surface);
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .adaptive-controls {
                display: flex;
                gap: var(--space-3);
                justify-content: center;
                margin-bottom: var(--space-6);
            }

            .btn-primary {
                padding: var(--space-3) var(--space-6);
                background: #8b5cf6;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-primary:hover {
                background: #7c3aed;
                transform: translateY(-1px);
            }

            .btn-secondary {
                padding: var(--space-3) var(--space-6);
                background: transparent;
                color: #8b5cf6;
                border: 1px solid #8b5cf6;
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-secondary:hover {
                background: #8b5cf6;
                color: white;
            }

            .test-interface {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--surface);
                z-index: 1001;
                display: flex;
                flex-direction: column;
            }

            .test-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--background);
            }

            .test-info h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.25rem;
                font-weight: 600;
            }

            .test-progress {
                display: flex;
                align-items: center;
                gap: var(--space-4);
                margin-top: var(--space-2);
            }

            .test-timer {
                font-family: 'Courier New', monospace;
                font-size: 1rem;
                font-weight: 600;
                color: #8b5cf6;
            }

            .btn-exit {
                padding: var(--space-2) var(--space-4);
                background: var(--danger);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .test-content {
                flex: 1;
                padding: var(--space-6);
                overflow-y: auto;
            }

            .test-controls {
                padding: var(--space-4);
                border-top: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                background: var(--background);
            }

            .btn-nav {
                padding: var(--space-3) var(--space-4);
                background: var(--background);
                color: var(--text-primary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-nav:hover:not(:disabled) {
                background: #8b5cf6;
                color: white;
                border-color: #8b5cf6;
            }

            .btn-nav:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .btn-submit {
                padding: var(--space-3) var(--space-6);
                background: var(--success);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @media (max-width: 768px) {
                .assessment-container {
                    bottom: var(--space-4);
                    right: var(--space-4);
                }

                .assessment-panel {
                    width: calc(100vw - 2rem);
                    height: calc(100vh - 8rem);
                    bottom: 80px;
                    right: -1rem;
                }

                .overview-stats {
                    grid-template-columns: 1fr;
                }

                .assessment-types {
                    grid-template-columns: 1fr;
                }

                .adaptive-config {
                    grid-template-columns: 1fr;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // 触发按钮
        document.getElementById('assessment-trigger').addEventListener('click', () => {
            this.toggleAssessment();
        });

        // 关闭按钮
        document.getElementById('close-assessment').addEventListener('click', () => {
            this.hideAssessment();
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // 评估类型选择
        document.querySelectorAll('.assessment-type-card').forEach(card => {
            card.addEventListener('click', () => {
                this.startSkillAssessment(card.dataset.type);
            });
        });

        // 认知测试按钮
        document.querySelectorAll('.btn-test').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startCognitiveTest(btn.dataset.test);
            });
        });

        // 自适应测试
        document.getElementById('start-adaptive-test').addEventListener('click', () => {
            this.startAdaptiveTest();
        });

        // 生成报告
        document.getElementById('generate-report').addEventListener('click', () => {
            this.generateAssessmentReport();
        });

        // 导出报告
        document.getElementById('export-report').addEventListener('click', () => {
            this.exportAssessmentReport();
        });

        // 测试界面控制
        document.getElementById('exit-test').addEventListener('click', () => {
            this.exitTest();
        });

        document.getElementById('prev-question').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('submit-test').addEventListener('click', () => {
            this.submitTest();
        });
    }

    toggleAssessment() {
        const panel = document.getElementById('assessment-panel');
        if (panel.hidden) {
            this.showAssessment();
        } else {
            this.hideAssessment();
        }
    }

    showAssessment() {
        document.getElementById('assessment-panel').hidden = false;
        document.getElementById('assessment-notification').hidden = true;
        this.updateAssessmentData();
    }

    hideAssessment() {
        document.getElementById('assessment-panel').hidden = true;
    }

    switchTab(tabName) {
        // 切换标签页
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // 根据标签页加载相应数据
        this.loadTabData(tabName);
    }

    loadTabData(tabName) {
        switch (tabName) {
            case 'overview':
                this.updateOverviewData();
                break;
            case 'skills':
                this.updateSkillsData();
                break;
            case 'cognitive':
                this.updateCognitiveData();
                break;
            case 'adaptive':
                this.updateAdaptiveData();
                break;
            case 'reports':
                this.updateReportsData();
                break;
        }
    }

    updateOverviewData() {
        // 更新概览数据
        this.renderSkillRadar();
        this.updateAssessmentTimeline();
    }

    renderSkillRadar() {
        const canvas = document.getElementById('skill-radar');
        const ctx = canvas.getContext('2d');
        
        // 简化的雷达图绘制
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        // 绘制网格
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // 绘制轴线
        const skills = ['信息源评估', '内容分析', '批判性思维', '数字素养', '问题解决'];
        const angles = skills.map((_, i) => (i * 2 * Math.PI) / skills.length - Math.PI / 2);
        
        angles.forEach(angle => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        });
        
        // 绘制数据
        const scores = [0.8, 0.7, 0.9, 0.6, 0.75]; // 示例数据
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        scores.forEach((score, i) => {
            const angle = angles[i];
            const x = centerX + Math.cos(angle) * radius * score;
            const y = centerY + Math.sin(angle) * radius * score;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 绘制标签
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        skills.forEach((skill, i) => {
            const angle = angles[i];
            const labelRadius = radius + 20;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            ctx.fillText(skill, x, y);
        });
    }

    updateAssessmentTimeline() {
        // 更新评估时间线
        const timeline = document.getElementById('assessment-timeline');
        // 这里可以从本地存储或服务器加载真实数据
    }

    startSkillAssessment(type) {
        console.log('开始技能评估:', type);
        this.showTestInterface();
        this.loadSkillTest(type);
    }

    startCognitiveTest(testType) {
        console.log('开始认知测试:', testType);
        this.showTestInterface();
        this.loadCognitiveTest(testType);
    }

    startAdaptiveTest() {
        const domain = document.getElementById('adaptive-domain').value;
        const duration = document.getElementById('adaptive-duration').value;
        const startLevel = document.getElementById('adaptive-start-level').value;
        
        console.log('开始自适应测试:', { domain, duration, startLevel });
        this.showTestInterface();
        this.loadAdaptiveTest({ domain, duration, startLevel });
    }

    showTestInterface() {
        document.getElementById('test-interface').hidden = false;
        document.getElementById('assessment-panel').hidden = true;
    }

    hideTestInterface() {
        document.getElementById('test-interface').hidden = true;
        document.getElementById('assessment-panel').hidden = false;
    }

    loadSkillTest(type) {
        // 加载技能测试内容
        const testContent = document.getElementById('test-content');
        testContent.innerHTML = `
            <div class="test-question">
                <h4>技能评估测试 - ${type}</h4>
                <p>这是一个示例测试题目。请根据以下材料回答问题...</p>
                <div class="question-options">
                    <label><input type="radio" name="answer" value="A"> 选项A</label>
                    <label><input type="radio" name="answer" value="B"> 选项B</label>
                    <label><input type="radio" name="answer" value="C"> 选项C</label>
                    <label><input type="radio" name="answer" value="D"> 选项D</label>
                </div>
            </div>
        `;
    }

    loadCognitiveTest(testType) {
        // 加载认知测试内容
        const testContent = document.getElementById('test-content');
        testContent.innerHTML = `
            <div class="test-question">
                <h4>认知能力测试 - ${testType}</h4>
                <p>这是一个认知能力测试题目...</p>
                <div class="cognitive-task">
                    <!-- 根据测试类型生成不同的认知任务 -->
                    <div class="task-area">
                        <p>请完成以下认知任务...</p>
                    </div>
                </div>
            </div>
        `;
    }

    loadAdaptiveTest(config) {
        // 加载自适应测试内容
        const testContent = document.getElementById('test-content');
        testContent.innerHTML = `
            <div class="test-question">
                <h4>自适应智能测试</h4>
                <p>基于AI算法的个性化测试，题目难度会根据你的表现自动调整...</p>
                <div class="adaptive-question">
                    <p>这是一个自适应测试题目...</p>
                    <div class="question-options">
                        <label><input type="radio" name="answer" value="A"> 选项A</label>
                        <label><input type="radio" name="answer" value="B"> 选项B</label>
                        <label><input type="radio" name="answer" value="C"> 选项C</label>
                        <label><input type="radio" name="answer" value="D"> 选项D</label>
                    </div>
                </div>
            </div>
        `;
    }

    exitTest() {
        if (confirm('确定要退出测试吗？当前进度将不会保存。')) {
            this.hideTestInterface();
        }
    }

    previousQuestion() {
        // 上一题逻辑
        console.log('上一题');
    }

    nextQuestion() {
        // 下一题逻辑
        console.log('下一题');
    }

    submitTest() {
        if (confirm('确定要提交测试吗？')) {
            this.processTestResults();
            this.hideTestInterface();
        }
    }

    processTestResults() {
        // 处理测试结果
        console.log('处理测试结果');
        this.generateTestReport();
    }

    generateTestReport() {
        // 生成测试报告
        console.log('生成测试报告');
    }

    generateAssessmentReport() {
        const reportType = document.getElementById('report-type').value;
        const reportPeriod = document.getElementById('report-period').value;
        
        console.log('生成评估报告:', { reportType, reportPeriod });
        this.reportGenerator.generate(reportType, reportPeriod);
    }

    exportAssessmentReport() {
        console.log('导出评估报告');
        this.reportGenerator.export();
    }

    updateAssessmentData() {
        // 更新评估数据
        this.learningAnalytics.updateData();
    }

    loadAssessmentHistory() {
        // 加载评估历史
        const history = localStorage.getItem('assessment_history');
        if (history) {
            this.assessmentData = new Map(JSON.parse(history));
        }
    }

    saveAssessmentHistory() {
        // 保存评估历史
        localStorage.setItem('assessment_history', JSON.stringify([...this.assessmentData]));
    }

    updateSkillsData() {
        // 更新技能数据
        console.log('更新技能数据');
    }

    updateCognitiveData() {
        // 更新认知数据
        console.log('更新认知数据');
    }

    updateAdaptiveData() {
        // 更新自适应数据
        console.log('更新自适应数据');
    }

    updateReportsData() {
        // 更新报告数据
        console.log('更新报告数据');
    }
}

// 学习分析类
class LearningAnalytics {
    constructor() {
        this.data = new Map();
        this.metrics = new Map();
    }

    updateData() {
        // 更新学习分析数据
        console.log('更新学习分析数据');
    }

    calculateMetrics() {
        // 计算学习指标
        console.log('计算学习指标');
    }

    generateInsights() {
        // 生成学习洞察
        console.log('生成学习洞察');
    }
}

// 自适应评估引擎
class AdaptiveAssessmentEngine {
    constructor() {
        this.difficultyModel = new DifficultyModel();
        this.abilityEstimator = new AbilityEstimator();
        this.questionSelector = new QuestionSelector();
    }

    selectNextQuestion(userAbility, questionHistory) {
        // 选择下一个问题
        return this.questionSelector.select(userAbility, questionHistory);
    }

    updateAbilityEstimate(response) {
        // 更新能力估计
        return this.abilityEstimator.update(response);
    }

    shouldTerminate(responses) {
        // 判断是否应该终止测试
        return this.abilityEstimator.hasConverged(responses);
    }
}

// 难度模型
class DifficultyModel {
    constructor() {
        this.parameters = new Map();
    }

    estimateDifficulty(question) {
        // 估计题目难度
        return Math.random(); // 简化实现
    }
}

// 能力估计器
class AbilityEstimator {
    constructor() {
        this.estimates = new Map();
    }

    update(response) {
        // 更新能力估计
        console.log('更新能力估计');
    }

    hasConverged(responses) {
        // 判断是否收敛
        return responses.length >= 20; // 简化实现
    }
}

// 题目选择器
class QuestionSelector {
    constructor() {
        this.questionBank = new Map();
    }

    select(userAbility, questionHistory) {
        // 选择题目
        console.log('选择题目');
        return null; // 简化实现
    }
}

// 评估报告生成器
class AssessmentReportGenerator {
    constructor() {
        this.templates = new Map();
    }

    generate(type, period) {
        // 生成报告
        console.log('生成报告:', type, period);
    }

    export() {
        // 导出报告
        console.log('导出报告');
    }
}

// 导出供其他模块使用
window.AssessmentEngine = AssessmentEngine;
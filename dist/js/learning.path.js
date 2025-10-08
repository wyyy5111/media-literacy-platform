// 智能学习路径推荐系统 - 国家一等奖创新功能
// 基于AI算法的个性化学习路径规划

class LearningPathRecommender {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.learningGraph = this.buildLearningGraph();
        this.adaptiveEngine = new AdaptiveLearningEngine();
        this.init();
    }

    init() {
        this.createPathUI();
        this.setupEventListeners();
        this.startAdaptiveTracking();
    }

    loadUserProfile() {
        const stored = localStorage.getItem('user_learning_profile');
        return stored ? JSON.parse(stored) : {
            learningStyle: 'visual', // visual, auditory, kinesthetic, reading
            pace: 'medium', // slow, medium, fast
            difficulty: 'adaptive', // easy, medium, hard, adaptive
            interests: [],
            strengths: [],
            weaknesses: [],
            goals: [],
            timeAvailable: 30, // minutes per session
            preferredTime: 'evening', // morning, afternoon, evening
            completedPaths: [],
            currentPath: null,
            progress: {},
            lastUpdate: Date.now()
        };
    }

    saveUserProfile() {
        this.userProfile.lastUpdate = Date.now();
        localStorage.setItem('user_learning_profile', JSON.stringify(this.userProfile));
    }

    buildLearningGraph() {
        // 构建知识图谱，定义技能之间的依赖关系
        return {
            nodes: {
                'basic-media-literacy': {
                    title: '媒体素养基础',
                    description: '了解媒体的基本概念和作用',
                    difficulty: 1,
                    estimatedTime: 15,
                    prerequisites: [],
                    skills: ['critical-thinking', 'information-awareness']
                },
                'source-evaluation': {
                    title: '信息源评估',
                    description: '学会评估信息来源的可靠性',
                    difficulty: 2,
                    estimatedTime: 20,
                    prerequisites: ['basic-media-literacy'],
                    skills: ['source-verification', 'credibility-assessment']
                },
                'fact-checking': {
                    title: '事实核查技能',
                    description: '掌握事实核查的方法和工具',
                    difficulty: 3,
                    estimatedTime: 25,
                    prerequisites: ['source-evaluation'],
                    skills: ['fact-verification', 'cross-referencing']
                },
                'bias-detection': {
                    title: '偏见识别',
                    description: '识别媒体中的各种偏见和倾向',
                    difficulty: 3,
                    estimatedTime: 30,
                    prerequisites: ['source-evaluation'],
                    skills: ['bias-recognition', 'perspective-analysis']
                },
                'misinformation-combat': {
                    title: '虚假信息对抗',
                    description: '学会识别和对抗虚假信息',
                    difficulty: 4,
                    estimatedTime: 35,
                    prerequisites: ['fact-checking', 'bias-detection'],
                    skills: ['misinformation-detection', 'counter-narrative']
                },
                'digital-citizenship': {
                    title: '数字公民素养',
                    description: '培养负责任的数字媒体使用习惯',
                    difficulty: 4,
                    estimatedTime: 40,
                    prerequisites: ['misinformation-combat'],
                    skills: ['ethical-sharing', 'digital-responsibility']
                },
                'ai-media-ethics': {
                    title: 'AI与媒体伦理',
                    description: '理解AI在媒体中的应用和伦理问题',
                    difficulty: 5,
                    estimatedTime: 45,
                    prerequisites: ['digital-citizenship'],
                    skills: ['ai-awareness', 'ethical-reasoning']
                }
            },
            edges: [
                { from: 'basic-media-literacy', to: 'source-evaluation', weight: 1 },
                { from: 'source-evaluation', to: 'fact-checking', weight: 1 },
                { from: 'source-evaluation', to: 'bias-detection', weight: 1 },
                { from: 'fact-checking', to: 'misinformation-combat', weight: 1 },
                { from: 'bias-detection', to: 'misinformation-combat', weight: 1 },
                { from: 'misinformation-combat', to: 'digital-citizenship', weight: 1 },
                { from: 'digital-citizenship', to: 'ai-media-ethics', weight: 1 }
            ]
        };
    }

    createPathUI() {
        const pathHTML = `
            <div id="learning-path-panel" class="path-panel" hidden>
                <div class="path-header">
                    <h2>🎯 智能学习路径</h2>
                    <div class="path-controls">
                        <button class="btn secondary" id="customize-path">自定义路径</button>
                        <button class="btn secondary" id="reset-path">重置路径</button>
                        <button class="btn" id="close-path">×</button>
                    </div>
                </div>
                
                <div class="path-content">
                    <!-- 学习风格测试 -->
                    <div class="path-section" id="learning-style-section">
                        <h3>📋 学习风格评估</h3>
                        <div class="style-assessment">
                            <p>为了为您推荐最适合的学习路径，请完成以下简短评估：</p>
                            <div class="assessment-questions" id="assessment-questions"></div>
                            <button class="btn primary" id="complete-assessment">完成评估</button>
                        </div>
                    </div>

                    <!-- 推荐路径 -->
                    <div class="path-section" id="recommended-paths" hidden>
                        <h3>🚀 推荐学习路径</h3>
                        <div class="paths-grid" id="paths-grid"></div>
                    </div>

                    <!-- 当前路径进度 -->
                    <div class="path-section" id="current-progress" hidden>
                        <h3>📈 当前进度</h3>
                        <div class="progress-visualization" id="progress-viz"></div>
                        <div class="next-steps" id="next-steps"></div>
                    </div>

                    <!-- 学习计划 -->
                    <div class="path-section" id="learning-schedule" hidden>
                        <h3>📅 学习计划</h3>
                        <div class="schedule-grid" id="schedule-grid"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', pathHTML);
        this.injectPathStyles();
    }

    injectPathStyles() {
        const styles = `
            .path-panel {
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

            .path-panel:not([hidden]) {
                opacity: 1;
            }

            .path-header {
                background: var(--surface);
                border-bottom: 1px solid var(--border-primary);
                padding: var(--space-4) var(--space-6);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .path-content {
                flex: 1;
                padding: var(--space-6);
                overflow-y: auto;
                background: var(--background);
            }

            .path-section {
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                padding: var(--space-6);
                margin-bottom: var(--space-6);
                box-shadow: var(--shadow-lg);
            }

            .path-section h3 {
                margin: 0 0 var(--space-4) 0;
                color: var(--text-primary);
                font-size: 1.25rem;
                font-weight: 600;
            }

            .assessment-questions {
                space-y: var(--space-4);
                margin: var(--space-4) 0;
            }

            .question-item {
                padding: var(--space-4);
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-4);
            }

            .question-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-3);
            }

            .question-options {
                display: grid;
                gap: var(--space-2);
            }

            .option-item {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                padding: var(--space-2);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .option-item:hover {
                background: rgba(59, 130, 246, 0.1);
            }

            .paths-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--space-4);
            }

            .path-card {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .path-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-xl);
                border-color: var(--accent-primary);
            }

            .path-card.recommended {
                border-color: var(--success);
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
            }

            .path-card.recommended::before {
                content: '推荐';
                position: absolute;
                top: var(--space-2);
                right: var(--space-2);
                background: var(--success);
                color: white;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
            }

            .path-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-2);
            }

            .path-description {
                color: var(--text-secondary);
                font-size: 0.875rem;
                line-height: 1.5;
                margin-bottom: var(--space-3);
            }

            .path-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .path-difficulty {
                display: flex;
                align-items: center;
                gap: var(--space-1);
            }

            .difficulty-stars {
                color: var(--warning);
            }

            .progress-visualization {
                position: relative;
                height: 300px;
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                overflow: hidden;
                margin-bottom: var(--space-4);
            }

            .progress-node {
                position: absolute;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.875rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid;
            }

            .progress-node.completed {
                background: var(--success);
                border-color: var(--success);
                color: white;
            }

            .progress-node.current {
                background: var(--accent-primary);
                border-color: var(--accent-primary);
                color: white;
                animation: pulse 2s infinite;
            }

            .progress-node.locked {
                background: var(--surface);
                border-color: var(--border-primary);
                color: var(--text-secondary);
            }

            .progress-connection {
                position: absolute;
                height: 2px;
                background: var(--border-primary);
                z-index: -1;
            }

            .progress-connection.completed {
                background: var(--success);
            }

            .next-steps {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
            }

            .next-step-item {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-2);
                background: rgba(59, 130, 246, 0.05);
                border: 1px solid rgba(59, 130, 246, 0.2);
            }

            .step-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--accent-primary);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .step-content {
                flex: 1;
            }

            .step-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            .step-description {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .schedule-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: var(--space-2);
                margin-top: var(--space-4);
            }

            .schedule-day {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                padding: var(--space-3);
                text-align: center;
                min-height: 100px;
            }

            .schedule-day.today {
                border-color: var(--accent-primary);
                background: rgba(59, 130, 246, 0.1);
            }

            .day-header {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-2);
                font-size: 0.875rem;
            }

            .day-tasks {
                space-y: var(--space-1);
            }

            .task-item {
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: var(--radius-sm);
                padding: var(--space-1) var(--space-2);
                font-size: 0.75rem;
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @media (max-width: 768px) {
                .paths-grid {
                    grid-template-columns: 1fr;
                }
                
                .schedule-grid {
                    grid-template-columns: 1fr;
                }
                
                .path-content {
                    padding: var(--space-4);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        document.getElementById('close-path').addEventListener('click', () => {
            this.hidePathPanel();
        });

        document.getElementById('complete-assessment').addEventListener('click', () => {
            this.completeAssessment();
        });

        document.getElementById('customize-path').addEventListener('click', () => {
            this.showCustomizationDialog();
        });

        document.getElementById('reset-path').addEventListener('click', () => {
            if (confirm('确定要重置学习路径吗？这将清除所有进度。')) {
                this.resetLearningPath();
            }
        });
    }

    showPathPanel() {
        document.getElementById('learning-path-panel').hidden = false;
        document.body.style.overflow = 'hidden';
        
        if (!this.userProfile.learningStyle || this.userProfile.learningStyle === 'unknown') {
            this.showAssessment();
        } else {
            this.showRecommendedPaths();
        }
    }

    hidePathPanel() {
        document.getElementById('learning-path-panel').hidden = true;
        document.body.style.overflow = '';
    }

    showAssessment() {
        const questions = [
            {
                id: 'learning_preference',
                title: '您更喜欢哪种学习方式？',
                options: [
                    { value: 'visual', text: '通过图表、图像和视觉材料学习' },
                    { value: 'auditory', text: '通过听讲和讨论学习' },
                    { value: 'kinesthetic', text: '通过实践和动手操作学习' },
                    { value: 'reading', text: '通过阅读文字材料学习' }
                ]
            },
            {
                id: 'pace_preference',
                title: '您希望的学习节奏是？',
                options: [
                    { value: 'slow', text: '慢节奏，深入理解每个概念' },
                    { value: 'medium', text: '中等节奏，平衡理解和进度' },
                    { value: 'fast', text: '快节奏，快速掌握核心要点' }
                ]
            },
            {
                id: 'time_available',
                title: '您每次学习的时间通常是？',
                options: [
                    { value: '15', text: '15分钟以内' },
                    { value: '30', text: '15-30分钟' },
                    { value: '45', text: '30-45分钟' },
                    { value: '60', text: '45分钟以上' }
                ]
            },
            {
                id: 'difficulty_preference',
                title: '您希望的难度设置是？',
                options: [
                    { value: 'easy', text: '简单模式，循序渐进' },
                    { value: 'medium', text: '中等难度，适度挑战' },
                    { value: 'hard', text: '困难模式，高强度训练' },
                    { value: 'adaptive', text: '自适应难度，根据表现调整' }
                ]
            }
        ];

        const questionsHTML = questions.map(q => `
            <div class="question-item">
                <div class="question-title">${q.title}</div>
                <div class="question-options">
                    ${q.options.map(opt => `
                        <label class="option-item">
                            <input type="radio" name="${q.id}" value="${opt.value}">
                            <span>${opt.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.getElementById('assessment-questions').innerHTML = questionsHTML;
        document.getElementById('learning-style-section').hidden = false;
    }

    completeAssessment() {
        const formData = new FormData();
        const questions = document.querySelectorAll('#assessment-questions input[type="radio"]:checked');
        
        if (questions.length < 4) {
            alert('请完成所有评估问题');
            return;
        }

        questions.forEach(input => {
            const name = input.name;
            const value = input.value;
            
            switch (name) {
                case 'learning_preference':
                    this.userProfile.learningStyle = value;
                    break;
                case 'pace_preference':
                    this.userProfile.pace = value;
                    break;
                case 'time_available':
                    this.userProfile.timeAvailable = parseInt(value);
                    break;
                case 'difficulty_preference':
                    this.userProfile.difficulty = value;
                    break;
            }
        });

        this.saveUserProfile();
        this.showRecommendedPaths();
    }

    showRecommendedPaths() {
        document.getElementById('learning-style-section').hidden = true;
        document.getElementById('recommended-paths').hidden = false;
        
        const recommendedPaths = this.generateRecommendedPaths();
        const pathsHTML = recommendedPaths.map((path, index) => `
            <div class="path-card ${index === 0 ? 'recommended' : ''}" data-path-id="${path.id}">
                <div class="path-title">${path.title}</div>
                <div class="path-description">${path.description}</div>
                <div class="path-meta">
                    <div class="path-difficulty">
                        <span>难度:</span>
                        <span class="difficulty-stars">${'★'.repeat(path.difficulty)}${'☆'.repeat(5 - path.difficulty)}</span>
                    </div>
                    <div class="path-duration">${path.estimatedTime}分钟</div>
                </div>
            </div>
        `).join('');

        document.getElementById('paths-grid').innerHTML = pathsHTML;

        // 添加路径选择事件
        document.querySelectorAll('.path-card').forEach(card => {
            card.addEventListener('click', () => {
                const pathId = card.dataset.pathId;
                this.selectLearningPath(pathId);
            });
        });

        if (this.userProfile.currentPath) {
            this.showCurrentProgress();
        }
    }

    generateRecommendedPaths() {
        const profile = this.userProfile;
        const paths = [];

        // 基于用户画像生成个性化路径
        if (profile.learningStyle === 'visual') {
            paths.push({
                id: 'visual-media-literacy',
                title: '视觉化媒体素养路径',
                description: '通过图表、信息图和视觉案例学习媒体素养技能',
                difficulty: profile.difficulty === 'easy' ? 2 : profile.difficulty === 'hard' ? 4 : 3,
                estimatedTime: profile.timeAvailable,
                modules: ['basic-media-literacy', 'source-evaluation', 'bias-detection']
            });
        }

        if (profile.pace === 'fast') {
            paths.push({
                id: 'intensive-bootcamp',
                title: '媒体素养强化训练营',
                description: '高强度、快节奏的综合训练，快速提升媒体素养',
                difficulty: 4,
                estimatedTime: Math.min(profile.timeAvailable * 1.5, 60),
                modules: ['fact-checking', 'misinformation-combat', 'ai-media-ethics']
            });
        }

        // 默认推荐路径
        paths.push({
            id: 'comprehensive-journey',
            title: '全面媒体素养之旅',
            description: '系统性学习媒体素养的各个方面，适合所有学习者',
            difficulty: 3,
            estimatedTime: profile.timeAvailable,
            modules: Object.keys(this.learningGraph.nodes)
        });

        if (profile.learningStyle === 'kinesthetic') {
            paths.push({
                id: 'hands-on-practice',
                title: '实践导向学习路径',
                description: '通过大量实际案例和互动练习掌握媒体素养技能',
                difficulty: 3,
                estimatedTime: profile.timeAvailable + 15,
                modules: ['fact-checking', 'source-evaluation', 'misinformation-combat']
            });
        }

        return paths;
    }

    selectLearningPath(pathId) {
        this.userProfile.currentPath = pathId;
        this.userProfile.progress = {};
        this.saveUserProfile();
        this.showCurrentProgress();
        this.generateLearningSchedule();
    }

    showCurrentProgress() {
        document.getElementById('current-progress').hidden = false;
        document.getElementById('learning-schedule').hidden = false;
        
        this.renderProgressVisualization();
        this.renderNextSteps();
    }

    renderProgressVisualization() {
        const container = document.getElementById('progress-viz');
        const currentPath = this.getCurrentPathData();
        
        if (!currentPath) return;

        // 创建进度节点的可视化
        const nodes = currentPath.modules.map((moduleId, index) => {
            const module = this.learningGraph.nodes[moduleId];
            const progress = this.userProfile.progress[moduleId] || 0;
            
            let status = 'locked';
            if (progress >= 100) status = 'completed';
            else if (progress > 0) status = 'current';
            else if (index === 0 || this.isModuleUnlocked(moduleId)) status = 'current';

            return {
                id: moduleId,
                title: module.title,
                status: status,
                progress: progress,
                x: 50 + (index % 3) * 150,
                y: 50 + Math.floor(index / 3) * 100
            };
        });

        const nodesHTML = nodes.map(node => `
            <div class="progress-node ${node.status}" 
                 style="left: ${node.x}px; top: ${node.y}px;"
                 title="${node.title} (${node.progress}%)">
                ${node.status === 'completed' ? '✓' : node.status === 'current' ? '●' : '○'}
            </div>
        `).join('');

        container.innerHTML = nodesHTML;
    }

    renderNextSteps() {
        const container = document.getElementById('next-steps');
        const nextSteps = this.getNextSteps();

        const stepsHTML = nextSteps.map((step, index) => `
            <div class="next-step-item">
                <div class="step-icon">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <h4>接下来的学习步骤：</h4>
            ${stepsHTML}
        `;
    }

    getNextSteps() {
        const currentPath = this.getCurrentPathData();
        if (!currentPath) return [];

        const nextModules = currentPath.modules.filter(moduleId => {
            const progress = this.userProfile.progress[moduleId] || 0;
            return progress < 100 && this.isModuleUnlocked(moduleId);
        }).slice(0, 3);

        return nextModules.map(moduleId => {
            const module = this.learningGraph.nodes[moduleId];
            return {
                title: module.title,
                description: module.description,
                estimatedTime: module.estimatedTime
            };
        });
    }

    getCurrentPathData() {
        const pathId = this.userProfile.currentPath;
        if (!pathId) return null;

        // 这里应该从路径数据中获取，简化处理
        return {
            id: pathId,
            modules: Object.keys(this.learningGraph.nodes)
        };
    }

    isModuleUnlocked(moduleId) {
        const module = this.learningGraph.nodes[moduleId];
        if (!module.prerequisites.length) return true;

        return module.prerequisites.every(prereqId => {
            const progress = this.userProfile.progress[prereqId] || 0;
            return progress >= 80; // 80%完成度解锁下一个模块
        });
    }

    generateLearningSchedule() {
        const schedule = this.createWeeklySchedule();
        this.renderSchedule(schedule);
    }

    createWeeklySchedule() {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const schedule = {};

        days.forEach((day, index) => {
            schedule[day] = {
                tasks: this.generateDailyTasks(index),
                isToday: this.isToday(index)
            };
        });

        return schedule;
    }

    generateDailyTasks(dayIndex) {
        const tasks = [];
        const currentPath = this.getCurrentPathData();
        
        if (!currentPath) return tasks;

        // 根据用户偏好和进度生成每日任务
        const availableTime = this.userProfile.timeAvailable;
        const nextModules = this.getNextSteps().slice(0, 2);

        nextModules.forEach(module => {
            if (dayIndex % 2 === 0) { // 隔天安排任务
                tasks.push({
                    title: module.title,
                    type: 'learning',
                    duration: Math.min(module.estimatedTime || 20, availableTime)
                });
            }
        });

        return tasks;
    }

    isToday(dayIndex) {
        const today = new Date().getDay();
        return (today === 0 ? 6 : today - 1) === dayIndex; // 转换为周一开始
    }

    renderSchedule(schedule) {
        const container = document.getElementById('schedule-grid');
        
        const scheduleHTML = Object.entries(schedule).map(([day, data]) => `
            <div class="schedule-day ${data.isToday ? 'today' : ''}">
                <div class="day-header">${day}</div>
                <div class="day-tasks">
                    ${data.tasks.map(task => `
                        <div class="task-item">${task.title}</div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = scheduleHTML;
    }

    // 记录学习进度
    recordProgress(moduleId, progressPercent) {
        this.userProfile.progress[moduleId] = progressPercent;
        this.saveUserProfile();
        
        // 更新可视化
        if (!document.getElementById('current-progress').hidden) {
            this.renderProgressVisualization();
            this.renderNextSteps();
        }
    }

    // 获取个性化建议
    getPersonalizedRecommendations() {
        const recommendations = [];
        const profile = this.userProfile;

        // 基于学习风格的建议
        if (profile.learningStyle === 'visual') {
            recommendations.push('建议多使用图表和信息图来理解复杂概念');
        }

        // 基于进度的建议
        const completedModules = Object.keys(profile.progress).filter(
            moduleId => profile.progress[moduleId] >= 100
        ).length;

        if (completedModules === 0) {
            recommendations.push('建议从基础模块开始，打好扎实的基础');
        } else if (completedModules >= 3) {
            recommendations.push('您的进步很好！可以尝试更有挑战性的内容');
        }

        return recommendations;
    }

    resetLearningPath() {
        this.userProfile.currentPath = null;
        this.userProfile.progress = {};
        this.userProfile.completedPaths = [];
        this.saveUserProfile();
        this.showRecommendedPaths();
    }

    startAdaptiveTracking() {
        // 实时监控学习行为，动态调整路径
        this.setupPerformanceTracking();
    }

    setupPerformanceTracking() {
        // 监控答题准确率、用时等指标
        document.addEventListener('quiz-completed', (e) => {
            const { moduleId, score, timeSpent } = e.detail;
            this.adaptiveEngine.updatePerformance(moduleId, score, timeSpent);
            this.adjustLearningPath();
        });
    }

    adjustLearningPath() {
        // 基于表现动态调整学习路径
        const performance = this.adaptiveEngine.getPerformanceAnalysis();
        
        if (performance.averageScore < 60) {
            // 降低难度，增加基础练习
            this.userProfile.difficulty = 'easy';
        } else if (performance.averageScore > 90) {
            // 提高难度，跳过简单内容
            this.userProfile.difficulty = 'hard';
        }

        this.saveUserProfile();
    }
}

// 自适应学习引擎
class AdaptiveLearningEngine {
    constructor() {
        this.performanceData = this.loadPerformanceData();
    }

    loadPerformanceData() {
        const stored = localStorage.getItem('adaptive_performance_data');
        return stored ? JSON.parse(stored) : {
            modulePerformance: {},
            overallTrends: [],
            lastUpdate: Date.now()
        };
    }

    savePerformanceData() {
        this.performanceData.lastUpdate = Date.now();
        localStorage.setItem('adaptive_performance_data', JSON.stringify(this.performanceData));
    }

    updatePerformance(moduleId, score, timeSpent) {
        if (!this.performanceData.modulePerformance[moduleId]) {
            this.performanceData.modulePerformance[moduleId] = {
                attempts: 0,
                totalScore: 0,
                totalTime: 0,
                trend: []
            };
        }

        const moduleData = this.performanceData.modulePerformance[moduleId];
        moduleData.attempts++;
        moduleData.totalScore += score;
        moduleData.totalTime += timeSpent;
        moduleData.trend.push({ score, timeSpent, timestamp: Date.now() });

        // 保持最近10次记录
        if (moduleData.trend.length > 10) {
            moduleData.trend = moduleData.trend.slice(-10);
        }

        this.savePerformanceData();
    }

    getPerformanceAnalysis() {
        const modules = Object.keys(this.performanceData.modulePerformance);
        if (modules.length === 0) {
            return { averageScore: 0, averageTime: 0, improvement: 0 };
        }

        let totalScore = 0;
        let totalTime = 0;
        let totalAttempts = 0;

        modules.forEach(moduleId => {
            const data = this.performanceData.modulePerformance[moduleId];
            totalScore += data.totalScore;
            totalTime += data.totalTime;
            totalAttempts += data.attempts;
        });

        return {
            averageScore: totalAttempts > 0 ? totalScore / totalAttempts : 0,
            averageTime: totalAttempts > 0 ? totalTime / totalAttempts : 0,
            improvement: this.calculateImprovement()
        };
    }

    calculateImprovement() {
        // 计算最近的改进趋势
        const recentScores = [];
        Object.values(this.performanceData.modulePerformance).forEach(moduleData => {
            if (moduleData.trend.length >= 2) {
                const recent = moduleData.trend.slice(-3);
                recentScores.push(...recent.map(t => t.score));
            }
        });

        if (recentScores.length < 4) return 0;

        const firstHalf = recentScores.slice(0, Math.floor(recentScores.length / 2));
        const secondHalf = recentScores.slice(Math.floor(recentScores.length / 2));

        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

        return secondAvg - firstAvg;
    }
}

// 导出供其他模块使用
window.LearningPathRecommender = LearningPathRecommender;
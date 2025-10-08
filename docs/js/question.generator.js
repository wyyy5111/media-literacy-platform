// 智能题目生成器 - 国家一等奖创新功能
// 基于AI算法动态生成个性化题目

class QuestionGenerator {
    constructor() {
        this.templates = this.loadQuestionTemplates();
        this.contentDatabase = this.buildContentDatabase();
        this.userProfile = this.loadUserProfile();
        this.difficultyEngine = new DifficultyEngine();
        this.adaptiveAlgorithm = new AdaptiveAlgorithm();
        this.init();
    }

    init() {
        this.createGeneratorUI();
        this.setupEventListeners();
        this.initializeMLModels();
    }

    loadQuestionTemplates() {
        return {
            sourceCredibility: {
                patterns: [
                    {
                        type: 'multiple-choice',
                        template: '以下哪个信息源在报道{topic}时最可信？',
                        options: [
                            '{authoritative_source}',
                            '{questionable_source}',
                            '{biased_source}',
                            '{unreliable_source}'
                        ],
                        correctAnswer: 0,
                        explanation: '权威机构通常具有专业性和公信力，在{topic}领域有丰富经验。'
                    },
                    {
                        type: 'scenario',
                        template: '你在社交媒体上看到一条关于{topic}的消息，发布者是{source_type}。你会如何验证这条信息？',
                        evaluation: 'critical-thinking',
                        keyPoints: ['检查发布者背景', '寻找原始来源', '交叉验证信息']
                    }
                ]
            },
            biasDetection: {
                patterns: [
                    {
                        type: 'text-analysis',
                        template: '阅读以下关于{topic}的新闻片段，识别其中可能存在的偏见：\n\n"{biased_text}"\n\n这段文字主要体现了什么类型的偏见？',
                        options: [
                            '政治立场偏见',
                            '商业利益偏见',
                            '文化偏见',
                            '确认偏误'
                        ],
                        analysis: 'bias-indicators'
                    }
                ]
            },
            factChecking: {
                patterns: [
                    {
                        type: 'verification',
                        template: '某网站声称"{claim}"，请设计一个验证这一说法的步骤。',
                        expectedSteps: [
                            '查找原始数据来源',
                            '检查统计方法',
                            '寻找专家意见',
                            '对比其他研究'
                        ]
                    }
                ]
            },
            mediaManipulation: {
                patterns: [
                    {
                        type: 'image-analysis',
                        template: '观察这张关于{topic}的图片，判断是否存在以下哪种操作痕迹？',
                        imageTypes: ['photoshopped', 'context-manipulation', 'selective-framing'],
                        skills: ['visual-literacy', 'technical-analysis']
                    }
                ]
            }
        };
    }

    buildContentDatabase() {
        return {
            topics: {
                health: {
                    keywords: ['疫苗', '药物', '治疗', '疾病', '健康'],
                    authoritativeSources: ['世界卫生组织', '国家卫健委', '医学期刊'],
                    questionableSources: ['健康博主', '养生公众号', '民间偏方'],
                    commonMisinfo: ['疫苗有害论', '神奇疗法', '阴谋论'],
                    factCheckSites: ['丁香医生', 'WebMD', 'Mayo Clinic']
                },
                politics: {
                    keywords: ['政策', '选举', '政府', '法律', '社会'],
                    authoritativeSources: ['官方媒体', '政府网站', '学术机构'],
                    questionableSources: ['个人博客', '匿名爆料', '极端媒体'],
                    commonMisinfo: ['假民调', '断章取义', '煽动言论'],
                    factCheckSites: ['Snopes', 'FactCheck.org', 'PolitiFact']
                },
                technology: {
                    keywords: ['AI', '科技', '创新', '数据', '隐私'],
                    authoritativeSources: ['科技期刊', '研究机构', '专业媒体'],
                    questionableSources: ['科技博主', '营销文章', '炒作媒体'],
                    commonMisinfo: ['技术恐慌', '夸大宣传', '隐私误解'],
                    factCheckSites: ['IEEE', 'Nature', 'Science']
                },
                environment: {
                    keywords: ['气候', '环保', '污染', '能源', '生态'],
                    authoritativeSources: ['环保部门', '科研院所', '国际组织'],
                    questionableSources: ['环保激进组织', '利益相关企业', '伪科学网站'],
                    commonMisinfo: ['气候否认', '绿色洗白', '环保谣言'],
                    factCheckSites: ['IPCC', 'EPA', 'NASA Climate']
                }
            },
            scenarios: {
                socialMedia: [
                    '朋友圈转发的健康提醒',
                    '微博热搜的突发新闻',
                    '抖音上的生活小贴士',
                    'B站up主的科普视频'
                ],
                news: [
                    '电视新闻的专题报道',
                    '报纸的头版新闻',
                    '网络媒体的深度调查',
                    '自媒体的独家爆料'
                ],
                academic: [
                    '学术论文的研究结论',
                    '专家访谈的观点',
                    '会议报告的数据',
                    '教科书的理论阐述'
                ]
            }
        };
    }

    loadUserProfile() {
        const stored = localStorage.getItem('user_learning_profile');
        return stored ? JSON.parse(stored) : {
            level: 'beginner',
            strengths: [],
            weaknesses: [],
            interests: [],
            learningStyle: 'visual',
            completedTopics: [],
            errorPatterns: [],
            responseTime: [],
            engagement: 0.5
        };
    }

    saveUserProfile() {
        localStorage.setItem('user_learning_profile', JSON.stringify(this.userProfile));
    }

    createGeneratorUI() {
        const generatorHTML = `
            <div id="question-generator" class="generator-container" hidden>
                <div class="generator-header">
                    <h3>智能题目生成器</h3>
                    <button id="close-generator" class="btn-close">×</button>
                </div>
                
                <div class="generator-content">
                    <div class="generation-options">
                        <div class="option-group">
                            <label>题目类型：</label>
                            <select id="question-type">
                                <option value="adaptive">智能适配</option>
                                <option value="source-credibility">信息源可信度</option>
                                <option value="bias-detection">偏见识别</option>
                                <option value="fact-checking">事实核查</option>
                                <option value="media-manipulation">媒体操控</option>
                            </select>
                        </div>
                        
                        <div class="option-group">
                            <label>难度级别：</label>
                            <select id="difficulty-level">
                                <option value="auto">自动调节</option>
                                <option value="beginner">初级</option>
                                <option value="intermediate">中级</option>
                                <option value="advanced">高级</option>
                                <option value="expert">专家</option>
                            </select>
                        </div>
                        
                        <div class="option-group">
                            <label>主题领域：</label>
                            <select id="topic-area">
                                <option value="random">随机选择</option>
                                <option value="health">健康医疗</option>
                                <option value="politics">政治社会</option>
                                <option value="technology">科技创新</option>
                                <option value="environment">环境生态</option>
                            </select>
                        </div>
                        
                        <div class="option-group">
                            <label>题目数量：</label>
                            <input type="range" id="question-count" min="1" max="20" value="5">
                            <span id="count-display">5</span>
                        </div>
                    </div>
                    
                    <div class="generation-controls">
                        <button id="generate-questions" class="btn-primary">生成题目</button>
                        <button id="preview-questions" class="btn-secondary">预览模式</button>
                        <button id="export-questions" class="btn-outline">导出题目</button>
                    </div>
                    
                    <div class="generation-progress" id="generation-progress" hidden>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <div class="progress-text" id="progress-text">正在生成题目...</div>
                    </div>
                    
                    <div class="generated-questions" id="generated-questions"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', generatorHTML);
        this.injectGeneratorStyles();
    }

    injectGeneratorStyles() {
        const styles = `
            .generator-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-2xl);
                backdrop-filter: blur(20px);
                z-index: 1001;
                overflow: hidden;
            }

            .generator-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                color: white;
            }

            .generator-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }

            .btn-close {
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;
            }

            .btn-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .generator-content {
                padding: var(--space-6);
                max-height: calc(90vh - 80px);
                overflow-y: auto;
            }

            .generation-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .option-group {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .option-group label {
                font-weight: 600;
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .option-group select,
            .option-group input {
                padding: var(--space-3);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                background: var(--background);
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .option-group input[type="range"] {
                padding: 0;
                height: 6px;
                background: var(--border-primary);
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
            }

            .option-group input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: var(--accent-primary);
                border-radius: 50%;
                cursor: pointer;
            }

            #count-display {
                text-align: center;
                font-weight: 600;
                color: var(--accent-primary);
                font-size: 1.125rem;
            }

            .generation-controls {
                display: flex;
                gap: var(--space-3);
                margin-bottom: var(--space-6);
                flex-wrap: wrap;
            }

            .btn-primary,
            .btn-secondary,
            .btn-outline {
                padding: var(--space-3) var(--space-6);
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }

            .btn-primary {
                background: var(--accent-primary);
                color: white;
            }

            .btn-primary:hover {
                background: var(--accent-secondary);
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: var(--success);
                color: white;
            }

            .btn-secondary:hover {
                background: var(--success-dark);
                transform: translateY(-1px);
            }

            .btn-outline {
                background: transparent;
                color: var(--accent-primary);
                border-color: var(--accent-primary);
            }

            .btn-outline:hover {
                background: var(--accent-primary);
                color: white;
            }

            .generation-progress {
                margin-bottom: var(--space-6);
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: var(--border-primary);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: var(--space-2);
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .progress-text {
                text-align: center;
                color: var(--text-secondary);
                font-size: 0.875rem;
            }

            .generated-questions {
                border-top: 1px solid var(--border-primary);
                padding-top: var(--space-6);
            }

            .question-card {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-4);
                transition: all 0.2s ease;
            }

            .question-card:hover {
                border-color: var(--accent-primary);
                box-shadow: var(--shadow-md);
            }

            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-3);
            }

            .question-type-badge {
                padding: var(--space-1) var(--space-2);
                background: var(--accent-primary);
                color: white;
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 600;
            }

            .question-difficulty {
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 600;
            }

            .difficulty-beginner {
                background: var(--success);
                color: white;
            }

            .difficulty-intermediate {
                background: var(--warning);
                color: white;
            }

            .difficulty-advanced {
                background: var(--danger);
                color: white;
            }

            .question-content {
                margin-bottom: var(--space-3);
                line-height: 1.6;
            }

            .question-options {
                list-style: none;
                padding: 0;
                margin: var(--space-3) 0;
            }

            .question-options li {
                padding: var(--space-2);
                margin-bottom: var(--space-2);
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .question-options li:hover {
                background: rgba(59, 130, 246, 0.1);
                border-color: var(--accent-primary);
            }

            .question-options li.correct {
                background: rgba(34, 197, 94, 0.1);
                border-color: var(--success);
            }

            .question-explanation {
                background: rgba(59, 130, 246, 0.05);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: var(--radius-md);
                padding: var(--space-3);
                margin-top: var(--space-3);
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .question-actions {
                display: flex;
                gap: var(--space-2);
                margin-top: var(--space-3);
            }

            .btn-small {
                padding: var(--space-1) var(--space-3);
                font-size: 0.75rem;
                border-radius: var(--radius-sm);
                border: 1px solid var(--border-primary);
                background: var(--background);
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-small:hover {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }

            @media (max-width: 768px) {
                .generator-container {
                    width: 95%;
                    max-height: 95vh;
                }

                .generation-options {
                    grid-template-columns: 1fr;
                }

                .generation-controls {
                    flex-direction: column;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // 关闭按钮
        document.getElementById('close-generator').addEventListener('click', () => {
            this.hideGenerator();
        });

        // 题目数量滑块
        document.getElementById('question-count').addEventListener('input', (e) => {
            document.getElementById('count-display').textContent = e.target.value;
        });

        // 生成按钮
        document.getElementById('generate-questions').addEventListener('click', () => {
            this.generateQuestions();
        });

        // 预览按钮
        document.getElementById('preview-questions').addEventListener('click', () => {
            this.previewQuestions();
        });

        // 导出按钮
        document.getElementById('export-questions').addEventListener('click', () => {
            this.exportQuestions();
        });
    }

    showGenerator() {
        document.getElementById('question-generator').hidden = false;
    }

    hideGenerator() {
        document.getElementById('question-generator').hidden = true;
    }

    async generateQuestions() {
        const options = this.getGenerationOptions();
        const progressContainer = document.getElementById('generation-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const questionsContainer = document.getElementById('generated-questions');

        // 显示进度条
        progressContainer.hidden = false;
        questionsContainer.innerHTML = '';

        try {
            const questions = [];
            const totalQuestions = options.count;

            for (let i = 0; i < totalQuestions; i++) {
                // 更新进度
                const progress = ((i + 1) / totalQuestions) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `正在生成第 ${i + 1} 题，共 ${totalQuestions} 题...`;

                // 生成单个题目
                const question = await this.generateSingleQuestion(options);
                questions.push(question);

                // 模拟生成时间
                await this.delay(500 + Math.random() * 1000);
            }

            // 隐藏进度条
            progressContainer.hidden = true;

            // 显示生成的题目
            this.displayQuestions(questions);

            // 更新用户档案
            this.updateUserProfile(questions);

        } catch (error) {
            console.error('题目生成失败:', error);
            progressText.textContent = '生成失败，请重试';
            progressFill.style.background = 'var(--danger)';
        }
    }

    getGenerationOptions() {
        return {
            type: document.getElementById('question-type').value,
            difficulty: document.getElementById('difficulty-level').value,
            topic: document.getElementById('topic-area').value,
            count: parseInt(document.getElementById('question-count').value)
        };
    }

    async generateSingleQuestion(options) {
        // 确定题目类型
        const questionType = options.type === 'adaptive' ? 
            this.adaptiveAlgorithm.selectOptimalType(this.userProfile) : 
            options.type;

        // 确定难度级别
        const difficulty = options.difficulty === 'auto' ? 
            this.difficultyEngine.calculateOptimalDifficulty(this.userProfile) : 
            options.difficulty;

        // 选择主题
        const topic = options.topic === 'random' ? 
            this.selectRandomTopic() : 
            options.topic;

        // 获取模板
        const template = this.selectTemplate(questionType, difficulty);
        
        // 生成内容
        const content = this.generateContent(template, topic, difficulty);

        return {
            id: this.generateQuestionId(),
            type: questionType,
            difficulty: difficulty,
            topic: topic,
            template: template,
            content: content,
            metadata: {
                generatedAt: Date.now(),
                algorithm: 'adaptive-v2',
                userLevel: this.userProfile.level
            }
        };
    }

    selectTemplate(questionType, difficulty) {
        const templates = this.templates[questionType];
        if (!templates) {
            return this.templates.sourceCredibility.patterns[0];
        }

        // 根据难度选择合适的模板
        const suitableTemplates = templates.patterns.filter(template => 
            this.isTemplateSuitableForDifficulty(template, difficulty)
        );

        return suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)] || 
               templates.patterns[0];
    }

    isTemplateSuitableForDifficulty(template, difficulty) {
        const complexityMap = {
            'multiple-choice': 1,
            'scenario': 2,
            'text-analysis': 3,
            'verification': 4,
            'image-analysis': 5
        };

        const difficultyMap = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'expert': 4
        };

        const templateComplexity = complexityMap[template.type] || 1;
        const requiredComplexity = difficultyMap[difficulty] || 1;

        return Math.abs(templateComplexity - requiredComplexity) <= 1;
    }

    generateContent(template, topic, difficulty) {
        const topicData = this.contentDatabase.topics[topic];
        if (!topicData) {
            return this.generateFallbackContent(template);
        }

        const content = {
            question: this.fillTemplate(template.template, topicData, difficulty),
            type: template.type,
            options: [],
            correctAnswer: null,
            explanation: '',
            skills: template.skills || [],
            keyPoints: template.keyPoints || []
        };

        // 根据题目类型生成具体内容
        switch (template.type) {
            case 'multiple-choice':
                content.options = this.generateMultipleChoiceOptions(template, topicData);
                content.correctAnswer = template.correctAnswer || 0;
                content.explanation = this.fillTemplate(template.explanation, topicData, difficulty);
                break;

            case 'scenario':
                content.scenario = this.generateScenario(topicData);
                content.evaluation = template.evaluation;
                break;

            case 'text-analysis':
                content.text = this.generateBiasedText(topicData, difficulty);
                content.options = template.options;
                content.analysis = template.analysis;
                break;

            case 'verification':
                content.claim = this.generateClaim(topicData, difficulty);
                content.expectedSteps = template.expectedSteps;
                break;

            case 'image-analysis':
                content.imageType = template.imageTypes[Math.floor(Math.random() * template.imageTypes.length)];
                content.options = this.generateImageAnalysisOptions(template);
                break;
        }

        return content;
    }

    fillTemplate(template, topicData, difficulty) {
        let filled = template;
        
        // 替换主题相关变量
        filled = filled.replace('{topic}', this.selectRandomElement(topicData.keywords));
        filled = filled.replace('{authoritative_source}', this.selectRandomElement(topicData.authoritativeSources));
        filled = filled.replace('{questionable_source}', this.selectRandomElement(topicData.questionableSources));
        filled = filled.replace('{biased_source}', this.generateBiasedSource(topicData));
        filled = filled.replace('{unreliable_source}', this.generateUnreliableSource(topicData));
        filled = filled.replace('{source_type}', this.generateSourceType(difficulty));

        return filled;
    }

    generateMultipleChoiceOptions(template, topicData) {
        return template.options.map(option => {
            return this.fillTemplate(option, topicData, 'intermediate');
        });
    }

    generateScenario(topicData) {
        const scenarios = this.contentDatabase.scenarios;
        const scenarioTypes = Object.keys(scenarios);
        const selectedType = scenarioTypes[Math.floor(Math.random() * scenarioTypes.length)];
        return this.selectRandomElement(scenarios[selectedType]);
    }

    generateBiasedText(topicData, difficulty) {
        const biasTypes = ['emotional', 'selective', 'loaded-language', 'false-balance'];
        const selectedBias = biasTypes[Math.floor(Math.random() * biasTypes.length)];
        
        // 根据偏见类型和主题生成文本
        const templates = {
            emotional: `这个关于${this.selectRandomElement(topicData.keywords)}的决定简直是灾难性的！每个有理智的人都应该反对这种荒谬的政策。`,
            selective: `研究显示${this.selectRandomElement(topicData.keywords)}有积极效果，专家们一致认为这是正确的方向。`,
            'loaded-language': `所谓的"${this.selectRandomElement(topicData.keywords)}"实际上是一种危险的实验，威胁着我们的安全。`,
            'false-balance': `虽然99%的专家支持${this.selectRandomElement(topicData.keywords)}，但我们也要听听反对者的声音。`
        };

        return templates[selectedBias] || templates.emotional;
    }

    generateClaim(topicData, difficulty) {
        const claimTemplates = [
            `${this.selectRandomElement(topicData.keywords)}可以100%预防疾病`,
            `最新研究证明${this.selectRandomElement(topicData.keywords)}完全无效`,
            `专家警告：${this.selectRandomElement(topicData.keywords)}存在严重风险`,
            `政府隐瞒了关于${this.selectRandomElement(topicData.keywords)}的真相`
        ];

        return claimTemplates[Math.floor(Math.random() * claimTemplates.length)];
    }

    generateImageAnalysisOptions(template) {
        return [
            '图片被数字化修改',
            '图片脱离了原始语境',
            '图片使用了误导性标题',
            '图片没有明显问题'
        ];
    }

    selectRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectRandomTopic() {
        const topics = Object.keys(this.contentDatabase.topics);
        return topics[Math.floor(Math.random() * topics.length)];
    }

    generateBiasedSource(topicData) {
        return `带有明显立场的${this.selectRandomElement(topicData.questionableSources)}`;
    }

    generateUnreliableSource(topicData) {
        return `未经验证的${this.selectRandomElement(['网络传言', '匿名爆料', '小道消息'])}`;
    }

    generateSourceType(difficulty) {
        const types = {
            beginner: ['朋友', '同事', '网友'],
            intermediate: ['知名博主', '意见领袖', '自媒体'],
            advanced: ['匿名账号', '新注册用户', '可疑机构'],
            expert: ['深度伪造账号', '协调造假网络', '国外势力']
        };

        return this.selectRandomElement(types[difficulty] || types.beginner);
    }

    generateFallbackContent(template) {
        return {
            question: '请判断以下信息源的可信度',
            type: 'multiple-choice',
            options: ['非常可信', '比较可信', '不太可信', '完全不可信'],
            correctAnswer: 1,
            explanation: '评估信息源需要考虑多个因素，包括权威性、专业性和独立性。'
        };
    }

    displayQuestions(questions) {
        const container = document.getElementById('generated-questions');
        
        const questionsHTML = questions.map((question, index) => `
            <div class="question-card" data-question-id="${question.id}">
                <div class="question-header">
                    <span class="question-type-badge">${this.getTypeDisplayName(question.type)}</span>
                    <span class="question-difficulty difficulty-${question.difficulty}">
                        ${this.getDifficultyDisplayName(question.difficulty)}
                    </span>
                </div>
                
                <div class="question-content">
                    <h4>题目 ${index + 1}</h4>
                    <p>${question.content.question}</p>
                    
                    ${question.content.options.length > 0 ? `
                        <ul class="question-options">
                            ${question.content.options.map((option, i) => `
                                <li class="${i === question.content.correctAnswer ? 'correct' : ''}">${option}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    
                    ${question.content.explanation ? `
                        <div class="question-explanation">
                            <strong>解析：</strong>${question.content.explanation}
                        </div>
                    ` : ''}
                </div>
                
                <div class="question-actions">
                    <button class="btn-small" onclick="questionGenerator.editQuestion('${question.id}')">编辑</button>
                    <button class="btn-small" onclick="questionGenerator.duplicateQuestion('${question.id}')">复制</button>
                    <button class="btn-small" onclick="questionGenerator.deleteQuestion('${question.id}')">删除</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = questionsHTML;
    }

    getTypeDisplayName(type) {
        const names = {
            'source-credibility': '信息源可信度',
            'bias-detection': '偏见识别',
            'fact-checking': '事实核查',
            'media-manipulation': '媒体操控',
            'multiple-choice': '选择题',
            'scenario': '情景题',
            'text-analysis': '文本分析',
            'verification': '验证题',
            'image-analysis': '图片分析'
        };
        return names[type] || type;
    }

    getDifficultyDisplayName(difficulty) {
        const names = {
            'beginner': '初级',
            'intermediate': '中级',
            'advanced': '高级',
            'expert': '专家'
        };
        return names[difficulty] || difficulty;
    }

    generateQuestionId() {
        return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    updateUserProfile(questions) {
        // 更新用户档案，用于后续的自适应生成
        this.userProfile.completedTopics = [
            ...new Set([...this.userProfile.completedTopics, ...questions.map(q => q.topic)])
        ];
        this.saveUserProfile();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 预览模式
    previewQuestions() {
        // 实现预览功能
        console.log('预览模式');
    }

    // 导出功能
    exportQuestions() {
        const questions = this.getCurrentQuestions();
        const exportData = {
            questions: questions,
            metadata: {
                exportedAt: new Date().toISOString(),
                version: '1.0',
                generator: 'AI Question Generator'
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `questions_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getCurrentQuestions() {
        // 获取当前显示的题目
        const questionCards = document.querySelectorAll('.question-card');
        return Array.from(questionCards).map(card => ({
            id: card.dataset.questionId,
            // 其他题目数据...
        }));
    }

    // 题目编辑功能
    editQuestion(questionId) {
        console.log('编辑题目:', questionId);
        // 实现编辑功能
    }

    duplicateQuestion(questionId) {
        console.log('复制题目:', questionId);
        // 实现复制功能
    }

    deleteQuestion(questionId) {
        if (confirm('确定要删除这道题目吗？')) {
            const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
            if (questionCard) {
                questionCard.remove();
            }
        }
    }

    initializeMLModels() {
        // 初始化机器学习模型（简化版）
        console.log('初始化ML模型');
    }
}

// 难度引擎
class DifficultyEngine {
    calculateOptimalDifficulty(userProfile) {
        const { level, strengths, weaknesses, responseTime } = userProfile;
        
        // 基于用户水平的基础难度
        let baseDifficulty = this.levelToDifficulty(level);
        
        // 根据表现调整
        if (strengths.length > weaknesses.length) {
            baseDifficulty = this.increaseDifficulty(baseDifficulty);
        } else if (weaknesses.length > strengths.length) {
            baseDifficulty = this.decreaseDifficulty(baseDifficulty);
        }
        
        return baseDifficulty;
    }

    levelToDifficulty(level) {
        const mapping = {
            'beginner': 'beginner',
            'intermediate': 'intermediate',
            'advanced': 'advanced',
            'expert': 'expert'
        };
        return mapping[level] || 'intermediate';
    }

    increaseDifficulty(current) {
        const progression = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = progression.indexOf(current);
        return progression[Math.min(currentIndex + 1, progression.length - 1)];
    }

    decreaseDifficulty(current) {
        const progression = ['beginner', 'intermediate', 'advanced', 'expert'];
        const currentIndex = progression.indexOf(current);
        return progression[Math.max(currentIndex - 1, 0)];
    }
}

// 自适应算法
class AdaptiveAlgorithm {
    selectOptimalType(userProfile) {
        const { strengths, weaknesses, interests } = userProfile;
        
        // 优先选择用户薄弱的领域
        if (weaknesses.length > 0) {
            return this.mapSkillToQuestionType(weaknesses[0]);
        }
        
        // 其次选择用户感兴趣的领域
        if (interests.length > 0) {
            return this.mapTopicToQuestionType(interests[0]);
        }
        
        // 默认选择
        return 'source-credibility';
    }

    mapSkillToQuestionType(skill) {
        const mapping = {
            'source-evaluation': 'source-credibility',
            'bias-recognition': 'bias-detection',
            'fact-verification': 'fact-checking',
            'media-analysis': 'media-manipulation'
        };
        return mapping[skill] || 'source-credibility';
    }

    mapTopicToQuestionType(topic) {
        // 根据主题选择合适的题目类型
        return 'source-credibility';
    }
}

// 导出供其他模块使用
window.QuestionGenerator = QuestionGenerator;
// AI智能助手系统 - 国家一等奖创新功能
// 提供智能问答、学习指导和个性化建议

class AIAssistant {
    constructor() {
        this.isActive = false;
        this.conversationHistory = this.loadConversationHistory();
        this.knowledgeBase = this.buildKnowledgeBase();
        this.userContext = this.loadUserContext();
        this.nlpProcessor = new NLPProcessor();
        this.init();
    }

    init() {
        this.createAssistantUI();
        this.setupEventListeners();
        this.initializeVoiceRecognition();
        this.startContextTracking();
    }

    loadConversationHistory() {
        const stored = localStorage.getItem('ai_conversation_history');
        return stored ? JSON.parse(stored) : [];
    }

    saveConversationHistory() {
        localStorage.setItem('ai_conversation_history', JSON.stringify(this.conversationHistory));
    }

    loadUserContext() {
        const stored = localStorage.getItem('ai_user_context');
        return stored ? JSON.parse(stored) : {
            currentLevel: null,
            recentQuestions: [],
            learningGoals: [],
            strugglingTopics: [],
            preferredExplanationStyle: 'detailed',
            lastInteraction: null
        };
    }

    saveUserContext() {
        this.userContext.lastInteraction = Date.now();
        localStorage.setItem('ai_user_context', JSON.stringify(this.userContext));
    }

    buildKnowledgeBase() {
        return {
            mediaLiteracy: {
                concepts: {
                    'source-credibility': {
                        definition: '信息源可信度是指信息来源的可靠性和权威性',
                        examples: ['官方媒体', '学术机构', '专业记者'],
                        checkpoints: ['查看作者资质', '验证发布机构', '交叉验证信息']
                    },
                    'bias-detection': {
                        definition: '偏见检测是识别媒体内容中的主观倾向和立场偏向',
                        examples: ['政治偏见', '商业利益', '文化偏见'],
                        checkpoints: ['分析用词选择', '检查信息完整性', '对比多方观点']
                    },
                    'fact-checking': {
                        definition: '事实核查是验证信息真实性的系统性方法',
                        examples: ['数据验证', '引用核实', '时间线检查'],
                        checkpoints: ['查找原始来源', '使用专业工具', '寻求专家意见']
                    }
                },
                techniques: {
                    'lateral-reading': '横向阅读：同时查看多个来源来验证信息',
                    'upstream-tracking': '上游追踪：追溯信息的原始来源',
                    'click-restraint': '点击克制：在分享前先验证信息'
                },
                tools: {
                    'fact-check-sites': ['Snopes', 'FactCheck.org', 'PolitiFact'],
                    'reverse-image-search': ['Google Images', 'TinEye'],
                    'website-analysis': ['Whois', 'Wayback Machine']
                }
            },
            commonQuestions: {
                'how-to-verify': {
                    question: '如何验证一条新闻的真实性？',
                    answer: '验证新闻真实性需要多步骤：1) 检查信息源的可信度；2) 查找原始报道；3) 交叉验证多个来源；4) 使用事实核查网站；5) 注意发布时间和上下文。',
                    relatedTopics: ['source-credibility', 'fact-checking']
                },
                'identify-bias': {
                    question: '如何识别媒体中的偏见？',
                    answer: '识别偏见的方法：1) 注意情感化用词；2) 检查是否呈现多方观点；3) 分析信息的完整性；4) 考虑媒体的立场和利益；5) 对比不同来源的报道。',
                    relatedTopics: ['bias-detection']
                },
                'social-media-tips': {
                    question: '在社交媒体上如何避免传播虚假信息？',
                    answer: '避免传播虚假信息：1) 分享前先验证；2) 查看完整文章而非仅标题；3) 检查发布者的可信度；4) 使用事实核查工具；5) 对可疑内容保持怀疑。',
                    relatedTopics: ['fact-checking', 'source-credibility']
                }
            }
        };
    }

    createAssistantUI() {
        const assistantHTML = `
            <div id="ai-assistant" class="assistant-container">
                <!-- 助手触发按钮 -->
                <button id="assistant-trigger" class="assistant-trigger" title="AI学习助手">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21ZM20.5 18.5L19.1 17.1C19.6 16.2 20 15.1 20 14C20 11.2 17.8 9 15 9S10 11.2 10 14S12.2 19 15 19C16.1 19 17.2 18.6 18.1 18.1L19.5 19.5L20.5 18.5ZM15 17C13.3 17 12 15.7 12 14S13.3 11 15 11S18 12.3 18 14S16.7 17 15 17Z"/>
                    </svg>
                    <span class="assistant-badge" id="assistant-badge" hidden>1</span>
                </button>

                <!-- 助手面板 -->
                <div id="assistant-panel" class="assistant-panel" hidden>
                    <div class="assistant-header">
                        <div class="assistant-title">
                            <div class="assistant-avatar">🤖</div>
                            <div class="assistant-info">
                                <h3>AI学习助手</h3>
                                <span class="assistant-status" id="assistant-status">在线</span>
                            </div>
                        </div>
                        <div class="assistant-controls">
                            <button class="btn-icon" id="voice-toggle" title="语音输入">🎤</button>
                            <button class="btn-icon" id="clear-chat" title="清空对话">🗑️</button>
                            <button class="btn-icon" id="minimize-assistant" title="最小化">−</button>
                        </div>
                    </div>

                    <div class="assistant-content">
                        <!-- 快速操作 -->
                        <div class="quick-actions" id="quick-actions">
                            <button class="quick-action-btn" data-action="explain-current">解释当前题目</button>
                            <button class="quick-action-btn" data-action="learning-tips">学习建议</button>
                            <button class="quick-action-btn" data-action="progress-check">进度查询</button>
                            <button class="quick-action-btn" data-action="difficulty-adjust">调整难度</button>
                        </div>

                        <!-- 对话区域 -->
                        <div class="chat-container" id="chat-container">
                            <div class="chat-messages" id="chat-messages">
                                <div class="message assistant-message">
                                    <div class="message-avatar">🤖</div>
                                    <div class="message-content">
                                        <p>您好！我是您的AI学习助手。我可以帮您：</p>
                                        <ul>
                                            <li>解答媒体素养相关问题</li>
                                            <li>提供个性化学习建议</li>
                                            <li>分析您的学习进度</li>
                                            <li>推荐适合的练习内容</li>
                                        </ul>
                                        <p>有什么我可以帮助您的吗？</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 输入区域 -->
                        <div class="chat-input-container">
                            <div class="input-wrapper">
                                <textarea id="chat-input" placeholder="输入您的问题..." rows="1"></textarea>
                                <button id="send-message" class="send-btn" disabled>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="input-suggestions" id="input-suggestions"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', assistantHTML);
        this.injectAssistantStyles();
    }

    injectAssistantStyles() {
        const styles = `
            .assistant-container {
                position: fixed;
                bottom: var(--space-6);
                right: var(--space-6);
                z-index: 1000;
                font-family: var(--font-sans);
            }

            .assistant-trigger {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
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

            .assistant-trigger:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-2xl);
            }

            .assistant-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--danger);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
            }

            .assistant-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                height: 600px;
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

            .assistant-panel:not([hidden]) {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .assistant-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(59, 130, 246, 0.05);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            }

            .assistant-title {
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }

            .assistant-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--accent-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .assistant-info h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .assistant-status {
                font-size: 0.75rem;
                color: var(--success);
                font-weight: 500;
            }

            .assistant-controls {
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
                background: rgba(59, 130, 246, 0.1);
            }

            .assistant-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .quick-actions {
                padding: var(--space-3);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-2);
            }

            .quick-action-btn {
                padding: var(--space-2) var(--space-3);
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                font-size: 0.75rem;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .quick-action-btn:hover {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }

            .chat-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-messages {
                flex: 1;
                padding: var(--space-4);
                overflow-y: auto;
                scroll-behavior: smooth;
            }

            .message {
                display: flex;
                gap: var(--space-3);
                margin-bottom: var(--space-4);
                animation: messageSlideIn 0.3s ease;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                flex-shrink: 0;
            }

            .assistant-message .message-avatar {
                background: var(--accent-primary);
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .user-message .message-avatar {
                background: var(--success);
            }

            .message-content {
                flex: 1;
                background: var(--background);
                padding: var(--space-3);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .user-message .message-content {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }

            .message-content p {
                margin: 0 0 var(--space-2) 0;
            }

            .message-content p:last-child {
                margin-bottom: 0;
            }

            .message-content ul {
                margin: var(--space-2) 0;
                padding-left: var(--space-4);
            }

            .message-content li {
                margin-bottom: var(--space-1);
            }

            .chat-input-container {
                padding: var(--space-4);
                border-top: 1px solid var(--border-primary);
                background: var(--background);
                border-radius: 0 0 var(--radius-xl) var(--radius-xl);
            }

            .input-wrapper {
                display: flex;
                gap: var(--space-2);
                align-items: flex-end;
            }

            #chat-input {
                flex: 1;
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-3);
                font-size: 0.875rem;
                resize: none;
                max-height: 100px;
                background: var(--surface);
                color: var(--text-primary);
                font-family: inherit;
            }

            #chat-input:focus {
                outline: none;
                border-color: var(--accent-primary);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .send-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: var(--accent-primary);
                color: white;
                border-radius: var(--radius-lg);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .send-btn:disabled {
                background: var(--border-primary);
                cursor: not-allowed;
            }

            .send-btn:not(:disabled):hover {
                background: var(--accent-secondary);
                transform: scale(1.05);
            }

            .input-suggestions {
                margin-top: var(--space-2);
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-2);
            }

            .suggestion-chip {
                padding: var(--space-1) var(--space-2);
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                color: var(--accent-primary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .suggestion-chip:hover {
                background: var(--accent-primary);
                color: white;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                color: var(--text-secondary);
                font-size: 0.875rem;
                font-style: italic;
            }

            .typing-dots {
                display: flex;
                gap: 2px;
            }

            .typing-dot {
                width: 4px;
                height: 4px;
                background: var(--text-secondary);
                border-radius: 50%;
                animation: typingDot 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes typingDot {
                0%, 60%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                30% {
                    transform: scale(1.2);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .assistant-container {
                    bottom: var(--space-4);
                    right: var(--space-4);
                }

                .assistant-panel {
                    width: calc(100vw - 2rem);
                    height: calc(100vh - 8rem);
                    bottom: 80px;
                    right: -1rem;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // 触发按钮
        document.getElementById('assistant-trigger').addEventListener('click', () => {
            this.toggleAssistant();
        });

        // 最小化按钮
        document.getElementById('minimize-assistant').addEventListener('click', () => {
            this.hideAssistant();
        });

        // 清空对话
        document.getElementById('clear-chat').addEventListener('click', () => {
            this.clearConversation();
        });

        // 语音切换
        document.getElementById('voice-toggle').addEventListener('click', () => {
            this.toggleVoiceInput();
        });

        // 发送消息
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        // 输入框事件
        const chatInput = document.getElementById('chat-input');
        chatInput.addEventListener('input', () => {
            this.handleInputChange();
        });

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 快速操作
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleQuickAction(btn.dataset.action);
            });
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('assistant-panel');
            const trigger = document.getElementById('assistant-trigger');
            
            if (!panel.contains(e.target) && !trigger.contains(e.target) && !panel.hidden) {
                this.hideAssistant();
            }
        });
    }

    toggleAssistant() {
        const panel = document.getElementById('assistant-panel');
        if (panel.hidden) {
            this.showAssistant();
        } else {
            this.hideAssistant();
        }
    }

    showAssistant() {
        document.getElementById('assistant-panel').hidden = false;
        document.getElementById('assistant-badge').hidden = true;
        this.isActive = true;
        
        // 自动聚焦输入框
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }

    hideAssistant() {
        document.getElementById('assistant-panel').hidden = true;
        this.isActive = false;
    }

    // 统一公开API以兼容主应用触发
    show() { this.showAssistant(); }
    hide() { this.hideAssistant(); }
    toggle() { this.toggleAssistant(); }

    handleInputChange() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        
        sendBtn.disabled = !input.value.trim();
        
        // 自动调整高度
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        
        // 生成建议
        this.generateSuggestions(input.value);
    }

    generateSuggestions(input) {
        const suggestions = [];
        const inputLower = input.toLowerCase();

        if (inputLower.includes('如何') || inputLower.includes('怎么')) {
            suggestions.push('如何验证新闻真实性？');
            suggestions.push('如何识别虚假信息？');
        }

        if (inputLower.includes('什么是') || inputLower.includes('定义')) {
            suggestions.push('什么是媒体素养？');
            suggestions.push('什么是信息茧房？');
        }

        if (inputLower.includes('建议') || inputLower.includes('推荐')) {
            suggestions.push('给我一些学习建议');
            suggestions.push('推荐适合的练习');
        }

        this.displaySuggestions(suggestions);
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('input-suggestions');
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }

        const suggestionsHTML = suggestions.map(suggestion => `
            <span class="suggestion-chip" onclick="document.getElementById('chat-input').value='${suggestion}'; this.parentElement.innerHTML=''; document.getElementById('send-message').disabled=false;">
                ${suggestion}
            </span>
        `).join('');

        container.innerHTML = suggestionsHTML;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        
        // 清空输入
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('send-message').disabled = true;
        document.getElementById('input-suggestions').innerHTML = '';

        // 显示打字指示器
        this.showTypingIndicator();

        // 处理消息
        setTimeout(() => {
            this.processMessage(message);
        }, 1000 + Math.random() * 1000); // 模拟思考时间
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${this.formatMessageContent(content)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 保存到历史记录
        this.conversationHistory.push({
            content: content,
            sender: sender,
            timestamp: Date.now()
        });
        this.saveConversationHistory();
    }

    formatMessageContent(content) {
        // 简单的markdown格式化
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+\.\s)/g, '<br>$1');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'message assistant-message';
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span>正在思考</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    processMessage(message) {
        this.hideTypingIndicator();
        
        // 更新用户上下文
        this.userContext.recentQuestions.push(message);
        if (this.userContext.recentQuestions.length > 10) {
            this.userContext.recentQuestions = this.userContext.recentQuestions.slice(-10);
        }

        // 生成回复
        const response = this.generateResponse(message);
        this.addMessage(response, 'assistant');
        
        this.saveUserContext();
    }

    generateResponse(message) {
        const messageLower = message.toLowerCase();
        
        // 意图识别
        const intent = this.nlpProcessor.classifyIntent(message);
        
        switch (intent) {
            case 'question':
                return this.handleQuestion(message);
            case 'help':
                return this.handleHelpRequest(message);
            case 'progress':
                return this.handleProgressInquiry(message);
            case 'explanation':
                return this.handleExplanationRequest(message);
            default:
                return this.handleGeneralQuery(message);
        }
    }

    handleQuestion(message) {
        const messageLower = message.toLowerCase();
        
        // 检查常见问题
        for (const [key, qa] of Object.entries(this.knowledgeBase.commonQuestions)) {
            if (this.nlpProcessor.calculateSimilarity(messageLower, qa.question.toLowerCase()) > 0.6) {
                return qa.answer;
            }
        }

        // 检查概念相关问题
        for (const [concept, data] of Object.entries(this.knowledgeBase.mediaLiteracy.concepts)) {
            if (messageLower.includes(concept.replace('-', '')) || 
                messageLower.includes(data.definition.substring(0, 10))) {
                return `**${data.definition}**\n\n例如：${data.examples.join('、')}\n\n检查要点：\n${data.checkpoints.map(point => `• ${point}`).join('\n')}`;
            }
        }

        return '这是一个很好的问题！基于您的问题，我建议您：\n\n1. 先确定信息的来源是否可靠\n2. 查看是否有其他权威来源证实\n3. 注意信息的时效性和完整性\n\n您还有其他具体的疑问吗？';
    }

    handleHelpRequest(message) {
        const currentLevel = this.getCurrentLevelInfo();
        
        if (currentLevel) {
            return `我看到您正在学习"${currentLevel.title}"。\n\n**学习建议：**\n• 仔细阅读每个选项\n• 思考信息的来源和可信度\n• 运用批判性思维\n\n**如果遇到困难：**\n• 可以先跳过，稍后回来\n• 尝试从不同角度思考\n• 记住没有标准答案，重要的是思考过程\n\n需要我解释具体的概念吗？`;
        }

        return '我很乐意帮助您！您可以：\n\n• 询问媒体素养相关概念\n• 请求学习建议和技巧\n• 查看您的学习进度\n• 获取个性化推荐\n\n请告诉我您需要什么帮助？';
    }

    handleProgressInquiry(message) {
        // 模拟获取用户进度数据
        const progress = this.getUserProgress();
        
        return `**您的学习进度：**\n\n• 已完成关卡：${progress.completedLevels}\n• 总学习时间：${progress.totalTime}分钟\n• 平均得分：${progress.averageScore}%\n• 强项技能：${progress.strengths.join('、')}\n• 需要加强：${progress.weaknesses.join('、')}\n\n**建议：**\n${progress.recommendations.join('\n')}`;
    }

    handleExplanationRequest(message) {
        const currentQuestion = this.getCurrentQuestion();
        
        if (currentQuestion) {
            return `**关于当前题目：**\n\n这道题主要考查您的${currentQuestion.skill}能力。\n\n**解题思路：**\n1. 仔细分析题目中的关键信息\n2. 运用相关的媒体素养原则\n3. 考虑多个角度和可能性\n\n**相关知识点：**\n${currentQuestion.concepts.map(concept => `• ${concept}`).join('\n')}\n\n需要我详细解释某个概念吗？`;
        }

        return '请告诉我您希望我解释什么内容，我会尽力为您详细说明！';
    }

    handleGeneralQuery(message) {
        const responses = [
            '这是一个很有趣的观点！在媒体素养学习中，保持开放和批判的思维很重要。',
            '您提到的问题很有价值。建议您多从不同角度思考这个问题。',
            '这个话题确实值得深入探讨。您可以尝试查找更多相关资料来验证。',
            '很好的思考！在信息时代，这样的质疑精神非常重要。'
        ];

        return responses[Math.floor(Math.random() * responses.length)] + '\n\n有什么具体的问题我可以帮您解答吗？';
    }

    handleQuickAction(action) {
        const actions = {
            'explain-current': () => {
                const input = document.getElementById('chat-input');
                input.value = '请解释当前题目';
                this.sendMessage();
            },
            'learning-tips': () => {
                const input = document.getElementById('chat-input');
                input.value = '给我一些学习建议';
                this.sendMessage();
            },
            'progress-check': () => {
                const input = document.getElementById('chat-input');
                input.value = '查看我的学习进度';
                this.sendMessage();
            },
            'difficulty-adjust': () => {
                const input = document.getElementById('chat-input');
                input.value = '如何调整学习难度？';
                this.sendMessage();
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    clearConversation() {
        if (confirm('确定要清空对话记录吗？')) {
            document.getElementById('chat-messages').innerHTML = `
                <div class="message assistant-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>对话已清空。有什么我可以帮助您的吗？</p>
                    </div>
                </div>
            `;
            this.conversationHistory = [];
            this.saveConversationHistory();
        }
    }

    // 语音识别相关方法
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'zh-CN';

            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
                this.handleInputChange();
            };

            this.speechRecognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
            };
        }
    }

    toggleVoiceInput() {
        if (!this.speechRecognition) {
            alert('您的浏览器不支持语音识别功能');
            return;
        }

        if (this.isListening) {
            this.speechRecognition.stop();
            this.isListening = false;
            document.getElementById('voice-toggle').textContent = '🎤';
        } else {
            this.speechRecognition.start();
            this.isListening = true;
            document.getElementById('voice-toggle').textContent = '🔴';
        }
    }

    // 上下文跟踪
    startContextTracking() {
        // 监控用户当前所在页面/关卡
        this.trackCurrentContext();
        
        // 定期更新上下文
        setInterval(() => {
            this.trackCurrentContext();
        }, 5000);
    }

    trackCurrentContext() {
        // 检测当前关卡
        const currentLevel = this.detectCurrentLevel();
        if (currentLevel !== this.userContext.currentLevel) {
            this.userContext.currentLevel = currentLevel;
            this.saveUserContext();
        }
    }

    detectCurrentLevel() {
        // 简化的关卡检测逻辑
        const url = window.location.hash;
        if (url.includes('play')) {
            return 'playing';
        } else if (url.includes('levels')) {
            return 'level-selection';
        }
        return 'home';
    }

    getCurrentLevelInfo() {
        // 模拟获取当前关卡信息
        return {
            title: '新闻真实性判断',
            difficulty: 'medium',
            topic: 'fact-checking'
        };
    }

    getCurrentQuestion() {
        // 模拟获取当前题目信息
        return {
            skill: '事实核查',
            concepts: ['信息源验证', '交叉验证', '时效性检查']
        };
    }

    getUserProgress() {
        // 模拟获取用户进度
        return {
            completedLevels: 5,
            totalTime: 120,
            averageScore: 78,
            strengths: ['信息源评估', '偏见识别'],
            weaknesses: ['事实核查', '数据分析'],
            recommendations: [
                '• 建议多练习事实核查相关题目',
                '• 可以学习更多数据分析技巧',
                '• 保持当前的学习节奏'
            ]
        };
    }

    // 智能提醒功能
    showSmartNotification(message) {
        if (!this.isActive) {
            document.getElementById('assistant-badge').textContent = '1';
            document.getElementById('assistant-badge').hidden = false;
        }
    }
}

// 自然语言处理器
class NLPProcessor {
    constructor() {
        this.intentPatterns = {
            question: ['什么', '如何', '怎么', '为什么', '是否', '能否', '?', '？'],
            help: ['帮助', '帮忙', '不会', '不懂', '困难', '求助'],
            progress: ['进度', '成绩', '分数', '表现', '统计'],
            explanation: ['解释', '说明', '详细', '具体', '举例']
        };
    }

    classifyIntent(message) {
        const messageLower = message.toLowerCase();
        
        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            if (patterns.some(pattern => messageLower.includes(pattern))) {
                return intent;
            }
        }
        
        return 'general';
    }

    calculateSimilarity(str1, str2) {
        // 简化的相似度计算
        const words1 = str1.split('');
        const words2 = str2.split('');
        const intersection = words1.filter(word => words2.includes(word));
        return intersection.length / Math.max(words1.length, words2.length);
    }
}

// 导出供其他模块使用
window.AIAssistant = AIAssistant;
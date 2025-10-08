// 实时协作学习系统 - 国家一等奖创新功能
// 支持多人在线学习、讨论和知识分享

class CollaborativeLearningSystem {
    constructor() {
        this.isConnected = false;
        this.currentRoom = null;
        this.participants = new Map();
        this.sharedState = {};
        this.messageHistory = [];
        this.collaborationTools = new CollaborationTools();
        this.peerConnection = new PeerConnectionManager();
        this.knowledgeGraph = new SharedKnowledgeGraph();
        this.init();
    }

    init() {
        this.createCollaborationUI();
        this.setupEventListeners();
        this.initializeWebRTC();
        this.setupKeyboardShortcuts();
    }

    createCollaborationUI() {
        const collaborationHTML = `
            <div id="collaboration-system" class="collaboration-container">
                <!-- 协作触发按钮 -->
                <button id="collaboration-trigger" class="collaboration-trigger" title="协作学习">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12C15.7 12 15.4 11.9 15.1 11.9L13 14H11V16H9V18H7V20H5V18.5C5 18.1 5.2 17.8 5.5 17.6L11.9 12.4C11.9 12.3 12 12.1 12 12C12 9.8 13.8 8 16 8S20 9.8 20 8 18.2 4 16 4M16 6C17.1 6 18 6.9 18 8S17.1 10 16 10 14 9.1 14 8 14.9 6 16 6Z"/>
                    </svg>
                    <span class="collaboration-badge" id="collaboration-badge" hidden>3</span>
                </button>

                <!-- 协作面板 -->
                <div id="collaboration-panel" class="collaboration-panel" hidden>
                    <div class="collaboration-header">
                        <div class="collaboration-title">
                            <h3>协作学习</h3>
                            <span class="connection-status" id="connection-status">离线</span>
                        </div>
                        <div class="collaboration-controls">
                            <button class="btn-icon" id="screen-share" title="屏幕共享">📺</button>
                            <button class="btn-icon" id="voice-chat" title="语音聊天">🎤</button>
                            <button class="btn-icon" id="minimize-collaboration" title="最小化">−</button>
                        </div>
                    </div>

                    <div class="collaboration-tabs">
                        <button class="tab-btn active" data-tab="rooms">学习室</button>
                        <button class="tab-btn" data-tab="participants">参与者</button>
                        <button class="tab-btn" data-tab="chat">讨论</button>
                        <button class="tab-btn" data-tab="whiteboard">白板</button>
                        <button class="tab-btn" data-tab="knowledge">知识图谱</button>
                    </div>

                    <div class="collaboration-content">
                        <!-- 学习室标签页 -->
                        <div class="tab-content active" id="rooms-tab">
                            <div class="room-creation">
                                <input type="text" id="room-name" placeholder="输入学习室名称...">
                                <select id="room-type">
                                    <option value="study">学习讨论</option>
                                    <option value="quiz">协作答题</option>
                                    <option value="debate">观点辩论</option>
                                    <option value="workshop">知识工坊</option>
                                </select>
                                <button id="create-room" class="btn-primary">创建学习室</button>
                            </div>
                            
                            <div class="room-list" id="room-list">
                                <div class="room-item">
                                    <div class="room-info">
                                        <h4>媒体素养基础讨论</h4>
                                        <p>3人在线 • 学习讨论</p>
                                    </div>
                                    <button class="btn-join">加入</button>
                                </div>
                                <div class="room-item">
                                    <div class="room-info">
                                        <h4>假新闻识别挑战</h4>
                                        <p>5人在线 • 协作答题</p>
                                    </div>
                                    <button class="btn-join">加入</button>
                                </div>
                            </div>
                        </div>

                        <!-- 参与者标签页 -->
                        <div class="tab-content" id="participants-tab">
                            <div class="participants-list" id="participants-list">
                                <div class="participant-item">
                                    <div class="participant-avatar">👤</div>
                                    <div class="participant-info">
                                        <h4>学习者A</h4>
                                        <p>正在学习：信息源评估</p>
                                        <div class="participant-status online">在线</div>
                                    </div>
                                    <div class="participant-actions">
                                        <button class="btn-small">私聊</button>
                                        <button class="btn-small">协作</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 讨论标签页 -->
                        <div class="tab-content" id="chat-tab">
                            <div class="chat-messages" id="collaboration-chat">
                                <div class="message system-message">
                                    <div class="message-content">欢迎来到协作学习！开始讨论吧。</div>
                                    <div class="message-time">刚刚</div>
                                </div>
                            </div>
                            
                            <div class="chat-input-area">
                                <div class="input-tools">
                                    <button class="tool-btn" id="emoji-picker" title="表情">😊</button>
                                    <button class="tool-btn" id="file-share" title="文件分享">📎</button>
                                    <button class="tool-btn" id="code-snippet" title="代码片段">💻</button>
                                    <button class="tool-btn" id="poll-create" title="创建投票">📊</button>
                                </div>
                                <div class="input-wrapper">
                                    <textarea id="collaboration-input" placeholder="输入消息...按Ctrl+Enter发送"></textarea>
                                    <button id="send-collaboration-message" class="send-btn">发送</button>
                                </div>
                            </div>
                        </div>

                        <!-- 白板标签页 -->
                        <div class="tab-content" id="whiteboard-tab">
                            <div class="whiteboard-tools">
                                <button class="tool-btn active" data-tool="pen">✏️</button>
                                <button class="tool-btn" data-tool="eraser">🧹</button>
                                <button class="tool-btn" data-tool="text">📝</button>
                                <button class="tool-btn" data-tool="shape">⭕</button>
                                <button class="tool-btn" data-tool="arrow">➡️</button>
                                <input type="color" id="pen-color" value="#3b82f6">
                                <input type="range" id="pen-size" min="1" max="10" value="3">
                                <button class="tool-btn" id="clear-whiteboard">🗑️</button>
                            </div>
                            
                            <canvas id="collaboration-whiteboard" width="400" height="300"></canvas>
                            
                            <div class="whiteboard-actions">
                                <button class="btn-small" id="save-whiteboard">保存</button>
                                <button class="btn-small" id="export-whiteboard">导出</button>
                                <button class="btn-small" id="share-whiteboard">分享</button>
                            </div>
                        </div>

                        <!-- 知识图谱标签页 -->
                        <div class="tab-content" id="knowledge-tab">
                            <div class="knowledge-controls">
                                <button class="btn-small" id="add-concept">添加概念</button>
                                <button class="btn-small" id="add-relation">添加关系</button>
                                <button class="btn-small" id="auto-layout">自动布局</button>
                            </div>
                            
                            <div id="knowledge-graph" class="knowledge-graph"></div>
                            
                            <div class="knowledge-legend">
                                <div class="legend-item">
                                    <div class="legend-color concept"></div>
                                    <span>概念</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color relation"></div>
                                    <span>关系</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 浮动工具栏 -->
                <div id="floating-toolbar" class="floating-toolbar" hidden>
                    <button class="toolbar-btn" id="quick-note" title="快速笔记">📝</button>
                    <button class="toolbar-btn" id="highlight-text" title="高亮文本">🖍️</button>
                    <button class="toolbar-btn" id="share-screen-area" title="分享区域">📷</button>
                    <button class="toolbar-btn" id="voice-memo" title="语音备忘">🎙️</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', collaborationHTML);
        this.injectCollaborationStyles();
    }

    injectCollaborationStyles() {
        const styles = `
            .collaboration-container {
                position: fixed;
                bottom: var(--space-6);
                left: var(--space-6);
                z-index: 1000;
                font-family: var(--font-sans);
            }

            .collaboration-trigger {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #059669);
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

            .collaboration-trigger:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-2xl);
            }

            .collaboration-badge {
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

            .collaboration-panel {
                position: absolute;
                bottom: 80px;
                left: 0;
                width: 500px;
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

            .collaboration-panel:not([hidden]) {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .collaboration-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(16, 185, 129, 0.05);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            }

            .collaboration-title h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .connection-status {
                font-size: 0.75rem;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: 500;
                background: var(--danger);
                color: white;
            }

            .connection-status.online {
                background: var(--success);
            }

            .collaboration-controls {
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
                background: rgba(16, 185, 129, 0.1);
            }

            .collaboration-tabs {
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
                background: rgba(16, 185, 129, 0.05);
                color: var(--text-primary);
            }

            .tab-btn.active {
                color: #10b981;
                border-bottom-color: #10b981;
                background: rgba(16, 185, 129, 0.05);
            }

            .collaboration-content {
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

            .room-creation {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
                margin-bottom: var(--space-4);
                padding: var(--space-4);
                background: var(--background);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
            }

            .room-creation input,
            .room-creation select {
                padding: var(--space-3);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                background: var(--surface);
                color: var(--text-primary);
                font-size: 0.875rem;
            }

            .btn-primary {
                padding: var(--space-3) var(--space-4);
                background: #10b981;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-primary:hover {
                background: #059669;
                transform: translateY(-1px);
            }

            .room-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
            }

            .room-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-4);
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                transition: all 0.2s ease;
            }

            .room-item:hover {
                border-color: #10b981;
                box-shadow: var(--shadow-md);
            }

            .room-info h4 {
                margin: 0 0 var(--space-1) 0;
                color: var(--text-primary);
                font-size: 0.875rem;
                font-weight: 600;
            }

            .room-info p {
                margin: 0;
                color: var(--text-secondary);
                font-size: 0.75rem;
            }

            .btn-join {
                padding: var(--space-2) var(--space-4);
                background: transparent;
                color: #10b981;
                border: 1px solid #10b981;
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-join:hover {
                background: #10b981;
                color: white;
            }

            .participants-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
            }

            .participant-item {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
            }

            .participant-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #10b981;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .participant-info {
                flex: 1;
            }

            .participant-info h4 {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .participant-info p {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
            }

            .participant-status {
                font-size: 0.625rem;
                padding: 2px 6px;
                border-radius: var(--radius-sm);
                font-weight: 600;
                background: var(--border-primary);
                color: var(--text-secondary);
            }

            .participant-status.online {
                background: var(--success);
                color: white;
            }

            .participant-actions {
                display: flex;
                gap: var(--space-2);
            }

            .btn-small {
                padding: var(--space-1) var(--space-2);
                font-size: 0.625rem;
                border: 1px solid var(--border-primary);
                background: var(--background);
                color: var(--text-secondary);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-small:hover {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }

            .chat-messages {
                height: 400px;
                overflow-y: auto;
                padding: var(--space-3);
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-3);
            }

            .message {
                margin-bottom: var(--space-3);
                animation: messageSlideIn 0.3s ease;
            }

            .system-message .message-content {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                padding: var(--space-2);
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                text-align: center;
            }

            .user-message {
                display: flex;
                align-items: flex-start;
                gap: var(--space-2);
            }

            .message-avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #10b981;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                flex-shrink: 0;
            }

            .message-content {
                flex: 1;
                background: var(--surface);
                padding: var(--space-2);
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                line-height: 1.4;
            }

            .message-time {
                font-size: 0.625rem;
                color: var(--text-secondary);
                margin-top: var(--space-1);
            }

            .chat-input-area {
                border-top: 1px solid var(--border-primary);
                padding-top: var(--space-3);
            }

            .input-tools {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-2);
            }

            .tool-btn {
                width: 28px;
                height: 28px;
                border: 1px solid var(--border-primary);
                background: var(--background);
                border-radius: var(--radius-sm);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                transition: all 0.2s ease;
            }

            .tool-btn:hover {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }

            .input-wrapper {
                display: flex;
                gap: var(--space-2);
                align-items: flex-end;
            }

            #collaboration-input {
                flex: 1;
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                padding: var(--space-2);
                font-size: 0.75rem;
                resize: none;
                max-height: 80px;
                background: var(--surface);
                color: var(--text-primary);
                font-family: inherit;
            }

            .send-btn {
                padding: var(--space-2) var(--space-3);
                background: #10b981;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .send-btn:hover {
                background: #059669;
            }

            .whiteboard-tools {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-3);
                padding: var(--space-2);
                background: var(--background);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-primary);
                align-items: center;
            }

            .tool-btn.active {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }

            #pen-color {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: var(--radius-sm);
                cursor: pointer;
            }

            #pen-size {
                width: 60px;
                height: 4px;
                background: var(--border-primary);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
            }

            #collaboration-whiteboard {
                width: 100%;
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                background: white;
                cursor: crosshair;
            }

            .whiteboard-actions {
                display: flex;
                gap: var(--space-2);
                margin-top: var(--space-3);
                justify-content: center;
            }

            .knowledge-controls {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-3);
            }

            .knowledge-graph {
                width: 100%;
                height: 400px;
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-md);
                background: var(--background);
                position: relative;
                overflow: hidden;
            }

            .knowledge-legend {
                display: flex;
                gap: var(--space-4);
                margin-top: var(--space-3);
                justify-content: center;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: 0.75rem;
                color: var(--text-secondary);
            }

            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .legend-color.concept {
                background: #10b981;
            }

            .legend-color.relation {
                background: #3b82f6;
            }

            .floating-toolbar {
                position: fixed;
                top: 50%;
                right: var(--space-4);
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
                background: var(--surface);
                padding: var(--space-2);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
                box-shadow: var(--shadow-lg);
                backdrop-filter: blur(10px);
            }

            .toolbar-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: transparent;
                border-radius: var(--radius-md);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                transition: all 0.2s ease;
            }

            .toolbar-btn:hover {
                background: #10b981;
                color: white;
                transform: scale(1.1);
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

            @media (max-width: 768px) {
                .collaboration-container {
                    bottom: var(--space-4);
                    left: var(--space-4);
                }

                .collaboration-panel {
                    width: calc(100vw - 2rem);
                    height: calc(100vh - 8rem);
                    bottom: 80px;
                    left: -1rem;
                }

                .floating-toolbar {
                    right: var(--space-2);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        // 触发按钮
        document.getElementById('collaboration-trigger').addEventListener('click', () => {
            this.toggleCollaboration();
        });

        // 最小化按钮
        document.getElementById('minimize-collaboration').addEventListener('click', () => {
            this.hideCollaboration();
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // 创建学习室
        document.getElementById('create-room').addEventListener('click', () => {
            this.createRoom();
        });

        // 发送消息
        document.getElementById('send-collaboration-message').addEventListener('click', () => {
            this.sendMessage();
        });

        // 输入框事件
        document.getElementById('collaboration-input').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // 屏幕共享
        document.getElementById('screen-share').addEventListener('click', () => {
            this.toggleScreenShare();
        });

        // 语音聊天
        document.getElementById('voice-chat').addEventListener('click', () => {
            this.toggleVoiceChat();
        });

        // 白板工具
        this.setupWhiteboardEvents();

        // 知识图谱
        this.setupKnowledgeGraphEvents();

        // 浮动工具栏
        this.setupFloatingToolbarEvents();
    }

    setupWhiteboardEvents() {
        const canvas = document.getElementById('collaboration-whiteboard');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTool = 'pen';

        // 工具选择
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.tool-btn.active').classList.remove('active');
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
            });
        });

        // 绘图事件
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ctx.lineWidth = document.getElementById('pen-size').value;
            ctx.strokeStyle = document.getElementById('pen-color').value;
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // 广播绘图数据
            this.broadcastDrawing({
                type: 'draw',
                x: x,
                y: y,
                color: ctx.strokeStyle,
                size: ctx.lineWidth
            });
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        // 清空白板
        document.getElementById('clear-whiteboard').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.broadcastDrawing({ type: 'clear' });
        });
    }

    setupKnowledgeGraphEvents() {
        // 添加概念
        document.getElementById('add-concept').addEventListener('click', () => {
            this.addConcept();
        });

        // 添加关系
        document.getElementById('add-relation').addEventListener('click', () => {
            this.addRelation();
        });

        // 自动布局
        document.getElementById('auto-layout').addEventListener('click', () => {
            this.autoLayoutKnowledgeGraph();
        });
    }

    setupFloatingToolbarEvents() {
        // 快速笔记
        document.getElementById('quick-note').addEventListener('click', () => {
            this.createQuickNote();
        });

        // 高亮文本
        document.getElementById('highlight-text').addEventListener('click', () => {
            this.highlightSelectedText();
        });

        // 分享区域
        document.getElementById('share-screen-area').addEventListener('click', () => {
            this.shareScreenArea();
        });

        // 语音备忘
        document.getElementById('voice-memo').addEventListener('click', () => {
            this.recordVoiceMemo();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                switch (e.key) {
                    case 'C':
                        e.preventDefault();
                        this.toggleCollaboration();
                        break;
                    case 'S':
                        e.preventDefault();
                        this.toggleScreenShare();
                        break;
                    case 'V':
                        e.preventDefault();
                        this.toggleVoiceChat();
                        break;
                    case 'N':
                        e.preventDefault();
                        this.createQuickNote();
                        break;
                }
            }
        });
    }

    toggleCollaboration() {
        const panel = document.getElementById('collaboration-panel');
        if (panel.hidden) {
            this.showCollaboration();
        } else {
            this.hideCollaboration();
        }
    }

    showCollaboration() {
        document.getElementById('collaboration-panel').hidden = false;
        document.getElementById('collaboration-badge').hidden = true;
        document.getElementById('floating-toolbar').hidden = false;
        this.connectToCollaborationServer();
    }

    hideCollaboration() {
        document.getElementById('collaboration-panel').hidden = true;
        document.getElementById('floating-toolbar').hidden = true;
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
    }

    createRoom() {
        const roomName = document.getElementById('room-name').value.trim();
        const roomType = document.getElementById('room-type').value;

        if (!roomName) {
            alert('请输入学习室名称');
            return;
        }

        const room = {
            id: this.generateRoomId(),
            name: roomName,
            type: roomType,
            creator: this.getCurrentUser(),
            participants: [],
            createdAt: Date.now()
        };

        this.joinRoom(room);
        document.getElementById('room-name').value = '';
    }

    joinRoom(room) {
        this.currentRoom = room;
        this.updateConnectionStatus('online');
        this.addSystemMessage(`已加入学习室：${room.name}`);
    }

    sendMessage() {
        const input = document.getElementById('collaboration-input');
        const message = input.value.trim();

        if (!message) return;

        const messageData = {
            id: this.generateMessageId(),
            content: message,
            sender: this.getCurrentUser(),
            timestamp: Date.now(),
            type: 'text'
        };

        this.addMessage(messageData);
        this.broadcastMessage(messageData);

        input.value = '';
    }

    addMessage(messageData) {
        const chatContainer = document.getElementById('collaboration-chat');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';

        messageElement.innerHTML = `
            <div class="message-avatar">${messageData.sender.avatar || '👤'}</div>
            <div class="message-content">${this.formatMessage(messageData.content)}</div>
            <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
        `;

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        this.messageHistory.push(messageData);
    }

    addSystemMessage(content) {
        const chatContainer = document.getElementById('collaboration-chat');
        const messageElement = document.createElement('div');
        messageElement.className = 'message system-message';

        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${this.formatTime(Date.now())}</div>
        `;

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    formatMessage(content) {
        // 简单的消息格式化
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    toggleScreenShare() {
        if (this.isScreenSharing) {
            this.stopScreenShare();
        } else {
            this.startScreenShare();
        }
    }

    async startScreenShare() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            this.screenStream = stream;
            this.isScreenSharing = true;
            
            document.getElementById('screen-share').style.background = '#ef4444';
            this.addSystemMessage('开始屏幕共享');

            // 广播屏幕共享
            this.broadcastScreenShare(stream);

        } catch (error) {
            console.error('屏幕共享失败:', error);
            alert('屏幕共享失败，请检查浏览器权限');
        }
    }

    stopScreenShare() {
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
        }

        this.isScreenSharing = false;
        document.getElementById('screen-share').style.background = '';
        this.addSystemMessage('停止屏幕共享');
    }

    toggleVoiceChat() {
        if (this.isVoiceChatActive) {
            this.stopVoiceChat();
        } else {
            this.startVoiceChat();
        }
    }

    async startVoiceChat() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            this.audioStream = stream;
            this.isVoiceChatActive = true;
            
            document.getElementById('voice-chat').style.background = '#ef4444';
            this.addSystemMessage('开始语音聊天');

            // 广播音频流
            this.broadcastAudioStream(stream);

        } catch (error) {
            console.error('语音聊天失败:', error);
            alert('语音聊天失败，请检查麦克风权限');
        }
    }

    stopVoiceChat() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }

        this.isVoiceChatActive = false;
        document.getElementById('voice-chat').style.background = '';
        this.addSystemMessage('停止语音聊天');
    }

    addConcept() {
        const conceptName = prompt('请输入概念名称：');
        if (conceptName) {
            this.knowledgeGraph.addConcept({
                id: this.generateConceptId(),
                name: conceptName,
                type: 'concept',
                x: Math.random() * 300,
                y: Math.random() * 200
            });
            this.renderKnowledgeGraph();
        }
    }

    addRelation() {
        // 简化的关系添加
        const relation = prompt('请输入关系描述：');
        if (relation) {
            this.knowledgeGraph.addRelation({
                id: this.generateRelationId(),
                name: relation,
                type: 'relation'
            });
            this.renderKnowledgeGraph();
        }
    }

    renderKnowledgeGraph() {
        const container = document.getElementById('knowledge-graph');
        // 简化的知识图谱渲染
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-secondary);">知识图谱功能开发中...</div>';
    }

    autoLayoutKnowledgeGraph() {
        // 自动布局算法
        this.knowledgeGraph.autoLayout();
        this.renderKnowledgeGraph();
    }

    createQuickNote() {
        const note = prompt('快速笔记：');
        if (note) {
            this.addMessage({
                id: this.generateMessageId(),
                content: `📝 笔记：${note}`,
                sender: this.getCurrentUser(),
                timestamp: Date.now(),
                type: 'note'
            });
        }
    }

    highlightSelectedText() {
        const selection = window.getSelection();
        if (selection.toString()) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.backgroundColor = '#fef3c7';
            span.style.padding = '2px 4px';
            span.style.borderRadius = '3px';
            
            try {
                range.surroundContents(span);
                this.broadcastHighlight({
                    text: selection.toString(),
                    timestamp: Date.now()
                });
            } catch (error) {
                console.error('高亮失败:', error);
            }
        }
    }

    shareScreenArea() {
        alert('屏幕区域分享功能开发中...');
    }

    recordVoiceMemo() {
        alert('语音备忘功能开发中...');
    }

    // 网络通信相关方法
    connectToCollaborationServer() {
        // 模拟连接到协作服务器
        setTimeout(() => {
            this.updateConnectionStatus('online');
            this.addSystemMessage('已连接到协作服务器');
        }, 1000);
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        statusElement.textContent = status === 'online' ? '在线' : '离线';
        statusElement.className = `connection-status ${status}`;
    }

    broadcastMessage(messageData) {
        // 广播消息到其他参与者
        console.log('广播消息:', messageData);
    }

    broadcastDrawing(drawingData) {
        // 广播绘图数据
        console.log('广播绘图:', drawingData);
    }

    broadcastScreenShare(stream) {
        // 广播屏幕共享
        console.log('广播屏幕共享:', stream);
    }

    broadcastAudioStream(stream) {
        // 广播音频流
        console.log('广播音频流:', stream);
    }

    broadcastHighlight(highlightData) {
        // 广播高亮数据
        console.log('广播高亮:', highlightData);
    }

    // 工具方法
    getCurrentUser() {
        return {
            id: 'user_' + Date.now(),
            name: '学习者',
            avatar: '👤'
        };
    }

    generateRoomId() {
        return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateConceptId() {
        return 'concept_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateRelationId() {
        return 'relation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeWebRTC() {
        // 初始化WebRTC连接
        console.log('初始化WebRTC');
    }
}

// 协作工具类
class CollaborationTools {
    constructor() {
        this.tools = new Map();
    }

    registerTool(name, tool) {
        this.tools.set(name, tool);
    }

    getTool(name) {
        return this.tools.get(name);
    }
}

// 点对点连接管理器
class PeerConnectionManager {
    constructor() {
        this.connections = new Map();
        this.localStream = null;
    }

    createConnection(peerId) {
        const connection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        this.connections.set(peerId, connection);
        return connection;
    }

    closeConnection(peerId) {
        const connection = this.connections.get(peerId);
        if (connection) {
            connection.close();
            this.connections.delete(peerId);
        }
    }
}

// 共享知识图谱
class SharedKnowledgeGraph {
    constructor() {
        this.concepts = new Map();
        this.relations = new Map();
        this.layout = null;
    }

    addConcept(concept) {
        this.concepts.set(concept.id, concept);
    }

    addRelation(relation) {
        this.relations.set(relation.id, relation);
    }

    autoLayout() {
        // 简化的自动布局算法
        console.log('执行自动布局');
    }
}

// 导出供其他模块使用
window.CollaborativeLearningSystem = CollaborativeLearningSystem;
// 智能内容推荐系统 - 国家一等奖创新功能
// 基于AI算法的个性化学习内容推荐和智能学习路径规划

class ContentRecommender {
    constructor() {
        this.userProfile = new UserProfile();
        this.contentDatabase = new ContentDatabase();
        this.recommendationEngine = new RecommendationEngine();
        this.learningPathOptimizer = new LearningPathOptimizer();
        this.feedbackCollector = new FeedbackCollector();
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.initializeContentDatabase();
        this.createRecommenderUI();
        this.setupEventListeners();
        this.startRecommendationService();
    }

    createRecommenderUI() {
        const recommenderHTML = `
            <div id="content-recommender" class="recommender-container">
                <!-- 推荐触发按钮 -->
                <button id="recommender-trigger" class="recommender-trigger" title="智能推荐">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="recommendation-badge" id="recommendation-badge" hidden>3</span>
                </button>

                <!-- 推荐面板 -->
                <div id="recommender-panel" class="recommender-panel" hidden>
                    <div class="recommender-header">
                        <div class="recommender-title">
                            <h3>智能内容推荐</h3>
                            <span class="recommender-status" id="recommender-status">AI分析中...</span>
                        </div>
                        <div class="recommender-controls">
                            <button class="btn-icon" id="recommender-settings" title="推荐设置">⚙️</button>
                            <button class="btn-icon" id="recommender-refresh" title="刷新推荐">🔄</button>
                            <button class="btn-icon" id="close-recommender" title="关闭">✕</button>
                        </div>
                    </div>

                    <div class="recommender-tabs">
                        <button class="tab-btn active" data-tab="personalized">个性化推荐</button>
                        <button class="tab-btn" data-tab="trending">热门内容</button>
                        <button class="tab-btn" data-tab="path">学习路径</button>
                        <button class="tab-btn" data-tab="similar">相似内容</button>
                        <button class="tab-btn" data-tab="advanced">高级推荐</button>
                    </div>

                    <div class="recommender-content">
                        <!-- 个性化推荐标签页 -->
                        <div class="tab-content active" id="personalized-tab">
                            <div class="recommendation-section">
                                <div class="section-header">
                                    <h4>为你推荐</h4>
                                    <div class="recommendation-score">
                                        <span>匹配度：</span>
                                        <div class="score-bar">
                                            <div class="score-fill" style="width: 92%"></div>
                                        </div>
                                        <span>92%</span>
                                    </div>
                                </div>

                                <div class="recommendation-grid" id="personalized-recommendations">
                                    <div class="recommendation-card featured">
                                        <div class="card-badge">推荐</div>
                                        <div class="card-image">
                                            <div class="placeholder-image">📺</div>
                                        </div>
                                        <div class="card-content">
                                            <h5>媒体素养进阶课程</h5>
                                            <p>基于你的学习进度，推荐深入学习信息验证技巧</p>
                                            <div class="card-meta">
                                                <span class="difficulty">中级</span>
                                                <span class="duration">25分钟</span>
                                                <span class="rating">⭐ 4.8</span>
                                            </div>
                                            <div class="card-tags">
                                                <span class="tag">信息验证</span>
                                                <span class="tag">批判思维</span>
                                            </div>
                                        </div>
                                        <div class="card-actions">
                                            <button class="btn-start">开始学习</button>
                                            <button class="btn-save">收藏</button>
                                            <button class="btn-feedback">👍</button>
                                        </div>
                                    </div>

                                    <div class="recommendation-card">
                                        <div class="card-image">
                                            <div class="placeholder-image">🧠</div>
                                        </div>
                                        <div class="card-content">
                                            <h5>批判性思维训练</h5>
                                            <p>提升逻辑推理和分析能力的专项训练</p>
                                            <div class="card-meta">
                                                <span class="difficulty">中级</span>
                                                <span class="duration">20分钟</span>
                                                <span class="rating">⭐ 4.6</span>
                                            </div>
                                            <div class="card-tags">
                                                <span class="tag">逻辑推理</span>
                                                <span class="tag">分析能力</span>
                                            </div>
                                        </div>
                                        <div class="card-actions">
                                            <button class="btn-start">开始学习</button>
                                            <button class="btn-save">收藏</button>
                                            <button class="btn-feedback">👍</button>
                                        </div>
                                    </div>

                                    <div class="recommendation-card">
                                        <div class="card-image">
                                            <div class="placeholder-image">🔍</div>
                                        </div>
                                        <div class="card-content">
                                            <h5>信息源可信度评估</h5>
                                            <p>学习如何判断信息来源的可靠性和权威性</p>
                                            <div class="card-meta">
                                                <span class="difficulty">初级</span>
                                                <span class="duration">15分钟</span>
                                                <span class="rating">⭐ 4.7</span>
                                            </div>
                                            <div class="card-tags">
                                                <span class="tag">信息源</span>
                                                <span class="tag">可信度</span>
                                            </div>
                                        </div>
                                        <div class="card-actions">
                                            <button class="btn-start">开始学习</button>
                                            <button class="btn-save">收藏</button>
                                            <button class="btn-feedback">👍</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="recommendation-reasons">
                                    <h5>推荐理由</h5>
                                    <div class="reason-list">
                                        <div class="reason-item">
                                            <div class="reason-icon">🎯</div>
                                            <span>基于你在信息验证方面的优秀表现</span>
                                        </div>
                                        <div class="reason-item">
                                            <div class="reason-icon">📈</div>
                                            <span>符合你当前的学习进度和能力水平</span>
                                        </div>
                                        <div class="reason-item">
                                            <div class="reason-icon">🔥</div>
                                            <span>其他相似用户也喜欢这些内容</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 热门内容标签页 -->
                        <div class="tab-content" id="trending-tab">
                            <div class="trending-section">
                                <div class="trending-filters">
                                    <button class="filter-btn active" data-filter="all">全部</button>
                                    <button class="filter-btn" data-filter="today">今日热门</button>
                                    <button class="filter-btn" data-filter="week">本周热门</button>
                                    <button class="filter-btn" data-filter="month">本月热门</button>
                                </div>

                                <div class="trending-list" id="trending-content">
                                    <div class="trending-item">
                                        <div class="trending-rank">1</div>
                                        <div class="trending-info">
                                            <h5>深度伪造技术识别</h5>
                                            <p>学习识别AI生成的虚假内容</p>
                                            <div class="trending-stats">
                                                <span>👥 1,234 人学习</span>
                                                <span>🔥 热度 98%</span>
                                                <span>📈 +15% 今日</span>
                                            </div>
                                        </div>
                                        <button class="btn-trending">立即学习</button>
                                    </div>

                                    <div class="trending-item">
                                        <div class="trending-rank">2</div>
                                        <div class="trending-info">
                                            <h5>社交媒体信息验证</h5>
                                            <p>掌握社交平台信息真实性判断技巧</p>
                                            <div class="trending-stats">
                                                <span>👥 987 人学习</span>
                                                <span>🔥 热度 95%</span>
                                                <span>📈 +12% 今日</span>
                                            </div>
                                        </div>
                                        <button class="btn-trending">立即学习</button>
                                    </div>

                                    <div class="trending-item">
                                        <div class="trending-rank">3</div>
                                        <div class="trending-info">
                                            <h5>网络谣言识别指南</h5>
                                            <p>系统学习谣言传播模式和识别方法</p>
                                            <div class="trending-stats">
                                                <span>👥 756 人学习</span>
                                                <span>🔥 热度 89%</span>
                                                <span>📈 +8% 今日</span>
                                            </div>
                                        </div>
                                        <button class="btn-trending">立即学习</button>
                                    </div>
                                </div>

                                <div class="trending-insights">
                                    <h5>热门趋势分析</h5>
                                    <div class="insight-chart">
                                        <canvas id="trending-chart" width="400" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 学习路径标签页 -->
                        <div class="tab-content" id="path-tab">
                            <div class="learning-path-section">
                                <div class="path-overview">
                                    <h4>个性化学习路径</h4>
                                    <p>基于AI分析为你定制的最优学习路径</p>
                                </div>

                                <div class="path-selector">
                                    <div class="path-option" data-path="beginner">
                                        <div class="path-icon">🌱</div>
                                        <h5>入门路径</h5>
                                        <p>适合媒体素养初学者</p>
                                        <div class="path-duration">预计 2-3 周</div>
                                    </div>
                                    
                                    <div class="path-option active" data-path="intermediate">
                                        <div class="path-icon">🚀</div>
                                        <h5>进阶路径</h5>
                                        <p>提升批判性思维能力</p>
                                        <div class="path-duration">预计 3-4 周</div>
                                    </div>
                                    
                                    <div class="path-option" data-path="advanced">
                                        <div class="path-icon">🎯</div>
                                        <h5>专家路径</h5>
                                        <p>成为媒体素养专家</p>
                                        <div class="path-duration">预计 4-6 周</div>
                                    </div>
                                </div>

                                <div class="path-details" id="path-details">
                                    <div class="path-progress">
                                        <div class="progress-header">
                                            <h5>进阶路径进度</h5>
                                            <span class="progress-percentage">65%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 65%"></div>
                                        </div>
                                    </div>

                                    <div class="path-timeline">
                                        <div class="timeline-item completed">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h6>第1周：基础概念</h6>
                                                <p>媒体素养基本概念和框架</p>
                                                <div class="timeline-status">已完成</div>
                                            </div>
                                        </div>

                                        <div class="timeline-item completed">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h6>第2周：信息评估</h6>
                                                <p>信息源可信度和内容质量评估</p>
                                                <div class="timeline-status">已完成</div>
                                            </div>
                                        </div>

                                        <div class="timeline-item current">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h6>第3周：批判性思维</h6>
                                                <p>逻辑推理和论证分析技巧</p>
                                                <div class="timeline-status">进行中</div>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <h6>第4周：实践应用</h6>
                                                <p>真实案例分析和技能应用</p>
                                                <div class="timeline-status">待开始</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="path-recommendations">
                                        <h5>下一步建议</h5>
                                        <div class="next-steps">
                                            <div class="step-item">
                                                <div class="step-icon">📚</div>
                                                <div class="step-content">
                                                    <h6>完成批判性思维模块</h6>
                                                    <p>还有2个练习待完成</p>
                                                </div>
                                                <button class="btn-step">继续</button>
                                            </div>
                                            
                                            <div class="step-item">
                                                <div class="step-icon">🎯</div>
                                                <div class="step-content">
                                                    <h6>参加技能评估</h6>
                                                    <p>检验当前学习成果</p>
                                                </div>
                                                <button class="btn-step">开始</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 相似内容标签页 -->
                        <div class="tab-content" id="similar-tab">
                            <div class="similar-section">
                                <div class="similarity-search">
                                    <h4>基于当前内容的相似推荐</h4>
                                    <div class="current-content">
                                        <div class="content-preview">
                                            <h5>当前学习：媒体素养基础</h5>
                                            <p>正在学习信息验证和批判性思维相关内容</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="similarity-results">
                                    <div class="similarity-filters">
                                        <select id="similarity-type">
                                            <option value="content">内容相似</option>
                                            <option value="difficulty">难度相似</option>
                                            <option value="topic">主题相似</option>
                                            <option value="skill">技能相似</option>
                                        </select>
                                        
                                        <div class="similarity-threshold">
                                            <label>相似度阈值：</label>
                                            <input type="range" id="similarity-slider" min="50" max="100" value="80">
                                            <span id="similarity-value">80%</span>
                                        </div>
                                    </div>

                                    <div class="similar-content-grid" id="similar-content">
                                        <div class="similar-item">
                                            <div class="similarity-score">95%</div>
                                            <div class="item-content">
                                                <h6>高级信息验证技巧</h6>
                                                <p>深入学习专业的信息验证方法</p>
                                                <div class="item-tags">
                                                    <span class="tag">信息验证</span>
                                                    <span class="tag">高级</span>
                                                </div>
                                            </div>
                                            <button class="btn-similar">查看</button>
                                        </div>

                                        <div class="similar-item">
                                            <div class="similarity-score">88%</div>
                                            <div class="item-content">
                                                <h6>批判性思维实战</h6>
                                                <p>通过实际案例练习批判性思维</p>
                                                <div class="item-tags">
                                                    <span class="tag">批判思维</span>
                                                    <span class="tag">实战</span>
                                                </div>
                                            </div>
                                            <button class="btn-similar">查看</button>
                                        </div>

                                        <div class="similar-item">
                                            <div class="similarity-score">82%</div>
                                            <div class="item-content">
                                                <h6>媒体偏见识别</h6>
                                                <p>学习识别和分析媒体报道中的偏见</p>
                                                <div class="item-tags">
                                                    <span class="tag">媒体偏见</span>
                                                    <span class="tag">分析</span>
                                                </div>
                                            </div>
                                            <button class="btn-similar">查看</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 高级推荐标签页 -->
                        <div class="tab-content" id="advanced-tab">
                            <div class="advanced-section">
                                <div class="ai-insights">
                                    <h4>AI深度分析推荐</h4>
                                    <div class="insight-cards">
                                        <div class="insight-card">
                                            <div class="insight-icon">🧠</div>
                                            <div class="insight-content">
                                                <h5>学习模式分析</h5>
                                                <p>你倾向于通过实践案例学习，建议选择更多互动性内容</p>
                                            </div>
                                        </div>

                                        <div class="insight-card">
                                            <div class="insight-icon">⏰</div>
                                            <div class="insight-content">
                                                <h5>最佳学习时间</h5>
                                                <p>根据你的活跃时间，建议在下午2-4点进行深度学习</p>
                                            </div>
                                        </div>

                                        <div class="insight-card">
                                            <div class="insight-icon">🎯</div>
                                            <div class="insight-content">
                                                <h5>技能缺口分析</h5>
                                                <p>在数字素养方面还有提升空间，推荐相关专项训练</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="predictive-recommendations">
                                    <h5>预测性推荐</h5>
                                    <div class="prediction-timeline">
                                        <div class="prediction-item">
                                            <div class="prediction-time">下周</div>
                                            <div class="prediction-content">
                                                <h6>建议学习：数字隐私保护</h6>
                                                <p>基于你的学习轨迹，这将是下一个重要技能点</p>
                                                <div class="prediction-confidence">预测准确度：89%</div>
                                            </div>
                                        </div>

                                        <div class="prediction-item">
                                            <div class="prediction-time">下月</div>
                                            <div class="prediction-content">
                                                <h6>建议参与：媒体素养认证</h6>
                                                <p>你的技能水平将达到认证要求</p>
                                                <div class="prediction-confidence">预测准确度：76%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="collaborative-filtering">
                                    <h5>协同过滤推荐</h5>
                                    <div class="user-clusters">
                                        <div class="cluster-info">
                                            <h6>相似用户群体</h6>
                                            <p>与你学习模式相似的用户还学习了：</p>
                                        </div>
                                        
                                        <div class="cluster-recommendations">
                                            <div class="cluster-item">
                                                <span class="item-name">网络安全基础</span>
                                                <span class="item-popularity">78% 用户选择</span>
                                            </div>
                                            <div class="cluster-item">
                                                <span class="item-name">数据可视化解读</span>
                                                <span class="item-popularity">65% 用户选择</span>
                                            </div>
                                            <div class="cluster-item">
                                                <span class="item-name">算法偏见识别</span>
                                                <span class="item-popularity">52% 用户选择</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 推荐设置面板 -->
                <div id="recommender-settings-panel" class="settings-panel" hidden>
                    <div class="settings-header">
                        <h4>推荐设置</h4>
                        <button id="close-settings" class="btn-close">✕</button>
                    </div>
                    
                    <div class="settings-content">
                        <div class="setting-group">
                            <h5>推荐偏好</h5>
                            <div class="preference-options">
                                <label><input type="checkbox" checked> 基于学习历史</label>
                                <label><input type="checkbox" checked> 基于技能水平</label>
                                <label><input type="checkbox"> 基于时间偏好</label>
                                <label><input type="checkbox" checked> 基于相似用户</label>
                            </div>
                        </div>

                        <div class="setting-group">
                            <h5>内容类型</h5>
                            <div class="content-types">
                                <label><input type="checkbox" checked> 理论学习</label>
                                <label><input type="checkbox" checked> 实践练习</label>
                                <label><input type="checkbox"> 案例分析</label>
                                <label><input type="checkbox"> 互动游戏</label>
                            </div>
                        </div>

                        <div class="setting-group">
                            <h5>难度偏好</h5>
                            <div class="difficulty-range">
                                <input type="range" id="difficulty-range" min="1" max="5" value="3">
                                <div class="range-labels">
                                    <span>简单</span>
                                    <span>困难</span>
                                </div>
                            </div>
                        </div>

                        <div class="setting-group">
                            <h5>推荐频率</h5>
                            <select id="recommendation-frequency">
                                <option value="realtime">实时推荐</option>
                                <option value="daily">每日推荐</option>
                                <option value="weekly">每周推荐</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-actions">
                        <button id="save-settings" class="btn-primary">保存设置</button>
                        <button id="reset-settings" class="btn-secondary">重置</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', recommenderHTML);
        this.injectRecommenderStyles();
    }

    injectRecommenderStyles() {
        const styles = `
            .recommender-container {
                position: fixed;
                bottom: var(--space-6);
                left: var(--space-6);
                z-index: 1000;
                font-family: var(--font-sans);
            }

            .recommender-trigger {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f59e0b, #d97706);
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

            .recommender-trigger:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-2xl);
            }

            .recommendation-badge {
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
                animation: bounce 2s infinite;
            }

            .recommender-panel {
                position: absolute;
                bottom: 80px;
                left: 0;
                width: 700px;
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

            .recommender-panel:not([hidden]) {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .recommender-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(245, 158, 11, 0.05);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            }

            .recommender-title h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1rem;
                font-weight: 600;
            }

            .recommender-status {
                font-size: 0.75rem;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: 500;
                background: var(--info);
                color: white;
                animation: pulse 2s infinite;
            }

            .recommendation-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .recommendation-card {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
            }

            .recommendation-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-lg);
                border-color: #f59e0b;
            }

            .recommendation-card.featured {
                border: 2px solid #f59e0b;
                box-shadow: var(--shadow-md);
            }

            .card-badge {
                position: absolute;
                top: var(--space-2);
                right: var(--space-2);
                background: #f59e0b;
                color: white;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-size: 0.625rem;
                font-weight: 600;
                z-index: 1;
            }

            .card-image {
                height: 80px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
            }

            .placeholder-image {
                font-size: 2rem;
            }

            .card-content {
                padding: var(--space-4);
            }

            .card-content h5 {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
                line-height: 1.3;
            }

            .card-content p {
                margin: 0 0 var(--space-3) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .card-meta {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-3);
                flex-wrap: wrap;
            }

            .card-meta span {
                font-size: 0.625rem;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: 500;
            }

            .difficulty {
                background: var(--info);
                color: white;
            }

            .duration {
                background: var(--warning);
                color: white;
            }

            .rating {
                background: var(--success);
                color: white;
            }

            .card-tags {
                display: flex;
                gap: var(--space-1);
                margin-bottom: var(--space-3);
                flex-wrap: wrap;
            }

            .tag {
                font-size: 0.625rem;
                padding: var(--space-1) var(--space-2);
                background: rgba(245, 158, 11, 0.1);
                color: #f59e0b;
                border-radius: var(--radius-sm);
                font-weight: 500;
            }

            .card-actions {
                display: flex;
                gap: var(--space-2);
                padding: 0 var(--space-4) var(--space-4);
            }

            .btn-start {
                flex: 1;
                padding: var(--space-2);
                background: #f59e0b;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-start:hover {
                background: #d97706;
                transform: translateY(-1px);
            }

            .btn-save, .btn-feedback {
                width: 32px;
                height: 32px;
                border: 1px solid var(--border-primary);
                background: var(--surface);
                border-radius: var(--radius-md);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.875rem;
                transition: all 0.2s ease;
            }

            .btn-save:hover, .btn-feedback:hover {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }

            .recommendation-reasons {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
            }

            .recommendation-reasons h5 {
                margin: 0 0 var(--space-3) 0;
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .reason-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .reason-item {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-2);
                background: var(--surface);
                border-radius: var(--radius-md);
            }

            .reason-icon {
                font-size: 1.25rem;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(245, 158, 11, 0.1);
                border-radius: var(--radius-md);
            }

            .trending-filters {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-4);
            }

            .filter-btn {
                padding: var(--space-2) var(--space-3);
                border: 1px solid var(--border-primary);
                background: var(--surface);
                color: var(--text-secondary);
                border-radius: var(--radius-md);
                cursor: pointer;
                font-size: 0.75rem;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .filter-btn:hover {
                border-color: #f59e0b;
                color: var(--text-primary);
            }

            .filter-btn.active {
                background: #f59e0b;
                color: white;
                border-color: #f59e0b;
            }

            .trending-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
                margin-bottom: var(--space-6);
            }

            .trending-item {
                display: flex;
                align-items: center;
                gap: var(--space-4);
                padding: var(--space-4);
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                transition: all 0.2s ease;
            }

            .trending-item:hover {
                border-color: #f59e0b;
                box-shadow: var(--shadow-md);
            }

            .trending-rank {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.875rem;
            }

            .trending-info {
                flex: 1;
            }

            .trending-info h5 {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .trending-info p {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .trending-stats {
                display: flex;
                gap: var(--space-3);
                font-size: 0.625rem;
                color: var(--text-secondary);
            }

            .btn-trending {
                padding: var(--space-2) var(--space-4);
                background: #f59e0b;
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-trending:hover {
                background: #d97706;
                transform: translateY(-1px);
            }

            .path-selector {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .path-option {
                background: var(--background);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .path-option:hover {
                border-color: #f59e0b;
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            .path-option.active {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.05);
                box-shadow: var(--shadow-md);
            }

            .path-icon {
                font-size: 2rem;
                margin-bottom: var(--space-2);
            }

            .path-option h5 {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .path-option p {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .path-duration {
                font-size: 0.625rem;
                color: #f59e0b;
                font-weight: 500;
            }

            .path-timeline {
                display: flex;
                flex-direction: column;
                gap: var(--space-4);
                margin-bottom: var(--space-6);
            }

            .timeline-item {
                display: flex;
                gap: var(--space-4);
                position: relative;
            }

            .timeline-item:not(:last-child)::after {
                content: '';
                position: absolute;
                left: 15px;
                top: 32px;
                bottom: -16px;
                width: 2px;
                background: var(--border-primary);
            }

            .timeline-item.completed::after {
                background: var(--success);
            }

            .timeline-item.current::after {
                background: linear-gradient(to bottom, var(--success), var(--border-primary));
            }

            .timeline-marker {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--border-primary);
                border: 3px solid var(--surface);
                flex-shrink: 0;
            }

            .timeline-item.completed .timeline-marker {
                background: var(--success);
            }

            .timeline-item.current .timeline-marker {
                background: #f59e0b;
                animation: pulse 2s infinite;
            }

            .timeline-content {
                flex: 1;
                padding-top: var(--space-1);
            }

            .timeline-content h6 {
                margin: 0 0 var(--space-1) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .timeline-content p {
                margin: 0 0 var(--space-2) 0;
                font-size: 0.75rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }

            .timeline-status {
                font-size: 0.625rem;
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: 500;
                display: inline-block;
            }

            .timeline-item.completed .timeline-status {
                background: var(--success);
                color: white;
            }

            .timeline-item.current .timeline-status {
                background: #f59e0b;
                color: white;
            }

            .timeline-item:not(.completed):not(.current) .timeline-status {
                background: var(--border-primary);
                color: var(--text-secondary);
            }

            .settings-panel {
                position: absolute;
                top: 0;
                right: 0;
                width: 300px;
                height: 100%;
                background: var(--surface);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-xl);
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }

            .settings-panel:not([hidden]) {
                transform: translateX(0);
            }

            .settings-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(245, 158, 11, 0.05);
                border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            }

            .settings-content {
                flex: 1;
                padding: var(--space-4);
                overflow-y: auto;
            }

            .setting-group {
                margin-bottom: var(--space-6);
            }

            .setting-group h5 {
                margin: 0 0 var(--space-3) 0;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
            }

            .preference-options, .content-types {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .preference-options label, .content-types label {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: 0.75rem;
                color: var(--text-primary);
                cursor: pointer;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            @media (max-width: 768px) {
                .recommender-container {
                    bottom: var(--space-4);
                    left: var(--space-4);
                }

                .recommender-panel {
                    width: calc(100vw - 2rem);
                    height: calc(100vh - 8rem);
                    bottom: 80px;
                    left: -1rem;
                }

                .recommendation-grid {
                    grid-template-columns: 1fr;
                }

                .path-selector {
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
        document.getElementById('recommender-trigger').addEventListener('click', () => {
            this.toggleRecommender();
        });

        // 关闭按钮
        document.getElementById('close-recommender').addEventListener('click', () => {
            this.hideRecommender();
        });

        // 刷新推荐
        document.getElementById('recommender-refresh').addEventListener('click', () => {
            this.refreshRecommendations();
        });

        // 设置按钮
        document.getElementById('recommender-settings').addEventListener('click', () => {
            this.showSettings();
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // 推荐卡片操作
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-start')) {
                this.startLearning(e.target);
            } else if (e.target.classList.contains('btn-save')) {
                this.saveContent(e.target);
            } else if (e.target.classList.contains('btn-feedback')) {
                this.provideFeedback(e.target);
            }
        });

        // 热门内容过滤
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterTrendingContent(btn.dataset.filter);
            });
        });

        // 学习路径选择
        document.querySelectorAll('.path-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectLearningPath(option.dataset.path);
            });
        });

        // 相似度滑块
        const similaritySlider = document.getElementById('similarity-slider');
        if (similaritySlider) {
            similaritySlider.addEventListener('input', (e) => {
                this.updateSimilarityThreshold(e.target.value);
            });
        }

        // 设置面板
        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });
    }

    toggleRecommender() {
        const panel = document.getElementById('recommender-panel');
        if (panel.hidden) {
            this.showRecommender();
        } else {
            this.hideRecommender();
        }
    }

    showRecommender() {
        document.getElementById('recommender-panel').hidden = false;
        document.getElementById('recommendation-badge').hidden = true;
        this.updateRecommendations();
    }

    hideRecommender() {
        document.getElementById('recommender-panel').hidden = true;
        this.hideSettings();
    }

    // 统一公开API以兼容主应用触发
    show() { this.showRecommender(); }
    hide() { this.hideRecommender(); }
    toggle() { this.toggleRecommender(); }

    refreshRecommendations() {
        document.getElementById('recommender-status').textContent = 'AI分析中...';
        
        // 模拟AI分析过程
        setTimeout(() => {
            this.updateRecommendations();
            document.getElementById('recommender-status').textContent = '推荐已更新';
            
            setTimeout(() => {
                document.getElementById('recommender-status').textContent = '准备就绪';
            }, 2000);
        }, 1500);
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
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'personalized':
                this.loadPersonalizedRecommendations();
                break;
            case 'trending':
                this.loadTrendingContent();
                break;
            case 'path':
                this.loadLearningPaths();
                break;
            case 'similar':
                this.loadSimilarContent();
                break;
            case 'advanced':
                this.loadAdvancedRecommendations();
                break;
        }
    }

    loadPersonalizedRecommendations() {
        // 加载个性化推荐
        console.log('加载个性化推荐');
        this.recommendationEngine.generatePersonalizedRecommendations();
    }

    loadTrendingContent() {
        // 加载热门内容
        console.log('加载热门内容');
        this.renderTrendingChart();
    }

    loadLearningPaths() {
        // 加载学习路径
        console.log('加载学习路径');
        this.learningPathOptimizer.generateOptimalPath();
    }

    loadSimilarContent() {
        // 加载相似内容
        console.log('加载相似内容');
    }

    loadAdvancedRecommendations() {
        // 加载高级推荐
        console.log('加载高级推荐');
    }

    renderTrendingChart() {
        const canvas = document.getElementById('trending-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 简化的趋势图绘制
        const data = [65, 78, 82, 88, 92, 89, 95];
        const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // 绘制坐标轴
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y轴
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // X轴
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // 绘制数据线
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            const y = canvas.height - padding - (value / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = '#f59e0b';
        data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            const y = canvas.height - padding - (value / 100) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // 绘制标签
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        labels.forEach((label, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            ctx.fillText(label, x, canvas.height - padding + 20);
        });
    }

    startLearning(button) {
        const card = button.closest('.recommendation-card');
        const title = card.querySelector('h5').textContent;
        console.log('开始学习:', title);
        
        // 记录用户行为
        this.feedbackCollector.recordAction('start_learning', { content: title });
        
        // 显示学习界面或跳转到相应内容
        this.showToast('开始学习：' + title, 'success');
    }

    saveContent(button) {
        const card = button.closest('.recommendation-card');
        const title = card.querySelector('h5').textContent;
        console.log('收藏内容:', title);
        
        // 记录用户行为
        this.feedbackCollector.recordAction('save_content', { content: title });
        
        button.innerHTML = '✓';
        button.style.background = 'var(--success)';
        button.style.color = 'white';
        
        this.showToast('已收藏：' + title, 'success');
    }

    provideFeedback(button) {
        const card = button.closest('.recommendation-card');
        const title = card.querySelector('h5').textContent;
        
        // 切换反馈状态
        if (button.innerHTML === '👍') {
            button.innerHTML = '❤️';
            button.style.background = 'var(--danger)';
            button.style.color = 'white';
            this.feedbackCollector.recordAction('like_content', { content: title });
            this.showToast('感谢反馈！', 'success');
        } else {
            button.innerHTML = '👍';
            button.style.background = '';
            button.style.color = '';
        }
    }

    filterTrendingContent(filter) {
        // 更新过滤按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // 根据过滤条件更新内容
        console.log('过滤热门内容:', filter);
        this.updateTrendingContent(filter);
    }

    updateTrendingContent(filter) {
        // 更新热门内容列表
        console.log('更新热门内容:', filter);
    }

    selectLearningPath(pathType) {
        // 更新路径选择状态
        document.querySelectorAll('.path-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-path="${pathType}"]`).classList.add('active');
        
        // 加载对应路径详情
        console.log('选择学习路径:', pathType);
        this.loadPathDetails(pathType);
    }

    loadPathDetails(pathType) {
        // 加载路径详情
        console.log('加载路径详情:', pathType);
    }

    updateSimilarityThreshold(value) {
        document.getElementById('similarity-value').textContent = value + '%';
        this.updateSimilarContent(value);
    }

    updateSimilarContent(threshold) {
        // 根据相似度阈值更新内容
        console.log('更新相似内容，阈值:', threshold);
    }

    showSettings() {
        document.getElementById('recommender-settings-panel').hidden = false;
    }

    hideSettings() {
        document.getElementById('recommender-settings-panel').hidden = true;
    }

    saveSettings() {
        // 保存设置
        const settings = this.collectSettings();
        localStorage.setItem('recommender_settings', JSON.stringify(settings));
        this.showToast('设置已保存', 'success');
        this.hideSettings();
    }

    resetSettings() {
        // 重置设置
        localStorage.removeItem('recommender_settings');
        this.loadDefaultSettings();
        this.showToast('设置已重置', 'info');
    }

    collectSettings() {
        // 收集当前设置
        return {
            preferences: Array.from(document.querySelectorAll('.preference-options input:checked')).map(input => input.parentElement.textContent.trim()),
            contentTypes: Array.from(document.querySelectorAll('.content-types input:checked')).map(input => input.parentElement.textContent.trim()),
            difficulty: document.getElementById('difficulty-range').value,
            frequency: document.getElementById('recommendation-frequency').value
        };
    }

    loadDefaultSettings() {
        // 加载默认设置
        console.log('加载默认设置');
    }

    updateRecommendations() {
        // 更新推荐内容
        this.recommendationEngine.updateRecommendations();
        this.updateRecommendationBadge();
    }

    updateRecommendationBadge() {
        // 更新推荐徽章
        const badge = document.getElementById('recommendation-badge');
        const newRecommendations = this.recommendationEngine.getNewRecommendationsCount();
        
        if (newRecommendations > 0) {
            badge.textContent = newRecommendations;
            badge.hidden = false;
        } else {
            badge.hidden = true;
        }
    }

    showToast(message, type = 'info') {
        // 显示提示消息
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: var(--surface);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-size: 0.875rem;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            toast.style.borderColor = 'var(--success)';
            toast.style.color = 'var(--success)';
        } else if (type === 'error') {
            toast.style.borderColor = 'var(--danger)';
            toast.style.color = 'var(--danger)';
        } else if (type === 'warning') {
            toast.style.borderColor = 'var(--warning)';
            toast.style.color = 'var(--warning)';
        }
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    startRecommendationService() {
        // 启动推荐服务
        setInterval(() => {
            this.checkForNewRecommendations();
        }, 30000); // 每30秒检查一次新推荐
    }

    checkForNewRecommendations() {
        // 检查新推荐
        const hasNewRecommendations = this.recommendationEngine.hasNewRecommendations();
        if (hasNewRecommendations) {
            this.updateRecommendationBadge();
        }
    }

    loadUserProfile() {
        // 加载用户档案
        this.userProfile.load();
    }

    initializeContentDatabase() {
        // 初始化内容数据库
        this.contentDatabase.initialize();
    }
}

// 用户档案管理类
class UserProfile {
    constructor() {
        this.profile = {
            learningHistory: [],
            preferences: {},
            skillLevels: {},
            goals: [],
            learningStyle: 'visual',
            timePreferences: {},
            interests: []
        };
    }

    load() {
        const saved = localStorage.getItem('user_profile');
        if (saved) {
            this.profile = { ...this.profile, ...JSON.parse(saved) };
        }
    }

    save() {
        localStorage.setItem('user_profile', JSON.stringify(this.profile));
    }

    updateLearningHistory(activity) {
        this.profile.learningHistory.push({
            ...activity,
            timestamp: Date.now()
        });
        this.save();
    }

    getSkillLevel(skill) {
        return this.profile.skillLevels[skill] || 'beginner';
    }

    updateSkillLevel(skill, level) {
        this.profile.skillLevels[skill] = level;
        this.save();
    }
}

// 内容数据库类
class ContentDatabase {
    constructor() {
        this.contents = [];
        this.categories = [];
        this.tags = [];
    }

    initialize() {
        // 初始化内容数据库
        this.loadContentData();
        this.buildIndexes();
    }

    loadContentData() {
        // 加载内容数据
        this.contents = [
            {
                id: 'content_001',
                title: '媒体素养进阶课程',
                description: '基于你的学习进度，推荐深入学习信息验证技巧',
                category: 'media_literacy',
                difficulty: 'intermediate',
                duration: 25,
                rating: 4.8,
                tags: ['信息验证', '批判思维'],
                popularity: 0.92,
                prerequisites: ['basic_media_literacy'],
                learningObjectives: ['信息验证技能', '批判性分析能力']
            },
            {
                id: 'content_002',
                title: '批判性思维训练',
                description: '提升逻辑推理和分析能力的专项训练',
                category: 'critical_thinking',
                difficulty: 'intermediate',
                duration: 20,
                rating: 4.6,
                tags: ['逻辑推理', '分析能力'],
                popularity: 0.85,
                prerequisites: ['basic_logic'],
                learningObjectives: ['逻辑推理', '论证分析']
            },
            {
                id: 'content_003',
                title: '信息源可信度评估',
                description: '学习如何判断信息来源的可靠性和权威性',
                category: 'information_literacy',
                difficulty: 'beginner',
                duration: 15,
                rating: 4.7,
                tags: ['信息源', '可信度'],
                popularity: 0.78,
                prerequisites: [],
                learningObjectives: ['信息源评估', '可信度判断']
            }
        ];
    }

    buildIndexes() {
        // 构建索引
        this.categoryIndex = {};
        this.tagIndex = {};
        this.difficultyIndex = {};
        
        this.contents.forEach(content => {
            // 分类索引
            if (!this.categoryIndex[content.category]) {
                this.categoryIndex[content.category] = [];
            }
            this.categoryIndex[content.category].push(content);
            
            // 标签索引
            content.tags.forEach(tag => {
                if (!this.tagIndex[tag]) {
                    this.tagIndex[tag] = [];
                }
                this.tagIndex[tag].push(content);
            });
            
            // 难度索引
            if (!this.difficultyIndex[content.difficulty]) {
                this.difficultyIndex[content.difficulty] = [];
            }
            this.difficultyIndex[content.difficulty].push(content);
        });
    }

    searchContent(query, filters = {}) {
        let results = this.contents;
        
        // 应用过滤器
        if (filters.category) {
            results = results.filter(content => content.category === filters.category);
        }
        
        if (filters.difficulty) {
            results = results.filter(content => content.difficulty === filters.difficulty);
        }
        
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(content => 
                filters.tags.some(tag => content.tags.includes(tag))
            );
        }
        
        // 文本搜索
        if (query) {
            const queryLower = query.toLowerCase();
            results = results.filter(content => 
                content.title.toLowerCase().includes(queryLower) ||
                content.description.toLowerCase().includes(queryLower) ||
                content.tags.some(tag => tag.toLowerCase().includes(queryLower))
            );
        }
        
        return results;
    }

    getContentById(id) {
        return this.contents.find(content => content.id === id);
    }

    getPopularContent(limit = 10) {
        return this.contents
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    }

    getContentByCategory(category, limit = 10) {
        return this.categoryIndex[category]?.slice(0, limit) || [];
    }
}

// 推荐引擎类
class RecommendationEngine {
    constructor(userProfile, contentDatabase) {
        this.userProfile = userProfile;
        this.contentDatabase = contentDatabase;
        this.algorithms = {
            collaborative: new CollaborativeFiltering(),
            contentBased: new ContentBasedFiltering(),
            hybrid: new HybridRecommendation()
        };
        this.newRecommendationsCount = 0;
    }

    generatePersonalizedRecommendations(limit = 10) {
        const userHistory = this.userProfile.profile.learningHistory;
        const userSkills = this.userProfile.profile.skillLevels;
        const userPreferences = this.userProfile.profile.preferences;
        
        // 基于内容的推荐
        const contentBasedRecs = this.algorithms.contentBased.recommend(
            userHistory, this.contentDatabase.contents, limit
        );
        
        // 协同过滤推荐
        const collaborativeRecs = this.algorithms.collaborative.recommend(
            this.userProfile.profile, this.contentDatabase.contents, limit
        );
        
        // 混合推荐
        const hybridRecs = this.algorithms.hybrid.combine(
            contentBasedRecs, collaborativeRecs, userPreferences
        );
        
        return hybridRecs.slice(0, limit);
    }

    updateRecommendations() {
        const newRecs = this.generatePersonalizedRecommendations();
        this.newRecommendationsCount = newRecs.length;
        return newRecs;
    }

    hasNewRecommendations() {
        return this.newRecommendationsCount > 0;
    }

    getNewRecommendationsCount() {
        return this.newRecommendationsCount;
    }
}

// 学习路径优化器类
class LearningPathOptimizer {
    constructor(userProfile, contentDatabase) {
        this.userProfile = userProfile;
        this.contentDatabase = contentDatabase;
        this.pathTemplates = this.initializePathTemplates();
    }

    initializePathTemplates() {
        return {
            beginner: {
                name: '入门路径',
                description: '适合媒体素养初学者',
                duration: '2-3 周',
                stages: [
                    { name: '基础概念', contents: ['content_003'], duration: 1 },
                    { name: '信息识别', contents: ['content_001'], duration: 1 },
                    { name: '实践应用', contents: ['content_002'], duration: 1 }
                ]
            },
            intermediate: {
                name: '进阶路径',
                description: '提升批判性思维能力',
                duration: '3-4 周',
                stages: [
                    { name: '基础概念', contents: ['content_003'], duration: 1 },
                    { name: '信息评估', contents: ['content_001'], duration: 1 },
                    { name: '批判性思维', contents: ['content_002'], duration: 1 },
                    { name: '实践应用', contents: ['content_001', 'content_002'], duration: 1 }
                ]
            },
            advanced: {
                name: '专家路径',
                description: '成为媒体素养专家',
                duration: '4-6 周',
                stages: [
                    { name: '理论基础', contents: ['content_001', 'content_002', 'content_003'], duration: 2 },
                    { name: '高级技能', contents: ['content_001', 'content_002'], duration: 2 },
                    { name: '专业应用', contents: ['content_002'], duration: 2 }
                ]
            }
        };
    }

    generateOptimalPath(pathType = 'intermediate') {
        const template = this.pathTemplates[pathType];
        if (!template) return null;
        
        const userSkills = this.userProfile.profile.skillLevels;
        const userHistory = this.userProfile.profile.learningHistory;
        
        // 根据用户技能调整路径
        const optimizedPath = this.optimizePathForUser(template, userSkills, userHistory);
        
        return optimizedPath;
    }

    optimizePathForUser(template, userSkills, userHistory) {
        // 根据用户情况优化学习路径
        const optimizedStages = template.stages.map(stage => {
            const adjustedContents = stage.contents.filter(contentId => {
                const content = this.contentDatabase.getContentById(contentId);
                if (!content) return false;
                
                // 检查是否已经学过
                const alreadyLearned = userHistory.some(item => item.contentId === contentId);
                if (alreadyLearned) return false;
                
                // 检查前置条件
                const hasPrerequisites = content.prerequisites.every(prereq => 
                    userSkills[prereq] && userSkills[prereq] !== 'beginner'
                );
                
                return hasPrerequisites;
            });
            
            return {
                ...stage,
                contents: adjustedContents
            };
        });
        
        return {
            ...template,
            stages: optimizedStages
        };
    }
}

// 反馈收集器类
class FeedbackCollector {
    constructor() {
        this.feedbackData = [];
        this.behaviorData = [];
    }

    recordAction(action, data) {
        const record = {
            action,
            data,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };
        
        this.behaviorData.push(record);
        this.saveBehaviorData();
    }

    recordFeedback(contentId, rating, comment = '') {
        const feedback = {
            contentId,
            rating,
            comment,
            timestamp: Date.now(),
            userId: this.getUserId()
        };
        
        this.feedbackData.push(feedback);
        this.saveFeedbackData();
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }

    saveBehaviorData() {
        localStorage.setItem('behavior_data', JSON.stringify(this.behaviorData));
    }

    saveFeedbackData() {
        localStorage.setItem('feedback_data', JSON.stringify(this.feedbackData));
    }

    loadData() {
        const behaviorData = localStorage.getItem('behavior_data');
        if (behaviorData) {
            this.behaviorData = JSON.parse(behaviorData);
        }
        
        const feedbackData = localStorage.getItem('feedback_data');
        if (feedbackData) {
            this.feedbackData = JSON.parse(feedbackData);
        }
    }
}

// 协同过滤算法
class CollaborativeFiltering {
    recommend(userProfile, contents, limit = 10) {
        // 简化的协同过滤实现
        const similarUsers = this.findSimilarUsers(userProfile);
        const recommendations = this.generateRecommendationsFromSimilarUsers(similarUsers, contents);
        return recommendations.slice(0, limit);
    }

    findSimilarUsers(userProfile) {
        // 查找相似用户（模拟数据）
        return [
            { id: 'user_001', similarity: 0.85 },
            { id: 'user_002', similarity: 0.78 },
            { id: 'user_003', similarity: 0.72 }
        ];
    }

    generateRecommendationsFromSimilarUsers(similarUsers, contents) {
        // 基于相似用户生成推荐
        return contents.filter(content => Math.random() > 0.5);
    }
}

// 基于内容的过滤算法
class ContentBasedFiltering {
    recommend(userHistory, contents, limit = 10) {
        if (userHistory.length === 0) {
            return contents.slice(0, limit);
        }
        
        const userInterests = this.extractUserInterests(userHistory);
        const scoredContents = contents.map(content => ({
            ...content,
            score: this.calculateContentScore(content, userInterests)
        }));
        
        return scoredContents
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    extractUserInterests(userHistory) {
        const interests = {};
        userHistory.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => {
                    interests[tag] = (interests[tag] || 0) + 1;
                });
            }
        });
        return interests;
    }

    calculateContentScore(content, userInterests) {
        let score = 0;
        content.tags.forEach(tag => {
            score += userInterests[tag] || 0;
        });
        return score + content.rating * 0.1 + content.popularity * 0.2;
    }
}

// 混合推荐算法
class HybridRecommendation {
    combine(contentBasedRecs, collaborativeRecs, userPreferences) {
        const combined = [];
        const seen = new Set();
        
        // 交替选择推荐内容
        const maxLength = Math.max(contentBasedRecs.length, collaborativeRecs.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (i < contentBasedRecs.length && !seen.has(contentBasedRecs[i].id)) {
                combined.push(contentBasedRecs[i]);
                seen.add(contentBasedRecs[i].id);
            }
            
            if (i < collaborativeRecs.length && !seen.has(collaborativeRecs[i].id)) {
                combined.push(collaborativeRecs[i]);
                seen.add(collaborativeRecs[i].id);
            }
        }
        
        return combined;
    }
}

// 导出主类
window.ContentRecommender = ContentRecommender;
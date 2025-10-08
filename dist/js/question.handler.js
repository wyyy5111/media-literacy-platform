// 问题处理系统 - 集成真实题库功能

import { saveState } from './app/state.js';

export class QuestionHandler {
  constructor() {
    this.currentQuestion = null;
    this.userScore = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    // 按类别跟踪题目数量和已使用的题目ID
    this.categoryStats = {};
    this.usedQuestions = {};
    this.questionResults = {}; // 每个类别的详细答题结果
  }

  // 渲染真实题目
  renderRealQuestion(question, stageId) {
    if (!question) return;

    this.currentQuestion = question;
    window.questionBank.setCurrentQuestion(question.id, question);

    const stageElement = document.querySelector(`#${stageId}`);
    if (!stageElement) return;

    // 清空现有内容
    const contentArea = stageElement.querySelector('.question-content') || 
                       stageElement.querySelector('.material-display') ||
                       stageElement;

    // 创建问题界面
    const questionHTML = this.createQuestionHTML(question);
    
    // 如果有专门的内容区域，更新它；否则创建新的
    if (contentArea.classList.contains('question-content')) {
      contentArea.innerHTML = questionHTML;
    } else {
      const existingContent = contentArea.querySelector('.question-content');
      if (existingContent) {
        existingContent.innerHTML = questionHTML;
      } else {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-content';
        questionDiv.innerHTML = questionHTML;
        contentArea.appendChild(questionDiv);
      }
    }

    // 绑定事件
    this.bindQuestionEvents(question);
  }

  // 创建问题HTML - 单栏布局
  createQuestionHTML(question) {
    const isMultiple = Array.isArray(question.correct) && question.correct.length > 1;
    const inputType = isMultiple ? 'checkbox' : 'radio';
    const inputName = isMultiple ? 'question_answer' : 'question_answer';

    return `
      <div class="question-container">
        <div class="material-display">
          <h3>素材内容</h3>
          <div class="original-content">
            <p>${question.material}</p>
          </div>
        </div>
        
        <div class="question-prompt">
          <h4>${question.prompt}</h4>
          ${isMultiple ? '<p class="hint">（可多选）</p>' : '<p class="hint">（单选）</p>'}
        </div>
        
        <div class="answer-section" id="answerSection">
          <div class="question-options">
            ${question.options.map((option, index) => `
              <label class="option-label">
                <input type="${inputType}" 
                       name="${inputName}" 
                       value="${index}"
                       ${isMultiple ? '' : `id="option_${index}"`}>
                <span class="option-text">${option}</span>
              </label>
            `).join('')}
          </div>
          
          <div class="question-actions">
            <button class="btn btn-primary" id="submitAnswer">
              提交答案
            </button>
            <button class="btn btn-secondary" id="skipQuestion" style="margin-left: 10px;">
              跳过
            </button>
          </div>
        </div>
        
        <!-- 答题后的反馈和解析区域 -->
        <div class="feedback-section" id="feedbackSection" style="display: none;">
          <div class="feedback-content">
            <div class="feedback-result"></div>
            <div class="feedback-explanation"></div>
            <button class="btn btn-primary" id="nextQuestion">继续</button>
          </div>
        </div>
      </div>
    `;
  }

  // 绑定问题事件
  bindQuestionEvents(question) {
    const submitBtn = document.querySelector('#submitAnswer');
    const skipBtn = document.querySelector('#skipQuestion');
    const nextBtn = document.querySelector('#nextQuestion');

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmitAnswer(question));
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.handleSkipQuestion(question));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNextQuestion(question));
    }
  }



  // 处理提交答案
  handleSubmitAnswer(question) {
    const isMultiple = Array.isArray(question.correct) && question.correct.length > 1;
    let userAnswer;

    if (isMultiple) {
      const checked = document.querySelectorAll('input[name="question_answer"]:checked');
      userAnswer = Array.from(checked).map(input => parseInt(input.value));
    } else {
      const checked = document.querySelector('input[name="question_answer"]:checked');
      userAnswer = checked ? parseInt(checked.value) : -1;
    }

    // 验证是否已选择答案
    if ((isMultiple && userAnswer.length === 0) || (!isMultiple && userAnswer === -1)) {
      alert('请先选择答案再提交');
      return;
    }

    // 检查答案
    const result = window.questionBank.checkAnswer(question.id, userAnswer);
    
    // 记录详细答题结果
    if (!this.questionResults[question.category]) {
      this.questionResults[question.category] = [];
    }
    this.questionResults[question.category].push({
      questionId: question.id,
      questionTitle: question.title,
      questionPrompt: question.prompt,
      userAnswer: userAnswer,
      correctAnswer: result.correctAnswer,
      isCorrect: result.correct,
      score: result.score,
      explanation: result.explanation,
      timestamp: new Date().toISOString()
    });
    
    // 更新分数
    this.updateScore(result.score, question.category);
    
    // 显示反馈
    this.showAnswerFeedback(result, question);
    
    // 切换显示区域：隐藏答题区域，显示反馈区域
    const answerSection = document.querySelector('#answerSection');
    const feedbackSection = document.querySelector('#feedbackSection');
    
    if (answerSection) answerSection.style.display = 'none';
    if (feedbackSection) feedbackSection.style.display = 'block';

    // 记录统计
    this.totalQuestions++;
    if (result.correct) {
      this.correctAnswers++;
    }
    
    // 更新类别统计
    if (!this.categoryStats[question.category]) {
      this.categoryStats[question.category] = { count: 0, correct: 0 };
    }
    this.categoryStats[question.category].count++;
    if (result.correct) {
      this.categoryStats[question.category].correct++;
    }
  }



  // 处理跳过问题
  handleSkipQuestion(question) {
    // 记录跳过的详细结果
    if (!this.questionResults[question.category]) {
      this.questionResults[question.category] = [];
    }
    this.questionResults[question.category].push({
      questionId: question.id,
      questionTitle: question.title,
      questionPrompt: question.prompt,
      userAnswer: null,
      correctAnswer: question.correct,
      isCorrect: false,
      score: 0,
      explanation: question.explanation,
      isSkipped: true,
      timestamp: new Date().toISOString()
    });
    
    this.totalQuestions++;
    this.updateScore(0, question.category);
    
    // 更新类别统计
    if (!this.categoryStats[question.category]) {
      this.categoryStats[question.category] = { count: 0, correct: 0 };
    }
    this.categoryStats[question.category].count++;
    
    // 显示跳过反馈
    this.showSkipFeedback(question);
    
    // 切换显示区域：隐藏答题区域，显示反馈区域
    const answerSection = document.querySelector('#answerSection');
    const feedbackSection = document.querySelector('#feedbackSection');
    
    if (answerSection) answerSection.style.display = 'none';
    if (feedbackSection) feedbackSection.style.display = 'block';
  }

  // 显示答案反馈
  showAnswerFeedback(result, question) {
    const feedbackResult = document.querySelector('.feedback-result');
    const feedbackExplanation = document.querySelector('.feedback-explanation');

    if (result.correct) {
      feedbackResult.innerHTML = `
        <div class="feedback-correct">
          <span class="feedback-icon">✅</span>
          <span class="feedback-text">回答正确！</span>
          <span class="feedback-score">+${result.score}分</span>
        </div>
      `;
      feedbackResult.className = 'feedback-result correct';
    } else {
      feedbackResult.innerHTML = `
        <div class="feedback-incorrect">
          <span class="feedback-icon">❌</span>
          <span class="feedback-text">回答错误</span>
          <span class="feedback-score">+${result.score}分</span>
        </div>
      `;
      feedbackResult.className = 'feedback-result incorrect';
    }

    if (result.explanation) {
      feedbackExplanation.innerHTML = `
        <div class="explanation">
          <h5>解析：</h5>
          <p>${result.explanation}</p>
        </div>
      `;
    }

    // 显示正确答案
    if (!result.correct && result.correctAnswer) {
      const correctOptions = Array.isArray(result.correctAnswer) ? 
        result.correctAnswer.map(idx => question.options[idx]).join('、') :
        question.options[result.correctAnswer];
      
      feedbackExplanation.innerHTML += `
        <div class="correct-answer">
          <h5>正确答案：</h5>
          <p>${correctOptions}</p>
        </div>
      `;
    }
  }

  // 显示跳过反馈
  showSkipFeedback(question) {
    const feedbackResult = document.querySelector('.feedback-result');
    const feedbackExplanation = document.querySelector('.feedback-explanation');

    feedbackResult.innerHTML = `
      <div class="feedback-skip">
        <span class="feedback-icon">⏭️</span>
        <span class="feedback-text">已跳过此题</span>
        <span class="feedback-score">+0分</span>
      </div>
    `;
    feedbackResult.className = 'feedback-result skip';

    // 显示正确答案
    const correctOptions = Array.isArray(question.correct) ? 
      question.correct.map(idx => question.options[idx]).join('、') :
      question.options[question.correct[0]];
    
    feedbackExplanation.innerHTML = `
      <div class="correct-answer">
        <h5>正确答案：</h5>
        <p>${correctOptions}</p>
      </div>
      <div class="explanation">
        <h5>解析：</h5>
        <p>${question.explanation}</p>
      </div>
    `;
  }

  // 更新分数
  updateScore(score, category) {
    const stageMap = {
      'title': 'stage1',
      'chart': 'stage2', 
      'source': 'stage3',
      'ethics': 'stage4',
      'rumor': 'stage5'
    };

    const stageKey = stageMap[category];
    if (stageKey && window.state) {
      window.state.scores[stageKey] = (window.state.scores[stageKey] || 0) + score;
      
      // 保存状态到localStorage
      try {
        saveState();
      } catch (error) {
        console.warn('保存状态失败:', error);
        // 备用保存方法
        if (window.saveState) {
          window.saveState();
        }
      }
      
      // 更新UI显示
      this.updateScoreDisplay();
    }
  }

  // 更新分数显示
  updateScoreDisplay() {
    if (!window.state) return;
    
    // 触发分数列表更新
    if (window.renderScoreList) {
      window.renderScoreList(window.state.scores, window.state.lang);
    }
    
    // 触发进度更新
    if (window.updateProgress) {
      window.updateProgress(window.state.scores);
    }
    
    // 触发雷达图更新
    if (window.drawRadar) {
      window.drawRadar(window.state.scores);
    }
    
    // 同步积分到后台表格
    this.syncScoresToBackend();
  }

  // 同步积分到后台表格
  async syncScoresToBackend() {
    try {
      const scoreData = {
        timestamp: new Date().toISOString(),
        scores: window.state.scores,
        totalScore: Object.values(window.state.scores).reduce((sum, score) => sum + (score || 0), 0),
        completedStages: Object.keys(window.state.scores).filter(key => window.state.scores[key] > 0).length,
        userId: this.getUserId(),
        sessionId: this.getSessionId()
      };

      // 保存到本地存储
      const existingData = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
      existingData.push(scoreData);
      localStorage.setItem('scoreHistory', JSON.stringify(existingData));

      // 如果有Store模块，也保存到IndexedDB
      if (window.Store && window.Store.addExportRecord) {
        await window.Store.addExportRecord({
          type: 'score_update',
          data: scoreData,
          timestamp: scoreData.timestamp
        });
      }

      console.log('积分已同步到后台表格:', scoreData);
    } catch (error) {
      console.warn('积分同步失败:', error);
    }
  }

  // 获取用户ID（简单实现）
  getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  // 获取会话ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // 处理下一题
  handleNextQuestion(question) {
    // 检查是否还有更多题目
    if (this.hasMoreQuestions(question.category)) {
      // 生成下一题
      const nextQuestion = this.generateNextQuestion(question.category);
      this.renderRealQuestion(nextQuestion, question.stageId);
    } else {
      // 完成当前关卡
      this.completeStage(question);
    }
  }

  // 检查是否还有更多题目
  hasMoreQuestions(category) {
    // 每个类别最多6题
    const currentCount = this.getQuestionCount(category);
    return currentCount < 6;
  }

  // 获取当前类别的题目数量
  getQuestionCount(category) {
    if (!this.categoryStats[category]) {
      this.categoryStats[category] = { count: 0, correct: 0 };
    }
    return this.categoryStats[category].count;
  }

  // 生成下一题
  generateNextQuestion(category) {
    if (!this.usedQuestions[category]) {
      this.usedQuestions[category] = [];
    }
    
    const currentCount = this.getQuestionCount(category);
    const level = currentCount + 1;
    
    // 获取该类别的所有题目
    const allQuestions = window.questionBank.getQuestionsByCategory(category);
    
    // 过滤掉已使用的题目
    const availableQuestions = allQuestions.filter(q => 
      !this.usedQuestions[category].includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
      console.warn(`No more questions available for category: ${category}`);
      return null;
    }
    
    // 随机选择一个可用题目
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // 记录已使用的题目
    this.usedQuestions[category].push(selectedQuestion.id);
    
    return selectedQuestion;
  }

  // 完成关卡
  completeStage(question) {
    // 显示详细结果页面
    this.showDetailedResults();
  }

  // 显示详细结果页面
  showDetailedResults() {
    // 获取所有类别的结果
    const allResults = [];
    Object.keys(this.questionResults).forEach(category => {
      allResults.push(...this.questionResults[category]);
    });
    
    const questionResults = allResults;
    const totalQuestions = questionResults.length;
    const correctAnswers = questionResults.filter(result => result.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(1) : 0;
    const totalScore = questionResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(1) : 0;

    const resultsHTML = `
        <div class="detailed-results-container">
            <!-- 醒目的平均分显示 -->
            <div class="score-highlight">
                <div class="score-title">本次平均分</div>
                <div class="score-value">${averageScore}</div>
                <div class="score-subtitle">分</div>
            </div>

            <!-- 总体统计 -->
            <div class="results-summary">
                <h2>关卡完成情况</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${totalQuestions}</div>
                        <div class="stat-label">完成题目</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${correctAnswers}</div>
                        <div class="stat-label">正确题目</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${accuracy}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${totalScore}</div>
                        <div class="stat-label">总得分</div>
                    </div>
                </div>
            </div>

            <!-- 详细题目结果 -->
            <div class="questions-breakdown">
                <h3>题目详情</h3>
                <div class="questions-list">
                    ${questionResults.map((result, index) => `
                        <div class="question-result ${result.isCorrect ? 'correct' : (result.isSkipped ? 'skipped' : 'incorrect')}">
                            <div class="question-header">
                                <span class="question-number">第${index + 1}题</span>
                                <span class="question-status">
                                    ${result.isSkipped ? '跳过' : (result.isCorrect ? '正确' : '错误')}
                                </span>
                                <span class="question-score">${result.score}分</span>
                            </div>
                            <div class="question-content">
                                <div class="question-title">${result.questionTitle}</div>
                                <div class="question-prompt">${result.questionPrompt}</div>
                            </div>
                            <div class="answer-comparison">
                                <div class="user-answer">
                                    <strong>你的答案：</strong>
                                    <span class="${result.isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                                        ${result.userAnswer || '未作答'}
                                    </span>
                                </div>
                                <div class="correct-answer">
                                    <strong>正确答案：</strong>
                                    <span class="correct-answer">${result.correctAnswer}</span>
                                </div>
                            </div>
                            ${result.explanation ? `
                                <div class="explanation">
                                    <strong>解释：</strong>${result.explanation}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="results-actions">
                <button class="btn primary redo-level-btn">
                    <i class="icon-refresh"></i>
                    重做关卡
                </button>
                <button class="btn back-home-btn">
                    <i class="icon-home"></i>
                    返回首页
                </button>
            </div>
        </div>

        <style>
            .detailed-results-container {
                background: var(--bg-gradient);
                min-height: 100vh;
                padding: var(--space-6);
                color: var(--text-primary);
                font-family: var(--font-family-sans);
            }

            /* 醒目的平均分显示 */
            .score-highlight {
                text-align: center;
                margin-bottom: var(--space-8);
                padding: var(--space-6);
                background: var(--bg-surface);
                border-radius: var(--radius-2xl);
                box-shadow: var(--shadow-xl), var(--shadow-glow);
                border: 2px solid var(--accent-primary);
                position: relative;
                overflow: hidden;
            }

            .score-highlight::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--accent-gradient);
            }

            .score-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--text-secondary);
                margin-bottom: var(--space-2);
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .score-value {
                font-size: 4rem;
                font-weight: 800;
                background: var(--accent-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                line-height: 1;
                margin: var(--space-2) 0;
                text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
            }

            .score-subtitle {
                font-size: 1.2rem;
                color: var(--text-secondary);
                font-weight: 500;
            }

            /* 总体统计 */
            .results-summary {
                background: var(--bg-surface);
                border-radius: var(--radius-xl);
                padding: var(--space-6);
                margin-bottom: var(--space-6);
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--border-primary);
            }

            .results-summary h2 {
                margin: 0 0 var(--space-4) 0;
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--text-primary);
                text-align: center;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: var(--space-4);
            }

            .stat-item {
                text-align: center;
                padding: var(--space-4);
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-secondary);
                transition: all var(--transition-normal);
            }

            .stat-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--accent-primary);
            }

            .stat-value {
                font-size: 2rem;
                font-weight: 700;
                color: var(--accent-primary);
                margin-bottom: var(--space-1);
            }

            .stat-label {
                font-size: 0.875rem;
                color: var(--text-secondary);
                font-weight: 500;
            }

            /* 题目详情 */
            .questions-breakdown {
                background: var(--bg-surface);
                border-radius: var(--radius-xl);
                padding: var(--space-6);
                margin-bottom: var(--space-6);
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--border-primary);
            }

            .questions-breakdown h3 {
                margin: 0 0 var(--space-4) 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--text-primary);
                text-align: center;
            }

            .questions-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-4);
            }

            .question-result {
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                border-left: 4px solid var(--border-primary);
                transition: all var(--transition-normal);
            }

            .question-result.correct {
                border-left-color: var(--success);
                background: rgba(16, 185, 129, 0.1);
            }

            .question-result.incorrect {
                border-left-color: var(--danger);
                background: rgba(239, 68, 68, 0.1);
            }

            .question-result.skipped {
                border-left-color: var(--warning);
                background: rgba(245, 158, 11, 0.1);
            }

            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-3);
                padding-bottom: var(--space-2);
                border-bottom: 1px solid var(--border-secondary);
            }

            .question-number {
                font-weight: 600;
                color: var(--text-primary);
            }

            .question-status {
                padding: var(--space-1) var(--space-3);
                border-radius: var(--radius-full);
                font-size: 0.875rem;
                font-weight: 500;
            }

            .question-result.correct .question-status {
                background: var(--success);
                color: white;
            }

            .question-result.incorrect .question-status {
                background: var(--danger);
                color: white;
            }

            .question-result.skipped .question-status {
                background: var(--warning);
                color: black;
            }

            .question-score {
                font-weight: 600;
                color: var(--accent-primary);
            }

            .question-content {
                margin-bottom: var(--space-3);
            }

            .question-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: var(--space-2);
            }

            .question-prompt {
                color: var(--text-secondary);
                line-height: 1.5;
            }

            .answer-comparison {
                display: grid;
                gap: var(--space-2);
                margin-bottom: var(--space-3);
            }

            .user-answer, .correct-answer {
                padding: var(--space-2);
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-secondary);
            }

            .correct-answer span {
                color: var(--success);
            }

            .incorrect-answer {
                color: var(--danger);
            }

            .explanation {
                padding: var(--space-3);
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                border-left: 3px solid var(--info);
                color: var(--text-secondary);
                line-height: 1.5;
            }

            /* 操作按钮 */
            .results-actions {
                display: flex;
                gap: var(--space-4);
                justify-content: center;
                margin-top: var(--space-6);
            }

            .results-actions .btn {
                padding: var(--space-3) var(--space-6);
                font-size: 1rem;
                font-weight: 600;
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                gap: var(--space-2);
                min-width: 140px;
                justify-content: center;
            }

            .redo-level-btn {
                background: var(--accent-gradient);
                color: white;
                border: none;
            }

            .back-home-btn {
                background: var(--bg-secondary);
                color: var(--text-primary);
                border: 1px solid var(--border-primary);
            }

            .back-home-btn:hover {
                background: var(--bg-surface);
                border-color: var(--accent-primary);
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .detailed-results-container {
                    padding: var(--space-4);
                }

                .score-value {
                    font-size: 3rem;
                }

                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .results-actions {
                    flex-direction: column;
                    align-items: center;
                }

                .results-actions .btn {
                    width: 100%;
                    max-width: 200px;
                }
            }
        </style>
    `;

    // 显示结果页面
    document.body.innerHTML = resultsHTML;

    // 绑定按钮事件
    this.bindResultsActions();
  }

  bindResultsActions() {
    const redoBtn = document.querySelector('.redo-level-btn');
    const homeBtn = document.querySelector('.back-home-btn');

    if (redoBtn) {
      redoBtn.addEventListener('click', () => this.retryStage());
    }

    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.backToHome());
    }
  }

  // 重做关卡
  retryStage(category) {
    // 重置当前关卡数据
    this.questionResults = [];
    this.currentQuestionIndex = 0;
    this.categoryData = {};
    
    // 重新初始化当前关卡的分类数据
    const currentStage = this.getCurrentStage();
    if (currentStage && currentStage.categories) {
      currentStage.categories.forEach(category => {
        this.categoryData[category] = {
          currentCount: 0,
          questions: []
        };
      });
    }

    // 重新加载游戏页面并开始新的关卡
    this.loadGameInterface();
    this.generateNextQuestion();
  }

  // 返回首页
  backToHome() {
    // 清除所有数据
    this.questionResults = [];
    this.currentQuestionIndex = 0;
    this.categoryData = {};
    
    // 返回首页
    window.location.reload();
  }

  // 获取统计信息
  getStats() {
    return {
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers,
      accuracy: this.totalQuestions > 0 ? 
        Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0
    };
  }
}

// 创建全局实例
window.questionHandler = new QuestionHandler();
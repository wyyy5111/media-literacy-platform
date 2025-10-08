/**
 * 数据质量检查和优化工具
 * 用于检查项目中的数据结构完整性、内容质量和一致性
 */

class DataQualityChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];
        this.stats = {};
    }

    async checkAll() {
        console.log('🔍 开始数据质量检查...');
        
        // 检查各个数据源
        await this.checkLevelsData();
        await this.checkLexiconsData();
        await this.checkArticlesData();
        await this.checkScoring();
        await this.checkI18n();
        await this.checkDataConsistency();
        
        // 生成报告
        this.generateReport();
        
        return {
            issues: this.issues,
            warnings: this.warnings,
            suggestions: this.suggestions,
            stats: this.stats
        };
    }

    async checkLevelsData() {
        try {
            const response = await fetch('../data/levels.seed.json');
            const data = await response.json();
            
            console.log('📊 检查关卡数据...');
            
            // 检查数据结构完整性
            this.checkDataStructure(data, 'levels.seed.json');
            
            // 检查关卡数量
            this.checkLevelCounts(data);
            
            // 检查多语言支持
            this.checkMultiLanguageSupport(data);
            
            // 检查权重配置
            this.checkWeights(data);
            
            this.stats.levelsData = {
                totalCategories: Object.keys(data.categories || {}).length,
                totalSamples: this.countTotalSamples(data),
                languagesSupported: data.lang || []
            };
            
        } catch (error) {
            this.issues.push({
                type: 'critical',
                source: 'levels.seed.json',
                message: `无法加载关卡数据: ${error.message}`
            });
        }
    }

    async checkLexiconsData() {
        try {
            const response = await fetch('../data/lexicons.json');
            const data = await response.json();
            
            console.log('📚 检查词典数据...');
            
            // 检查词典完整性
            const requiredFields = [
                'hype_words', 'neutral_replacements', 'fuzzy_time', 
                'ethics_flags', 'chart_risks', 'exaggeration', 
                'vague_time', 'ethics'
            ];
            
            requiredFields.forEach(field => {
                if (!data[field]) {
                    this.issues.push({
                        type: 'error',
                        source: 'lexicons.json',
                        message: `缺少必需字段: ${field}`
                    });
                } else if (Array.isArray(data[field]) && data[field].length === 0) {
                    this.warnings.push({
                        type: 'warning',
                        source: 'lexicons.json',
                        message: `字段 ${field} 为空数组`
                    });
                }
            });
            
            // 检查替换词映射
            if (data.neutral_replacements) {
                Object.keys(data.neutral_replacements).forEach(key => {
                    if (!Array.isArray(data.neutral_replacements[key]) || 
                        data.neutral_replacements[key].length === 0) {
                        this.warnings.push({
                            type: 'warning',
                            source: 'lexicons.json',
                            message: `替换词 "${key}" 没有有效的替代选项`
                        });
                    }
                });
            }
            
            this.stats.lexiconsData = {
                totalHypeWords: data.hype_words?.length || 0,
                totalReplacements: Object.keys(data.neutral_replacements || {}).length,
                totalEthicsFlags: data.ethics_flags?.length || 0
            };
            
        } catch (error) {
            this.issues.push({
                type: 'critical',
                source: 'lexicons.json',
                message: `无法加载词典数据: ${error.message}`
            });
        }
    }

    async checkArticlesData() {
        try {
            const response = await fetch('../data/articles.seed.json');
            const data = await response.json();
            
            console.log('📰 检查文章数据...');
            
            if (!Array.isArray(data)) {
                this.issues.push({
                    type: 'error',
                    source: 'articles.seed.json',
                    message: '文章数据应该是数组格式'
                });
                return;
            }
            
            data.forEach((article, index) => {
                // 检查必需字段
                const requiredFields = ['title', 'content', 'keywords'];
                requiredFields.forEach(field => {
                    if (!article[field]) {
                        this.warnings.push({
                            type: 'warning',
                            source: 'articles.seed.json',
                            message: `文章 ${index} 缺少字段: ${field}`
                        });
                    }
                });
                
                // 检查内容质量
                if (article.content && typeof article.content === 'object') {
                    if (!article.content.paragraphs || !Array.isArray(article.content.paragraphs)) {
                        this.warnings.push({
                            type: 'warning',
                            source: 'articles.seed.json',
                            message: `文章 ${index} 内容结构不完整`
                        });
                    }
                }
            });
            
            this.stats.articlesData = {
                totalArticles: data.length,
                averageKeywords: data.reduce((sum, article) => 
                    sum + (article.keywords?.length || 0), 0) / data.length
            };
            
        } catch (error) {
            this.issues.push({
                type: 'critical',
                source: 'articles.seed.json',
                message: `无法加载文章数据: ${error.message}`
            });
        }
    }

    checkScoring() {
        console.log('🎯 检查评分系统...');
        
        // 检查评分权重
        if (window.WEIGHTS) {
            const totalWeight = Object.values(window.WEIGHTS).reduce((sum, w) => sum + w, 0);
            if (Math.abs(totalWeight - 1.0) > 0.01) {
                this.issues.push({
                    type: 'error',
                    source: 'scoring.js',
                    message: `评分权重总和不等于1.0: ${totalWeight}`
                });
            }
        } else {
            this.warnings.push({
                type: 'warning',
                source: 'scoring.js',
                message: '无法访问评分权重配置'
            });
        }
        
        // 检查评分函数
        const scoringFunctions = ['scoreTitle', 'scoreChart', 'scoreSource', 'scoreEthics'];
        scoringFunctions.forEach(func => {
            if (typeof window[func] !== 'function') {
                this.issues.push({
                    type: 'error',
                    source: 'scoring.js',
                    message: `评分函数 ${func} 未定义或不可访问`
                });
            }
        });
    }

    checkI18n() {
        console.log('🌐 检查国际化支持...');
        
        // 检查语言切换功能
        const langToggle = document.querySelector('#langToggle');
        if (!langToggle) {
            this.warnings.push({
                type: 'warning',
                source: 'i18n',
                message: '未找到语言切换按钮'
            });
        }
        
        // 检查当前语言设置
        const currentLang = localStorage.getItem('lang') || 'cn';
        if (!['cn', 'en'].includes(currentLang)) {
            this.warnings.push({
                type: 'warning',
                source: 'i18n',
                message: `不支持的语言设置: ${currentLang}`
            });
        }
        
        this.stats.i18n = {
            currentLanguage: currentLang,
            supportedLanguages: ['cn', 'en']
        };
    }

    checkDataConsistency() {
        console.log('🔗 检查数据一致性...');
        
        // 检查本地存储数据
        const savedData = localStorage.getItem('media-literacy-scores');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (typeof parsed !== 'object') {
                    this.warnings.push({
                        type: 'warning',
                        source: 'localStorage',
                        message: '本地存储数据格式异常'
                    });
                }
            } catch (error) {
                this.issues.push({
                    type: 'error',
                    source: 'localStorage',
                    message: `本地存储数据解析失败: ${error.message}`
                });
            }
        }
        
        // 检查用户行为数据
        const userActions = localStorage.getItem('user_actions');
        if (userActions) {
            try {
                const actions = JSON.parse(userActions);
                if (!Array.isArray(actions)) {
                    this.warnings.push({
                        type: 'warning',
                        source: 'user_actions',
                        message: '用户行为数据应为数组格式'
                    });
                } else {
                    this.stats.userActions = {
                        totalActions: actions.length,
                        lastAction: actions.length > 0 ? new Date(actions[actions.length - 1].timestamp) : null
                    };
                }
            } catch (error) {
                this.issues.push({
                    type: 'error',
                    source: 'user_actions',
                    message: `用户行为数据解析失败: ${error.message}`
                });
            }
        }
    }

    checkDataStructure(data, source) {
        if (!data || typeof data !== 'object') {
            this.issues.push({
                type: 'critical',
                source,
                message: '数据格式无效'
            });
            return;
        }
        
        // 检查版本信息
        if (!data.version) {
            this.warnings.push({
                type: 'warning',
                source,
                message: '缺少版本信息'
            });
        }
        
        // 检查语言支持
        if (!data.lang || !Array.isArray(data.lang)) {
            this.warnings.push({
                type: 'warning',
                source,
                message: '语言配置缺失或格式错误'
            });
        }
    }

    checkLevelCounts(data) {
        if (!data.categories) return;
        
        Object.entries(data.categories).forEach(([category, config]) => {
            const sampleCount = config.samples?.length || 0;
            const minRequired = config.min || 0;
            
            if (sampleCount < minRequired) {
                this.issues.push({
                    type: 'error',
                    source: 'levels.seed.json',
                    message: `类别 ${category} 样本数量不足: ${sampleCount}/${minRequired}`
                });
            } else if (sampleCount < minRequired * 1.5) {
                this.warnings.push({
                    type: 'warning',
                    source: 'levels.seed.json',
                    message: `类别 ${category} 样本数量偏少，建议增加更多样本`
                });
            }
        });
    }

    checkMultiLanguageSupport(data) {
        if (!data.categories) return;
        
        Object.entries(data.categories).forEach(([category, config]) => {
            if (!config.samples) return;
            
            config.samples.forEach((sample, index) => {
                const hasChineseContent = sample.cn && typeof sample.cn === 'object';
                const hasEnglishContent = sample.en && typeof sample.en === 'object';
                
                if (!hasChineseContent || !hasEnglishContent) {
                    this.warnings.push({
                        type: 'warning',
                        source: 'levels.seed.json',
                        message: `${category} 样本 ${index} 缺少完整的多语言支持`
                    });
                }
            });
        });
    }

    checkWeights(data) {
        if (!data.categories) return;
        
        Object.entries(data.categories).forEach(([category, config]) => {
            if (!config.samples) return;
            
            config.samples.forEach((sample, index) => {
                if (sample.weights) {
                    const totalWeight = Object.values(sample.weights).reduce((sum, w) => sum + w, 0);
                    if (Math.abs(totalWeight - 1.0) > 0.01) {
                        this.warnings.push({
                            type: 'warning',
                            source: 'levels.seed.json',
                            message: `${category} 样本 ${index} 权重总和不等于1.0: ${totalWeight}`
                        });
                    }
                }
            });
        });
    }

    countTotalSamples(data) {
        if (!data.categories) return 0;
        
        return Object.values(data.categories).reduce((total, config) => {
            return total + (config.samples?.length || 0);
        }, 0);
    }

    generateReport() {
        console.log('\n📋 数据质量检查报告');
        console.log('='.repeat(50));
        
        // 统计信息
        console.log('\n📊 统计信息:');
        console.log(`- 关键问题: ${this.issues.length}`);
        console.log(`- 警告: ${this.warnings.length}`);
        console.log(`- 建议: ${this.suggestions.length}`);
        
        if (this.stats.levelsData) {
            console.log(`- 关卡类别: ${this.stats.levelsData.totalCategories}`);
            console.log(`- 总样本数: ${this.stats.levelsData.totalSamples}`);
        }
        
        // 关键问题
        if (this.issues.length > 0) {
            console.log('\n🚨 关键问题:');
            this.issues.forEach((issue, index) => {
                console.log(`${index + 1}. [${issue.source}] ${issue.message}`);
            });
        }
        
        // 警告
        if (this.warnings.length > 0) {
            console.log('\n⚠️ 警告:');
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. [${warning.source}] ${warning.message}`);
            });
        }
        
        // 建议
        if (this.suggestions.length > 0) {
            console.log('\n💡 优化建议:');
            this.suggestions.forEach((suggestion, index) => {
                console.log(`${index + 1}. ${suggestion}`);
            });
        }
        
        // 总体评估
        console.log('\n🎯 总体评估:');
        if (this.issues.length === 0 && this.warnings.length === 0) {
            console.log('✅ 数据质量优秀，未发现问题');
        } else if (this.issues.length === 0) {
            console.log('✅ 数据质量良好，有少量警告需要关注');
        } else if (this.issues.length <= 3) {
            console.log('⚠️ 数据质量一般，需要修复关键问题');
        } else {
            console.log('❌ 数据质量较差，需要大量修复工作');
        }
        
        console.log('='.repeat(50));
    }

    // 自动修复功能
    async autoFix() {
        console.log('🔧 开始自动修复...');
        
        let fixedCount = 0;
        
        // 修复本地存储数据格式问题
        try {
            const savedData = localStorage.getItem('media-literacy-scores');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (typeof parsed === 'object' && parsed !== null) {
                    // 确保数据结构完整
                    const fixedData = {
                        stage1: parsed.stage1 || 0,
                        stage2: parsed.stage2 || 0,
                        stage3: parsed.stage3 || 0,
                        stage4: parsed.stage4 || 0,
                        stage5: parsed.stage5 || 0,
                        timestamp: parsed.timestamp || Date.now(),
                        ...parsed
                    };
                    localStorage.setItem('media-literacy-scores', JSON.stringify(fixedData));
                    fixedCount++;
                }
            }
        } catch (error) {
            console.warn('无法修复本地存储数据:', error);
        }
        
        // 修复语言设置
        const currentLang = localStorage.getItem('lang');
        if (!currentLang || !['cn', 'en'].includes(currentLang)) {
            localStorage.setItem('lang', 'cn');
            fixedCount++;
        }
        
        console.log(`✅ 自动修复完成，共修复 ${fixedCount} 个问题`);
        return fixedCount;
    }

    // 导出检查结果
    exportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                issues: this.issues.length,
                warnings: this.warnings.length,
                suggestions: this.suggestions.length
            },
            details: {
                issues: this.issues,
                warnings: this.warnings,
                suggestions: this.suggestions,
                stats: this.stats
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-quality-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 检查报告已导出');
    }
}

// 数据优化建议生成器
class DataOptimizer {
    constructor() {
        this.optimizations = [];
    }

    generateOptimizations(checkerResults) {
        const { issues, warnings, stats } = checkerResults;
        
        // 基于检查结果生成优化建议
        if (stats.levelsData && stats.levelsData.totalSamples < 100) {
            this.optimizations.push({
                type: 'content',
                priority: 'high',
                title: '增加关卡样本数量',
                description: '当前样本数量偏少，建议增加到100+以提供更丰富的学习体验',
                action: '在 levels.seed.json 中添加更多样本'
            });
        }
        
        if (issues.some(issue => issue.source.includes('lexicons'))) {
            this.optimizations.push({
                type: 'data',
                priority: 'high',
                title: '完善词典数据',
                description: '词典数据存在缺失或格式问题，影响内容质量检查',
                action: '检查并补充 lexicons.json 中的缺失字段'
            });
        }
        
        if (warnings.some(warning => warning.message.includes('多语言'))) {
            this.optimizations.push({
                type: 'i18n',
                priority: 'medium',
                title: '完善多语言支持',
                description: '部分内容缺少完整的中英文对照',
                action: '为所有样本添加完整的中英文内容'
            });
        }
        
        // 性能优化建议
        this.optimizations.push({
            type: 'performance',
            priority: 'medium',
            title: '数据加载优化',
            description: '实现数据懒加载和缓存机制',
            action: '添加数据预加载和本地缓存策略'
        });
        
        return this.optimizations;
    }

    applyOptimizations() {
        console.log('🚀 应用数据优化...');
        
        // 实现数据缓存
        this.implementDataCaching();
        
        // 优化数据结构
        this.optimizeDataStructure();
        
        console.log('✅ 数据优化完成');
    }

    implementDataCaching() {
        // 实现智能数据缓存
        const cacheKey = 'data_cache_v1';
        const cacheExpiry = 24 * 60 * 60 * 1000; // 24小时
        
        window.dataCache = {
            set(key, data) {
                const cacheData = {
                    data,
                    timestamp: Date.now(),
                    expiry: Date.now() + cacheExpiry
                };
                localStorage.setItem(`${cacheKey}_${key}`, JSON.stringify(cacheData));
            },
            
            get(key) {
                try {
                    const cached = localStorage.getItem(`${cacheKey}_${key}`);
                    if (!cached) return null;
                    
                    const cacheData = JSON.parse(cached);
                    if (Date.now() > cacheData.expiry) {
                        localStorage.removeItem(`${cacheKey}_${key}`);
                        return null;
                    }
                    
                    return cacheData.data;
                } catch (error) {
                    return null;
                }
            },
            
            clear() {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(cacheKey)) {
                        localStorage.removeItem(key);
                    }
                });
            }
        };
    }

    optimizeDataStructure() {
        // 优化数据访问模式
        if (window.LEVELS && Array.isArray(window.LEVELS)) {
            // 创建索引以提高查询性能
            window.LEVELS_INDEX = {
                byCategory: {},
                byId: {},
                byDifficulty: {}
            };
            
            window.LEVELS.forEach(level => {
                // 按类别索引
                if (!window.LEVELS_INDEX.byCategory[level.category]) {
                    window.LEVELS_INDEX.byCategory[level.category] = [];
                }
                window.LEVELS_INDEX.byCategory[level.category].push(level);
                
                // 按ID索引
                window.LEVELS_INDEX.byId[level.id] = level;
                
                // 按难度索引
                const difficulty = level.difficulty || 'normal';
                if (!window.LEVELS_INDEX.byDifficulty[difficulty]) {
                    window.LEVELS_INDEX.byDifficulty[difficulty] = [];
                }
                window.LEVELS_INDEX.byDifficulty[difficulty].push(level);
            });
        }
    }
}

// 导出类
window.DataQualityChecker = DataQualityChecker;
window.DataOptimizer = DataOptimizer;

// 自动运行检查（开发模式）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', async () => {
        // 延迟执行，确保其他模块已加载
        setTimeout(async () => {
            const checker = new DataQualityChecker();
            const results = await checker.checkAll();
            
            // 如果有关键问题，显示通知
            if (results.issues.length > 0) {
                console.warn(`⚠️ 发现 ${results.issues.length} 个数据质量问题，建议检查控制台输出`);
            }
            
            // 自动修复简单问题
            await checker.autoFix();
            
            // 应用优化
            const optimizer = new DataOptimizer();
            const optimizations = optimizer.generateOptimizations(results);
            if (optimizations.length > 0) {
                console.log(`💡 生成了 ${optimizations.length} 个优化建议`);
                optimizer.applyOptimizations();
            }
        }, 2000);
    });
}
// 真实题库系统 - 根据页面标题自动生成选择题
export class QuestionBank {
  constructor() {
    this.questionTemplates = {
      title: [
        {
          id: 'title_1',
          material: '震惊！这家公司股价暴涨300%！',
          prompt: '请选择一个更中立、客观的标题：',
          options: [
            '某公司股价上涨300%，市场反应积极',
            '震惊！投资者疯狂抢购这只股票！',
            '某公司股价大幅上涨，涨幅达300%',
            '惊人！这只股票让投资者一夜暴富！'
          ],
          correct: [0, 2],
          explanation: '新闻标题应该客观、准确，避免使用"震惊"、"暴涨"等情绪化词汇。'
        },
        {
          id: 'title_2',
          material: '全网都在用的神奇方法！',
          prompt: '请选择一个更准确的标题：',
          options: [
            '新兴学习方法受到广泛关注',
            '全网疯传的学习秘籍大公开！',
            '某学习方法在网络平台获得关注',
            '史上最强学习法，效果惊人！'
          ],
          correct: [0, 2],
          explanation: '避免使用"全网"、"神奇"等夸大性词汇，应该用具体、客观的表述。'
        },
        {
          id: 'title_3',
          material: '用AI一键写论文：太爽了！',
          prompt: '请选择一个更合适的标题：',
          options: [
            'AI辅助写作工具的使用体验分析',
            '震惊！AI竟然能代写论文！',
            'AI写作工具在学术领域的应用探讨',
            '懒人福音：AI帮你搞定所有作业！'
          ],
          correct: [0, 2],
          explanation: '学术相关内容应该严谨，避免使用"太爽了"等非正式表达。'
        },
        {
          id: 'title_4',
          material: '惊呆！这个减肥方法让她一个月瘦30斤！',
          prompt: '请选择一个更客观的标题：',
          options: [
            '某减肥方法的效果案例分析',
            '神奇！一个月狂瘦30斤的秘密！',
            '个人减肥经历分享：一个月减重30斤',
            '史上最强减肥法，效果震撼全网！'
          ],
          correct: [0, 2],
          explanation: '健康相关内容应避免夸大效果，使用客观、理性的表述。'
        },
        {
          id: 'title_5',
          material: '房价暴跌！现在是买房最佳时机！',
          prompt: '请选择一个更中立的标题：',
          options: [
            '某地区房价出现下调趋势',
            '房价崩盘！抄底机会来了！',
            '房地产市场价格波动分析',
            '千载难逢！房价跳水式下跌！'
          ],
          correct: [0, 2],
          explanation: '房地产相关新闻应客观报道，避免使用"暴跌"等情绪化词汇。'
        },
        {
          id: 'title_6',
          material: '独家爆料！明星私生活大揭秘！',
          prompt: '请选择一个更合适的标题：',
          options: [
            '某明星近期公开活动回顾',
            '震撼！明星隐私全曝光！',
            '明星公开场合表现观察',
            '劲爆！明星不为人知的秘密！'
          ],
          correct: [0, 2],
          explanation: '娱乐新闻也应尊重隐私，避免使用"爆料"、"揭秘"等煽动性词汇。'
        }
      ],
      chart: [
        {
          id: 'chart_1',
          material: '销售数据对比图（Y轴从50开始）',
          prompt: '这个图表存在什么问题？',
          options: [
            'Y轴未从0开始，可能夸大差异',
            '图表颜色搭配不够美观',
            '数据标签字体太小',
            '图表标题位置不合适'
          ],
          correct: [0],
          explanation: 'Y轴不从0开始会视觉上夸大数据间的差异，误导读者。'
        },
        {
          id: 'chart_2',
          material: '3D饼图显示市场份额',
          prompt: '3D饼图的主要问题是什么？',
          options: [
            '3D效果会造成视觉误导',
            '饼图颜色不够鲜艳',
            '图例位置不合适',
            '数据标签不够清晰'
          ],
          correct: [0],
          explanation: '3D效果会因为透视关系造成视觉误导，影响数据的准确理解。'
        },
        {
          id: 'chart_3',
          material: '某公司股价走势图显示连续上涨',
          prompt: '这个图表可能存在什么问题？',
          options: [
            '时间跨度太短，可能不具代表性',
            '没有问题，数据很清晰',
            '应该显示更多技术指标',
            '颜色搭配不够美观'
          ],
          correct: [0],
          explanation: '短期数据可能不能反映长期趋势，需要更长时间跨度的数据。'
        },
        {
          id: 'chart_4',
          material: '某地区人口增长率柱状图，Y轴从95%开始',
          prompt: '这个图表设计有什么问题？',
          options: [
            'Y轴起点不从0开始，夸大了差异',
            '柱状图颜色太单调',
            '数据标签字体太小',
            '图表标题位置不合适'
          ],
          correct: [0],
          explanation: 'Y轴不从0开始会视觉上夸大数据间的差异，误导读者。'
        },
        {
          id: 'chart_5',
          material: '某产品销量饼图，显示5个类别占比',
          prompt: '如何改进这个饼图的可读性？',
          options: [
            '添加数据标签显示具体百分比',
            '使用更鲜艳的颜色',
            '增加3D效果',
            '缩小图表尺寸'
          ],
          correct: [0],
          explanation: '饼图应该包含清晰的数据标签，帮助读者准确理解各部分占比。'
        },
        {
          id: 'chart_6',
          material: '某公司收入趋势图，数据点之间用平滑曲线连接',
          prompt: '这种表示方法可能产生什么误解？',
          options: [
            '平滑曲线可能暗示中间时点有数据',
            '曲线颜色不够突出',
            '数据点标记太小',
            '图例位置不合适'
          ],
          correct: [0],
          explanation: '平滑曲线连接离散数据点可能误导读者认为中间时点也有对应数据。'
        }
      ],
      source: [
        {
          id: 'source_1',
          material: '某地新增病例下降',
          prompt: '这个信息最可靠的来源是：',
          options: [
            '官方卫生部门通报',
            '社交媒体传言',
            '网友个人经历',
            '未署名的网络文章'
          ],
          correct: [0],
          explanation: '官方权威部门的数据是最可靠的信息来源。'
        },
        {
          id: 'source_2',
          material: '某财经博主发布的股市预测',
          prompt: '如何评估这个信息的可信度？',
          options: [
            '查看博主的专业背景和历史预测准确率',
            '根据粉丝数量判断可信度',
            '看评论区支持人数',
            '直接相信因为是财经专业'
          ],
          correct: [0],
          explanation: '应该查看信息发布者的专业资质和历史表现来判断可信度。'
        },
        {
          id: 'source_3',
          material: '某健康网站声称"专家推荐"的保健品',
          prompt: '如何验证这个信息的可信度？',
          options: [
            '查找具体专家姓名和资质认证',
            '直接相信网站声明',
            '看销量是否很高',
            '询问身边朋友意见'
          ],
          correct: [0],
          explanation: '应该核实专家的真实身份、专业资质和是否真的做过此推荐。'
        },
        {
          id: 'source_4',
          material: '某微博大V转发的"内部消息"',
          prompt: '对于这类信息应该如何处理？',
          options: [
            '寻找官方渠道确认消息真实性',
            '因为是大V所以直接相信',
            '立即转发给更多人',
            '根据粉丝数量判断可信度'
          ],
          correct: [0],
          explanation: '即使是知名账号，也需要通过官方渠道验证"内部消息"的真实性。'
        },
        {
          id: 'source_5',
          material: '某论坛用户发布的"亲身经历"',
          prompt: '如何判断个人经历分享的可信度？',
          options: [
            '查看是否有具体细节和时间地点',
            '只要写得详细就相信',
            '看点赞数量多少',
            '根据用户等级判断'
          ],
          correct: [0],
          explanation: '真实经历通常包含具体的时间、地点、人物等可验证的细节。'
        },
        {
          id: 'source_6',
          material: '某APP推送的"独家新闻"',
          prompt: '如何验证独家新闻的真实性？',
          options: [
            '查看其他权威媒体是否有相关报道',
            '因为标注"独家"所以更可信',
            '看评论区用户反应',
            '根据APP下载量判断'
          ],
          correct: [0],
          explanation: '真实的重要新闻通常会被多家权威媒体跟进报道。'
        }
      ],
      ethics: [
        {
          id: 'ethics_1',
          material: '计划使用AI生成新闻配图',
          prompt: '应该采取哪些伦理措施？',
          options: [
            '明确标识"AI生成"',
            '对生成内容进行人工审核',
            '避免生成误导性内容',
            '不需要任何标识'
          ],
          correct: [0, 1, 2],
          explanation: 'AI生成内容应该明确标识，并进行人工审核以确保准确性。'
        },
        {
          id: 'ethics_2',
          material: '某新闻报道涉及未成年人犯罪案件',
          prompt: '报道时应该注意什么？',
          options: [
            '保护未成年人隐私，不公开姓名照片',
            '为了新闻价值可以公开所有信息',
            '只要不是恶性案件就可以公开',
            '征得家长同意就可以报道'
          ],
          correct: [0],
          explanation: '法律明确规定保护未成年人隐私，媒体报道应遵守相关法规。'
        },
        {
          id: 'ethics_3',
          material: '某记者为获得独家新闻，冒充他人身份采访',
          prompt: '这种做法存在什么问题？',
          options: [
            '违反了诚实原则，可能涉及欺诈',
            '只要能获得真实信息就没问题',
            '这是调查报道的常用手段',
            '只要最终报道客观就可以'
          ],
          correct: [0],
          explanation: '新闻采访应遵循诚实原则，冒充身份违反了职业道德。'
        },
        {
          id: 'ethics_4',
          material: '某媒体收到企业赞助后，发布有利于该企业的报道',
          prompt: '这种情况可能存在什么问题？',
          options: [
            '可能存在利益冲突，影响报道客观性',
            '有赞助很正常，不影响新闻质量',
            '只要内容真实就没有问题',
            '这是媒体盈利的正当方式'
          ],
          correct: [0],
          explanation: '经济利益可能影响新闻的独立性和客观性，应该明确披露。'
        },
        {
          id: 'ethics_5',
          material: '某网站为增加点击量，故意使用误导性标题',
          prompt: '这种做法有什么问题？',
          options: [
            '误导读者，违反了诚信原则',
            '这是正常的营销策略',
            '只要内容没问题就可以',
            '网络时代需要吸引眼球'
          ],
          correct: [0],
          explanation: '标题应该准确反映内容，误导性标题违反了媒体诚信原则。'
        },
        {
          id: 'ethics_6',
          material: '某记者在灾难现场为了拍摄效果，要求受害者重复痛苦表情',
          prompt: '这种行为存在什么问题？',
          options: [
            '缺乏人道主义关怀，二次伤害受害者',
            '为了新闻效果是可以理解的',
            '只要能传达真实情况就可以',
            '这是专业摄影的正常要求'
          ],
          correct: [0],
          explanation: '新闻工作应该以人道主义为先，不应为了效果而伤害当事人。'
        }
      ],
      rumor: [
        {
          id: 'rumor_1',
          material: '网传某地发生重大事件，但官方尚未证实',
          prompt: '如何处理这类信息？',
          options: [
            '等待官方证实后再报道',
            '立即转发以免错过热点',
            '添加"网传"等提示词',
            '直接当作事实报道'
          ],
          correct: [0, 2],
          explanation: '未经证实的信息应该谨慎处理，等待官方确认或明确标注来源。'
        },
        {
          id: 'rumor_2',
          material: '网传某地发生地震，但官方尚未发布消息',
          prompt: '应该如何处理这个信息？',
          options: [
            '等待官方权威部门确认',
            '立即转发提醒大家注意',
            '根据转发量判断真假',
            '询问当地朋友确认'
          ],
          correct: [0],
          explanation: '地震等灾害信息应以官方权威部门发布为准，避免造成恐慌。'
        },
        {
          id: 'rumor_3',
          material: '朋友圈传播"某食品添加剂致癌"的文章',
          prompt: '如何验证这类健康信息？',
          options: [
            '查询权威医疗机构和科研机构的研究',
            '看转发的人多就相信',
            '根据文章写得是否专业判断',
            '询问身边医生朋友'
          ],
          correct: [0],
          explanation: '健康相关信息应以权威医疗机构的科学研究为准。'
        },
        {
          id: 'rumor_4',
          material: '网上流传"某明星去世"的消息',
          prompt: '如何确认这类消息的真实性？',
          options: [
            '查看明星官方账号或经纪公司声明',
            '看网上讨论热度判断',
            '根据消息来源的粉丝数判断',
            '等待其他明星转发确认'
          ],
          correct: [0],
          explanation: '名人相关消息应以其官方渠道或权威媒体报道为准。'
        },
        {
          id: 'rumor_5',
          material: '某群聊传播"银行系统故障，ATM可以无限取钱"',
          prompt: '对于这类信息应该如何处理？',
          options: [
            '不信不传，这明显是虚假信息',
            '赶紧去ATM试试看',
            '转发给更多人分享',
            '先小额测试一下'
          ],
          correct: [0],
          explanation: '这类明显违背常理的信息通常是谣言，不应传播。'
        },
        {
          id: 'rumor_6',
          material: '微信群传播"某疫苗有严重副作用"的消息',
          prompt: '如何正确处理这类医疗信息？',
          options: [
            '查询官方卫生部门和权威医疗机构的信息',
            '相信群里"专业人士"的说法',
            '根据转发次数判断可信度',
            '询问药店工作人员'
          ],
          correct: [0],
          explanation: '医疗健康信息应以官方卫生部门和权威医疗机构发布的信息为准。'
        }
      ]
    };
    
    this.currentQuestions = {};
  }

  // 根据关卡类型生成题目
  generateQuestion(category, level = 1) {
    const templates = this.questionTemplates[category];
    if (!templates || templates.length === 0) {
      return this.generateFallbackQuestion(category);
    }

    // 根据难度选择题目
    const questionIndex = Math.min(level - 1, templates.length - 1);
    const template = templates[questionIndex];
    
    return {
      id: template.id,
      category: category,
      title: template.material,
      prompt: template.prompt,
      material: template.material,
      options: template.options,
      correct: template.correct,
      explanation: template.explanation,
      stageId: this.getStageId(category)
    };
  }

  // 生成备用题目（当模板不足时）
  generateFallbackQuestion(category) {
    const fallbacks = {
      title: {
        material: '某公司业绩大幅提升',
        prompt: '请选择更客观的表述：',
        options: [
          '某公司第三季度业绩增长显著',
          '震惊！某公司业绩爆炸式增长！',
          '某公司业绩提升，具体数据待公布',
          '史上最强业绩！某公司创造奇迹！'
        ],
        correct: [0, 2]
      },
      chart: {
        material: '数据可视化图表',
        prompt: '图表设计应该注意什么？',
        options: [
          '确保Y轴从0开始',
          '使用鲜艳的颜色',
          '添加3D效果',
          '数据标签越多越好'
        ],
        correct: [0]
      },
      source: {
        material: '网络传播信息',
        prompt: '最可靠的信息来源是：',
        options: [
          '官方权威机构',
          '社交媒体热议',
          '网友爆料',
          '匿名消息'
        ],
        correct: [0]
      },
      ethics: {
        material: 'AI生成内容使用',
        prompt: '使用AI生成内容时应该：',
        options: [
          '明确标识AI生成',
          '进行人工审核',
          '考虑伦理影响',
          '无需特殊处理'
        ],
        correct: [0, 1, 2]
      },
      rumor: {
        material: '未经证实的网络传言',
        prompt: '应该如何处理？',
        options: [
          '等待官方证实',
          '立即广泛传播',
          '标注信息来源',
          '当作确定事实'
        ],
        correct: [0, 2]
      }
    };

    const fallback = fallbacks[category];
    return {
      id: `${category}_fallback`,
      category: category,
      title: fallback.material,
      prompt: fallback.prompt,
      material: fallback.material,
      options: fallback.options,
      correct: fallback.correct,
      explanation: '这是一个基础练习题目。',
      stageId: this.getStageId(category)
    };
  }

  // 获取对应的舞台ID
  getStageId(category) {
    const stageMap = {
      title: 'stage1',
      chart: 'stage2',
      source: 'stage3',
      ethics: 'stage4',
      rumor: 'stage5'
    };
    return stageMap[category] || 'stage1';
  }

  // 获取指定类别的所有题目
  getQuestionsByCategory(category) {
    const templates = this.questionTemplates[category];
    if (!templates || templates.length === 0) {
      return [];
    }
    
    return templates.map(template => ({
      id: template.id,
      category: category,
      title: template.material,
      prompt: template.prompt,
      material: template.material,
      options: template.options,
      correct: template.correct,
      explanation: template.explanation,
      stageId: this.getStageId(category)
    }));
  }

  // 检查答案
  checkAnswer(questionId, userAnswer) {
    const question = this.currentQuestions[questionId];
    if (!question) return { correct: false, score: 0 };

    let correct = false;
    let score = 0;

    if (Array.isArray(question.correct)) {
      // 多选题
      if (Array.isArray(userAnswer)) {
        const correctSet = new Set(question.correct);
        const userSet = new Set(userAnswer);
        const intersection = new Set([...correctSet].filter(x => userSet.has(x)));
        const union = new Set([...correctSet, ...userSet]);
        
        if (intersection.size === correctSet.size && userSet.size === correctSet.size) {
          correct = true;
          score = 100;
        } else {
          score = Math.round((intersection.size / union.size) * 100);
        }
      }
    } else {
      // 单选题
      correct = userAnswer === question.correct[0];
      score = correct ? 100 : 0;
    }

    return {
      correct,
      score,
      explanation: question.explanation,
      correctAnswer: question.correct
    };
  }

  // 保存当前题目
  setCurrentQuestion(questionId, question) {
    this.currentQuestions[questionId] = question;
  }

  // 获取题目统计
  getStats() {
    return {
      totalQuestions: Object.keys(this.currentQuestions).length,
      categories: Object.keys(this.questionTemplates).length
    };
  }
}

// 创建全局实例
window.questionBank = new QuestionBank();
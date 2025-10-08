let LANG = localStorage.getItem('lang') || 'cn';

export function setLanguage(lang) {
  LANG = lang === 'en' ? 'en' : 'cn';
  localStorage.setItem('lang', LANG);
}

export function getLanguage() { return LANG; }

function mulberry32(a){
  return function(){
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function strSeed(s){
  let h = 2166136261;
  for(let i=0;i<s.length;i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return h >>> 0;
}

async function loadSeeds(){
  try {
    const res = await fetch('../data/levels.seed.json');
    return await res.json();
  } catch (e) {
    // 离线/本地 file:// 回退：最小种子结构，交由各 Expand 自动生成
    return {
      categories: {
        title: { samples: [], min: 0 },
        chart: { samples: [], fixes: [], min: 0 },
        source: { samples: [], slots: [], min: 0 },
        ethics: { samples: [], required: [], min: 0 },
        rumor: { samples: [], why: [], min: 0 },
        synthesis: { samples: [], min: 0 },
        egg: { samples: [], min: 0 }
      }
    };
  }
}

function pick(arr, rng){ return arr[Math.floor(rng()*arr.length)]; }

function titleExpand(samples, rng, need){
  const out = [];
  samples.forEach((s) => {
    out.push({
      id: s.id,
      category: 'title',
      stageId: 'stage1',
      title: {cn: s.cn.material, en: s.en.material},
      prompt: {cn: s.cn.prompt, en: s.en.prompt},
      material: s[LANG].material,
      options: s[LANG].options,
      good: s[LANG].good
    });
  });
  const synSubjects = LANG==='cn'?['公司','高校','平台','用户','研究']:['company','university','platform','users','study'];
  const synActions = LANG==='cn'?['增长','改善','提升','下降']:['grow','improve','increase','decrease'];
  const synTime = LANG==='cn'?['上季度','本周','两周内','过去一年']:['last quarter','this week','within two weeks','past year'];
  while(out.length < need){
    const subj = pick(synSubjects, rng);
    const act = pick(synActions, rng);
    const tm = pick(synTime, rng);
    const delta = Math.round(rng()*30+5);
    const mat = LANG==='cn' ? `${subj}${tm}${act}${delta}%` : `${subj} ${tm} ${act} ${delta}%`;
    out.push({
      id: 't-auto-'+out.length,
      category: 'title',
      stageId: 'stage1',
      title: {cn: mat, en: mat},
      prompt: {cn: '用新闻/科普口吻改写并量化', en: 'Rewrite in news/science tone with quantification'},
      material: mat,
      options: LANG==='cn'?
        [`${tm}${subj}${act}${delta}%（样本n=200）`,`报告显示${subj}${act}${delta}%于${tm}`,`震惊！${subj}${act}${delta}%！`]
        :
        [`${tm} ${subj} ${act} ${delta}% (n=200)`,`Report shows ${subj} ${act} ${delta}% in ${tm}`,`Shocking! ${subj} ${act} ${delta}%!`],
      good: [0,1]
    });
  }
  return out;
}

function chartExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'chart',
    stageId: 'stage2',
    title: {cn: s.cn.prompt, en: s.en.prompt},
    prompt: {cn: s.cn.prompt, en: s.en.prompt},
    material: s[LANG].material,
    fixes: s.fixes
  }));
  const types = ['bar','line','pie','stacked'];
  while(out.length < need){
    const t = pick(types, rng);
    const yMin = Math.random()<0.5 ? Math.round(rng()*60) : 0;
    const use3d = t==='bar' && rng()<0.3;
    const dual = t==='line' && rng()<0.3;
    const cnPrompt = t==='pie' ? '修正图例与标签' : '修正比例与窗口';
    const enPrompt = t==='pie' ? 'Fix legend and labels' : 'Fix scale and window';
    const fixes = [];
    if (yMin>0) fixes.push('zero');
    if (use3d) fixes.push('no3d');
    if (dual) fixes.push('single_axis');
    fixes.push('label');
    out.push({
      id: 'c-auto-'+out.length,
      category: 'chart',
      stageId: 'stage2',
      title: {cn: cnPrompt, en: enPrompt},
      prompt: {cn: cnPrompt, en: enPrompt},
      material: `type=${t}, y_min=${yMin}`,
      fixes
    });
  }
  return out;
}

function sourceExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'source',
    stageId: 'stage3',
    title: s[LANG].prompt,
    prompt: s[LANG].prompt,
    material: s[LANG].material,
    slots: s.slots
  }));
  const slotSets = [
    ['author','title','journal','date','url'],
    ['agency','title','number','date','url'],
    ['outlet','title','author','date','url']
  ];
  while(out.length < need){
    const slots = pick(slotSets, rng);
    out.push({
      id: 's-auto-'+out.length,
      category: 'source',
      stageId: 'stage3',
      title: LANG==='cn'?'快速引用占位':'Quick citation slots',
      prompt: LANG==='cn'?'补齐作者/标题/日期等槽位':'Fill author/title/date slots',
      material: LANG==='cn'?'作者/标题/日期/链接':'Author/Title/Date/URL',
      slots
    });
  }
  return out;
}

function ethicsExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'ethics',
    stageId: 'stage4',
    title: s[LANG].prompt,
    prompt: s[LANG].prompt,
    material: s[LANG].material,
    required: s.required
  }));
  const reqPool = ['label_ai','blur_face','avoid_detail','remove_identifiers','blur_geo','warn_content'];
  while(out.length < need){
    const required = Array.from(new Set([pick(reqPool,rng), pick(reqPool,rng), pick(reqPool,rng)]));
    out.push({
      id: 'e-auto-'+out.length,
      category: 'ethics',
      stageId: 'stage4',
      title: LANG==='cn'?'伦理合规选择':'Ethics compliance picks',
      prompt: LANG==='cn'?'选择必须的合规动作':'Select required compliance actions',
      material: LANG==='cn'?'敏感场景描述':'Sensitive scenario description',
      required
    });
  }
  return out;
}

function rumorExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'rumor',
    stageId: 'stage5',
    title: s[LANG].prompt,
    prompt: s[LANG].prompt,
    material: s[LANG].material,
    why: s[LANG].why || s.why
  }));
  const segPool = LANG==='cn'
    ? ['网友称','未经证实','模糊时间','旧闻拼接','来源单一']
    : ['Netizen says','Unverified','Fuzzy time','Old news stitched','Single source'];
  while(out.length < need){
    const segs = [pick(segPool,rng), pick(segPool,rng), pick(segPool,rng)];
    out.push({
      id: 'r-auto-'+out.length,
      category: 'rumor',
      stageId: 'stage5',
      title: LANG==='cn'?'真假混排快讯':'Mixed true/false bulletin',
      prompt: LANG==='cn'?'点击高亮可疑句段':'Click to highlight suspicious segments',
      material: segs,
      why: segs
    });
  }
  return out;
}

function synthExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'synthesis',
    stageId: 'synthesis',
    title: s[LANG].prompt,
    prompt: s[LANG].prompt,
    material: s[LANG].material
  }));
  const themes = LANG==='cn' ? ['科技与教育','出版与阅读','社会与生活'] : ['Tech & Education','Publishing & Reading','Society & Life'];
  while(out.length < need){
    const th = pick(themes, rng);
    out.push({
      id: 'y-auto-'+out.length,
      category: 'synthesis',
      stageId: 'synthesis',
      title: th + (LANG==='cn'?'专题':' topic'),
      prompt: LANG==='cn'?'在限定素材下生成可信一页专题':'Generate reliable one-pager from given material',
      material: LANG==='cn'?'从素材池抽取段落，完成四项任务':'Draw from material pool; complete four tasks'
    });
  }
  return out;
}

function eggExpand(samples, rng, need){
  const out = [];
  samples.forEach(s => out.push({
    id: s.id,
    category: 'egg',
    stageId: 'egg',
    title: s[LANG].prompt,
    prompt: s[LANG].prompt,
    material: s[LANG].material
  }));
  const kinds = LANG==='cn' ? ['语言陷阱','图表三连','引用速填'] : ['Language traps','Chart triple','Citation speed'];
  while(out.length < need){
    const k = pick(kinds, rng);
    out.push({
      id: 'g-auto-'+out.length,
      category: 'egg',
      stageId: 'egg',
      title: k,
      prompt: LANG==='cn'?'限时挑战（示意）':'Timed challenge (mock)',
      material: LANG==='cn'?'在60秒内完成指定动作':'Finish required actions in 60s'
    });
  }
  return out;
}

export async function generateLevels(diff='newbie', seedStr='default'){
  // 压缩到总计 20 关：每类各取4关，保证题目不同
  const seeds = await loadSeeds();
  const rng = mulberry32(strSeed(seedStr));
  // 先扩展出足量题目，再按需截取
  const titleAll = titleExpand(seeds.categories.title.samples, rng, 10);
  const chartAll = chartExpand(seeds.categories.chart.samples, rng, 10);
  const sourceAll = sourceExpand(seeds.categories.source.samples, rng, 8);
  const ethicsAll = ethicsExpand(seeds.categories.ethics.samples, rng, 8);
  const rumorAll = rumorExpand(seeds.categories.rumor.samples, rng, 8);

  const take = (arr, n) => arr.slice(0, Math.min(n, arr.length));
  const all = [
    ...take(titleAll, 4),
    ...take(chartAll, 4),
    ...take(sourceAll, 4),
    ...take(ethicsAll, 4),
    ...take(rumorAll, 4)
  ];
  return all.map((l, i) => ({ ...l, idx: i + 1 }));
}

// ——— 关卡对象导出为规范结构（接口示例所需） ———
function mapCategoryToType(cat){
  return {
    'title':'title',
    'chart':'chart_fix',
    'source':'source',
    'ethics':'ethics',
    'rumor':'rumor',
    'synthesis':'synthesis',
    'egg':'speedrun'
  }[cat] || 'title';
}

function defaultScoringWeights(type){
  if (type==='chart_fix') return { zero: 10, no3d: 10, window: 10, deltaError: 20 };
  if (type==='title') return { replace: 10, structure: 10, info: 10, readability: 10 };
  if (type==='source') return { completeness: 20, accuracy: 20 };
  if (type==='ethics') return { required: 30, style: 10 };
  if (type==='rumor') return { identify: 20, path: 20 };
  if (type==='synthesis') return { title: 10, chart: 10, source: 10, ethics: 10 };
  if (type==='speedrun') return { time: 20, accuracy: 20 };
  return { info: 10 };
}

function deriveHintsCN(level){
  const fixes = level.fixes || [];
  const hints = [];
  if (fixes.includes('zero') || String(level.material||'').includes('y_min')) hints.push('注意Y轴最小值');
  if (fixes.includes('no3d')) hints.push('3D会夸大视觉差异');
  if (fixes.includes('single_axis')) hints.push('统一量纲避免双轴误导');
  if (fixes.includes('label')) hints.push('标签与图例需一致');
  if (fixes.includes('extend')) hints.push('扩展区间提供上下文');
  return hints.slice(0,3);
}

function deriveHintsEN(level){
  const fixes = level.fixes || [];
  const hints = [];
  if (fixes.includes('zero') || String(level.material||'').includes('y_min')) hints.push('Mind the Y-axis minimum');
  if (fixes.includes('no3d')) hints.push('3D exaggerates differences');
  if (fixes.includes('single_axis')) hints.push('Unify scale to avoid dual-axis traps');
  if (fixes.includes('label')) hints.push('Match labels and legend');
  if (fixes.includes('extend')) hints.push('Expand window for context');
  return hints.slice(0,3);
}

function mapGoals(level){
  const fixes = level.fixes || [];
  const goals = [];
  fixes.forEach(f => {
    if (f==='zero') goals.push('restore_zero');
    else if (f==='no3d') goals.push('disable_3d');
    else if (f==='extend') goals.push('expand_window');
    else if (f==='single_axis') goals.push('unify_scale');
    else if (f==='label') goals.push('fix_labels');
  });
  return Array.from(new Set(goals));
}

// 将内部关卡对象映射为规范示例结构
export function toLevelSpec(internalLevel, difficulty='intermediate'){
  const type = mapCategoryToType(internalLevel.category);
  const cnTitle = typeof internalLevel.title === 'object' ? internalLevel.title.cn : internalLevel.title;
  const enTitle = typeof internalLevel.title === 'object' ? internalLevel.title.en : internalLevel.title;
  const cnInstr = typeof internalLevel.prompt === 'object' ? internalLevel.prompt.cn : internalLevel.prompt;
  const enInstr = typeof internalLevel.prompt === 'object' ? internalLevel.prompt.en : internalLevel.prompt;
  const spec = {
    id: internalLevel.id || `L-${internalLevel.category}-${internalLevel.idx || 0}`,
    type,
    difficulty,
    locale: ['cn','en'],
    cn: {
      title: cnTitle || '未命名关卡',
      instruction: cnInstr || '请按照提示完成目标',
      hints: type==='chart_fix' ? deriveHintsCN(internalLevel) : []
    },
    en: {
      title: enTitle || 'Untitled level',
      instruction: enInstr || 'Follow the instruction to meet goals',
      hints: type==='chart_fix' ? deriveHintsEN(internalLevel) : []
    },
    assets: {
      img: '',
      palette: (type==='chart_fix' && (internalLevel.fixes||[]).includes('label')) ? 'misleading' : ''
    },
    goals: type==='chart_fix' ? mapGoals(internalLevel) : [],
    scoringWeights: defaultScoringWeights(type)
  };
  return spec;
}
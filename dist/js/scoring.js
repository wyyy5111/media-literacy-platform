// 评分公式实现（四维雷达与加权综合）
// 权重：中立度25%、图表35%、事实链20%、伦理20%
export const WEIGHTS = {
  neutrality: 0.25,
  chartFix: 0.35,
  facts: 0.20,
  ethics: 0.20,
};

const LEX = {
  exaggeration: ["震惊","爆炸性","神奇","史上最强","一夜暴富","惊天","绝无仅有","全民"],
  timeWords: ["上季度","本周","两周内","过去一年","今年","昨日","周一","202","20","月","年"],
  subjectsCN: ["公司","高校","平台","用户","研究","部门","机构"],
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const clamp100 = (v) => Math.max(0, Math.min(100, v));

function includesAny(str, arr){
  const s = String(str || '');
  return arr.some(w => s.includes(w));
}
function countIncludes(str, arr){
  const s = String(str || '');
  return arr.reduce((a,w)=> a + (s.includes(w)?1:0), 0);
}
function hasQuant(str){
  const s = String(str || '');
  return /(\d+\s*[%％]?|n\s*=\s*\d+)/i.test(s);
}

// L1 标题：5*命中替换词数 + 10*主体完整 + 5*含定量 + 5*含时间 - 5*残留夸大词数（上限100）
export function scoreTitle({ pickedTitle, originalTitle }){
  const origEx = countIncludes(originalTitle, LEX.exaggeration);
  const pickEx = countIncludes(pickedTitle, LEX.exaggeration);
  const replaced = Math.max(0, origEx - pickEx); // 命中替换词数
  const subjectComplete = includesAny(pickedTitle, LEX.subjectsCN) ? 1 : 0;
  const quant = hasQuant(pickedTitle) ? 1 : 0;
  const hasTime = includesAny(pickedTitle, LEX.timeWords) ? 1 : 0;
  const residualEx = pickEx;
  const raw = 5*replaced + 10*subjectComplete + 5*quant + 5*hasTime - 5*residualEx;
  const score = clamp100(Math.round(raw));
  const explain = [
    `替换夸张词：${replaced}×5`,
    `主体完整：${subjectComplete ? '+10' : '+0'}`,
    `含定量：${quant ? '+5' : '+0'}`,
    `含时间：${hasTime ? '+5' : '+0'}`,
    `残留夸张词：-${residualEx*5}`,
  ];
  return { score, explain };
}

// L2 图表：10*复位零点 + 10*去3D + 10*统一量纲/纠正双轴 + 10*扩展区间 + f(误差下降%)
export function scoreChart({ fixes, errDropPct }){
  const pts = (fixes.zero?10:0) + (fixes.no3d?10:0) + (fixes.single_axis?10:0) + (fixes.extend?10:0);
  const f = Math.round(Math.min(60, Math.max(0, Number(errDropPct)||0))); // 上限60
  const score = clamp100(pts + f);
  const explain = [
    `复位零点：${fixes.zero?'+10':'+0'}`,
    `去3D：${fixes.no3d?'+10':'+0'}`,
    `统一量纲/单轴：${fixes.single_axis?'+10':'+0'}`,
    `扩展区间：${fixes.extend?'+10':'+0'}`,
    `误差下降：+${f}`,
  ];
  return { score, explain };
}

// L3 事实链：每项占位（作者/机构、标题、日期、链接/页码）+5；缺失-5；格式错误-5
export function scoreSource({ slots }){
  const fields = ['author','agency','title','date','url','page'];
  let total = 0;
  const explain = [];
  fields.forEach(k => {
    const v = slots[k];
    if (v == null) { return; }
    const val = String(v).trim();
    if (!val) { total -= 5; explain.push(`${k}: 缺失 -5`); return; }
    let ok = true;
    if (k === 'date') ok = /(\d{4}[-/年]\d{1,2}([-/月]\d{1,2})?)/.test(val) || /今天|昨日|本周|上周/.test(val);
    if (k === 'url') ok = /^https?:\/\//i.test(val) || /^doi:/i.test(val);
    if (k === 'page') ok = /\d+/.test(val);
    if (ok) { total += 5; explain.push(`${k}: 格式正确 +5`); }
    else { total -= 5; explain.push(`${k}: 格式错误 -5`); }
  });
  const score = clamp100(Math.round(total));
  return { score, explain };
}

// L4 伦理：每个“必选项”+10；“必须禁用”被选择-10
export function scoreEthics({ requiredPicked = [], bannedPicked = [] }){
  const score = clamp100(10*requiredPicked.length - 10*bannedPicked.length);
  const explain = [
    `必选项命中：${requiredPicked.length}×10 = +${requiredPicked.length*10}`,
    `禁用项被选：${bannedPicked.length}×(-10) = -${bannedPicked.length*10}`,
  ];
  return { score, explain };
}

// 计算四维雷达与加权综合
export function computeRadar(scores){
  const dims = {
    neutrality: clamp100(scores.stage1 || 0),
    chartFix: clamp100(scores.stage2 || 0),
    facts: clamp100(scores.stage3 || 0),
    ethics: clamp100(scores.stage4 || 0),
  };
  const overall = Math.round(
    dims.neutrality*WEIGHTS.neutrality +
    dims.chartFix*WEIGHTS.chartFix +
    dims.facts*WEIGHTS.facts +
    dims.ethics*WEIGHTS.ethics
  );
  return { dims, overall };
}
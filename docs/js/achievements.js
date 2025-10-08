// 成就与激励系统：跟踪连续/累计达成并输出徽章
export const Achievements = {
  state: {
    titlePerfectStreak: 0,
    chartNo3DStreak: 0,
    sourceFullCount: 0,
    ethicsZeroMis: false,
    eggHighScore: false,
    badges: []
  },
  load() {
    try {
      const raw = localStorage.getItem('achievements');
      if (raw) this.state = Object.assign(this.state, JSON.parse(raw));
    } catch {}
  },
  save() {
    try { localStorage.setItem('achievements', JSON.stringify(this.state)); } catch {}
  },
  award(name) {
    if (!this.state.badges.includes(name)) {
      this.state.badges.push(name);
      this.save();
    }
  },
  recordTitle(score) {
    if (score >= 100) {
      this.state.titlePerfectStreak += 1;
      if (this.state.titlePerfectStreak >= 3) this.award('零噱头记者');
    } else {
      this.state.titlePerfectStreak = 0;
    }
    this.save();
  },
  recordChart(fixes, score) {
    if (fixes?.no3d && score > 90) {
      this.state.chartNo3DStreak += 1;
      if (this.state.chartNo3DStreak >= 3) this.award('3D终结者');
    } else {
      this.state.chartNo3DStreak = 0;
    }
    this.save();
  },
  recordSource(score) {
    // 满配：所有关键槽位填写且格式正确，简化阈值为 >= 30 分
    if (score >= 30) {
      this.state.sourceFullCount += 1;
      if (this.state.sourceFullCount >= 3) this.award('引用达人');
    }
    this.save();
  },
  recordEthics(requiredPicked = [], bannedPicked = []) {
    if ((bannedPicked || []).length === 0) {
      this.state.ethicsZeroMis = true;
      this.award('伦理守门员');
    }
    this.save();
  },
  recordEgg(score) {
    if (score > 90) {
      this.state.eggHighScore = true;
      this.award('极速修正');
    }
    this.save();
  },
  getBadges() {
    return Array.from(new Set(this.state.badges));
  }
};
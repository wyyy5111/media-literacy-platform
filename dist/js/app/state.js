export const state = {
  levels: [],
  currentLevel: null,
  flow: null,
  scores: JSON.parse(localStorage.getItem('scores') || '{}'),
  diff: localStorage.getItem('difficulty') || 'newbie',
  lang: localStorage.getItem('lang') || 'cn',
  theme: localStorage.getItem('theme') || 'dark',
  contrast: localStorage.getItem('contrast') === '1' ? 1 : 0,
};

export function saveState() {
  localStorage.setItem('scores', JSON.stringify(state.scores));
  localStorage.setItem('difficulty', state.diff);
  localStorage.setItem('lang', state.lang);
  localStorage.setItem('theme', state.theme);
  localStorage.setItem('contrast', String(state.contrast));
}

export function resetState() {
  state.scores = {};
  state.diff = 'newbie';
  saveState();
}
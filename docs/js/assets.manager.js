// Open assets fetcher with attribution logging and safe fallback
import { renderPlaceholderSVG } from './placeholder.svg.js';

const LICENSE_WHITELIST = ['CC0', 'CC BY', 'Public Domain'];

export function isLicenseAllowed(license) {
  return LICENSE_WHITELIST.includes(String(license).trim());
}

export function recordAttribution(entry) {
  const safe = {
    title: entry.title || '未命名素材',
    author: entry.author || '未知',
    source: entry.source || '未知来源',
    license: entry.license || '未知许可',
    url: entry.url || '#',
    date: entry.date || new Date().toISOString().slice(0, 10),
  };
  const line = `- [${safe.title}](${safe.url}) — ${safe.author}，${safe.license}（${safe.source}），${safe.date}`;

  // UI log (optional)
  const logEl = document.getElementById('attributionLog');
  if (logEl) {
    const div = document.createElement('div');
    div.textContent = line;
    logEl.appendChild(div);
  }

  // Local persistence (for export)
  try {
    const store = JSON.parse(localStorage.getItem('attrib_log') || '[]');
    store.push({ ...safe, line });
    localStorage.setItem('attrib_log', JSON.stringify(store));
  } catch (_) {}

  console.info('[ATTRIBUTION.md append]', line);
  return line;
}

// NOTE: In browser-only environment we do not auto-download.
// This function validates license if provided; otherwise falls back to self-generated placeholder.
export async function fetchOpenAsset(query, options = {}) {
  const targetEl = options.targetEl || document.getElementById('assetPlaceholder');
  const licenses = options.licenses || LICENSE_WHITELIST;

  // Placeholder-first policy when unsure
  const title = `自制占位示例图: ${query || '示例'}`;
  renderPlaceholderSVG(targetEl, { label: '示例图', width: 360, height: 200 });
  recordAttribution({
    title,
    author: '项目自制',
    source: 'Self-generated',
    license: 'CC0',
    url: 'assets/placeholder.svg',
    date: new Date().toISOString().slice(0, 10),
  });
  return { ok: true, mode: 'placeholder', license: 'CC0', licenses };
}

export function initAssetDemo() {
  const btn = document.getElementById('genPlaceholderBtn');
  const targetEl = document.getElementById('assetPlaceholder');
  if (!btn || !targetEl) return;
  btn.addEventListener('click', () => {
    fetchOpenAsset('占位图示例', { targetEl });
  });
}

// Auto-init if demo elements exist
document.addEventListener('DOMContentLoaded', initAssetDemo);
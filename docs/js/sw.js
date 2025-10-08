// PWA Service Worker：缓存关键资源以支持离线
const CACHE = 'truth-edit-cache-v2';
const ASSETS = [
  '/dist/index.html',
  '/dist/css/main.css',
  '/dist/assets/icon.svg',
  // 核心 JS
  '/dist/js/app.js',
  '/dist/js/a11y.js',
  '/dist/js/store.local.js',
  '/dist/js/scoring.js',
  '/dist/js/levels.engine.js',
  '/dist/js/report.maker.js',
  '/dist/js/ledger.hash.js',
  '/dist/js/assets.manager.js',
  '/dist/js/i18n.js',
  '/dist/js/chart.sandbox.js',
  '/dist/js/chart.sandbox.svg.js',
  '/dist/js/sources.citation.js',
  '/dist/js/ethics.engine.js',
  '/dist/js/rumor.verify.js',
  '/dist/js/placeholder.svg.js',
  // 数据
  '/data/lexicons.json',
  '/data/levels.seed.json',
  '/data/articles.seed.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return resp;
    }).catch(() => caches.match('/dist/index.html')))
  );
});
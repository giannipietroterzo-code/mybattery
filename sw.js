// Service worker: app offline, aggiornamento in background (stale-while-revalidate)
// Cambiando VERSION (insieme ad APP_VERSION in index.html) i telefoni scaricano tutto di nuovo.
// Funziona solo in HTTPS (GitHub Pages): servita dalla scheda in HTTP la pagina non lo registra.
const VERSION = '1.1';
const CACHE = 'mybattery-v' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' = scarica dalla rete, non dalla cache HTTP del browser
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // Solo GET della nostra origine; i dati delle batterie vanno sempre in rete
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) return;

  const isNav = req.mode === 'navigate';
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(isNav ? './index.html' : req, { ignoreSearch: isNav });
      // revalida sempre col server (ETag), così l'aggiornamento non aspetta la scadenza della cache HTTP
      const fresh = fetch(isNav ? './index.html' : req.url, { cache: 'no-cache' })
        .then((res) => {
          if (res.ok) cache.put(isNav ? './index.html' : req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});

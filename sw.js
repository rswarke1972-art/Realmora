const CACHE_NAME = 'realmora-v1-cache';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './events.js',
  './diplomacy.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './firebase.js',
  './auth.js',
  './classes.js',
  './world.js',
  './regions.js',
  './worldEvents.js',
  './politics.js',
  './voting.js',
  './war.js',
  './alliances.js',
  './achievements.js',
  './leaderboard.js',
  './espionage.js'
];

// Install Event - resiliently cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static game assets');
      return Promise.allSettled(
        ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[Service Worker] Could not cache asset:', asset, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - network-first falling back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache new successful requests if they are local
        if (networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        console.log('[Service Worker] Fetch failed, serving cached resource:', event.request.url);
        return caches.match(event.request);
      })
  );
});

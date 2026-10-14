
const CACHE_NAME = "reptile-app-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./behavior.html",
  "./cage.html",
  "./detail.html",
  "./finish.html",
  "./history.html",
  "./temp.html",
  "./toilet.html",
  "./water.html",
  "./style.css",
  "./agent.png"
];

// アプリに必要なファイルを保存
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ネットがなくても保存済みのページを表示
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

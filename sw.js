// 서비스워커 — 앱 셸 캐시(네트워크 우선, 오프라인 시 캐시 폴백)
const CACHE = "jusoeng-v1";
const SHELL = [
  "/", "/index.html", "/style.css", "/app.js",
  "/i18n.js", "/convert.js", "/config.js", "/theme.js", "/favicon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  // 같은 출처 GET만 처리. juso API(JSONP, 타 출처)는 가로채지 않음.
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/")))
  );
});

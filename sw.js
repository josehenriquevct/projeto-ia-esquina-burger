/* Service Worker — Estudo PMGO (PWA offline)
   Cacheia os arquivos do app para funcionar sem internet.
   Ao alterar arquivos, suba a versão do CACHE para forçar atualização. */
const CACHE = "pmgo-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/questions.js",
  "./js/resumos.js",
  "./js/aulas.js",
  "./js/srs.js",
  "./js/storage.js",
  "./js/gamify.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/pm-192.png",
  "./icons/pm-512.png",
  "./icons/pm-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // HTML / navegação: REDE PRIMEIRO (sempre pega a versão mais nova quando online),
  // cache só como reserva offline. Evita ficar preso numa versão antiga.
  if (req.mode === "navigate" || (req.destination === "document")) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((h) => h || caches.match("./index.html")))
    );
    return;
  }

  // demais recursos: cache primeiro (rápido/offline)
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});

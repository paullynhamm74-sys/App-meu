// Meu Prato da Semana: funciona offline depois da primeira abertura
var CACHE = "meu-prato-v5";
var FILES = ["./", "./index.html", "./calorias.html", "./manifest.webmanifest", "./ai.js", "./vendor/anthropic-sdk.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png",
  "./lembretes.ics", "./lembretes-refeicoes.ics", "./lembretes-agua.ics"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  var isPage = e.request.mode === "navigate";
  if (url.origin === location.origin && isPage) {
    // páginas: tenta a versão nova, se estiver sem internet usa a salva
    e.respondWith(fetch(e.request).then(function (r) {
      var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
    }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match("./index.html"); }); }));
    return;
  }
  // demais arquivos e fontes: usa o salvo, atualiza em segundo plano
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) {
      if (r && (r.ok || r.type === "opaque")) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});

// tocar no aviso abre o app
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ("focus" in list[i]) return list[i].focus(); }
    return self.clients.openWindow("./index.html");
  }));
});

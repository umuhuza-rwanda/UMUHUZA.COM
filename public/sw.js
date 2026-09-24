const CACHE_NAME = "umuhuza-v1";

self.addEventListener("install", (event) => {
  console.log("UMUHUZA service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("UMUHUZA service worker activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
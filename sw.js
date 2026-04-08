const CACHE_NAME = 'adn-keeper-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) return cachedResponse;
            return new Response("App Offline. Conéctate a Internet para sincronizar con Firebase.", {
                status: 503,
                statusText: "Service Unavailable"
            });
        })
    );
});
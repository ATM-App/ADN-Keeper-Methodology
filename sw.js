const CACHE_NAME = 'adn-keeper-v4-aislado';

self.addEventListener('install', (event) => {
    // Obligamos al Service Worker a instalarse inmediatamente
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Destruimos cualquier caché antigua que tenga la tablet bloqueada
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Siempre intentamos ir a la red primero para el tiempo real
    event.respondWith(
        fetch(event.request).catch(async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) return cachedResponse;
            return new Response("App Offline. Revisa tu conexión.", {
                status: 503,
                statusText: "Service Unavailable"
            });
        })
    );
});
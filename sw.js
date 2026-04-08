const CACHE_NAME = 'adn-keeper-v1';

// Omitimos cacheo estricto para que Firebase trabaje siempre en tiempo real
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(async () => {
            // Si la red falla, buscamos en caché
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            // Si no hay red ni caché, devolvemos una respuesta segura para evitar el TypeError
            return new Response("App Offline. Conéctate a Internet para sincronizar con Firebase.", {
                status: 503,
                statusText: "Service Unavailable"
            });
        })
    );
});
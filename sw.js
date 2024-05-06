// sw.js

const CACHE_NAME = 'mi-pagina-cache-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/imagen.png',
  // Agrega aquí los recursos que deseas cachear
];

self.addEventListener('install', function(event) {
  // Realiza la instalación del Service Worker y almacena en caché los recursos necesarios
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Intercepta las solicitudes de red y sirve los recursos almacenados en caché si están disponibles
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clona la solicitud ya que event.request es un Stream que solo se puede consumir una vez
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Verifica si recibimos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la respuesta ya que response es un Stream que solo se puede consumir una vez
            let responseToCache = response.clone();

            // Almacena la respuesta en caché para futuras solicitudes
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

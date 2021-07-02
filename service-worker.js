// Nombre del Cache
const cacheName = 'cache-version-1';

// Archivos/Recursos que vamos a "cachear"
//'./css/estilo.css',
const precache = [
  './js/register-sw.js',
  './js/music-port.js',
  './js/bootstrap.min.js.map',
  './js/bootstrap.bundle.min',
  './js/bootstrap.bundle.min.js.map',
  './js/jquery.slim.min.js',
  './index.html',
  './favicon.ico',
  './music.html',
  './css/estilo.css',
  './css/bootstrap.min.css.map',
  './css/bootstrap.min.css',
  './offline.html',
  './res/fonts/SuisseIntl-Regular.svg',
  './res/fonts/SuisseIntl-Regular.woff',
  './res/fonts/SuisseIntl-Regular.woff2',
  './res/fonts/SuisseIntl-Regular.ttf',
  './res/fonts/SuisseIntl-Regular.eot',
  './res/fonts/SuisseIntl-Bold.svg',
  './res/fonts/SuisseIntl-Bold.woff',
  './res/fonts/SuisseIntl-Bold.woff2',
  './res/fonts/SuisseIntl-Bold.ttf',
  './res/fonts/SuisseIntl-Bold.eot',
  './res/img/bg-home-big.jpg',
  './res/img/bg-home-xl.jpg',
  './res/img/bg-home-tabl.jpg',
  './res/img/bg-home-xs.jpg',
  './res/img/bg-home-sm.jpg'
];
// Instalación
self.addEventListener('install', event => {

  // Hago a este SW el activo, matando otros
  // Sino quedan caches inactivos 
  self.skipWaiting();

  event.waitUntil(
      // Abro el cache, entonces agrego los archivos/recursos
      caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
      })
  );
});
// Update - Es decir, si cambia una parte del SW (nombre), updatea el cache 
self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];

  // Esto es lo que updatea cada una de las keys en el mapa del caché
  event.waitUntil(
      // Tomo las keys y las paso para revisar individualmente
      caches.keys().then(cacheNames => {
        // devuelvo Promesa
        return Promise.all(
            // Hago un map, para borrar key individualmente.
            // Recuerden que era el update, asi que precisa un delete.
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
        )
      })
  );
});
// Chequeamos la response
function shouldAcceptResponse(response) {
    return response.status !== 0 && !(response.status >= 400 && response.status < 500) || 
        response.type === 'opaque' || 
        response.type === 'opaqueredirect';
}


// Creamos el cache a partir de fetch de recursos
self.addEventListener('fetch', event => {
  // Chequeamos si existe en cache para el render de pagina
  // sino vamos a hacer cache del nuevo request
  event.respondWith(
      caches.open(cacheName).then(cache => { // Abrimos el cache actual
        return cache.match(event.request).then(response => {
          
          // Matcheo! - return response, se lo pasamos al promise abajo
          if (response) {
            return response;
          }

        // Tomamos el response cache de arriba
        return fetch(event.request).then(
          function(response) {
            // Chequeamos si recibimos una respuesta valida
            if(shouldAcceptResponse(response)) {
              return response;
            }

            // Hay que clonar la respuesta
            // La respuesta es un stream, y como queremos que el browser
            // consuma la respuesta como si el cache consumiera la respuesta,
            // necesitamos clonarla para asi tener dos streams: (https://streams.spec.whatwg.org/)
            var responseToCache = response.clone();

            // Aca lo que hace es guardar los recursos que vinieron del server
            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        )
        }).catch(error => {
          console.log('Fallo SW', error); // importantisimo para saber si tenemos un error en algun lado.
          // si el cache falla, mostramos offline page
          return caches.match('offline.html');
        });
      })
  );
});
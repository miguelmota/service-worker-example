'use strict';

const VERSION = 'v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/index.css',
        '/scripts/index.js',
        '/images/js.png',
        '/images/not-found.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).catch(function() {
      return fetch(event.request);
    }).then(function(response) {
      if (response && response.ok) {
        caches.open(VERSION).then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      }
      return Promise.reject(response);
    }).catch(function() {
      if (/(\.png|\.jpg)$/.test(event.request.url)) {
        return caches.match('/images/not-found.png');
      }

      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== VERSION) {
          return caches.delete(key);
        }
      }));
    }).then(function() {
      clients.claim().then(function() {
        return self.clients.matchAll().then(function(clients) {
          return Promise.all(clients.map(function(client) {
            return client.postMessage('Service worker activated.');
          }));
        });
      })
    })
  )
});

function sendMessage(message) {
  self.clients.matchAll().then(function(clients) {
    clients.map(function(client) {
      return client.postMessage(message);
    })
  });
}

self.addEventListener('message', function(event) {
  console.log(`Received message from main thread: ${event.data}`);
  event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});

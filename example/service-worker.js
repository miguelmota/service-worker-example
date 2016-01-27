'use strict';

const VERSION = 'v2';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.css',
        '/index.js',
        '/images/js.png',
        '/images/not-found.png'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).catch(function() {
      return fetch(event.request);
    }).then(function(response) {
      if (response.ok) {
        caches.open(VERSION).then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      }
      return Promise.reject();
    }).catch(function(response) {
    console.log(response);
      return caches.match('/images/not-found.png');
    })
  );
});

this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== VERSION) {
          return caches.delete(keyList[i]);
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

'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log(`Received message from service worker: ${event.data}`);
  });

  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
  })
  .then(function(serviceWorkerRegistration) {
    console.log(`Service worker registered with scope ${serviceWorkerRegistration.scope}`);

    setTimeout(function() {
      loadImages();
    }, 1000);
  }).catch(function(error) {
    console.log(`Service worker registration: error ${error}`);
  });
}

function sendMessage(message) {
  return new Promise(function(resolve, reject) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      resolve(`Received direct message from service worker: ${event.data}`);
    };

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
  });
}

function loadImages() {
  const images = [].slice.call(document.querySelectorAll('[data-src]'));
  images.forEach(function(image) {
    image.src = image.dataset.src;
  });
}

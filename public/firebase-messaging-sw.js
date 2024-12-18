importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
    apiKey: "AIzaSyCVcEMUFKbGTW_esDd1ZS1NrzgflRkx6_s",
    authDomain: "ggmartss.firebaseapp.com",
    projectId: "ggmartss",
    storageBucket: "ggmartss.firebasestorage.app",
    messagingSenderId: "564381852808",
    appId: "1:564381852808:web:978643bc51364e8b666b3d",
    measurementId: "G-7KQ1267NZV"
  };


firebase?.initializeApp(firebaseConfig)


// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
    const payload = event.data.json();
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyADfC4SU5xHh3qKCiXf-7QixTvsW2WOaKw",
  authDomain: "gg-marts.firebaseapp.com",
  projectId: "gg-marts",
  storageBucket: "gg-marts.firebasestorage.app",
  messagingSenderId: "554736834741",
  appId: "1:554736834741:web:e3dc943e0cbf86f822c6fc",
  measurementId: "G-2XS8MEHVN2"
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
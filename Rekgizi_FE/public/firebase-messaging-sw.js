importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: new URL(location.href).searchParams.get('apiKey'),
  authDomain: new URL(location.href).searchParams.get('authDomain'),
  projectId: new URL(location.href).searchParams.get('projectId'),
  storageBucket: new URL(location.href).searchParams.get('storageBucket'),
  messagingSenderId: new URL(location.href).searchParams.get('messagingSenderId'),
  appId: new URL(location.href).searchParams.get('appId'),
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification?.title || 'Notifikasi baru', {
    body: payload.notification?.body,
    data: payload.data,
  })
})

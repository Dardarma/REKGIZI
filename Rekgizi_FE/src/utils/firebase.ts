import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)

function getFirebaseApp() {
  if (!isFirebaseConfigured) return null

  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export async function requestFcmToken() {
  const app = getFirebaseApp()
  if (!app) return null

  const supported = await isSupported()
  if (!supported || !('Notification' in window)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  })
  const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params}`)
  const messaging = getMessaging(app)

  return getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  })
}

export async function listenForegroundNotifications() {
  const app = getFirebaseApp()
  if (!app) return

  const supported = await isSupported()
  if (!supported) return

  const messaging = getMessaging(app)
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || 'Notifikasi baru'
    const body = payload.notification?.body
    const notificationEvent = new CustomEvent('fcm-notification', {
      detail: {
        title,
        body,
        data: payload.data || {},
        receivedAt: new Date().toISOString(),
      },
    })

    window.dispatchEvent(notificationEvent)

    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  })
}

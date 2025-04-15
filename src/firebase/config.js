// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeybGQq7TmI6HCwpUZ4dhT8OWBYQFY2tg",
  authDomain: "green-9d6cd.firebaseapp.com",
  projectId: "green-9d6cd",
  storageBucket: "green-9d6cd.firebasestorage.app",
  messagingSenderId: "814189351123",
  appId: "1:814189351123:web:4aa85e623f50075b8d4426",
  measurementId: "G-3KJVH6T7Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
// Using isSupported to check if the browser supports FCM
let messaging = null;
isSupported().then(isSupported => {
  if (isSupported) {
    messaging = getMessaging(app);
  }
}).catch(err => {
  console.error('Firebase messaging not supported', err);
});

export { app, auth, db, messaging, analytics };

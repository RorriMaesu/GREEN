import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { messaging, db } from '../firebase/config';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const { currentUser } = useAuth();

  // Check if browser supports notifications
  const notificationsSupported = 'Notification' in window && messaging !== null;

  // Request permission and get FCM token
  async function requestPermission() {
    if (!notificationsSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        try {
          // Get FCM token
          const token = await getToken(messaging, {
            vapidKey: 'BLBe_UOiEtVRXG-YYKkiVWrO3mQVPRnfxJCQhx9-u_uGvTj_Gm4K1Zo7nYYdV9i2NPZ-MKU-rA0U4Zk9vJYEXXX'
          });

          setFcmToken(token);

          // Save token to user document if logged in
          if (currentUser) {
            try {
              await updateDoc(doc(db, 'users', currentUser.uid), {
                notificationToken: token
              });
            } catch (dbError) {
              console.log('Could not save notification token to user profile:', dbError);
              // Continue anyway - this is not critical
            }
          }

          return true;
        } catch (fcmError) {
          console.log('FCM token retrieval failed, but notifications are still permitted:', fcmError);
          // We still have notification permission, just not FCM
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Set up foreground message handler
  useEffect(() => {
    if (!notificationsSupported || !messaging) return;

    try {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          data: payload.data
        });
      });

      return unsubscribe;
    } catch (error) {
      console.log('Error setting up message handler:', error);
      // Return a no-op function as cleanup
      return () => {};
    }
  }, [notificationsSupported]);

  // Request permission when user logs in
  useEffect(() => {
    if (currentUser && notificationsSupported && notificationPermission === 'default') {
      requestPermission();
    }
  }, [currentUser, notificationsSupported, notificationPermission]);

  const value = {
    notificationsSupported,
    notificationPermission,
    fcmToken,
    notification,
    requestPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

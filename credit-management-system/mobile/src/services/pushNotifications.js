// mobile/src/services/pushNotifications.js
// Expo Push Notification service

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request push notification permissions and get the Expo push token.
 * @returns {Promise<string|null>} Expo push token or null if not granted
 */
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission denied');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
    });
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id', // Replace with your Expo project ID
  });

  return token.data;
};

/**
 * Schedule a local notification (for offline reminder testing)
 * @param {object} opts
 */
export const scheduleLocalNotification = async ({ title, body, seconds = 5 }) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { seconds },
  });
};

/**
 * Add a listener for received notifications
 */
export const addNotificationReceivedListener = (callback) =>
  Notifications.addNotificationReceivedListener(callback);

/**
 * Add a listener for notification taps (user interaction)
 */
export const addNotificationResponseListener = (callback) =>
  Notifications.addNotificationResponseReceivedListener(callback);

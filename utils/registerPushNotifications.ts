import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Define foreground presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  // 1. Android Specific Channel Setup (Mandatory for Android 8.0+)
  // Declaring this dynamically in code handles channel execution inside Expo Go
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Updates',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3c1053', // QuickKart Purple
    });
  }

  // 2. Request System Permissions
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification permissions!');
      return null;
    }
    
    // 3. Extract Project ID from App Config
    const projectId = 
      Constants.expoConfig?.extra?.eas?.projectId ?? 
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.error("EAS Project ID not found in configuration.");
      return null;
    }
    
    // 4. Fetch the token payload
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Your Generated Expo Push Token:', token);
  } else {
    console.log('Must use a physical device to receive native push tokens');
  }

  return token;
}
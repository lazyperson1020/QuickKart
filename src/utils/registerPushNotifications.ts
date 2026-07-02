import { getFcmToken, setupNotificationChannels } from '../services/notificationService';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  await setupNotificationChannels();
  return getFcmToken();
}

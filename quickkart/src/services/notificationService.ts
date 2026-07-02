import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.native';
import { strings, Language } from '../localization/strings';
import { LANGUAGE_STORAGE_KEY } from '../localization/LanguageContext';

async function getNotificationStrings() {
  const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  const language: Language = saved && saved in strings ? (saved as Language) : 'en';
  return strings[language].notifications;
}

export const CHANNEL_ORDERS = 'orders';
export const CHANNEL_STOCK = 'stock';

export async function setupNotificationChannels() {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNEL_ORDERS,
    name: 'Order Updates',
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
  await notifee.createChannel({
    id: CHANNEL_STOCK,
    name: 'Stock Alerts',
    importance: AndroidImportance.HIGH,
    vibration: true,
  });
}

export async function requestPermissionAndGetToken(): Promise<string | null> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!enabled) return null;
  return messaging().getToken();
}

export async function saveFcmToken(userId: string) {
  try {
    const token = await requestPermissionAndGetToken();
    if (!token) return;
    await setDoc(doc(db, 'users', userId), { fcmToken: token }, { merge: true });

    messaging().onTokenRefresh(async (newToken) => {
      await setDoc(doc(db, 'users', userId), { fcmToken: newToken }, { merge: true });
    });
  } catch (e) {
    console.warn('Failed to save FCM token:', e);
  }
}

export async function getFcmToken(): Promise<string | null> {
  return requestPermissionAndGetToken();
}

export function setupForegroundHandler() {
  return messaging().onMessage(async (remoteMessage) => {
    const { notification, data } = remoteMessage;
    if (!notification) return;

    const channelId = (data?.type === 'stock') ? CHANNEL_STOCK : CHANNEL_ORDERS;

    await notifee.displayNotification({
      title: notification.title ?? 'QuickKart',
      body: notification.body ?? '',
      // Pass through stock data so tap handlers can navigate to the product
      data: data?.type === 'stock' ? {
        type: 'stock',
        productId: data.productId ?? '',
        category: data.category ?? '',
        sku: data.sku ?? '',
      } : undefined,
      android: {
        channelId,
        pressAction: { id: 'default' },
      },
    });
  });
}

export async function subscribeToStockTopic(sku: string): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!enabled) return false;
  await messaging().subscribeToTopic(`stock_update_${sku}`);
  return true;
}

export async function unsubscribeFromStockTopic(sku: string): Promise<void> {
  await messaging().unsubscribeFromTopic(`stock_update_${sku}`);
}

export async function showLocalOrderNotification(orderTotal: number, orderId: string) {
  const t = await getNotificationStrings();
  await notifee.displayNotification({
    title: t.orderPlacedTitle,
    body: t.orderPlacedBody(orderTotal),
    data: { type: 'order', orderId },
    android: {
      channelId: CHANNEL_ORDERS,
      pressAction: { id: 'default' },
    },
  });
}

export async function showLocalDeliveryNotification(orderId: string) {
  const t = await getNotificationStrings();
  await notifee.displayNotification({
    title: t.orderDeliveredTitle,
    body: t.orderDeliveredBody,
    data: { type: 'order', orderId },
    android: {
      channelId: CHANNEL_ORDERS,
      pressAction: { id: 'default' },
    },
  });
}

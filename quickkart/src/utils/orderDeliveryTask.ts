import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.native';
import { showLocalDeliveryNotification } from '../services/notificationService';

const STORAGE_KEY = 'pending_cod_deliveries';

interface PendingDelivery {
  orderId: string;
  userId: string;
  deliverAt: number; // epoch ms
}

async function getPendingDeliveries(): Promise<PendingDelivery[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function savePendingDeliveries(items: PendingDelivery[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Called right after a COD order is placed. Saves to AsyncStorage for crash recovery
// and starts an in-process timer for when the app stays alive.
export async function scheduleCodDelivery(orderId: string, userId: string): Promise<void> {
  const deliverAt = Date.now() + 5 * 60 * 1000;
  const deliveries = await getPendingDeliveries();
  deliveries.push({ orderId, userId, deliverAt });
  await savePendingDeliveries(deliveries);

  setTimeout(() => deliverOrder(orderId, userId), 5 * 60 * 1000);
}

// Updates Firestore status to 'delivered' and sends the local notification.
// On success, removes the entry from AsyncStorage so it isn't retried.
export async function deliverOrder(orderId: string, userId: string): Promise<void> {
  try {
    await updateDoc(
      doc(db, 'users', userId, 'previousOrders', orderId),
      { status: 'delivered' },
    );
    await showLocalDeliveryNotification(orderId);
    const deliveries = await getPendingDeliveries();
    await savePendingDeliveries(deliveries.filter(d => d.orderId !== orderId));
  } catch (e) {
    console.warn('[DeliveryTask] Failed to deliver order:', e);
  }
}

// Run on app startup and in every background fetch cycle.
// Processes any deliveries whose timer elapsed while the app was dead.
export async function checkPendingDeliveries(): Promise<void> {
  const now = Date.now();
  const deliveries = await getPendingDeliveries();
  const overdue = deliveries.filter(d => d.deliverAt <= now);
  for (const d of overdue) {
    await deliverOrder(d.orderId, d.userId);
  }
}

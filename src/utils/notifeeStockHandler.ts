import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.native';
import { navigationRef } from '../navigation/navigationRef';

export async function handleNotifeeStockData(
  data: Record<string, any> | undefined,
): Promise<void> {
  if (!data || data.type !== 'stock' || !data.productId || !data.category) return;

  try {
    const snap = await getDoc(
      doc(db, 'products', data.category, `${data.category}Collection`, data.productId),
    );
    if (!snap.exists()) return;
    const product = { id: snap.id, ...snap.data() };
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate('ProductDetails', {
        productJson: JSON.stringify(product),
      });
    }
  } catch (e) {
    console.warn('[StockNotif] Failed to navigate to product:', e);
  }
}

export async function handleNotifeeOrderData(
  data: Record<string, any> | undefined,
): Promise<void> {
  if (!data || data.type !== 'order' || !data.orderId) return;

  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate('OrderDetails', { orderId: data.orderId as string });
  }
}

// Unified dispatcher — routes by notification type
export async function handleNotifeeData(
  data: Record<string, any> | undefined,
): Promise<void> {
  if (!data) return;
  if (data.type === 'stock') return handleNotifeeStockData(data);
  if (data.type === 'order') return handleNotifeeOrderData(data);
}

import { collection, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { auth, db } from '../../firebase.native';

// Resolves to the logged-in user once AsyncStorage-backed auth state is ready.
// Needed in headless context where auth state loads asynchronously on cold start.
function getAuthUser(): Promise<{ uid: string } | null> {
  return new Promise(resolve => {
    const unsub = auth.onAuthStateChanged((user: any) => {
      unsub();
      resolve(user);
    });
  });
}

export async function runStockCheck(): Promise<void> {
  console.log('[StockCheck] Task fired');
  try {
    const user = await getAuthUser();
    if (!user) { console.log('[StockCheck] No logged-in user, skipping'); return; }

    console.log('[StockCheck] Checking subscriptions for', user.uid);
    const subsSnap = await getDocs(
      collection(db, 'users', user.uid, 'stockSubscriptions'),
    );
    if (subsSnap.empty) { console.log('[StockCheck] No subscriptions found'); return; }

    console.log('[StockCheck] Found', subsSnap.size, 'subscription(s)');

    for (const subDoc of subsSnap.docs) {
      const { category, productName } = subDoc.data();
      const productId = subDoc.id;
      console.log('[StockCheck] Checking product:', productId, 'category:', category);
      if (!category) { console.log('[StockCheck] Skipping - no category'); continue; }

      const productSnap = await getDoc(
        doc(db, 'products', category, `${category}Collection`, productId),
      );
      if (!productSnap.exists()) { console.log('[StockCheck] Product doc not found'); continue; }

      const stock = Number(productSnap.data()?.stock ?? 0);
      console.log('[StockCheck] Stock is', stock);
      if (stock <= 0) { console.log('[StockCheck] Still out of stock, skipping'); continue; }

      await notifee.displayNotification({
        title: 'Back in Stock!',
        body: `${productName || 'A product you wanted'} is now available. Grab it before it sells out!`,
        data: { type: 'stock', productId, category },
        android: {
          channelId: 'stock',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
      });

      // Remove subscription from both collections so user isn't notified again
      await Promise.all([
        deleteDoc(doc(db, 'users', user.uid, 'stockSubscriptions', productId)),
        deleteDoc(doc(db, 'notifyWhenInStock', productId, 'subscribers', user.uid)),
      ]);
    }
  } catch (err) {
    console.error('[StockCheck]', err);
  }
}

// Called by Android when the app is fully terminated (headless JS mode)
export async function stockCheckHeadlessTask({ taskId }: { taskId: string }): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const BackgroundFetch = require('react-native-background-fetch').default;
  await runStockCheck();
  BackgroundFetch.finish(taskId);
}

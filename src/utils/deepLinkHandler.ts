import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.native';
import { navigationRef } from '../navigation/navigationRef';

export async function handleDeepLink(url: string): Promise<void> {
  // Expected format: quickkart://product/{productId}?category={category}
  const match = url.match(/^quickkart:\/\/product\/([^?]+)/);
  if (!match) return;

  const productId = decodeURIComponent(match[1]);
  const queryString = url.split('?')[1] ?? '';
  const params = new URLSearchParams(queryString);
  const category = params.get('category');

  if (!category) return;

  try {
    const ref = doc(db, 'products', category, `${category}Collection`, productId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const product = {
      id: snap.id,
      ...snap.data(),
      stock: Number((snap.data() as any).stock ?? 0),
      category,
    };

    if (navigationRef.isReady()) {
      navigationRef.navigate('ProductDetails', { productJson: JSON.stringify(product) });
    }
  } catch (e) {
    console.error('[DeepLink] Failed to load product:', e);
  }
}

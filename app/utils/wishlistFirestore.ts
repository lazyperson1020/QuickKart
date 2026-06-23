import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { WishlistItem } from '../redux/wishlistSlice';

export async function loadWishlistFromFirestore(userId: string): Promise<WishlistItem[]> {
  const snapshot = await getDocs(collection(db, 'users', userId, 'wishlist'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as WishlistItem[];
}

export async function addToWishlistFirestore(userId: string, item: WishlistItem): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'wishlist', item.id), item);
}

export async function removeFromWishlistFirestore(userId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'wishlist', itemId));
}

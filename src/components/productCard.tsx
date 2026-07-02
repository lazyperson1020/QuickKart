import React, { memo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, incrementQuantity, decrementQuantity } from '../redux/cartSlice';
import { toggleWishlist } from '../redux/wishlistSlice';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';
import { auth } from '../../firebase';
import { addToWishlistFirestore, removeFromWishlistFirestore } from '../utils/wishlistFirestore';
import { useSinglePress } from '../hooks/useSinglePress';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { registerForPushNotificationsAsync } from '../utils/registerPushNotifications';
import { useTranslation } from '../localization/LanguageContext';
export interface GroceryProduct {
  id: string;
  sku?: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  imageUrl1?: string;
  imageUrl2?: string;
  weight: string;
  position?: number;
  stock: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  tags?: string[];
  inStock?: boolean;
  description: string;
}

function ProductCardInner({ product, cardWidth = 130 }: { product: GroceryProduct; cardWidth?: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) => state.cart.find((item) => item.id === product.id));
  const isWishlisted = useSelector((state: RootState) => state.wishlist.some((item) => item.id === product.id));
  const savings = (product.originalPrice || 0) - (product.price || 0);

  const handleWishlist = useSinglePress(() => {
    dispatch(toggleWishlist(product));
    const user = auth.currentUser;
    if (user) {
      if (isWishlisted) {
        removeFromWishlistFirestore(user.uid, product.id).catch(console.error);
      } else {
        addToWishlistFirestore(user.uid, product).catch(console.error);
      }
    }
  });
  const handleAdd = useSinglePress(() => {
    if (product.stock <= 0) { showStockToast(); return; }
    dispatch(addProduct(product));
  });
  const handleDecrement = useSinglePress(() => dispatch(decrementQuantity(product)), 300);
  const handleIncrement = useSinglePress(() => {
    if (cartItem && cartItem.quantity >= product.stock) { showStockToast(); return; }
    dispatch(incrementQuantity(product));
  }, 300);

  const handleNotify = useSinglePress(async () => {
    const user = auth.currentUser;
    if (!user) {
      Toast.show({ type: 'error', text1: t.productCard.loginForNotifications, position: 'bottom' });
      return;
    }
    const token = await registerForPushNotificationsAsync();
    if (!token) {
      Toast.show({ type: 'error', text1: t.productCard.enableNotificationsInSettings, position: 'bottom' });
      return;
    }
    try {
      await Promise.all([
        setDoc(doc(db, 'notifyWhenInStock', product.id, 'subscribers', user.uid), {
          fcmToken: token,
          productName: product.name,
          subscribedAt: new Date().toISOString(),
        }),
        setDoc(doc(db, 'users', user.uid, 'stockSubscriptions', product.id), {
          productName: product.name,
          category: product.category ?? '',
          subscribedAt: new Date().toISOString(),
        }),
      ]);
      Toast.show({ type: 'success', text1: t.productCard.willNotifyWhenBack, position: 'bottom' });
    } catch {
      Toast.show({ type: 'error', text1: t.productCard.failedToSubscribe, position: 'bottom' });
    }
  });

  const showStockToast = () => {
  Toast.show({
    type: 'error',
    text1:
      product.stock <= 0
        ? t.productCard.outOfStock
        : t.cart.onlyUnitsAvailable(product.stock),
    position: 'bottom',
  });
};

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>

      {/* IMAGE + floating controls */}
      <View style={[styles.imageWrapper, { width: cardWidth, height: cardWidth }]}>

          {product.stock <= 0 && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>
                {t.stockBadge.soldOut}
              </Text>
            </View>
          )}

          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
            style={[
              styles.productImage,
              product.stock <= 0 && {
                opacity: 0.35,
              },
            ]}
            resizeMode="contain"
          />

        {/* Wishlist heart — top-right */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleWishlist}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color="#e91e63"
          />
        </TouchableOpacity>

        {/* ADD / qty controls — bottom-center */}
        {cartItem ? (
          <Pressable style={styles.quantityContainer} onPress={() => {}}>
            <Pressable
              onPress={handleDecrement}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="minus" size={14} color="#e91e63" />
            </Pressable>

            <Text style={styles.quantityText}>
              {cartItem.quantity}
            </Text>

            <Pressable
              onPress={handleIncrement}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="plus" size={14} color="#e91e63" />
            </Pressable>
          </Pressable>
        ) : product.stock <= 0 ? (
          <Pressable style={styles.notifyButton} onPress={handleNotify}>
            <Ionicons
              name="notifications-outline"
              size={16}
              color="#e91e63"
            />
            <Text style={styles.notifyText}>
              {t.productCard.notify}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>
              {t.productCard.add}
            </Text>
          </Pressable>
        )}
      </View>

      {/* TEXT CONTENT */}
      <View style={styles.textContent}>
        {/* PRICE ROW */}
        <View style={styles.priceRow}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>₹{product.price}</Text>
          </View>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPriceText}>₹{product.originalPrice}</Text>
          )}
        </View>

        {savings > 0 && <Text style={styles.savingsText}>{t.productCard.offAmount(savings)}</Text>}

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.weightText}>{product.weight}</Text>
      </View>

    </View>
  );
}

export default memo(ProductCardInner);

const styles = StyleSheet.create({
  cardContainer: {
    width: 130,
    marginRight: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  textContent: {
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  imageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#e91e63',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  quantityText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  priceBadge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  originalPriceText: {
    fontSize: 12,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    color: '#2e7d32',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  productName: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 16,
  },
  weightText: {
    fontSize: 11,
    color: '#757575',
    marginTop: 1,
  },
  notifyButton: {
  position: 'absolute',
  bottom: 8,
  left: 12,
  right: 12,

  backgroundColor: '#fff',

  borderWidth: 1.5,
  borderColor: '#e91e63',

  borderRadius: 8,

  paddingVertical: 5,

  flexDirection: 'row',

  justifyContent: 'center',

  alignItems: 'center',

  gap: 4,
},

notifyText: {
  color: '#e91e63',
  fontWeight: '700',
  fontSize: 13,
},
soldOutBadge: {
  position: 'absolute',
  top: 6,
  left: 6,
  backgroundColor: '#fff',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
  zIndex: 100,
},

soldOutText: {
  fontSize: 11,
  fontWeight: '600',
  color: '#555',
},
});

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, incrementQuantity, decrementQuantity } from '../app/redux/cartSlice';
import { toggleWishlist } from '../app/redux/wishlistSlice';
import { RootState } from '../app/redux/store';
import Toast from 'react-native-toast-message';
import { auth } from '../firebase';
import { addToWishlistFirestore, removeFromWishlistFirestore } from '../app/utils/wishlistFirestore';
export interface GroceryProduct {
  id: string;
  sku?: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  weight: string;
  position?: number;
  stock: number;
  category?: string;
  brand?: string;
  tags?: string[];
  inStock?: boolean;
  description: string;
}

export default function ProductCard({ product }: { product: GroceryProduct }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist);

  const cartItem = cart.find((item) => item.id === product.id);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const savings = (product.originalPrice || 0) - (product.price || 0);

  const showStockToast = () => {
  Toast.show({
    type: 'error',
    text1:
      product.stock <= 0
        ? 'This item is out of stock'
        : `Only ${product.stock} unit(s) available`,
    position: 'bottom',
  });
};

  return (
    <View style={styles.cardContainer}>

      {/* IMAGE + floating controls */}
      <View style={styles.imageWrapper}>

          {product.stock <= 0 && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>
                Sold Out
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
            resizeMode="cover"
          />

        {/* Wishlist heart — top-right */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => {
            dispatch(toggleWishlist(product));
            const user = auth.currentUser;
            if (user) {
              if (isWishlisted) {
                removeFromWishlistFirestore(user.uid, product.id).catch(console.error);
              } else {
                addToWishlistFirestore(user.uid, product).catch(console.error);
              }
            }
          }}
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
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => dispatch(decrementQuantity(product))}
              hitSlop={8}
            >
              <AntDesign name="minus" size={14} color="#e91e63" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {cartItem.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (cartItem.quantity >= product.stock) {
                  showStockToast();
                  return;
                }

                dispatch(incrementQuantity(product));
              }}
              hitSlop={8}
            >
              <AntDesign name="plus" size={14} color="#e91e63" />
            </TouchableOpacity>
          </View>
        ) : product.stock <= 0 ? (
          <TouchableOpacity
            style={styles.notifyButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="notifications-outline"
              size={16}
              color="#e91e63"
            />

            <Text style={styles.notifyText}>
              Notify
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (product.stock <= 0) {
                showStockToast();
                return;
              }

              dispatch(addProduct(product));
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              ADD
            </Text>
          </TouchableOpacity>
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

        {savings > 0 && <Text style={styles.savingsText}>₹{savings} OFF</Text>}

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.weightText}>{product.weight}</Text>
      </View>

    </View>
  );
}

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

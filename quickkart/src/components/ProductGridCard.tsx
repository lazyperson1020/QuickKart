import React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, incrementQuantity, decrementQuantity } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { GroceryProduct } from './productCard';
import Toast from 'react-native-toast-message';
import { useSinglePress } from '../hooks/useSinglePress';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2; // 16px outer padding each side + 8px gap

interface ProductGridCardProps {
  product: GroceryProduct;
  onPress?: () => void;
  cardWidth?: number;
}

export default function ProductGridCard({ product, onPress, cardWidth: widthProp }: ProductGridCardProps) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const resolvedWidth = widthProp ?? CARD_WIDTH;

  const cartItem = cart.find((item) => item.id === product.id);
  const savings = (product.originalPrice || 0) - (product.price || 0);
  const isOutOfStock = product.stock <= 0;

  const showStockToast = () => {
    Toast.show({
      type: 'error',
      text1: isOutOfStock
        ? 'This item is out of stock'
        : `Only ${product.stock} unit(s) available`,
      position: 'bottom',
    });
  };

  const handleAdd = useSinglePress(() => dispatch(addProduct(product)));
  const handleDecrement = useSinglePress(() => dispatch(decrementQuantity(product)), 300);
  const handleIncrement = useSinglePress(() => {
    if (cartItem && cartItem.quantity >= product.stock) { showStockToast(); return; }
    dispatch(incrementQuantity(product));
  }, 300);

  return (
    <Pressable style={({ pressed }) => [styles.cardContainer, { width: resolvedWidth }, pressed && { opacity: 0.9 }]} onPress={onPress}>
      {/* Image + ADD/qty overlay */}
      <View style={[styles.imageWrapper, { width: resolvedWidth, height: Math.round(resolvedWidth * 0.76) }]}>
        {isOutOfStock && (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>Sold Out</Text>
          </View>
        )}
        <Image
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/200' }}
          style={[styles.productImage, isOutOfStock && { opacity: 0.35 }]}
          resizeMode="cover"
        />
        {cartItem ? (
          <Pressable style={styles.quantityContainer} onPress={() => {}}>
            <Pressable
              onPress={handleDecrement}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="minus" size={14} color="#e91e63" />
            </Pressable>
            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
            <Pressable
              onPress={handleIncrement}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="plus" size={14} color="#e91e63" />
            </Pressable>
          </Pressable>
        ) : isOutOfStock ? (
          <Pressable style={styles.notifyButton} onPress={() => {}}>
            <Ionicons name="notifications-outline" size={16} color="#e91e63" />
            <Text style={styles.notifyText}>Notify</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </Pressable>
        )}
      </View>

      {/* Price row */}
      <View style={styles.priceRow}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{product.price}</Text>
        </View>
        {product.originalPrice > product.price && (
          <Text style={styles.originalPriceText}>₹{product.originalPrice}</Text>
        )}
      </View>

      {savings > 0 && (
        <Text style={styles.savingsText}>₹{savings} OFF</Text>
      )}

      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.weightText}>{product.weight}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  imageWrapper: {
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
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  originalPriceText: {
    fontSize: 13,
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  productName: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 17,
  },
  weightText: {
    fontSize: 11,
    color: '#757575',
    marginTop: 1,
    marginBottom: 4,
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
  notifyButton: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e91e63',
    borderRadius: 8,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  notifyText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 14,
  },
});

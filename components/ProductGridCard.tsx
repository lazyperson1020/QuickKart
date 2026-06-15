import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, incrementQuantity, decrementQuantity } from '../app/redux/cartSlice';
import { RootState } from '../app/redux/store';
import { GroceryProduct } from './productCard';
import Toast from 'react-native-toast-message';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2; // 16px outer padding each side + 8px gap

interface ProductGridCardProps {
  product: GroceryProduct;
  onPress?: () => void;
}

export default function ProductGridCard({ product, onPress }: ProductGridCardProps) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

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

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
      {/* Image + ADD/qty overlay */}
      <View style={styles.imageWrapper}>
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
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => dispatch(decrementQuantity(product))}
              hitSlop={8}
            >
              <AntDesign name="minus" size={14} color="#e91e63" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
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
        ) : isOutOfStock ? (
          <TouchableOpacity style={styles.notifyButton} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={16} color="#e91e63" />
            <Text style={styles.notifyText}>Notify</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => dispatch(addProduct(product))}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
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
    marginTop: 8,
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
    marginTop: 3,
  },
  productName: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 18,
  },
  weightText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
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

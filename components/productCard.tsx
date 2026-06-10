import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

// 1. Export TypeScript shape to describe our Firestore Document layout structure
export interface GroceryProduct {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: GroceryProduct;
  onAddPress: (id: string) => void;
}

export default function ProductCard({ product, onAddPress }: ProductCardProps) {
  // Compute savings discount values on the fly
  const savings = (product.originalPrice || 0) - (product.price || 0);

  return (
    <View style={styles.cardContainer}>
      
      {/* CARD MAIN IMAGE ELEMENT WITH FLOATING POSITION PLUS BUTTON */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => onAddPress(product.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* PRICE METRICS CONTAINER */}
      <View style={styles.priceRow}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{product.price}</Text>
        </View>
        {product.originalPrice > product.price && (
          <Text style={styles.originalPriceText}>₹{product.originalPrice}</Text>
        )}
      </View>

      {/* DISCOUNTS BADGE RENDERING */}
      {savings > 0 && <Text style={styles.savingsText}>₹{savings} OFF</Text>}

      {/* META DESCRIPTIONS */}
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.weightText}>{product.weight}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { 
    width: 115, 
    marginRight: 14, 
    backgroundColor: '#fff',
    borderRadius:'8px',
  },
  imageWrapper: { 
    width: 115, 
    height: 115, 
    borderRadius: 12, 
    overflow: 'hidden', 
    position: 'relative', 
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  productImage: { 
    width: '100%', 
    height: '100%' 
  },
  addButton: {
    position: 'absolute', 
    bottom: 6, 
    right: 6, 
    backgroundColor: '#fff', 
    width: 28, 
    height: 28, 
    borderRadius: 8,
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e91e63',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1.41, 
    elevation: 2,
  },
  addButtonText: { 
    color: '#e91e63', 
    fontSize: 18, 
    fontWeight: 'bold', 
    top: -1 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8, 
    gap: 6 
  },
  priceBadge: { 
    backgroundColor: '#2e7d32', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 6 
  },
  priceText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  originalPriceText: { 
    fontSize: 12, 
    color: '#757575', 
    textDecorationLine: 'line-through' 
  },
  savingsText: { 
    color: '#2e7d32', 
    fontSize: 11, 
    fontWeight: '700', 
    marginTop: 2 
  },
  productName: { 
    fontSize: 13, 
    color: '#212121', 
    fontWeight: '500', 
    marginTop: 4, 
    lineHeight: 16 
  },
  weightText: { 
    fontSize: 11, 
    color: '#757575', 
    marginTop: 2 
  },
});
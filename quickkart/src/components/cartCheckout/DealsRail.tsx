import React from 'react';
import { View } from 'react-native';
import ProductRail from '../ProductRail';
import { GroceryProduct } from '../productCard';

interface DealsRailProps {
  products: GroceryProduct[];
  onProductPress: (product: GroceryProduct) => void;
}

export default function DealsRail({
  products,
  onProductPress,
}: DealsRailProps) {
  const deals = products
    .filter(
      product =>
        product.originalPrice > product.price
    )
    .sort((a, b) => {
      const aSavings =
        a.originalPrice - a.price;

      const bSavings =
        b.originalPrice - b.price;

      return bSavings - aSavings;
    })
    .slice(0, 12);

  if (!deals.length) return null;

  return (
    <View style={{ marginBottom: 16 }}>
      <ProductRail
        products={deals}
        onProductPress={onProductPress}
        rows={1}
      />
    </View>
  );
}
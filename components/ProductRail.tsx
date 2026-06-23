import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import ProductCard, { GroceryProduct } from './productCard';
import { useSinglePress } from '../hooks/useSinglePress';

interface ProductRailProps {
  products: GroceryProduct[];
  onProductPress: (product: GroceryProduct) => void;
  rows?: 1 | 2;
}

const SEPARATOR = () => <View style={{ width: 14 }} />;
const HEADER = () => <View style={{ width: 16 }} />;
const FOOTER = () => <View style={{ width: 16 }} />;

export default function ProductRail({ products, onProductPress, rows = 1 }: ProductRailProps) {
  const safePress = useSinglePress(onProductPress);
  if (rows === 2) {
    const columns = products.reduce<GroceryProduct[][]>((cols, item, i) => {
      if (i % 2 === 0) cols.push([item]);
      else cols[cols.length - 1].push(item);
      return cols;
    }, []);

    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={columns}
        keyExtractor={(_, i) => `col-${i}`}
        renderItem={({ item: pair }) => (
          <View style={{ flexDirection: 'column', gap: 12 }}>
            {pair.map(product => (
              <Pressable
                key={product.id}
                onPress={() => safePress(product)}
                style={({ pressed }) => pressed && { opacity: 0.85 }}
              >
                <ProductCard product={product} />
              </Pressable>
            ))}
          </View>
        )}
        ItemSeparatorComponent={SEPARATOR}
        ListHeaderComponent={HEADER}
        ListFooterComponent={FOOTER}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => safePress(item)} style={({ pressed }) => pressed && { opacity: 0.85 }}>
          <ProductCard product={item} />
        </Pressable>
      )}
      ItemSeparatorComponent={SEPARATOR}
      ListHeaderComponent={HEADER}
      ListFooterComponent={FOOTER}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
  );
}

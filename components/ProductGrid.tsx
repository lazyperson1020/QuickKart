import React, { useCallback } from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import ProductGridCard from './ProductGridCard';
import { GroceryProduct } from './productCard';
import { useSinglePress } from '../hooks/useSinglePress';

interface ProductGridProps {
  products: GroceryProduct[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  ListHeaderComponent?: React.ReactElement | null;
  contentPaddingBottom?: number;
  onScroll?: any;
  scrollEventThrottle?: number;
}

export default function ProductGrid({
  products,
  loading = false,
  error = null,
  emptyMessage = 'No products found.',
  ListHeaderComponent,
  contentPaddingBottom = 120,
  onScroll,
  scrollEventThrottle = 16,
}: ProductGridProps) {
  const router = useRouter();

  const handlePress = useSinglePress(
    useCallback(
      (product: GroceryProduct) => {
        router.push({
          pathname: '/(tabs)/productDetails',
          params: { productJson: JSON.stringify(product) },
        });
      },
      [router]
    )
  );

  const renderItem: ListRenderItem<GroceryProduct> = useCallback(
    ({ item }) => <ProductGridCard product={item} onPress={() => handlePress(item)} />,
    [handlePress]
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2e7d32" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (products.length === 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <Animated.FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={[styles.listContent, { paddingBottom: contentPaddingBottom }]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      removeClippedSubviews
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    marginTop: 60,
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626',
    marginTop: 40,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});

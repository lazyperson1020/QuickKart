import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import ProductGridCard from '../../../components/ProductGridCard';
import { GroceryProduct } from '../../../components/productCard';
import FloatingCartPanel, { useCartPanelScrollHandler } from '../../../components/FloatingCartPanel';

export default function AllProductsScreen() {
  const router = useRouter();
  const { category, categoryTitle } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
  }>();

  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [filtered, setFiltered] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const title = categoryTitle || category || 'All Products';

  const scrollHandler = useCartPanelScrollHandler();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        let items: GroceryProduct[] = [];
        if (!category || category === 'All') {
          for (const cat of ['Dairy', 'Fresh', 'Snacks', 'Electronics']) {
            const snap = await getDocs(collection(db, 'products', cat, `${cat}Collection`));
            snap.forEach((doc) => {
              const data = doc.data();
              items.push({ id: doc.id, ...data, stock: Number(data.stock ?? 0) } as GroceryProduct);
            });
          }
        } else {
          const snap = await getDocs(collection(db, 'products', category, `${category}Collection`));
          snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as GroceryProduct));
        }
        items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999));
        setProducts(items);
        setFiltered(items);
      } catch (err: any) {
        setFetchError(err?.message ?? 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (!searchQuery.trim()) { setFiltered(products); return; }
    const q = searchQuery.toLowerCase();
    setFiltered(products.filter((p) => p.name?.toLowerCase().includes(q)));
  }, [searchQuery, products]);

  const handleProductPress = useCallback(
    (product: GroceryProduct) =>
      router.push({ pathname: '/(tabs)/productDetails', params: { productJson: JSON.stringify(product) } }),
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: GroceryProduct }) => (
      <ProductGridCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        {showSearch ? (
          <TextInput
            style={styles.searchInput}
            autoFocus
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={() => { if (!searchQuery) setShowSearch(false); }}
          />
        ) : (
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        )}

        <View style={styles.headerIcons}>
          <TouchableOpacity hitSlop={8} onPress={() => router.push('/(tabs)/profile/wishlistPage' as any)}>
            <Ionicons name="heart-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} onPress={() => router.push('/(tabs)/search/results' as any)} style={{ marginLeft: 14 }}>
            <Ionicons name="search-outline" size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PRODUCT GRID */}
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={styles.centered} />
      ) : fetchError ? (
        <Text style={styles.errorText}>{fetchError}</Text>
      ) : filtered.length === 0 ? (
        <Text style={styles.emptyText}>No products found.</Text>
      ) : (
        <Animated.FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[styles.listContent, { paddingBottom: 180 }]}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      )}

      <FloatingCartPanel />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#e91e63',
    paddingVertical: 2,
    marginRight: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    marginTop: 60,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 6,
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
});

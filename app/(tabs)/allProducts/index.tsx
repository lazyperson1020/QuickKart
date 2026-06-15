import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../../firebase';
import ProductGridCard from '../../../components/ProductGridCard';
import { GroceryProduct } from '../../../components/productCard';
import { RootState } from '../../redux/store';

const BOTTOM_STRIP_H = 56;
const CART_BAR_H = 52;

export default function AllProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category, categoryTitle } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
  }>();

  const cart = useSelector((state: RootState) => state.cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [filtered, setFiltered] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [offersVisible, setOffersVisible] = useState(false);

  const title = categoryTitle || category || 'All Products';

  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      let items: GroceryProduct[] = [];

      if (!category || category === "All") {
        const categories = [
          "Dairy",
          "Fresh",
          "Snacks",
          "Electronics",
        ];

        for (const cat of categories) {
          const snapshot = await getDocs(
            collection(
              db,
              "products",
              cat,
              `${cat}Collection`
            )
          );

          snapshot.forEach((doc) => {
            const data = doc.data();
            items.push({
              id: doc.id,
              ...data,
              stock: data.stock !== undefined ? Number(data.stock) : 0,
            } as GroceryProduct);
          });
        }
      } else {
        const snapshot = await getDocs(
          collection(
            db,
            "products",
            category,
            `${category}Collection`
          )
        );

        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          } as GroceryProduct);
        });
      }

      // Sort by position from Firestore
      items.sort(
        (a, b) =>
          Number(a.position ?? 999) -
          Number(b.position ?? 999)
      );

      setProducts(items);
      setFiltered(items);
    } catch (err: any) {
      console.error("Fetch Error:", err);

      setFetchError(
        err?.message ??
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [category]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(products);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFiltered(products.filter((p) => p.name?.toLowerCase().includes(q)));
  }, [searchQuery, products]);

  const handleProductPress = useCallback(
    (product: GroceryProduct) => {
      router.push({
        pathname: '/(tabs)/productDetails',
        params: { productJson: JSON.stringify(product) },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: GroceryProduct }) => (
      <ProductGridCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress]
  );

  const FREE_DELIVERY_THRESHOLD = 99;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);

  // Padding so the last row is never hidden behind the absolute bottom elements
  const bottomPad =
    BOTTOM_STRIP_H +
    insets.bottom +
    (cartCount > 0 ? CART_BAR_H + 12 : 0) +
    16;

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
            onBlur={() => {
              if (!searchQuery) setShowSearch(false);
            }}
          />
        ) : (
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        )}

        <View style={styles.headerIcons}>
          <TouchableOpacity
            hitSlop={8}
            onPress={() => router.push('/(tabs)/profile/wishlistPage' as any)}
          >
            <Ionicons name="heart-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={8}
            onPress={() => setShowSearch((v) => !v)}
            style={{ marginLeft: 14 }}
          >
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
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* CART BAR — absolute, floats above bottom strip */}
      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
          style={[
            styles.cartBar,
            { bottom: BOTTOM_STRIP_H + insets.bottom + 8 },
          ]}
        >
          <Text style={styles.cartBarLeft}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} · ₹{cartTotal}
          </Text>
          <Text style={styles.cartBarRight}>View Cart →</Text>
        </TouchableOpacity>
      )}

      {/* BOTTOM STRIP — absolute, always pinned to screen bottom */}
      <View style={[styles.bottomStrip, { paddingBottom: insets.bottom || 10 }]}>
        <View style={styles.deliveryBadge}>
          <View style={styles.deliveryIconWrap}>
            <Ionicons name="bicycle-outline" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.deliveryTitle}>Unlock free delivery</Text>
            {remaining > 0 ? (
              <Text style={styles.deliverySubtitle}>Shop for ₹{remaining} more</Text>
            ) : (
              <Text style={styles.deliverySubtitle}>Free delivery unlocked!</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.offersBtn}
          onPress={() => setOffersVisible((v) => !v)}
        >
          <Text style={styles.offersBtnText}>Offers</Text>
          <Ionicons
            name={offersVisible ? 'chevron-down' : 'chevron-up'}
            size={14}
            color="#e91e63"
          />
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
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
  bottomStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliveryIconWrap: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 6,
  },
  deliveryTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  deliverySubtitle: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 1,
  },
  offersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  offersBtnText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 13,
  },
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#35035C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cartBarLeft: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cartBarRight: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

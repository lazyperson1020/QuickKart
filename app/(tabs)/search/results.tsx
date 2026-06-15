import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../../firebase';
import SearchHeader from '../../../components/SearchHeader';
import ProductGrid from '../../../components/ProductGrid';
import ProductFilterSheet, {
  FilterOptions,
  DEFAULT_FILTERS,
} from '../../../components/ProductFilterSheet';
import { GroceryProduct } from '../../../components/productCard';
import { RootState } from '../../redux/store';

const CATEGORIES = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];
const BOTTOM_STRIP_H = 52;
const CART_BAR_H = 52;

// ── Filter helpers ──────────────────────────────────────────────────────────

function applyFilters(
  products: GroceryProduct[],
  query: string,
  filters: FilterOptions
): GroceryProduct[] {
  const q = query.trim().toLowerCase();

  let result = products.filter((p) => {
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  if (filters.brands.length > 0) {
    result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
  }
  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }
  if (filters.offersOnly) {
    result = result.filter((p) => p.originalPrice > p.price);
  }

  const sorted = [...result];
  switch (filters.sortBy) {
    case 'price_asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'discount':
      sorted.sort(
        (a, b) => b.originalPrice - b.price - (a.originalPrice - a.price)
      );
      break;
  }
  return sorted;
}

// ── Filter chip definitions ──────────────────────────────────────────────────

type ChipKey = 'sort' | 'brand' | 'price' | 'offers' | 'inStock';

interface ChipDef {
  key: ChipKey;
  label: (filters: FilterOptions) => string;
  isActive: (filters: FilterOptions) => boolean;
  toggle?: (filters: FilterOptions) => FilterOptions;
}

const CHIPS: ChipDef[] = [
  {
    key: 'sort',
    label: (f) => {
      if (f.sortBy === 'price_asc') return 'Price ↑';
      if (f.sortBy === 'price_desc') return 'Price ↓';
      if (f.sortBy === 'discount') return 'Discount';
      return 'Sort';
    },
    isActive: (f) => f.sortBy !== 'default',
  },
  {
    key: 'brand',
    label: (f) => (f.brands.length > 0 ? `Brand (${f.brands.length})` : 'Brand'),
    isActive: (f) => f.brands.length > 0,
  },
  {
    key: 'price',
    label: (f) => (f.maxPrice != null ? `≤₹${f.maxPrice}` : 'Price'),
    isActive: (f) => f.maxPrice != null,
  },
  {
    key: 'offers',
    label: () => 'Offers',
    isActive: (f) => f.offersOnly,
    toggle: (f) => ({ ...f, offersOnly: !f.offersOnly }),
  },
  {
    key: 'inStock',
    label: () => 'In Stock',
    isActive: (f) => f.inStockOnly,
    toggle: (f) => ({ ...f, inStockOnly: !f.inStockOnly }),
  },
];

// ── Screen ───────────────────────────────────────────────────────────────────

export default function SearchResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();

  const cart = useSelector((state: RootState) => state.cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [allProducts, setAllProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const items: GroceryProduct[] = [];
        for (const cat of CATEGORIES) {
          const snap = await getDocs(
            collection(db, 'products', cat, `${cat}Collection`)
          );
          snap.forEach((doc) => {
            const data = doc.data();
            items.push({
              id: doc.id,
              ...data,
              category: cat,
              stock: data.stock !== undefined ? Number(data.stock) : 0,
            } as GroceryProduct);
          });
        }
        items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999));
        setAllProducts(items);
      } catch (err: any) {
        setFetchError(err?.message ?? 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived filtered list
  const filtered = useMemo(
    () => applyFilters(allProducts, searchQuery, filters),
    [allProducts, searchQuery, filters]
  );

  // Brands available in the full product list
  const availableBrands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand).filter(Boolean) as string[])],
    [allProducts]
  );

  const handleChipPress = useCallback(
    (chip: ChipDef) => {
      if (chip.toggle) {
        setFilters((prev) => chip.toggle!(prev));
      } else {
        setFilterSheetVisible(true);
      }
    },
    []
  );

  const handleNewSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setSearchQuery(trimmed);
      setFilters(DEFAULT_FILTERS);
    },
    []
  );

  const bottomPad =
    BOTTOM_STRIP_H +
    insets.bottom +
    (cartCount > 0 ? CART_BAR_H + 12 : 0) +
    16;

  const activeFilterCount = [
    filters.sortBy !== 'default',
    filters.brands.length > 0,
    filters.maxPrice != null,
    filters.inStockOnly,
    filters.offersOnly,
  ].filter(Boolean).length;

  const FilterChipsHeader = (
    <View>
      {/* Result count */}
      {!loading && (
        <Text style={styles.resultCount}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}

      {/* Horizontal filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {/* Advanced filter icon chip */}
        <TouchableOpacity
          style={[styles.chip, activeFilterCount > 0 && styles.chipActive]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={14}
            color={activeFilterCount > 0 ? '#e91e63' : '#444'}
          />
          {activeFilterCount > 0 && (
            <Text style={styles.chipBadge}>{activeFilterCount}</Text>
          )}
        </TouchableOpacity>

        {CHIPS.map((chip) => {
          const active = chip.isActive(filters);
          return (
            <TouchableOpacity
              key={chip.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => handleChipPress(chip)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label(filters)}
              </Text>
              {!chip.toggle && (
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={active ? '#e91e63' : '#666'}
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Reset active filters */}
        {activeFilterCount > 0 && (
          <TouchableOpacity
            style={styles.resetChip}
            onPress={() => setFilters(DEFAULT_FILTERS)}
          >
            <Ionicons name="close" size={13} color="#e91e63" />
            <Text style={styles.resetChipText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <SearchHeader
        value={searchQuery}
        onChangeText={setSearchQuery}
        onBack={() => router.back()}
        onSubmit={handleNewSearch}
        placeholder="Search products..."
      />

      {/* Product grid with chips as header */}
      <ProductGrid
        products={filtered}
        loading={loading}
        error={fetchError}
        emptyMessage={`No products found for "${searchQuery}"`}
        ListHeaderComponent={FilterChipsHeader}
        contentPaddingBottom={bottomPad}
      />

      {/* Cart bar */}
      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
          style={[styles.cartBar, { bottom: BOTTOM_STRIP_H + insets.bottom + 8 }]}
        >
          <Text style={styles.cartBarLeft}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} · ₹{cartTotal}
          </Text>
          <Text style={styles.cartBarRight}>View Cart →</Text>
        </TouchableOpacity>
      )}

      {/* Bottom strip */}
      <View style={[styles.bottomStrip, { paddingBottom: insets.bottom || 10 }]}>
        <View style={styles.deliveryBadge}>
          <View style={styles.deliveryIconWrap}>
            <Ionicons name="bicycle-outline" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.deliveryTitle}>Free delivery on ₹99+</Text>
            <Text style={styles.deliverySubtitle}>
              {cartTotal >= 99
                ? 'Free delivery unlocked!'
                : `Add ₹${99 - cartTotal} more`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons name="options-outline" size={14} color="#e91e63" />
          <Text style={styles.filterBtnText}>
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter bottom sheet */}
      <ProductFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterSheetVisible(false);
        }}
        availableBrands={availableBrands}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 13,
    color: '#888',
  },
  chipScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    gap: 4,
  },
  chipActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fff0f5',
  },
  chipText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#e91e63',
    fontWeight: '700',
  },
  chipBadge: {
    fontSize: 11,
    color: '#e91e63',
    fontWeight: '700',
    marginLeft: 2,
  },
  resetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e91e63',
    backgroundColor: '#fff0f5',
    gap: 4,
  },
  resetChipText: {
    fontSize: 13,
    color: '#e91e63',
    fontWeight: '600',
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  filterBtnText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 13,
  },
});

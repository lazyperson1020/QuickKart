import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase.native';
import SearchHeader from '../../components/SearchHeader';
import ProductGrid from '../../components/ProductGrid';
import ProductFilterSheet, {
  FilterOptions,
  DEFAULT_FILTERS,
} from '../../components/ProductFilterSheet';
import { GroceryProduct } from '../../components/productCard';
import FloatingCartPanel, { useCartPanelScrollHandler } from '../../components/FloatingCartPanel';

const CATEGORIES = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];

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
  if (filters.brands.length > 0) result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
  if (filters.maxPrice != null) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.inStockOnly) result = result.filter((p) => p.stock > 0);
  if (filters.offersOnly) result = result.filter((p) => p.originalPrice > p.price);
  const sorted = [...result];
  switch (filters.sortBy) {
    case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
    case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
    case 'discount': sorted.sort((a, b) => b.originalPrice - b.price - (a.originalPrice - a.price)); break;
  }
  return sorted;
}

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
    label: (f) => f.sortBy === 'price_asc' ? 'Price ↑' : f.sortBy === 'price_desc' ? 'Price ↓' : f.sortBy === 'discount' ? 'Discount' : 'Sort',
    isActive: (f) => f.sortBy !== 'default',
  },
  { key: 'brand', label: (f) => f.brands.length > 0 ? `Brand (${f.brands.length})` : 'Brand', isActive: (f) => f.brands.length > 0 },
  { key: 'price', label: (f) => f.maxPrice != null ? `≤₹${f.maxPrice}` : 'Price', isActive: (f) => f.maxPrice != null },
  { key: 'offers', label: () => 'Offers', isActive: (f) => f.offersOnly, toggle: (f) => ({ ...f, offersOnly: !f.offersOnly }) },
  { key: 'inStock', label: () => 'In Stock', isActive: (f) => f.inStockOnly, toggle: (f) => ({ ...f, inStockOnly: !f.inStockOnly }) },
];

export default function SearchResultsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SearchResults'>>();
  const { query: initialQuery } = (route.params ?? {}) as { query?: string };

  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [allProducts, setAllProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const scrollHandler = useCartPanelScrollHandler();
  const chipScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    const catData: Record<string, GroceryProduct[]> = {};
    const unsubscribers: (() => void)[] = [];

    CATEGORIES.forEach((cat) => {
      const unsub = onSnapshot(
        collection(db, 'products', cat, `${cat}Collection`),
        (snap) => {
          catData[cat] = snap.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data, category: cat, stock: data.stock !== undefined ? Number(data.stock) : 0 } as GroceryProduct;
          });
          if (Object.keys(catData).length === CATEGORIES.length) {
            const merged = CATEGORIES.flatMap((c) => catData[c] ?? []);
            merged.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999));
            setAllProducts(merged);
            setLoading(false);
          }
        },
        (err: any) => { setFetchError(err?.message ?? 'Failed to load products.'); setLoading(false); }
      );
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  const filtered = useMemo(() => applyFilters(allProducts, searchQuery, filters), [allProducts, searchQuery, filters]);
  const availableBrands = useMemo(() => [...new Set(allProducts.map((p) => p.brand).filter(Boolean) as string[])], [allProducts]);

  const handleChipPress = useCallback((chip: ChipDef) => {
    if (chip.toggle) setFilters((prev) => chip.toggle!(prev));
    else setFilterSheetVisible(true);
  }, []);

  const handleNewSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFilterCount = [
    filters.sortBy !== 'default',
    filters.brands.length > 0,
    filters.maxPrice != null,
    filters.inStockOnly,
    filters.offersOnly,
  ].filter(Boolean).length;

  const FilterChipsHeader = (
    <View>
      {!loading && (
        <Text style={styles.resultCount}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}
      <ScrollView ref={chipScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
        <TouchableOpacity
          style={[styles.chip, activeFilterCount > 0 && styles.chipActive]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons name="options-outline" size={14} color={activeFilterCount > 0 ? '#e91e63' : '#444'} />
          {activeFilterCount > 0 && <Text style={styles.chipBadge}>{activeFilterCount}</Text>}
        </TouchableOpacity>

        {CHIPS.map((chip) => {
          const active = chip.isActive(filters);
          return (
            <TouchableOpacity key={chip.key} style={[styles.chip, active && styles.chipActive]} onPress={() => handleChipPress(chip)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label(filters)}</Text>
              {!chip.toggle && <Ionicons name="chevron-down" size={12} color={active ? '#e91e63' : '#666'} style={{ marginLeft: 2 }} />}
            </TouchableOpacity>
          );
        })}

        {activeFilterCount > 0 && (
          <TouchableOpacity style={styles.resetChip} onPress={() => { setFilters(DEFAULT_FILTERS); chipScrollRef.current?.scrollTo({ x: 0, animated: true }); }}>
            <Ionicons name="close" size={13} color="#e91e63" />
            <Text style={styles.resetChipText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        value={searchQuery}
        onChangeText={setSearchQuery}
        onBack={() => navigation.goBack()}
        onSubmit={handleNewSearch}
        placeholder="Search products..."
      />

      <ProductGrid
        products={filtered}
        loading={loading}
        error={fetchError}
        emptyMessage={`No products found for "${searchQuery}"`}
        ListHeaderComponent={FilterChipsHeader}
        contentPaddingBottom={180}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      <FloatingCartPanel />

      <ProductFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        onApply={(f) => { setFilters(f); setFilterSheetVisible(false); }}
        availableBrands={availableBrands}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  resultCount: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
    fontSize: 13, color: '#888',
  },
  chipScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#fafafa', gap: 4,
  },
  chipActive: { borderColor: '#e91e63', backgroundColor: '#fff0f5' },
  chipText: { fontSize: 13, color: '#444', fontWeight: '500' },
  chipTextActive: { color: '#e91e63', fontWeight: '700' },
  chipBadge: { fontSize: 11, color: '#e91e63', fontWeight: '700', marginLeft: 2 },
  resetChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#e91e63',
    backgroundColor: '#fff0f5', gap: 4,
  },
  resetChipText: { fontSize: 13, color: '#e91e63', fontWeight: '600' },
});

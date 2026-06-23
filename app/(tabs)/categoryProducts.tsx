import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { GroceryProduct } from '../../components/productCard';
import ProductGridCard from '../../components/ProductGridCard';
import FloatingCartPanel from '../../components/FloatingCartPanel';
import ProductFilterSheet, { FilterOptions, DEFAULT_FILTERS } from '../../components/ProductFilterSheet';
import { globalBottomBarVisible } from './_layout';

const { width: SCREEN_W } = Dimensions.get('window');
const SIDE_PAD = 12;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - SIDE_PAD * 2 - COL_GAP) / 2);

function applyFilters(products: GroceryProduct[], filters: FilterOptions): GroceryProduct[] {
  let result = [...products];

  if (filters.brands.length > 0)
    result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
  if (filters.maxPrice != null)
    result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.inStockOnly)
    result = result.filter((p) => p.stock > 0);
  if (filters.offersOnly)
    result = result.filter((p) => p.originalPrice > p.price);

  switch (filters.sortBy) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break;
    case 'price_desc': result.sort((a, b) => b.price - a.price); break;
    case 'discount':
      result.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)); break;
  }

  return result;
}

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { category, subCategory } = useLocalSearchParams<{ category: string; subCategory?: string }>();
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const screenTitle = subCategory || category;

  useFocusEffect(useCallback(() => {
    globalBottomBarVisible.value = 1;
  }, []));

  useEffect(() => {
    if (!category) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'products', category, `${category}Collection`));
        const items: GroceryProduct[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            ...data,
            category,
            stock: Number(data.stock ?? 0),
          } as GroceryProduct);
        });
        setProducts(items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [category]);

  const baseProducts = useMemo(() => {
    if (!subCategory) return products;
    return products.filter(p => (p as any).subCategory === subCategory);
  }, [products, subCategory]);

  const availableBrands = useMemo(() => {
    const seen = new Set<string>();
    baseProducts.forEach(p => { if (p.brand) seen.add(p.brand); });
    return Array.from(seen).sort();
  }, [baseProducts]);

  const filteredProducts = useMemo(() => applyFilters(baseProducts, filters), [baseProducts, filters]);

  const activeFilterCount = [
    filters.sortBy !== 'default',
    filters.brands.length > 0,
    filters.maxPrice != null,
    filters.inStockOnly,
    filters.offersOnly,
  ].filter(Boolean).length;

  const sortLabel =
    filters.sortBy === 'price_asc' ? 'Price ↑'
    : filters.sortBy === 'price_desc' ? 'Price ↓'
    : filters.sortBy === 'discount' ? 'Discount'
    : 'Sort';

  const ListHeader = (
    <View>
      <Text style={S.countText}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.chipScroll}>
        {/* Filter icon chip */}
        <TouchableOpacity
          style={[S.chip, activeFilterCount > 0 && S.chipActive]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons name="options-outline" size={14} color={activeFilterCount > 0 ? '#e91e63' : '#444'} />
          {activeFilterCount > 0 && <Text style={S.chipBadge}>{activeFilterCount}</Text>}
        </TouchableOpacity>

        {/* Sort */}
        <TouchableOpacity
          style={[S.chip, filters.sortBy !== 'default' && S.chipActive]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Text style={[S.chipText, filters.sortBy !== 'default' && S.chipTextActive]}>{sortLabel}</Text>
          <Ionicons name="chevron-down" size={12} color={filters.sortBy !== 'default' ? '#e91e63' : '#666'} style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Brand */}
        <TouchableOpacity
          style={[S.chip, filters.brands.length > 0 && S.chipActive]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Text style={[S.chipText, filters.brands.length > 0 && S.chipTextActive]}>
            {filters.brands.length > 0 ? `Brand (${filters.brands.length})` : 'Brand'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={filters.brands.length > 0 ? '#e91e63' : '#666'} style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Price — only shown when active */}
        {filters.maxPrice != null && (
          <TouchableOpacity style={[S.chip, S.chipActive]} onPress={() => setFilterSheetVisible(true)}>
            <Text style={S.chipTextActive}>≤₹{filters.maxPrice}</Text>
          </TouchableOpacity>
        )}

        {/* Offers toggle */}
        <TouchableOpacity
          style={[S.chip, filters.offersOnly && S.chipActive]}
          onPress={() => setFilters(f => ({ ...f, offersOnly: !f.offersOnly }))}
        >
          <Text style={[S.chipText, filters.offersOnly && S.chipTextActive]}>Offers</Text>
        </TouchableOpacity>

        {/* In Stock toggle */}
        <TouchableOpacity
          style={[S.chip, filters.inStockOnly && S.chipActive]}
          onPress={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))}
        >
          <Text style={[S.chipText, filters.inStockOnly && S.chipTextActive]}>In Stock</Text>
        </TouchableOpacity>

        {/* Clear all */}
        {activeFilterCount > 0 && (
          <TouchableOpacity style={S.clearChip} onPress={() => setFilters(DEFAULT_FILTERS)}>
            <Ionicons name="close" size={13} color="#e91e63" />
            <Text style={S.clearChipText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle} numberOfLines={1}>{screenTitle}</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={S.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#E91E8C" style={{ marginTop: 48 }} />
      ) : products.length === 0 ? (
        <View style={S.empty}>
          <Text style={S.emptyTitle}>No products found</Text>
          <Text style={S.emptySub}>We couldn't find any products in {screenTitle}.</Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: SIDE_PAD, paddingBottom: 140, gap: COL_GAP }}
          columnWrapperStyle={{ gap: COL_GAP }}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={S.empty}>
              <Text style={S.emptyTitle}>No matches</Text>
              <Text style={S.emptySub}>Try adjusting your filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProductGridCard
              product={item}
              cardWidth={CARD_W}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/productDetails',
                  params: { productJson: JSON.stringify(item) },
                })
              }
            />
          )}
        />
      )}

      <FloatingCartPanel noNavBar />

      <ProductFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        onApply={(f) => { setFilters(f); setFilterSheetVisible(false); }}
        availableBrands={availableBrands}
        currentFilters={filters}
        totalProductsCount={filteredProducts.length}
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginHorizontal: 8,
  },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  countText: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 13,
    color: '#888',
  },
  chipScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
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
  chipActive: { borderColor: '#e91e63', backgroundColor: '#fff0f5' },
  chipText: { fontSize: 13, color: '#444', fontWeight: '500' },
  chipTextActive: { fontSize: 13, color: '#e91e63', fontWeight: '700' },
  chipBadge: { fontSize: 11, color: '#e91e63', fontWeight: '700', marginLeft: 2 },
  clearChip: {
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
  clearChipText: { fontSize: 13, color: '#e91e63', fontWeight: '600' },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
});

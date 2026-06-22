import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  ListRenderItem,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { GroceryProduct } from '../../../components/productCard';
import ProductGridCard from '../../../components/ProductGridCard';
import SubCategoryNav, { SubCatItem, SUB_NAV_WIDTH } from '../../../components/SubCategoryNav';
import ProductFilterSheet, {
  FilterOptions,
  DEFAULT_FILTERS,
} from '../../../components/ProductFilterSheet';
import FloatingCartPanel from '../../../components/FloatingCartPanel';
import { globalLayoutScrollY, globalBottomBarVisible } from '../_layout';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Banner { id: string; imageUrl: string; position: number; }

// ── Helpers ────────────────────────────────────────────────────────────────────

const SPRING = { damping: 15, stiffness: 130, mass: 0.5 };

function buildSubcats(products: GroceryProduct[]): SubCatItem[] {
  const all: SubCatItem = { id: 'all', label: 'All', imageUri: products[0]?.imageUrl };
  const seen = new Map<string, SubCatItem>();
  for (const p of products) {
    const sub = p.subCategory;
    if (sub && !seen.has(sub)) seen.set(sub, { id: sub, label: sub, imageUri: p.imageUrl });
  }
  return [all, ...Array.from(seen.values())];
}

function applyFilters(
  products: GroceryProduct[],
  subcat: string,
  filters: FilterOptions
): GroceryProduct[] {
  let result = subcat === 'all'
    ? [...products]
    : products.filter((p) => p.subCategory === subcat);

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

// ── Mini Banner Rail ───────────────────────────────────────────────────────────

function BannerRail({ availableWidth }: { availableWidth: number }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const currentIdx = useRef(0);

  useEffect(() => {
    getDocs(collection(db, 'bannerRail'))
      .then((snap) => {
        const data = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Banner, 'id'>) }))
          .sort((a, b) => a.position - b.position);
        setBanners(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const iv = setInterval(() => {
      currentIdx.current = (currentIdx.current + 1) % banners.length;
      (scrollRef.current as any)?.scrollTo({ x: currentIdx.current * availableWidth, animated: true });
    }, 4000);
    return () => clearInterval(iv);
  }, [banners, availableWidth]);

  if (banners.length === 0) return null;

  return (
    <Animated.ScrollView
      ref={scrollRef as any}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ borderRadius: 10, marginBottom: 8 }}
      onMomentumScrollEnd={(e) => {
        currentIdx.current = Math.round(e.nativeEvent.contentOffset.x / availableWidth);
      }}
    >
      {banners.map((b) => (
        <Image
          key={b.id}
          source={{ uri: b.imageUrl }}
          style={{ width: availableWidth, height: 110, borderRadius: 10 }}
          resizeMode="cover"
        />
      ))}
    </Animated.ScrollView>
  );
}

// ── Filter Chip Bar ────────────────────────────────────────────────────────────

interface FilterChipBarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  activeSubcat: string;
  subcats: SubCatItem[];
  onClearSubcat: () => void;
  onOpenSheet: () => void;
}

function FilterChipBar({
  filters,
  setFilters,
  activeSubcat,
  subcats,
  onClearSubcat,
  onOpenSheet,
}: FilterChipBarProps) {
  const activeCount = [
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

  const activeSubcatItem = subcats.find((s) => s.id === activeSubcat);

  return (
    <View style={chipStyles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={chipStyles.scroll}
      >
        {/* Filter icon */}
        <TouchableOpacity
          style={[chipStyles.chip, activeCount > 0 && chipStyles.chipActive]}
          onPress={onOpenSheet}
        >
          <Ionicons name="options-outline" size={15} color={activeCount > 0 ? '#e91e63' : '#444'} />
          {activeCount > 0 && <Text style={chipStyles.badge}>{activeCount}</Text>}
        </TouchableOpacity>

        {/* Sort chip */}
        <TouchableOpacity
          style={[chipStyles.chip, filters.sortBy !== 'default' && chipStyles.chipActive]}
          onPress={onOpenSheet}
        >
          <Text style={[chipStyles.chipText, filters.sortBy !== 'default' && chipStyles.chipTextActive]}>
            {sortLabel}
          </Text>
          <Ionicons name="chevron-down" size={12} color={filters.sortBy !== 'default' ? '#e91e63' : '#666'} />
        </TouchableOpacity>

        {/* Brand chip */}
        <TouchableOpacity
          style={[chipStyles.chip, filters.brands.length > 0 && chipStyles.chipActive]}
          onPress={onOpenSheet}
        >
          <Text style={[chipStyles.chipText, filters.brands.length > 0 && chipStyles.chipTextActive]}>
            {filters.brands.length > 0 ? `Brand (${filters.brands.length})` : 'Brand'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={filters.brands.length > 0 ? '#e91e63' : '#666'} />
        </TouchableOpacity>

        {/* Price chip */}
        {filters.maxPrice != null && (
          <TouchableOpacity style={[chipStyles.chip, chipStyles.chipActive]} onPress={onOpenSheet}>
            <Text style={chipStyles.chipTextActive}>≤₹{filters.maxPrice}</Text>
          </TouchableOpacity>
        )}

        {/* Offers toggle */}
        <TouchableOpacity
          style={[chipStyles.chip, filters.offersOnly && chipStyles.chipActive]}
          onPress={() => setFilters((f) => ({ ...f, offersOnly: !f.offersOnly }))}
        >
          <Text style={[chipStyles.chipText, filters.offersOnly && chipStyles.chipTextActive]}>Offers</Text>
        </TouchableOpacity>

        {/* In Stock toggle */}
        <TouchableOpacity
          style={[chipStyles.chip, filters.inStockOnly && chipStyles.chipActive]}
          onPress={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))}
        >
          <Text style={[chipStyles.chipText, filters.inStockOnly && chipStyles.chipTextActive]}>In Stock</Text>
        </TouchableOpacity>

        {/* Active subcategory chip */}
        {activeSubcat !== 'all' && activeSubcatItem && (
          <View style={[chipStyles.chip, chipStyles.chipActive]}>
            {activeSubcatItem.imageUri && (
              <Image
                source={{ uri: activeSubcatItem.imageUri }}
                style={chipStyles.subcatImage}
              />
            )}
            <Text style={chipStyles.chipTextActive} numberOfLines={1}>
              {activeSubcatItem.label}
            </Text>
            <TouchableOpacity hitSlop={8} onPress={onClearSubcat}>
              <Ionicons name="close" size={13} color="#e91e63" />
            </TouchableOpacity>
          </View>
        )}

        {/* Clear all */}
        {activeCount > 0 && (
          <TouchableOpacity
            style={chipStyles.clearChip}
            onPress={() => setFilters(DEFAULT_FILTERS)}
          >
            <Ionicons name="close" size={13} color="#e91e63" />
            <Text style={chipStyles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  chipText: { fontSize: 12, color: '#444', fontWeight: '500' },
  chipTextActive: { fontSize: 12, color: '#e91e63', fontWeight: '700' },
  badge: { fontSize: 10, color: '#e91e63', fontWeight: '700' },
  subcatImage: { width: 16, height: 16, borderRadius: 8 },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e91e63',
    backgroundColor: '#fff0f5',
    gap: 4,
  },
  clearText: { fontSize: 12, color: '#e91e63', fontWeight: '600' },
});

// ── Main Screen ────────────────────────────────────────────────────────────────

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { category, categoryTitle } = useLocalSearchParams<{
    category: string;
    categoryTitle: string;
  }>();

  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSubcat, setSelectedSubcat] = useState('all');
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const title = categoryTitle ?? category ?? 'Products';

  // Card dimensions
  const RIGHT_PAD = 8;
  const CARD_GAP = 8;
  const rightWidth = screenWidth - SUB_NAV_WIDTH;
  const cardWidth = Math.floor((rightWidth - RIGHT_PAD * 2 - CARD_GAP) / 2);
  const bannerWidth = rightWidth - RIGHT_PAD * 2;

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setFetchError(null);
    getDocs(collection(db, 'products', category, `${category}Collection`))
      .then((snap) => {
        const items: GroceryProduct[] = snap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, ...data, stock: Number(data.stock ?? 0) } as GroceryProduct;
        });
        items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999));
        setProducts(items);
      })
      .catch((err) => setFetchError(err?.message ?? 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, [category]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const subcats = useMemo(() => buildSubcats(products), [products]);

  const filtered = useMemo(
    () => applyFilters(products, selectedSubcat, filters),
    [products, selectedSubcat, filters]
  );

  const availableBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean) as string[])],
    [products]
  );

  const activeFilterCount = [
    filters.sortBy !== 'default',
    filters.brands.length > 0,
    filters.maxPrice != null,
    filters.inStockOnly,
    filters.offersOnly,
  ].filter(Boolean).length;

  // ── Scroll handler ────────────────────────────────────────────────────────
  const lastOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      globalLayoutScrollY.value = y;
      const delta = y - lastOffset.value;
      if (y <= 15) globalBottomBarVisible.value = withSpring(1, SPRING);
      else if (delta > 2 && y > 50) globalBottomBarVisible.value = withSpring(0, SPRING);
      else if (delta < -2) globalBottomBarVisible.value = withSpring(1, SPRING);
      lastOffset.value = y;
    },
  });

  // ── Render ────────────────────────────────────────────────────────────────
  const renderItem: ListRenderItem<GroceryProduct> = useCallback(
    ({ item }) => (
      <ProductGridCard
        product={item}
        cardWidth={cardWidth}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/productDetails',
            params: { productJson: JSON.stringify(item) },
          })
        }
      />
    ),
    [cardWidth, router]
  );

  const ListHeader = useMemo(
    () => (
      <View style={{ paddingHorizontal: RIGHT_PAD, paddingTop: 8, paddingBottom: 4 }}>
        <BannerRail availableWidth={bannerWidth} />
      </View>
    ),
    [bannerWidth]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity hitSlop={8} onPress={() => router.push('/(tabs)/profile/wishlistPage' as any)}>
            <Ionicons name="heart-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={8}
            style={{ marginLeft: 14 }}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Ionicons name="search-outline" size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        {/* Left subcategory nav */}
        <SubCategoryNav
          items={subcats.length > 0 ? subcats : [{ id: 'all', label: 'All' }]}
          selectedId={selectedSubcat}
          onSelect={setSelectedSubcat}
        />

        {/* Right panel */}
        <View style={styles.rightPanel}>
          {/* Sticky filter chip bar */}
          <FilterChipBar
            filters={filters}
            setFilters={setFilters}
            activeSubcat={selectedSubcat}
            subcats={subcats}
            onClearSubcat={() => setSelectedSubcat('all')}
            onOpenSheet={() => setFilterSheetVisible(true)}
          />

          {/* Product list */}
          {loading ? (
            <ActivityIndicator size="large" color="#2e7d32" style={styles.centered} />
          ) : fetchError ? (
            <Text style={styles.errorText}>{fetchError}</Text>
          ) : (
            <Animated.FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={[styles.columnWrapper, { paddingHorizontal: RIGHT_PAD }]}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={ListHeader}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No products found.</Text>
              }
              removeClippedSubviews
              onScroll={scrollHandler}
              scrollEventThrottle={16}
            />
          )}
        </View>
      </View>

      <FloatingCartPanel />

      {/* Filter bottom sheet */}
      <ProductFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        onApply={(f) => { setFilters(f); setFilterSheetVisible(false); }}
        availableBrands={availableBrands}
        currentFilters={filters}
        totalProductsCount={filtered.length}
      />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1, flexDirection: 'row' },
  rightPanel: { flex: 1 },
  centered: { flex: 1, marginTop: 60 },
  listContent: { paddingBottom: 180, paddingTop: 4 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 6 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 },
  errorText: {
    textAlign: 'center', color: '#DC2626',
    marginTop: 40, fontSize: 14, paddingHorizontal: 16,
  },
});

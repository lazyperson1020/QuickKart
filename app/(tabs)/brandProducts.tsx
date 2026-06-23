import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { GroceryProduct } from '../../components/productCard';
import ProductGridCard from '../../components/ProductGridCard';
import FloatingCartPanel from '../../components/FloatingCartPanel';
import { globalBottomBarVisible } from './_layout';

const { width: SCREEN_W } = Dimensions.get('window');
const SIDE_PAD = 12;
const COL_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - SIDE_PAD * 2 - COL_GAP) / 2);

const DB_CATS = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];

export default function BrandProductsScreen() {
  const router = useRouter();
  const { brand } = useLocalSearchParams<{ brand: string }>();
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    globalBottomBarVisible.value = 1;
  }, []));

  useEffect(() => {
    if (!brand) { setLoading(false); return; }
    (async () => {
      try {
        const snaps = await Promise.all(
          DB_CATS.map(cat => getDocs(collection(db, 'products', cat, `${cat}Collection`)))
        );
        const items: GroceryProduct[] = [];
        snaps.forEach((snap, i) =>
          snap.forEach(doc => {
            const data = doc.data();
            if (data.brand?.toLowerCase() === brand.toLowerCase()) {
              items.push({
                id: doc.id,
                ...data,
                category: DB_CATS[i],
                stock: Number(data.stock ?? 0),
              } as GroceryProduct);
            }
          })
        );
        setProducts(items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [brand]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle} numberOfLines={1}>{brand}</Text>
        <View style={S.headerRight}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="heart-outline" size={22} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 4 }} onPress={() => router.push('/(tabs)/search/results' as any)}>
            <Ionicons name="search-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={S.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#E91E8C" style={{ marginTop: 48 }} />
      ) : products.length === 0 ? (
        <View style={S.empty}>
          <Text style={S.emptyTitle}>No products found</Text>
          <Text style={S.emptySub}>We couldn't find any products from {brand}.</Text>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={products}
          numColumns={2}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: SIDE_PAD,
            paddingBottom: 140,
            gap: COL_GAP,
          }}
          columnWrapperStyle={{ gap: COL_GAP }}
          ListHeaderComponent={
            <View style={S.countRow}>
              <Text style={S.countText}>{products.length} product{products.length !== 1 ? 's' : ''}</Text>
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
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  countRow: {
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
});

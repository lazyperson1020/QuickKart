import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, StatusBar, Dimensions, Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { GroceryProduct } from '../../../components/productCard';
import ProductGridCard from '../../../components/ProductGridCard';
import FloatingCartPanel from '../../../components/FloatingCartPanel';
import PriceFilterBadge from '../../../components/PriceFilterBadge';
import { globalBottomBarVisible } from '../_layout';

const { width: SCREEN_W } = Dimensions.get('window');
const SIDE_PAD = 12;
const COL_GAP = 10;
const CARD_W_2 = Math.floor((SCREEN_W - SIDE_PAD * 2 - COL_GAP) / 2);
const BANNER_HEIGHT = 160;
const HEADER_INNER_H = 46;

const DB_CATS = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];

const PRICE_TABS = [
  { key: 199,  amount: 199,  label: 'Under ₹199', imageUrl: undefined },
  { key: 299,  amount: 299,  label: 'Under ₹299', imageUrl: undefined },
  { key: 399,  amount: 399,  label: 'Under ₹399', imageUrl: undefined },
  { key: 499,  amount: 499,  label: 'Under ₹499', imageUrl: undefined },
  { key: 9999, amount: 9999, label: 'All Prices', imageUrl: undefined },
];

const CATEGORY_SECTIONS: { key: string; label: string; emoji: string }[] = [
  { key: 'Fresh',       label: 'Fresh Produce',      emoji: '🥦' },
  { key: 'Dairy',       label: 'Dairy Products',      emoji: '🥛' },
  { key: 'Snacks',      label: 'Snacks & Beverages',  emoji: '🍿' },
  { key: 'Electronics', label: 'Kitchen & More',       emoji: '🏪' },
];

export default function DealsScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePrice, setActivePrice] = useState(199);

  const scrollY = useSharedValue(0);

  useFocusEffect(useCallback(() => {
    globalBottomBarVisible.value = 1;
  }, []));

  useEffect(() => {
    (async () => {
      try {
        const snaps = await Promise.all(
          DB_CATS.map(cat => getDocs(collection(db, 'products', cat, `${cat}Collection`)))
        );
        const items: GroceryProduct[] = [];
        snaps.forEach((snap, i) =>
          snap.forEach(doc =>
            items.push({
              id: doc.id,
              ...doc.data(),
              category: DB_CATS[i],
              stock: Number(doc.data().stock ?? 0),
            } as GroceryProduct)
          )
        );
        setProducts(items.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bannerAnimStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, BANNER_HEIGHT - HEADER_INNER_H], [BANNER_HEIGHT, HEADER_INNER_H], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, (BANNER_HEIGHT - HEADER_INNER_H) * 0.5], [1, 0], Extrapolation.CLAMP);
    return { height, opacity };
  });

  const headerBgAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [(BANNER_HEIGHT - HEADER_INNER_H) * 0.6, BANNER_HEIGHT - HEADER_INNER_H], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const titleAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [(BANNER_HEIGHT - HEADER_INNER_H) * 0.4, BANNER_HEIGHT - HEADER_INNER_H * 0.8], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const filteredByPrice = useMemo(
    () => products.filter(p => p.price <= activePrice),
    [products, activePrice]
  );

  const productsByCategory = useMemo(() => {
    const map: Record<string, GroceryProduct[]> = {};
    CATEGORY_SECTIONS.forEach(sec => {
      map[sec.key] = products.filter(p => p.category === sec.key && p.price <= activePrice);
    });
    return map;
  }, [products, activePrice]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6FB' }}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      {/* Dynamic Collapsible Banner Layer */}
      <Animated.View style={[{
        position: 'absolute',
        top: top,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 5,
      }, bannerAnimStyle]}>
        <Image
          source={require('../../../assets/headerImages/dailyessentialssale.png')}
          style={{ width: SCREEN_W, height: BANNER_HEIGHT }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Fixed Navigation Header Row */}
      <View style={[S.header, { top: top, height: HEADER_INNER_H }]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFDE7' }, headerBgAnimStyle]} />
        
        <TouchableOpacity onPress={() => router.back()} style={S.iconTouchTarget}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        
        <Animated.Text style={[S.headerTitle, titleAnimStyle]}>Sale</Animated.Text>
        
        <TouchableOpacity
          style={S.iconTouchTarget}
          onPress={() => router.push('/(tabs)/search/results' as any)}
        >
          <Ionicons name="search-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Main Content View Container */}
      <View style={{ flex: 1, marginTop: top + HEADER_INNER_H }}>
        {loading ? (
          <ActivityIndicator size="large" color="#E67E22" style={{ marginTop: 40 }} />
        ) : (
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingTop: BANNER_HEIGHT - HEADER_INNER_H, 
              paddingBottom: 140 
            }}
          >
            {/* Inline Scrollable Price Badges Container Track (Moves inline with the view list) */}
            <View style={S.priceTabsContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingHorizontal: SIDE_PAD, gap: 10, alignItems: 'center' }}
              >
                {PRICE_TABS.map(tab => (
                  <PriceFilterBadge
                    key={tab.key}
                    amount={tab.amount}
                    label={tab.label}
                    imageUrl={tab.imageUrl}
                    active={activePrice === tab.key}
                    onPress={() => setActivePrice(tab.key)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Sale Picks Sections Block */}
            {filteredByPrice.length > 0 && (
              <View style={S.section}>
                <View style={S.sectionHeader}>
                  <Text style={S.sectionTitle}>🏷 Sale Picks</Text>
                  <Text style={S.sectionCount}>{filteredByPrice.length} items</Text>
                </View>

                <View style={S.grid}>
                  {filteredByPrice.slice(0, 6).map(item => (
                    <ProductGridCard
                      key={item.id}
                      product={item}
                      cardWidth={CARD_W_2}
                      onPress={() =>
                        router.push({ pathname: '/(tabs)/productDetails', params: { productJson: JSON.stringify(item) } })
                      }
                    />
                  ))}
                </View>

                {filteredByPrice.length > 6 && (
                  <TouchableOpacity
                    style={S.seeAllBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(tabs)/search/results' as any)}
                  >
                    <Text style={S.seeAllText}>See All</Text>
                    <Ionicons name="chevron-forward" size={14} color="#555" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Product Category Multi-Grids Mapping Layout */}
            {CATEGORY_SECTIONS.map(sec => {
              const items = productsByCategory[sec.key];
              if (!items || items.length === 0) return null;
              return (
                <View key={sec.key} style={S.section}>
                  <View style={S.sectionHeader}>
                    <Text style={S.sectionTitle}>{sec.emoji} {sec.label}</Text>
                    <Text style={S.sectionCount}>{items.length} items</Text>
                  </View>

                  <View style={S.grid}>
                    {items.slice(0, 4).map(item => (
                      <ProductGridCard
                        key={item.id}
                        product={item}
                        cardWidth={CARD_W_2}
                        onPress={() =>
                          router.push({ pathname: '/(tabs)/productDetails', params: { productJson: JSON.stringify(item) } })
                        }
                      />
                    ))}
                  </View>

                  {items.length > 4 && (
                    <TouchableOpacity
                      style={S.seeAllBtn}
                      activeOpacity={0.8}
                      onPress={() => router.push({ pathname: '/(tabs)/categoryProducts' as any, params: { category: sec.key } })}
                    >
                      <Text style={S.seeAllText}>See All</Text>
                      <Ionicons name="chevron-forward" size={14} color="#555" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

            {filteredByPrice.length === 0 && (
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🎉</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#333' }}>
                  No products under ₹{activePrice === 9999 ? 'this range' : activePrice}
                </Text>
                <Text style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                  Try a different price range
                </Text>
              </View>
            )}
          </Animated.ScrollView>
        )}
      </View>

      <FloatingCartPanel noNavBar />
    </View>
  );
}

const S = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconTouchTarget: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
  },
  priceTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    paddingVertical: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE_PAD,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  sectionCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIDE_PAD,
    gap: COL_GAP,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIDE_PAD,
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
});
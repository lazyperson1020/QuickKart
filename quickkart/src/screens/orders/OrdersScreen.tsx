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
  interpolateColor,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase.native';
import { GroceryProduct } from '../../components/productCard';
import ProductRail from '../../components/ProductRail';
import { useSinglePress } from '../../hooks/useSinglePress';
import FloatingCartPanel from '../../components/FloatingCartPanel';
import { globalBottomBarVisible } from '../../navigation/tabBarShared';

const { width: SCREEN_W } = Dimensions.get('window');
const SIDE_PAD = 10;
const BANNER_HEIGHT = 160;
const HEADER_INNER_H = 48; 

const PURPLE = '#7C3AED';
const LIGHT_PURPLE = '#EDE9FE';
const DB_CATS = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];

const FILTER_TABS = [
  { key: 'all',         label: 'All Items',           emoji: '❤️' },
  { key: 'Fresh',       label: 'Fruits &\nVegetables', emoji: '🥦' },
  { key: 'Dairy',       label: 'Dairy\nProducts',      emoji: '🥛' },
  { key: 'Snacks',      label: 'Snacks &\nDrinks',     emoji: '🍿' },
  { key: 'Electronics', label: 'Grocery &\nKitchen',   emoji: '🏪' },
];

export default function BuyAgainScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { top } = useSafeAreaInsets();
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const scrollY = useSharedValue(0);

  useFocusEffect(useCallback(() => {
    globalBottomBarVisible.value = 1;
  }, []));

  useEffect(() => {
    const catData: Record<string, GroceryProduct[]> = {};
    const unsubscribers: (() => void)[] = [];

    DB_CATS.forEach((cat, i) => {
      const unsub = onSnapshot(
        collection(db, 'products', cat, `${cat}Collection`),
        (snap) => {
          catData[cat] = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            category: DB_CATS[i],
            stock: Number(doc.data().stock ?? 0),
          } as GroceryProduct));
          if (Object.keys(catData).length === DB_CATS.length) {
            const merged = DB_CATS.flatMap((c) => catData[c] ?? []);
            setProducts(merged.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
            setLoading(false);
          }
        },
        (e) => { console.error(e); setLoading(false); }
      );
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Banner dynamic height contraction and early visual alpha fade out
  const bannerAnimStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, BANNER_HEIGHT], [BANNER_HEIGHT, 0], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, BANNER_HEIGHT * 0.5], [1, 0], Extrapolation.CLAMP);
    return { height, opacity };
  });

  // Background layer transition mask to shield scroll content bleeding
  const headerBgAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [BANNER_HEIGHT * 0.7, BANNER_HEIGHT], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  // Synchronized color map shift from original purple tint into pure black upon final layout collapse
  const titleAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [BANNER_HEIGHT * 0.4, BANNER_HEIGHT * 0.8], [0, 1], Extrapolation.CLAMP);
    const textColor = interpolateColor(
      scrollY.value,
      [BANNER_HEIGHT * 0.6, BANNER_HEIGHT * 0.9],
      [PURPLE, '#111111']
    );
    return { opacity, color: textColor };
  });

  const filtered = useMemo(
    () => activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  );

  const handleProductPress = useSinglePress(useCallback((item: GroceryProduct) => {
    navigation.navigate('ProductDetails', { productJson: JSON.stringify(item) });
  }, [navigation]));
  const goBack = useSinglePress(() => navigation.goBack());
  const goToSearch = useSinglePress(() => navigation.navigate('SearchResults'));

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      {/* Collapsible Graphic Banner Layer */}
      <Animated.View style={[{
        position: 'absolute',
        top: top,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 5,
      }, bannerAnimStyle]}>
        <Image
          source={require('../../../assets/headerImages/buyagain.png')}
          style={{ width: SCREEN_W, height: BANNER_HEIGHT }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Permanent Header Shell Layer */}
      <View style={[S.header, { top: top }]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: LIGHT_PURPLE }, headerBgAnimStyle]} />
        
        <TouchableOpacity onPress={goBack} style={S.iconTouchTarget}>
          <Ionicons name="arrow-back" size={22} color={PURPLE} />
        </TouchableOpacity>
        
        <Animated.Text style={[S.headerTitle, titleAnimStyle]}>Buy Again </Animated.Text>
        
        <TouchableOpacity 
          style={S.iconTouchTarget}
          onPress={goToSearch}
        >
          <Ionicons name="search-outline" size={22} color={PURPLE} />
        </TouchableOpacity>
      </View>

      {/* Content Engine Mount Frame */}
      <View style={{ flex: 1, marginTop: top + HEADER_INNER_H }}>
        {loading ? (
          <ActivityIndicator size="large" color={PURPLE} style={{ marginTop: 40 }} />
        ) : (
          <Animated.ScrollView
            style={{ flex: 1 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: BANNER_HEIGHT - HEADER_INNER_H,
              paddingBottom: 140,
            }}
          >
            <View style={S.filterBarWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SIDE_PAD, alignItems: 'center', gap: 10 }}
              >
                {FILTER_TABS.map(tab => {
                  const active = activeCategory === tab.key;
                  return (
                    <TouchableOpacity
                      key={tab.key}
                      onPress={() => setActiveCategory(tab.key)}
                      activeOpacity={0.8}
                      style={S.chip}
                    >
                      <View style={[S.chipIcon, active && S.chipIconActive]}>
                        <Text style={{ fontSize: 22 }}>{tab.emoji}</Text>
                      </View>
                      <Text style={[S.chipLabel, active && S.chipLabelActive]} numberOfLines={2}>
                        {tab.label}
                      </Text>
                      {active && <View style={S.chipUnderline} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {filtered.length === 0 ? (
              <Text style={S.empty}>No products found.</Text>
            ) : (
              <ProductRail
                products={filtered}
                onProductPress={handleProductPress}
                rows={2}
              />
            )}

            <View style={S.tagline}>
              <Text style={S.taglineText}>The place that fits all</Text>
              <Text style={S.taglineText}>your needs</Text>
            </View>
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
    height: HEADER_INNER_H,
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
    textAlign: 'center',
  },
  filterBarWrapper: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingVertical: 12,
    marginHorizontal: -SIDE_PAD, 
    marginBottom: 4,
  },
  chip: {
    alignItems: 'center',
    width: 76,
    position: 'relative',
    paddingBottom: 8,
  },
  chipIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  chipIconActive: {
    backgroundColor: PURPLE,
  },
  chipLabel: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    lineHeight: 13,
    height: 26,
    fontWeight: '500',
  },
  chipLabelActive: {
    color: PURPLE,
    fontWeight: '700',
  },
  chipUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  tagline: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  taglineText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#D0D0D0',
    lineHeight: 34,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 14,
  },
});
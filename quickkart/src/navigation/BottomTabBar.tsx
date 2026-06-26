import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import type { RootState } from '../redux/store';
import type { RootStackParamList } from './types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { globalBottomBarVisible, TAB_BAR_RAW_HEIGHT } from './tabBarShared';
import { navigationRef } from './navigationRef';

const HIDE_ON_SCREENS: Array<keyof RootStackParamList> = [
  'ProductDetails',
  'AddressList',
  'AddressAdd',
  'AddressEdit',
  'OrderTracking',
  'Orders',
  'Cart',
  'Wishlist',
  'Coupons',
  'Search',
  'SearchResults',
  'BrandProducts',
  'CategoryProducts',
];

const tabs = [
  { screen: 'Home' as keyof RootStackParamList, icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  { screen: 'AllProducts' as keyof RootStackParamList, icon: 'grid-outline', activeIcon: 'grid', label: 'Categories' },
  { screen: 'Orders' as keyof RootStackParamList, icon: 'refresh-outline', activeIcon: 'refresh', label: 'Buy Again' },
  { screen: 'Search' as keyof RootStackParamList, icon: 'gift-outline', activeIcon: 'gift', label: 'Deals' },
];

export default function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const [activeRouteName, setActiveRouteName] = useState('');

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      setActiveRouteName(navigationRef.getCurrentRoute()?.name ?? '');
    });
    setActiveRouteName(navigationRef.getCurrentRoute()?.name ?? '');
    return unsubscribe;
  }, []);

  const cartItems = useSelector((state: RootState) => state.cart);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const shouldHide = HIDE_ON_SCREENS.some(s => activeRouteName === s);

  const totalBarHeight = TAB_BAR_RAW_HEIGHT + insets.bottom;
  const safeBottomPadding = insets.bottom > 0 ? insets.bottom : 6;

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const hiddenOffscreenDistance = totalBarHeight + 20;
    const translateY = interpolate(
      globalBottomBarVisible.value,
      [0, 1],
      [hiddenOffscreenDistance, 0],
      Extrapolate.CLAMP,
    );
    return { transform: [{ translateY }] };
  });

  if (shouldHide) return null;

  return (
    <Animated.View
      style={[styles.bar, { height: totalBarHeight, paddingBottom: safeBottomPadding }, animatedTabBarStyle]}
    >
      {tabs.map(tab => {
        const isActive = activeRouteName === tab.screen;
        const itemColor = isActive ? '#35035C' : '#9CA3AF';
        const iconName = isActive ? tab.activeIcon : tab.icon;

        return (
          <TouchableOpacity
            key={tab.screen}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => {
              if (!isActive) {
                navigationRef.navigate(tab.screen as any);
              }
            }}
          >
            <View>
              <Ionicons name={iconName} size={22} color={itemColor} />
              {tab.screen === 'Cart' && totalCartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalCartCount > 99 ? '99+' : String(totalCartCount)}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: itemColor }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#e91e63',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSinglePress } from '../hooks/useSinglePress';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import BottomSheet from './BottomSheet';
import {
  globalLayoutScrollY,
  globalBottomBarVisible,
  TAB_BAR_RAW_HEIGHT,
} from '../navigation/tabBarShared';
import type { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../localization/LanguageContext';

const { width } = Dimensions.get('window');
const FULL_BAR_WIDTH = width - 24;
const CART_SECTION_WIDTH = 128;
const SPRING_CONFIG = { damping: 15, stiffness: 130, mass: 0.5 };

export function useCartPanelScrollHandler() {
  const lastOffset = useSharedValue(0);
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      globalLayoutScrollY.value = y;
      const delta = y - lastOffset.value;
      if (y <= 15) {
        globalBottomBarVisible.value = withSpring(1, SPRING_CONFIG);
      } else if (delta > 2.0 && y > 50) {
        globalBottomBarVisible.value = withSpring(0, SPRING_CONFIG);
      } else if (delta < -2.0) {
        globalBottomBarVisible.value = withSpring(1, SPRING_CONFIG);
      }
      lastOffset.value = y;
    },
  });
}

export default function FloatingCartPanel({ noNavBar = false }: { noNavBar?: boolean }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const cart = useSelector((state: RootState) => state.cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const goToCart = useSinglePress(() => navigation.navigate('Cart'));
  const [showOffers, setShowOffers] = useState(false);

  const cartBarProgress = useSharedValue(cartCount > 0 ? 1 : 0);
  useEffect(() => {
    cartBarProgress.value = withSpring(cartCount > 0 ? 1 : 0, { damping: 18, stiffness: 180 });
  }, [cartCount]);

  // When noNavBar, always stay pinned to the bottom — no shift animation
  const floatingPanelShiftStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: noNavBar
        ? 0
        : interpolate(
            globalBottomBarVisible.value,
            [0, 1],
            [TAB_BAR_RAW_HEIGHT, 0],
            'clamp'
          ),
    }],
  }));

  const darkBarStyle = useAnimatedStyle(() => ({
    width: interpolate(
      cartBarProgress.value,
      [0, 1],
      [FULL_BAR_WIDTH, FULL_BAR_WIDTH - CART_SECTION_WIDTH - 8],
      'clamp'
    ),
  }));

  const cartSectionStyle = useAnimatedStyle(() => ({
    width: interpolate(cartBarProgress.value, [0, 1], [0, CART_SECTION_WIDTH], 'clamp'),
    opacity: interpolate(cartBarProgress.value, [0, 0.25], [0, 1], 'clamp'),
  }));

  // noNavBar pages have no tab bar to clear — pin to insets.bottom only
  const bottomOffset = noNavBar
    ? insets.bottom + 6
    : TAB_BAR_RAW_HEIGHT + insets.bottom + 6;

  return (
    <>
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: bottomOffset,
            left: 12,
            right: 12,
            zIndex: 30,
            paddingTop: 28,
          },
          floatingPanelShiftStyle,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8 }}>

          {/* Dark delivery progress bar */}
          <Animated.View style={[darkBarStyle, { height: 52, borderRadius: 16, overflow: 'visible' }]}>
            <TouchableOpacity
              onPress={() => setShowOffers(true)}
              activeOpacity={0.8}
              style={{
                position: 'absolute',
                top: -30,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <View style={{
                backgroundColor: '#423f3f',
                paddingHorizontal: 16,
                paddingVertical: 5,
                borderRadius: 20,
              }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.3 }}>
                  {t.home.offersToggle}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{
              flex: 1,
              backgroundColor: '#423f3f',
              borderRadius: 16,
              overflow: 'hidden',
              elevation: 6,
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }} numberOfLines={1}>
                    {t.home.unlockFreeDelivery}
                  </Text>
                  <Text style={{ color: '#AAA', fontSize: 11, marginTop: 1 }} numberOfLines={1}>
                    {cartTotal >= 99 ? t.floatingCartPanel.freeDeliveryUnlocked : t.home.shopMoreForDelivery(99 - cartTotal)}
                  </Text>
                </View>
              </View>
              <View style={{
                height: 2,
                backgroundColor: '#2A2A2A',
                marginHorizontal: 12,
                marginBottom: 6,
                borderRadius: 1,
              }}>
                <View style={{
                  height: 2,
                  borderRadius: 1,
                  width: `${Math.min((cartTotal / 99) * 100, 100)}%`,
                  backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#e91e63',
                }} />
              </View>
            </View>
          </Animated.View>

          {/* Pink cart section */}
          <Animated.View style={[
            cartSectionStyle,
            {
              height: 52,
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: '#e91e63',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 6,
            },
          ]}>
            <TouchableOpacity
              onPress={goToCart}
              style={{
                flex: 1,
                backgroundColor: '#e91e63',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingHorizontal: 10,
                gap: 8,
              }}
              activeOpacity={0.9}
            >
              {cart[cart.length - 1]?.imageUrl ? (
                <View>
                  <Image
                    source={{ uri: cart[cart.length - 1].imageUrl }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      borderWidth: 1.5,
                      borderColor: 'rgba(255,255,255,0.4)',
                    }}
                    resizeMode="cover"
                  />
                  <View style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                    borderWidth: 1.5,
                    borderColor: '#e91e63',
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: '900', color: '#e91e63', lineHeight: 12 }}>
                      {cartCount}
                    </Text>
                  </View>
                </View>
              ) : null}
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, lineHeight: 17 }}>{t.home.cartLabel}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 14 }}>
                  {t.home.itemsCount(cartCount)}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </Animated.View>

      {/* Offers Bottom Sheet */}
      <BottomSheet visible={showOffers} onClose={() => setShowOffers(false)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111' }}>{t.home.offersForYou}</Text>
          <View style={{ backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#555' }}>{t.home.offersCountLabel}</Text>
          </View>
        </View>

        <View style={{ borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: cartTotal >= 99 ? '#4CAF50' : '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: cartTotal >= 99 ? '#E8F5E9' : '#FAFAFA', padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 22 }}>🚚</Text>
                <View>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>{t.home.freeDelivery}</Text>
                  <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                    {cartTotal >= 99 ? t.home.freeDeliveryUnlockedOnOrder : t.home.addMoreToUnlockDelivery(99 - cartTotal)}
                  </Text>
                </View>
              </View>
              <View style={{ backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>
                  {cartTotal >= 99 ? t.common.unlocked : t.common.locked}
                </Text>
              </View>
            </View>
            <View style={{ height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginTop: 12 }}>
              <View style={{
                height: 4,
                borderRadius: 2,
                width: `${Math.min((cartTotal / 99) * 100, 100)}%`,
                backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#e91e63',
              }} />
            </View>
          </View>
        </View>

        <View style={{ borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🏷️</Text>
              <View>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>{t.home.off50}</Text>
                <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{t.home.shopMoreFor50}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>{t.common.locked}</Text>
            </View>
          </View>
        </View>

        <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🎁</Text>
              <View>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>{t.home.off100}</Text>
                <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>{t.home.shopMoreFor100}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>{t.common.locked}</Text>
            </View>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

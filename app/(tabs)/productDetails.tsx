import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { addProduct, decrementQuantity, incrementQuantity } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { GroceryProduct } from '../../components/productCard';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

// High-Fidelity Exact Zepto Design Spec Tokens
const ZEPTO_PURPLE = '#3c1053';
const ZEPTO_PINK = '#ff3269';
const ZEPTO_TEXT_DARK = '#1c1c24';
const ZEPTO_TEXT_MUTED = '#8b8ba0';
const ZEPTO_BORDER_LIGHT = '#eaeaf2';

// Safe Layout Grid Constrained Space Variables
const PADDING_HORIZONTAL = 16;
const CONTAINER_WIDTH = width - PADDING_HORIZONTAL * 2;
const GAP_SPACE = 12;

// Strict Mathematical State Metric Multipliers
const INITIAL_CART_WIDTH = 48; 
const INITIAL_ADD_WIDTH = CONTAINER_WIDTH - INITIAL_CART_WIDTH - GAP_SPACE;

// Perfect 50% / 50% Active Screen Allocation Splitting Formula
const ACTIVE_FINAL_WIDTH = (CONTAINER_WIDTH - GAP_SPACE) / 2;

type ProductWithDetails = Omit<GroceryProduct, 'description'> & { description?: string };

export default function ProductDetails() {
  const router = useRouter();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { productJson } = useLocalSearchParams<{ productJson: string }>();
  const product: ProductWithDetails = JSON.parse(productJson ?? '{}');
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const discountPct =
    product.originalPrice > 0
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartItem = cart.find((p) => p.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Linear layout step timeline to protect against snapping overshoots
  const layoutProgressTimeline = useSharedValue(0);

  useEffect(() => {
    if (currentQuantity > 0) {
      layoutProgressTimeline.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.quad),
      });
    } else {
      layoutProgressTimeline.value = withTiming(0, {
        duration: 200,
        easing: Easing.linear,
      });
    }
  }, [currentQuantity]);

  // Linear Layout Style: Left View Cart banner grows into exactly 50% container space
  const animatedCartButtonStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        layoutProgressTimeline.value,
        [0, 1],
        [INITIAL_CART_WIDTH, ACTIVE_FINAL_WIDTH]
      ),
    };
  });

  // Linear Layout Style: Right Add selection button shrinks down into exactly 50% container space
  const animatedAddButtonContainerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        layoutProgressTimeline.value,
        [0, 1],
        [INITIAL_ADD_WIDTH, ACTIVE_FINAL_WIDTH]
      ),
    };
  });

  // Clean opacity transitions for string items appearing inside expanding panels
  const animatedCartContentOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(layoutProgressTimeline.value, [0.6, 1], [0, 1]),
    };
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Top Navbar Header Component */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={ZEPTO_TEXT_DARK} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightHeaderAction}>
          <Feather name="search" size={22} color={ZEPTO_TEXT_DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Panel Stage Frame */}
        <View style={styles.imageStage}>
          <Image
            resizeMode="contain"
            style={[styles.mainProductImage, product.stock <= 0 && styles.dimmedStockImage]}
            source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' }}
          />
          {discountPct > 0 && (
            <View style={styles.floatingDiscountBadge}>
              <Text style={styles.floatingDiscountText}>{discountPct}% OFF</Text>
            </View>
          )}
        </View>

        {/* Brand Information Layout Block */}
        <View style={styles.infoMetaBlock}>
          {/* <Text style={styles.brandTitleTag}>Fresh Essentials</Text> */}
          <Text style={styles.mainProductName}>{product.name}</Text>
          
          {product.brand && !['generic', 'n/a', 'na', 'none', 'unknown'].includes(product.brand.toLowerCase()) ? (
            <TouchableOpacity
              style={styles.brandLinkRow}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/brandProducts' as any,
                  params: { brand: product.brand },
                })
              }
            >
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.brandLogoThumb}
                resizeMode="contain"
              />
              <Text style={styles.brandLinkText}>View all {product.brand} products</Text>
              <Ionicons name="chevron-forward" size={16} color="#888" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ) : null}

          <Text style={styles.productMeasurementUnit}>{product.weight || '1 unit'}</Text>
          
          {/* <View style={styles.horizontalSectionDivider} /> */}

          {/* STANDALONE BODY PRICE DOMAIN: Anchored perfectly in the content feed scroll layer */}
          <View style={styles.staticPriceDisplayRow}>
            <View style={styles.primaryPriceDisplayRow}>
              <Text style={styles.currencySymbolMark}>₹</Text>
              <Text style={styles.actualPriceNumber}>{product.price}</Text>
              {product.originalPrice > product.price && (
                <Text style={styles.crossedOriginalPrice}>₹{product.originalPrice}</Text>
              )}
            </View>
            <Text style={styles.taxDisclaimerHint}>Inclusive of all taxes</Text>
          </View>

          {/* Express Delivery ETA Strip */}
          {/* <View style={styles.expressDeliveryBar}>
            <Ionicons name="flash" size={16} color="#ffb300" />
            <Text style={styles.expressDeliveryBarText}>
              Delivering to you in <Text style={styles.boldWeightHighlight}>10 mins</Text>
            </Text>
          </View> */}

          {/* Detailed Product Specifications */}
          <View style={styles.productInformationAccordion}>
            <Text style={styles.accordionHeadingTitle}>Product Details</Text>
            <Text style={styles.accordionBodyText}>
              {product.description || 'Fresh stock sourced directly from verified regional fulfillment distribution clusters under temperature-regulated transport profiles.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* PERSISTENT FLUID WHITE BOTTOM PANEL DOCK CONTAINER */}
      <View style={[styles.fixedPersistentBottomDock, { paddingBottom: bottomInset + 12 }]}>
        <View style={styles.internalDockFlexRow}>
          
          {/* COMPONENT 1 (LEFT): White View Cart Button */}
          <Animated.View style={[styles.purpleCartButtonWrapper, animatedCartButtonStyle]}>
            <TouchableOpacity
              style={styles.capsuleTouchSurface}
              activeOpacity={totalCartCount > 0 ? 0.9 : 1}
              onPress={() => totalCartCount > 0 && router.push('/(tabs)/cart' as any)}
            >
              <View style={styles.capsuleLeftBasketInfo}>
                <View style={styles.footerBasketBadgeFrame}>
                  <Ionicons name="cart-outline" size={22} color={ZEPTO_TEXT_DARK} />
                  {totalCartCount > 0 && (
                    <View style={styles.basketBadgeCountBubble}>
                      <Text style={styles.basketBadgeCountBubbleText}>{totalCartCount}</Text>
                    </View>
                  )}
                </View>

                {currentQuantity > 0 && (
                  <Animated.View style={[styles.capsulePriceTextStack, animatedCartContentOpacityStyle]}>
                    <Text style={styles.viewCartActionText}>View Cart</Text>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* COMPONENT 2 (RIGHT): ADD Trigger / Stepper Control Matrix Block (Fitted to take 50% Space on active) */}
          <Animated.View style={[styles.rightActionButtonSqueezeTarget, animatedAddButtonContainerStyle]}>
            {currentQuantity > 0 ? (
              <View style={styles.activeQuantityController}>
                <TouchableOpacity
                  style={styles.quantityStepTouch}
                  onPress={() => dispatch(decrementQuantity(product))}
                >
                  <AntDesign name="minus" size={14} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.quantityDisplayDigit}>{currentQuantity}</Text>
                <TouchableOpacity
                  style={styles.quantityStepTouch}
                  onPress={() => {
                    if (cartItem && cartItem.quantity >= product.stock) {
                      Toast.show({ type: 'error', text1: 'Stock limit reached' });
                      return;
                    }
                    dispatch(incrementQuantity(product));
                  }}
                >
                  <AntDesign name="plus" size={14} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : product.stock <= 0 ? (
              <View style={styles.outOfStockBadgeLabel}>
                <Text style={styles.outOfStockBadgeLabelText}>Out of Stock</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.cleanZeptoAddButton}
                activeOpacity={0.85}
                onPress={() => dispatch(addProduct(product))}
              >
                <Text style={styles.cleanZeptoAddButtonText}>Add to cart</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f6',
  },
  backButton: {
    padding: 4,
  },
  rightHeaderAction: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageStage: {
    width: width,
    height: width * 0.88,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 32,
  },
  mainProductImage: {
    width: '100%',
    height: '100%',
  },
  dimmedStockImage: {
    opacity: 0.35,
  },
  floatingDiscountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#2252e3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  floatingDiscountText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  infoMetaBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },
  brandTitleTag: {
    fontSize: 11,
    fontWeight: '800',
    color: ZEPTO_PINK,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  mainProductName: {
    fontSize: 22,
    fontWeight: '800',
    color: ZEPTO_TEXT_DARK,
    lineHeight: 28,
  },
  brandLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ZEPTO_BORDER_LIGHT,
    gap: 10,
  },
  brandLogoThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  brandLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: ZEPTO_TEXT_DARK,
    flex: 1,
  },
  productMeasurementUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: ZEPTO_TEXT_MUTED,
    marginTop: 12,
  },
  horizontalSectionDivider: {
    height: 1,
    backgroundColor: ZEPTO_BORDER_LIGHT,
    marginVertical: 16,
  },
  staticPriceDisplayRow: {
    marginBottom: 0,
  },
  primaryPriceDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbolMark: {
    fontSize: 14,
    fontWeight: '900',
    color: ZEPTO_TEXT_DARK,
    marginRight: 1,
  },
  actualPriceNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: ZEPTO_TEXT_DARK,
  },
  crossedOriginalPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: ZEPTO_TEXT_MUTED,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  taxDisclaimerHint: {
    fontSize: 11,
    fontWeight: '600',
    color: ZEPTO_TEXT_MUTED,
    marginTop: 1,
  },
  expressDeliveryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f5fa',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e8e9f3',
  },
  expressDeliveryBarText: {
    fontSize: 12,
    color: ZEPTO_PURPLE,
    fontWeight: '600',
    marginLeft: 6,
  },
  boldWeightHighlight: {
    fontWeight: '900',
  },
  productInformationAccordion: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: ZEPTO_BORDER_LIGHT,
    paddingTop: 16,
  },
  accordionHeadingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ZEPTO_TEXT_DARK,
    marginBottom: 6,
  },
  accordionBodyText: {
    fontSize: 13,
    color: '#4f4f62',
    lineHeight: 18,
    fontWeight: '500',
  },
  fixedPersistentBottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f4',
    paddingTop: 12,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  internalDockFlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 48,
  },
  purpleCartButtonWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ZEPTO_BORDER_LIGHT,
    height: 48,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  capsuleTouchSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
  },
  capsuleLeftBasketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBasketBadgeFrame: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  basketBadgeCountBubble: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: ZEPTO_PINK,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  basketBadgeCountBubbleText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  capsulePriceTextStack: {
    justifyContent: 'center',
    marginLeft: 14,
  },
  capsuleMainPriceValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  capsuleSubtextLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  capsuleRightLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartActionText: {
    color: ZEPTO_TEXT_DARK,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  rightActionButtonSqueezeTarget: {
    height: 48,
    justifyContent: 'center',
  },
  cleanZeptoAddButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: ZEPTO_PINK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cleanZeptoAddButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  activeQuantityController: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: ZEPTO_PINK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  quantityStepTouch: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplayDigit: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  outOfStockBadgeLabel: {
    backgroundColor: '#f3f3f6',
    borderRadius: 8,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadgeLabelText: {
    color: ZEPTO_TEXT_MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
});
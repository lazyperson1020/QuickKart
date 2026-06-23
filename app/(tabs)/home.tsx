import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions, Image, RefreshControl } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  runOnJS
} from "react-native-reanimated";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase";
import CategoryRecycler from "../../components/CategoryRecycler";
import { styles } from "../../styles/home";
import useLocation from "../../components/useLocation";
import ProductCard, { GroceryProduct } from "../../components/productCard";
import { RootState } from "../redux/store";
import BannerRail from './banners';
import ProductRail from '../../components/ProductRail';
import SeeAllButton from "../../components/SeeAllButton";
import BottomSheet from "../../components/BottomSheet";
import { useSinglePress } from "../../hooks/useSinglePress";

// Type-safe layout variables
import { globalLayoutScrollY, globalBottomBarVisible, TAB_BAR_RAW_HEIGHT } from "./_layout";

const { width, height: screenHeight } = Dimensions.get("window");
const CARD_WIDTH_3 = Math.floor((width - 32) / 3) - 5;

const METADATA_HEIGHT = 56;  
const SEARCH_BAR_HEIGHT = 54; 
const COLLAPSE_THRESHOLD = 56; 

const ZEPTO_SPRING_CONFIG = {
  damping: 15,
  stiffness: 130,
  mass: 0.5
};

interface GroupedProducts {
  [key: string]: GroceryProduct[];
}

export default function Home() {
  const { address: gpsAddress, permissionStatus, openSettings, requestLocationAccess } = useLocation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cart = useSelector((state: RootState) => state.cart);
  const reduxSelectedAddress = useSelector((state: RootState) => state.address.selected);

  const displayAddress = reduxSelectedAddress
    ? `${reduxSelectedAddress.label} • ${reduxSelectedAddress.address}`
    : permissionStatus === 'denied' ? "Location unavailable" : gpsAddress;
  const showEnableButton = !reduxSelectedAddress && (permissionStatus === 'denied' || permissionStatus === 'undetermined');
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const FULL_BAR_WIDTH = width - 24;
  const CART_SECTION_WIDTH = 128;
  const cartBarProgress = useSharedValue(cartCount > 0 ? 1 : 0);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // FIXED: Moved categories array state to top level safely
  const [categories, setCategories] = useState<string[]>(["Dairy", "Fresh", "Snacks", "Electronics", "Drinks"]);
  
  // Internal location reference hook channel 
  const lastOffset = useSharedValue(0);

  useEffect(() => {
    const fetchFirestoreProducts = async () => {
      if (!refreshing) setLoading(true); setFetchError(null);
      try {
        let fetchedItems: GroceryProduct[] = [];
        let activeCategoriesOrder = [...categories];

        if (selectedCategory === "All") {
          try {
            // FIXED: Inline backend fetch and JavaScript sorting block sequence
            const snap = await getDocs(collection(db, "categoryPriority"));
            if (!snap.empty) {
              const ordered = snap.docs
                .map(d => ({ id: d.id, ...(d.data() as { priority: number }) }))
                .sort((a, b) => a.priority - b.priority);
              
              const sortedIds = ordered.map(c => c.id);
              if (sortedIds.length > 0) {
                activeCategoriesOrder = sortedIds;
                setCategories(sortedIds); // Synchronizes structural category changes back up safely
              }
            }
          } catch (err) {
            console.warn("Using offline default array ordering rules:", err);
          }

          const snapshots = await Promise.all(
            activeCategoriesOrder.map(cat => getDocs(collection(db, "products", cat, `${cat}Collection`)))
          );
          
          snapshots.forEach((currentSnapshot, index) => {
            const currentCatName = activeCategoriesOrder[index];
            currentSnapshot.forEach((doc) => {
              const data = doc.data(); 
              fetchedItems.push({ 
                id: doc.id, 
                ...data, 
                category: data?.category ?? currentCatName,
                subCategory: data?.subCategory ?? "Essentials",
                stock: data?.stock !== undefined ? Number(data.stock) : 0 
              } as unknown as GroceryProduct);
            });
          });
        } else {
          const snapshot = await getDocs(collection(db, "products", selectedCategory, `${selectedCategory}Collection`));
          snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedItems.push({ 
              id: doc.id, 
              ...data,
              category: selectedCategory,
              subCategory: data?.subCategory ?? "Specials",
              stock: data?.stock !== undefined ? Number(data.stock) : 0
            } as unknown as GroceryProduct);
          });
        }
        setProducts(fetchedItems.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
      } catch (error: any) { 
        console.error("Firestore Fetch Error:", error); 
        setFetchError(error?.message ?? "Failed to load products."); 
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchFirestoreProducts();
  }, [selectedCategory, refreshKey]);
  
  const categoryGroupedSections = useMemo(() => {
    const groups: GroupedProducts = {};
    
    // Initialize groups based on the fetched database IDs (e.g., "Fresh", "Dairy")
    categories.forEach(cat => {
      groups[cat] = [];
    });

    products.forEach(product => {
      const productCat = product.category ?? "Miscellaneous";
      
      // Look for a case-insensitive match inside your predefined groups
      const matchedKey = Object.keys(groups).find(
        key => key.toLowerCase() === productCat.toLowerCase()
      );

      if (matchedKey) {
        groups[matchedKey].push(product);
      } else {
        // Fallback catch-all for unmatched items
        if (!groups[productCat]) groups[productCat] = [];
        groups[productCat].push(product);
      }
    });

    // Clean out groups that are completely unpopulated
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [products, categories]);

  const subCategoryGroupedSections = useMemo(() => {
    const groups: GroupedProducts = {};
    products.forEach(product => {
      const extendedProduct = product as GroceryProduct & { subCategory?: string };
      const sectionKey = extendedProduct.subCategory ?? "Specials";
      if (!groups[sectionKey]) groups[sectionKey] = [];
      groups[sectionKey].push(product);
    });
    return groups;
  }, [products]);

  const handleProductPress = useSinglePress((product: GroceryProduct) => router.push({ pathname: "/(tabs)/productDetails", params: { productJson: JSON.stringify(product) } }));
  const goToAddressList = useSinglePress(() => router.push("/(tabs)/address/addressList" as any));
  const goToProfile = useSinglePress(() => router.push("/(tabs)/profile/profilePage" as any));
  const goToSearch = useSinglePress(() => router.push("/(tabs)/search/results" as any));
  const goToCart = useSinglePress(() => router.push('/(tabs)/cart' as any));

  /* ==================== ADVANCED DIRECTIONAL NAVIGATION LOGIC ==================== */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;
      globalLayoutScrollY.value = currentOffset;

      const delta = currentOffset - lastOffset.value;

      if (currentOffset <= 15) {
        globalBottomBarVisible.value = withSpring(1, ZEPTO_SPRING_CONFIG);
      } 
      else if (delta > 2.0 && currentOffset > 50) {
        globalBottomBarVisible.value = withSpring(0, ZEPTO_SPRING_CONFIG);
      } 
      else if (delta < -2.0) {
        globalBottomBarVisible.value = withSpring(1, ZEPTO_SPRING_CONFIG);
      }

      lastOffset.value = currentOffset;
    },
    onEndDrag: () => {},
    onMomentumEnd: (event) => {
      if (event.contentOffset.y > 400) {
        runOnJS(setShowBackToTop)(true);
      } else {
        runOnJS(setShowBackToTop)(false);
      }
    },
    onBeginDrag: () => {
      runOnJS(setShowBackToTop)(false);
    }
  });

  const useMetadataCollapseStyle = useAnimatedStyle(() => {
    const currentHeight = interpolate(globalLayoutScrollY.value, [0, COLLAPSE_THRESHOLD], [METADATA_HEIGHT, 0], Extrapolate.CLAMP);
    const opacity = interpolate(globalLayoutScrollY.value, [0, COLLAPSE_THRESHOLD * 0.4], [1, 0], Extrapolate.CLAMP);
    return {
      height: currentHeight,
      opacity: opacity,
    };
  });

  const useFloatingCartShiftStyle = useAnimatedStyle(() => {
    const hiddenTravelDistance = TAB_BAR_RAW_HEIGHT;
    
    const translateY = interpolate(
      globalBottomBarVisible.value,
      [0, 1],
      [hiddenTravelDistance, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });
  /* =========================================================================== */

  const useBackToTopAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(showBackToTop ? 0 : -100, { duration: 250 }) }],
      opacity: withTiming(showBackToTop ? 1 : 0, { duration: 200 })
    };
  });

  useEffect(() => {
    cartBarProgress.value = withSpring(cartCount > 0 ? 1 : 0, { damping: 18, stiffness: 180 });
  }, [cartCount]);

  const darkSectionAnimStyle = useAnimatedStyle(() => ({
    width: interpolate(cartBarProgress.value, [0, 1], [FULL_BAR_WIDTH, FULL_BAR_WIDTH - CART_SECTION_WIDTH - 8], Extrapolate.CLAMP),
  }));

  const cartSectionAnimStyle = useAnimatedStyle(() => ({
    width: interpolate(cartBarProgress.value, [0, 1], [0, CART_SECTION_WIDTH], Extrapolate.CLAMP),
    opacity: interpolate(cartBarProgress.value, [0, 0.25], [0, 1], Extrapolate.CLAMP),
  }));

  const topBarStaticPadding = insets.top + METADATA_HEIGHT + SEARCH_BAR_HEIGHT + 95;
  const calculatedDeviceBottomOffset = TAB_BAR_RAW_HEIGHT + insets.bottom + 6;

  return (
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    
    <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

    <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "#fff", paddingTop: insets.top }}>
      
      <Animated.View style={[{ paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", overflow: "hidden" }, useMetadataCollapseStyle]}>
        <View style={{ flex: 1, paddingRight: 10, justifyContent: "center", height: METADATA_HEIGHT }}>
          <Text style={{ fontSize: 22, fontWeight: "900", color: "#3c1053", letterSpacing: -0.5 }}>⚡ 7 minutes</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <TouchableOpacity onPress={goToAddressList} activeOpacity={0.7} style={{ flexDirection: "row", alignItems: "center" }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ flexShrink: 1, maxWidth: 160, color: "#4B5563", fontSize: 13 }}>
                {reduxSelectedAddress ? (
                  <>
                    <Text style={{ fontWeight: "700" }}>{reduxSelectedAddress.label}</Text>
                    {` - ${reduxSelectedAddress.address}`}
                  </>
                ) : (
                  displayAddress
                )}
              </Text>
              <Ionicons name="chevron-down" size={13} color="#6B7280" style={{ marginLeft: 3 }} />
            </TouchableOpacity>
            {showEnableButton && (
              <TouchableOpacity onPress={openSettings} activeOpacity={0.75} style={{ flexDirection: "row", alignItems: "center", marginLeft: 8, backgroundColor: "#F3E8FF", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: "#D8B4FE" }}>
                <Ionicons name="settings-outline" size={11} color="#7C3AED" style={{ marginRight: 3 }} />
                <Text style={{ color: "#7C3AED", fontSize: 11, fontWeight: "700" }}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={goToProfile} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }} activeOpacity={0.8}>
          <Ionicons name="person-circle" size={32}  />
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: SEARCH_BAR_HEIGHT, justifyContent: "center" }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 14, height: 44, marginHorizontal: 16, borderWidth: 1, borderColor: "#E5E7EB" }} onPress={goToSearch} activeOpacity={0.9}>
          <Text style={{ fontSize: 15, color: "#6B7280", marginRight: 8 }}>🔍</Text>
          <Text style={{ color: "#9CA3AF", fontSize: 14, fontWeight: "500" }}>Search for milk, fruits, veggies...</Text>
        </TouchableOpacity>
      </View>
      
      <CategoryRecycler selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} scrollY={globalLayoutScrollY} />
    </View>

      <Animated.View style={[{ position: "absolute", top: insets.top + SEARCH_BAR_HEIGHT + 60, alignSelf: "center", zIndex: 20 }, useBackToTopAnimation]}>
        <TouchableOpacity 
          onPress={() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            setShowBackToTop(false);
          }}
          activeOpacity={0.9} 
          style={{ backgroundColor: "#111827", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, flexDirection: "row", alignItems: "center", elevation: 5 }}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Back to top ↑</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); setRefreshKey(k => k + 1); }}
            colors={["#35035C"]}
            tintColor="#35035C"
            progressViewOffset={topBarStaticPadding}
          />
        }
        contentContainerStyle={{ 
          paddingTop: topBarStaticPadding + 16, 
          paddingBottom: 0,
          backgroundColor: "#fff" 
        }}
      >
        <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}>
          <BannerRail />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#35035C" style={{ marginVertical: 60 }} />
        ) : fetchError ? (
          <Text style={{ textAlign: 'center', color: '#DC2626', marginVertical: 40, fontSize: 14, paddingHorizontal: 20 }}>{fetchError}</Text>
        ) : products.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666', marginVertical: 40, fontSize: 14 }}>No products available yet!</Text>
        ) : selectedCategory === "All" ? (

          <View>
            <View style={{ marginBottom: 8 }}>
              <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                  Handpicked Daily Essentials
                </Text>
              </View>
              <View style={{ paddingHorizontal: 8 }}>
                <ProductRail products={products} onProductPress={handleProductPress} rows={2} />
              </View>
            </View>

            {Object.keys(categoryGroupedSections).map((categoryName) => (
              <View key={categoryName} style={{ marginBottom: 10 }}>

                <View style={{ paddingHorizontal: 16, marginTop: 14, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                    {categoryName}
                  </Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/categoryProducts' as any, params: { category: categoryName } })} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#35035C' }}>See all ›</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, justifyContent: "space-between" }}>
                  {categoryGroupedSections[categoryName].slice(0, 6).map((product) => (
                    <TouchableOpacity key={product.id} style={{ width: CARD_WIDTH_3, marginBottom: 10 }} onPress={() => handleProductPress(product)} activeOpacity={0.8}>
                      <ProductCard product={product} cardWidth={CARD_WIDTH_3} />
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            ))}
          </View>
        ) : (
          <View>
            {Object.keys(subCategoryGroupedSections).map((subSectionName) => (
              <View key={subSectionName} style={{ marginBottom: 8, marginTop: 4 }}>

                <View style={{ paddingHorizontal: 16, marginTop: 10, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                    {subSectionName}
                  </Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/categoryProducts' as any, params: { category: selectedCategory, subCategory: subSectionName } })} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#35035C' }}>See all ›</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 8 }}>
                  <ProductRail 
                    products={subCategoryGroupedSections[subSectionName]} 
                    onProductPress={handleProductPress} 
                    rows={2} 
                  />
                </View>

              </View>
            ))}
          </View>
        )}

        <Image
          source={require('../../assets/footerImages/homefooter.png')}
          style={{ width, height: screenHeight * 0.55, marginTop: 8 }}
          resizeMode="cover"
        />
      </Animated.ScrollView>

      <Animated.View style={[{ position: 'absolute', bottom: calculatedDeviceBottomOffset, left: 12, right: 12, zIndex: 30, paddingTop: 28 }, useFloatingCartShiftStyle]}>
        <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8 }}>

          <Animated.View style={[darkSectionAnimStyle, { height: 52, borderRadius: 16, overflow: 'visible' }]}>
            <TouchableOpacity
              onPress={() => setShowOffers(true)}
              activeOpacity={0.8}
              style={{ position: 'absolute', top: -30, left: 0, right: 0, alignItems: 'center', zIndex: 10 }}
            >
              <View style={{ backgroundColor: '#423f3f', paddingHorizontal: 16, paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.3 }}>Offers  ↑</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1, backgroundColor: '#423f3f', borderRadius: 16, overflow: 'hidden', elevation: 6}}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }} numberOfLines={1}>
                    Unlock free delivery
                  </Text>
                  <Text style={{ color: '#AAA', fontSize: 11, marginTop: 1 }} numberOfLines={1}>
                    {cartTotal >= 99 ? ' Free delivery unlocked!' : `Shop ₹${99 - cartTotal} more`}
                  </Text>
                </View>
              </View>
              <View style={{ height: 2, backgroundColor: '#2A2A2A', marginHorizontal: 12, marginBottom: 6, borderRadius: 1 }}>
                <View style={{
                  height: 2, borderRadius: 1,
                  width: `${Math.min((cartTotal / 99) * 100, 100)}%`,
                  backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#e91e63',
                }} />
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[
            cartSectionAnimStyle,
            { height: 52, borderRadius: 16, overflow: 'hidden',
              shadowColor: '#e91e63', shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.4, shadowRadius: 6, elevation: 6 },
          ]}>
            <TouchableOpacity
              onPress={goToCart}
              style={{ flex: 1, backgroundColor: '#e91e63', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10, gap: 8 }}
              activeOpacity={0.9}
            >
              {cart[cart.length - 1]?.imageUrl ? (
                <View>
                  <Image
                    source={{ uri: cart[cart.length - 1].imageUrl }}
                    style={{ width: 32, height: 32, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' }}
                    resizeMode="cover"
                  />
                  <View style={{ position: 'absolute', top: -5, right: -5, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, borderWidth: 1.5, borderColor: '#e91e63' }}>
                    <Text style={{ fontSize: 9, fontWeight: '900', color: '#e91e63', lineHeight: 12 }}>{cartCount}</Text>
                  </View>
                </View>
              ) : null}
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, lineHeight: 17 }}>Cart</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 14 }}>
                  {cartCount} item{cartCount !== 1 ? 's' : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </Animated.View>

      <BottomSheet visible={showOffers} onClose={() => setShowOffers(false)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111' }}>Offers For You</Text>
          <View style={{ backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#555' }}>3 offers</Text>
          </View>
        </View>

        <View style={{ borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: cartTotal >= 99 ? '#4CAF50' : '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: cartTotal >= 99 ? '#E8F5E9' : '#FAFAFA', padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 22 }}>🚚</Text>
                <View>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>Free Delivery</Text>
                  <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                    {cartTotal >= 99 ? 'Unlocked on this order!' : `Add ₹${99 - cartTotal} more to unlock`}
                  </Text>
                </View>
              </View>
              <View style={{ backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>{cartTotal >= 99 ? 'Unlocked' : 'Locked'}</Text>
              </View>
            </View>
            <View style={{ height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginTop: 12 }}>
              <View style={{ height: 4, borderRadius: 2, width: `${Math.min((cartTotal / 99) * 100, 100)}%`, backgroundColor: cartTotal >= 99 ? '#4CAF50' : '#e91e63' }} />
            </View>
          </View>
        </View>

        <View style={{ borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🏷️</Text>
              <View>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>₹50 OFF</Text>
                <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>Shop for ₹599 more to apply</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>Locked</Text>
            </View>
          </View>
        </View>

        <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' }}>
          <View style={{ backgroundColor: '#FAFAFA', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 22 }}>🎁</Text>
              <View>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#111' }}>₹100 OFF</Text>
                <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>Shop for ₹1199 more to apply</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>Locked</Text>
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
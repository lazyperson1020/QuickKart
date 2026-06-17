// import React, { useState, useEffect, useRef } from "react";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
// import Animated, { 
//   useSharedValue, 
//   useAnimatedStyle, 
//   interpolate, 
//   Extrapolate,
//   useAnimatedScrollHandler,
//   withTiming,
//   runOnJS
// } from "react-native-reanimated";
// import { collection, getDocs } from "firebase/firestore";
// import { useRouter } from "expo-router";
// import { useSelector } from "react-redux";
// import { auth, db } from "../../firebase";
// import CategoryRecycler from "../../components/CategoryRecycler";
// import { styles } from "../../styles/home";
// import useLocation from "../../components/useLocation";
// import { GroceryProduct } from "../../components/productCard";
// import { RootState } from "../redux/store";
// import BannerRail from './banners';
// import ProductRail from '../../components/ProductRail';
// import SeeAllButton from "../../components/SeeAllButton";
// import BottomSheet from "@/components/BottomSheet";

// const METADATA_HEIGHT = 56;  
// const SEARCH_BAR_HEIGHT = 54; 
// const COLLAPSE_THRESHOLD = 65; 

// export default function Home() {
//   const { errorMsg, address } = useLocation();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
  
//   const cart = useSelector((state: RootState) => state.cart);
//   const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [products, setProducts] = useState<GroceryProduct[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [showOffers, setShowOffers] = useState(false);
  
//   // Reanimated Core Shared Drivers
//   const scrollRef = useRef<Animated.ScrollView>(null);
//   const scrollY = useSharedValue(0);
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   const CART_BUTTON_HEIGHT = 52;

//   useEffect(() => {
//     const fetchFirestoreProducts = async () => {
//       setLoading(true); setFetchError(null);
//       try {
//         let fetchedItems: GroceryProduct[] = [];
//         if (selectedCategory === "All") {
//           const categories = ["Dairy", "Fresh", "Snacks", "Electronics"];
//           const snapshots = await Promise.all(categories.map(cat => getDocs(collection(db, "products", cat, `${cat}Collection`))));
//           snapshots.forEach((snapshot) => snapshot.forEach((doc) => fetchedItems.push({ id: doc.id, ...doc.data(), stock: doc.data().stock !== undefined ? Number(doc.data().stock) : 0 } as GroceryProduct)));
//         } else {
//           const snapshot = await getDocs(collection(db, "products", selectedCategory, `${selectedCategory}Collection`));
//           snapshot.forEach((doc) => fetchedItems.push({ id: doc.id, ...doc.data() } as GroceryProduct));
//         }
//         setProducts(fetchedItems.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
//       } catch (error: any) { 
//         console.error("Firestore Fetch Error:", error); 
//         setFetchError(error?.message ?? "Failed to load products."); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
//     fetchFirestoreProducts();
//   }, [selectedCategory]);

//   const handleProductPress = (product: GroceryProduct) => router.push({ pathname: "/(tabs)/productDetails", params: { productJson: JSON.stringify(product) } });

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollY.value = event.contentOffset.y;
//     },
//     onMomentumEnd: (event) => {
//       if (event.contentOffset.y > 400) {
//         runOnJS(setShowBackToTop)(true);
//       } else {
//         runOnJS(setShowBackToTop)(false);
//       }
//     },
//     onBeginDrag: () => {
//       runOnJS(setShowBackToTop)(false);
//     }
//   });

//   // Moves the outer wrapper view container up to neatly clear the metadata block height
//   const animatedHeaderContainerStyle = useAnimatedStyle(() => {
//     const translateY = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [0, -COLLAPSE_THRESHOLD], Extrapolate.CLAMP);
//     return { transform: [{ translateY }] };
//   });

//   // Completely dissolves delivery tracking info labels early on scroll
//   const animatedMetadataStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD * 0.4], [1, 0], Extrapolate.CLAMP);
//     return { opacity };
//   });

//   const animatedBackToTopStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: withTiming(showBackToTop ? 0 : -100, { duration: 250 }) }],
//       opacity: withTiming(showBackToTop ? 1 : 0, { duration: 200 })
//     };
//   });

//   // Computes absolute spacing constraints to lay items cleanly flat without overlaps
//   const topBarStaticPadding = insets.top + METADATA_HEIGHT + SEARCH_BAR_HEIGHT + 95;

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar backgroundColor="#35035C" barStyle="light-content" />

//       {/* MASTER FLOATING NAVIGATION CONTROLLER DECK */}
//       <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "#fff" }, animatedHeaderContainerStyle]}>
        
//         {/* 1. INTERACTIVE DELIVERY LOCATION INFO BANNER */}
//         <Animated.View style={[{ paddingHorizontal: 16, paddingTop: insets.top + 8, height: insets.top + METADATA_HEIGHT, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, animatedMetadataStyle]}>
//           <View style={{ flex: 1, paddingRight: 10 }}>
//             <Text style={{ fontSize: 22, fontWeight: "900", color: "#000", letterSpacing: -0.5 }}>⚡ 7 minutes</Text>
//             <TouchableOpacity onPress={() => router.push("/(tabs)/address/addressList" as any)} activeOpacity={0.7}>
//               <Text numberOfLines={1} style={{ color: "#4B5563", fontSize: 13, fontWeight: "500", marginTop: 2 }}>
//                 {errorMsg ? errorMsg : `Home • ${address}`}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity onPress={() => router.push("/(tabs)/profile/profilePage" as any)} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" }} activeOpacity={0.8}>
//             <Text style={{ fontSize: 16 }}>👤</Text>
//           </TouchableOpacity>
//         </Animated.View>

//         {/* 2. TRANSLATING SEARCH ENGINE SEARCH FIELD ROW CHIP */}
//         <View style={{ height: SEARCH_BAR_HEIGHT, justifyContent: "center" }}>
//           <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 14, height: 44, marginHorizontal: 16, borderWidth: 1, borderColor: "#E5E7EB" }} onPress={() => router.push("/search")} activeOpacity={0.9}>
//             <Text style={{ fontSize: 15, color: "#6B7280", marginRight: 8 }}>🔍</Text>
//             <Text style={{ color: "#9CA3AF", fontSize: 14, fontWeight: "500" }}>Search for milk, fruits, veggies...</Text>
//           </TouchableOpacity>
//         </View>
        
//         {/* 3. DYNAMIC SCROLL-DRIVEN CATEGORY RAIL SELECTOR PANEL */}
//         <CategoryRecycler 
//           selectedCategory={selectedCategory} 
//           onSelectCategory={setSelectedCategory} 
//           scrollY={scrollY} // Shared value dependency injected safely here
//         />
//       </Animated.View>

//       {/* FLOATING QUICK SCROLL ASSIST OVERLAY PANEL CHIP */}
//       <Animated.View style={[{ position: "absolute", top: insets.top + SEARCH_BAR_HEIGHT + 60, alignSelf: "center", zIndex: 20 }, animatedBackToTopStyle]}>
//         <TouchableOpacity 
//           onPress={() => {
//             scrollRef.current?.scrollTo({ y: 0, animated: true });
//             setShowBackToTop(false);
//           }}
//           activeOpacity={0.9} 
//           style={{ backgroundColor: "#111827", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, flexDirection: "row", alignItems: "center", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 }}
//         >
//           <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Back to top ↑</Text>
//         </TouchableOpacity>
//       </Animated.View>

//       {/* 4. MAIN INTERACTIVE PRODUCT FEED LIST LAYOUT CANVAS WORKSPACE */}
//       <Animated.ScrollView 
//         ref={scrollRef}
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ 
//           paddingTop: topBarStaticPadding + 16, // Clean spacing padding barrier stops cutoffs completely
//           paddingBottom: 180,
//           backgroundColor: "#fff" 
//         }}
//       >
//         {/* Ads Banner Frame Wrapper Carousel */}
//         <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}>
//           <BannerRail />
//         </View>

//         {/* List Section Title */}
//         <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", marginLeft: 16, marginTop: 24, marginBottom: 12, letterSpacing: -0.3 }}>
//           {selectedCategory === "All" ? "Handpicked Daily Essentials" : `${selectedCategory} Specials`}
//         </Text>
        
//         {loading ? (
//           <ActivityIndicator size="large" color="#35035C" style={{ marginVertical: 60 }} />
//         ) : fetchError ? (
//           <Text style={{ textAlign: 'center', color: '#DC2626', marginVertical: 40, fontSize: 14, paddingHorizontal: 20 }}>{fetchError}</Text>
//         ) : products.length === 0 ? (
//           <Text style={{ textAlign: 'center', color: '#666', marginVertical: 40, fontSize: 14 }}>No products available in this category yet!</Text>
//         ) : (
//           <View style={{ paddingHorizontal: 8 }}>
//             <ProductRail products={products} onProductPress={handleProductPress} rows={selectedCategory === 'All' ? 2 : 1} />
//             <SeeAllButton category={selectedCategory} categoryTitle={selectedCategory === "All" ? "All Products" : `${selectedCategory} Specials`} />
//           </View>
//         )}
//       </Animated.ScrollView>

//       {/* FLOATING ACTION BOTTOM Link CONTROLS FOOTER SHEET */}
//       {cartCount > 0 && ( 
//         <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={{ position: 'absolute', bottom: insets.bottom + 16, left: 16, right: 16, backgroundColor: '#35035C', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 6, zIndex: 30 }} activeOpacity={0.95}>
//           <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{cartCount} items · ₹{cartTotal}</Text>
//           <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>View Cart →</Text>
//         </TouchableOpacity> 
//       )}
      
//       <TouchableOpacity onPress={() => setShowOffers(true)} style={{ position: "absolute", bottom: cartCount > 0 ? insets.bottom + 16 + CART_BUTTON_HEIGHT + 14 : insets.bottom + 16, alignSelf: "center", backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, elevation: 5, zIndex: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, borderWidth: 1, borderColor: '#F3F4F6' }} activeOpacity={0.85}>
//         <Text style={{ color: "#E91E63", fontWeight: "800", fontSize: 13, letterSpacing: 0.2 }}>Offers ↑</Text>
//       </TouchableOpacity>

//       <BottomSheet visible={showOffers} onClose={() => setShowOffers(false)}>
//         <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 24 }}>Offers For You</Text>
//         <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ fontWeight: "700", fontSize: 16 }}>Unlock Free Delivery</Text><Text style={{ color: "#666", marginTop: 4 }}>Shop for ₹99</Text></View>
//         <View style={{ backgroundColor: "#1A2233", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ color: "#fff", fontWeight: "700" }}>Unlock ₹50 OFF</Text><Text style={{ color: "#AAB0BB", marginTop: 4 }}>Shop for ₹599 more</Text></View>
//         <View style={{ backgroundColor: "#1A2233", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ color: "#fff", fontWeight: "700" }}>Unlock ₹100 OFF</Text><Text style={{ color: "#AAB0BB", marginTop: 4 }}>Shop for ₹1199 more</Text></View>
//       </BottomSheet>
//     </View>
//   );
// }
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS
} from "react-native-reanimated";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
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
import BottomSheet from "@/components/BottomSheet";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 12) / 2; 

const METADATA_HEIGHT = 56;  
const SEARCH_BAR_HEIGHT = 54; 
const COLLAPSE_THRESHOLD = 65; 

interface GroupedProducts {
  [key: string]: GroceryProduct[];
}

export default function Home() {
  const { errorMsg, address } = useLocation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const cart = useSelector((state: RootState) => state.cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const CART_BUTTON_HEIGHT = 52;

  useEffect(() => {
    const fetchFirestoreProducts = async () => {
      setLoading(true); setFetchError(null);
      try {
        let fetchedItems: GroceryProduct[] = [];
        if (selectedCategory === "All") {
          const categories = ["Dairy", "Fresh", "Snacks", "Electronics"];
          const snapshots = await Promise.all(categories.map(cat => getDocs(collection(db, "products", cat, `${cat}Collection`))));
          
          snapshots.forEach((currentSnapshot, index) => {
            const currentCatName = categories[index];
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
      }
    };
    fetchFirestoreProducts();
  }, [selectedCategory]);
  
  const categoryGroupedSections = useMemo(() => {
    const groups: GroupedProducts = {};
    products.forEach(product => {
      const sectionKey = product.category ?? "Miscellaneous";
      if (!groups[sectionKey]) groups[sectionKey] = [];
      groups[sectionKey].push(product);
    });
    return groups;
  }, [products]);

  // GROUP BY SUBCATEGORY (For focused single Category Tabs)
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

  const handleProductPress = (product: GroceryProduct) => router.push({ pathname: "/(tabs)/productDetails", params: { productJson: JSON.stringify(product) } });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
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

  const useHeaderTransform = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD], [0, -COLLAPSE_THRESHOLD], Extrapolate.CLAMP);
    return { transform: [{ translateY }] };
  });

  const useMetadataOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, COLLAPSE_THRESHOLD * 0.4], [1, 0], Extrapolate.CLAMP);
    return { opacity };
  });

  const useBackToTopAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(showBackToTop ? 0 : -100, { duration: 250 }) }],
      opacity: withTiming(showBackToTop ? 1 : 0, { duration: 200 })
    };
  });

  const triggerTabRedirect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const topBarStaticPadding = insets.top + METADATA_HEIGHT + SEARCH_BAR_HEIGHT + 95;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#35035C" barStyle="light-content" />

      {/* MASTER FLOATING NAVIGATION CONTROLLER DECK */}
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "#fff" }, useHeaderTransform]}>
        <Animated.View style={[{ paddingHorizontal: 16, paddingTop: insets.top + 8, height: insets.top + METADATA_HEIGHT, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, useMetadataOpacity]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: "900", color: "#000", letterSpacing: -0.5 }}>⚡ 7 minutes</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/address/addressList" as any)} activeOpacity={0.7}>
              <Text numberOfLines={1} style={{ color: "#4B5563", fontSize: 13, fontWeight: "500", marginTop: 2 }}>
                {errorMsg ? errorMsg : `Home • ${address}`}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile/profilePage" as any)} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" }} activeOpacity={0.8}>
            <Text style={{ fontSize: 16 }}>👤</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SEARCH_BAR_HEIGHT, justifyContent: "center" }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 14, height: 44, marginHorizontal: 16, borderWidth: 1, borderColor: "#E5E7EB" }} onPress={() => router.push("/search")} activeOpacity={0.9}>
            <Text style={{ fontSize: 15, color: "#6B7280", marginRight: 8 }}>🔍</Text>
            <Text style={{ color: "#9CA3AF", fontSize: 14, fontWeight: "500" }}>Search for milk, fruits, veggies...</Text>
          </TouchableOpacity>
        </View>
        
        <CategoryRecycler selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} scrollY={scrollY} />
      </Animated.View>

      {/* FLOATING ACTION OVERLAY BUTTON */}
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

      {/* MAIN LAYOUT SCROLL CONTENT CONTAINER */}
      <Animated.ScrollView 
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          paddingTop: topBarStaticPadding + 16, 
          paddingBottom: 180,
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
            {/* 1. Persistent Top Level Double Horizontal Product Rail */}
            <View style={{ marginBottom: 12 }}>
              <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 12 }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                  Handpicked Daily Essentials
                </Text>
              </View>
              <View style={{ paddingHorizontal: 8 }}>
                <ProductRail products={products} onProductPress={handleProductPress} rows={2} />
              </View>
            </View>

            {/* 2. Categorized Product Grid Shelves subsequently underneath */}
            {Object.keys(categoryGroupedSections).map((categoryName) => (
              <View key={categoryName} style={{ marginBottom: 20 }}>
                
                <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                    {categoryName}
                  </Text>
                  {/* REDIRECTS TAB SELECTION DYNAMICALLY ON CLICK */}
                  <TouchableOpacity onPress={() => triggerTabRedirect(categoryName)} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#35035C' }}>See all ›</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* CRITICAL: ONLY SHOWS MAXIMUM 4 ITEMS FROM THE ARRAY SUBSET SELECTION */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, justifyContent: "space-between" }}>
                  {categoryGroupedSections[categoryName].slice(0, 4).map((product) => (
                    <TouchableOpacity key={product.id} style={{ width: CARD_WIDTH, marginBottom: 16 }} onPress={() => handleProductPress(product)} activeOpacity={0.8}>
                      <ProductCard product={product} />
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            ))}
          </View>
        ) : (
          <View>
            {Object.keys(subCategoryGroupedSections).map((subSectionName) => (
              <View key={subSectionName} style={{ marginBottom: 16, marginTop: 8 }}>
                
                <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.4 }}>
                    {subSectionName}
                  </Text>
                </View>

                {/* STRICTLY RNDERS ONLY SINGLE UNIFIED DOUBLE HORIZONTAL RAIL ON SPECIFIC CATEGORIES */}
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
      </Animated.ScrollView>

      {/* SHOPPING BOTTOM CART MODAL LINK PANEL */}
      {cartCount > 0 && ( 
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={{ position: 'absolute', bottom: insets.bottom + 16, left: 16, right: 16, backgroundColor: '#35035C', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 6, zIndex: 30 }} activeOpacity={0.95}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{cartCount} items · ₹{cartTotal}</Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>View Cart →</Text>
        </TouchableOpacity> 
      )}
      
      <View pointerEvents="box-none" style={{ position: "absolute", bottom: cartCount > 0 ? insets.bottom + 16 + CART_BUTTON_HEIGHT + 14 : insets.bottom + 16, left: 0, right: 0, alignItems: 'center', zIndex: 25 }}>
        <TouchableOpacity onPress={() => setShowOffers(true)} style={{ backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, borderWidth: 1, borderColor: '#F3F4F6' }} activeOpacity={0.85}>
          <Text style={{ color: "#E91E63", fontWeight: "800", fontSize: 13, letterSpacing: 0.2 }}>Offers ↑</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={showOffers} onClose={() => setShowOffers(false)}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 24 }}>Offers For You</Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ fontWeight: "700", fontSize: 16 }}>Unlock Free Delivery</Text><Text style={{ color: "#666", marginTop: 4 }}>Shop for ₹99</Text></View>
        <View style={{ backgroundColor: "#1A2233", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ color: "#fff", fontWeight: "700" }}>Unlock ₹50 OFF</Text><Text style={{ color: "#AAB0BB", marginTop: 4 }}>Shop for ₹599 more</Text></View>
        <View style={{ backgroundColor: "#1A2233", borderRadius: 16, padding: 16, marginBottom: 12 }}><Text style={{ color: "#fff", fontWeight: "700" }}>Unlock ₹100 OFF</Text><Text style={{ color: "#AAB0BB", marginTop: 4 }}>Shop for ₹1199 more</Text></View>
      </BottomSheet>
    </View>
  );
}
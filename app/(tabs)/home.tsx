import React, { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase";
import CategoryRecycler from "../../components/CategoryRecycler";
import { styles } from "../../styles/home";
import useLocation from "../../components/useLocation";
import ProductCard, { GroceryProduct } from "../../components/productCard";
import { RootState } from "../redux/store";
import BannerRail from './banners';
import SeeAllButton from "../../components/SeeAllButton";
import BottomSheet from "@/components/BottomSheet";

const stores = ["Store1", "Store2", "Store3", "Store4", "Store5", "Store6", "Store7", "Store8"];
export default function Home() {
  const { errorMsg, address } = useLocation();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Manage current selected category context
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const insets = useSafeAreaInsets();
  const CART_BUTTON_HEIGHT = 52;

  useEffect(() => {
  const fetchFirestoreProducts = async () => {
  setLoading(true);
  setFetchError(null);

  try {
    let fetchedItems: GroceryProduct[] = [];

    if (selectedCategory === "All") {
      const categories = [
        "Dairy",
        "Fresh",
        "Snacks",
        "Electronics",
      ];

      for (const category of categories) {
        console.log(`Fetching ${category}...`);

        const snapshot = await getDocs(
          collection(
            db,
            "products",
            category,
            `${category}Collection`
          )
        );

        console.log(
          `${category}: ${snapshot.docs.length} products found`
        );

        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedItems.push({
            id: doc.id,
            ...data,
            stock: data.stock !== undefined ? Number(data.stock) : 0,
          } as GroceryProduct);
        });
      }
    } else {
      console.log(
        `Fetching category: ${selectedCategory}`
      );

      const snapshot = await getDocs(
        collection(
          db,
          "products",
          selectedCategory,
          `${selectedCategory}Collection`
        )
      );

      console.log(
        `${selectedCategory}: ${snapshot.docs.length} products found`
      );

      snapshot.forEach((doc) => {
        fetchedItems.push({
          id: doc.id,
          ...doc.data(),
        } as GroceryProduct);
      });
    }

    // Sort by Excel position
    fetchedItems.sort(
      (a, b) =>
        Number(a.position ?? 999) -
        Number(b.position ?? 999)
    );

    console.log(
      `Total products loaded: ${fetchedItems.length}`
    );

    setProducts(fetchedItems);
  } catch (error: any) {
    console.error(
      "Firestore Fetch Error:",
      error
    );

    setFetchError(
      error?.message ??
        "Failed to load products."
    );
  } finally {
    setLoading(false);
  }

  };

  fetchFirestoreProducts();
}, [selectedCategory]);

  const handleProductPress = (product: GroceryProduct) => {
    router.push({
      pathname: "/(tabs)/productDetails",
      params: { productJson: JSON.stringify(product) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180,
        }}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.deliveryTime}>⚡ 10 minutes</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/address/addressList" as any)}>
              <Text numberOfLines={1} style={styles.address}>
                {errorMsg ? errorMsg : `Home • ${address}`}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity onPress={() => signOut(auth)} style={styles.profileButton}> */}
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile/profilePage" as any)}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* STORE SELECTOR
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storeList}>
          {stores.map((store) => (
            <View key={store} style={styles.storeChip}>
              <Text style={styles.storeChipText}>{store}</Text>
            </View>
          ))}
        </ScrollView> */}

        {/* SEARCH */}
        <TouchableOpacity
  style={styles.searchBar}
  onPress={() => router.push("/search")}
  activeOpacity={0.8}
>
  <Text style={styles.searchIcon}>🔍</Text>

  <Text style={styles.searchPlaceholder}>
    Search for milk, fruits...
  </Text>
</TouchableOpacity>

        {/* CATEGORIES (Passing states down as props) */}
        <CategoryRecycler 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* FEATURED BANNER */}
        <View style={{ marginTop: 20 }}>
          <BannerRail />
        </View>

        {/* DYNAMIC PRODUCTS SECTION FROM FIRESTORE */}
        <Text style={styles.sectionTitle}>
          {selectedCategory === "All" ? "Handpicked Daily Essentials" : `${selectedCategory} Specials`}
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginVertical: 20 }} />
        ) : fetchError ? (
          <Text style={{ textAlign: 'center', color: '#DC2626', marginVertical: 30, fontSize: 14, paddingHorizontal: 20 }}>
            {fetchError}
          </Text>
        ) : products.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666', marginVertical: 30, fontSize: 14 }}>
            No products available in this category yet!
          </Text>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16, paddingBottom: 10 }}
            >
              {products.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleProductPress(item)} activeOpacity={0.85}>
                  <ProductCard product={item} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <SeeAllButton
              category={selectedCategory}
              categoryTitle={
                selectedCategory === "All"
                  ? "All Products"
                  : `${selectedCategory} Specials`
              }
            />
          </>
        )}

      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
          style={{
            position: 'absolute',
            bottom: insets.bottom + 16,
            left: 16,
            right: 16,
            backgroundColor: '#35035C',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 6,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '600',
            }}
          >
            {cartCount} items · ₹{cartTotal}
          </Text>

          <Text
            style={{
              color: '#fff',
              fontWeight: '700',
            }}
          >
            View Cart →
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => setShowOffers(true)}
        style={{
          position: "absolute",
          bottom: cartCount > 0
            ? insets.bottom + 16 + CART_BUTTON_HEIGHT + 8
            : insets.bottom + 16,
          alignSelf: "center",

          backgroundColor: "#fff",

          paddingHorizontal: 20,
          paddingVertical: 8,

          borderRadius: 30,

          elevation: 5,
        }}
      >
        <Text
          style={{
            color: "#E91E63",
            fontWeight: "700",
          }}
        >
          Offers ↑
        </Text>
      </TouchableOpacity>
      <BottomSheet
  visible={showOffers}
  onClose={() => setShowOffers(false)}
>
  <Text
    style={{
      color: "#fff",
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 24,
    }}
  >
    Offers For You
  </Text>

  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <Text
      style={{
        fontWeight: "700",
        fontSize: 16,
      }}
    >
      Unlock Free Delivery
    </Text>

    <Text
      style={{
        color: "#666",
        marginTop: 4,
      }}
    >
      Shop for ₹99
    </Text>
  </View>

  <View
    style={{
      backgroundColor: "#1A2233",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "700",
      }}
    >
      Unlock ₹50 OFF
    </Text>

    <Text
      style={{
        color: "#AAB0BB",
        marginTop: 4,
      }}
    >
      Shop for ₹599 more
    </Text>
  </View>

  <View
    style={{
      backgroundColor: "#1A2233",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "700",
      }}
    >
      Unlock ₹100 OFF
    </Text>

    <Text
      style={{
        color: "#AAB0BB",
        marginTop: 4,
      }}
    >
      Shop for ₹1199 more
    </Text>
  </View>
</BottomSheet>
    </SafeAreaView>
  );
}
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
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

  useEffect(() => {
    const fetchFirestoreProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const productsQuery =
          selectedCategory === "All"
            ? collection(db, "products")
            : query(
                collection(db, "products"),
                // Firestore stores categories lowercase — normalise before comparing
                where("category", "==", selectedCategory.toLowerCase())
              );

        const querySnapshot = await getDocs(productsQuery);
        const fetchedItems: GroceryProduct[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() } as GroceryProduct);
        });
        setProducts(fetchedItems);
      } catch (error: any) {
        setFetchError(error?.message ?? "Failed to load products.");
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
      <ScrollView showsVerticalScrollIndicator={false}>

        
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
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search for milk, fruits...</Text>
        </View>

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
        )}

      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
          style={{
            position: 'absolute',
            bottom: 16,
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
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} · ₹{cartTotal}
          </Text>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
            View Cart →
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
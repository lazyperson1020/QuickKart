import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import CategoryRecycler from "../../components/CategoryRecycler";
import { styles } from "../../styles/home";
import useLocation from "../../components/useLocation";
import ProductCard, { GroceryProduct } from "../../components/productCard";
import { addProduct } from "../redux/cartSlice";
import BannerRail from './banners';
const stores = ["Store1", "Store2", "Store3", "Store4", "Store5", "Store6", "Store7", "Store8"];

export default function Home() {
  const { latitude, longitude, errorMsg, address } = useLocation();
  const router = useRouter();
  const dispatch = useDispatch();

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

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) dispatch(addProduct(product));
  };

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
            <TouchableOpacity onPress={() => console.log("Coordinates clicked: ", latitude, longitude)}>
              <Text numberOfLines={1} style={styles.address}>
                {errorMsg ? errorMsg : `Home • ${address}`}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => signOut(auth)} style={styles.profileButton}>
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
        {/* <View style={styles.bannerRow}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitleLarge}>₹0 FEES</Text>
            <Text style={styles.bannerSubtitle}>Zero delivery fee</Text>
          </View>
          <View style={styles.bannerRight}>
            <Text style={styles.bannerTitleSmall}>LOWEST PRICES</Text>
            <Text style={styles.bannerSubtitle}>Everyday deals</Text>
          </View>
        </View> */}
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
                <ProductCard
                  product={item}
                  onAddPress={handleAddToCart}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
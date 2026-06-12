import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, decrementQuantity, incrementQuantity } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { GroceryProduct } from '../../components/productCard';
import { styles } from '../../styles/productDetails';

type ProductWithDetails = GroceryProduct & { description?: string };

export default function ProductDetails() {
  const { productJson } = useLocalSearchParams<{ productJson: string }>();
  const product: ProductWithDetails = JSON.parse(productJson ?? '{}');
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const discountPct =
    product.originalPrice > 0
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Body product={product} cart={cart} discountPct={discountPct} />
      </ScrollView>
      <Footer product={product} cart={cart} />
    </SafeAreaView>
  );
}

function Header() {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={25} color="#111" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="search-outline" size={25} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

function Body({
  product,
  cart,
  discountPct,
}: {
  product: ProductWithDetails;
  cart: (ProductWithDetails & { quantity: number })[];
  discountPct: number;
}) {
  const dispatch = useDispatch();
  const [descOpen, setDescOpen] = useState(false);

  const cartItem = cart.find((p) => p.id === product.id);

  return (
    <View style={styles.bodyContainer}>
      <Image
        resizeMode="cover"
        style={styles.productImage}
        source={{ uri: product.imageUrl }}
      />
      <View style={styles.productInfoContainer}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <View style={styles.seeAllContainer}>
          <Text style={styles.seeAllText}>{`See all ${product.name} products`}</Text>
          <Ionicons name="chevron-forward-outline" size={17} color="red" />
        </View>
        <Text style={styles.productWeight}>{product.weight}</Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceDetails}>
            <Text style={styles.productPrice}>₹{product.price}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
            {discountPct > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discountPct}% OFF</Text>
              </View>
            )}
          </View>

          {cartItem ? (
            <View style={styles.quantityContainer}>
              <AntDesign
                name="plus-square"
                onPress={() => dispatch(incrementQuantity(product))}
                size={30}
                color="#fff"
              />
              <Text style={styles.quantity}>{cartItem.quantity}</Text>
              <AntDesign
                name="minus-square"
                onPress={() => dispatch(decrementQuantity(product))}
                size={30}
                color="#fff"
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => dispatch(addProduct(product))}
              style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.productDescriptionContainer}
        onPress={() => setDescOpen(!descOpen)}>
        <Text style={styles.productDescriptionTitle}>Product Description</Text>
        <Ionicons
          name={descOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="red"
        />
      </TouchableOpacity>

      {descOpen && product.description ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descText}>{product.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Footer({
  product,
  cart,
}: {
  product: ProductWithDetails;
  cart: (ProductWithDetails & { quantity: number })[];
}) {
  const router = useRouter();
  const inCart = cart.find((p) => p.id === product.id);
  if (!inCart) return null;
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.btnCart}
        onPress={() => router.push('/(tabs)/cart' as any)}>
        <Text style={styles.cartText}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

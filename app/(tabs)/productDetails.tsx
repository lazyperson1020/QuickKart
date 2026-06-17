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
import Toast from 'react-native-toast-message';
type ProductWithDetails = Omit<GroceryProduct, 'description'> & { description?: string };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E9D5FF' }}>
      <StatusBar backgroundColor="#E9D5FF" barStyle="dark-content" />
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
      const showStockToast = () => {
      Toast.show({
        type: 'error',
        text1:
          product.stock <= 0
            ? 'This item is out of stock'
            : `Only ${product.stock} unit(s) available`,
        position: 'bottom',
      });
    };
  return (
    <View style={styles.bodyContainer}>
      <Image
          resizeMode="cover"
          style={[
            styles.productImage,
            product.stock <= 0 && styles.outOfStockImage,
          ]}
          source={{ uri: product.imageUrl }}
        />

        {product.stock <= 0 && (
          <View style={styles.outOfStockBanner}>
            <Text style={styles.outOfStockTitle}>
              Current selection is out of stock
            </Text>

            <Text style={styles.outOfStockSubtitle}>
              Please try changing the selection.
            </Text>
          </View>
        )}
      <View style={styles.productInfoContainer}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <View style={styles.seeAllContainer}>
          <Text style={styles.seeAllText}>{`See all ${product.name} products`}</Text>
          <Ionicons name="chevron-forward-outline" size={17} color="#e91e63" />
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
              <TouchableOpacity
                onPress={() => dispatch(decrementQuantity(product))}
                style={styles.quantityBtn}
                hitSlop={6}
              >
                <AntDesign name="minus" size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{cartItem.quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (cartItem.quantity >= product.stock) {
                    showStockToast();
                    return;
                  }
                  dispatch(incrementQuantity(product));
                }}
                style={styles.quantityBtn}
                hitSlop={6}
              >
                <AntDesign name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            product.stock <= 0 ? (
  <TouchableOpacity
    style={styles.notifyButton}
  >
    <Text style={styles.notifyButtonText}>
      Notify Me
    </Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity
    onPress={() => {
      if (product.stock <= 0) {
        showStockToast();
        return;
      }

      dispatch(addProduct(product));
    }}
    style={styles.addButton}
  >
    <Text style={styles.addButtonText}>
      Add
    </Text>
  </TouchableOpacity>
)
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
          color="#e91e63"
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

  const inCart = cart.find(
    (p) => p.id === product.id
  );

  if (!inCart && product.stock > 0) {
    return null;
  }

  return (
    <View style={styles.footerContainer}>
      {product.stock <= 0 ? (
        <TouchableOpacity
          style={styles.btnCart}
        >
          <Text style={styles.cartText}>
            Notify me when back in stock
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.btnCart}
          onPress={() =>
            router.push('/(tabs)/cart' as any)
          }
        >
          <Text style={styles.cartText}>
            View Cart
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

}

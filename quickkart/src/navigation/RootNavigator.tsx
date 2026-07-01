import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { auth } from '../../firebase.native';
import { setWishlist } from '../redux/wishlistSlice';
import { loadWishlistFromFirestore } from '../utils/wishlistFirestore';
import type { RootStackParamList } from './types';
import BottomTabBar from './BottomTabBar';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Main screens
import HomeScreen from '../screens/home/HomeScreen';
import AllProductsScreen from '../screens/allProducts/AllProductsScreen';
import ProductsScreen from '../screens/allProducts/ProductsScreen';
import CategoryDetailScreen from '../screens/allProducts/CategoryDetailScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import BrandProductsScreen from '../screens/BrandProductsScreen';
import CouponsScreen from '../screens/CouponsScreen';
import BannersScreen from '../screens/BannersScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import PreviousOrdersScreen from '../screens/orders/PreviousOrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderPlacedScreen from '../screens/orders/OrderPlacedScreen';
import SearchScreen from '../screens/search/SearchScreen';
import SearchResultsScreen from '../screens/search/SearchResultsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';
import WishlistScreen from '../screens/profile/WishlistScreen';
import RewardsScreen from '../screens/profile/RewardsScreen';
import PolicyScreen from '../screens/profile/PolicyScreen';
import RefundsScreen from '../screens/profile/RefundsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import GeneralInquiryScreen from '../screens/profile/GeneralInquiryScreen';
import PaymentRelatedScreen from '../screens/profile/PaymentRelatedScreen';
import FeedbackSuggestionsScreen from '../screens/profile/FeedbackSuggestionsScreen';
import OrderProductsRelatedScreen from '../screens/profile/OrderProductsRelatedScreen';
import GiftCardScreen from '../screens/profile/GiftCardScreen';
import NoCostEMIScreen from '../screens/profile/NoCostEMIScreen';
import WalletRelatedScreen from '../screens/profile/WalletRelatedScreen';
import QuickkartClubScreen from '../screens/profile/QuickkartClubScreen';
import ReferralScreen from '../screens/profile/ReferralScreen';
import CocaColaCampaignScreen from '../screens/profile/CocaColaCampaignScreen';
import FaqDetailScreen from '../screens/profile/FaqDetailScreen';
import FaqCategoryScreen from '../screens/profile/FaqCategoryScreen';
import ManagePaymentsScreen from '../screens/profile/ManagePaymentsScreen';
import AddressListScreen from '../screens/address/AddressListScreen';
import AddressAddScreen from '../screens/address/AddressAddScreen';
import AddressEditScreen from '../screens/address/AddressEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        try {
          const items = await loadWishlistFromFirestore(u.uid);
          dispatch(setWishlist(items));
        } catch (e) {
          console.error('Wishlist load error:', e);
        }
      } else {
        dispatch(setWishlist([]));
      }
      setAuthLoading(false);
    });
  }, [dispatch]);

  if (authLoading) return null;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AllProducts" component={AllProductsScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
            <Stack.Screen name="BrandProducts" component={BrandProductsScreen} />
            <Stack.Screen name="Coupons" component={CouponsScreen} />
            <Stack.Screen name="Banners" component={BannersScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="PreviousOrders" component={PreviousOrdersScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
            <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="Policy" component={PolicyScreen} />
            <Stack.Screen name="Refunds" component={RefundsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="FaqCategory" component={FaqCategoryScreen} />
            <Stack.Screen name="GeneralInquiry" component={GeneralInquiryScreen} />
            <Stack.Screen name="PaymentRelated" component={PaymentRelatedScreen} />
            <Stack.Screen name="FeedbackSuggestions" component={FeedbackSuggestionsScreen} />
            <Stack.Screen name="OrderProductsRelated" component={OrderProductsRelatedScreen} />
            <Stack.Screen name="GiftCard" component={GiftCardScreen} />
            <Stack.Screen name="NoCostEMI" component={NoCostEMIScreen} />
            <Stack.Screen name="WalletRelated" component={WalletRelatedScreen} />
            <Stack.Screen name="QuickkartClub" component={QuickkartClubScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
            <Stack.Screen name="CocaColaCampaign" component={CocaColaCampaignScreen} />
            <Stack.Screen name="FaqDetail" component={FaqDetailScreen} />
            <Stack.Screen name="ManagePayments" component={ManagePaymentsScreen} />
            <Stack.Screen name="AddressList" component={AddressListScreen} />
            <Stack.Screen name="AddressAdd" component={AddressAddScreen} />
            <Stack.Screen name="AddressEdit" component={AddressEditScreen} />
          </>
        )}
      </Stack.Navigator>
      {user && <BottomTabBar />}
    </View>
  );
}

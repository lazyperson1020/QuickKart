import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleWishlist, WishlistItem } from '../../redux/wishlistSlice';
import { GroceryProduct } from '../../components/productCard';
import ProductGridCard from '../../components/ProductGridCard';
import { auth } from '../../../firebase.native';
import { removeFromWishlistFirestore } from '../../utils/wishlistFirestore';
import FloatingCartPanel, { useCartPanelScrollHandler } from '../../components/FloatingCartPanel';
import { useTranslation } from '../../localization/LanguageContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function WishlistPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist);

  const scrollHandler = useCartPanelScrollHandler();

  const handleRemove = (item: WishlistItem) => {
    dispatch(toggleWishlist(item));
    const user = auth.currentUser;
    if (user) {
      removeFromWishlistFirestore(user.uid, item.id).catch(console.error);
    }
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.cardWrapper}>
      <ProductGridCard product={item as GroceryProduct} />
      <TouchableOpacity
        style={styles.heartOverlay}
        onPress={() => handleRemove(item)}
        hitSlop={6}
        activeOpacity={0.8}
      >
        <Ionicons name="heart" size={20} color="#e91e63" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.wishlist.headerTitle}</Text>
        <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('SearchResults')}>
          <Ionicons name="search-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Pink banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIconRow}>
          <View style={styles.bannerIconBubble}>
            <Ionicons name="shirt-outline" size={22} color="#e91e63" />
          </View>
          <View style={styles.bannerIconBubble}>
            <Ionicons name="watch-outline" size={22} color="#e91e63" />
          </View>
          <View style={[styles.bannerIconBubble, styles.bannerIconCenter]}>
            <Ionicons name="heart" size={28} color="#e91e63" />
          </View>
          <View style={styles.bannerIconBubble}>
            <Ionicons name="cafe-outline" size={22} color="#e91e63" />
          </View>
          <View style={styles.bannerIconBubble}>
            <Ionicons name="basketball-outline" size={22} color="#e91e63" />
          </View>
        </View>
      </View>

      {/* Product grid or empty state */}
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#e91e63" />
          <Text style={styles.emptyTitle}>{t.wishlist.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>
            {t.wishlist.emptySubtitle}
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      )}

      <FloatingCartPanel noNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  banner: {
    backgroundColor: '#fce4ec',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bannerIconCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f8bbd0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 180,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardWrapper: {
    position: 'relative',
    width: (SCREEN_WIDTH - 40) / 2,
  },
  heartOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

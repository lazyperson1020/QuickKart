// import React, { useEffect, useRef, useState } from 'react';
// import { View, FlatList, Image, ActivityIndicator, Text } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { auth, db } from "../../firebase";
// import { responsiveWidth } from 'react-native-responsive-dimensions';

// interface Banner { id: string; imageUrl: string; position: number; }

// const BannerRail = () => {
//   const [banners, setBanners] = useState<Banner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const flatListRef = useRef<FlatList<Banner>>(null);
//   const currentIndex = useRef(0);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, 'bannerRail'));
//         const bannerData: Banner[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Banner, 'id'>) }));
//         setBanners(bannerData.sort((a, b) => a.position - b.position));
//       } catch (err: any) { setError(err?.message ?? 'Failed to load banners'); }
//       finally { setLoading(false); }
//     };
//     fetchBanners();
//   }, []);

//   useEffect(() => {
//     if (banners.length < 2) return;
//     const interval = setInterval(() => { currentIndex.current = (currentIndex.current + 1) % banners.length; flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true }); }, 3000);
//     return () => clearInterval(interval);
//   }, [banners]);

//   const renderBanner = ({ item }: { item: Banner }) => <Image source={{ uri: item.imageUrl }} resizeMode="cover" style={{ width: responsiveWidth(85), height: 180, borderRadius: 15 }} />;

//   if (loading) return <ActivityIndicator size="large" />;
//   if (error) return <Text style={{ textAlign: 'center', color: '#DC2626', fontSize: 13, padding: 10 }}>{error}</Text>;

//   return (
//     <FlatList ref={flatListRef} horizontal showsHorizontalScrollIndicator={false} snapToInterval={responsiveWidth(85) + 15} decelerationRate="fast" data={banners} keyExtractor={item => item.id} renderItem={renderBanner} ItemSeparatorComponent={() => <View style={{ width: 15 }} />} ListHeaderComponent={() => <View style={{ width: 16 }} />} ListFooterComponent={() => <View style={{ width: 16 }} />} />
//   );
// };

// export default BannerRail;

import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedRef, 
  scrollTo, 
  runOnUI,
  useAnimatedReaction
} from 'react-native-reanimated';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../../firebase.native";
import { useTranslation } from '../localization/LanguageContext';

interface Banner { id: string; imageUrl: string; position: number; }

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = 16; 
const ITEM_SPACING = 12;
const BANNER_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2);

export default function BannerRail() {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reanimated specific view tracking hooks
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const targetXOffset = useSharedValue(0);
  const currentSlideIndex = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'bannerRail'),
      (snapshot) => {
        const bannerData: Banner[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Banner, 'id'>)
        }));
        setBanners(bannerData.sort((a, b) => a.position - b.position));
        setLoading(false);
      },
      (err: any) => {
        setError(err?.message ?? t.banners.failedToLoad);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // Native UI loop listener that executes scroll offsets at 60 FPS natively
  useAnimatedReaction(
    () => targetXOffset.value,
    (xOffset) => {
      scrollTo(animatedRef, xOffset, 0, true);
    }
  );

  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      const nextIndex = (currentSlideIndex.value + 1) % banners.length;
      currentSlideIndex.value = nextIndex;
      runOnUI(() => {
        targetXOffset.value = nextIndex * (BANNER_WIDTH + ITEM_SPACING);
      })();
    }, 4000); 
    return () => clearInterval(interval);
  }, [banners]);

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const calculatedIndex = Math.round(offsetX / (BANNER_WIDTH + ITEM_SPACING));
    currentSlideIndex.value = calculatedIndex;
    targetXOffset.value = calculatedIndex * (BANNER_WIDTH + ITEM_SPACING);
  };

  if (loading) return <View style={styles.centerContainer} />;
  
  if (error) return (
    <Text style={styles.errorText}>{error}</Text>
  );

  return (
    <View style={{ width: '100%', overflow: 'visible' }}>
      <Animated.ScrollView
        ref={animatedRef}
        horizontal
        pagingEnabled={false} 
        snapToInterval={BANNER_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingRight: ITEM_SPACING }}
      >
        {banners.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            activeOpacity={0.95}
            style={{ 
              width: BANNER_WIDTH, 
              marginRight: index === banners.length - 1 ? 0 : ITEM_SPACING 
            }}
          >
            <Image 
              source={{ uri: item.imageUrl }} 
              resizeMode="stretch" 
              style={{ 
                width: BANNER_WIDTH, 
                height: 160, 
                borderRadius: 16 
              }} 
            />
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16
  },
  errorText: {
    textAlign: 'center', 
    color: '#DC2626', 
    fontSize: 13, 
    padding: 10
  }
});
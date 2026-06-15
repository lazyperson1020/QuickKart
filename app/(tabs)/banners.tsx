import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../../firebase";
import { responsiveWidth } from 'react-native-responsive-dimensions';

interface Banner {
  id: string;
  imageUrl: string;
  position: number;
}

const BannerRail = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'bannerRail'));

      const bannerData: Banner[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Banner, 'id'>),
      }));

      // Sort according to position
      bannerData.sort((a, b) => a.position - b.position);

      setBanners(bannerData);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <Image
      source={{ uri: item.imageUrl }}
      resizeMode="cover"
      style={{
        width: responsiveWidth(85),
        height: 180,
        borderRadius: 15,
      }}
    />
  );

  if (loading) return <ActivityIndicator size="large" />;

  if (error) {
    return (
      <Text style={{ textAlign: 'center', color: '#DC2626', fontSize: 13, padding: 10 }}>
        {error}
      </Text>
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={responsiveWidth(85) + 15}
      decelerationRate="fast"
      data={banners}
      keyExtractor={item => item.id}
      renderItem={renderBanner}
      ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      contentContainerStyle={{ paddingLeft: 16 , paddingRight: 16}}
    />
  );
};

export default BannerRail;
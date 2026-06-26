// components/PriceFilterBadge.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';

interface Props {
  amount: number;
  label: string;
  imageUrl?: string;
  active: boolean;
  onPress: () => void;
}

export default function PriceFilterBadge({ amount, label, imageUrl, onPress }: Props) {
  const isAll = amount === 9999;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={S.container}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={S.badgeImage} resizeMode="contain" />
      ) : (
        /* Permanent fallback design: Completely static background with absolutely no state color switching */
        <View style={S.fallbackCard}>
          <Text style={S.fallbackPrefix}>
            {isAll ? 'All' : 'Under'}
          </Text>
          <Text style={S.fallbackAmount}>
            {isAll ? 'Prices' : `₹${amount}`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  badgeImage: {
    width: 76,
    height: 76,
  },
  fallbackCard: {
    width: 84,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F4F6F8', // Static neutral card canvas background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fallbackPrefix: {
    fontSize: 10,
    fontWeight: '600',
    color: '#667085',
    textTransform: 'uppercase',
  },
  fallbackAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D2939',
  },
});
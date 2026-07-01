// components/PriceFilterBadge.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { useTranslation } from '../localization/LanguageContext';

interface Props {
  amount: number;
  label: string;
  imageUrl?: string;
  active: boolean;
  onPress: () => void;
}

export default function PriceFilterBadge({ amount, label, imageUrl, active, onPress }: Props) {
  const { t } = useTranslation();
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
        <View style={[S.fallbackCard, active && S.fallbackCardActive]}>
          <Text style={[S.fallbackPrefix, active && S.fallbackPrefixActive]}>
            {isAll ? t.priceFilterBadge.all : t.priceFilterBadge.under}
          </Text>
          <Text style={[S.fallbackAmount, active && S.fallbackAmountActive]}>
            {isAll ? t.priceFilterBadge.prices : `₹${amount}`}
          </Text>
          {active && <View style={S.underline} />}
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
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fallbackCardActive: {
    backgroundColor: '#E8F5E9',
  },
  fallbackPrefix: {
    fontSize: 10,
    fontWeight: '600',
    color: '#667085',
    textTransform: 'uppercase',
  },
  fallbackPrefixActive: {
    color: '#2E7D32',
  },
  fallbackAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D2939',
  },
  fallbackAmountActive: {
    color: '#2E7D32',
  },
  underline: {
    position: 'absolute',
    bottom: 4,
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#2E7D32',
  },
});
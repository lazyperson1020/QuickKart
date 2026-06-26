import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface BrandCoupon {
  id: string;
  brand: string;
  brandBg: string;
  brandFg: string;
  title: string;
  unlockText: string;
}

interface Props {
  item: BrandCoupon;
  expanded: boolean;
  onToggle: () => void;
}

export default function BrandCouponItem({ item, expanded, onToggle }: Props) {
  return (
    <View style={S.card}>
      <View style={S.topRow}>
        <View style={[S.logo, { backgroundColor: item.brandBg }]}>
          <Text style={[S.logoText, { color: item.brandFg }]} numberOfLines={3}>
            {item.brand}
          </Text>
        </View>
        <View style={S.info}>
          <Text style={S.title}>{item.title}</Text>
          <View style={S.unlockRow}>
            <Text style={S.unlockText}>{item.unlockText}</Text>
            <Ionicons name="information-circle" size={14} color="#E67E22" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>

      <View style={S.dashed} />

      <View style={S.footer}>
        <View style={S.autoPill}>
          <Ionicons name="pricetag-outline" size={11} color="#555" />
          <Text style={S.autoPillText}>Coupon will be auto-applied</Text>
        </View>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={S.knowMore}>
          <Text style={S.knowMoreText}>Know more</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#333" />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={S.expandedBox}>
          <Text style={S.expandedLine}>• {item.unlockText} to apply this offer</Text>
          <Text style={S.expandedLine}>• Coupon will be automatically applied at checkout</Text>
          <Text style={S.expandedLine}>• Valid on qualifying products from this brand only</Text>
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoText: {
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 11,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    lineHeight: 20,
    marginBottom: 5,
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockText: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: '500',
  },
  dashed: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 5,
  },
  autoPillText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  knowMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  knowMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  expandedBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandedLine: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    marginBottom: 3,
  },
});

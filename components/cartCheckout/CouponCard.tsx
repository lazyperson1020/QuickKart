import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  cartTotal: number;
}

export default function CouponCard({ cartTotal }: Props) {
  const remaining = cartTotal >= 500 ? 0 : 500 - cartTotal;
  const unlocked = remaining === 0;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Ionicons name="pricetag" size={16} color="#35035C" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>Coupons & Offers</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: unlocked ? '#F0FFF4' : '#F5F0FF',
          borderRadius: 12,
          padding: 12,
          borderWidth: 1.5,
          borderColor: unlocked ? '#C8E6C9' : '#DDD0FF',
          borderStyle: 'dashed',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              backgroundColor: '#35035C',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
              BONUS50
            </Text>
          </View>
          <View>
            <Text style={{ fontWeight: '600', fontSize: 13, color: '#111' }}>Save ₹50</Text>
            <Text style={{ color: '#888', fontSize: 11, marginTop: 1 }}>
              {unlocked ? 'Coupon unlocked!' : `Add ₹${remaining} more to unlock`}
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={unlocked ? '#2e7d32' : '#AAA'}
        />
      </TouchableOpacity>
    </View>
  );
}

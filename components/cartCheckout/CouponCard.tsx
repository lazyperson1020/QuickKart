import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CouponCard() {
  return (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 8 }}>Coupons & offers</Text>

      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
        activeOpacity={0.8}
      >
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Ionicons name="pricetag-outline" size={18} color="#2e7d32" />
        </View>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111' }}>View coupons</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: '#F0F0F0' }} />

      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
        activeOpacity={0.8}
      >
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Ionicons name="card-outline" size={18} color="#1565C0" />
        </View>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111' }}>View payment offers</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

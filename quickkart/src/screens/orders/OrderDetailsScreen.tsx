import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../firebase.native';

export default function OrderDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const { orderId } = route.params as { orderId: string };
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth.currentUser || !orderId) return;
    const orderDocRef = doc(db, 'users', auth.currentUser.uid, 'previousOrders', orderId);
    const unsubscribe = onSnapshot(
      orderDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const cleanItemsArray = data.items || data['items '] || [];
          const t = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const formattedDate =
            t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ', ' +
            t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
          setOrder({ id: snapshot.id, ...data, items: cleanItemsArray, dateString: formattedDate });
        }
        setLoading(false);
      },
      (error) => { console.error("Failed to load order details:", error); setLoading(false); }
    );
    return unsubscribe;
  }, [orderId]);

  if (loading) return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F5F7' }}><ActivityIndicator size="large" color="#E91E63" /></SafeAreaView>;
  if (!order) return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', color: '#666' }}>Order details record could not be loaded.</Text></SafeAreaView>;

  const items = order.items || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
      {/* Header Container */}
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}><Ionicons name="chevron-back" size={24} color="#111" /></TouchableOpacity>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Order #{order.id?.substring(0, 12).toUpperCase()}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 1 }}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#FFD1DC' }}><MaterialIcons name="chat-bubble-outline" size={14} color="#E91E63" style={{ marginRight: 4 }} /><Text style={{ color: '#E91E63', fontWeight: '700', fontSize: 12 }}>Get Help</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Status Indicator Panel */}
        <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ backgroundColor: '#D1FAE5', borderRadius: 6, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}><Ionicons name="checkmark" size={16} color="#059669" /></View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Order Delivered</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#666', marginLeft: 32 }}>Your items were delivered on {order.dateString}</Text>
        </View>

        {/* Dynamic Products Map Listing Grid */}
        {/* Products Ordered Card */}
<View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
  <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 }}>Products Ordered</Text>
  {items.map((item: any, idx: number) => {
    // ⚡ FIX: Fallback gracefully to read 'id ' if 'id' is missing due to database typos
    const cleanId = (item.id || item['id '] || `item-${idx}`).toString().trim();
    const cleanName = (item.name || 'Product Snapshot').trim();

    return (
      <View key={`${cleanId}-${idx}`} style={{ flexDirection: 'row', marginBottom: idx === items.length - 1 ? 0 : 20, alignItems: 'center' }}>
        <Image source={{ uri: item.imageUrl }} style={{ width: 46, height: 46, resizeMode: 'contain', marginRight: 16, borderRadius: 4 }} />
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#111', lineHeight: 18 }}>{cleanName}</Text>
          <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{item.weight || 'Unit Size'}  •  {item.quantity || 1} {item.quantity === 1 ? 'unit' : 'units'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>₹{(item.price || 0) * (item.quantity || 1)}</Text>
          {item.originalPrice > item.price && (
            <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through', marginTop: 1 }}>₹{item.originalPrice * item.quantity}</Text>
          )}
        </View>
      </View>
    );
  })}
</View>

        {/* Receipt Totals Breakdown Panel */}
        <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}><MaterialIcons name="receipt" size={18} color="#111" style={{ marginRight: 8 }} /><Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Bill Summary</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}><Text style={{ color: '#666', fontSize: 14 }}>Item Total</Text><View style={{ flexDirection: 'row' }}><Text style={{ color: '#999', textDecorationLine: 'line-through', marginRight: 6 }}>₹{items.reduce((s: number, i: any) => s + (i.originalPrice || i.price) * i.quantity, 0) || order.totalAmount}</Text><Text style={{ fontWeight: '600', color: '#111' }}>₹{order.itemTotal || order.totalAmount}</Text></View></View>
          {order.couponCode && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}><Text style={{ color: '#059669', fontSize: 14, fontWeight: '600' }}>Promo Voucher ({order.couponCode}) Applied</Text><Text style={{ color: '#059669', fontWeight: '700' }}>-₹{order.discountAmount || 50}</Text></View>}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 16, color: '#111' }}>Total Bill</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: '#999', textDecorationLine: 'line-through', fontSize: 13, marginRight: 6 }}>₹{items.reduce((s: number, i: any) => s + (i.originalPrice || i.price) * i.quantity, 0) + (order.deliveryFee || 0)}</Text><Text style={{ fontWeight: '800', fontSize: 18, color: '#111' }}>₹{order.totalAmount}</Text></View></View>
          <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#F3E8FF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' }}><Text style={{ color: '#7E57C2', fontWeight: '700', fontSize: 13 }}>Download Invoice / Credit Note</Text></TouchableOpacity>
        </View>

        {/* Historical Metadata Details Block */}
        <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 }}>Order Details</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>Order ID</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14 }}>#{order.id?.toUpperCase()}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>Receiver Details</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14 }}>Arnav Shah, +91 8209120209</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>Delivery Address</Text><Text numberOfLines={2} style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14, lineHeight: 18 }}>{order.addressSnapshot?.fullAddress || '123 Main Street, City, State 110001'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>Order Placed at</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2 }}>{order.dateString}</Text>
        </View>

        {/* Assistance Row Footer link */}
        <TouchableOpacity activeOpacity={0.9} style={{ backgroundColor: '#fff', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEA' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ backgroundColor: '#FFF0F5', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><MaterialIcons name="chat-bubble-outline" size={18} color="#E91E63" /></View><View><Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Need help with this order?</Text><Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Find your issue or reach out via chat</Text></View></View>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Checkout Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#EAEAEA' }}>
        <TouchableOpacity style={{ backgroundColor: '#E91E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Order Again</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSinglePress } from '../hooks/useSinglePress';
import { useTranslation } from '../localization/LanguageContext';

export interface OrderItem { id: string; name: string; imageUrl: string; weight: string; price: number; originalPrice: number; quantity: number; category: string; }
interface PreviousOrdersCardProps { status: string; totalAmount: number; dateString: string; items?: OrderItem[]; onOrderAgain: () => void; onViewDetails: () => void; }

export default function PreviousOrdersCard({ status, totalAmount, dateString, items = [], onOrderAgain, onViewDetails }: PreviousOrdersCardProps) {
  const { t } = useTranslation();
  const safeViewDetails = useSinglePress(onViewDetails);
  const safeOrderAgain = useSinglePress(onOrderAgain);
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#EEF0F2' }}>
      <TouchableOpacity activeOpacity={0.7} onPress={safeViewDetails} style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}><Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{t.previousOrdersCard.orderStatus(status)}</Text><Ionicons name={status === 'delivered' ? "checkmark-circle" : status === 'cancelled' ? "close-circle" : "time"} size={16} color={status === 'delivered' ? "#10B981" : status === 'cancelled' ? "#EF4444" : "#F59E0B"} /></View>
          <Text style={{ fontSize: 13, color: '#666' }}>{t.previousOrdersCard.placedAt(dateString)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F2' }}><Text style={{ fontSize: 15, fontWeight: '700', color: '#111', marginRight: 4 }}>₹{totalAmount}</Text><AntDesign name="right" size={12} color="#666" /></View>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        {items.slice(0, 5).map((product, idx) => (
          <View key={`${product.id}-${idx}`} style={{ width: 64, height: 64, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="contain" />
            {product.quantity > 1 && ( <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: '#35035C', borderRadius: 10, minWidth: 18, height: 18, paddingHorizontal: 4, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>x{product.quantity}</Text></View> )}
          </View>
        ))}
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={safeOrderAgain} style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}><Text style={{ color: '#E91E63', fontWeight: '700', fontSize: 14 }}>{t.previousOrdersCard.orderAgain}</Text></TouchableOpacity>
    </View>
  );
}
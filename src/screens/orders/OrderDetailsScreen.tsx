import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { buildInvoiceHtml } from '../../utils/invoiceGenerator';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../firebase.native';
import { useTranslation } from '../../localization/LanguageContext';

export default function OrderDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const { orderId } = route.params as { orderId: string };
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

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

  const handleDownloadInvoice = async () => {
    if (!order || downloading) return;
    setDownloading(true);
    let filePath = '';
    try {
      const html = buildInvoiceHtml({
        orderId: order.id,
        dateString: order.dateString,
        paymentMethod: order.paymentMethod ?? 'cod',
        addressLabel: order.addressSnapshot?.label,
        fullAddress: order.addressSnapshot?.fullAddress,
        items: order.items ?? [],
        itemTotal: order.itemTotal ?? order.totalAmount,
        deliveryFee: order.deliveryFee ?? 0,
        tipAmount: order.tipAmount,
        totalAmount: order.totalAmount,
        couponCode: order.couponCode,
        discountAmount: order.discountAmount,
      });
      const result = await generatePDF({
        html,
        fileName: `QuickKart_Invoice_${order.id.substring(0, 8).toUpperCase()}`,
      });
      filePath = result.filePath;
    } catch (e: any) {
      setDownloading(false);
      Alert.alert(t.orderDetails.pdfGenFailedTitle, e?.message ?? t.orderDetails.pdfGenFailedMessage);
      return;
    }
    try {
      await FileViewer.open(filePath, { showOpenWithDialog: true });
    } catch (e: any) {
      Alert.alert(t.orderDetails.couldNotOpenFileTitle, e?.message ?? t.orderDetails.couldNotOpenFileMessage);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F5F7' }}><ActivityIndicator size="large" color="#E91E63" /></SafeAreaView>;
  if (!order) return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', color: '#666' }}>{t.orderDetails.couldNotLoadOrder}</Text></SafeAreaView>;

  const items = order.items || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
      {/* Header Container */}
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}><Ionicons name="chevron-back" size={24} color="#111" /></TouchableOpacity>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{t.orderDetails.orderIdLabel(order.id?.substring(0, 12).toUpperCase())}</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 1 }}>{t.orderDetails.itemsCount(items.length)}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#FFD1DC' }}><MaterialIcons name="chat-bubble-outline" size={14} color="#E91E63" style={{ marginRight: 4 }} /><Text style={{ color: '#E91E63', fontWeight: '700', fontSize: 12 }}>{t.orderDetails.getHelp}</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Status Indicator Panel */}
        {(() => {
          const status = order.status ?? 'placed';
          const isDelivered = status === 'delivered';
          const isCancelled = status === 'cancelled';
          const iconName = isDelivered ? 'checkmark' : isCancelled ? 'close' : 'time-outline';
          const iconColor = isDelivered ? '#059669' : isCancelled ? '#DC2626' : '#E67E22';
          const iconBg = isDelivered ? '#D1FAE5' : isCancelled ? '#FEE2E2' : '#FEF3C7';
          const label = isDelivered ? t.orderDetails.orderDelivered : isCancelled ? t.orderDetails.orderCancelled : t.orderDetails.orderPlaced;
          const subtitle = isDelivered
            ? t.orderDetails.deliveredSubtitle(order.dateString)
            : isCancelled
            ? t.orderDetails.cancelledSubtitle(order.dateString)
            : t.orderDetails.placedSubtitle(order.dateString);
          return (
            <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ backgroundColor: iconBg, borderRadius: 6, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  <Ionicons name={iconName} size={16} color={iconColor} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{label}</Text>
              </View>
              <Text style={{ fontSize: 13, color: '#666', marginLeft: 32 }}>{subtitle}</Text>
            </View>
          );
        })()}

        {/* Dynamic Products Map Listing Grid */}
        {/* Products Ordered Card */}
<View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
  <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 }}>{t.orderDetails.productsOrdered}</Text>
  {items.map((item: any, idx: number) => {
    // ⚡ FIX: Fallback gracefully to read 'id ' if 'id' is missing due to database typos
    const cleanId = (item.id || item['id '] || `item-${idx}`).toString().trim();
    const cleanName = (item.name || t.orderDetails.productSnapshotFallback).trim();

    return (
      <View key={`${cleanId}-${idx}`} style={{ flexDirection: 'row', marginBottom: idx === items.length - 1 ? 0 : 20, alignItems: 'center' }}>
        <Image source={{ uri: item.imageUrl }} style={{ width: 46, height: 46, resizeMode: 'contain', marginRight: 16, borderRadius: 4 }} />
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: '#111', lineHeight: 18 }}>{cleanName}</Text>
          <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{t.orderDetails.weightAndUnits(item.weight || t.orderDetails.unitSizeFallback, item.quantity || 1)}</Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}><MaterialIcons name="receipt" size={18} color="#111" style={{ marginRight: 8 }} /><Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{t.billSummary.title}</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}><Text style={{ color: '#666', fontSize: 14 }}>{t.billSummary.itemTotal}</Text><View style={{ flexDirection: 'row' }}><Text style={{ color: '#999', textDecorationLine: 'line-through', marginRight: 6 }}>₹{items.reduce((s: number, i: any) => s + (i.originalPrice || i.price) * i.quantity, 0) || order.totalAmount}</Text><Text style={{ fontWeight: '600', color: '#111' }}>₹{order.itemTotal || order.totalAmount}</Text></View></View>
          {order.couponCode && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}><Text style={{ color: '#059669', fontSize: 14, fontWeight: '600' }}>{t.orderDetails.promoVoucherApplied(order.couponCode)}</Text><Text style={{ color: '#059669', fontWeight: '700' }}>-₹{order.discountAmount || 50}</Text></View>}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center' }}><Text style={{ fontWeight: '800', fontSize: 16, color: '#111' }}>{t.orderDetails.totalBill}</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: '#999', textDecorationLine: 'line-through', fontSize: 13, marginRight: 6 }}>₹{items.reduce((s: number, i: any) => s + (i.originalPrice || i.price) * i.quantity, 0) + (order.deliveryFee || 0)}</Text><Text style={{ fontWeight: '800', fontSize: 18, color: '#111' }}>₹{order.totalAmount}</Text></View></View>
          <TouchableOpacity
            onPress={handleDownloadInvoice}
            disabled={downloading}
            style={{ marginTop: 16, backgroundColor: '#F3E8FF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF', opacity: downloading ? 0.6 : 1 }}
          >
            {downloading
              ? <ActivityIndicator size="small" color="#7E57C2" />
              : <Text style={{ color: '#7E57C2', fontWeight: '700', fontSize: 13 }}>{t.orderDetails.downloadInvoice}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Historical Metadata Details Block */}
        <View style={{ backgroundColor: '#fff', padding: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 }}>{t.orderDetails.orderDetailsHeading}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>{t.orderDetails.orderIdFieldLabel}</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14 }}>#{order.id?.toUpperCase()}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>{t.orderDetails.receiverDetailsLabel}</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14 }}>Arnav Shah, +91 8209120209</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>{t.orderDetails.deliveryAddressLabel}</Text><Text numberOfLines={2} style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2, marginBottom: 14, lineHeight: 18 }}>{order.addressSnapshot?.fullAddress || '123 Main Street, City, State 110001'}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>{t.orderDetails.orderPlacedAtLabel}</Text><Text style={{ fontSize: 14, color: '#111', fontWeight: '500', marginTop: 2 }}>{order.dateString}</Text>
        </View>

        {/* Assistance Row Footer link */}
        <TouchableOpacity activeOpacity={0.9} style={{ backgroundColor: '#fff', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEA' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ backgroundColor: '#FFF0F5', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><MaterialIcons name="chat-bubble-outline" size={18} color="#E91E63" /></View><View><Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{t.orderDetails.needHelpTitle}</Text><Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{t.orderDetails.needHelpSubtitle}</Text></View></View>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Checkout Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#EAEAEA' }}>
        <TouchableOpacity style={{ backgroundColor: '#E91E63', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{t.previousOrdersCard.orderAgain}</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../localization/LanguageContext';

interface BillSummaryProps {
  itemTotal: number;
  originalItemTotal: number;
  deliveryFee: number;
  savings: number;
  totalSavings: number;
  tipAmount?: number;
}

const ORIG_HANDLING = 10;

export default function BillSummary({ itemTotal, originalItemTotal, deliveryFee, savings, totalSavings, tipAmount = 0 }: BillSummaryProps) {
  const { t } = useTranslation();
  const deliveryUnlock = Math.max(0, 99 - itemTotal);
  const actualTotalPay = itemTotal + deliveryFee + tipAmount;
  const originalTotalPay = originalItemTotal + deliveryFee + ORIG_HANDLING;

  return (
    <View style={{ backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Ionicons name="grid-outline" size={16} color="#35035C" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>{t.billSummary.title}</Text>
      </View>

      {/* Item Total */}
      <BillRow
        label={t.billSummary.itemTotal}
        originalValue={originalItemTotal > itemTotal ? `₹${originalItemTotal}` : undefined}
        value={`₹${itemTotal}`}
      />

      {/* Delivery Fee */}
      <BillRow
        label={t.billSummary.deliveryFee}
        value={deliveryFee === 0 ? t.billSummary.free : `₹${deliveryFee}`}
        isFree={deliveryFee === 0}
        note={deliveryFee > 0 && deliveryUnlock > 0
          ? t.billSummary.freeAboveNote(deliveryUnlock)
          : undefined}
      />

      {/* Handling Fee */}
      <BillRow
        label={t.billSummary.handlingFee}
        originalValue={`₹${ORIG_HANDLING}`}
        value={t.billSummary.free}
        isFree
      />

      {/* Delivery Tip */}
      {tipAmount > 0 && (
        <BillRow
          label={t.billSummary.deliveryTip}
          value={`₹${tipAmount}`}
          icon="heart-circle-outline"
          iconColor="#e91e63"
        />
      )}

      <View style={{ height: 1, backgroundColor: '#EFEFEF', marginVertical: 12 }} />

      {/* To Pay */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: '#111' }}>{t.billSummary.toPay}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {originalTotalPay > actualTotalPay && (
            <Text style={{ fontSize: 13, color: '#999', textDecorationLine: 'line-through' }}>₹{originalTotalPay}</Text>
          )}
          <Text style={{ fontWeight: '800', fontSize: 18, color: '#111' }}>₹{actualTotalPay}</Text>
        </View>
      </View>

      {/* Savings section */}
      {totalSavings > 0 && (
        <View style={{ backgroundColor: '#F0FFF4', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#C8E6C9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: savings > 0 ? 10 : 0 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{t.billSummary.savingsOnOrder}</Text>
            <View style={{ backgroundColor: '#2e7d32', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>₹{totalSavings}</Text>
            </View>
          </View>
          {savings > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#2e7d32" />
                <Text style={{ fontSize: 13, color: '#555' }}>{t.billSummary.discountOnMrp}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#111' }}>₹{savings}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function BillRow({
  label, originalValue, value, isFree = false, note, icon, iconColor,
}: {
  label: string;
  originalValue?: string;
  value: string;
  isFree?: boolean;
  note?: string;
  icon?: string;
  iconColor?: string;
}) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {icon && <Ionicons name={icon as any} size={14} color={iconColor ?? '#555'} />}
          <Text style={{ color: '#555', fontSize: 14 }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {originalValue && (
            <Text style={{ fontSize: 12, color: '#999', textDecorationLine: 'line-through' }}>{originalValue}</Text>
          )}
          <Text style={{ fontSize: 14, fontWeight: '600', color: isFree ? '#2e7d32' : '#333' }}>{value}</Text>
        </View>
      </View>
      {note ? (
        <Text style={{ fontSize: 11, color: '#1565C0', marginTop: 3, fontWeight: '500' }}>{note}</Text>
      ) : null}
    </View>
  );
}

import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface BillSummaryProps {
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  deliveryTip?: number; // Added tip parameter
}

export default function BillSummary({
  itemTotal,
  deliveryFee,
  handlingFee,
  deliveryTip = 0,
}: BillSummaryProps) {
  
  // Calculate total automatically inside the summary component
  const totalPay = itemTotal + deliveryFee + handlingFee + deliveryTip;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 10,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <Ionicons name="receipt-outline" size={16} color="#35035C" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>Bill Summary</Text>
      </View>

      <BillRow label="Item Total" value={`₹${itemTotal}`} />
      
      <BillRow
        label="Delivery Fee"
        value={deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
        isFree={deliveryFee === 0}
      />
      
      <BillRow
        label="Handling Fee"
        value={handlingFee === 0 ? 'FREE' : `₹${handlingFee}`}
        isFree={handlingFee === 0}
        last={deliveryTip === 0} // It is the last row only if there's no tip
      />

      {/* Dynamic Delivery Tip Row */}
      {deliveryTip > 0 && (
        <BillRow 
          label="Delivery Partner Tip" 
          value={`₹${deliveryTip}`} 
          last={true}
        />
      )}

      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#EFEFEF',
          paddingTop: 14,
          marginTop: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: '700', fontSize: 16, color: '#111' }}>To Pay</Text>
        <Text style={{ fontWeight: '800', fontSize: 18, color: '#35035C' }}>₹{totalPay}</Text>
      </View>
    </View>
  );
}

function BillRow({
  label,
  value,
  isFree = false,
  last = false,
}: {
  label: string;
  value: string;
  isFree?: boolean;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: '#F5F5F5',
      }}
    >
      <Text style={{ color: '#555', fontSize: 14 }}>{label}</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: isFree ? '#2e7d32' : '#333',
        }}
      >
        {value}
      </Text>
    </View>
  );
}
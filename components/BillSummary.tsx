import { View, Text } from 'react-native'
import React from 'react'

export default function BillSummary({
  itemTotal,
  deliveryFee,
  handlingFee,
  totalPay,
}: {
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  totalPay: number;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 20,
        }}
      >
        Bill Summary
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text>Item Total</Text>
        <Text>₹{itemTotal}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text>Delivery Fee</Text>
        <Text>
          {deliveryFee === 0
            ? "FREE"
            : `₹${deliveryFee}`}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text>Handling Fee</Text>
        <Text>
          {handlingFee === 0
            ? "FREE"
            : `₹${handlingFee}`}
        </Text>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#eee",
          paddingTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          To Pay
        </Text>

        <Text
          style={{
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          ₹{totalPay}
        </Text>
      </View>
    </View>
  );
}
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const AddressCard = ({ item, onEdit }: any) => {
  const detailLine = [item.houseNo, item.apartment]
    .filter(Boolean)
    .join(", ");

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
          {item.type}
        </Text>
        {item.isDefault && (
          <View
            style={{
              marginLeft: 8,
              backgroundColor: "#e8f5e9",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 11, color: "#2e7d32", fontWeight: "600" }}>
              Default
            </Text>
          </View>
        )}
      </View>

      {!!detailLine && (
        <Text style={{ color: "#444", fontSize: 14, marginBottom: 2 }}>
          {detailLine}
        </Text>
      )}

      {!!item.landmark && (
        <Text style={{ color: "#444", fontSize: 14, marginBottom: 2 }}>
          Near {item.landmark}
        </Text>
      )}

      {!!item.fullAddress && (
        <Text style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
          {item.fullAddress}
        </Text>
      )}

      <TouchableOpacity onPress={onEdit}>
        <Text style={{ marginTop: 12, color: "#ff2d7a", fontWeight: "600", fontSize: 14 }}>
          Edit Address
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressCard;

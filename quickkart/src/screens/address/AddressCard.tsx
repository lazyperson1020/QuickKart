import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddressCard = ({ item, onEdit, onDelete, onSelect, isSelected }: any) => {
  const detailLine = [item.houseNo, item.apartment]
    .filter(Boolean)
    .join(", ");

  const confirmDelete = () => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete?.(item.id) },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={onSelect ? 0.75 : 1}
      onPress={onSelect}
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
        borderWidth: isSelected ? 1.5 : 0,
        borderColor: isSelected ? "#ff2d7a" : "transparent",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111", flex: 1 }}>
          {item.type}
        </Text>
        {isSelected && (
          <View
            style={{
              marginRight: 8,
              backgroundColor: "#fce4ec",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 11, color: "#ff2d7a", fontWeight: "700" }}>
              Selected
            </Text>
          </View>
        )}
        {!isSelected && item.isDefault && (
          <View
            style={{
              marginRight: 8,
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
        {onDelete && (
          <TouchableOpacity onPress={confirmDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color="#FF3269" />
          </TouchableOpacity>
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

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation?.();
          onEdit?.();
        }}
      >
        <Text style={{ marginTop: 12, color: "#ff2d7a", fontWeight: "600", fontSize: 14 }}>
          Edit Address
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AddressCard;

import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../localization/LanguageContext";

const AddressCard = ({ item, onEdit, onDelete, onSelect, isSelected }: any) => {
  const { t } = useTranslation();
  const detailLine = [item.houseNo, item.apartment]
    .filter(Boolean)
    .join(", ");

  const confirmDelete = () => {
    Alert.alert(t.addressSelector.deleteAddressTitle, t.addressSelector.deleteAddressMessage, [
      { text: t.common.cancel, style: "cancel" },
      { text: t.addressSelector.delete, style: "destructive", onPress: () => onDelete?.(item.id) },
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
              {t.addressSelector.selected}
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
              {t.addressCard.default}
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
          {t.addressCard.nearLandmark(item.landmark)}
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
          {t.addressCard.editAddress}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AddressCard;

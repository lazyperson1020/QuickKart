import { View, Text } from "react-native";

export default function StockBadge() {
  return (
    <View
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      }}
    >
      <Text>Sold Out</Text>
    </View>
  );
}
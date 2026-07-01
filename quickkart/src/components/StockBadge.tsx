import { View, Text } from "react-native";
import { useTranslation } from "../localization/LanguageContext";

export default function StockBadge() {
  const { t } = useTranslation();
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
      <Text>{t.stockBadge.soldOut}</Text>
    </View>
  );
}
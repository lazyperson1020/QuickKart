import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSinglePress } from "../../hooks/useSinglePress";

interface Props {
  title: string;
  icon: string;
  onPress: () => void;
  subtitle?: string;
}

const ProfileElementCard = ({
  title,
  icon,
  onPress,
  subtitle,
}: Props) => {
  const handlePress = useSinglePress(onPress);
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f1f1",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#111"
        />

        <View
          style={{
            marginLeft: 15,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
            }}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={{
                color: "#888",
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#888"
      />
    </TouchableOpacity>
  );
};

export default ProfileElementCard;
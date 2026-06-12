import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

import ProfileElementCard from "./profileElementCard";

const ProfilePage = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);

      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F4F4F4",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
            }}
          >
            Profile
          </Text>
        </View>

        {/* User */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#E8D9FF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="person"
              size={40}
              color="#7E57C2"
            />
          </View>

          <View
            style={{
              marginLeft: 15,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
              }}
            >
              Arnav Shah
            </Text>

            <Text
              style={{
                color: "#777",
                marginTop: 4,
              }}
            >
              8209120209
            </Text>
          </View>
        </View>

        {/* Information Section */}

        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 15,
            borderRadius: 16,
            paddingHorizontal: 15,
          }}
        >
          <ProfileElementCard
            title="Previous Orders"
            icon="bag-outline"
            onPress={() =>
              router.push(
                "/profile/previousOrders"
              )
            }
          />

          <ProfileElementCard
            title="Wishlist"
            icon="heart-outline"
            onPress={() =>
              router.push(
                "/profile/wishlistPage"
              )
            }
          />

          <ProfileElementCard
            title="Saved Addresses"
            icon="location-outline"
            onPress={() =>
              router.push(
                "/address/addressList"
              )
            }
          />

          <ProfileElementCard
            title="Refunds"
            icon="cash-outline"
            onPress={() =>
              router.push(
                "/profile/refundsPage"
              )
            }
          />

          <ProfileElementCard
            title="Policies"
            icon="document-text-outline"
            onPress={() =>
              router.push(
                "/profile/policyPage"
              )
            }
          />
        </View>

        {/* Logout */}

        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 15,
            marginTop: 20,
            borderRadius: 16,
            padding: 18,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            marginTop: 20,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              color: "#888",
            }}
          >
            QuickKart v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
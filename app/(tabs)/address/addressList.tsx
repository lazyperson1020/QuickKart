import React, { useEffect, useState } from "react";
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "../../../firebase";
import AddressCard from "./addressCard";
import { styles } from "../../../styles/home";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
interface Address {
  id: string;
  type: string;
  houseNo: string;
  apartment: string;
  landmark: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAddresses = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, "users", user.uid, "addresses")
      );

      const addressData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Address[];

      setAddresses(addressData);
    } catch (error) {
      console.log("Address fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
        <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <AddressCard
            item={item}
            onEdit={() =>
                router.push({
                pathname: "/(tabs)/address/addressEdit" as any,
                params: { addressId: item.id },
                })
            }
            />
        )}
        ListEmptyComponent={
            <View>
            <Text>No addresses found</Text>
            </View>
        }
        contentContainerStyle={{ padding: 16 }}
        ListFooterComponent={
            <TouchableOpacity
            style={listStyles.addBtn}
            onPress={() => router.push("/(tabs)/address/addressAdd" as any)}
            >
            <AntDesign name="plus" size={18} color="#ff2d7a" />
            <Text style={listStyles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
        }
        />
    </SafeAreaView>
  );
};

const listStyles = StyleSheet.create({
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ff2d7a",
    borderStyle: "dashed",
  },
  addBtnText: {
    color: "#ff2d7a",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default AddressList;

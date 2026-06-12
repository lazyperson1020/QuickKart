import React, { useEffect, useState } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "../../../firebase";
import AddressCard from "./addressCard";
import { styles } from "../../../styles/home";
import { SafeAreaView } from "react-native-safe-area-context";
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
        />
    </SafeAreaView>
  );
};

export default AddressList;

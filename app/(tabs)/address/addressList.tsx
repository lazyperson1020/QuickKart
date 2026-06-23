import React, { useState, useCallback } from "react";
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../../firebase";
import AddressCard from "./addressCard";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { setSelectedAddress } from "../../redux/addressSlice";
import { RootState } from "../../redux/store";
import { useSinglePress } from "../../../hooks/useSinglePress";

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
  const dispatch = useDispatch();
  const { bottom } = useSafeAreaInsets();
  const selectedAddressId = useSelector((state: RootState) => state.address.selected?.id);

  const fetchAddresses = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const snapshot = await getDocs(collection(db, "users", user.uid, "addresses"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Address[];
      setAddresses(data);

      // Auto-select default address if nothing is selected yet
      if (!selectedAddressId) {
        const def = data.find((a) => a.isDefault) ?? data[0] ?? null;
        if (def) {
          dispatch(setSelectedAddress({ id: def.id, label: def.type, address: def.fullAddress }));
        }
      }
    } catch (error) {
      console.log("Address fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAddresses(); }, []));

  const handleDelete = (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) {
      dispatch(setSelectedAddress(null));
    }
    deleteDoc(doc(db, "users", user.uid, "addresses", id)).catch(console.error);
  };

  const handleSelect = useSinglePress((item: Address) => {
    dispatch(setSelectedAddress({ id: item.id, label: item.type, address: item.fullAddress }));
    router.back();
  });
  const goBack = useSinglePress(() => router.back());
  const goToAddressAdd = useSinglePress(() => router.push("/(tabs)/address/addressAdd" as any));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff2d7a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AddressCard
              item={item}
              isSelected={selectedAddressId === item.id}
              onSelect={() => handleSelect(item)}
              onEdit={() =>
                router.push({
                  pathname: "/(tabs)/address/addressEdit" as any,
                  params: { addressId: item.id },
                })
              }
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No saved addresses</Text>
            </View>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: bottom + 24 }]}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addBtn}
              onPress={goToAddressAdd}
            >
              <AntDesign name="plus" size={18} color="#ff2d7a" />
              <Text style={styles.addBtnText}>Add New Address</Text>
            </TouchableOpacity>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#aaa",
    fontWeight: "500",
  },
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

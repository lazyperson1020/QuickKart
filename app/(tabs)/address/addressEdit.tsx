import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocalSearchParams, router } from "expo-router";
import { auth, db } from "../../../firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddressEdit = () => {
  const { addressId } = useLocalSearchParams();
  const { bottom } = useSafeAreaInsets();

  const [type, setType] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "addresses", addressId as string);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setType(data.type ?? "");
      setHouseNo(data.houseNo ?? "");
      setApartment(data.apartment ?? "");
      setLandmark(data.landmark ?? "");
      setFullAddress(data.fullAddress ?? "");
    }
    setLoading(false);
  };

  const updateAddress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    await updateDoc(
      doc(db, "users", user.uid, "addresses", addressId as string),
      { type, houseNo, apartment, landmark, fullAddress }
    );
    setSaving(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Edit Address</Text>

        <Text style={styles.label}>Label (Home / Work / Other)</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="e.g. Home"
          returnKeyType="next"
        />

        <Text style={styles.label}>House / Flat No.</Text>
        <TextInput
          style={styles.input}
          value={houseNo}
          onChangeText={setHouseNo}
          placeholder="e.g. 42B"
          returnKeyType="next"
        />

        <Text style={styles.label}>Apartment / Society</Text>
        <TextInput
          style={styles.input}
          value={apartment}
          onChangeText={setApartment}
          placeholder="e.g. Sunrise Apartments"
          returnKeyType="next"
        />

        <Text style={styles.label}>Landmark</Text>
        <TextInput
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
          placeholder="e.g. Near City Mall"
          returnKeyType="next"
        />

        <Text style={styles.label}>Full Address</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder="Street, City, Pin code"
          multiline
        />

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.6 }]}
          onPress={updateAddress}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving…" : "Save Address"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    marginTop: 28,
    backgroundColor: "#ff2d7a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default AddressEdit;

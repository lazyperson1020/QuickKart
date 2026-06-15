import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { router } from "expo-router";
import { auth, db } from "../../../firebase";

const AddressAdd = () => {
  const [type, setType] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const saveAddress = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    await addDoc(collection(db, "users", user.uid, "addresses"), {
      type,
      houseNo,
      apartment,
      landmark,
      fullAddress,
      isDefault: false,
      latitude: 0,
      longitude: 0,
    });
    setSaving(false);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Address</Text>

      <Text style={styles.label}>Label (Home / Work / Other)</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="e.g. Home"
      />

      <Text style={styles.label}>House / Flat No.</Text>
      <TextInput
        style={styles.input}
        value={houseNo}
        onChangeText={setHouseNo}
        placeholder="e.g. 42B"
      />

      <Text style={styles.label}>Apartment / Society</Text>
      <TextInput
        style={styles.input}
        value={apartment}
        onChangeText={setApartment}
        placeholder="e.g. Sunrise Apartments"
      />

      <Text style={styles.label}>Landmark</Text>
      <TextInput
        style={styles.input}
        value={landmark}
        onChangeText={setLandmark}
        placeholder="e.g. Near City Mall"
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
        onPress={saveAddress}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Saving…" : "Add Address"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default AddressAdd;

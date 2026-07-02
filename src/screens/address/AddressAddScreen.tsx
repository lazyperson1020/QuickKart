import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../../firebase.native";
import { useTranslation } from "../../localization/LanguageContext";

const AddressAdd = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
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
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.addressForm.addAddressTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>{t.addressForm.labelField}</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder={t.addressForm.labelPlaceholder}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>{t.addressForm.houseNoField}</Text>
        <TextInput
          style={styles.input}
          value={houseNo}
          onChangeText={setHouseNo}
          placeholder={t.addressForm.houseNoPlaceholder}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>{t.addressForm.apartmentField}</Text>
        <TextInput
          style={styles.input}
          value={apartment}
          onChangeText={setApartment}
          placeholder={t.addressForm.apartmentPlaceholder}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>{t.addressForm.landmarkField}</Text>
        <TextInput
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
          placeholder={t.addressForm.landmarkPlaceholder}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>{t.addressForm.fullAddressField}</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder={t.addressForm.fullAddressPlaceholder}
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.6 }]}
          onPress={saveAddress}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t.addressForm.saveAddress}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    marginTop: 32,
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

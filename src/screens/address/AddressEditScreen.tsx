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
import Ionicons from "react-native-vector-icons/Ionicons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";
import { auth, db } from "../../../firebase.native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "../../localization/LanguageContext";

const AddressEdit = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddressEdit'>>();
  const { addressId } = route.params as { addressId: string };
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

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

    const ref = doc(db, "users", user.uid, "addresses", addressId);
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
      doc(db, "users", user.uid, "addresses", addressId),
      { type, houseNo, apartment, landmark, fullAddress }
    );
    setSaving(false);
    navigation.goBack();
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
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      {/* Sticky header */}
      <View style={[styles.header, { paddingTop: top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.addressForm.editAddressTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>{t.addressForm.labelField}</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder={t.addressForm.labelPlaceholder}
          returnKeyType="next"
        />

        <Text style={styles.label}>{t.addressForm.houseNoField}</Text>
        <TextInput
          style={styles.input}
          value={houseNo}
          onChangeText={setHouseNo}
          placeholder={t.addressForm.houseNoPlaceholder}
          returnKeyType="next"
        />

        <Text style={styles.label}>{t.addressForm.apartmentField}</Text>
        <TextInput
          style={styles.input}
          value={apartment}
          onChangeText={setApartment}
          placeholder={t.addressForm.apartmentPlaceholder}
          returnKeyType="next"
        />

        <Text style={styles.label}>{t.addressForm.landmarkField}</Text>
        <TextInput
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
          placeholder={t.addressForm.landmarkPlaceholder}
          returnKeyType="next"
        />

        <Text style={styles.label}>{t.addressForm.fullAddressField}</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder={t.addressForm.fullAddressPlaceholder}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.6 }]}
          onPress={updateAddress}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? t.addressForm.saving : t.addressForm.saveAddress}
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
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
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

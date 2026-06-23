import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

const PURPLE = "#35035C";

export default function ProfileEditPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setName(d.name ?? "");
          setContact(d.contact ?? "");
          setEmail(d.email ?? user.email ?? "");
        }
      } catch {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) { Alert.alert("Error", "Name cannot be empty"); return; }
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), { name: name.trim(), contact: contact.trim() });
      Alert.alert("Success", "Profile updated successfully");
    } catch {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently remove all your orders, wallet amount and any active referral codes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;
              await deleteUser(user);
              router.replace("/(auth)/login");
            } catch (e: any) {
              Alert.alert("Error", e.message ?? "Please sign out and sign back in before deleting your account.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={PURPLE} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          <Field label="Name *" value={name} onChange={setName} placeholder="Your name" />
          <Field
            label="Mobile Number *"
            value={contact}
            onChange={setContact}
            placeholder="Mobile number"
            keyboardType="phone-pad"
          />
          <Field
            label="Email Address *"
            value={email}
            onChange={() => {}}
            placeholder="Email address"
            editable={false}
            hint="We promise not to spam you"
          />

          <TouchableOpacity
            style={[styles.submitBtn, saving && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>{saving ? "Saving..." : "Submit"}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={handleDeleteAccount} activeOpacity={0.7}>
            <Text style={styles.deleteTitle}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.deleteDesc}>
            Deleting your account will remove all your orders, wallet amount and any active referral codes.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChange, placeholder, keyboardType, editable = true, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; keyboardType?: any; editable?: boolean; hint?: string;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && { color: "#888" }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#AAA"
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: PURPLE, marginBottom: 8 },
  input: {
    backgroundColor: "#EDE7FF", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#111",
  },
  hint: { marginTop: 6, fontSize: 12, color: "#AAA" },
  submitBtn: {
    backgroundColor: PURPLE, borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
    marginTop: 8, marginBottom: 32,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#EEE", marginBottom: 24 },
  deleteTitle: { fontSize: 18, fontWeight: "700", color: "#e91e63", marginBottom: 8 },
  deleteDesc: { fontSize: 14, color: "#666", lineHeight: 22 },
});

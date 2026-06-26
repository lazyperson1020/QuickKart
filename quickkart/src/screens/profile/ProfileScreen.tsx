import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, StyleSheet, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { auth, db } from "../../../firebase.native";
import ProfileElementCard from "./ProfileElementCard";
import BottomSheet from "../../components/BottomSheet";

const PURPLE = "#7E57C2";
const PINK = "#E91E8C";

const ProfilePage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);
  const [addressCount, setAddressCount] = useState(0);
  const [showSuggestSheet, setShowSuggestSheet] = useState(false);
  const [suggestText, setSuggestText] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubUser = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name ?? "");
          setContact(data.contact ?? "");
        }
        setLoading(false);
      },
      () => { Alert.alert("Error", "Failed to load profile"); setLoading(false); }
    );

    const unsubAddresses = onSnapshot(
      collection(db, "users", user.uid, "addresses"),
      (snap) => { setAddressCount(snap.size); },
      () => {}
    );

    return () => { unsubUser(); unsubAddresses(); };
  }, []);

  const logout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: "destructive", onPress: async () => {
          try { await signOut(auth); }
          catch { Alert.alert("Error", "Logout failed"); }
        },
      },
    ]);
  };

  const handleSendSuggestion = () => {
    if (!suggestText.trim()) return;
    Alert.alert("Thank you!", "Your suggestion has been received.");
    setSuggestText("");
    setShowSuggestSheet(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F0F5" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User info */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={PURPLE} />
          </View>
          <View style={{ marginLeft: 14 }}>
            {loading ? (
              <ActivityIndicator color={PURPLE} />
            ) : (
              <>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userContact}>{contact}</Text>
              </>
            )}
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction icon="bag-outline" label={"Your\nOrders"} onPress={() => navigation.navigate('PreviousOrders')} />
          <QuickAction icon="chatbubble-ellipses-outline" label={"Help &\nSupport"} onPress={() => navigation.navigate('HelpSupport')} />
          <QuickAction icon="heart-outline" label={"Your\nWishlist"} onPress={() => navigation.navigate('Wishlist')} />
        </View>

        {/*  Cash & Gift Card */}
        {/* <View style={styles.cashCard}>
          <TouchableOpacity style={styles.cashTop} activeOpacity={0.7}>
            <View style={styles.cashIconWrap}>
              <Ionicons name="wallet" size={18} color={PURPLE} />
            </View>
            <Text style={styles.cashTitle}>Zepto Cash & Gift Card</Text>
            <Ionicons name="chevron-forward" size={16} color={PURPLE} style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
          <View style={styles.cashDivider} />
          <View style={styles.cashBottom}>
            <Text style={styles.cashBalance}>
              Available Balance{"  "}
              <Text style={{ fontWeight: "700", color: "#111" }}>₹0</Text>
            </Text>
            <TouchableOpacity style={styles.addBalanceBtn}>
              <Text style={styles.addBalanceText}>Add Balance</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Your Information */}
        <Text style={styles.sectionLabel}>Your Information</Text>
        <View style={styles.listCard}>
          <ProfileElementCard title="Your Refunds" icon="cash-outline" onPress={() => navigation.navigate('Refunds')} />
          <ProfileElementCard title="Your Wishlist" icon="heart-outline" onPress={() => navigation.navigate('Wishlist')} />
          <ProfileElementCard title="E-Gift Cards" icon="card-outline" onPress={() => Alert.alert("E-Gift Cards", "Coming soon!")} />
          <ProfileElementCard title="Help & Support" icon="chatbubble-ellipses-outline" onPress={() => navigation.navigate('HelpSupport')} />
        </View>

        {/* Account */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Account</Text>
        <View style={styles.listCard}>
          <ProfileElementCard
            title="Saved Addresses"
            icon="location-outline"
            subtitle={`${addressCount} Address${addressCount !== 1 ? "es" : ""}`}
            onPress={() => navigation.navigate('AddressList')}
          />
          <ProfileElementCard title="Edit Profile" icon="person-circle-outline" onPress={() => navigation.navigate('ProfileEdit')} />
          <ProfileElementCard title="Manage Payments" icon="card-outline" onPress={() => navigation.navigate('ManagePayments')} />
          <ProfileElementCard title="Rewards" icon="gift-outline" onPress={() => navigation.navigate('Rewards')} />
        </View>

        {/* Other */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Other</Text>
        <View style={styles.listCard}>
          <ProfileElementCard title="Suggest Products" icon="star-outline" onPress={() => setShowSuggestSheet(true)} />
          <ProfileElementCard title="Policies" icon="document-text-outline" onPress={() => navigation.navigate('Policy')} />
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 16, marginBottom: 30 }}>
          <Text style={{ color: "#AAA", fontSize: 12 }}>QuickKart v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Suggest Products Bottom Sheet */}
      <BottomSheet
        visible={showSuggestSheet}
        onClose={() => setShowSuggestSheet(false)}
        height={460}
      >
        <View style={styles.sheetHeader}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.sheetClose} onPress={() => setShowSuggestSheet(false)}>
            <Ionicons name="close" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sheetTitle}>Suggest Products</Text>
        <Text style={styles.sheetSub}>
          Didn't find what you are looking for? Please suggest the products
        </Text>

        <TextInput
          style={styles.sheetInput}
          placeholder="Enter the name of the products you would like to see on Zepto."
          placeholderTextColor="#B0A8C8"
          multiline
          textAlignVertical="top"
          value={suggestText}
          onChangeText={setSuggestText}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: suggestText.trim() ? PINK : "#F9D0E5" },
          ]}
          activeOpacity={suggestText.trim() ? 0.8 : 1}
          onPress={handleSendSuggestion}
        >
          <Text style={[styles.sendBtnText, { color: suggestText.trim() ? "#fff" : "#E8A0C0" }]}>
            Send
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </SafeAreaView>
  );
};

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={26} color="#111" />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: "#F0F0F5",
    borderBottomWidth: 1, borderBottomColor: "#E8E8E8",
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  userRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#E8D9FF", justifyContent: "center", alignItems: "center" },
  userName: { fontSize: 22, fontWeight: "700" },
  userContact: { color: "#555", marginTop: 3, fontSize: 14 },
  quickRow: { flexDirection: "row", marginHorizontal: 15, gap: 10, marginBottom: 14 },
  quickAction: {
    flex: 1, backgroundColor: "#fff", borderRadius: 14, paddingVertical: 16,
    alignItems: "center", gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  quickLabel: { fontSize: 13, fontWeight: "500", textAlign: "center", color: "#111" },

  cashCard: {
    backgroundColor: "#EDE7FF", marginHorizontal: 15, borderRadius: 16,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, marginBottom: 18,
  },
  cashTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  cashIconWrap: { width: 34, height: 34, borderRadius: 9, backgroundColor: "#D9CEFF", alignItems: "center", justifyContent: "center" },
  cashTitle: { fontSize: 15, fontWeight: "600", color: "#3D008A", flex: 1 },
  cashDivider: { height: 1, backgroundColor: "#D8CFFF", marginVertical: 12 },
  cashBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cashBalance: { fontSize: 14, color: "#555" },
  addBalanceBtn: {
    backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#CCC",
    paddingHorizontal: 14, paddingVertical: 7,
  },
  addBalanceText: { fontWeight: "600", fontSize: 13, color: "#111" },

  sectionLabel: { fontSize: 16, fontWeight: "700", marginHorizontal: 20, marginBottom: 10 },
  listCard: { backgroundColor: "#fff", marginHorizontal: 15, borderRadius: 16, paddingHorizontal: 15 },
  logoutBtn: { backgroundColor: "#fff", marginHorizontal: 15, marginTop: 16, borderRadius: 16, padding: 18, alignItems: "center" },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#111" },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sheetClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center",
  },
  sheetTitle: { fontSize: 22, fontWeight: "800", color: "#111", textAlign: "center", marginTop: 4, marginBottom: 10 },
  sheetSub: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20, marginBottom: 20, paddingHorizontal: 8 },
  sheetInput: {
    backgroundColor: "#F0EEFF", borderRadius: 14,
    padding: 16, fontSize: 14, color: "#333",
    height: 130, lineHeight: 20,
    marginBottom: 20,
  },
  sendBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: "center",
  },
  sendBtnText: { fontSize: 16, fontWeight: "700" },
});

export default ProfilePage;

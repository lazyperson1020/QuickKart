import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import ProfileElementCard from "./profileElementCard";

const ProfilePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name ?? "");
          setContact(data.contact ?? "");
        }
        const addrSnap = await getDocs(collection(db, "users", user.uid, "addresses"));
        setAddressCount(addrSnap.size);
      } catch {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F0F5" }}>
      {/* Sticky header — outside ScrollView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() && router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User info */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color="#7E57C2" />
          </View>
          <View style={{ marginLeft: 14 }}>
            {loading ? (
              <ActivityIndicator color="#7E57C2" />
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
          <QuickAction icon="bag-outline" label={"Your\nOrders"} onPress={() => router.push("/(tabs)/orders")} />
          <QuickAction icon="chatbubble-ellipses-outline" label={"Help &\nSupport"} onPress={() => Alert.alert("Help & Support", "Coming soon!")} />
          <QuickAction icon="heart-outline" label={"Your\nWishlist"} onPress={() => router.push("/profile/wishlistPage")} />
        </View>


        {/* Your Information */}
        <Text style={styles.sectionLabel}>Your Information</Text>
        <View style={styles.listCard}>
          <ProfileElementCard title="Your Refunds" icon="cash-outline" onPress={() => router.push("/profile/refundsPage")} />
          <ProfileElementCard title="Your Wishlist" icon="heart-outline" onPress={() => router.push("/profile/wishlistPage")} />
          <ProfileElementCard title="Help & Support" icon="chatbubble-ellipses-outline" onPress={() => Alert.alert("Help & Support", "Coming soon!")} />
          <ProfileElementCard
            title="Saved Addresses"
            icon="location-outline"
            subtitle={`${addressCount} Address${addressCount !== 1 ? "es" : ""}`}
            onPress={() => router.push("/address/addressList")}
          />
          <ProfileElementCard title="Profile" icon="person-circle-outline" onPress={() => router.push("/profile/profileEditPage" as any)} />
          <ProfileElementCard title="Rewards" icon="gift-outline" onPress={() => Alert.alert("Rewards", "Coming soon!")} />
          <ProfileElementCard title="Payment Management" icon="card-outline" onPress={() => Alert.alert("Payment Management", "Coming soon!")} />
        </View>

        {/* Other Information */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Other Information</Text>
        <View style={styles.listCard}>
          <ProfileElementCard title="Suggest Products" icon="star-outline" onPress={() => Alert.alert("Suggest Products", "Coming soon!")} />
          <ProfileElementCard title="Policies" icon="document-text-outline" onPress={() => router.push("/profile/policyPage")} />
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 16, marginBottom: 30 }}>
          <Text style={{ color: "#AAA", fontSize: 12 }}>QuickKart v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
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
  cashCard: { backgroundColor: "#EDE7FF", marginHorizontal: 15, borderRadius: 16, padding: 16, marginBottom: 14 },
  cashTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cashIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#D9CEFF", alignItems: "center", justifyContent: "center" },
  cashTitle: { fontSize: 15, fontWeight: "600", color: "#3D008A" },
  cashBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cashBalance: { fontSize: 14, color: "#555" },
  addBalanceBtn: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  addBalanceText: { fontWeight: "600", fontSize: 13, color: "#111" },
  updateRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F0F0F5", marginHorizontal: 15, marginBottom: 18,
    paddingVertical: 12,
  },
  updateIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E8E8E8", alignItems: "center", justifyContent: "center" },
  updateTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  updateSub: { fontSize: 12, color: "#777", marginTop: 2 },
  newBadge: { backgroundColor: "#4CAF50", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  newBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  sectionLabel: { fontSize: 16, fontWeight: "700", marginHorizontal: 20, marginBottom: 10 },
  listCard: { backgroundColor: "#fff", marginHorizontal: 15, borderRadius: 16, paddingHorizontal: 15 },
  logoutBtn: { backgroundColor: "#fff", marginHorizontal: 15, marginTop: 16, borderRadius: 16, padding: 18, alignItems: "center" },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#111" },
});

export default ProfilePage;

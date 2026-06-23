import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set white base background so layout gaps melt away
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryTime: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000",
    letterSpacing: -0.5,
  },
  address: {
    marginTop: 2,
    fontSize: 13,
    color: "#444",
    fontWeight: "500",
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileIcon: {
    fontSize: 16,
  },
  storeList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  storeChip: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  storeChipText: {
    fontWeight: "700",
    fontSize: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // Light gray background tracking Zepto specification
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46, // Clean operational height profile
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    fontSize: 15,
    color: "#6B7280",
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  bannerRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  bannerLeft: {
    flex: 1,
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 16,
  },
  bannerRight: {
    flex: 1,
    backgroundColor: "#6d28d9",
    borderRadius: 16,
    padding: 16,
  },
  bannerTitleLarge: {
    color: "white",
    fontWeight: "800",
    fontSize: 20,
  },
  bannerTitleSmall: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },
  bannerSubtitle: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  productList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 40,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  productIcon: {
    fontSize: 28,
  },
  productLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
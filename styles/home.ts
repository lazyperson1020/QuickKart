import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9D5FF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deliveryTime: {
    fontSize: 28,
    fontWeight: "bold",
  },
  address: {
    marginTop: 5,
    fontSize: 15,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    color: "white",
    fontSize: 20,
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
    backgroundColor: "white",
    margin: 20,
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#888",
    fontSize: 15,
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
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
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

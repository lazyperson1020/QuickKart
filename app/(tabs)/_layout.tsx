import { Stack, useRouter, usePathname } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const HIDE_ON_SCREENS = ["/productDetails", "/address", "/orderTracking", "/orders"];

function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const cartItems = useSelector((state: RootState) => state.cart);
  let totalCartCount = 0;
  cartItems.forEach((item) => {
    totalCartCount = totalCartCount + item.quantity;
  });

  let shouldHide = false;
  for (let i = 0; i < HIDE_ON_SCREENS.length; i++) {
    if (pathname.startsWith(HIDE_ON_SCREENS[i])) {
      shouldHide = true;
      break;
    }
  }

  if (shouldHide === true) {
    return null;
  }

  const tabs = [
    { path: "/home",                icon: "home-outline",   activeIcon: "home",   label: "Home"    },
    { path: "/search",              icon: "search-outline", activeIcon: "search", label: "Search"  },
    { path: "/cart",                icon: "cart-outline",   activeIcon: "cart",   label: "Cart"    },
    { path: "/profile/profilePage", icon: "person-outline", activeIcon: "person", label: "Profile" },
  ];

  let safeBottomPadding = insets.bottom;
  if (safeBottomPadding < 8) {
    safeBottomPadding = 8;
  }

  return (
    <View style={[styles.bar, { paddingBottom: safeBottomPadding }]}>
      {tabs.map((tab) => {
        const isCurrentRoute = pathname === tab.path;
        const isSubRoute = pathname.startsWith(tab.path + "/");
        const isActive = isCurrentRoute || isSubRoute;

        const itemColor = isActive ? "#35035C" : "#9CA3AF";
        const iconName = isActive ? tab.activeIcon : tab.icon;

        let badgeText = String(totalCartCount);
        if (totalCartCount > 99) {
          badgeText = "99+";
        }

        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => {
              router.push(tab.path as any);
            }}
          >
            <View>
              <Ionicons name={iconName as any} size={24} color={itemColor} />
              
              {tab.path === "/cart" && totalCartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.label, { color: itemColor }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#e91e63",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});
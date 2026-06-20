import { Stack, useRouter, usePathname } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Animated, { useAnimatedStyle, interpolate, Extrapolate, makeMutable } from "react-native-reanimated";

const HIDE_ON_SCREENS = ["/productDetails", "/address", "/orderTracking", "/orders", "/cart","/profile/wishlistPage"];

// Global thread pointers shared with home.tsx
export const globalLayoutScrollY = makeMutable(0);
export const globalBottomBarVisible = makeMutable(1); // 1 = visible, 0 = hidden

// Core visual content size constant without notch considerations
export const TAB_BAR_RAW_HEIGHT = 54; 

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

  // Dynamic height mapping adapts on-the-fly to your active mobile screen configuration context
  const totalBarHeightOnDevice = TAB_BAR_RAW_HEIGHT + insets.bottom;

  /* ==================== SCREEN COMPLIANT ANIMATION MATRIX ==================== */
  const animatedTabBarStyle = useAnimatedStyle(() => {
    const hiddenOffscreenDistance = totalBarHeightOnDevice + 20;
    
    const translateY = interpolate(
      globalBottomBarVisible.value,
      [0, 1],
      [hiddenOffscreenDistance, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });
  /* ========================================================================= */

  if (shouldHide === true) {
    return null;
  }

  const tabs = [
  { 
    path: "/home", 
    icon: "home-outline", 
    activeIcon: "home", 
    label: "Home" 
  },
  { 
    path: "/allProducts", 
    icon: "grid-outline", 
    activeIcon: "grid", 
    label: "Categories" 
  },
  { 
    path: "/orders", // Points to your order history screen so users can quickly tap previous orders
    icon: "refresh-outline", 
    activeIcon: "refresh", 
    label: "Buy Again" 
  },
  { 
    path: "/search", // Can point to a dynamic promotions feed or your search/results hub
    icon: "gift-outline", 
    activeIcon: "gift", 
    label: "Deals" 
  },
];

  // Set minimum safety buffer context parameters
  const safeBottomPadding = insets.bottom > 0 ? insets.bottom : 6;

  return (
    <Animated.View style={[
      styles.bar, 
      { 
        height: totalBarHeightOnDevice, 
        paddingBottom: safeBottomPadding 
      }, 
      animatedTabBarStyle
    ]}>
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
              <Ionicons name={iconName as any} size={22} color={itemColor} />
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
    </Animated.View>
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
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
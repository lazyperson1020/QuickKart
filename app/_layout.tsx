import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { store, persistor } from "./redux/store";
import { auth } from "../firebase";
import { setWishlist } from "./redux/wishlistSlice";
import { loadWishlistFromFirestore } from "./utils/wishlistFirestore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold });

  useEffect(() => { if (fontsLoaded) { (Text as any).defaultProps = (Text as any).defaultProps ?? {}; (Text as any).defaultProps.style = { fontFamily: "Inter_400Regular" }; } }, [fontsLoaded]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) { try { const items = await loadWishlistFromFirestore(u.uid); store.dispatch(setWishlist(items)); } catch (e) { console.error("Wishlist load error:", e); } } 
      else { store.dispatch(setWishlist([])); }
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => { if (!authLoading && fontsLoaded) SplashScreen.hideAsync(); }, [authLoading, fontsLoaded]);

  useEffect(() => {
    if (authLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) { router.replace("/(auth)/login"); } 
    else if (user && inAuthGroup) { router.replace("/"); }
  }, [user, authLoading, segments, router]);

  if (authLoading || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
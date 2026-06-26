import React, { useEffect, useRef, useState } from 'react';
import { Text, StatusBar, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import messaging, { type FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import { handleNotifeeData } from './src/utils/notifeeStockHandler';
import { store, persistor } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import {
  setupNotificationChannels,
  setupForegroundHandler,
  saveFcmToken,
  unsubscribeFromStockTopic,
} from './src/services/notificationService';
import BackgroundFetch from 'react-native-background-fetch';
import { runStockCheck } from './src/utils/stockCheckTask';
import { auth } from './firebase.native';

async function handleFcmNotificationTap(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  const { data } = remoteMessage;
  if (!data?.type) return;

  // Stock-specific cleanup: unsubscribe from FCM topic so user isn't re-notified
  if (data.type === 'stock' && data.productId) {
    const sku = (data.sku || data.productId) as string;
    await unsubscribeFromStockTopic(sku);
    await AsyncStorage.removeItem(`notify_sub_${sku}`);
  }

  await handleNotifeeData(data);
}

messaging().setBackgroundMessageHandler(async () => {});

export default function App() {
  const [navReady, setNavReady] = useState(false);
  const pendingNotifRef = useRef<FirebaseMessagingTypes.RemoteMessage | null>(null);
  const pendingNotifeeRef = useRef<Record<string, any> | null>(null);

  // Resolve quit-state notifications as early as possible; navigate once nav is ready
  useEffect(() => {
    // FCM: app was killed, notification tapped to open
    messaging().getInitialNotification().then((msg) => {
      if (!msg) return;
      if (navReady) handleFcmNotificationTap(msg);
      else pendingNotifRef.current = msg;
    });

    // Notifee: local notification (order or stock check) tapped to open
    notifee.getInitialNotification().then((initial) => {
      if (!initial) return;
      const data = initial.notification?.data;
      if (navReady) handleNotifeeData(data);
      else pendingNotifeeRef.current = data ?? null;
    });
  }, []);

  useEffect(() => {
    if (!navReady) return;
    if (pendingNotifRef.current) {
      handleFcmNotificationTap(pendingNotifRef.current);
      pendingNotifRef.current = null;
    }
    if (pendingNotifeeRef.current) {
      handleNotifeeData(pendingNotifeeRef.current);
      pendingNotifeeRef.current = null;
    }
  }, [navReady]);

  useEffect(() => {
    SplashScreen.hide();

    (Text as any).defaultProps = (Text as any).defaultProps ?? {};
    (Text as any).defaultProps.style = { fontFamily: 'Inter_400Regular' };

    // Android 13+ (API 33) requires explicit POST_NOTIFICATIONS permission at runtime
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    setupNotificationChannels();
    const unsubscribeForeground = setupForegroundHandler();

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,   // minutes — Android enforces 15 min minimum
        stopOnTerminate: false,      // keep running after app is killed
        startOnBoot: true,           // re-schedule after device reboot
        enableHeadless: true,        // allow headless JS when app is terminated
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      },
      async (taskId) => {
        await runStockCheck();
        BackgroundFetch.finish(taskId);
      },
      (taskId) => {
        // Timeout — must call finish or Android will penalise the app
        BackgroundFetch.finish(taskId);
      },
    );

    // Background state: FCM notification tapped while app was in background
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      handleFcmNotificationTap,
    );

    // Foreground state: Notifee notification tapped while app is open
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotifeeData(detail.notification?.data);
      }
    });

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) saveFcmToken(user.uid);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
      unsubscribeNotifee();
      unsubscribeAuth();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NavigationContainer ref={navigationRef} onReady={() => setNavReady(true)}>
              <RootNavigator />
            </NavigationContainer>
            <Toast />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

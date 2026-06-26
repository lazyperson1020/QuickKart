/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { stockCheckHeadlessTask } from './src/utils/stockCheckTask';
import notifee, { EventType } from '@notifee/react-native';
import { handleNotifeeData } from './src/utils/notifeeStockHandler';

AppRegistry.registerComponent(appName, () => App);

// Must be registered here so Android can invoke it when the app is terminated
BackgroundFetch.registerHeadlessTask(stockCheckHeadlessTask);

// Handles taps on Notifee local notifications (from the background stock check task)
// when the app is in background. For killed state, notifee.getInitialNotification() in App.tsx handles it.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    await handleNotifeeData(detail.notification?.data);
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../localization/LanguageContext';

export default function OrderTrackingScreen() {
  const { t } = useTranslation();
  return (
    <View style={s.container}>
      <Text style={s.text}>{t.orderTracking.title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#333' },
});

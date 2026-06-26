import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrderTrackingScreen() {
  return (
    <View style={s.container}>
      <Text style={s.text}>Order Tracking</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#333' },
});

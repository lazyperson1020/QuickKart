import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OrderPlacedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    const timer = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={S.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name="checkmark-circle" size={100} color="#2E7D32" />
      </Animated.View>
      <Text style={S.title}>Order Placed!</Text>
      <Text style={S.subtitle}>Your order has been confirmed{'\n'}and will be delivered soon.</Text>
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

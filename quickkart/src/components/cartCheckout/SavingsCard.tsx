import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  savings: number;
}

export default function SavingsCard({ savings }: Props) {
  if (savings <= 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="gift-outline"
          size={20}
          color="#2e7d32"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>
          Total savings on this order
        </Text>

        <Text style={styles.savingsText}>
          You save ₹{savings}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },

  savingsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2e7d32',
  },
});
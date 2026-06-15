import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SeeAllButtonProps {
  category: string;
  categoryTitle: string;
}

export default function SeeAllButton({ category, categoryTitle }: SeeAllButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/allProducts',
          params: { category, categoryTitle },
        } as any)
      }
    >
      <Text style={styles.label}>See all</Text>
      <Ionicons name="chevron-forward" size={16} color="#111" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
});

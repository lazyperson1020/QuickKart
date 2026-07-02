import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSinglePress } from '../hooks/useSinglePress';
import type { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../localization/LanguageContext';

interface SeeAllButtonProps {
  category: string;
  categoryTitle: string;
}

export default function SeeAllButton({ category, categoryTitle }: SeeAllButtonProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const handlePress = useSinglePress(() =>
    navigation.navigate('CategoryDetail', { category, categoryTitle })
  );

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Text style={styles.label}>{t.common.seeAllPlain}</Text>
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

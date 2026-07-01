import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingCartPanel from '../../components/FloatingCartPanel';
import AllCategoriesGrid from '../../components/AllCategoriesGrid';
import { useTranslation } from '../../localization/LanguageContext';

// ── Component ──────────────────────────────────────────────────────────────────

export default function AllCategoriesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={{ width: 56 }} />
        <Text style={styles.headerTitle}>{t.allProducts.screenTitle}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Wishlist')}>
            <Ionicons name="heart-outline" size={24} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} style={{ marginLeft: 16 }} onPress={() => navigation.navigate('SearchResults', { query: undefined })}>
            <Ionicons name="search-outline" size={24} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}>
        <AllCategoriesGrid />
      </ScrollView>

      <FloatingCartPanel />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111', textAlign: 'center' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', width: 56, justifyContent: 'flex-end' },
  scrollContent: { paddingTop: 4 },
});

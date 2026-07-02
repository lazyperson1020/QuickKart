import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase.native';

const PINK = '#E91E8C';

type FaqCategory = {
  id: string;
  title: string;
  order: number;
};

export default function HelpSupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'faq_categories'), orderBy('order')),
      (snap) => {
        setCategories(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FaqCategory, 'id'>) }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F5' }}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Help & Support</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={S.loader}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={S.faqHeading}>FAQs</Text>

          <View style={S.faqCard}>
            {categories.map((cat, i) => (
              <TouchableOpacity
                key={cat.id}
                style={[S.faqRow, i === categories.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() =>
                  navigation.navigate('FaqCategory', {
                    categoryId: cat.id,
                    categoryTitle: cat.title,
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={S.faqText}>{cat.title}</Text>
                <Ionicons name="chevron-forward" size={18} color={PINK} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: '#F0F0F5',
    borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqHeading: {
    fontSize: 18, fontWeight: '700', color: '#111',
    marginHorizontal: 20, marginTop: 24, marginBottom: 10,
  },
  faqCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  faqRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  faqText: { fontSize: 15, color: '#222', fontWeight: '400' },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { collection, onSnapshot, limit, query } from 'firebase/firestore';
import { db } from '../../../firebase.native';

const PINK = '#E91E8C';

const FAQS = [
  'General Inquiry',
  'Payment Related',
  'Feedback & Suggestions',
  'Order / Products Related',
  'Gift Card',
  'No-Cost EMI',
  'Wallet Related',
  'Zepto Club',
  'Referral',
  'Coca Cola campaign',
];

export default function HelpSupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'products', 'Electronics', 'ElectronicsCollection'), limit(8)),
      (snap) => {
        if (!snap.empty) {
          setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } else {
          const unsubSnacks = onSnapshot(
            query(collection(db, 'products', 'Snacks', 'SnacksCollection'), limit(8)),
            (snap2) => { setProducts(snap2.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); },
            () => {}
          );
          return unsubSnacks;
        }
      },
      () => {}
    );
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F5' }}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Help & Support</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Product carousel
        {products.length > 0 && (
          <View style={S.carouselCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, gap: 10, paddingVertical: 12 }}
            >
              {products.map(p => (
                <TouchableOpacity key={p.id} style={S.carouselItem} activeOpacity={0.8}>
                  <Image
                    source={{ uri: p.imageUrl }}
                    style={S.carouselImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )} */}

        {/* FAQs heading */}
        <Text style={S.faqHeading}>FAQs</Text>

        {/* FAQ list */}
        <View style={S.faqCard}>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={faq}
              style={[S.faqRow, i === FAQS.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => Alert.alert(faq, 'This section is coming soon.')}
              activeOpacity={0.7}
            >
              <Text style={S.faqText}>{faq}</Text>
              <Ionicons name="chevron-forward" size={18} color={PINK} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
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

  carouselCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  carouselItem: {
    width: 80, height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  carouselImage: { width: 68, height: 68 },

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

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Wallet Related';

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'I am not able to add money to my Quickkart Cash',
    answer:
      'Apologies for the inconvenience caused. Please update the app to the latest version from the App Store or Google Play Store and try again',
  },
  {
    question: 'I am not able to see the money refunded to my Quickkart Cash. What should I do?',
    answer:
      "We're sorry for the inconvenience caused. Please update the app to the latest version from the App Store or Google Play Store and check again.",
  },
  {
    question: 'What is Quickkart Cash?',
    answer:
      '1. Quickkart Cash is a wallet service offered to the customers, which can be used for purchase of Products until expiry.\n\n2. Quickkart Cash is valid for 12 months from the date of issue unless specified a validity period. Quickkart Cash is not refundable.\n\n3. Quickkart Cash can be used in such cities where Quickkart is operating and shall be subject to Platform Terms of Use and applicable laws.\n\n4. You can purchase Quickkart Cash using any available payment methods. You can also redeem Vouchers to add Quickkart Cash into your wallet.\n\n5. Quickkart Cash will be auto-applied on the checkout page when applicable.',
  },
  {
    question: 'I am unable to use my Quickkart Cash',
    answer:
      "We're really sorry for the experience. Please reach out to us on support@quickkart.com",
  },
];

export default function WalletRelatedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Help</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={S.sectionTitle}>{CATEGORY}</Text>

        <View style={S.listCard}>
          {FAQS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[S.row, i === FAQS.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() =>
                navigation.navigate('FaqDetail', {
                  question: item.question,
                  answer: item.answer,
                  category: CATEGORY,
                })
              }
              activeOpacity={0.7}
            >
              <Text style={S.rowText}>{item.question}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  listCard: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  rowText: { fontSize: 15, color: '#222', flex: 1, marginRight: 8 },
});

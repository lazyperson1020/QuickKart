import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'No-Cost EMI';

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is EMI?',
    answer:
      'EMI allows you to pay for products in installments with an additional interest as charged by the bank. Quickkart offers this functionality on select products via Credit Cards.',
  },
  {
    question: 'What is No-Cost EMI?',
    answer:
      'No-Cost EMI allows you to pay for products in installments without additional interest. The bank will continue to charge interest; however, this interest amount is offset by an upfront discount provided to the user while placing the order.',
  },
  {
    question: 'How do I know if a product has a No-Cost EMI offer?',
    answer:
      'Products with a No-Cost EMI offer will have a "No-Cost EMI" tag displayed on the product detail page and in the cart. If your cart contains products without this offer, those will be processed with standard EMI or excluded from the EMI option.',
  },
  {
    question: 'Will I be charged any processing fees?',
    answer: 'Some banks may charge processing fees. For more details, reach out to your bank.',
  },
  {
    question: 'What happens if I cancel or return a product purchased with No-Cost EMI?',
    answer:
      "In the event of a return of items purchased under the EMI facility, refunds will be processed on behalf of the sellers as per Quickkart's refund policy. Customers are advised to consult their respective bank/issuer regarding the impact of such returns on the EMI terms including any pre-closure charges or interest adjustments.",
  },
  {
    question: 'What are some other Terms and Conditions I should be aware of?',
    answer:
      'Quickkart facilitates an Equated Monthly Installments ("EMI") payment option for eligible purchases made on its platform using approved payment methods. The availability of the EMI facility is solely at the discretion of the respective banks. Quickkart disclaims any liability for the provision or non-provision of the EMI facility by the banks/issuer.\nApplicable Goods and Services Tax (GST) will be charged on such fees as per prevailing regulations.\nEMI options are subject to approval by the respective bank. Customers must adhere to all terms and conditions specified by the issuing bank for availing of the EMI facility.\nQuickkart reserves the right to withdraw, discontinue, or modify the availability of the EMI or No Cost EMI payment options at any time, without prior notice and without incurring any liability.\nQuickkart shall not be held responsible for any disputes arising from or related to the EMI facility provided/facilitated by the respective banks/issuer pertaining to the accuracy, completeness or authenticity of EMI-related information shared by the banks/issuer and displayed on the Quickkart platform.\nThe EMI facility is facilitated by the issuer/respective banks. Quickkart does not play any role in the approval, pricing, modification, pre-closure or closure of the EMI facility which is entirely at the discretion of the issuing bank.',
  },
];

export default function NoCostEMIScreen() {
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

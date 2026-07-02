import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Payment Related';

const FAQS: Array<{
  question: string;
  answer: string;
  hasContactFooter?: boolean;
  hasLink?: boolean;
}> = [
  {
    question: 'What are the modes of payment?',
    answer:
      '"The following modes of payment are available on our app:\n a. Cash on Delivery (COD), after the first order is placed via Online Payment.\n b. Visa, Mastercard, and Rupay-credit and debit cards.\n c. CRED Pay\n d. Wallets (Freecharge, Mobikwik, PayZapp)\n e. Pay Later (SIMPL, LazyPay)\nIf the order must be left at the security gate, please continue to pay online using wallets, UPI, net banking, or credit/debit cards."',
  },
  {
    question: 'How do I change the mode of payment?',
    answer:
      "Since the orders are already out for delivery shortly, it's not possible to change the payment method at this time.",
  },
  {
    question: 'Is It safe to use my debit/credit card to shop on Quickkart?',
    answer:
      'Yes, it is. All transactions on Quickkart are completed via secure payment gateways that are PCI DSS compliant. We do not store your card details at any point.',
  },
  {
    question: 'How can I delete my saved card details?',
    answer: 'You can contact us through email mentioned below to delete your card details.',
    hasContactFooter: true,
  },
  {
    question: 'Do you accept Sodexo, ticket restaurants etc.?',
    answer: 'You may check the Quickkart app for the same.',
  },
  {
    question: 'Why is my COD blocked?',
    answer:
      "When orders are placed and cancelled, post packing or delivering, the COD gets disabled. Please place an order using the 'Online Payment' option. As soon as your order is marked as 'Delivered', the system will automatically enable COD on your account.",
  },
  {
    question: 'What is the limit to place a COD order?',
    answer: 'You can place a COD order with a value of upto Rs 700.',
  },
  {
    question: 'What are the small cart fees?',
    answer:
      'It is a nominal charge for rendering the services of picking and packing the products for you. If your order value is more than a certain amount, this value is waived. The minimum amount benchmark and subsequent small-cart fees will be specified on the checkout page.',
  },
  {
    question: 'Is there a delivery fee for each order?',
    answer:
      'Delivery fee is only applied below a certain MOV which is communicated on the cart page.',
  },
  {
    question: 'Do you charge for the Bag ?',
    answer: 'No, sellers dont levy separate charge for the bag.',
  },
];

export default function PaymentRelatedScreen() {
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
                  hasContactFooter: item.hasContactFooter,
                  hasLink: item.hasLink,
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
    marginHorizontal: 0,
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

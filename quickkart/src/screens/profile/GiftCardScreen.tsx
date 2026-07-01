import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Gift Card';

const FAQS: Array<{
  question: string;
  answer: string;
  hasContactFooter?: boolean;
}> = [
  {
    question: 'Can I use my Quickkart cash to buy Gold or Silver coins?',
    answer:
      'Please note that you cannot use Quickkart Cash [uploaded via Gift Card or otherwise] to purchase Gold or Silver coins on the Quickkart platform.\n\nThe same is also mentioned in the terms of use which can be found in the app.',
  },
  {
    question: "What is 'Add Gift card' on Quickkart Cash?",
    answer:
      "The 'Add Gift Card' allows you to add gift cards purchased to Quickkart Cash through platforms like HDFC SmartBuy, Gyftr, Axis Bank, Kotak Bank, Woohoo, Amazon, Cred, and Paytm!",
  },
  {
    question: 'How do I add my Gift Card?',
    answer:
      "To add your Gift Card to Quickkart Cash follow the following steps:\n1. Click on the Profile Icon on your Quickkart Homepage\n2. Click on 'Add Money' on the Wallet and Gift Card section\n3. Click on 'Add card' on the 'Have a Gift Card?' strip.\n4. Enter the 16 digit Gift Card Code and the 6-digit pin\n5. Click on 'Add Gift Card' to successfully add the Gift Card!",
  },
  {
    question: 'Where can I buy a Gift Card?',
    answer: 'You can buy gift cards directly on Quickkart App, HDFC SmartBuy, Gyftr etc.',
  },
  {
    question: 'Are there any fees associated with redeeming Gift Cards?',
    answer:
      'There are no additional fees for redeeming gift cards on our platform. The value of the gift card will be applied directly to your purchase.',
  },
  {
    question: 'What should I do if my Gift Card is not working?',
    answer:
      'If your Gift Card is not working, please check that you have entered the 16 digit Card code and 6 digit PIN accurately while redeeming your Gift Card.',
    hasContactFooter: true,
  },
  {
    question: 'Can I use multiple Gift Cards for a single purchase?',
    answer:
      'Yes, you can use multiple Gift Cards during a single transaction. You will have to add all Gift Cards into Quickkart Cash and then use the balance to purchase anything on Quickkart',
  },
  {
    question: 'Is there an expiry date for the Gift Card?',
    answer:
      'The expiry date for Gift Card amount is 1 year from the day of balance addition to Quickkart Cash.',
  },
  {
    question: 'How will I receive the Gift Card that I purchased?',
    answer:
      'Once purchased, Gift Card will be sent to your registered email address and mobile number with Gift Card credentials.',
  },
];

export default function GiftCardScreen() {
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

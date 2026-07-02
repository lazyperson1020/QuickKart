import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Referral';

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is the Referral Program?',
    answer:
      "Quickkart's Referral Program lets you invite people to shop on Quickkart. Your reward gets credited within 24 hours of the qualifying order being successfully delivered and not returned. The user you referred gets a head start with a referral gift for joining with the code & placing an order.",
  },
  {
    question: 'Who can participate ?',
    answer:
      'Any registered eligible Quickkart users with a verified mobile number can participate in the Program. Quickkart reserves the right to determine eligibility at its sole discretion.',
  },
  {
    question: 'Who can I refer?',
    answer:
      "You can refer anyone you think would enjoy shopping on Quickkart. Eligibility for the Referee is determined based on Quickkart's internal policies. The easiest way to check eligibility is to grant Quickkart access to your contact book in the application; eligible contacts will be automatically highlighted to you. You can also refer without granting access to the contact book as well.",
  },
  {
    question: 'Is there a limit on how many people I can refer?',
    answer:
      'You may invite as many people as you like. There is no limit to the number of people you can refer. However, rewards you can receive are limited and capped at the first 10 successful referrals.',
  },
  {
    question: 'What does the referrer receive?',
    answer:
      "When someone you referred completes a qualifying order you will receive Q-Coins as mentioned at the time of referral. Q-Coins are credited to your account within 24 hours of the Referee's qualifying order being successfully delivered and not returned or cancelled.",
  },
  {
    question: 'What does the person I refer receive?',
    answer:
      'Referee is eligible to receive a gift upon joining the Quickkart app with your referral code. The gift can be claimed by the Referee on any order within the next 15 days or in the first order itself.',
  },
  {
    question: 'When will rewards be credited?',
    answer:
      'Q-Coins for Referrer are credited within 24 hours of the qualifying order being successfully delivered and not returned and the Referee can select the gift on any order within the next 15 days or in the first order itself.',
  },
  {
    question: 'Do rewards expire?',
    answer:
      'Yes. Expiry periods are as follows:\na) Referee Gift: valid for 15 days from the date of credit.\nb) Referrer Q-Coins: valid for 2 months from the date of credit.\nExpired rewards cannot be reinstated under any circumstances.',
  },
  {
    question: 'Can I convert my rewards to cash?',
    answer:
      'No. Gifts and Q-Coins issued under this Program cannot be transferred, encashed, or redeemed outside the Quickkart Platform.',
  },
  {
    question: 'What is the limited referral event?',
    answer:
      "During a limited referral event, completing a specified number of qualifying referrals unlocks a chance for receiving an aspirational gift and remaining other eligible participants are eligible for the gift as will be displayed on Quickkart App. Selection is randomized and Quickkart's decision is final. This will not be applicable in the state of Tamil Nadu.",
  },
  {
    question: 'I referred someone but did not receive a reward - why?',
    answer:
      "Common reasons include:\na) The person did not use your specific referral link or was not invited via your contact book.\nb) The person was not eligible under Quickkart's referral conditions.\nc) The order placed by the Referee was cancelled or returned.\nd) Your account was flagged for suspicious or fraudulent activity",
  },
  {
    question: 'What counts as a qualifying order?',
    answer:
      'A referral is successful only when: (a) the referred person signs up using your referral link and completes first order upto a minimum order value threshold that is successfully delivered and not cancelled or returned.',
  },
];

export default function ReferralScreen() {
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

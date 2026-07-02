import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Quickkart Club';

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is Quickkart Club?',
    answer:
      'Quickkart Club is a loyalty membership program that offers selected eligible users enhanced experience which includes benefits such as Q-Coin cashback, certain priority service features, etc.',
  },
  {
    question: 'Is Quickkart Club available to all Users?',
    answer:
      'Currently, participation in Quickkart Club is strictly on an invitation-only basis. User eligibility is determined at the sole and absolute discretion of Quickkart.',
  },
  {
    question: 'What is the membership fee for Quickkart Club?',
    answer:
      'Quickkart Club membership fee will be clearly displayed on Your account prior to purchase. Please note that the fee is non-refundable, non-transferable, non-exchangeable, and subject to applicable taxes. The membership is User specific and cannot be gifted or transferred to any other User or account.',
  },
  {
    question: 'Is Quickkart Club subscription mandatory?',
    answer:
      'No. Participation and subscription to the Quickkart Club is strictly voluntary. Quickkart Club Users retain the unrestricted right to access the Platform and place orders without participating in Quickkart Club as well.',
  },
  {
    question: 'How do I sign up for Quickkart Club?',
    answer:
      'If you are eligible, you can sign up for Quickkart Club by accessing Quickkart Club details page via the profile section or other in-app prompts and successfully paying the applicable membership fee.',
  },
  {
    question: 'What is the validity period of Quickkart Club membership?',
    answer:
      'Quickkart Club membership is valid for thirty (30) days from the date of successful purchase and activation.',
  },
  {
    question: 'What happens when my Quickkart Club membership expires?',
    answer:
      'Upon expiration, Your fresh Quickkart Club benefits will automatically cease. If Quickkart, at its sole discretion, determines that You are eligible for continued participation in the Quickkart Club for a subsequent term, such eligibility shall be communicated to You directly via Quickkart Club details page through Your profile section. In case, you are eligible for subsequent term, you may start availing fresh Quickkart Club benefits by subscribing to the Program.',
  },
  {
    question: 'Can I cancel my Quickkart Club membership?',
    answer:
      'Yes, You may request to cancel/ terminate Your membership at any time via email. Your cancellation request will be processed and actioned within three (3) business days of receipt. However, please be advised that cancellation does not entitle You to any refund of the membership fee or redemption of any unused benefits.',
  },
  {
    question: 'Can I transfer my membership to someone else?',
    answer:
      "No. Quickkart Club membership is non-transferable and are tied exclusively to the originally registered Quickkart Club User's account.",
  },
  {
    question: 'What happens in case of misuse or fraud?',
    answer:
      'In cases of suspected fraudulent activity, abuse, or misuse of the program, Quickkart reserves the right to immediately suspend or terminate Your membership and forfeit any accrued benefits without prior notice, in strict accordance with the Quickkart Club Terms and Conditions.',
  },
  {
    question: 'How do I contact support regarding Quickkart Club?',
    answer:
      'For any queries or assistance, please write to support@quickkart.com with the subject line "Quickkart Club."',
  },
  {
    question: 'Can Quickkart change benefits during my membership?',
    answer:
      'Yes, Quickkart reserves the absolute right to modify, amend, suspend, or withdraw the Quickkart Club program including its benefits, fees, and eligibility criteria at any time. Any such modifications will be updated on the Platform and shall become effective immediately, without individual prior notice.',
  },
];

export default function QuickkartClubScreen() {
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

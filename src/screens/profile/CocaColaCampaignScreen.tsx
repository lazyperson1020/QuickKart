import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Coca Cola campaign';

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'How do I participate in the Coca-Cola Match Day Hangout campaign?',
    answer:
      'Purchase any Coca-Cola product on Quickkart between 16 June and 20 July 2026. Once your order is successfully delivered, a scratch card will be available on the order tracking page. Scratch the card and follow the instructions to participate in the campaign. The scratch card code can also be found in the Rewards section of the Quickkart app.',
  },
  {
    question: 'I purchased a Coca-Cola product but did not receive a scratch card.',
    answer:
      'Your scratch card is unlocked after the successful delivery of any eligible Coca-Cola product purchased during the campaign period. Head to the Rewards section in the Quickkart app to find and scratch your card.',
  },
  {
    question: 'How do I access the campaign after receiving the scratch card?',
    answer:
      'Scratch your card and tap the link to get started. It will take you directly to the Coca-Cola microsite, where you can follow the steps to participate in the campaign.',
  },
  {
    question: "I'm unable to access the scratch card, microsite, or WhatsApp participation flow.",
    answer:
      "We're sorry you're experiencing this issue. The campaign microsite and WhatsApp journey are managed by Coca-Cola. Please contact indiahelpline@coca-cola.com for further assistance.",
  },
  {
    question: 'How do I know if my participation was successfully recorded?',
    answer:
      'Once the participation process is completed successfully, a confirmation will be shared via WhatsApp and/or email to your registered contact details.',
  },
  {
    question: 'I completed all the steps but have not received a confirmation.',
    answer:
      'Participation confirmations are shared via WhatsApp and/or email to your registered contact details. If you have completed all the participation steps but have not received a confirmation, please contact indiahelpline@coca-cola.com for further assistance.',
  },
  {
    question: 'How and when will winners be notified?',
    answer:
      "If you're selected as a winner, you'll be notified via WhatsApp and/or email using the contact details provided during participation.",
  },
  {
    question: 'I was selected but did not receive the WhatsApp notification or YouTube watchalong link.',
    answer:
      'For concerns related to winner notifications, WhatsApp communication, or access to the YouTube watchalong event, please contact indiahelpline@coca-cola.com for further assistance.',
  },
  {
    question: 'I accidentally deleted the WhatsApp message or cannot find the YouTube link.',
    answer:
      'For assistance related to campaign communications or watchalong access, please contact indiahelpline@coca-cola.com.',
  },
  {
    question: 'Who should I contact for issues related to the Coca-Cola microsite, WhatsApp journey, lucky draw, or watchalong event?',
    answer:
      'The Coca-Cola microsite, WhatsApp participation journey, lucky draw process, and watchalong event are managed by Coca-Cola. Please contact indiahelpline@coca-cola.com for assistance with these campaign-related issues.',
  },
];

export default function CocaColaCampaignScreen() {
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

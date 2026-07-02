import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const CATEGORY = 'Order / Products Related';

const FAQS: Array<{
  question: string;
  answer: string;
  hasContactFooter?: boolean;
  hasLink?: boolean;
}> = [
  {
    question: 'Can I change the delivery address of my order?',
    answer:
      'Once an order is placed, it cannot be routed to another address. You can return your order and place a new order after updating the delivery address.',
  },
  {
    question: 'Can I reschedule my order?',
    answer:
      'Since all orders are usually delivered at Quickkart speed, rescheduling is not required. If you have already placed an order, you have the option to return the order and place a new one when you are available.',
  },
  {
    question: 'Can I edit my cart / add items ?',
    answer:
      'Order is packed right away as soon it is accepted so it arrives to you quickly. As a result, it is impossible to make changes after placing the order.',
  },
  {
    question: 'Want the invoice/ pricing break-up ?',
    answer:
      "You can view invoice in the app from 'Orders' section or download from the link sent through sms from us after the order is placed. Please follow the link to open 'Order' section",
    hasLink: true,
  },
  {
    question: 'Do you take delivery instructions?',
    answer:
      'There are certain delivery options and capabilities like contactless delivery at the moment. However, we do envision having more options in the near future.',
  },
  {
    question: 'Is there a minimum order value?',
    answer:
      'You can place an order for any amount on the platform, as there is no minimum order value prescribed by sellers. However, a small fee may be applicable for orders below a certain cart value threshold.',
  },
];

export default function OrderProductsRelatedScreen() {
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

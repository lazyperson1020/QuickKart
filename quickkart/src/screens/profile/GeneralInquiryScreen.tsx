import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';

const FAQS: Array<{
  question: string;
  answer: string;
  hasContactFooter?: boolean;
  hasLink?: boolean;
}> = [
  {
    question: 'What is Quickkart Daily?',
    answer:
      'Quickkart Daily is a membership program that gives you access to certain benefits such as free delivery on orders above the order value Rs. 99 and discounts on select products.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'You will need to contact our customer support through “Chat With Us” option or email to delete your account.',
  },
  {
    question: 'How do I log in to the Quickkart app?',
    answer:
      'Once the app is installed, you could log in by entering your mobile number and validating it with an OTP.',
  },
  {
    question: "Quickkart doesn’t sell my favourite brand. How can I tell you about It?",
    answer:
      'We would love to hear what you think is missing on Quickkart. We are always open to new products to expand our selection. Just click on ‘Suggest Products Option’ on our app.',
    hasContactFooter: true,
  },
  {
    question: 'Tell me a little about Quickkart',
    answer:
      'Quickkart is a fast-growing startup that delivers groceries in 10 minutes through an optimized network of dark stores! We now deliver in more than 10 cities.',
    hasContactFooter: true,
  },
  {
    question: 'Do you charge any amount or taxes over and above the price of each item?',
    answer:
      'All our products prices are inclusive of taxes. We charge a nominal fee for rendering the services of packing & delivering your products. If applicable, the delivery fee and small-cart fee will be specified on the checkout page.',
  },
  {
    question: 'Do you deliver all beverages cold?',
    answer:
      "We try to deliver all cold beverages chilled. However, given that there is a delivery time involved, there can be times when the beverages aren’t as chilled.",
  },
  {
    question: 'How do you pack your veg and non-veg items?',
    answer: 'All veg & non-veg items are stored & packed separately.',
  },
  {
    question: 'How do I order anything from the paan corner?',
    answer:
      "You can find the Paan Corner section on our app. Simply browse through the Paan Corner category and add your desired items to the cart.",
  },
  {
    question: 'Do you follow discreet packaging for sexual wellness product?',
    answer:
      'Yes, we do follow discreet packaging for sexual wellness products. Your privacy is important to us and all such products are packed in plain, unmarked packaging.',
  },
  {
    question: 'What is the minimum order value?',
    answer:
      'You can place an order for any amount on Quickkart. There is no minimum order value or MOV. However, a small cart fee may be levied in case the cart value is below a certain threshold.',
  },
  {
    question: 'Want to work with us?',
    answer:
      'Thank you for your interest in working with Quickkart. Kindly share your updated resume with us at careers@quickkart.com and someone from our Human Resources team will connect with you if you fulfill our required criteria. We wish you all the best with your application!.',
    hasLink: true,
  },
  {
    question: 'What is the maximum COD limit?',
    answer: 'Yes, we do have a maximum limit of Rs.700 on COD orders.',
  },
  {
    question: 'Why is my ETA more than 10 minutes?',
    answer:
      'While our effort is always to deliver your order within 10 minutes, if there is a surge in demand or a traffic-related issue, it can sometimes take a bit longer for your order to be delivered. The estimated delivery time is always indicated in the app before you place your order.',
  },
  {
    question: 'Can I pay the rider by UPI?',
    answer: "We are working on this option. As of now, we don’t have this capability.",
  },
  {
    question: 'Why does Quickkart not deliver In my area?',
    answer:
      'We strive hard to ensure Quickkart is serviceable in as many areas as possible. You could head to the “Delivery Areas” page on our website to know more details about the areas we are currently serviceable in.',
  },
  {
    question: 'Can I make a product request which is not available on Quickkart?',
    answer:
      'Yes, we love when you let us know what you want from Quickkart! You can suggest products to us by clicking on the menu at the top right side of the App.',
    hasLink: true,
  },
  {
    question: 'Why are you not taking orders?',
    answer:
      'Due to higher order volumes, we are currently not accepting orders. You could check in after some time! Thank you for your patience!',
  },
  {
    question: 'Can I partner/sell with Quickkart?',
    answer:
      'You could e-mail us at below mentioned email ID and we could take this further from there.',
    hasContactFooter: true,
  },
  {
    question: 'Location serviceability / Non servicable area',
    answer:
      'We strive hard to ensure Quickkart is serviceable in as many areas as possible. You could head to the “Delivery Areas” page on our website to know more details about the areas we are currently serviceable in.',
  },
  {
    question: 'What are your timings?',
    answer: 'Our support team is here to help you 24*7',
  },
];

export default function GeneralInquiryScreen() {
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
        <Text style={S.sectionTitle}>General Inquiry</Text>

        <View style={S.listCard}>
          {FAQS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[S.row, i === FAQS.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() =>
                navigation.navigate('FaqDetail', {
                  question: item.question,
                  answer: item.answer,
                  category: 'General Inquiry',
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

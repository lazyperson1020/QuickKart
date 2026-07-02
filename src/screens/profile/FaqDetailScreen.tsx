import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';

type Props = NativeStackScreenProps<RootStackParamList, 'FaqDetail'>;

export default function FaqDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const { question, answer, category, hasContactFooter, hasLink } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>{category}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        <Text style={S.question}>{question}</Text>

        {hasLink ? (
          <Text style={S.answer}>
            {answer}{' '}
            <Text style={S.link} onPress={() => {}}>
              Click here
            </Text>
          </Text>
        ) : (
          <Text style={S.answer}>{answer}</Text>
        )}

        {hasContactFooter && (
          <>
            <View style={S.divider} />
            <Text style={S.contactHeading}>Have a non-urgent question or comment?</Text>
            <Text style={S.contactRow}>
              Email{' '}
              <Text
                style={S.link}
                onPress={() => Linking.openURL('mailto:support@quickkart.com')}
              >
                support@quickkart.com
              </Text>
            </Text>
          </>
        )}
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
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    lineHeight: 26,
  },
  answer: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  link: {
    color: PINK,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 20,
  },
  contactHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  contactRow: {
    fontSize: 15,
    color: '#333',
  },
});

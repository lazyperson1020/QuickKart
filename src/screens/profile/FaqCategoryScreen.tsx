import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase.native';

const PINK = '#E91E8C';

type FaqQuestion = {
  question: string;
  answer: string;
  hasContactFooter?: boolean;
  hasLink?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'FaqCategory'>;

export default function FaqCategoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const { categoryId, categoryTitle } = route.params;

  const [questions, setQuestions] = useState<FaqQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'faq_categories', categoryId),
      (snap) => {
        if (snap.exists()) {
          setQuestions((snap.data().questions as FaqQuestion[]) ?? []);
        } else {
          setQuestions([]);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [categoryId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Help</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={S.loader}>
          <ActivityIndicator size="large" color={PINK} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={S.sectionTitle}>{categoryTitle}</Text>

          <View style={S.listCard}>
            {questions.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[S.row, i === questions.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() =>
                  navigation.navigate('FaqDetail', {
                    question: item.question,
                    answer: item.answer,
                    category: categoryTitle,
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
      )}
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

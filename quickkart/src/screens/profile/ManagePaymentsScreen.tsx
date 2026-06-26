import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

const PINK = '#E91E8C';
const PURPLE = '#7C3AED';

export default function ManagePaymentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F5' }}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Manage Payments</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>

        {/* Zepto UPI heading */}
        <View style={S.upiHeading}>
          <Text style={S.zeptoWord}>zepto</Text>
          <Text style={S.upiWord}> UPI</Text>
          <Text style={S.upiFlag}>▶</Text>
        </View>

        {/* Zepto UPI Management card */}
        <View style={S.card}>
          <TouchableOpacity style={S.cardRow} activeOpacity={0.7}>
            <View style={S.zLogoBox}>
              <Text style={S.zLetter}>Z</Text>
              <Text style={S.upiSmall}>UPI</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={S.cardTitle}>Zepto UPI Management</Text>
              <Text style={S.cardSub}>Manage everything related to Zepto UPI</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={PINK} />
          </TouchableOpacity>
        </View>

        {/* Wallets */}
        <Text style={S.sectionLabel}>Wallets</Text>
        <View style={S.card}>
          <TouchableOpacity style={S.cardRow} activeOpacity={0.7}>
            <View style={S.payLogoBox}>
              <Text style={S.payText}>pay</Text>
              <View style={S.paySmile} />
            </View>
            <Text style={[S.cardTitle, { flex: 1, marginLeft: 14 }]}>Amazon Pay Balance</Text>
            <View style={S.linkRow}>
              <Text style={S.linkText}>Link</Text>
              <Ionicons name="chevron-forward" size={14} color={PINK} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Pay Later */}
        <Text style={S.sectionLabel}>Pay Later</Text>
        <View style={S.card}>
          <TouchableOpacity style={S.cardRow} activeOpacity={0.7}>
            <View style={S.payLogoBox}>
              <Text style={S.payText}>pay</Text>
              <View style={S.paySmile} />
            </View>
            <Text style={[S.cardTitle, { flex: 1, marginLeft: 14 }]}>Amazon Pay Later</Text>
            <View style={S.linkRow}>
              <Text style={S.linkText}>Link</Text>
              <Ionicons name="chevron-forward" size={14} color={PINK} />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: '#F0F0F5',
    borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  upiHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginLeft: 4 },
  zeptoWord: { fontSize: 22, fontWeight: '900', color: PURPLE, fontStyle: 'italic' },
  upiWord: { fontSize: 20, fontWeight: '700', color: '#333', letterSpacing: 1 },
  upiFlag: { fontSize: 18, color: '#FF6600', marginLeft: 2 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },

  zLogoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center', justifyContent: 'center',
  },
  zLetter: { fontSize: 20, fontWeight: '900', color: PURPLE, lineHeight: 22 },
  upiSmall: { fontSize: 7, fontWeight: '700', color: '#FF6600', letterSpacing: 0.5 },

  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },

  payLogoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0',
    alignItems: 'center', justifyContent: 'center',
  },
  payText: { fontSize: 11, fontWeight: '700', color: '#FF9900' },
  paySmile: {
    width: 24, height: 2, backgroundColor: '#FF9900',
    borderRadius: 1, marginTop: 1,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
  },

  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#111', marginTop: 16, marginBottom: 10, marginLeft: 4 },

  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  linkText: { fontSize: 14, fontWeight: '600', color: PINK },
});

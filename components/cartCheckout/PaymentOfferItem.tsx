import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface PaymentOffer {
  id: string;
  type: 'UPI' | 'Card' | 'Wallet' | 'PayLater';
  logoBg: string;
  logoText: string;
  logoFg: string;
  title: string;
  validText: string;
  code: string;
  isLocked: boolean;
  unlockText?: string;
  terms: string[];
}

interface Props {
  item: PaymentOffer;
  expanded: boolean;
  onToggle: () => void;
  onApply: () => void;
}

const PINK = '#FF3269';

export default function PaymentOfferItem({ item, expanded, onToggle, onApply }: Props) {
  return (
    <View style={S.card}>
      <View style={S.topRow}>
        <View style={[S.logo, { backgroundColor: item.logoBg }]}>
          <Text style={[S.logoText, { color: item.logoFg }]} numberOfLines={2}>
            {item.logoText}
          </Text>
        </View>
        <View style={S.info}>
          <Text style={S.title}>{item.title}</Text>
          {item.isLocked ? (
            <View style={S.unlockRow}>
              <Text style={S.unlockText}>{item.unlockText}</Text>
              <Ionicons name="information-circle" size={14} color="#E67E22" style={{ marginLeft: 4 }} />
            </View>
          ) : (
            <Text style={S.validText}>{item.validText}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={item.isLocked ? undefined : onApply}
          activeOpacity={item.isLocked ? 1 : 0.7}
          style={[S.actionBtn, item.isLocked && S.lockedBtn]}
        >
          <Text style={[S.actionBtnText, item.isLocked && S.lockedBtnText]}>
            {item.isLocked ? 'Locked' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={S.dashed} />

      <View style={S.footer}>
        <View style={S.codePill}>
          <Text style={S.codeText}>{item.code}</Text>
        </View>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={S.knowMore}>
          <Text style={S.knowMoreText}>Know more</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#333" />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={S.expandedBox}>
          <Text style={S.expandedHeader}>{item.validText}</Text>
          {item.terms.map((term, i) => (
            <Text key={i} style={S.expandedLine}>- {term}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 12,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    lineHeight: 19,
    marginBottom: 4,
  },
  validText: {
    fontSize: 12,
    color: '#666',
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockText: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: '500',
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  lockedBtn: {
    borderColor: '#CCC',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PINK,
  },
  lockedBtnText: {
    color: '#AAA',
  },
  dashed: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codePill: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  codeText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  knowMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  knowMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  expandedBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandedHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  expandedLine: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    marginBottom: 3,
  },
});

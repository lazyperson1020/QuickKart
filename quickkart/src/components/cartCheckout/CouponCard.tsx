import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removePaymentOffer } from '../../redux/couponSlice';
import { useSinglePress } from '../../hooks/useSinglePress';
import type { RootStackParamList } from '../../navigation/types';
import { useTranslation } from '../../localization/LanguageContext';

export default function CouponCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appliedOffer = useSelector((state: RootState) => state.coupon.appliedPaymentOffer);
  const goToCoupons = useSinglePress(() => navigation.navigate('Coupons', { tab: 'coupons' }));
  const goToPayment = useSinglePress(() => navigation.navigate('Coupons', { tab: 'payment' }));

  return (
    <View style={S.card}>
      <Text style={S.title}>{t.couponCard.title}</Text>

      <TouchableOpacity
        style={S.row}
        activeOpacity={0.8}
        onPress={goToCoupons}
      >
        <View style={[S.iconBox, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="pricetag-outline" size={18} color="#2e7d32" />
        </View>
        <Text style={S.rowText}>{t.couponCard.viewCoupons}</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>

      <View style={S.divider} />

      {appliedOffer ? (
        <View style={S.row}>
          <View style={[S.logoBox, { backgroundColor: appliedOffer.logoBg }]}>
            <Text style={[S.logoText, { color: appliedOffer.logoFg }]} numberOfLines={2}>
              {appliedOffer.logoText}
            </Text>
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={S.appliedTitle} numberOfLines={2}>{appliedOffer.title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goToPayment}
            >
              <Text style={S.viewAllText}>{t.couponCard.viewAllPaymentOffers}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={S.removeBtn}
            onPress={() => dispatch(removePaymentOffer())}
            activeOpacity={0.8}
          >
            <Text style={S.removeBtnText}>{t.couponCard.remove}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={S.row}
          activeOpacity={0.8}
          onPress={goToPayment}
        >
          <View style={[S.iconBox, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="card-outline" size={18} color="#1565C0" />
          </View>
          <Text style={S.rowText}>{t.couponCard.viewPaymentOffers}</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 11,
  },
  appliedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    lineHeight: 18,
    marginBottom: 2,
  },
  viewAllText: {
    fontSize: 12,
    color: '#888',
  },
  removeBtn: {
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
});

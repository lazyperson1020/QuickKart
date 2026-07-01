import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  TextInput, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useDispatch } from 'react-redux';
import BrandCouponItem, { BrandCoupon } from '../components/cartCheckout/BrandCouponItem';
import PaymentOfferItem, { PaymentOffer } from '../components/cartCheckout/PaymentOfferItem';
import BottomSheet from '../components/BottomSheet';
import { applyPaymentOffer } from '../redux/couponSlice';
import { useTranslation } from '../localization/LanguageContext';

const PINK = '#FF3269';
const BG = '#EEEEF7';

type Tab = 'coupons' | 'payment';
type PayFilter = 'UPI' | 'Card' | 'Wallet' | 'PayLater';

const BRAND_COUPONS: BrandCoupon[] = [
  {
    id: '1', brand: 'NATURE\nLAND\nORGANICS', brandBg: '#E8F5E9', brandFg: '#2E7D32',
    title: 'Flat 5% off on selected Natureland organics products',
    unlockText: 'Shop for ₹1499 more to unlock',
  },
  {
    id: '2', brand: 'AJMAL', brandBg: '#FFF8E1', brandFg: '#F57F17',
    title: 'Flat 5% Off on Ajmal products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '3', brand: 'WILD\nSTONE', brandBg: '#111', brandFg: '#fff',
    title: 'Flat 5% Off on Wild Stone products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '4', brand: 'PARK\nAVENUE', brandBg: '#F5F5F5', brandFg: '#333',
    title: 'Flat 5% Off on Park Avenue products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '5', brand: 'KIMIRICA', brandBg: '#F5F5F5', brandFg: '#333',
    title: 'Flat 7% Off on Kimirica products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '6', brand: 'ENGAGE', brandBg: '#1A237E', brandFg: '#fff',
    title: 'Flat 5% off on Engage products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '7', brand: 'ENGAGE', brandBg: '#1A237E', brandFg: '#fff',
    title: 'Flat 10% off on Engage products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '8', brand: 'ENGAGE', brandBg: '#1A237E', brandFg: '#fff',
    title: 'Flat ₹40 off on Engage products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
  {
    id: '9', brand: 'ENGAGE', brandBg: '#1A237E', brandFg: '#fff',
    title: 'Flat ₹20 off on Engage products',
    unlockText: 'Shop for ₹1 more to unlock',
  },
];

const PAYMENT_OFFERS: PaymentOffer[] = [
  {
    id: '1', type: 'UPI', logoBg: '#1a1a2e', logoText: 'pay', logoFg: '#fff',
    title: 'Get upto ₹50 Cashback on using Amazon Pay Balance',
    validText: 'Valid on orders above ₹99',
    code: 'AMAZONPAY', isLocked: false,
    terms: [
      'Valid only for users who have linked their Amazon account and made a payment using Amazon Pay Balance',
      'Applicable only to India mobile-verified users',
      'Valid on QuickKart orders with a minimum transaction value of ₹99',
      'Cashback will be issued only after the user scratches the issued scratch card on the Amazon Pay Rewards page',
      'The scratch card will be available until the end of the month',
      'Cashback will be credited as Amazon Pay balance within 24 hours of scratching the card',
      'This offer is valid once per user',
    ],
  },
  {
    id: '2', type: 'UPI', logoBg: '#FF6600', logoText: 'BHIM', logoFg: '#fff',
    title: 'Upto ₹30 cashback with BHIM App',
    validText: 'Valid on orders above ₹99',
    code: 'ZEPBHIM', isLocked: false,
    terms: [
      'Valid on BHIM UPI payments only',
      'Minimum transaction value ₹99',
      'Cashback credited within 24 hours',
    ],
  },
  {
    id: '3', type: 'UPI', logoBg: '#FF6600', logoText: 'BHIM', logoFg: '#fff',
    title: 'Flat ₹50 cashback with BHIM app',
    validText: 'Valid on orders above ₹99',
    code: 'TRYBHIM', isLocked: false,
    terms: [
      'Valid on BHIM UPI payments only',
      'Minimum transaction value ₹99',
      'This offer is valid once per user',
    ],
  },
  {
    id: '4', type: 'Card', logoBg: '#C8102E', logoText: 'HSBC', logoFg: '#fff',
    title: 'Flat ₹100 off with HSBC Bank Credit Cards',
    validText: 'Valid on orders above ₹972',
    code: 'ZEPHSBC', isLocked: true,
    unlockText: 'Shop for ₹872 more to unlock',
    terms: [
      'Valid on HSBC credit card payments only',
      'Minimum order value applies',
      'One time use per user',
    ],
  },
  {
    id: '5', type: 'Card', logoBg: '#1a237e', logoText: 'YES', logoFg: '#fff',
    title: 'Flat ₹100 off with YES Bank Credit Cards',
    validText: 'Valid on orders above ₹1223',
    code: 'ZEPYESCC', isLocked: true,
    unlockText: 'Shop for ₹1123 more to unlock',
    terms: [
      'Valid on YES Bank credit card payments only',
      'One time use per user',
    ],
  },
  {
    id: '6', type: 'Card', logoBg: '#1A1F71', logoText: 'VISA', logoFg: '#fff',
    title: 'Flat ₹100 off with Visa Platinum Credit Cards',
    validText: 'Valid on orders above ₹1223',
    code: 'VISAPLATINUMCC', isLocked: true,
    unlockText: 'Shop for ₹1123 more to unlock',
    terms: [
      'Valid on Visa Platinum credit card payments only',
      'One time use per user',
    ],
  },
  {
    id: '7', type: 'Card', logoBg: '#1A1F71', logoText: 'VISA', logoFg: '#fff',
    title: 'Flat ₹75 off with Visa Platinum Debit Cards.',
    validText: 'Valid on orders above ₹473',
    code: 'VISAPLATINUMDC', isLocked: true,
    unlockText: 'Shop for ₹373 more to unlock',
    terms: [
      'Valid on Visa Platinum debit card payments only',
      'One time use per user',
    ],
  },
  {
    id: '8', type: 'Card', logoBg: '#7B1FA2', logoText: 'Indus\nInd', logoFg: '#fff',
    title: 'Flat ₹100 off with IndusInd Bank Credit Cards',
    validText: 'Valid on orders above ₹972',
    code: 'ZEPINDCC', isLocked: true,
    unlockText: 'Shop for ₹872 more to unlock',
    terms: [
      'Valid on IndusInd Bank credit card payments only',
      'One time use per user',
    ],
  },
  {
    id: '9', type: 'Card', logoBg: '#E65100', logoText: 'DBS', logoFg: '#fff',
    title: 'Flat ₹75 off with DBS Bank',
    validText: 'Valid on orders above ₹500',
    code: 'ZEPDBS', isLocked: true,
    unlockText: 'Shop for ₹400 more to unlock',
    terms: [
      'Valid on DBS bank payments only',
      'One time use per user',
    ],
  },
  {
    id: '10', type: 'Wallet', logoBg: '#00695C', logoText: 'Freecharge', logoFg: '#fff',
    title: 'Get ₹25 cashback using Freecharge Wallet',
    validText: 'Valid on orders above ₹199',
    code: 'ZEPFC', isLocked: false,
    terms: [
      'Valid on Freecharge wallet payments only',
      'One time use per user per month',
    ],
  },
  {
    id: '11', type: 'PayLater', logoBg: '#37474F', logoText: 'ICICI\nPay\nLater', logoFg: '#fff',
    title: 'Flat ₹50 off with ICICI PayLater',
    validText: 'Valid on orders above ₹499',
    code: 'ZEPICICI', isLocked: true,
    unlockText: 'Shop for ₹372 more to unlock',
    terms: [
      'Valid on ICICI PayLater payments only',
      'One time use per user',
    ],
  },
];

const PAY_FILTERS: { key: PayFilter; icon: string; label: string }[] = [
  { key: 'UPI', icon: 'flash-outline', label: 'UPI' },
  { key: 'Card', icon: 'card-outline', label: 'Card' },
  { key: 'Wallet', icon: 'wallet-outline', label: 'Wallet' },
  { key: 'PayLater', icon: 'time-outline', label: 'PayLater' },
];

export default function Coupons() {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Coupons'>>();
  const { tab: initialTab } = route.params as { tab: string };

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<Tab>((initialTab as Tab) ?? 'coupons');
  const [payFilter, setPayFilter] = useState<PayFilter | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showCodeSheet, setShowCodeSheet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredPaymentOffers = payFilter
    ? PAYMENT_OFFERS.filter(o => o.type === payFilter)
    : PAYMENT_OFFERS;

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: top }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>{t.coupons.headerTitle}</Text>
        <TouchableOpacity
          style={S.haveCodeBtn}
          onPress={() => setShowCodeSheet(true)}
          activeOpacity={0.8}
        >
          <Text style={S.haveCodeText}>{t.coupons.haveACode}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab switcher */}
      <View style={S.tabBar}>
        {(['coupons', 'payment'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[S.tab, activeTab === tab && S.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[S.tabText, activeTab === tab && S.tabTextActive]}>
              {tab === 'coupons' ? t.coupons.couponsTab : t.coupons.paymentOffersTab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={S.noteText}>{t.coupons.note}</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
      >
        {activeTab === 'coupons' ? (
          <>
            <Text style={S.sectionHeader}>{t.coupons.autoAppliedBrandAddOns}</Text>
            {BRAND_COUPONS.map(item => (
              <BrandCouponItem
                key={item.id}
                item={item}
                expanded={expandedIds.has(item.id)}
                onToggle={() => toggleExpand(item.id)}
              />
            ))}
          </>
        ) : (
          <>
            {/* Payment filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 12 }}
              contentContainerStyle={{ paddingRight: 4 }}
            >
              {PAY_FILTERS.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[S.filterChip, payFilter === f.key && S.filterChipActive]}
                  onPress={() => setPayFilter(prev => prev === f.key ? null : f.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={f.icon as any}
                    size={13}
                    color={payFilter === f.key ? '#111' : '#555'}
                  />
                  <Text style={[S.filterChipText, payFilter === f.key && S.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredPaymentOffers.map(item => (
              <PaymentOfferItem
                key={item.id}
                item={item}
                expanded={expandedIds.has(item.id)}
                onToggle={() => toggleExpand(item.id)}
                onApply={() => {
                dispatch(applyPaymentOffer({
                  id: item.id,
                  title: item.title,
                  logoBg: item.logoBg,
                  logoText: item.logoText,
                  logoFg: item.logoFg,
                  code: item.code,
                }));
                navigation.goBack();
              }}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Have a code? bottom sheet */}
      <BottomSheet
        visible={showCodeSheet}
        onClose={() => { setShowCodeSheet(false); setCouponCode(''); }}
        height={270}
      >
        <Text style={S.sheetTitle}>{t.coupons.haveACouponCodeTitle}</Text>

        <View style={[S.inputBox, codeFocused && S.inputBoxFocused]}>
          <Text style={[S.inputLabel, codeFocused && S.inputLabelFocused]}>{t.coupons.couponCodeLabel}</Text>
          <TextInput
            style={S.codeInput}
            placeholder={t.coupons.enterCouponCodePlaceholder}
            placeholderTextColor="#BBB"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            onFocus={() => setCodeFocused(true)}
            onBlur={() => setCodeFocused(false)}
          />
        </View>

        <TouchableOpacity
          style={[S.applyBtn, !couponCode.trim() && S.applyBtnDisabled]}
          activeOpacity={couponCode.trim() ? 0.8 : 1}
        >
          <Text style={[S.applyBtnText, !couponCode.trim() && S.applyBtnTextDisabled]}>
            {t.common.apply}
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

const S = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  haveCodeBtn: {
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  haveCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#E0E0EC',
    flexDirection: 'row',
    padding: 4,
    margin: 12,
    marginBottom: 0,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: '#111',
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    borderColor: '#111',
    backgroundColor: '#F5F5F5',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  filterChipTextActive: {
    color: '#111',
  },
  // Bottom sheet
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    marginBottom: 16,
  },
  inputBoxFocused: {
    borderColor: PINK,
  },
  inputLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3,
  },
  inputLabelFocused: {
    color: PINK,
  },
  codeInput: {
    fontSize: 15,
    color: '#111',
    paddingVertical: 2,
  },
  applyBtn: {
    backgroundColor: PINK,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#E8E8E8',
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  applyBtnTextDisabled: {
    color: '#AAA',
  },
});

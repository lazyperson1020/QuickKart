import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Text, View, TouchableOpacity, Image, StatusBar,
  ActivityIndicator, ScrollView, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { collection, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.native';
import { showLocalOrderNotification } from '../services/notificationService';
import { decrementQuantity, incrementQuantity, CartItem } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { dismissOfferModal } from '../redux/couponSlice';
import { setSelectedAddress as setReduxAddress } from '../redux/addressSlice';
import { clearCart } from '../redux/cartSlice';
import { GroceryProduct } from '../components/productCard';
import BillSummary from '../components/cartCheckout/BillSummary';
import CouponCard from '../components/cartCheckout/CouponCard';
import DealsRail from '../components/cartCheckout/DealsRail';
import BottomSheet from '../components/BottomSheet';
import AddressSelector from '../components/cartCheckout/AddressSelector';
import ScheduleOrderModal from '../components/cartCheckout/ScheduleOrderModal';

const PINK = '#FF3269';
const BG = '#EEEEF7';

interface Address { id: string; label: string; address: string; }

const TIP_OPTIONS = [
  { amount: 10, icon: 'cafe-outline' as const, label: '₹10' },
  { amount: 35, icon: 'fast-food-outline' as const, label: '₹35' },
  { amount: 50, icon: 'pizza-outline' as const, label: '₹50' },
];

export default function Cart() {
  const { top, bottom } = useSafeAreaInsets();
  const cart = useSelector((state: RootState) => state.cart);
  const appliedOffer = useSelector((state: RootState) => state.coupon.appliedPaymentOffer);
  const showOfferModal = useSelector((state: RootState) => state.coupon.showOfferModal);
  const reduxAddress = useSelector((state: RootState) => state.address.selected);
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [noBag, setNoBag] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDelivery, setScheduledDelivery] = useState<{ dateLabel: string; slotDisplay: string; slotShort: string } | null>(null);
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipTab, setTipTab] = useState<'tip' | 'instructions'>('tip');
  const [customTip, setCustomTip] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  }, []);
  const knownAddressIdsRef = useRef<Set<string>>(new Set());
  const isInitialAddressLoadRef = useRef(true);

  useEffect(() => { if (cart.length === 0) navigation.goBack(); }, [cart.length, navigation]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'addresses'),
      (snap) => {
        const data = snap.docs.map((d) => {
          const docData = d.data();
          return { id: d.id, label: docData.type ?? 'Home', address: docData.fullAddress ?? '' };
        }) as Address[];
        setAddresses(data);

        if (isInitialAddressLoadRef.current) {
          isInitialAddressLoadRef.current = false;
          const reduxMatch = reduxAddress ? data.find((a) => a.id === reduxAddress.id) : null;
          const def = reduxMatch
            ?? data.find((a) => snap.docs.find((d) => d.id === a.id)?.data().isDefault)
            ?? data[0]
            ?? null;
          setSelectedAddress(def);
          if (def) dispatch(setReduxAddress({ id: def.id, label: def.label, address: def.address }));
          knownAddressIdsRef.current = new Set(data.map((a) => a.id));
        } else {
          const newAddr = data.find((a) => !knownAddressIdsRef.current.has(a.id));
          knownAddressIdsRef.current = new Set(data.map((a) => a.id));
          if (newAddr) setSelectedAddress(newAddr);
        }
        setAddressLoading(false);
      },
      (e) => { console.error('Address fetch error:', e); setAddressLoading(false); }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const cats = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];
    const catData: Record<string, GroceryProduct[]> = {};
    const unsubscribers: (() => void)[] = [];

    cats.forEach((cat) => {
      const unsub = onSnapshot(
        collection(db, 'products', cat, `${cat}Collection`),
        (snap) => {
          catData[cat] = snap.docs.map((d) => ({
            id: d.id, ...d.data(), stock: Number(d.data().stock ?? 0)
          } as GroceryProduct));
          if (Object.keys(catData).length === cats.length) {
            const merged = cats.flatMap((c) => catData[c] ?? []);
            setProducts(merged.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
          }
        },
        (e) => { console.error('Product fetch error:', e); }
      );
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, []);

  const { itemTotal, originalItemTotal, deliveryFee, savings, totalSavings, calculatedTotalPay } = useMemo(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const origTotal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const saved = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
    const fee = total >= 99 ? 0 : 30;
    const origHandling = 10;
    return {
      itemTotal: total,
      originalItemTotal: origTotal,
      deliveryFee: fee,
      savings: saved,
      totalSavings: saved + origHandling,
      calculatedTotalPay: total + fee,
    };
  }, [cart]);

  const totalToPay = calculatedTotalPay + tipAmount;

  const handlePlaceOrder = async (paymentMethod: 'cod' | 'online') => {
    const user = auth.currentUser;
    if (!user || !selectedAddress || cart.length === 0) return;
    try {
      const orderData = {
        userId: user.uid,
        items: cart,
        address: selectedAddress,
        addressSnapshot: {
          fullAddress: selectedAddress.address,
          label: selectedAddress.label,
        },
        totalAmount: totalToPay,
        itemTotal,
        deliveryFee,
        tipAmount,
        paymentMethod,
        scheduledDelivery: scheduledDelivery ?? null,
        status: 'placed',
        createdAt: serverTimestamp(),
      };
      const orderRef = await addDoc(collection(db, 'users', user.uid, 'previousOrders'), orderData);
      await addDoc(collection(db, 'orders'), orderData);
      await showLocalOrderNotification(totalToPay, orderRef.id);
      dispatch(clearCart());
      navigation.reset({ index: 1, routes: [{ name: 'Home' }, { name: 'OrderPlaced' }] });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to place order. Try again.' });
    }
  };

  const handleDeleteAddress = (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) setSelectedAddress(null);
    knownAddressIdsRef.current.delete(id);
    deleteDoc(doc(db, 'users', user.uid, 'addresses', id)).catch(console.error);
  };

  const handleProductPress = (product: GroceryProduct) =>
    navigation.navigate('ProductDetails', { productJson: JSON.stringify(product) });

  const handleTipSelect = (amount: number) => {
    setShowCustomInput(false);
    setCustomTip('');
    setTipAmount(prev => prev === amount ? 0 : amount);
  };

  const handleCustomTip = () => {
    setTipAmount(0);
    setShowCustomInput(true);
    scrollToBottom();
  };

  const applyCustomTip = () => {
    const parsed = parseInt(customTip, 10);
    if (!isNaN(parsed) && parsed > 0) setTipAmount(parsed);
    setShowCustomInput(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: top }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        {addressLoading ? (
          <ActivityIndicator color="#35035C" style={{ flex: 1, marginLeft: 12 }} />
        ) : (
          <TouchableOpacity
            style={{ flex: 1, marginHorizontal: 12 }}
            onPress={() => setShowAddressSheet(true)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={S.headerTitle}>{selectedAddress?.label ?? 'Add Address'}</Text>
              <Ionicons name="chevron-down" size={14} color="#555" style={{ marginLeft: 4 }} />
            </View>
            {selectedAddress?.address ? (
              <Text numberOfLines={1} style={S.headerAddress}>{selectedAddress.address}</Text>
            ) : null}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Ionicons name="heart-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Scrollable body — KAV shrinks this when keyboard opens, footer stays above keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Savings banner */}
        {totalSavings > 0 && (
          <TouchableOpacity activeOpacity={0.8} style={S.savingsBanner}>
            <Text style={S.savingsBannerText}>Yay! You saved ₹{totalSavings} on this order</Text>
            <Ionicons name="chevron-down" size={14} color="#2e7d32" />
          </TouchableOpacity>
        )}

        {/* NEW promo row */}
        <TouchableOpacity style={S.promoRow} activeOpacity={0.8}>
          <View style={S.newBadge}>
            <Text style={S.newBadgeText}>NEW</Text>
          </View>
          <Text style={S.promoText}>Apply coupons + payment offers & save more</Text>
        </TouchableOpacity>

        {/* Coupons & offers */}
        <CouponCard />

        {/* Items card */}
        <View style={S.card}>
          <View style={S.deliveryRow}>
            {scheduledDelivery ? (
              <>
                <Ionicons name="calendar-outline" size={20} color="#2e7d32" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={S.deliveryTitle}>
                    Arriving on {scheduledDelivery.dateLabel}, {scheduledDelivery.slotShort}
                  </Text>
                  <Text style={S.deliverySubtitle}>Shipment scheduled</Text>
                </View>
                <TouchableOpacity onPress={() => setShowScheduleModal(true)} activeOpacity={0.8}>
                  <Text style={{ color: PINK, fontWeight: '700', fontSize: 14 }}>Edit</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="time-outline" size={20} color="#111" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={S.deliveryTitle}>Delivering in 6 mins</Text>
                  <Text style={S.deliverySubtitle}>{cart.length} item{cart.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity style={S.scheduleBtn} activeOpacity={0.8} onPress={() => setShowScheduleModal(true)}>
                  <Ionicons name="calendar-outline" size={13} color="#E67E22" />
                  <Text style={S.scheduleBtnText}>Schedule</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={S.divider} />

          {cart.map((item, index) => (
            <CartItemRow key={item.id} item={item} isLast={index === cart.length - 1} />
          ))}

          <View style={S.divider} />

          {/* Add from wishlist */}
          <TouchableOpacity
            style={S.wishlistRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Ionicons name="heart-outline" size={16} color={PINK} />
            <Text style={S.wishlistText}>Add items from your wishlist</Text>
            <View style={S.addWishlistBtn}>
              <Text style={S.addWishlistBtnText}>Add</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <BillSummary
          itemTotal={itemTotal}
          originalItemTotal={originalItemTotal}
          deliveryFee={deliveryFee}
          savings={savings}
          totalSavings={totalSavings}
          tipAmount={tipAmount}
        />

        {/* Deals at ₹9 rail */}
        {products.length > 0 && (
          <View style={[S.card, { paddingHorizontal: 0 }]}>
            <View style={{ paddingHorizontal: 14, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <View style={{ backgroundColor: '#F5F0FF', borderRadius: 10, padding: 8 }}>
                <Ionicons name="pricetag-outline" size={16} color="#35035C" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Deals Starting at</Text>
              <View style={{ backgroundColor: '#2e7d32', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>₹9</Text>
              </View>
            </View>
            <DealsRail products={products} onProductPress={handleProductPress} />
          </View>
        )}

        {/* Delivery Tip */}
        <View style={S.card}>
          {/* Tab switcher */}
          <View style={S.tipTabBar}>
            <TouchableOpacity
              style={[S.tipTab, tipTab === 'tip' && S.tipTabActive]}
              onPress={() => setTipTab('tip')}
              activeOpacity={0.8}
            >
              <Text style={[S.tipTabText, tipTab === 'tip' && S.tipTabTextActive]}>Give a Tip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.tipTab, tipTab === 'instructions' && S.tipTabActive]}
              onPress={() => { setTipTab('instructions'); scrollToBottom(); }}
              activeOpacity={0.8}
            >
              <Text style={[S.tipTabText, tipTab === 'instructions' && S.tipTabTextActive]}>Delivery Instructions</Text>
            </TouchableOpacity>
          </View>

          {tipTab === 'tip' ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={S.tipTitle}>Tip Delivery Partner</Text>
                  <Text style={S.tipSubtitle}>Help them earn a little extra for their effort.{'\n'}100% of this tip will go to them.</Text>
                </View>
                {tipAmount > 0 && (
                  <TouchableOpacity onPress={() => { setTipAmount(0); setShowCustomInput(false); setCustomTip(''); }}>
                    <Text style={{ color: PINK, fontSize: 13, fontWeight: '700' }}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={S.tipButtons}>
                {TIP_OPTIONS.map(opt => {
                  const selected = tipAmount === opt.amount && !showCustomInput;
                  return (
                    <TouchableOpacity
                      key={opt.amount}
                      style={[S.tipBtn, selected && S.tipBtnSelected]}
                      onPress={() => handleTipSelect(opt.amount)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={opt.icon} size={20} color={selected ? '#2e7d32' : '#555'} />
                      <Text style={[S.tipBtnText, selected && S.tipBtnTextSelected]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={[S.tipBtn, showCustomInput && S.tipBtnSelected]}
                  onPress={handleCustomTip}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={20} color={showCustomInput ? '#2e7d32' : '#555'} />
                  <Text style={[S.tipBtnText, showCustomInput && S.tipBtnTextSelected]}>Custom</Text>
                </TouchableOpacity>
              </View>

              {showCustomInput && (
                <View style={S.customTipRow}>
                  <TextInput
                    style={S.customTipInput}
                    keyboardType="number-pad"
                    placeholder="Enter amount"
                    placeholderTextColor="#aaa"
                    value={customTip}
                    onChangeText={setCustomTip}
                    autoFocus
                  />
                  <TouchableOpacity style={S.customTipApplyBtn} onPress={applyCustomTip} activeOpacity={0.8}>
                    <Text style={S.customTipApplyText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={{ marginTop: 16 }}>
              <Text style={S.tipTitle}>Delivery Instructions</Text>
              <TextInput
                style={S.instructionsInput}
                placeholder="E.g. Leave at door, call on arrival..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </View>

        {/* I don't need a bag */}
        <TouchableOpacity style={S.bagRow} activeOpacity={0.8} onPress={() => setNoBag(v => !v)}>
          <View style={[S.checkbox, noBag && S.checkboxChecked]}>
            {noBag && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={S.bagText}>I don't need a bag</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer — in normal flow so it stays above the keyboard */}
      <View style={[S.footer, { paddingBottom: bottom > 0 ? bottom : 12 }]}>
        {selectedAddress ? (
          <>
            <View>
              <Text style={S.toPayLabel}>TO PAY</Text>
              <Text style={S.toPayAmount}>₹{totalToPay}</Text>
            </View>
            <TouchableOpacity style={S.payOnlineBtn} activeOpacity={0.8} onPress={() => handlePlaceOrder('online')}>
              <Text style={S.payOnlineText}>Pay Online</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.cashBtn} activeOpacity={0.8} onPress={() => handlePlaceOrder('cod')}>
              <Text style={S.cashBtnText}>PAY CASH/UPI</Text>
              <Text style={S.cashBtnSubText}>(on delivery)</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={S.addAddressBar}
            activeOpacity={0.8}
            onPress={() => setShowAddressSheet(true)}
          >
            <Ionicons name="location-outline" size={20} color="#fff" />
            <Text style={S.addAddressBarText}>Add a delivery address</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <BottomSheet visible={showAddressSheet} onClose={() => setShowAddressSheet(false)}>
        <AddressSelector
          addresses={addresses}
          selectedId={selectedAddress?.id}
          onSelect={(addr: Address) => {
            setSelectedAddress(addr);
            dispatch(setReduxAddress({ id: addr.id, label: addr.label, address: addr.address }));
            setShowAddressSheet(false);
          }}
          onClose={() => setShowAddressSheet(false)}
          onAddNew={() => { setShowAddressSheet(false); navigation.navigate('AddressAdd'); }}
          onDelete={handleDeleteAddress}
        />
      </BottomSheet>

      <ScheduleOrderModal
        visible={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirm={(dateLabel, slotDisplay, slotShort) => {
          setScheduledDelivery({ dateLabel, slotDisplay, slotShort });
          setShowScheduleModal(false);
        }}
        cartItems={cart}
      />

      {/* Payment offer applied confirmation modal */}
      <Modal visible={showOfferModal} transparent animationType="fade" statusBarTranslucent>
        <View style={S.modalOverlay}>
          <View style={S.modalCard}>
            {/* Illustration area */}
            <View style={S.modalIllustration}>
              <Ionicons name="wallet-outline" size={52} color="#1565C0" />
              <View style={S.modalCheckBadge}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            </View>

            {/* Content */}
            <View style={S.modalContent}>
              <Text style={S.modalTitle}>{appliedOffer?.title}</Text>
              <Text style={S.modalSubtitle}>"{appliedOffer?.code} APPLIED"</Text>

              <TouchableOpacity
                style={S.gotItBtn}
                activeOpacity={0.8}
                onPress={() => dispatch(dismissOfferModal())}
              >
                <Text style={S.gotItBtnText}>Got it</Text>
              </TouchableOpacity>

              {/* Savings nudge */}
              <TouchableOpacity
                style={S.savingsNudge}
                activeOpacity={0.8}
                onPress={() => {
                  dispatch(dismissOfferModal());
                  navigation.navigate('Coupons', { tab: 'coupons' });
                }}
              >
                <Ionicons name="pricetag" size={20} color="#2e7d32" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={S.nudgeTitle}>Don't miss extra savings!</Text>
                  <Text style={S.nudgeSubtitle}>Apply coupons to save more</Text>
                </View>
                <Text style={S.nudgeArrow}>{'>>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function CartItemRow({ item, isLast }: { item: CartItem; isLast: boolean }) {
  const dispatch = useDispatch();
  const showStockToast = (stock: number) =>
    Toast.show({ type: 'error', text1: `Only ${stock} unit(s) available`, position: 'bottom' });

  return (
    <View style={[S.itemRow, !isLast && { marginBottom: 16 }]}>
      <Image style={S.itemImage} source={{ uri: item.imageUrl }} />
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={S.itemName}>{item.name}</Text>
        <Text style={S.itemWeight}>{item.weight}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={S.stepper}>
          <TouchableOpacity onPress={() => dispatch(decrementQuantity(item))} hitSlop={8} style={S.stepBtn}>
            <AntDesign name="minus" size={13} color={PINK} />
          </TouchableOpacity>
          <Text style={S.stepQty}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() =>
              item.quantity >= (item.stock ?? 0)
                ? showStockToast(item.stock ?? 0)
                : dispatch(incrementQuantity(item))
            }
            hitSlop={8}
            style={S.stepBtn}
          >
            <AntDesign name="plus" size={13} color={PINK} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          {item.originalPrice > item.price && (
            <Text style={S.originalPrice}>₹{item.originalPrice}</Text>
          )}
          <Text style={S.currentPrice}>₹{item.price}</Text>
        </View>
      </View>
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
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  headerAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  savingsBanner: {
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  savingsBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
  },
  promoRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  newBadge: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  deliverySubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#E67E22',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scheduleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E67E22',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    lineHeight: 18,
  },
  itemWeight: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 8,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stepQty: {
    fontSize: 14,
    fontWeight: '700',
    color: PINK,
    paddingHorizontal: 6,
    minWidth: 20,
    textAlign: 'center',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  wishlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wishlistText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  addWishlistBtn: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  addWishlistBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PINK,
  },
  // Tip section
  tipTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
    borderRadius: 12,
    padding: 3,
  },
  tipTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tipTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tipTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  tipTabTextActive: {
    color: '#111',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  tipSubtitle: {
    fontSize: 12,
    color: '#777',
    lineHeight: 17,
  },
  tipButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  tipBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    gap: 4,
  },
  tipBtnSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#F0FFF4',
  },
  tipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },
  tipBtnTextSelected: {
    color: '#2e7d32',
  },
  customTipRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  customTipInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111',
  },
  customTipApplyBtn: {
    backgroundColor: PINK,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  customTipApplyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  instructionsInput: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111',
    textAlignVertical: 'top',
    marginTop: 8,
    minHeight: 80,
  },
  bagRow: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PINK,
    borderColor: PINK,
  },
  bagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  footer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  toPayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  toPayAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  payOnlineBtn: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  payOnlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  cashBtn: {
    flex: 1,
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  cashBtnSubText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  addAddressBar: {
    flex: 1,
    backgroundColor: PINK,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addAddressBarText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  // Offer confirmation modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  modalIllustration: {
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  modalCheckBadge: {
    position: 'absolute',
    bottom: 22,
    right: '37%',
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 18,
  },
  gotItBtn: {
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  gotItBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: PINK,
  },
  savingsNudge: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  nudgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e7d32',
  },
  nudgeSubtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  nudgeArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
});

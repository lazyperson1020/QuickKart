import React, { useEffect, useState, useMemo } from 'react';
import { Text, View, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { styles } from '../../styles/cart';
import { decrementQuantity, incrementQuantity, removeProduct, CartItem } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { GroceryProduct } from '../../components/productCard';
import BillSummary from '../../components/cartCheckout/BillSummary';
import AddressHeader from '../../components/cartCheckout/AddressHeader';
import CouponCard from '../../components/cartCheckout/CouponCard';
import SavingsCard from '../../components/cartCheckout/SavingsCard';
import DealsRail from '../../components/cartCheckout/DealsRail';
import DeliveryTip from '../../components/cartCheckout/DeliveryTip';
import BottomSheet from '../../components/BottomSheet';
import AddressSelector from '../../components/cartCheckout/AddressSelector';

interface Address { id: string; label: string; address: string; }
interface BodyProps { data: CartItem[]; itemTotal: number; deliveryFee: number; handlingFee: number; savings: number; tipAmount: number; onSelectTip: (tip: number) => void; products: GroceryProduct[]; onProductPress: (product: GroceryProduct) => void; selectedAddress: Address; onOpenAddressSheet: () => void; }

const ADDRESSES: Address[] = [{ id: '1', label: 'Home', address: '123 Main Street, City, State 110001' }, { id: '2', label: 'Work', address: '456 Office Park, Business District, State 110002' }];

export default function Cart() {
  const { top } = useSafeAreaInsets();
  const cart = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const [tipAmount, setTipAmount] = useState(0);
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>(ADDRESSES[0]);

  useEffect(() => { if (cart.length === 0) router.back(); }, [cart.length, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categories = ['Dairy', 'Fresh', 'Snacks', 'Electronics'];
        const snapshots = await Promise.all(categories.map(cat => getDocs(collection(db, 'products', cat, `${cat}Collection`))));
        const fetched: GroceryProduct[] = [];
        snapshots.forEach(snap => snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data(), stock: doc.data().stock !== undefined ? Number(doc.data().stock) : 0 } as GroceryProduct)));
        setProducts(fetched.sort((a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)));
      } catch (error) { console.error("Error fetching products: ", error); }
    };
    fetchProducts();
  }, []);

  const { itemTotal, deliveryFee, handlingFee, savings, calculatedTotalPay } = useMemo(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const saved = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
    const fee = total >= 99 ? 0 : 30;
    return { 
      itemTotal: total, 
      deliveryFee: fee, 
      handlingFee: 0, 
      savings: saved, 
      calculatedTotalPay: total + fee 
    };
  }, [cart]);

  const handleProductPress = (product: GroceryProduct) => router.push({ pathname: '/(tabs)/productDetails', params: { productJson: JSON.stringify(product) } });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: top }}>
      <StatusBar backgroundColor="#35035C" barStyle="light-content" />
      <Header count={cart.length} />
      <Body data={cart} itemTotal={itemTotal} deliveryFee={deliveryFee} handlingFee={handlingFee} savings={savings} tipAmount={tipAmount} onSelectTip={setTipAmount} products={products} onProductPress={handleProductPress} selectedAddress={selectedAddress} onOpenAddressSheet={() => setShowAddressSheet(true)} />
      <Footer totalPay={calculatedTotalPay + tipAmount} />
      <BottomSheet visible={showAddressSheet} onClose={() => setShowAddressSheet(false)}>
        <AddressSelector addresses={ADDRESSES} selectedId={selectedAddress.id} onSelect={(addr: Address) => { setSelectedAddress(addr); setShowAddressSheet(false); }} />
      </BottomSheet>
    </View>
  );
}

function Header({ count }: { count: number }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={25} color="#fff" /></TouchableOpacity>
      <Text style={styles.headerTitle}>Cart ({count})</Text>
    </View>
  );
}

function Body({ data, itemTotal, deliveryFee, handlingFee, savings, tipAmount, onSelectTip, products, onProductPress, selectedAddress, onOpenAddressSheet }: BodyProps) {
  const dispatch = useDispatch();
  const showStockToast = (stock: number) => Toast.show({ type: 'error', text1: `Only ${stock} unit(s) available`, position: 'bottom' });

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.card, { marginBottom: 4 }]}>
      <View style={styles.firstChild}>
        <Image style={styles.img} source={{ uri: item.imageUrl }} />
        <View style={styles.nameContainer}><Text style={styles.name}>{item.name}</Text><Text style={styles.price}>₹ {item.price}</Text></View>
        <AntDesign onPress={() => dispatch(removeProduct(item))} name="close" size={24} color="#111" />
      </View>
      <View style={styles.secondChild}>
        <View style={styles.weightContainer}><Text style={styles.weight}>{item.weight}</Text><AntDesign name="down" size={15} color="#35035C" /></View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => dispatch(decrementQuantity(item))} hitSlop={8}><AntDesign name="minus" size={14} color="#fff" /></TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => item.quantity >= (item.stock ?? 0) ? showStockToast(item.stock ?? 0) : dispatch(incrementQuantity(item))} hitSlop={8}><AntDesign name="plus" size={14} color="#fff" /></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const ListHeader = useMemo(() => <>
    <AddressHeader title={selectedAddress.label} address={selectedAddress.address} onPress={onOpenAddressSheet} />
    <CouponCard cartTotal={itemTotal} />
  </>, [selectedAddress, onOpenAddressSheet, itemTotal]);

  const ListFooter = useMemo(() => (
    <View style={{ marginTop: 16, gap: 14 }}>
      <DeliveryTip selectedTip={tipAmount} onSelectTip={onSelectTip} />
      <BillSummary itemTotal={itemTotal} deliveryFee={deliveryFee} handlingFee={handlingFee} deliveryTip={tipAmount} />
      <SavingsCard savings={savings} />
      <DealsRail products={products} onProductPress={onProductPress} />
    </View>
  ), [itemTotal, deliveryFee, handlingFee, savings, products, onProductPress, tipAmount, onSelectTip]);

  return (
    <View style={styles.bodyContainer}>
      <FlatList 
        data={data} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id.toString()} 
        ItemSeparatorComponent={() => <View style={styles.separator} />} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 32 }} 
        ListHeaderComponent={ListHeader} 
        ListFooterComponent={ListFooter} 
      />
    </View>
  );
}

function Footer({ totalPay }: { totalPay: number }) {
  return (
    <TouchableOpacity style={styles.btn}>
      <Text style={styles.btnText}>Continue to Payment ₹ {totalPay}</Text>
      <AntDesign name="arrow-right" size={18} color="#fff" />
    </TouchableOpacity>
  );
}
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { TouchableOpacity } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../../firebase.native';
import PreviousOrdersCard, { OrderItem } from '../../components/previousOrdersCard';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/cartSlice';
import { useSinglePress } from '../../hooks/useSinglePress';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  dateString: string;
  items: OrderItem[];
}

export default function PreviousOrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsubscribe = onSnapshot(
      query(collection(db, 'users', user.uid, 'previousOrders'), orderBy('createdAt', 'desc')),
      (snap) => {
        const data: Order[] = snap.docs.map((doc) => {
          const d = doc.data();
          const items = d.items || d['items '] || [];
          const t = d.createdAt?.toDate ? d.createdAt.toDate() : new Date();
          const dateString =
            t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ', ' +
            t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
          return { id: doc.id, status: d.status ?? 'delivered', totalAmount: d.totalAmount ?? 0, dateString, items };
        });
        setOrders(data);
        setLoading(false);
      },
      (e) => { console.error('Failed to fetch orders:', e); setLoading(false); }
    );
    return unsubscribe;
  }, []);

  const handleOrderAgain = useSinglePress((items: OrderItem[]) => {
    items.forEach(item => dispatch(addProduct({ ...item, stock: 99 })));
    navigation.navigate('Cart');
  });
  const goBack = useSinglePress(() => navigation.goBack());

  return (
    <SafeAreaView style={S.safe} edges={['top']}>
      <View style={S.header}>
        <TouchableOpacity onPress={goBack} hitSlop={8} style={S.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Your Orders</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E91E63" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PreviousOrdersCard
              status={item.status}
              totalAmount={item.totalAmount}
              dateString={item.dateString}
              items={item.items}
              onViewDetails={() =>
                navigation.navigate('OrderDetails', { orderId: item.id })
              }
              onOrderAgain={() => handleOrderAgain(item.items)}
            />
          )}
          ListEmptyComponent={
            <View style={S.empty}>
              <Ionicons name="bag-outline" size={52} color="#CCC" />
              <Text style={S.emptyText}>No orders yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F0F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0F0F5', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  empty: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15, color: '#AAA', fontWeight: '500' },
});

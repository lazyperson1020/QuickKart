import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { db, auth } from '../../../firebase';
import { addProduct } from '../../redux/cartSlice';
import PreviousOrdersCard, { OrderItem } from '../../../components/previousOrdersCard';

export default function PreviousOrdersScreen() {
  const router = useRouter(); 
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExhaustiveOrders = async () => {
      if (!auth.currentUser) return;
      try {
        const snap = await getDocs(query(collection(db, 'users', auth.currentUser.uid, 'previousOrders'), orderBy('createdAt', 'desc')));
        const mappedOrders = snap.docs.map(doc => {
          const d = doc.data(); 
          const t = d.createdAt?.toDate() ? d.createdAt.toDate() : new Date();
          const ordersArray = d.items || d.Items || [];

          return { 
            id: doc.id, 
            ...d, 
            items: ordersArray,
            dateString: t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase() 
          };
        });

        setOrders(mappedOrders);
      } catch (error) { 
        console.error("Firestore order retrieval error: ", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchExhaustiveOrders();
  }, []);

  const handleOrderAgain = (items: OrderItem[]) => { 
    (items || []).forEach(item => dispatch(addProduct({ id: item.id, name: item.name, price: item.price, originalPrice: item.originalPrice || item.price, imageUrl: item.imageUrl, weight: item.weight, stock: 99 }))); 
    router.push('/(tabs)/cart'); 
  };

  const handleViewReceiptDetails = (orderId: string) => {
  router.push({ pathname: "/(tabs)/orders/OrderDetails", params: { orderId } });
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}><Ionicons name="chevron-back" size={24} color="#111" /></TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Your Orders</Text>
      </View>
      {loading ? ( 
        <ActivityIndicator size="large" color="#35035C" style={{ marginTop: 40 }} /> 
      ) : orders.length === 0 ? ( 
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 }}>No previous orders found.</Text> 
      ) : ( 
        <FlatList 
          data={orders} 
          keyExtractor={item => item.id} 
          renderItem={({ item }) => (
            <PreviousOrdersCard 
              status={item.status} 
              totalAmount={item.totalAmount} 
              dateString={item.dateString} 
              items={item.items} 
              onOrderAgain={() => handleOrderAgain(item.items)} 
              onViewDetails={() => handleViewReceiptDetails(item.id)} 
            />
          )} 
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }} 
          showsVerticalScrollIndicator={false} 
        /> 
      )}
    </SafeAreaView>
  );
}
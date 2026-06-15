import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { decrementQuantity, incrementQuantity, removeProduct } from '../redux/cartSlice';
import { CartItem } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { styles } from '../../styles/cart';
import  BillSummary from '../../components/BillSummary'
import Toast from 'react-native-toast-message';
export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#35035C" barStyle="light-content" />
      <Header count={cart.length} />
      <Body data={cart} />
      <Footer data={cart} />
    </SafeAreaView>
  );
}

function Header({ count }: { count: number }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={25} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Cart ({count})</Text>
    </View>
  );
}

function Body({ data }: { data: CartItem[] }) {
  const dispatch = useDispatch();
  const showStockToast = (stock: number) => {
  Toast.show({
    type: 'error',
    text1: `Only ${stock} unit(s) available`,
    position: 'bottom',
  });
};
  const itemTotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 99 ? 0 : 30;
  const handlingFee = 0;
  const totalPay = itemTotal + deliveryFee + handlingFee;

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <View key={index} style={styles.card}>
      <View style={styles.firstChild}>
        <Image style={styles.img} source={{ uri: item.imageUrl }} />

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>₹ {item.price}</Text>
        </View>

        <AntDesign
          onPress={() => dispatch(removeProduct(item))}
          name="close"
          size={24}
          color="#111"
        />
      </View>

      <View style={styles.secondChild}>
        <View style={styles.weightContainer}>
          <Text style={styles.weight}>{item.weight}</Text>
          <AntDesign name="down" size={15} color="#35035C" />
        </View>
        <View style={styles.quantityContainer}>
          <AntDesign
          name="plus-square"
          onPress={() => {

            if (item.quantity >= item.stock) {
              showStockToast(item.stock);
              return;
            }

            dispatch(incrementQuantity(item));
          }}
          size={25}
          color="#fff"
        />
          <Text style={styles.quantity}>{item.quantity}</Text>
          <AntDesign
            name="minus-square"
            onPress={() => dispatch(decrementQuantity(item))}
            size={25}
            color="#fff"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.bodyContainer}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <BillSummary
            itemTotal={itemTotal}
            deliveryFee={deliveryFee}
            handlingFee={handlingFee}
            totalPay={totalPay}
          />
        }
      />
    </View>
  );
}

function Footer({ data }: { data: CartItem[] }) {
  const itemTotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = itemTotal >= 99 ? 0 : 30;
  const totalPay = itemTotal + deliveryFee;

  return (
    <TouchableOpacity style={styles.btn}>
      <Text style={styles.btnText}>Continue to Payment ₹ {totalPay}</Text>
    </TouchableOpacity>
  );
}

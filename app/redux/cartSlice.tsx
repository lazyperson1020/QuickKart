import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  description?: string;
  quantity: number;
}

type CartState = CartItem[];

const CartSlice = createSlice({
  name: 'cart',
  initialState: [] as CartState,
  reducers: {
    addProduct(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      state.push({ ...action.payload, quantity: 1 });
    },
    removeProduct(state, action: PayloadAction<Pick<CartItem, 'id'>>) {
      return state.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity(state, action: PayloadAction<Pick<CartItem, 'id'>>) {
      const product = state.find(item => item.id === action.payload.id);
      if (product) product.quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<Pick<CartItem, 'id'>>) {
      const product = state.find(item => item.id === action.payload.id);
      if (!product) return;
      if (product.quantity === 1) {
        return state.filter(item => item.id !== action.payload.id);
      }
      product.quantity -= 1;
    },
  },
});

export const { addProduct, removeProduct, incrementQuantity, decrementQuantity } =
  CartSlice.actions;
export default CartSlice.reducer;

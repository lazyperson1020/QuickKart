import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  stock: number;
  category?: string;
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [] as WishlistItem[],
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.splice(index, 1);
      } else {
        state.push(action.payload);
      }
    },
    setWishlist(_state, action: PayloadAction<WishlistItem[]>) {
      return action.payload;
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

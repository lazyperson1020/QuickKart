import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppliedOffer {
  id: string;
  title: string;
  logoBg: string;
  logoText: string;
  logoFg: string;
  code: string;
}

interface CouponState {
  appliedPaymentOffer: AppliedOffer | null;
  showOfferModal: boolean;
}

const initialState: CouponState = {
  appliedPaymentOffer: null,
  showOfferModal: false,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    applyPaymentOffer(state, action: PayloadAction<AppliedOffer>) {
      state.appliedPaymentOffer = action.payload;
      state.showOfferModal = true;
    },
    removePaymentOffer(state) {
      state.appliedPaymentOffer = null;
      state.showOfferModal = false;
    },
    dismissOfferModal(state) {
      state.showOfferModal = false;
    },
  },
});

export const { applyPaymentOffer, removePaymentOffer, dismissOfferModal } = couponSlice.actions;
export default couponSlice.reducer;

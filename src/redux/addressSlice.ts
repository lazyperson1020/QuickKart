import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedAddress {
  id: string;
  label: string;
  address: string;
}

interface AddressState {
  selected: SelectedAddress | null;
}

const initialState: AddressState = { selected: null };

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<SelectedAddress | null>) {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_WEBHOOK } from '../../utils/config';
import { parsePrice } from '../../utils/price';

export const submitOrder = createAsyncThunk(
  'order/submit',
  async ({ form, product, user }, { rejectWithValue }) => {
    const unit = parsePrice(product.price);
    const total = unit * form.qty;
    const payload = {
      ...form,
      product: `${product.brand} ${product.name}`,
      price: product.price,
      unit_price: unit,
      total_price: total,
      product_id: product.id,
      timestamp: new Date().toISOString(),
      source: 'GadgetGrid',
      user_id: user?.id || null,
    };
    try {
      await fetch(ORDER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { total, qty: form.qty, name: product.name };
    } catch (e) {
      return rejectWithValue('Network error — order may not have saved');
    }
  }
);

const slice = createSlice({
  name: 'order',
  initialState: {
    isOpen: false,
    selectedProduct: null,
    submitting: false,
  },
  reducers: {
    openModal(state, action) {
      state.isOpen = true;
      state.selectedProduct = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.selectedProduct = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(submitOrder.pending, (s) => { s.submitting = true; });
    b.addCase(submitOrder.fulfilled, (s) => { s.submitting = false; s.isOpen = false; s.selectedProduct = null; });
    b.addCase(submitOrder.rejected, (s) => { s.submitting = false; s.isOpen = false; s.selectedProduct = null; });
  },
});

export const { openModal, closeModal } = slice.actions;
export default slice.reducer;

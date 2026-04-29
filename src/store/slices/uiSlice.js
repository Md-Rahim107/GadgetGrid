import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {
    toast: { show: false, message: '', isError: false },
  },
  reducers: {
    showToast: {
      reducer(state, action) { state.toast = { show: true, ...action.payload }; },
      prepare(message, isError = false) { return { payload: { message, isError } }; },
    },
    hideToast(state) { state.toast.show = false; },
  },
});

export const { showToast, hideToast } = slice.actions;
export default slice.reducer;

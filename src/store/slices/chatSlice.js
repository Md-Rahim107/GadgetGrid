import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CHAT_WEBHOOK } from '../../utils/config';

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async ({ message, userEmail }, { rejectWithValue }) => {
    try {
      const res = await fetch(CHAT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          source: 'GadgetGrid',
          timestamp: new Date().toISOString(),
          user_email: userEmail || 'anonymous',
        }),
      });
      if (!res.ok) throw new Error('Webhook error');
      const data = await res.json().catch(() => null);
      return data?.reply || data?.text || data?.message || data?.output || 'Got it! Our team will follow up shortly.';
    } catch (e) {
      return rejectWithValue("Hmm, I couldn't reach the server. Please try again later.");
    }
  }
);

const slice = createSlice({
  name: 'chat',
  initialState: {
    open: false,
    sending: false,
    messages: [
      { id: 0, cls: 'bot', text: "👋 Hi! I'm GadgetBot. Ask me anything about products, deals, or orders!" },
    ],
  },
  reducers: {
    toggleChat(state) { state.open = !state.open; },
    pushUser(state, action) {
      state.messages.push({ id: Date.now(), cls: 'user', text: action.payload });
    },
  },
  extraReducers: (b) => {
    b.addCase(sendChatMessage.pending, (s) => { s.sending = true; });
    b.addCase(sendChatMessage.fulfilled, (s, a) => {
      s.sending = false;
      s.messages.push({ id: Date.now() + 1, cls: 'bot', text: a.payload });
    });
    b.addCase(sendChatMessage.rejected, (s, a) => {
      s.sending = false;
      s.messages.push({ id: Date.now() + 1, cls: 'bot', text: a.payload });
    });
  },
});

export const { toggleChat, pushUser } = slice.actions;
export default slice.reducer;

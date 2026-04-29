import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../utils/supabase';

const localOrigin = typeof window !== 'undefined' ? `${window.location.origin.replace(/\/+$/, '')}/` : '/';
const envRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL
  ? `${import.meta.env.VITE_AUTH_REDIRECT_URL.replace(/\/+$/, '')}/`
  : '';
const authRedirectUrl =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? localOrigin
    : envRedirectUrl || localOrigin;

export const initAuth = createAsyncThunk('auth/init', async (_, { dispatch }) => {
  // Handle PKCE OAuth callback: Supabase v2 returns ?code= as a query param, not a hash.
  // exchangeCodeForSession reads the ?code param, exchanges it for a session, and cleans the URL.
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      await supabase.auth.exchangeCodeForSession(window.location.href);
    }
  }

  const { data } = await supabase.auth.getSession();
  const session = data.session;

  supabase.auth.onAuthStateChange((_event, authSession) => {
    dispatch(setUser(authSession?.user || null));
  });

  return session?.user || null;
});

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, fullName }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: authRedirectUrl,
      },
    });
    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/google',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectUrl,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });

    if (error) return rejectWithValue(error.message);
    if (data?.url && typeof window !== 'undefined') {
      window.location.href = data.url;
      return true;
    }

    return true;
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await supabase.auth.signOut();
  return null;
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    initialized: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(initAuth.fulfilled, (s, a) => {
      s.user = a.payload;
      s.initialized = true;
    });
    b.addCase(initAuth.rejected, (s) => {
      s.initialized = true;
    });
    b.addCase(signIn.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(signIn.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; });
    b.addCase(signIn.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(signUp.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(signUp.fulfilled, (s) => { s.loading = false; });
    b.addCase(signUp.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(signInWithGoogle.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(signInWithGoogle.fulfilled, (s) => { s.loading = false; });
    b.addCase(signInWithGoogle.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(signOut.fulfilled, (s) => { s.user = null; });
  },
});

export const { setUser, clearError } = slice.actions;
export default slice.reducer;
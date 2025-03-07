
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.API_URL;

interface ProfileState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: true,
  error: null,
};

// Thunk to fetch profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const token = localStorage.getItem('docPocAuth_token');
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
});

// Thunk to update the access token
export const updateAccessToken = createAsyncThunk(
  'profile/updateAccessToken',
  async (newToken: string, { dispatch }) => {
    // Update the token in localStorage
    localStorage.setItem('docPocAuth_token', newToken);

    // Fetch the updated profile
    await dispatch(fetchProfile());
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
    },
  },
  // In your profileSlice.js
extraReducers: (builder) => {
  builder
    .addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch profile';
    })
    .addCase(updateAccessToken.fulfilled, (state) => {
      // Optionally handle any state changes when the token is updated
    });
}
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
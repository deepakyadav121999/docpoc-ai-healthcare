// src/slices/appointmentsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.API_URL;

interface AppointmentsState {
  data: any[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: AppointmentsState = {
  data: [],
  loading: false,
  error: null,
  total: 0,
};

// Thunk to fetch appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (params: any) => {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.get(`${API_URL}/appointment/list/${params.branchId}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.rows || action.payload;
        state.total = action.payload.count || action.payload.length; // Ensure total is updated
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch appointments";
      });
  },
});

export default appointmentsSlice.reducer;
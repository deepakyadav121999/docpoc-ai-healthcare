// src/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { subMonths, format } from "date-fns";

const API_URL = process.env.API_URL;

interface Metric {
  currentValue: number;
  previousValue: number;
  growthRate: number;
  currency?: string;
}

interface DashboardState {
  patients: Metric;
  bookings: Metric;
  payments: Metric;
  campaigns: Metric;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  patients: { currentValue: 0, previousValue: 0, growthRate: 0 },
  bookings: { currentValue: 0, previousValue: 0, growthRate: 0 },
  payments: { currentValue: 0, previousValue: 0, growthRate: 0, currency: "₹" },
  campaigns: { currentValue: 0, previousValue: 0, growthRate: 0 },
  loading: false,
  error: null,
  lastUpdated: null,
};

// Helper function to calculate growth rate
const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
};

// Helper function to format date for API
const formatDateForAPI = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

// Generic fetch function for all metrics
const fetchMetricData = async (
  endpoint: string,
  branchId: string,
  token: string,
): Promise<{ current: number; previous: number }> => {
  // Current period (last 30 days)
  const currentTo = new Date();
  const currentFrom = subMonths(currentTo, 1);

  // Previous period (30-60 days ago)
  const previousTo = currentFrom;
  const previousFrom = subMonths(previousTo, 1);

  // Fetch current period data
  const currentResponse = await axios.get(
    `${API_URL}/${endpoint}/list/${branchId}`,
    {
      params: {
        from: formatDateForAPI(currentFrom),
        to: formatDateForAPI(currentTo),
        page: 1,
        pageSize: 1, // We only need the count
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  // Fetch previous period data
  const previousResponse = await axios.get(
    `${API_URL}/${endpoint}/list/${branchId}`,
    {
      params: {
        from: formatDateForAPI(previousFrom),
        to: formatDateForAPI(previousTo),
        page: 1,
        pageSize: 1, // We only need the count
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    current: currentResponse.data.count,
    previous: previousResponse.data.count,
  };
};

// Thunk to fetch all dashboard metrics
export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchAllMetrics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("docPocAuth_token");
      if (!token) throw new Error("User not authenticated");

      // Get branchId from profile or state if available
      const state = getState() as any;
      const branchId =
        state?.profile?.data?.branchId ||
        "ace96994-7b68-4c95-9ede-181dd5890eff";

      // Fetch all metrics in parallel
      const [patients, bookings, payments, campaigns] = await Promise.all([
        fetchMetricData("patient", branchId, token),
        fetchMetricData("appointment", branchId, token),
        fetchMetricData("payment", branchId, token),
        fetchMetricData("campaign", branchId, token),
      ]);

      return {
        patients: {
          currentValue: patients.current,
          previousValue: patients.previous,
          growthRate: calculateGrowthRate(patients.current, patients.previous),
        },
        bookings: {
          currentValue: bookings.current,
          previousValue: bookings.previous,
          growthRate: calculateGrowthRate(bookings.current, bookings.previous),
        },
        payments: {
          currentValue: payments.current,
          previousValue: payments.previous,
          growthRate: calculateGrowthRate(payments.current, payments.previous),
          currency: "₹",
        },
        campaigns: {
          currentValue: campaigns.current,
          previousValue: campaigns.previous,
          growthRate: calculateGrowthRate(
            campaigns.current,
            campaigns.previous,
          ),
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.patients;
        state.bookings = action.payload.bookings;
        state.payments = action.payload.payments;
        state.campaigns = action.payload.campaigns;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch dashboard metrics";
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;

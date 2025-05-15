import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


const API_URL = process.env.API_URL;

export interface DashboardStats {
  bookings: {
    current: number;
    previous: number;
  };
  revenue: {
    current: number;
    previous: number;
  };
  campaigns: {
    current: number;
    previous: number;
  };
  patients: {
    current: number;
    previous: number;
  };
}

const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
};

const fetchWithFallback = async (fetchFn: () => Promise<any>, defaultValue: any) => {
  try {
    return await fetchFn();
  } catch (error) {
    console.error("API call failed:", error);
    return defaultValue;
  }
};

const fetchPatients = async (branchId: string, from: string, to: string) => {
  const response = await axios.get(`${API_URL}/patient/list/${branchId}`, {
    params: { page: 1, pageSize: 1, from, to },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("docPocAuth_token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.count || 0;
};

const fetchBookings = async (branchId: string, from: string, to: string) => {
  const response = await axios.get(`${API_URL}/appointment/list/${branchId}`, {
    params: { page: 1, pageSize: 1, from, to },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("docPocAuth_token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.count || 0;
};

const fetchRevenue = async (branchId: string, from: string, to: string) => {
  const response = await axios.get(`${API_URL}/payment/list/${branchId}`, {
    params: { page: 1, pageSize: 100, from, to, status: "Completed" },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("docPocAuth_token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.rows?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
};

const fetchCampaigns = async (branchId: string, from: string, to: string) => {
  const response = await axios.get(`${API_URL}/campaign/list/${branchId}`, {
    params: { page: 1, pageSize: 1, from, to },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("docPocAuth_token")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.count || 0;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const profile = useSelector((state: RootState) => state.profile.data);
  const branchId = profile?.branchId;
  
  if (!branchId) throw new Error("Branch ID not available");
  
  const token = localStorage.getItem("docPocAuth_token");
  if (!token) throw new Error("Authentication token not found");

  // Current period (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const currentFrom = thirtyDaysAgo.toISOString();
  const currentTo = now.toISOString();

  // Previous period (30-60 days ago)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const previousFrom = sixtyDaysAgo.toISOString();
  const previousTo = thirtyDaysAgo.toISOString();

  const [
    currentPatients,
    previousPatients,
    currentBookings,
    previousBookings,
    currentRevenue,
    previousRevenue,
    currentCampaigns,
    previousCampaigns,
  ] = await Promise.all([
    fetchWithFallback(() => fetchPatients(branchId, currentFrom, currentTo), 0),
    fetchWithFallback(() => fetchPatients(branchId, previousFrom, previousTo), 0),
    fetchWithFallback(() => fetchBookings(branchId, currentFrom, currentTo), 0),
    fetchWithFallback(() => fetchBookings(branchId, previousFrom, previousTo), 0),
    fetchWithFallback(() => fetchRevenue(branchId, currentFrom, currentTo), 0),
    fetchWithFallback(() => fetchRevenue(branchId, previousFrom, previousTo), 0),
    fetchWithFallback(() => fetchCampaigns(branchId, currentFrom, currentTo), 0),
    fetchWithFallback(() => fetchCampaigns(branchId, previousFrom, previousTo), 0),
  ]);

  return {
    bookings: {
      current: currentBookings,
      previous: previousBookings,
    },
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
    },
    campaigns: {
      current: currentCampaigns,
      previous: previousCampaigns,
    },
    patients: {
      current: currentPatients,
      previous: previousPatients,
    },
  };
};
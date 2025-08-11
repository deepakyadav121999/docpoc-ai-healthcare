import axios from "axios";

const API_URL = process.env.API_URL;

interface UsageType {
  userId: string;
  usageType: string;
  currentPeriod: {
    usage: number;
    limit: number;
    percentage: number;
    periodStart: string;
    periodEnd: string;
  };
  historical: any[];
  credits: {
    additional: number;
    purchased: number;
    remaining: number;
  };
  branchInfo: {
    branchId: string;
    totalBranchUsers: number;
    isAggregated: boolean;
    note: string;
  };
}

export interface UsageData {
  ai_tokens?: UsageType;
  storage_bytes?: UsageType;
  whatsapp_credits?: UsageType;
}

// Cache for usage data to prevent too many requests
let usageCache: {
  data: UsageData | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const getUsageData = async (): Promise<UsageData> => {
  const now = Date.now();

  // Check if we have cached data that's still valid
  if (usageCache.data && now - usageCache.timestamp < CACHE_DURATION) {
    console.log("Returning cached usage data");
    return usageCache.data;
  }

  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    console.log("Fetching fresh usage data from API");
    const response = await axios.get(`${API_URL}/subscription/usage`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Update cache
    usageCache = {
      data: response.data,
      timestamp: now,
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching usage data:", error);

    // If we have old cached data, return it as fallback
    if (usageCache.data) {
      console.log("API failed, returning stale cached data");
      return usageCache.data;
    }

    throw error;
  }
};

// Helper function to format bytes to MB
export const formatBytesToMB = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

// Helper function to format bytes to appropriate unit (MB/GB)
export const formatBytes = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  const gb = mb / 1024;

  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  } else {
    return `${mb.toFixed(1)} MB`;
  }
};

// Helper function to calculate percentage
export const calculateUsagePercentage = (
  used: number,
  total: number,
): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

// Clear cache function (useful for manual refresh)
export const clearUsageCache = (): void => {
  usageCache = {
    data: null,
    timestamp: 0,
  };
};

// Subscription Plans Interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  status: string;
  description: string;
  planType: string;
  monthlyPrice: string;
  quarterlyPrice: string;
  yearlyPrice: string;
  maxUsers: number;
  aiTokensLimit: number;
  aiTokensResetPeriod: string;
  whatsappCreditsLimit: number;
  whatsappCreditsResetPeriod: string;
  storageLimitBytes: number;
  features: {
    aiChat: boolean;
    reports: number;
    patients: boolean;
    payments: boolean;
    analytics: number;
    appointments: boolean;
    prioritySupport: number;
    whatsappNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Cache for plans data
let plansCache: {
  data: SubscriptionPlan[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// Fetch subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const now = Date.now();

  // Check if we have cached data that's still valid
  if (plansCache.data && now - plansCache.timestamp < CACHE_DURATION) {
    console.log("Returning cached plans data");
    return plansCache.data;
  }

  const token = localStorage.getItem("docPocAuth_token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    console.log("Fetching fresh plans data from API");
    const response = await axios.get(
      `${API_URL}/subscription/plans?includePrivate=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Update cache
    plansCache = {
      data: response.data,
      timestamp: now,
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching plans data:", error);

    // If we have old cached data, return it as fallback
    if (plansCache.data) {
      console.log("API failed, returning stale cached plans data");
      return plansCache.data;
    }

    throw error;
  }
};

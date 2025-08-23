"use client";
import React, { useState, useEffect } from "react";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import {
  getUsageData,
  formatBytes,
  getSubscriptionPlans,
  getMySubscription,
  SubscriptionPlan,
  MySubscriptionResponse,
} from "@/api/usage";
import UsageStatsSkeleton from "./UsageStatsSkeleton";
import SubscriptionPlans from "./SubscriptionPlans";

const Premium = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<MySubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [__retryCount, setRetryCount] = useState(0);

  const fetchData = async (isRetry = false) => {
    try {
      setLoading(true);
      setPlansLoading(true);
      setError(null);

      // Clear previous data on retry
      if (isRetry) {
        setUsageData(null);
        setPlans([]);
        setCurrentSubscription(null);
      }

      // Fetch usage data, plans, and current subscription in parallel
      const [usageResponse, plansResponse, subscriptionResponse] =
        await Promise.all([
          getUsageData(),
          getSubscriptionPlans(),
          getMySubscription(),
        ]);

      setUsageData(usageResponse);
      setPlans(plansResponse);
      setCurrentSubscription(subscriptionResponse);
      // setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching data:", err);

      // Determine error message based on error type
      let errorMessage = "Something went wrong. Please refresh to try again.";

      if (err?.code === "NETWORK_ERROR" || err?.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and refresh.";
      } else if (
        err?.code === "ECONNRESET" ||
        err?.message?.includes("ECONNRESET")
      ) {
        errorMessage = "Connection was reset. Please refresh to try again.";
      } else if (err?.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and refresh.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please refresh to try again.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      }

      setError(errorMessage);
      setUsageData(null);
      setPlans([]);
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show error state
  if (error && !loading) {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <div className="rounded-[15px] border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Unable to Load Data
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => fetchData(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <UsageStatsSkeleton />
        </div>
      </div>
    );
  }

  // Extract data from different usage types - NO hardcoded fallbacks
  const whatsappUsed = usageData?.whatsapp_credits?.currentPeriod?.usage ?? 0;
  const whatsappLimit = usageData?.whatsapp_credits?.currentPeriod?.limit ?? 0;

  const storageUsed = usageData?.storage_bytes?.currentPeriod?.usage ?? 0;
  const storageLimit = usageData?.storage_bytes?.currentPeriod?.limit ?? 0;

  // Extract AI tokens data
  const aiTokensUsed = usageData?.ai_tokens?.currentPeriod?.usage ?? 0;
  const aiTokensLimit = usageData?.ai_tokens?.currentPeriod?.limit ?? 0;

  // Calculate growth rates (safe division)
  const whatsappPercentage =
    whatsappLimit > 0
      ? Math.min(Math.round((whatsappUsed / whatsappLimit) * 100), 100)
      : 0;
  const storagePercentage =
    storageLimit > 0
      ? Math.min(Math.round((storageUsed / storageLimit) * 100), 100)
      : 0;
  const aiTokensPercentage =
    aiTokensLimit > 0
      ? Math.min(Math.round((aiTokensUsed / aiTokensLimit) * 100), 100)
      : 0;

  const dataStatsListCredit: dataStatsDefault[] = [
    {
      icon: <SVGIconProvider iconName="whats-app" color="#FF9C55" />,
      color: "#1bb520",
      title:
        "Total whatsapp credit left (each credit is one whatsapp notification)",
      value: `Total: ${whatsappUsed}/${whatsappLimit} credits`,
      growthRate: whatsappPercentage,
    },
    {
      icon: <SVGIconProvider iconName="ai" color="#8155FF" />,
      color: "#c4b7f7",
      title: "AI tokens used for document processing and analysis",
      value: `AI Tokens: ${aiTokensUsed.toLocaleString()}/${aiTokensLimit.toLocaleString()}`,
      growthRate: aiTokensPercentage,
    },
    {
      icon: <SVGIconProvider iconName="document" color="#8155FF" />,
      color: "#FF9C55",
      title: "Combined size of all the documents generated till date.",
      value: `Documents: ${formatBytes(storageUsed)}`,
      growthRate: storagePercentage,
    },
  ];
  return (
    <>
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <DataStatsDefault dataStatsList={dataStatsListCredit} />

          {/* Subscription Plans Section */}
          <SubscriptionPlans
            plans={plans}
            loading={plansLoading}
            currentSubscription={currentSubscription}
          />
        </div>
      </div>
    </>
  );
};
export default Premium;

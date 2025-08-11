"use client";
import React, { useState, useEffect } from "react";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import {
  getUsageData,
  formatBytes,
  getSubscriptionPlans,
  SubscriptionPlan,
} from "@/api/usage";
import UsageStatsSkeleton from "./UsageStatsSkeleton";
import SubscriptionPlans from "./SubscriptionPlans";

const Premium = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPlansLoading(true);

        // Fetch both usage data and plans in parallel
        const [usageResponse, plansResponse] = await Promise.all([
          getUsageData(),
          getSubscriptionPlans(),
        ]);

        setUsageData(usageResponse);
        setPlans(plansResponse);
      } catch (err) {
        console.error("Error fetching data:", err);
        setUsageData(null);
        setPlans([]);
      } finally {
        setLoading(false);
        setPlansLoading(false);
      }
    };

    fetchData();
  }, []);

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
  // const storageAdditionalCredits =
  //   usageData?.storage_bytes?.credits?.additional ?? 0;

  // Calculate growth rates (safe division)
  const whatsappPercentage =
    whatsappLimit > 0
      ? Math.min(Math.round((whatsappUsed / whatsappLimit) * 100), 100)
      : 0;
  const storagePercentage =
    storageLimit > 0
      ? Math.min(Math.round((storageUsed / storageLimit) * 100), 100)
      : 0;

  const dataStatsListCredit: dataStatsDefault[] = [
    {
      icon: <SVGIconProvider iconName="storage" color="#FF9C55" />,
      color: "#4b9c78",
      title:
        "Total whatsapp credit left (each credit is one whatsapp notification)",
      value: `Total: ${whatsappUsed}/${whatsappLimit} credits`,
      growthRate: whatsappPercentage,
    },
    {
      icon: <SVGIconProvider iconName="calendar" color="#FF9C55" />,
      color: "#8155FF",
      title: "Storage used since last 30 days",
      value: `Last Month: ${formatBytes(storageUsed)}`,
      growthRate: storagePercentage,
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
          <SubscriptionPlans plans={plans} loading={plansLoading} />
        </div>
      </div>
    </>
  );
};
export default Premium;

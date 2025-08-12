"use client";

import { GLOBAL_ACTION_ICON_COLOR, GLOBAL_DANGER_COLOR } from "@/constants";

import React, { useState, useEffect } from "react";

import ChartCircular from "../Charts/ChartCircular";
import { ApexOptions } from "apexcharts";
import {
  getUsageData,
  calculateUsagePercentage,
  formatBytes,
} from "@/api/usage";
import StorageChartSkeleton from "./StorageChartSkeleton";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import UsageStatsSkeleton from "./UsageStatsSkeleton";

const Usages = () => {
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        const data = await getUsageData();
        setUsageData(data);
      } catch (err) {
        console.error("Error fetching usage data:", err);
        setUsageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <UsageStatsSkeleton />
          <div className="mt-8">
            <StorageChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Calculate real values from API data - NO hardcoded fallbacks except 0
  const usedStorage = usageData?.storage_bytes?.currentPeriod?.usage ?? 0;
  const totalStorage = usageData?.storage_bytes?.currentPeriod?.limit ?? 0;
  const freeStorage = totalStorage - usedStorage;
  const usagePercentage =
    totalStorage > 0 ? calculateUsagePercentage(usedStorage, totalStorage) : 0;
  const freePercentage = 100 - usagePercentage;

  // Extract AI tokens and WhatsApp credits data
  const aiTokensUsed = usageData?.ai_tokens?.currentPeriod?.usage ?? 0;
  const aiTokensLimit = usageData?.ai_tokens?.currentPeriod?.limit ?? 0;
  const whatsappUsed = usageData?.whatsapp_credits?.currentPeriod?.usage ?? 0;
  const whatsappLimit = usageData?.whatsapp_credits?.currentPeriod?.limit ?? 0;

  // Calculate percentages for the data stats cards
  const aiTokensPercentage =
    aiTokensLimit > 0
      ? Math.min(Math.round((aiTokensUsed / aiTokensLimit) * 100), 100)
      : 0;
  const whatsappPercentage =
    whatsappLimit > 0
      ? Math.min(Math.round((whatsappUsed / whatsappLimit) * 100), 100)
      : 0;
  const storagePercentage =
    totalStorage > 0
      ? Math.min(Math.round((usedStorage / totalStorage) * 100), 100)
      : 0;

  // Data stats for the cards (similar to Premium.tsx but with AI tokens instead of last month)
  const dataStatsListUsage: dataStatsDefault[] = [
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
      value: `Documents: ${formatBytes(usedStorage)}`,
      growthRate: storagePercentage,
    },
  ];

  const series = [usedStorage, freeStorage];

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: [GLOBAL_DANGER_COLOR, GLOBAL_ACTION_ICON_COLOR],
    labels: ["Storage used", "Storage free"],
    legend: {
      show: false,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value: number) {
          return formatBytes(value);
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Storage",
              fontSize: "14px", // Smaller for mobile
              fontWeight: "400",
              formatter: function () {
                return formatBytes(totalStorage);
              },
            },
            value: {
              show: true,
              fontSize: "20px", // Smaller for mobile
              fontWeight: "bold",
              formatter: function () {
                return formatBytes(usedStorage);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: {
                    fontSize: "16px",
                  },
                  value: {
                    fontSize: "28px",
                  },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            width: 300,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: {
                    fontSize: "15px",
                  },
                  value: {
                    fontSize: "24px",
                  },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 250,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: {
                    fontSize: "12px",
                  },
                  value: {
                    fontSize: "18px",
                  },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: {
                    fontSize: "10px",
                  },
                  value: {
                    fontSize: "14px",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };
  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full">
        {/* Data Stats Cards */}
        <DataStatsDefault dataStatsList={dataStatsListUsage} />

        {/* Storage Chart Section */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-9">
            <div className="flex flex-col w-full">
              <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
                  <div className="flex flex-col w-full justify-center">
                    <div style={{ wordWrap: "break-word" }}>
                      <h3
                        style={{ color: GLOBAL_ACTION_ICON_COLOR }}
                        className="text-sm sm:text-base"
                      >
                        As your current app is the free version, storage is
                        limited to{" "}
                        {totalStorage > 0
                          ? formatBytes(totalStorage)
                          : "250 Mega Bytes"}
                        . Storage can be increased by either upgrade to premium
                        or purchasing storage credits.
                      </h3>
                    </div>

                    <ChartCircular
                      series={series}
                      options={options}
                      data={[
                        {
                          label: `Used (${formatBytes(usedStorage)})`,
                          percentage: usagePercentage,
                          color: GLOBAL_DANGER_COLOR,
                        },
                        {
                          label: `Free (${formatBytes(freeStorage)})`,
                          percentage: freePercentage,
                          color: GLOBAL_ACTION_ICON_COLOR,
                        },
                      ]}
                      label="Storage Overview"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usages;

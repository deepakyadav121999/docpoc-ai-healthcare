"use client";
import React, { useEffect, useState } from "react";
import { GLOBAL_ICON_COLOR_WHITE } from "@/constants";

import ChartLine from "../Charts/ChartLine";
import { ApexOptions } from "apexcharts";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import DataTable from "./DataTable";
import { useUser } from "../Context/UserContext";
import Loader from "../common/Loader";

interface OverviewData {
  totalReminders: number;
  totalRemindersPercentageChange: number;
  newPatientsWithReminders: number;
  newPatientsWithRemindersPercentageChange: number;
  lastMonthTotal: number;
}

const loadingStats: dataStatsDefault[] = [
  {
    icon: <div />,
    color: "#a0aec0",
    title: "Loading...",
    value: "...",
    growthRate: 0,
  },
  {
    icon: <div />,
    color: "#a0aec0",
    title: "Loading...",
    value: "...",
    growthRate: 0,
  },
  {
    icon: <div />,
    color: "#a0aec0",
    title: "Loading...",
    value: "...",
    growthRate: 0,
  },
];

export default function App() {
  const { userProfile } = useUser();
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (userProfile?.branchId) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/reminders/overview?branchId=${userProfile.branchId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setOverviewData(data);
          } else {
            console.error("Failed to fetch overview data");
            setOverviewData(null);
          }
        } catch (error) {
          console.error("Error fetching overview data:", error);
          setOverviewData(null);
        } finally {
          setLoading(false);
        }
      } else if (userProfile) {
        // branchId is not present
        setLoading(false);
      }
    };

    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  const dataStatsList: dataStatsDefault[] = overviewData
    ? [
        {
          icon: (
            <SVGIconProvider
              iconName="reminder"
              color={GLOBAL_ICON_COLOR_WHITE}
            />
          ),
          color: "#4b9c78",
          title: "Total notifications sent to patients",
          value: `Total: ${overviewData.totalReminders}`,
          growthRate: overviewData.totalRemindersPercentageChange,
        },
        {
          icon: (
            <SVGIconProvider iconName="phone" color={GLOBAL_ICON_COLOR_WHITE} />
          ),
          color: "#FF9C55",
          title:
            "Reminders sent to a new patient for the first time (since last month)",
          value: `New reminders: ${overviewData.newPatientsWithReminders}`,
          growthRate: overviewData.newPatientsWithRemindersPercentageChange,
        },
        {
          icon: (
            <SVGIconProvider iconName="rupee" color={GLOBAL_ICON_COLOR_WHITE} />
          ),
          color: "#8155FF",
          title: "Total number of notifications sent (past 30 days)",
          value: `Last Month: ${overviewData.lastMonthTotal}`,
          growthRate: 0,
        },
      ]
    : [];

  const OverView = () => {
    const series = [
      {
        name: "Reminders Sent",
        data: [1200, 6000, 7500, 9000, 11000, 18000, 20000],
      },
    ];

    const options: ApexOptions = {
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
      },
      colors: ["#0ABEF9"],
      chart: {
        fontFamily: "Satoshi, sans-serif",
        height: 310,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      fill: {
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
        },
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 1366,
          options: {
            chart: {
              height: 320,
            },
          },
        },
      ],
      stroke: {
        curve: "smooth",
      },

      markers: {
        size: 0,
      },
      grid: {
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        fixed: {
          enabled: !1,
        },
        x: {
          show: !1,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
        marker: {
          show: !1,
        },
      },
      xaxis: {
        type: "category",
        categories: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          style: {
            fontSize: "0px",
          },
        },
      },
    };

    const footer = {
      start: { title: "Reminders Sent (since last 3 months)", data: "24,000+" },
      end: { title: "Reminder Sent (between Jan - Mar 2024)", data: "42,000+" },
    };
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          {loading && <DataStatsDefault dataStatsList={loadingStats} />}
          {!loading && overviewData && (
            <DataStatsDefault dataStatsList={dataStatsList} />
          )}
          {!loading && !overviewData && (
            <div className="flex justify-center items-center h-48">
              <p className="text-lg text-gray-500">
                Could not load reminder overview data.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <DataTable />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <ChartLine
            options={options}
            series={series}
            label="Reminders Overview"
            footer={footer}
          />
        </div>
      </div>
    );
  };

  return <OverView />;
}

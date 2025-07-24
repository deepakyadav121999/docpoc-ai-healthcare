"use client";
import React, { useState, useEffect } from "react";
import { GLOBAL_ICON_COLOR_WHITE } from "@/constants";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import ReportDataTable from "./ReportDataTable";
import DataStatsReport from "./DataStatsReport";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function App() {
  const [dataStatsList, setDataStatsList] = useState<dataStatsDefault[]>([]);
  const [loading, setLoading] = useState(true);
  const profile = useSelector((state: RootState) => state.profile.data);
  const API_URL = process.env.API_URL;

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const token = localStorage.getItem("docPocAuth_token");
        const branchId = profile?.branchId;

        if (!branchId) {
          throw new Error("Branch ID not available");
        }

        const now = new Date();

        // For total reports - current month
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );
        const currentMonthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
        );

        // For last month
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // For two months ago (to calculate growth)
        const twoMonthsAgoStart = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          1,
        );
        const twoMonthsAgoEnd = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          0,
        );

        // Make a single API call for the last 3 months
        const response = await axios.get(
          `${API_URL}/reports/list/${branchId}`,
          {
            params: {
              page: 1,
              pageSize: 1000, // Get all reports for the period
              from: twoMonthsAgoStart.toISOString(),
              to: currentMonthEnd.toISOString(),
              reportType: ["MEDICAL_REPORT", "INVOICE"],
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const reports = response.data.rows || [];

        interface Report {
          reportDate: string;
          [key: string]: any;
        }

        // Count reports for each period
        const currentMonthCount = reports.filter((report: Report) => {
          const reportDate = new Date(report.reportDate);
          return (
            reportDate >= currentMonthStart && reportDate <= currentMonthEnd
          );
        }).length;

        const lastMonthCount = reports.filter((report: Report) => {
          const reportDate = new Date(report.reportDate);
          return reportDate >= lastMonthStart && reportDate <= lastMonthEnd;
        }).length;

        const twoMonthsAgoCount = reports.filter((report: Report) => {
          const reportDate = new Date(report.reportDate);
          return (
            reportDate >= twoMonthsAgoStart && reportDate <= twoMonthsAgoEnd
          );
        }).length;

        // Calculate growth rates
        const totalGrowthRate =
          lastMonthCount > 0
            ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
            : 0;

        const lastMonthGrowthRate =
          twoMonthsAgoCount > 0
            ? ((lastMonthCount - twoMonthsAgoCount) / twoMonthsAgoCount) * 100
            : 0;

        // Update data stats list with real data and growth rates
        setDataStatsList([
          {
            icon: (
              <SVGIconProvider
                iconName="smalldocument"
                color={GLOBAL_ICON_COLOR_WHITE}
              />
            ),
            color: "#4b9c78",
            title: "Total Reports generated",
            value: `Total: ${currentMonthCount}`,
            growthRate: Math.round(totalGrowthRate * 10) / 10,
          },
          {
            icon: (
              <SVGIconProvider
                iconName="smalldocument"
                color={GLOBAL_ICON_COLOR_WHITE}
              />
            ),
            color: "#8155FF",
            title: "Total number of reports generated (past 30 days)",
            value: `Last Month: ${lastMonthCount}`,
            growthRate: Math.round(lastMonthGrowthRate * 10) / 10,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching report stats:", error);
        setLoading(false);
      }
    };

    fetchReportStats();
  }, [API_URL, profile?.branchId]);

  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full">
        <DataStatsReport dataStatsList={dataStatsList} loading={loading} />
      </div>
      <div className="flex flex-col w-full" style={{ marginTop: 45 }}>
        <ReportDataTable />
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";

// import DataStatsOne from "../DataStats/DataStatsOne";

// import ChartLine from "../Charts/ChartLine";
// import { ApexOptions } from "apexcharts";
import PaymentDataTable from "./PaymentDataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";

interface DashboardData {
  stats: {
    patients: { current: number; previous: number };
    bookings: { current: number; previous: number };
    // revenue: { current: number; previous: number };
    // campaigns: { current: number; previous: number };
  };
  visitTypes: {
    types?: { id: string; name: string }[];
    // appointments?: Appointment[];
  };
}

const throttle = <T extends unknown[], R>(
  func: (...args: T) => R,
  limit: number,
) => {
  let inThrottle = false;
  return function (this: any, ...args: T) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// export default function App() {
const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const profile = useSelector((state: RootState) => state.profile.data);
  const branchId = profile?.branchId;

  const fetchDataWithFallback = async (
    fetchFunction: () => Promise<any>,
    defaultValue: any,
  ) => {
    try {
      const response = await fetchFunction();
      return response;
    } catch (err) {
      console.error("API call failed:", err);
      return defaultValue;
    }
  };

  const fetchDashboardData = async () => {
    if (!branchId) {
      setError("Branch ID not available");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Set date ranges
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const currentFrom = thirtyDaysAgo.toISOString();
      const currentTo = now.toISOString();
      const previousFrom = sixtyDaysAgo.toISOString();
      const previousTo = thirtyDaysAgo.toISOString();

      // Create axios instance with common headers
      const api = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // First fetch - appointment types and current appointments
      const [typesResponse] = await Promise.all([
        fetchDataWithFallback(
          () => api.get(`${process.env.API_URL}/appointment/types/${branchId}`),
          { data: [] },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${process.env.API_URL}/appointment/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: currentFrom,
                to: currentTo,
              },
            }),
          { data: { rows: [] } },
        ),
      ]);

      // Second fetch - all other data in batches
      const [
        currentPatients,
        previousPatients,
        currentBookings,
        previousBookings,
      ] = await Promise.all([
        fetchDataWithFallback(
          () =>
            api.get(`${process.env.API_URL}/patient/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1,
                from: currentFrom,
                to: currentTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${process.env.API_URL}/patient/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1,
                from: previousFrom,
                to: previousTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${process.env.API_URL}/appointment/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1,
                from: currentFrom,
                to: currentTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${process.env.API_URL}/appointment/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1,
                from: previousFrom,
                to: previousTo,
              },
            }),
          { data: { count: 0 } },
        ),
      ]);

      // Third fetch - revenue and campaigns
      // const [
      //   currentRevenue,
      //   previousRevenue,
      //   // currentCampaigns,
      //   // previousCampaigns,
      // ] = await Promise.all([
      //   fetchDataWithFallback(
      //     () =>
      //       api.get(`${process.env.API_URL}/payments/list/${branchId}`, {
      //         params: {
      //           page: 1,
      //           pageSize: 1,
      //           from: currentFrom,
      //           to: currentTo,
      //           status: "Completed,PENDING",
      //         },
      //       }),
      //     { data: { rows: [] } },
      //   ),
      //   fetchDataWithFallback(
      //     () =>
      //       api.get(`${process.env.API_URL}/payments/list/${branchId}`, {
      //         params: {
      //           page: 1,
      //           pageSize: 1,
      //           from: previousFrom,
      //           to: previousTo,
      //           status: "Completed,PENDING",
      //         },
      //       }),
      //     { data: { rows: [] } },
      //   ),
      // fetchDataWithFallback(
      //   () =>
      //     api.get(`${API_URL}/campaign/list/${branchId}`, {
      //       params: {
      //         page: 1,
      //         pageSize: 1,
      //         from: currentFrom,
      //         to: currentTo,
      //       },
      //     }),
      //   { data: { count: 0 } },
      // ),
      // fetchDataWithFallback(
      //   () =>
      //     api.get(`${API_URL}/campaign/list/${branchId}`, {
      //       params: {
      //         page: 1,
      //         pageSize: 1,
      //         from: previousFrom,
      //         to: previousTo,
      //       },
      //     }),
      //   { data: { count: 0 } },
      // ),
      // ]);

      setData({
        stats: {
          patients: {
            current: currentPatients.data.count,
            previous: previousPatients.data.count,
          },
          bookings: {
            current: currentBookings.data.count,
            previous: previousBookings.data.count,
          },
          // revenue: {
          //   current:
          //     currentRevenue.data.rows?.reduce(
          //       (sum: number, payment: any) => sum + (payment.amount || 0),
          //       0,
          //     ) || 0,
          //   previous:
          //     previousRevenue.data.rows?.reduce(
          //       (sum: number, payment: any) => sum + (payment.amount || 0),
          //       0,
          //     ) || 0,
          // },
          // campaigns: {
          //   current: currentCampaigns.data.count,
          //   previous: previousCampaigns.data.count,
          // },
        },
        visitTypes: {
          types: typesResponse.data,
          // appointments: appointmentsResponse.data.rows,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Throttled version of fetchDashboardData
  const throttledFetch = throttle(fetchDashboardData, 1000);

  useEffect(() => {
    throttledFetch();
  }, [branchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center py-10">No data available</div>;
  }

  const OverView = () => {
    // const series = [
    //   {
    //     name: "Received Amount",
    //     data: [75, 60, 75, 90, 110, 180, 200],
    //   },
    // ];

    // const options: ApexOptions = {
    //   legend: {
    //     show: false,
    //     position: "top",
    //     horizontalAlign: "left",
    //   },
    //   colors: ["#0ABEF9"],
    //   chart: {
    //     fontFamily: "Satoshi, sans-serif",
    //     height: 310,
    //     type: "area",
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   fill: {
    //     gradient: {
    //       opacityFrom: 0.55,
    //       opacityTo: 0,
    //     },
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       options: {
    //         chart: {
    //           height: 300,
    //         },
    //       },
    //     },
    //     {
    //       breakpoint: 1366,
    //       options: {
    //         chart: {
    //           height: 320,
    //         },
    //       },
    //     },
    //   ],
    //   stroke: {
    //     curve: "smooth",
    //   },

    //   markers: {
    //     size: 0,
    //   },
    //   grid: {
    //     strokeDashArray: 5,
    //     xaxis: {
    //       lines: {
    //         show: false,
    //       },
    //     },
    //     yaxis: {
    //       lines: {
    //         show: true,
    //       },
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   tooltip: {
    //     fixed: {
    //       enabled: !1,
    //     },
    //     x: {
    //       show: !1,
    //     },
    //     y: {
    //       title: {
    //         formatter: function () {
    //           return "";
    //         },
    //       },
    //     },
    //     marker: {
    //       show: !1,
    //     },
    //   },
    //   xaxis: {
    //     type: "category",
    //     categories: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    //     axisBorder: {
    //       show: false,
    //     },
    //     axisTicks: {
    //       show: false,
    //     },
    //   },
    //   yaxis: {
    //     title: {
    //       style: {
    //         fontSize: "0px",
    //       },
    //     },
    //   },
    // };

    // const footer = {
    //   start: { title: "Revenue (since last 3 months)", data: "₹ 560,000" },
    //   end: { title: "Revenue (between Jan - Mar 2024)", data: "₹ 420,200" },
    // };
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        {/* <div className="flex flex-col w-full">
          <DataStatsOne stats={data.stats} />
        </div> */}
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <PaymentDataTable />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          {/* <ChartLine
            options={options}
            series={series}
            label="Payments Overview"
            footer={footer}
          /> */}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full px-4">
      <OverView />
    </div>
  );
};
export default App;

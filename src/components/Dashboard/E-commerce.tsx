// "use client";
// import React from "react";
// import ChartThree from "../Charts/ChartThree";
// import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// // import TableOne from "../Tables/TableOne";
// // import MapOne from "../Maps/MapOne";
// import DataStatsOne from "@/components/DataStats/DataStatsOne";
// import ChartOne from "@/components/Charts/ChartOne";

// const ECommerce: React.FC = () => {
//   return (
//     <>
//       <DataStatsOne />

//       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
//         <ChartOne />
//         <ChartTwo />
//         <ChartThree />
//         <ChatCard />
//         {/* <MapOne /> */}
//         {/* <div className="col-span-12 xl:col-span-8">
//           <TableOne />
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default ECommerce;

"use client";
import React, { useEffect, useState } from "react";
import ChartThree from "../Charts/ChartThree";
// import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Spinner } from "@nextui-org/react";

const API_URL = process.env.API_URL;

interface Appointment {
  id: string;
  name: string;
  type: string;
  patient: {
    id: string;
    name: string;
    gender: string; // Added to match ChatCard's requirements
    displayPicture: string | null;
  };
  visitType: {
    id: string;
    name: string;
  };
  startDateTime: string;
  statusName: string;
}

export interface VisitType {
  id: string;
  name: string;
}

interface DashboardData {
  stats: {
    patients: { current: number; previous: number };
    bookings: { current: number; previous: number };
    revenue: { current: number; previous: number };
    // campaigns: { current: number; previous: number };
  };
  visitTypes: {
    types?: { id: string; name: string }[];
    appointments?: Appointment[];
  };
  paymentRecords?: {
    date: string;
    amount: number;
    status: "COMPLETED" | "PENDING";
    paymentMethod: "CASH" | "CARD";
  }[];
}

// Throttle function to limit API calls
// const throttle = (func: Function, limit: number) => {
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

const ECommerce: React.FC = () => {
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
      setError("Please Wait Redirecting You To Profile Page..... ");
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
      const [typesResponse, appointmentsResponse] = await Promise.all([
        fetchDataWithFallback(
          () => api.get(`${API_URL}/appointment/types/${branchId}`),
          { data: [] },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/appointment/list/${branchId}`, {
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
            api.get(`${API_URL}/patient/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: currentFrom,
                to: currentTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/patient/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: previousFrom,
                to: previousTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/appointment/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: currentFrom,
                to: currentTo,
              },
            }),
          { data: { count: 0 } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/appointment/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: previousFrom,
                to: previousTo,
              },
            }),
          { data: { count: 0 } },
        ),
      ]);

      // Third fetch - revenue and campaigns
      const [
        currentRevenue,
        previousRevenue,

        // currentCampaigns,
        // previousCampaigns,
      ] = await Promise.all([
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/payments/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: currentFrom,
                to: currentTo,
                paymentMethod: ["CASH", "CARD"],
                status: ["COMPLETED", "PENDING"],
              },
            }),
          { data: { rows: [] } },
        ),
        fetchDataWithFallback(
          () =>
            api.get(`${API_URL}/payments/list/${branchId}`, {
              params: {
                page: 1,
                pageSize: 1000,
                from: currentFrom,
                to: currentTo,
                paymentMethod: ["CASH", "CARD"],
                status: ["COMPLETED", "PENDING"],
              },
            }),
          { data: { rows: [] } },
        ),
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
      ]);

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
          revenue: {
            current:
              currentRevenue.data.rows?.reduce(
                (sum: number, payment: any) => sum + (payment.amount || 0),
                0,
              ) || 0,
            previous:
              previousRevenue.data.rows?.reduce(
                (sum: number, payment: any) => sum + (payment.amount || 0),
                0,
              ) || 0,
          },

          // campaigns: {
          //   current: currentCampaigns.data.count,
          //   previous: previousCampaigns.data.count,
          // },
        },
        visitTypes: {
          types: typesResponse.data,
          appointments: appointmentsResponse.data.rows,
        },
        paymentRecords: currentRevenue.data.rows,
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

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          /* Mobile-only scroll optimizations */
          html,
          body {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }
      `}</style>

      <DataStatsOne stats={data.stats} />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          {/* <ChartOne /> */}
          <ChartOne
            paymentData={{
              currentRevenue: data.stats.revenue.current,
              previousRevenue: data.stats.revenue.previous,
              currentPayments: data.paymentRecords,
            }}
          />
        </div>
        {/* <ChartOne /> */}
        {/* <ChartTwo /> */}
        <ChartThree
          types={data.visitTypes.types}
          appointments={data.visitTypes.appointments}
        />
        <ChatCard appointments={data?.visitTypes.appointments} />
      </div>
    </>
  );
};

export default ECommerce;

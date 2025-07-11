"use client";
import React, { useEffect, useState } from "react";
import ChartLine from "../Charts/ChartLine";
import { ApexOptions } from "apexcharts";
import DataTable from "./DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { dokuGet } from "@/api/doku";
import { ReminderOverview } from "./types";
import { Spinner } from "@nextui-org/react";

export default function App() {
  const OverView = () => {
    const [chartData, setChartData] = useState<ReminderOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const profile = useSelector((state: RootState) => state.profile.data);

    useEffect(() => {
      if (profile && profile.branchId) {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await dokuGet(
              `notifications/overview/${profile.branchId}`,
            );
            setChartData(response.overview);
            setLoading(false);
          } catch (err) {
            console.log(err);
            setError("Failed to fetch chart data");
            setLoading(false);
          }
        };
        fetchData();
      }
    }, [profile]);

    const series = [
      {
        name: "Reminders Sent",
        data: chartData.map((item) => item.totalTriggers),
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
          enabled: false,
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return seriesName;
            },
          },
        },
        marker: {
          show: false,
        },
      },
      xaxis: {
        type: "category",
        categories: chartData.map((item) => item.name),
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

    const totalRemindersSent = chartData.reduce(
      (acc, item) => acc + item.totalTriggers,
      0,
    );
    const footer = {
      start: {
        title: "Total Reminders Sent",
        data: totalRemindersSent.toLocaleString(),
      },
      end: { title: "Activated Channels", data: "WhatsApp" },
    };
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <DataTable data={chartData} loading={loading} error={error} />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Spinner label="Loading analytics..." />
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <p className="text-danger">{error}</p>
            </div>
          ) : (
            <ChartLine
              options={options}
              series={series}
              footer={footer}
              label="Reminder Analytics"
            />
          )}
        </div>
      </div>
    );
  };
  return <OverView />;
}

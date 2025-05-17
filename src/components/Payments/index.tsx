"use client";
import React from "react";

import DataStatsOne from "../DataStats/DataStatsOne";

import ChartLine from "../Charts/ChartLine";
import { ApexOptions } from "apexcharts";

export default function App() {
  const OverView = () => {
    const series = [
      {
        name: "Received Amount",
        data: [75, 60, 75, 90, 110, 180, 200],
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
      start: { title: "Revenue (since last 3 months)", data: "₹ 560,000" },
      end: { title: "Revenue (between Jan - Mar 2024)", data: "₹ 420,200" },
    };
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <DataStatsOne />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <ChartLine
            options={options}
            series={series}
            label="Payments Overview"
            footer={footer}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full px-4">
      <OverView />
    </div>
  );
}

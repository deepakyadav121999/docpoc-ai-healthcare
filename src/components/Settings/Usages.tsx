"use client";

import { GLOBAL_ACTION_ICON_COLOR, GLOBAL_DANGER_COLOR } from "@/constants";

import React from "react";

import ChartCircular from "../Charts/ChartCircular";
import { ApexOptions } from "apexcharts";

const Usages = () => {
  const series = [50, 200];

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
              label: "Storage (MB)",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
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
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col w-full">
        {/* <!-- Contact Form --> */}
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
            {/* <h3 className="font-semibold text-dark dark:text-white">
              Storage Usages
            </h3> */}
            <div className="flex flex-col w-full justify-center">
              <div style={{ wordWrap: "break-word" }}>
                <h3 style={{ color: GLOBAL_ACTION_ICON_COLOR }}>
                  As your current app is the free version, storage is limited to
                  250 Mega Bytes. Storage can be increased by either upgrade to
                  premium or purchasing storage credits.
                </h3>
              </div>

              <ChartCircular
                series={series}
                options={options}
                data={[
                  {
                    label: "Used Storage",
                    percentage: 5,
                    color: GLOBAL_DANGER_COLOR,
                  },
                  {
                    label: "Free Storage",
                    percentage: 95,
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
  );
};

export default Usages;

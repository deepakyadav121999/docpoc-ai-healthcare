"use client";
import React from "react";
import { GLOBAL_ICON_COLOR_WHITE, TOOL_TIP_COLORS } from "@/constants";
import DataStatsOne from "../DataStats/DataStatsOne";
import TabDefault from "../common/Tab";
import ChartLine from "../Charts/ChartLine";
import DataTable from "./DataTable";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { ApexOptions } from "apexcharts";
import UserGroup from "./UserGroup";
import UserAccess from "./UserAccess";

export default function App() {
  const dataStatsList: dataStatsDefault[] = [
    {
      icon: (
        <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE}/>
      ),
      color: "#4b9c78",
      title: "new doctors (since last month)",
      value: "Total Doctors: 3",
      growthRate: 0,
    },
    {
      icon: (
        <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />
      ),
      color: "#FF9C55",
      title: "new employees (since last month)",
      value: "Total Staff: 10",
      growthRate: 2,
    },
    {
      icon: (
        <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />
      ),
      color: "#8155FF",
      title: "new nurses (since last month)",
      value: "Total Nurses: 6",
      growthRate: 0,
    }
  ];

  const series = [
    {
      name: "Received Amount",
      data: [75, 60, 75, 90, 110, 180, 200],
    }
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
          formatter: function (e) {
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
      categories: [
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
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

  
  const OverView = () => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <DataStatsDefault dataStatsList={dataStatsList} />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <ChartLine options={options} series={series} label="Total Strength Overview"/>
        </div>
      </div>
    );
  };

  const ManageAccess = () => {
    return <UserAccess/>;
  };

  const Details = () => {
    return <DataTable />;
  };

  const tabKeys = {
    Overview: { name: "Overview", screen: <OverView /> },
    Details: { name: "Details", screen: <Details /> },
    CreateEntry: { name: "Manage Access", screen: <ManageAccess /> },
  };

  return (
    // <div className="flex justify-center w-full px-4">
      <TabDefault options={tabKeys} color={TOOL_TIP_COLORS.primary} />
    // </div>
  );
}

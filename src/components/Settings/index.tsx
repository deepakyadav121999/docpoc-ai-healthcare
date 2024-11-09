"use client";
import React from "react";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefault from "../common/Tab";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import General from "./General";
import Usages from "./Usages";

export default function App() {

  const dataStatsListCredit: dataStatsDefault[] = [
    {
      icon: <SVGIconProvider iconName="storage" color="#FF9C55"/>,
      color: "#4b9c78",
      title:
        "Total whatsapp credit left (each credit is one whatsapp notification)",
      value: "Total: 50 MB",
      growthRate: 0,
    },
    {
      icon: <SVGIconProvider iconName="calendar" color="#FF9C55"/>,
      color: "#8155FF",
      title: "Storage used since last 30 days",
      value: "Last Month: 20 MB",
      growthRate: 9,
    },
    {
      icon: <SVGIconProvider iconName="document" color="#8155FF"/>,
      color: "#FF9C55",
      title: "Combined size of all the documents generated till date.",
      value: "Documents: 15 MB",
      growthRate: 0,
    },
  ];

  const UsagesHeader = () => {
    return (
      <>
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          <div className="flex flex-col w-full">
            <DataStatsDefault dataStatsList={dataStatsListCredit} />
          </div>
        </div>
      </>
    );
  };

  const tabKeys = {
    General: {
      name: "General",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            {" "}
            <General />{" "}
          </div>
        </div>
      ),
    },
    Usages: {
      name: "Usages",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            {" "}
            <UsagesHeader />
          </div>
          <div className="flex flex-col w-full" style={{marginTop: 20}}>
            {" "}
            <Usages />
          </div>
        </div>
      ),
    },
    Website: {
      name: "Go Premium",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            {" "}
            <UsagesHeader />
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="flex justify-center w-full px-4">
      <TabDefault options={tabKeys} color={TOOL_TIP_COLORS.primary} />
    </div>
  );
}

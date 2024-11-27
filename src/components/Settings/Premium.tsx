"use client";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
const Premium = () => {

    
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
  export default Premium
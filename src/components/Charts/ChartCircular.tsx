import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

interface ChartData {
  label: string;
  percentage: number;
  color: string;
}

interface ChartThreeProps {
  series: number[];
  options: ApexOptions;
  data: ChartData[];
  label?: string;
}

const ChartThree: React.FC<ChartThreeProps> = ({ series, options, data, label }) => {
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            {label || 'Visit Types'}
          </h4>
        </div>
        {/* <div>
          <DefaultSelectOption options={["Monthly", "Yearly"]} />
        </div> */}
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span className="mr-2 block h-3 w-full max-w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span> {item.label} </span>
                  <span> {item.percentage}% </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;

import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

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

const ChartThree: React.FC<ChartThreeProps> = ({
  series,
  options,
  data,
  label,
}) => {
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            {label || "Visit Types"}
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

      <div className="mx-auto w-full max-w-[450px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className="mr-3 flex-shrink-0 block h-3 w-3 sm:h-3 sm:w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-gray-900 dark:text-gray-300">
                  <span className="truncate"> {item.label} </span>
                  <span className="whitespace-nowrap ml-2">
                    {" "}
                    {item.percentage}%{" "}
                  </span>
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

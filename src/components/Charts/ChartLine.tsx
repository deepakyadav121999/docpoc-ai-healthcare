import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

interface ChartLineProps {
  series: ApexOptions["series"];
  options: ApexOptions;
  label: string;
  footer?: {
    start?: { title: string; data: string };
    end?: { title: string; data: string };
  };
}

const ChartLine: React.FC<ChartLineProps> = ({
  series,
  options,
  label,
  footer,
}) => {
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            {label}
          </h4>
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">{footer?.start?.title}</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {footer?.start?.data}
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">{footer?.end?.title}</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {footer?.end?.data}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartLine;

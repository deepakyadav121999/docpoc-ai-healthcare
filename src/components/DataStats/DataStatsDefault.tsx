// DataStatsDefault.tsx
import React from "react";
import { dataStatsDefault } from "@/types/dataStatsDefault";

interface DataStatsDefaultProps {
  dataStatsList: dataStatsDefault[];
}

const DataStatsDefault: React.FC<DataStatsDefaultProps> = ({
  dataStatsList,
}) => {
  // const columnLength = dataStatsList.length || 3;
  return (
    <div
      className={`grid grid-cols-1 gap-2 sm:gap-4 md:gap-6 2xl:gap-7.5 md:grid-cols-3`}
    >
      {dataStatsList.map((item, index) => (
        <div
          key={index}
          className="rounded-[10px] bg-white p-3 sm:p-6 shadow-1 dark:bg-gray-dark"
        >
          <div
            className="flex h-10 w-10 sm:h-14.5 sm:w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>

          <div className="mt-3 sm:mt-6 flex items-end justify-between">
            <div>
              <h4 className="mb-1 sm:mb-1.5 text-sm sm:text-heading-6 font-bold text-dark dark:text-white">
                {item.value}
              </h4>
              <span className="text-xs sm:text-body-sm font-medium">
                {item.title}
              </span>
            </div>

            <span
              className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-body-sm font-medium ${
                item.growthRate > 0 ? "text-green" : "text-red"
              }`}
            >
              {item.growthRate}%
              {item.growthRate > 0 ? (
                <svg
                  className="fill-current"
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                    fill=""
                  />
                </svg>
              ) : (
                <svg
                  className="fill-current"
                  width="8"
                  height="8"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                    fill=""
                  />
                </svg>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStatsDefault;

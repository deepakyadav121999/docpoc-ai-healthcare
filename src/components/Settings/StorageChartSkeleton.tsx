import React from "react";

const StorageChartSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col w-full">
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
            <div className="flex flex-col w-full justify-center animate-pulse">
              {/* Text skeleton */}
              <div className="mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>

              {/* Chart skeleton */}
              <div className="flex flex-col items-center">
                {/* Donut chart skeleton - responsive sizes */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border-[20px] sm:border-[30px] md:border-[40px] border-gray-200 dark:border-gray-700 mb-4 sm:mb-6" />

                {/* Legend skeleton */}
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full mr-2" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageChartSkeleton;

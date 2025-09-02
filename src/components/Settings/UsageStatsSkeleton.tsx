import React from "react";

const UsageStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-4 md:gap-6 2xl:gap-7.5 md:grid-cols-3">
      {/* Three skeleton cards */}
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="rounded-[10px] bg-white p-3 sm:p-6 shadow-1 dark:bg-gray-dark animate-pulse"
        >
          {/* Icon skeleton */}
          <div className="h-10 w-10 sm:h-14.5 sm:w-14.5 rounded-full bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 sm:mt-6 flex items-end justify-between">
            <div className="flex-1">
              {/* Value skeleton */}
              <div className="mb-1 sm:mb-1.5 h-6 sm:h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              {/* Title skeleton */}
              <div className="h-3 sm:h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-3 sm:h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Growth rate skeleton */}
            <div className="ml-4 h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsageStatsSkeleton;

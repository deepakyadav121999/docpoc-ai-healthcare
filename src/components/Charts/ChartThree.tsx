// import { ApexOptions } from "apexcharts";
// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

// const ChartThree: React.FC = () => {
//   const series = [65, 34, 12, 56];

//   const options: ApexOptions = {
//     chart: {
//       fontFamily: "Satoshi, sans-serif",
//       type: "donut",
//     },
//     colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
//     labels: ["Surgery", "General Checkup", "Full Checkup", "Consults"],
//     legend: {
//       show: false,
//       position: "bottom",
//     },

//     plotOptions: {
//       pie: {
//         donut: {
//           size: "80%",
//           background: "transparent",
//           labels: {
//             show: true,
//             total: {
//               show: true,
//               showAlways: true,
//               label: "Visitors",
//               fontSize: "16px",
//               fontWeight: "400",
//             },
//             value: {
//               show: true,
//               fontSize: "28px",
//               fontWeight: "bold",
//             },
//           },
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     responsive: [
//       {
//         breakpoint: 2600,
//         options: {
//           chart: {
//             width: 415,
//           },
//         },
//       },
//       {
//         breakpoint: 640,
//         options: {
//           chart: {
//             width: 200,
//           },
//         },
//       },
//     ],
//   };

//   return (
//     <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
//       <div className="mb-9 justify-between gap-4 sm:flex">
//         <div>
//           <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
//             Visit Types
//           </h4>
//         </div>
//         {/* <div>
//           <DefaultSelectOption options={["Monthly", "Yearly"]} />
//         </div> */}
//       </div>

//       <div className="mb-8">
//         <div className="mx-auto flex justify-center">
//           <ReactApexChart options={options} series={series} type="donut" />
//         </div>
//       </div>

//       <div className="mx-auto w-full max-w-[350px]">
//         <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
//           <div className="w-full px-7.5 sm:w-1/2">
//             <div className="flex w-full items-center">
//               <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue"></span>
//               <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
//                 <span> Surgery </span>
//                 <span> 65% </span>
//               </p>
//             </div>
//           </div>
//           <div className="w-full px-7.5 sm:w-1/2">
//             <div className="flex w-full items-center">
//               <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light"></span>
//               <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
//                 <span> Medical </span>
//                 <span> 34% </span>
//               </p>
//             </div>
//           </div>
//           <div className="w-full px-7.5 sm:w-1/2">
//             <div className="flex w-full items-center">
//               <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-2"></span>
//               <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
//                 <span> Full Checkup </span>
//                 <span> 45% </span>
//               </p>
//             </div>
//           </div>
//           <div className="w-full px-7.5 sm:w-1/2">
//             <div className="flex w-full items-center">
//               <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-3"></span>
//               <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
//                 <span> Consults </span>
//                 <span> 12% </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartThree;
import { ApexOptions } from "apexcharts";
import React, { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/components/CalenderBox/ChevronDownIcon";

interface VisitType {
  id: string;
  name: string;
}

interface Appointment {
  type: string;
  visitType: {
    name: string;
  };
  startDateTime: string;
}

interface ChartThreeProps {
  types?: VisitType[];
  appointments?: Appointment[];
}

interface ChartData {
  series: number[];
  labels: string[];
  colors: string[];
}

type TimeFilter = "today" | "thisWeek" | "thisMonth";

const ChartThree: React.FC<ChartThreeProps> = ({
  types = [],
  appointments = [],
}) => {
  // State for time filter - default to "thisMonth"
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("thisMonth");

  // Filter appointments by date only (no time consideration)
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startDateTime);
      const appointmentDay = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
      );

      switch (timeFilter) {
        case "today":
          return appointmentDay.getTime() === today.getTime();

        case "thisWeek":
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return appointmentDay >= startOfWeek && appointmentDay <= endOfWeek;

        case "thisMonth":
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
          );
          const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
          );
          return appointmentDay >= startOfMonth && appointmentDay <= endOfMonth;

        default:
          return true;
      }
    });
  }, [appointments, timeFilter]);

  // Helper function to get filter label
  const getFilterLabel = () => {
    switch (timeFilter) {
      case "today":
        return "Today";
      case "thisWeek":
        return "This Week";
      case "thisMonth":
        return "This Month";
      default:
        return "This Month";
    }
  };

  // Process the data to get visit type counts with proper TypeScript typing
  const getVisitTypeData = (): ChartData => {
    if (!types.length || !filteredAppointments.length) {
      return {
        series: [0],
        labels: ["No Data"],
        colors: ["#ADBCF2"],
      };
    }

    // Create a typed Map to count each visit type occurrence
    const visitTypeCounts: Map<string, number> = new Map<string, number>();

    // Initialize counts for all known types with proper typing
    types.forEach((type: VisitType) => {
      visitTypeCounts.set(type.name, 0);
    });

    // Count filtered appointments for each type with proper null checks
    filteredAppointments.forEach((appointment: Appointment) => {
      const typeName: string | undefined = appointment.visitType?.name;
      if (typeName && visitTypeCounts.has(typeName)) {
        const currentCount: number = visitTypeCounts.get(typeName) || 0;
        visitTypeCounts.set(typeName, currentCount + 1);
      }
    });

    // Convert to arrays for the chart with explicit typing
    const labels: string[] = Array.from(visitTypeCounts.keys());
    const series: number[] = Array.from(visitTypeCounts.values());

    // Default colors with fallbacks - 6 colors for better variety
    const defaultColors: string[] = [
      "#ebc1b0", // Primary purple
      "#5475E5", // Blue
      "#8099EC", // Light blue
      "#ADBCF2", // Very light blue
      "#f5d3dc", // Red
      "#4ECDC4", // Teal
    ];
    const colors: string[] = labels.map(
      (_, index) => defaultColors[index % defaultColors.length],
    );

    return { series, labels, colors };
  };

  const { series, labels, colors }: ChartData = getVisitTypeData();

  // Calculate percentages with proper typing
  const total: number = series.reduce(
    (sum: number, value: number) => sum + value,
    0,
  );
  const percentages: number[] = series.map((value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0,
  );

  // Helper function to truncate only very long labels
  const truncateLabel = (label: string, maxLength: number = 25): string => {
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength) + "...";
  };

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: colors,
    labels: labels,
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
              label: "Visitors",
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
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white mb-3">
          Visit Types
        </h4>
        <div className="flex justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                size="sm"
                endContent={<ChevronDownIcon className="text-small" />}
                className="text-xs min-w-unit-20 h-8 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
              >
                {getFilterLabel()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Time filter"
              onAction={(key) => {
                setTimeFilter(key as TimeFilter);
              }}
              selectedKeys={[timeFilter]}
              selectionMode="single"
            >
              <DropdownItem key="today" onClick={(e) => e.stopPropagation()}>
                Today
              </DropdownItem>
              <DropdownItem key="thisWeek" onClick={(e) => e.stopPropagation()}>
                This Week
              </DropdownItem>
              <DropdownItem
                key="thisMonth"
                onClick={(e) => e.stopPropagation()}
              >
                This Month
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={350}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[400px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          <style jsx>{`
            .visit-type-label {
              font-size: 14px !important;
              line-height: 1.4 !important;
            }
            @media (max-width: 768px) {
              .visit-type-label {
                max-width: 140px !important;
                font-size: 13px !important;
              }
            }
            @media (max-width: 640px) {
              .visit-type-label {
                max-width: 120px !important;
                font-size: 12px !important;
              }
            }
            @media (max-width: 480px) {
              .visit-type-label {
                max-width: 100px !important;
                font-size: 11px !important;
              }
            }
          `}</style>
          {labels.map((label: string, index: number) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className="mr-3 flex-shrink-0 block h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span
                    className="visit-type-label max-w-[160px] sm:max-w-[190px] lg:max-w-[220px]"
                    title={label}
                  >
                    {truncateLabel(label, 30)}
                  </span>
                  <span className="flex-shrink-0 ml-2 font-semibold">
                    {percentages[index]}%
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

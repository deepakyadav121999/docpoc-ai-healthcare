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
import React from "react";
import ReactApexChart from "react-apexcharts";

interface VisitType {
  id: string;
  name: string;
}

interface Appointment {
  type: string;
  visitType: {
    name: string;
  };
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

const ChartThree: React.FC<ChartThreeProps> = ({ types = [], appointments = [] }) => {
  // Process the data to get visit type counts with proper TypeScript typing
  const getVisitTypeData = (): ChartData => {
    if (!types.length || !appointments.length) {
      return {
        series: [0],
        labels: ['No Data'],
        colors: ["#ADBCF2"]
      };
    }

    // Create a typed Map to count each visit type occurrence
    const visitTypeCounts: Map<string, number> = new Map<string, number>();
    
    // Initialize counts for all known types with proper typing
    types.forEach((type: VisitType) => {
      visitTypeCounts.set(type.name, 0);
    });

    // Count appointments for each type with proper null checks
    appointments.forEach((appointment: Appointment) => {
      const typeName: string | undefined = appointment.visitType?.name;
      if (typeName && visitTypeCounts.has(typeName)) {
        const currentCount: number = visitTypeCounts.get(typeName) || 0;
        visitTypeCounts.set(typeName, currentCount + 1);
      }
    });

    // Convert to arrays for the chart with explicit typing
    const labels: string[] = Array.from(visitTypeCounts.keys());
    const series: number[] = Array.from(visitTypeCounts.values());
    
    // Default colors with fallbacks
    const defaultColors: string[] = ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"];
    const colors: string[] = labels.map((_, index) => 
      defaultColors[index % defaultColors.length]
    );

    return { series, labels, colors };
  };

  const { series, labels, colors }: ChartData = getVisitTypeData();

  // Calculate percentages with proper typing
  const total: number = series.reduce((sum: number, value: number) => sum + value, 0);
  const percentages: number[] = series.map((value: number) => 
    total > 0 ? Math.round((value / total) * 100) : 0
  );

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
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Visit Types
          </h4>
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

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {labels.map((label: string, index: number) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span 
                  className="mr-2 block h-3 w-full max-w-3 rounded-full" 
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span>{label}</span>
                  <span>{percentages[index]}%</span>
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
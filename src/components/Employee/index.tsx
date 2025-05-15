// "use client";
// import React, { useEffect, useState } from "react";
// import { GLOBAL_ICON_COLOR_WHITE } from "@/constants";

// import ChartLine from "../Charts/ChartLine";
// import { Spacer } from "@nextui-org/react";
// import DataStatsDefault from "../DataStats/DataStatsDefault";
// import { dataStatsDefault } from "@/types/dataStatsDefault";
// import { SVGIconProvider } from "@/constants/svgIconProvider";
// import { ApexOptions } from "apexcharts";
// import axios from "axios";
// import CustomCard from "./CustomCard";
// import { Spinner } from "@nextui-org/spinner";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";
// const API_URL = process.env.API_URL;

// export default function App() {
//   const profile = useSelector((state: RootState) => state.profile.data);
//   const [dataStatsList, setDataStatsList] = useState<dataStatsDefault[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [brancId, setBranchId] = useState();

//   // const dataStatsList: dataStatsDefault[] = [
//   //   {
//   //     icon: (
//   //       <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE}/>
//   //     ),
//   //     color: "#4b9c78",
//   //     title: "new doctors (since last month)",
//   //     value: "Total Doctors: 3",
//   //     growthRate: 0,
//   //   },
//   //   {
//   //     icon: (
//   //       <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />
//   //     ),
//   //     color: "#FF9C55",
//   //     title: "new employees (since last month)",
//   //     value: "Total Staff: 10",
//   //     growthRate: 2,
//   //   },
//   //   {
//   //     icon: (
//   //       <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />
//   //     ),
//   //     color: "#8155FF",
//   //     title: "new nurses (since last month)",
//   //     value: "Total Nurses: 6",
//   //     growthRate: 0,
//   //   }
//   // ];

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("docPocAuth_token");

     
//       const fetchedBranchId = profile?.branchId;

//       setBranchId(fetchedBranchId);

//       const endpoint = `${API_URL}/user/list/${fetchedBranchId}`;
//       const params = {
//         page: 1,
//         pageSize: 100,
//         from: "2024-12-04T03:32:25.812Z",
//         to: "2024-12-11T03:32:25.815Z",
//       };
//       const response = await axios.get(endpoint, {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const users = response.data.rows || [];
//       console.log(users);
//       // Parse and count doctors, nurses, and staff
//       let doctorCount = 0;
//       let nurseCount = 0;
//       let staffCount = 0;

//       users.forEach((user: any) => {
//         setLoading(true);
//         try {
//           const parsedJson = JSON.parse(user.json || "{}");
//           const designation = parsedJson.designation?.toLowerCase();

//           if (designation === "doctor") {
//             doctorCount++;
//           } else if (designation === "nurse") {
//             nurseCount++;
//           } else {
//             staffCount++;
//           }
//         } catch (error) {
//           console.error("Error parsing user json:", error);
//         }
//       });

//       setDataStatsList([
//         {
//           icon: (
//             <SVGIconProvider
//               iconName="doctor"
//               color={GLOBAL_ICON_COLOR_WHITE}
//             />
//           ),
//           color: "#4b9c78",
//           title: "new doctors (since last month)",
//           value: `Total Doctors: ${doctorCount}`,
//           growthRate: 0, // Replace with actual growth rate logic if needed
//         },
//         {
//           icon: (
//             <SVGIconProvider
//               iconName="employee"
//               color={GLOBAL_ICON_COLOR_WHITE}
//             />
//           ),
//           color: "#FF9C55",
//           title: "new employees (since last month)",
//           value: `Total Staff: ${staffCount}`,
//           growthRate: 0, // Replace with actual growth rate logic if needed
//         },
//         {
//           icon: (
//             <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />
//           ),
//           color: "#8155FF",
//           title: "new nurses (since last month)",
//           value: `Total Nurses: ${nurseCount}`,
//           growthRate: 0, // Replace with actual growth rate logic if needed
//         },
//       ]);

//       setLoading(false);
//     } catch (error) {
//       console.log("Failed to fetch users:", error);
//       setDataStatsList([
//         {
//           icon: (
//             <SVGIconProvider
//               iconName="doctor"
//               color={GLOBAL_ICON_COLOR_WHITE}
//             />
//           ),
//           color: "#4b9c78",
//           title: "new doctors (since last month)",
//           value: "Total Doctors: 0",
//           growthRate: 0,
//         },
//         {
//           icon: (
//             <SVGIconProvider
//               iconName="employee"
//               color={GLOBAL_ICON_COLOR_WHITE}
//             />
//           ),
//           color: "#FF9C55",
//           title: "new employees (since last month)",
//           value: "Total Staff: 0",
//           growthRate: 0,
//         },
//         {
//           icon: (
//             <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />
//           ),
//           color: "#8155FF",
//           title: "new nurses (since last month)",
//           value: "Total Nurses: 0",
//           growthRate: 0,
//         },
//       ]);
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchUsers();
//     //  setDataStatsList([
//     //   {
//     //     icon: <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE} />,
//     //     color: "#4b9c78",
//     //     title: "new doctors (since last month)",
//     //     value: "Total Doctors: 0",
//     //     growthRate: 0,
//     //   },
//     //   {
//     //     icon: <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />,
//     //     color: "#FF9C55",
//     //     title: "new employees (since last month)",
//     //     value: "Total Staff: 0",
//     //     growthRate: 0,
//     //   },
//     //   {
//     //     icon: <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />,
//     //     color: "#8155FF",
//     //     title: "new nurses (since last month)",
//     //     value: "Total Nurses: 0",
//     //     growthRate: 0,
//     //   },
//     // ]);
//   }, []);
//   const series = [
//     {
//       name: "Received Amount",
//       data: [75, 60, 75, 90, 110, 180, 200],
//     },
//   ];

//   const options: ApexOptions = {
//     legend: {
//       show: false,
//       position: "top",
//       horizontalAlign: "left",
//     },
//     colors: ["#0ABEF9"],
//     chart: {
//       fontFamily: "Satoshi, sans-serif",
//       height: 310,
//       type: "area",
//       toolbar: {
//         show: false,
//       },
//     },
//     fill: {
//       gradient: {
//         opacityFrom: 0.55,
//         opacityTo: 0,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           chart: {
//             height: 300,
//           },
//         },
//       },
//       {
//         breakpoint: 1366,
//         options: {
//           chart: {
//             height: 320,
//           },
//         },
//       },
//     ],
//     stroke: {
//       curve: "smooth",
//     },

//     markers: {
//       size: 0,
//     },
//     grid: {
//       strokeDashArray: 5,
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     tooltip: {
//       fixed: {
//         enabled: !1,
//       },
//       x: {
//         show: !1,
//       },
//       y: {
//         title: {
//           formatter: function (e) {
//             return "";
//           },
//         },
//       },
//       marker: {
//         show: !1,
//       },
//     },
//     xaxis: {
//       type: "category",
//       categories: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       title: {
//         style: {
//           fontSize: "0px",
//         },
//       },
//     },
//   };

//   const OverView = () => {
//     return (
//       <div className="py-2 px-2 flex flex-col justify-center items-center w-full m-1">
//         <div className="flex flex-col w-full justify-between">
//           {loading ? (
//             <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5 md:grid-cols-3">
//               {/* Render CustomCard components in a responsive grid */}
//               <CustomCard />
//               <CustomCard />
//               <CustomCard />
//             </div>
//           ) : (
//             <DataStatsDefault dataStatsList={dataStatsList} />
//           )}
//         </div>
//         <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
//           <ChartLine
//             options={options}
//             series={series}
//             label="Total Strength Overview"
//           />
//         </div>
//       </div>
//     );
//   };

//   return <OverView />;
// }

"use client";
import React, { useEffect, useState } from "react";
import { GLOBAL_ICON_COLOR_WHITE } from "@/constants";
import ChartLine from "../Charts/ChartLine";
import { Spacer } from "@nextui-org/react";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import CustomCard from "./CustomCard";
import { Spinner } from "@nextui-org/spinner";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const API_URL = process.env.API_URL;

interface MonthlyData {
  month: string;
  doctors: number;
  nurses: number;
  staff: number;
}

export default function App() {
  const profile = useSelector((state: RootState) => state.profile.data);
  const [dataStatsList, setDataStatsList] = useState<dataStatsDefault[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState<string | undefined>();
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    categories: string[];
  }>({
    series: [
      { name: "Doctors", data: [] },
      { name: "Nurses", data: [] },
      { name: "Staff", data: [] },
    ],
    categories: [],
  });

  const getDateRangeForMonth = (monthsBack: number) => {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setMonth(now.getMonth() - monthsBack);
    
    // Set to first day of the month
    const from = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    // Set to last day of the month
    const to = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      monthName: from.toLocaleString('default', { month: 'short' })
    };
  };

  const countUsersByType = (users: any[]): { doctors: number; nurses: number; staff: number } => {
    let doctorCount = 0;
    let nurseCount = 0;
    let staffCount = 0;

    users.forEach((user: any) => {
      try {
        const parsedJson = JSON.parse(user.json || "{}");
        const designation = parsedJson.designation?.toLowerCase();

        if (designation === "doctor") {
          doctorCount++;
        } else if (designation === "nurse") {
          nurseCount++;
        } else {
          staffCount++;
        }
      } catch (error) {
        console.error("Error parsing user json:", error);
      }
    });

    return { doctors: doctorCount, nurses: nurseCount, staff: staffCount };
  };

  const fetchUsers = async (params?: { from?: string; to?: string }) => {
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;
      setBranchId(fetchedBranchId);

      if (!fetchedBranchId) {
        throw new Error("Branch ID not available");
      }

      const endpoint = `${API_URL}/user/list/${fetchedBranchId}`;
      const defaultParams = { page: 1, pageSize: 100 };
      const response = await axios.get(endpoint, {
        params: { ...defaultParams, ...params },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.rows || [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Fetch current users
      const currentUsers = await fetchUsers();
      const currentCounts = countUsersByType(currentUsers);

      // Fetch previous month's data for growth calculation
      const prevMonthRange = getDateRangeForMonth(1);
      const prevMonthUsers = await fetchUsers({
        from: prevMonthRange.from,
        to: prevMonthRange.to
      });
      const prevMonthCounts = countUsersByType(prevMonthUsers);

      // Calculate growth rates
      const growthRates = {
        doctors: calculateGrowth(currentCounts.doctors, prevMonthCounts.doctors),
        nurses: calculateGrowth(currentCounts.nurses, prevMonthCounts.nurses),
        staff: calculateGrowth(currentCounts.staff, prevMonthCounts.staff)
      };

      // Prepare stats cards
      setDataStatsList([
        {
          icon: <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#4b9c78",
          title: "new doctors (since last month)",
          value: `Total Doctors: ${currentCounts.doctors}`,
          growthRate: growthRates.doctors,
        },
        {
          icon: <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#FF9C55",
          title: "new employees (since last month)",
          value: `Total Staff: ${currentCounts.staff}`,
          growthRate: growthRates.staff,
        },
        {
          icon: <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#8155FF",
          title: "new nurses (since last month)",
          value: `Total Nurses: ${currentCounts.nurses}`,
          growthRate: growthRates.nurses,
        },
      ]);

      // Fetch historical data for chart (last 6 months)
      const monthlyData: MonthlyData[] = [];
      const chartCategories: string[] = [];
      const doctorData: number[] = [];
      const nurseData: number[] = [];
      const staffData: number[] = [];

      for (let i = 5; i >= 0; i--) {
        const range = getDateRangeForMonth(i);
        const users = await fetchUsers({
          from: range.from,
          to: range.to
        });
        const counts = countUsersByType(users);
        
        monthlyData.push({
          month: range.monthName,
          ...counts
        });
        chartCategories.push(range.monthName);
        doctorData.push(counts.doctors);
        nurseData.push(counts.nurses);
        staffData.push(counts.staff);
      }

      // Update chart data with real values
      setChartData({
        series: [
          { name: "Doctors", data: doctorData },
          { name: "Nurses", data: nurseData },
          { name: "Staff", data: staffData },
        ],
        categories: chartCategories,
      });

    } catch (error) {
      console.error("Error loading data:", error);
      setDataStatsList([
        {
          icon: <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#4b9c78",
          title: "new doctors (since last month)",
          value: "Total Doctors: 0",
          growthRate: 0,
        },
        {
          icon: <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#FF9C55",
          title: "new employees (since last month)",
          value: "Total Staff: 0",
          growthRate: 0,
        },
        {
          icon: <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#8155FF",
          title: "new nurses (since last month)",
          value: "Total Nurses: 0",
          growthRate: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.branchId]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#4b9c78", "#8155FF", "#FF9C55"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  };

  const OverView = () => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full m-1">
        <div className="flex flex-col w-full justify-between">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5 md:grid-cols-3">
              <CustomCard />
              <CustomCard />
              <CustomCard />
            </div>
          ) : (
            <DataStatsDefault dataStatsList={dataStatsList} />
          )}
        </div>
        <div className="flex flex-col w-full" style={{ marginTop: 45 }}>
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Spinner size="lg" />
            </div>
          ) : (
            <ChartLine
              options={options}
              series={chartData.series}
              label="Staff Strength Trend (Last 6 Months)"
            />
          )}
        </div>
      </div>
    );
  };

  return <OverView />;
}
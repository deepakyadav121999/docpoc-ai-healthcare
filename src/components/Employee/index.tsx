"use client";
import React, {useEffect , useState } from "react";
import { GLOBAL_ICON_COLOR_WHITE} from "@/constants";

import ChartLine from "../Charts/ChartLine";

import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";

export default function App() {
  const [dataStatsList, setDataStatsList] = useState<dataStatsDefault[]>([]);
  const [loading, setLoading] = useState(false);
    const[brancId,setBranchId] = useState()


  // const dataStatsList: dataStatsDefault[] = [
  //   {
  //     icon: (
  //       <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE}/>
  //     ),
  //     color: "#4b9c78",
  //     title: "new doctors (since last month)",
  //     value: "Total Doctors: 3",
  //     growthRate: 0,
  //   },
  //   {
  //     icon: (
  //       <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />
  //     ),
  //     color: "#FF9C55",
  //     title: "new employees (since last month)",
  //     value: "Total Staff: 10",
  //     growthRate: 2,
  //   },
  //   {
  //     icon: (
  //       <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />
  //     ),
  //     color: "#8155FF",
  //     title: "new nurses (since last month)",
  //     value: "Total Nurses: 6",
  //     growthRate: 0,
  //   }
  // ];


  const fetchUsers = async () => {
    try {



      const token = localStorage.getItem("docPocAuth_token");
    
      const hospitalEndpoint = "http://127.0.0.1:3037/DocPOC/v1/hospital";
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      console.log(fetchedHospitalId)
      const branchEndpoint = `http://127.0.0.1:3037/DocPOC/v1/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;
       console.log(fetchedBranchId)
       setBranchId(fetchedBranchId)

      const endpoint = `http://127.0.0.1:3037/DocPOC/v1/user/list/${fetchedBranchId}`;
      const params = {
        page: 1,
        pageSize: 100,
        from: "2024-12-04T03:32:25.812Z",
        to: "2024-12-11T03:32:25.815Z",
      };
      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
 
      const users = response.data.rows || [];
      console.log(users)
      // Parse and count doctors, nurses, and staff
      let doctorCount = 0;
      let nurseCount = 0;
      let staffCount = 0;

      users.forEach((user:any) => {
        setLoading(true)
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

     
      setDataStatsList([
        {
          icon: <SVGIconProvider iconName="doctor" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#4b9c78",
          title: "new doctors (since last month)",
          value: `Total Doctors: ${doctorCount}`,
          growthRate: 0, // Replace with actual growth rate logic if needed
        },
        {
          icon: <SVGIconProvider iconName="employee" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#FF9C55",
          title: "new employees (since last month)",
          value: `Total Staff: ${staffCount}`,
          growthRate: 0, // Replace with actual growth rate logic if needed
        },
        {
          icon: <SVGIconProvider iconName="nurse" color={GLOBAL_ICON_COLOR_WHITE} />,
          color: "#8155FF",
          title: "new nurses (since last month)",
          value: `Total Nurses: ${nurseCount}`,
          growthRate: 0, // Replace with actual growth rate logic if needed
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch users:", error);
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
      setLoading(false);
    }
  };
  useEffect(() => {
   fetchUsers()
     
  }, []);
  const series = [
    {
      name: "Received Amount",
      data: [75, 60, 75, 90, 110, 180, 200],
    }
  ];
  
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#0ABEF9"],
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
        enabled: !1,
      },
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function (e) {
            return "";
          },
        },
      },
      marker: {
        show: !1,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
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
    },
  };

  
  const OverView = () => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full m-1">
        <div className="flex flex-col w-full">
          {  loading ? (
            <div className="absolute inset-0 flex justify-center items-center  z-50">
            <Spinner />
          </div>):<DataStatsDefault dataStatsList={dataStatsList} />
          }
          
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <ChartLine options={options} series={series} label="Total Strength Overview"/>
        </div>
      </div>
    );
  };

  return (
    <OverView />
  );
}

import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartOneProps {
  paymentData?: {
    currentRevenue: number;
    previousRevenue: number;
    currentPayments?: any[]; // Using any to match your existing structure
  };
}

const ChartOne: React.FC<ChartOneProps> = ({ paymentData }) => {
  const processPaymentData = () => {
    const receivedData = [0, 0, 0]; // Initialize for 3 months
    const dueData = [0, 0, 0];

    if (paymentData?.currentPayments) {
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11

      paymentData.currentPayments.forEach((payment: any) => {
        try {
          const paymentDate = new Date(payment.date || payment.createdAt);
          const monthIndex = currentMonth - paymentDate.getMonth();

          // Only process data from last 3 months
          if (monthIndex >= 0 && monthIndex < 3) {
            const arrayIndex = 2 - monthIndex; // Reverse order (current month last)

            if (payment.status === "COMPLETED") {
              receivedData[arrayIndex] += payment.amount || 0;
            } else if (payment.status === "PENDING") {
              dueData[arrayIndex] += payment.amount || 0;
            }
          }
        } catch (e) {
          console.error("Error processing payment data:", e);
        }
      });
    }

    return { receivedData, dueData };
  };

  const { receivedData, dueData } = processPaymentData();

  const series = [
    {
      name: "Received Amount",
      data: receivedData,
    },
    {
      name: "Due Amount",
      data: dueData,
    },
  ];

  const getMonthNames = () => {
    const months = [];
    const date = new Date();
    for (let i = 2; i >= 0; i--) {
      const tempDate = new Date(date);
      tempDate.setMonth(tempDate.getMonth() - i);
      months.push(tempDate.toLocaleString("default", { month: "short" }));
    }
    return months;
  };

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
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
          formatter: function () {
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
      // categories: ["Jun", "Jul", "Aug"],
      categories: getMonthNames(),
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
      labels: {
        formatter: function (value) {
          return "₹" + value.toLocaleString();
        },
      },
    },
  };
  const totalReceived = receivedData.reduce((sum, amount) => sum + amount, 0);
  const totalDue = dueData.reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7 ">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Payments Overview
          </h4>
        </div>
        {/* <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            Short by:
          </p>
          <DefaultSelectOption options={["Monthly", "Yearly"]} />
        </div> */}
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
          <p className="font-medium">Received Amount</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {totalReceived}
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">Due Amount</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {totalDue}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;

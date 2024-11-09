"use client";
import React from "react";
import { GLOBAL_ICON_COLOR_WHITE, TOOL_TIP_COLORS } from "@/constants";
import DataStatsOne from "../DataStats/DataStatsOne";
import TabDefault from "../common/Tab";
import ChartLine from "../Charts/ChartLine";
import { ApexOptions } from "apexcharts";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import DataTable from "./DataTable";
import CardBlurred from "../common/Card/CardBlurred";
import CreditCardBouncing from "../common/CreditCardBouncing";
import ShadowScrollDefault from "../common/ShadowScrollDefault";
import CardSegmented from "../common/Card/CardSegmented";
import PricingTable from "../common/Table/PricingTable";
import HighlightedText from "../common/HighLightedText";
import { Divider } from "@nextui-org/react";
import ReminderConfiguration from "./ReminderConfiguration";

export default function App() {
  const dataStatsList: dataStatsDefault[] = [
    {
      icon: (
        <SVGIconProvider iconName="reminder" color={GLOBAL_ICON_COLOR_WHITE} />
      ),
      color: "#4b9c78",
      title: "Total notifications sent to patients",
      value: "Total: 13000+",
      growthRate: 10,
    },
    {
      icon: (
        <SVGIconProvider iconName="phone" color={GLOBAL_ICON_COLOR_WHITE} />
      ),
      color: "#FF9C55",
      title:
        "Reminders sent to a new patient for the first time (since last month)",
      value: "New reminders: 560",
      growthRate: 2,
    },
    {
      icon: (
        <SVGIconProvider iconName="rupee" color={GLOBAL_ICON_COLOR_WHITE} />
      ),
      color: "#8155FF",
      title: "Total number of notifications sent (past 30 days)",
      value: "Last Month: 4500",
      growthRate: 6,
    },
  ];

  const dataStatsListCredit: dataStatsDefault[] = [
    {
      icon: <SVGIconProvider iconName="whats-app" />,
      color: "#4b9c78",
      title:
        "Total whatsapp credit left (each credit is one whatsapp notification)",
      value: "Total: 130076",
      growthRate: 0,
    },
    {
      icon: <SVGIconProvider iconName="email-blue" />,
      color: "#8155FF",
      title: "Total email credit left (each credit is one email notification)",
      value: "Total: 560",
      growthRate: 0,
    },
    {
      icon: <SVGIconProvider iconName="sms-blue" />,
      color: "#FF9C55",
      title: "Total sms credit left (each credit is one sms notification)",
      value: "Total: 4500",
      growthRate: 0,
    },
  ];

  const OverView = () => {
    const series = [
      {
        name: "Reminders Sent",
        data: [1200, 6000, 7500, 9000, 11000, 18000, 20000],
      },
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
        categories: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
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

    const footer = {
      start: { title: "Reminders Sent (since last 3 months)", data: "24,000+" },
      end: { title: "Reminder Sent (between Jan - Mar 2024)", data: "42,000+" },
    };
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col w-full">
          <DataStatsDefault dataStatsList={dataStatsList} />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <DataTable />
        </div>
        <div className="flex flex-col w-full " style={{ marginTop: 45 }}>
          <ChartLine
            options={options}
            series={series}
            label="Reminders Overview"
            footer={footer}
          />
        </div>
        
      </div>
    );
  };

  const ManageCredit = () => {
    return (
      <>
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          <div className="flex flex-col w-full">
            <DataStatsDefault dataStatsList={dataStatsListCredit} />
          </div>
          <div className="flex flex-row w-full " style={{ marginTop: 45 }}>
            <div style={{ minWidth: 200, marginTop: "5%" }}>
              <CardBlurred
                label="Whats App"
                img={{ url: "images/others/whatsapp.png", paddingTop: 20 }}
              />
            </div>
            <div className="flex-grow md:ml-5">
              <CardSegmented
                data={{
                  bodyContent: (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
                      <div className="rounded-[10px] p-6">
                        <div className="mt-6 flex flex-col">
                          <div className="flex flex-col gap-4">
                            <PricingTable
                              tableHeader={[
                                "NAME",
                                "PRICE",
                                "CREDITS",
                                "VALIDITY",
                              ]}
                              tableData={[
                                ["Light", "₹ 80", "1000", "10 Years"],
                                ["Basic", "₹ 180", "4000", "10 Years"],
                                ["Premium", "₹ 500", "40,000", "15 Years"],
                              ]}
                            />
                            <div>
                              <span className="text-body-sm font-medium">
                                <HighlightedText
                                  color={TOOL_TIP_COLORS.primary}
                                  text="Average daily Whatsapp notification: 654."
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <Divider style={{ marginTop: 20 }} />
          <div className="flex flex-row w-full " style={{ marginTop: 45 }}>
            <div style={{ minWidth: 200, marginTop: "4%" }}>
              <CardBlurred
                label="SMS"
                img={{ url: "images/others/sms-big.png" }}
              />
            </div>
            <div className="flex-grow md:ml-5">
              <CardSegmented
                data={{
                  bodyContent: (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
                      <div className="rounded-[10px] p-6">
                        <div className="mt-6 flex flex-col">
                          <div className="flex flex-col gap-4">
                            <PricingTable
                              tableHeader={[
                                "NAME",
                                "PRICE",
                                "CREDITS",
                                "VALIDITY",
                              ]}
                              tableData={[
                                ["Light", "₹ 80", "1000", "10 Years"],
                                ["Basic", "₹ 180", "4000", "10 Years"],
                                ["Premium", "₹ 500", "40,000", "15 Years"],
                              ]}
                            />
                            <div>
                              <span className="text-body-sm font-medium">
                                <HighlightedText
                                  color={TOOL_TIP_COLORS.primary}
                                  text="Average daily SMS notification: 654."
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <Divider style={{ marginTop: 20 }} />
          <div className="flex flex-row w-full " style={{ marginTop: 45 }}>
            <div style={{ minWidth: 200, marginTop: "4%" }}>
              <CardBlurred
                label="Email"
                img={{
                  url: "https://static.vecteezy.com/system/resources/previews/010/872/860/original/3d-email-notification-icon-png.png",
                }}
              />
            </div>
            <div className="flex-grow md:ml-5">
              <CardSegmented
                data={{
                  bodyContent: (
                    <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
                      <div className="rounded-[10px] p-6">
                        <div className="mt-6 flex flex-col">
                          <div className="flex flex-col gap-4">
                            <PricingTable
                              tableHeader={[
                                "NAME",
                                "PRICE",
                                "CREDITS",
                                "VALIDITY",
                              ]}
                              tableData={[
                                ["Light", "₹ 80", "1000", "10 Years"],
                                ["Basic", "₹ 180", "4000", "10 Years"],
                                ["Premium", "₹ 500", "40,000", "15 Years"],
                              ]}
                            />
                            <div>
                              <span className="text-body-sm font-medium">
                                <HighlightedText
                                  color={TOOL_TIP_COLORS.primary}
                                  text="Average daily Email notification: 654."
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: 20 }} />

        <div className="flex flex-row w-full " style={{ marginTop: 45 }}>
          <div className="flex-grow md:ml-5">
            <CardSegmented
              data={{
                bodyContent: (
                  <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="rounded-[10px] p-6">
                      <div className="mt-6 flex flex-col">
                        <div className="flex flex-col gap-4">
                          <PricingTable
                            tableHeader={["DATE", "AMOUNT", "DETAIL"]}
                            tableData={[
                              ["Nov, 2023", "₹ 80", "WhatsApp credit purchase"],
                              ["Dec, 2023", "₹ 180", "SMS credit purchase"],
                              ["Jan, 2024", "₹ 500", "Email credit purchase"],
                            ]}
                            tableFooterText="Total Expenses Till Now: ₹ 760"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
          <div style={{ minWidth: 200, marginTop: "4%" }}>
            <CreditCardBouncing />
          </div>
        </div>
      </>
    );
  };

  const tabKeys = {
    Overview: {
      name: "Reminders Overview",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            {" "}
            <OverView />{" "}
          </div>
        </div>
      ),
    },
    CreateEntry: {
      name: "Configure Reminder",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            <ReminderConfiguration />
          </div>
        </div>
      ),
    },
    Details: {
      name: "Manage Credit",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          {" "}
          <div className="flex flex-col w-full">
            {" "}
            <ManageCredit />
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="flex justify-center w-full px-4">
      <TabDefault options={tabKeys} color={TOOL_TIP_COLORS.primary} />
    </div>
  );
}

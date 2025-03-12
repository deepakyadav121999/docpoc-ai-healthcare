"use client";
import DataStatsDefault from "../DataStats/DataStatsDefault";
import { dataStatsDefault } from "@/types/dataStatsDefault";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import CardBlurred from "../common/Card/CardBlurred";
import CardSegmented from "../common/Card/CardSegmented";
import PricingTable from "../common/Table/PricingTable";
import { Divider } from "@nextui-org/react";
import HighlightedText from "../common/HighLightedText";
import { TOOL_TIP_COLORS } from "@/constants";
import CreditCardBouncing from "../common/CreditCardBouncing";

const ManageCredit = () => {
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
export default ManageCredit;

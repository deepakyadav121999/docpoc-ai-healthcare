"use client";

import { TOOL_TIP_COLORS } from "@/constants";
import { AppointmentCalendar } from "../BookingCalendar/AppointmentCalendar";
import AppointmentTable from "./Table";
import TabDefault from "../common/Tab";

export default function app() {
  const tabKeys = {
    CalendarView: {
      name: "Appointment Calendar",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          <div className="flex flex-col w-full">
            <AppointmentCalendar />
          </div>
        </div>
      ),
    },
    DetailedView: {
      name: "Manage Appointments",
      screen: (
        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
          <div className="flex flex-col w-full">
            <AppointmentTable />
          </div>
        </div>
      ),
    },
  };
  return <TabDefault options={tabKeys} color={TOOL_TIP_COLORS.primary} />;
}

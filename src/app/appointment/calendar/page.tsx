import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppointmentCalendar from "@/components/BookingCalendar/AppointmentCalendar";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import { APPOINTMENT_TAB_KEYS } from "../routes";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const current = ROUTES.APPOINTMENT;
const Appointments = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="appointments" />
        <TabDefaultWithRoute current={current} color={TOOL_TIP_COLORS.primary} options={APPOINTMENT_TAB_KEYS}/>

        <AppointmentCalendar />
      </div>
    </DefaultLayout>
  );
};

export default Appointments;

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppointmentTable from "@/components/CalenderBox/Table";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import { APPOINTMENT_TAB_KEYS } from "../routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const current = ROUTES.MANAGE_APPOINTMENT;
const ManagePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="appointment/manage" />
        <TabDefaultWithRoute
          current={current}
          color={TOOL_TIP_COLORS.primary}
          options={APPOINTMENT_TAB_KEYS}
        />

        <AppointmentTable />
      </div>
    </DefaultLayout>
  );
};

export default ManagePage;

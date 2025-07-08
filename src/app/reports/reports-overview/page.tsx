"use client";
// import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import ReminderConfiguration from "@/components/Reminder/ReminderConfiguration";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { TOOL_TIP_COLORS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { REPORTS_TAB_KEYS } from "../routes";
// import ReportForm from "../../../components/Reports/ReportForm";
import ReportsOverview from "../../../components/Reports/ReportsOverview";
// export const metadata: Metadata = {
//   title: "DocPOC.",
//   description: "Manage easy.",
// };
const current = ROUTES.REPORTS_OVERVIEW;

const GenerateReports = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Reports-Overview" />
        <TabDefaultWithRoute
          current={current}
          options={REPORTS_TAB_KEYS}
          color={TOOL_TIP_COLORS.primary}
        />
        <div className="mt-5">
          <ReportsOverview />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default GenerateReports;

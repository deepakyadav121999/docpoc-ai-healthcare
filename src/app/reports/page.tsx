import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Reminder from "@/components/Reminder";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { REPORTS_TAB_KEYS } from "./routes";
import { TOOL_TIP_COLORS } from "@/constants";
import { ROUTES } from "@/constants/routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.REPORTS_OVERVIEW;

const ReportPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Reports" />
        <TabDefaultWithRoute
          current={current}
          options={REPORTS_TAB_KEYS}
          color={TOOL_TIP_COLORS.primary}
        />
        <Reminder />
      </div>
    </DefaultLayout>
  );
};

export default ReportPage;

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Reminder from "@/components/Reminder";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { REMINDER_TAB_KEYS } from "./routes";
import { TOOL_TIP_COLORS } from "@/constants";
import { ROUTES } from "@/constants/routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.REMINDER_OVERVIEW;

const RemindersPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Reminder Notifications" />
        <TabDefaultWithRoute
          current={current}
          options={REMINDER_TAB_KEYS}
          color={TOOL_TIP_COLORS.primary}
        />
        <Reminder />
      </div>
    </DefaultLayout>
  );
};

export default RemindersPage;

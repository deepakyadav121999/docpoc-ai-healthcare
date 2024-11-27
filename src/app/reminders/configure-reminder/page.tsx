
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ReminderConfiguration from "@/components/Reminder/ReminderConfiguration";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { TOOL_TIP_COLORS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { REMINDER_TAB_KEYS } from "../routes";


export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.CONFIGURE_REMINDER

const ConfigureReminder = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Reminder Notifications" />
        <TabDefaultWithRoute current={current}  options={REMINDER_TAB_KEYS} color={TOOL_TIP_COLORS.primary}/>
        <ReminderConfiguration />
      </div>
    </DefaultLayout>
  );
};

export default ConfigureReminder;

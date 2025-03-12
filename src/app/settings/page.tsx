import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Settings from "@/components/Settings";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { SETTING_TAB_KEYS } from "./routes";
import { ROUTES } from "@/constants/routes";
import { TOOL_TIP_COLORS } from "@/constants";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.SETTING_GENERAL;

const SettingsPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Clinic" />
        <TabDefaultWithRoute
          current={current}
          options={SETTING_TAB_KEYS}
          color={TOOL_TIP_COLORS.primary}
        />
        <Settings />
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;

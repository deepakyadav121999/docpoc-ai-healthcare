import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
;
import { SETTING_TAB_KEYS } from "../routes";
import { ROUTES } from "@/constants/routes";
import { TOOL_TIP_COLORS } from "@/constants";

import Premium from "@/components/Settings/Premium";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
 const current = ROUTES.SETTING_PREMIUM
 
const SettingsPremium = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Settings" />
     <TabDefaultWithRoute current={current}  options={SETTING_TAB_KEYS} color={TOOL_TIP_COLORS.primary}/>
       <Premium/>
      
      </div>
    </DefaultLayout>
  );
};

export default SettingsPremium;

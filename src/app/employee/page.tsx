import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import Employee from "@/components/Employee";
import { EMPLOYEE_TAB_KEYS } from "./routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const current = ROUTES.EMPLOYEE_OVERVIEW;
const EmployeePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="employee" />
        <TabDefaultWithRoute
          current={current}
          color={TOOL_TIP_COLORS.primary}
          options={EMPLOYEE_TAB_KEYS}
        />

        <Employee />
      </div>
    </DefaultLayout>
  );
};

export default EmployeePage;

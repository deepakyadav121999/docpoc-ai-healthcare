

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import DataTable from "@/components/Employee/DataTable";
import { EMPLOYEE_TAB_KEYS } from "../routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const current = ROUTES.EMPLOYEE_DETAILS;
const EmployeePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="employee/details" />
        <TabDefaultWithRoute current={current} color={TOOL_TIP_COLORS.primary} options={EMPLOYEE_TAB_KEYS}/>

        <DataTable/>
      </div>
    </DefaultLayout>
  );
};

export default EmployeePage;

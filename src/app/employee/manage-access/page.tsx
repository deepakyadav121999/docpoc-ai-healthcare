import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import UserAccess from "@/components/Employee/UserAccess";
import { EMPLOYEE_TAB_KEYS } from "../routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const current = ROUTES.EMPLOYEE_MANAGE_ACCESS;
const EmployeePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl ">
        <Breadcrumb pageName="Employee/Manage-Access " />
        <TabDefaultWithRoute
          current={current}
          color={TOOL_TIP_COLORS.primary}
          options={EMPLOYEE_TAB_KEYS}
        />
        <div className="mt-2">
          <UserAccess />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EmployeePage;

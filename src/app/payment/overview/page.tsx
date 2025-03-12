import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Payment from "@/components/Payments";
import { ROUTES } from "@/constants/routes";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { PAYMENT_TAB_KEY } from "../routes";
import { TOOL_TIP_COLORS } from "@/constants";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.PAYMENT_OVERVIRW;

const Overview = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Payment" />
        <TabDefaultWithRoute
          current={current}
          options={PAYMENT_TAB_KEY}
          color={TOOL_TIP_COLORS.primary}
        />
        <Payment />
      </div>
    </DefaultLayout>
  );
};

export default Overview;

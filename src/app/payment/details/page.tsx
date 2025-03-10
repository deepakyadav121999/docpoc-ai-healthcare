import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { ROUTES } from "@/constants/routes";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { PAYMENT_TAB_KEY } from "../routes";
import { TOOL_TIP_COLORS } from "@/constants";
import PaymentDetails from "@/components/Payments/PaymentDetails";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};
const current = ROUTES.PAYMENT_DETAILS;

const Paymentdetail = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl ">
        <Breadcrumb pageName="Payment" />
        <TabDefaultWithRoute
          current={current}
          options={PAYMENT_TAB_KEY}
          color={TOOL_TIP_COLORS.primary}
        />
        <div className="mt-2">
          <PaymentDetails />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Paymentdetail;

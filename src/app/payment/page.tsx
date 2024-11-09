import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Payment from "@/components/Payments";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const PaymentPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Payment" />

        <Payment />
      </div>
    </DefaultLayout>
  );
};

export default PaymentPage;

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Reminder from "@/components/Reminder";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const RemindersPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Reminder Notifications" />

        <Reminder />
      </div>
    </DefaultLayout>
  );
};

export default RemindersPage;

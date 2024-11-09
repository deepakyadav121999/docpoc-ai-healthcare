import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Settings from "@/components/Settings";;

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const SettingsPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Settings" />

        <Settings />
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;

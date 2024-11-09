import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Employee from "@/components/Employee/";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const EmployeePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Patients" />

        <Employee />
      </div>
    </DefaultLayout>
  );
};

export default EmployeePage;

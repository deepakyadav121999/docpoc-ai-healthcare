import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Patient from "@/components/Patient";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const PatientPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Patients" />

        <Patient />
      </div>
    </DefaultLayout>
  );
};

export default PatientPage;

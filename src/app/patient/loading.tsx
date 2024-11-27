import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Spinner} from "@nextui-org/spinner";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const Loading = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Patients" />
        <div className="flex justify-center items-center w-full h-full">
           <Spinner size="lg" />
           </div>
        
      </div>
    </DefaultLayout>
  );
};

export default Loading;

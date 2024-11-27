
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Spinner} from "@nextui-org/spinner";


const PatientPage = () => {
 
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Comming Soon" />
        <div className="flex justify-center items-center w-full h-full">
           <Spinner size="lg" />
           </div>
   
      </div>
    </DefaultLayout>
  );
};

export default PatientPage;

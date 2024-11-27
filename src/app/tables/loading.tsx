import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";



import DefaultLayout from "@/components/Layouts/DefaultLaout";
import {Spinner} from "@nextui-org/spinner";


const Loading = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex justify-center items-center w-full h-full">
           <Spinner size="lg" />
           </div>
    </DefaultLayout>
  );
};

export default Loading;

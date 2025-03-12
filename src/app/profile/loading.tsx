import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Spinner } from "@nextui-org/spinner";

const Loading = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />
        <div className="flex justify-center items-center w-full h-full">
          <Spinner size="lg" />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Loading;

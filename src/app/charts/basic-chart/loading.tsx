import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Spinner } from "@nextui-org/spinner";

const Loading = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Basic Chart" />
      <div className="flex justify-center items-center w-full h-full">
        <Spinner size="lg" />
      </div>
    </DefaultLayout>
  );
};

export default Loading;

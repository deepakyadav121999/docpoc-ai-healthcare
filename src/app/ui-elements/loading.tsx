import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <>
      <DefaultLayout>
        <div className="flex justify-center items-center w-full h-full">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    </>
  );
}

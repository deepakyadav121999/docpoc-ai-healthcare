

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import {Spinner} from "@nextui-org/spinner";

export default function Home() {
  return (
    <>
      <DefaultLayout>
       <Spinner size="lg"/>
      </DefaultLayout>
    </>
  );
}

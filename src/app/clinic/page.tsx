import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Settings from "@/components/Settings";
import Clinic from "@/components/Clinic/Clinic";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        {/* <ECommerce /> */}
        <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Clinic" />
          <Clinic />
          </div> 
      </DefaultLayout>
    </>
  );
}

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const CalendarPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="appointments" />

        <CalendarBox />
      </div>
    </DefaultLayout>
  );
};

export default CalendarPage;

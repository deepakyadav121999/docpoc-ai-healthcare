import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import AddAppointment from "@/components/CalenderBox/AddAppointment";

export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};


const AddAppointmentPage = () => {

  
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl  ">
        <Breadcrumb pageName="appointment/add" />

        <AddAppointment onUsersAdded={()=>{}}/>
      </div>
    </DefaultLayout>
  );
};

export default AddAppointmentPage;

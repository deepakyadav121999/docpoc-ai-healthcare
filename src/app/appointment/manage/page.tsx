import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppointmentTable from "@/components/CalenderBox/Table";
import { TOOL_TIP_COLORS } from "@/constants";
import TabDefaultWithRoute from "@/components/common/TabWithRoute";
import { ROUTES } from "@/constants/routes";
import { APPOINTMENT_TAB_KEYS } from "../routes";
export const metadata: Metadata = {
  title: "DocPOC.",
  description: "Manage easy.",
};

const current = ROUTES.MANAGE_APPOINTMENT;
const ManagePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Appointment/Manage" />
        <TabDefaultWithRoute
          current={current}
          color={TOOL_TIP_COLORS.primary}
          options={APPOINTMENT_TAB_KEYS}
        />

        <AppointmentTable />
      </div>
    </DefaultLayout>
  );
};

export default ManagePage;

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLaout";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import AppointmentTable from "@/components/CalenderBox/Table";
// import { TOOL_TIP_COLORS } from "@/constants";
// import TabDefaultWithRoute from "@/components/common/TabWithRoute";
// import { ROUTES } from "@/constants/routes";
// import { APPOINTMENT_TAB_KEYS } from "../routes";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

// // export const metadata: Metadata = {
// //   title: "DocPOC.",
// //   description: "Manage easy.",
// // };

// const current = ROUTES.MANAGE_APPOINTMENT;

// const ManagePage = () => {

//   const profile = useSelector((state: RootState) => state.profile.data);

//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalAppointments, setTotalAppointments] = useState(0);

//   const fetchAppointments = useCallback(async (params: any) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("docPocAuth_token");

//       const fetchedBranchId = profile?.branchId;

//       const endpoint = `${process.env.API_URL}/appointment/list/${fetchedBranchId}`;

//       const response = await axios.get(endpoint, {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setAppointments(response.data.rows || response.data);
//       setTotalAppointments(response.data.count || response.data.length);
//     } catch (err) {
//       setError("Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAppointments({ page: 1, pageSize: 5 });
//   }, [fetchAppointments]);

//   return (
//     <DefaultLayout>
//       <div className="mx-auto max-w-7xl">
//         <Breadcrumb pageName="appointment/manage" />
//         <TabDefaultWithRoute
//           current={current}
//           color={TOOL_TIP_COLORS.primary}
//           options={APPOINTMENT_TAB_KEYS}
//         />
//         <AppointmentTable
//           appointments={appointments}
//           loading={loading}
//           error={error}
//           totalAppointments={totalAppointments}
//           fetchAppointments={fetchAppointments}
//         />
//       </div>
//     </DefaultLayout>
//   );
// };

// export default ManagePage;

// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import DefaultLayout from "@/components/Layouts/DefaultLaout";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import AppointmentTable from "@/components/CalenderBox/Table";
// import { TOOL_TIP_COLORS } from "@/constants";
// import TabDefaultWithRoute from "@/components/common/TabWithRoute";
// import { ROUTES } from "@/constants/routes";
// import { APPOINTMENT_TAB_KEYS } from "../routes";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";

// const current = ROUTES.MANAGE_APPOINTMENT;

// const ManagePage = () => {
//   const profile = useSelector((state: RootState) => state.profile.data);

//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalAppointments, setTotalAppointments] = useState(0);

//   const fetchAppointments = useCallback(async (params: any) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("docPocAuth_token");
//       const fetchedBranchId = profile?.branchId;
//       const userId = profile?.id; // Assuming the user ID is stored in profile

//       const endpoint = `${process.env.API_URL}/appointment/list/${fetchedBranchId}`;

//       const response = await axios.get(endpoint, {
//         params: {
//           ...params,
//           branchId: fetchedBranchId,
//           from: "2024-12-01T00:00:00.000Z",
//           to: "2025-12-31T23:59:59.999Z",
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       setAppointments(response.data.rows || response.data);
//       setTotalAppointments(response.data.count || response.data.length);
//     } catch (err) {
//       setError("Failed to fetch appointments.");
//     } finally {
//       setLoading(false);
//     }
//   }, [profile]);

//   useEffect(() => {
//     fetchAppointments({ page: 1, pageSize: 5 });
//   }, [fetchAppointments]);

//   return (
//     <DefaultLayout>
//       <div className="mx-auto max-w-7xl">
//         <Breadcrumb pageName="appointment/manage" />
//         <TabDefaultWithRoute
//           current={current}
//           color={TOOL_TIP_COLORS.primary}
//           options={APPOINTMENT_TAB_KEYS}
//         />
//         <AppointmentTable
//           appointments={appointments}
//           loading={loading}
//           error={error}
//           totalAppointments={totalAppointments}
//           fetchAppointments={fetchAppointments}
//           userId={profile?.id} // Pass user ID to the child component
//         />
//       </div>
//     </DefaultLayout>
//   );
// };

// export default ManagePage;

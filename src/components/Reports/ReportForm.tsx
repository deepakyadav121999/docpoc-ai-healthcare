// "use client";

// import {
//   Button,
//   Input,
//   Textarea,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
//   RadioGroup,
//   Radio,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalContent,
// } from "@nextui-org/react";
// import { useState, useEffect } from "react";

// const AppointmentForm = () => {
//   const [appointmentMode, setAppointmentMode] = useState<"appointment" | "manual">("appointment");
//   const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
//   const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
//   const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
//   const [observations, setObservations] = useState<string>("");
//   const [additionalNotes, setAdditionalNotes] = useState<string>("");
//   const [medications, setMedications] = useState<{ time: string; name: string; note: string }[]>([]);
//   const [followUpRequired, setFollowUpRequired] = useState<"yes" | "no">("no");
//   const [followUpDate, setFollowUpDate] = useState<string>("");
//   const [reportType, setReportType] = useState<string | null>(null);
//   const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

//   const appointments = [
//     { id: "1", patientName: "Sarah Johnson", doctorName: "Dr. Smith", date: "2025-04-10" },
//     { id: "2", patientName: "John Doe", doctorName: "Dr. Taylor", date: "2025-04-12" },
//   ];

//   const patients = ["Sarah Johnson", "John Doe", "Michael Lee"];
//   const doctors = ["Dr. Smith", "Dr. Taylor", "Dr. Williams"];
//   const times = ["Morning", "Afternoon", "Evening", "Night"];
//   const reportTypes = ["Normal", "Serious", "Critical"];

//   const addMedication = () => {
//     setMedications([...medications, { time: "", name: "", note: "" }]);
//   };

//   const updateMedication = (index: number, field: "time" | "name" | "note", value: string) => {
//     const updatedMedications = [...medications];
//     updatedMedications[index][field] = value;
//     setMedications(updatedMedications);
//   };

//   const openPreviewModal = () => {
//     setIsPreviewModalOpen(true);
//   };

//   const closePreviewModal = () => {
//     setIsPreviewModalOpen(false);
//   };

// useEffect(() => {
//     const header = document.querySelector("header");
//     if (isPreviewModalOpen) {
//       header?.classList.remove("z-999");
//       header?.classList.add("z-0");
//     }
//     // else if(isNotificationOpen) {
//     //     header?.classList.remove("z-999");
//     //   header?.classList.add("z-0");
//     // }
//     else {
//       header?.classList.remove("z-0");
//       header?.classList.add("z-999");
//     }
//   }, [isPreviewModalOpen]);

//   return (
//     <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-dark text-black dark:text-white">
//       <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-8 space-y-6">
//         {/* Header */}
//         <h1 className="text-2xl font-bold text-dark dark:text-white">Appointment Report Form</h1>

//         {/* Mode Selection */}
//         <div className="flex space-x-4 justify-center">
//           <Button
//             className={`rounded-[7px] py-2 px-4 ${
//               appointmentMode === "appointment"
//                 ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                 : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
//             }`}
//             onPress={() => setAppointmentMode("appointment")}
//           >
//             Generate Using Appointment
//           </Button>
//           <Button
//             className={`rounded-[7px] py-2 px-4 ${
//               appointmentMode === "manual"
//                 ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                 : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
//             }`}
//             onPress={() => setAppointmentMode("manual")}
//           >
//             Manual Report
//           </Button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* Appointment Mode */}
//         {appointmentMode === "appointment" && (
//           <div className="space-y-4">
//             {/* Select Appointment */}
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Select Appointment
//             </label>
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
//                   {selectedAppointment
//                     ? `Appointment ID: ${selectedAppointment}`
//                     : "Select Appointment"}
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 onAction={(key) => {
//                   const appointment = appointments.find((a) => a.id === key);
//                   setSelectedAppointment(key as string);
//                   setSelectedPatient(appointment?.patientName || "");
//                   setSelectedDoctor(appointment?.doctorName || "");
//                 }}
//               >
//                 {appointments.map((appointment) => (
//                   <DropdownItem key={appointment.id}>
//                     {appointment.patientName} with {appointment.doctorName} on {appointment.date}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         )}


// {/* Report Type Dropdown */}
// <div className="space-y-4">
//   <label className="block text-sm font-medium text-dark dark:text-white">Report Type</label>
//   <Dropdown>
//     <DropdownTrigger>
//       <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
//         {reportType || "Select Report Type"}
//       </Button>
//     </DropdownTrigger>
//     <DropdownMenu
//       onAction={(key) => setReportType(key as string)}
//       className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3 w-full"
//       style={{
//         minWidth: "100%", // Ensures the menu matches the button width
//         left: "0", // Aligns dropdown with the button
//       }}
//     >
//       {reportTypes.map((type) => (
//         <DropdownItem
//           key={type}
//           className="w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           {type}
//         </DropdownItem>
//       ))}
//     </DropdownMenu>
//   </Dropdown>
// </div>

// </div>
//         {/* Patient and Doctor Dropdowns */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Select Patient */}
//           <div>
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Select Patient
//             </label>
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
//                   {selectedPatient || "Select Patient"}
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 onAction={(key) => setSelectedPatient(key as string)}
//                 className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
//               >
//                 {patients.map((patient) => (
//                   <DropdownItem key={patient}>{patient}</DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//           </div>

//           {/* Select Doctor */}
//           <div>
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Select Doctor
//             </label>
//             <Dropdown>
//               <DropdownTrigger>
//                 <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
//                   {selectedDoctor || "Select Doctor"}
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 onAction={(key) => setSelectedDoctor(key as string)}
//                 className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
//               >
//                 {doctors.map((doctor) => (
//                   <DropdownItem key={doctor}>{doctor}</DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         </div>

//         {/* Observations */}
//         <div>
//           <label className="block text-sm font-medium text-dark dark:text-white">Observations</label>
//           <Textarea
//             value={observations}
//             onChange={(e) => setObservations(e.target.value)}
//             placeholder="Enter observations..."
//             className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>

//         {/* Additional Notes */}
//         <div>
//           <label className="block text-sm font-medium text-dark dark:text-white">Additional Notes</label>
//           <Textarea
//             value={additionalNotes}
//             onChange={(e) => setAdditionalNotes(e.target.value)}
//             placeholder="Enter additional notes..."
//             className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>

//         {/* Medications */}
//         <div>
//           <label className="block text-sm font-medium text-dark dark:text-white">Medications</label>
//           {medications.map((med, index) => (
//             <div key={index} className="grid grid-cols-12 gap-4 items-center mt-2">
//               {/* Time Dropdown */}
//               <Dropdown>
//                 <DropdownTrigger>
//                   <Button className="col-span-3 w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
//                     {med.time || "Select Time"}
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu
//                   onAction={(key) => updateMedication(index, "time", key as string)}
//                   className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
//                 >
//                   {times.map((time) => (
//                     <DropdownItem key={time}>{time}</DropdownItem>
//                   ))}
//                 </DropdownMenu>
//               </Dropdown>

//               {/* Medication Name */}
//               <Input
//                 type="text"
//                 placeholder="Medication Name"
//                 value={med.name}
//                 onChange={(e) => updateMedication(index, "name", e.target.value)}
//                 className="col-span-5 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//               />

//               {/* Optional Note */}
//               <Input
//                 type="text"
//                 placeholder="Note (optional)"
//                 value={med.note}
//                 onChange={(e) => updateMedication(index, "note", e.target.value)}
//                 className="col-span-4 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//               />
//             </div>
//           ))}
//           <Button onPress={addMedication} className="mt-4 text-indigo-600">
//             + Add Medication
//           </Button>
//         </div>




//       {/* Follow-Up */}
// {/* Follow-Up */}
// <div>
//   <label className="block text-sm font-medium text-dark dark:text-white">Follow-Up Required</label>
//   <RadioGroup
//     orientation="horizontal"
//     value={followUpRequired}
//     onChange={(event) => setFollowUpRequired(event.target.value as "yes" | "no")}
//     className="mt-1 text-dark dark:text-white"
//   >
//     <Radio value="yes">Yes</Radio>
//     <Radio value="no">No</Radio>
//   </RadioGroup>

//   {/* Conditionally render Date and Note fields when "Yes" is selected */}
//   {followUpRequired === "yes" && (
//     <div className="mt-4 space-y-4">
//       {/* Flex Container for Date and Note */}
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Date Field */}
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-dark dark:text-white">
//             Follow-Up Date
//           </label>
//           <Input
//             type="date"
//             value={followUpDate}
//             onChange={(e) => setFollowUpDate(e.target.value)}
//             className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>

//         {/* Note Field */}
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-dark dark:text-white">
//             Follow-Up Note
//           </label>
//           <Textarea
//             placeholder="Enter additional notes for follow-up..."
//             className="w-full h-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>
//       </div>
//     </div>
//   )}
// </div>



//         {/* Preview Button */}
//         <Button
//           className="w-full rounded-[7px] bg-indigo-600 text-white hover:bg-indigo-700"
//           onPress={openPreviewModal}
//         >
//           Preview Report
//         </Button>


//         {/* Preview Modal */}
// <Modal 
//   isOpen={isPreviewModalOpen} 
//   onOpenChange={setIsPreviewModalOpen}
//   size="5xl" // Makes the modal larger
//   scrollBehavior="inside" 
//   className="max-h-[90vh] overflow-y-auto"
// >
//   <ModalContent>
//     {(onClose) => (
//       <>
//         <ModalHeader className="flex flex-col gap-1">
//           <h1 className="text-2xl font-bold">Report Preview</h1>
//         </ModalHeader>
//         <ModalBody>
//           <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">

//             {/* Report Header */}
//             <div className="border-b pb-4">
//               <h2 className="text-xl font-semibold">Report Details</h2>
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <div>
//                   <p className="text-sm text-gray-500">Report ID</p>
//                   <p className="font-medium">MED-2023-07-15-001</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Patient</p>
//                   <p className="font-medium">{selectedPatient || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Patient ID</p>
//                   <p className="font-medium">P-10042387</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Date Generated</p>
//                   <p className="font-medium">{new Date().toLocaleDateString()}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Report Type</p>
//                   <p className="font-medium">{reportType || "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Attending Physician</p>
//                   <p className="font-medium">{selectedDoctor || "N/A"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex space-x-4 border-b pb-4">
//               <Button variant="light" className="text-blue-600">Full Preview</Button>
//               {/* <Button variant="light" className="text-blue-600">Download Report</Button> */}
//               <Button variant="light" className="text-blue-600">Edit Report</Button>
//               <Button variant="light" className="text-blue-600">Share Report</Button>
//             </div>

//             {/* Medical Assessment */}
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Medical Health Assessment</h2>
//               <p className="italic mb-4">Comprehensive Check-up Report</p>

//               {/* Patient Information */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">Patient Information</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Name</p>
//                     <p className="font-medium">{selectedPatient || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Age</p>
//                     <p className="font-medium">42 years</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Gender</p>
//                     <p className="font-medium">Female</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Date of Birth</p>
//                     <p className="font-medium">April 15, 1981</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Vital Signs */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">Vital Signs</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full border">
//                     <thead>
//                       <tr className="bg-gray-100 dark:bg-gray-700">
//                         <th className="border px-4 py-2">Blood Pressure</th>
//                         <th className="border px-4 py-2">Heart Rate</th>
//                         <th className="border px-4 py-2">Temperature</th>
//                         <th className="border px-4 py-2">Respiratory Rate</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td className="border px-4 py-2 text-center">120/80 mmHg</td>
//                         <td className="border px-4 py-2 text-center">72 bpm</td>
//                         <td className="border px-4 py-2 text-center">98.6 °F</td>
//                         <td className="border px-4 py-2 text-center">16 rpm</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Clinical Findings */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">
//                   {/* Clinical Findings */}
//                   Observations
//                   </h3>
//                 <p className="whitespace-pre-line">
//                   {observations || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
//                 </p>
//               </div>


//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">
//                  Additional Notes
//                   </h3>
//                 <p className="whitespace-pre-line">
//                   {additionalNotes || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
//                 </p>
//               </div>

//               {/* Medications */}
//               {medications.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium mb-2">Prescribed Medications</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     {medications.map((med, index) => (
//                       <li key={index}>
//                         <strong>{med.name || "Unnamed medication"}</strong> ({med.time || "No time specified"}) - {med.note || "No notes"}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Footer */}
//               <div className="flex justify-between items-center border-t pt-4">
//                 {/* <span className="text-sm text-gray-500">( Page 1 of 3 )</span> */}
//                 <span className="text-sm italic">Report prepared by: {selectedDoctor || "N/A"}</span>
//               </div>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onPress={onClose}>
//             Close
//           </Button>
//           <Button color="success" className="text-white">
//             Save and Generate Report
//           </Button>
//         </ModalFooter>
//       </>
//     )}
//   </ModalContent>
// </Modal>
//       </div>
//     </div>
//   );
// };

// export default AppointmentForm;


// "use client";

// import {
//   Button,
//   Input,
//   Textarea,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
//   RadioGroup,
//   Radio,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalContent,
//   Spinner,
//   Checkbox,
//   Autocomplete,
//   AutocompleteItem
// } from "@nextui-org/react";
// import { useState, useEffect, useCallback } from "react";
// import { TOOL_TIP_COLORS } from "@/constants";
// interface Appointment {
//   id: string;
//   name: string;
//   doctorId: string;
//   doctorName: string;
//   patientId: string;
//   patientName: string;
//   dateTime: string;
//   startDateTime: string;
//   endDateTime: string;
//   json: string;
// }

// interface Patient {
//   id: string;
//   name: string;
// }

// interface Doctor {
//   id: string;
//   name: string;
// }

// const BASE_URL = "http://127.0.0.1:3037/DocPOC/v1";

// const AppointmentForm = () => {
//   const [reportName, setReportName] = useState("");
//   const [enableSharingWithPatient, setEnableSharingWithPatient] = useState(true);
//   const [isSharedWithPatient, setIsSharedWithPatient] = useState(true);
//   const [appointmentMode, setAppointmentMode] = useState<"appointment" | "manual">("appointment");
//   const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
//   const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
//   const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
//   const [observations, setObservations] = useState<string>("");
//   const [additionalNotes, setAdditionalNotes] = useState<string>("");
//   const [medications, setMedications] = useState<{ time: string; name: string; note: string }[]>([]);
//   const [followUpRequired, setFollowUpRequired] = useState<"yes" | "no">("no");
//   const [followUpDate, setFollowUpDate] = useState<string>("");
//   const [reportType, setReportType] = useState<string | null>(null);
//   const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [doctors, setDoctors] = useState<Doctor[]>([]);

//   const [appointmentPage, setAppointmentPage] = useState(1);
//   const [patientPage, setPatientPage] = useState(1);
//   const [doctorPage, setDoctorPage] = useState(1);
//   const [hasMoreAppointments, setHasMoreAppointments] = useState(true);
//   const [hasMorePatients, setHasMorePatients] = useState(true);
//   const [hasMoreDoctors, setHasMoreDoctors] = useState(true);

//   const times = ["Morning", "Afternoon", "Evening", "Night"];
//   const reportTypes = ["Normal", "Serious", "Critical"];

//   const getAuthToken = () => {
//     return localStorage.getItem("docPocAuth_token") || "";
//   };

//   const fetchAppointments = useCallback(async (page: number) => {
//     try {
//       setIsLoading(true);
//       const token = getAuthToken();
//       const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
//       const response = await fetch(
//         `${BASE_URL}/appointment/list/${branchId}?page=${page}&pageSize=10`,
//         {
//           headers: {
//             accept: "*/*",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch appointments");
//       }

//       const data = await response.json();
//       if (page === 1) {
//         setAppointments(data.rows);
//       } else {
//         setAppointments((prev) => [...prev, ...data.rows]);
//       }
//       setHasMoreAppointments(data.rows.length === 10);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchPatients = useCallback(async (page: number) => {
//     try {
//       setIsLoading(true);
//       const token = getAuthToken();
//       const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
//       const response = await fetch(
//         `${BASE_URL}/patient/list/${branchId}?page=${page}&pageSize=10`,
//         {
//           headers: {
//             accept: "*/*",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch patients");
//       }

//       const data = await response.json();
//       if (page === 1) {
//         setPatients(data.rows);
//       } else {
//         setPatients((prev) => [...prev, ...data.rows]);
//       }
//       setHasMorePatients(data.rows.length === 10);
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const fetchDoctors = useCallback(async (page: number) => {
//     try {
//       setIsLoading(true);
//       const token = getAuthToken();
//       const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
//       const response = await fetch(
//         `${BASE_URL}/user/list/${branchId}?page=${page}&pageSize=10`,
//         {
//           headers: {
//             accept: "*/*",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch doctors");
//       }

//       const data = await response.json();
//       if (page === 1) {
//         setDoctors(data.rows);
//       } else {
//         setDoctors((prev) => [...prev, ...data.rows]);
//       }
//       setHasMoreDoctors(data.rows.length === 10);
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAppointments(1);
//     fetchPatients(1);
//     fetchDoctors(1);
//   }, [fetchAppointments, fetchPatients, fetchDoctors]);

//   const handleAppointmentScroll = useCallback(async (e: React.UIEvent<HTMLElement>) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop === clientHeight && hasMoreAppointments && !isLoading) {
//       const nextPage = appointmentPage + 1;
//       await fetchAppointments(nextPage);
//       setAppointmentPage(nextPage);
//     }
//   }, [appointmentPage, fetchAppointments, hasMoreAppointments, isLoading]);

//   const handlePatientScroll = useCallback(async (e: React.UIEvent<HTMLElement>) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop === clientHeight && hasMorePatients && !isLoading) {
//       const nextPage = patientPage + 1;
//       await fetchPatients(nextPage);
//       setPatientPage(nextPage);
//     }
//   }, [patientPage, fetchPatients, hasMorePatients, isLoading]);

//   const handleDoctorScroll = useCallback(async (e: React.UIEvent<HTMLElement>) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop === clientHeight && hasMoreDoctors && !isLoading) {
//       const nextPage = doctorPage + 1;
//       await fetchDoctors(nextPage);
//       setDoctorPage(nextPage);
//     }
//   }, [doctorPage, fetchDoctors, hasMoreDoctors, isLoading]);

//   const addMedication = () => {
//     setMedications([...medications, { time: "", name: "", note: "" }]);
//   };

//   const updateMedication = (index: number, field: "time" | "name" | "note", value: string) => {
//     const updatedMedications = [...medications];
//     updatedMedications[index][field] = value;
//     setMedications(updatedMedications);
//   };

//   const openPreviewModal = () => {
//     setIsPreviewModalOpen(true);
//   };

//   const closePreviewModal = () => {
//     setIsPreviewModalOpen(false);
//   };

//   useEffect(() => {
//     const header = document.querySelector("header");
//     if (isPreviewModalOpen) {
//       header?.classList.remove("z-999");
//       header?.classList.add("z-0");
//     } else {
//       header?.classList.remove("z-0");
//       header?.classList.add("z-999");
//     }
//   }, [isPreviewModalOpen]);
//   const renderAppointmentItems = () => {
//     const items = appointments.map((appointment) => (
//       <DropdownItem key={appointment.id} textValue={appointment.name}>
//         {appointment.name} with {appointment.doctorName} on {new Date(appointment.dateTime).toLocaleDateString()}
//       </DropdownItem>
//     ));

//     if (isLoading) {
//       items.push(
//         <DropdownItem key="loading" isReadOnly textValue="Loading...">
//           <div className="flex justify-center">
//             <Spinner size="sm" />
//           </div>
//         </DropdownItem>
//       );
//     }

//     return items;
//   };

//   const renderPatientItems = () => {
//     const items = patients.map((patient) => (
//       <DropdownItem key={patient.id} textValue={patient.name}>
//         {patient.name}
//       </DropdownItem>
//     ));

//     if (isLoading) {
//       items.push(
//         <DropdownItem key="loading" isReadOnly textValue="Loading...">
//           <div className="flex justify-center">
//             <Spinner size="sm" />
//           </div>
//         </DropdownItem>
//       );
//     }

//     return items;
//   };

//   const renderDoctorItems = () => {
//     const items = doctors.map((doctor) => (
//       <DropdownItem key={doctor.id} textValue={doctor.name}>
//         {doctor.name}
//       </DropdownItem>
//     ));

//     if (isLoading) {
//       items.push(
//         <DropdownItem key="loading" isReadOnly textValue="Loading...">
//           <div className="flex justify-center">
//             <Spinner size="sm" />
//           </div>
//         </DropdownItem>
//       );
//     }

//     return items;
//   };


//   const appointmentItems = appointments.map(appointment => ({
//     id: appointment.id,
//     label: `${appointment.name} with ${appointment.doctorName} on ${new Date(appointment.dateTime).toLocaleDateString()}`
//   }));

//   const patientItems = patients.map(patient => ({
//     id: patient.id,
//     label: patient.name
//   }));

//   const doctorItems = doctors.map(doctor => ({
//     id: doctor.id,
//     label: doctor.name
//   }));

//   const reportTypeItems = reportTypes.map(type => ({
//     id: type,
//     label: type
//   }));

//   const timeItems = times.map(time => ({
//     id: time,
//     label: time
//   }));


//   return (
//     <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-dark text-black dark:text-white">
//       <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-8 space-y-6">
//         <h1 className="text-2xl font-bold text-dark dark:text-white">Appointment Report Form</h1>

//         <div className="flex space-x-4 justify-center">
//           <Button
//             className={`rounded-[7px] py-2 px-4 ${appointmentMode === "appointment"
//               ? "bg-indigo-600 text-white hover:bg-indigo-700"
//               : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
//               }`}
//             onPress={() => setAppointmentMode("appointment")}
//           >
//             Generate Using Appointment
//           </Button>
//           <Button
//             className={`rounded-[7px] py-2 px-4 ${appointmentMode === "manual"
//               ? "bg-indigo-600 text-white hover:bg-indigo-700"
//               : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
//               }`}
//             onPress={() => setAppointmentMode("manual")}
//           >
//             Manual Report
//           </Button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {appointmentMode === "appointment" && (
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-dark dark:text-white">
//                 Select Appointment
//               </label>
//               <Autocomplete
//                 variant="bordered"
//                 color={TOOL_TIP_COLORS.secondary}
//                 labelPlacement="outside"
//                 placeholder="Select Appointment"
//                 defaultItems={appointmentItems}
//                 selectedKey={selectedAppointment || ""}
//                 onSelectionChange={(key) => {
//                   const appointment = appointments.find(a => a.id === key);
//                   setSelectedAppointment(key as string);
//                   setSelectedPatient(appointment?.patientId || "");
//                   setSelectedDoctor(appointment?.doctorId || "");
//                 }}
//                 className="w-full"
//               >
//                 {(item) => (
//                   <AutocompleteItem key={item.id} textValue={item.label}>
//                     {item.label}
//                   </AutocompleteItem>
//                 )}
//               </Autocomplete>
//             </div>
//           )}

//            {/* Report Type Autocomplete */}
//            <div className="space-y-4">
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Report Type
//             </label>
//             <Autocomplete
//               variant="bordered"
//               color={TOOL_TIP_COLORS.secondary}
//               labelPlacement="outside"
//               placeholder="Select Report Type"
//               defaultItems={reportTypeItems}
//               selectedKey={reportType || ""}
//               onSelectionChange={(key) => setReportType(key as string)}
//               className="w-full"
//             >
//               {(item) => (
//                 <AutocompleteItem key={item.id} textValue={item.label}>
//                   {item.label}
//                 </AutocompleteItem>
//               )}
//             </Autocomplete>
//           </div>

//         </div>


//         {/* Patient and Doctor Autocompletes */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Patient Autocomplete */}
//           <div>
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Select Patient
//             </label>
//             <Autocomplete
//               variant="bordered"
//               color={TOOL_TIP_COLORS.secondary}
//               labelPlacement="outside"
//               placeholder="Select Patient"
//               defaultItems={patientItems}
//               selectedKey={selectedPatient || ""}
//               onSelectionChange={(key) => setSelectedPatient(key as string)}
//               className="w-full"
//             >
//               {(item) => (
//                 <AutocompleteItem key={item.id} textValue={item.label}>
//                   {item.label}
//                 </AutocompleteItem>
//               )}
//             </Autocomplete>
//           </div>

//           {/* Doctor Autocomplete */}
//           <div>
//             <label className="block text-sm font-medium text-dark dark:text-white">
//               Select Doctor
//             </label>
//             <Autocomplete
//               variant="bordered"
//               color={TOOL_TIP_COLORS.secondary}
//               labelPlacement="outside"
//               placeholder="Select Doctor"
//               defaultItems={doctorItems}
//               selectedKey={selectedDoctor || ""}
//               onSelectionChange={(key) => setSelectedDoctor(key as string)}
//               className="w-full"
//             >
//               {(item) => (
//                 <AutocompleteItem key={item.id} textValue={item.label}>
//                   {item.label}
//                 </AutocompleteItem>
//               )}
//             </Autocomplete>
//           </div>
//         </div>


//         <div>
//           {/* <label className="block text-sm font-medium text-dark dark:text-white">Observations</label> */}
//           <Textarea
//             value={observations}
//             color={TOOL_TIP_COLORS.secondary}
//             labelPlacement="outside"
//             variant="bordered"
//             label="Observations"
//             isInvalid={false}
//             onChange={(e) => setObservations(e.target.value)}
//             placeholder="Enter observations..."
//             errorMessage="The address should be at max 255 characters long."
//             className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"

//           />
//         </div>

//         <div>
//           {/* <label className="block text-sm font-medium text-dark dark:text-white">Additional Notes</label> */}
//           <Textarea
//             value={additionalNotes}
//             color={TOOL_TIP_COLORS.secondary}
//             labelPlacement="outside"
//             variant="bordered"
//             label="Additional Notes"
//             isInvalid={false}
//             onChange={(e) => setAdditionalNotes(e.target.value)}
//             placeholder="Enter additional notes (Optional)"
//             errorMessage="The address should be at max 255 characters long."
//             className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>

// <div>
//   <label className="block text-sm font-medium text-dark dark:text-white">Medications</label>
//   {medications.map((med, index) => (
//     <div key={index} className="grid grid-cols-12 gap-4 items-center mt-2">
//       <div className="col-span-3">
//         <Autocomplete
//           variant="bordered"
//           color={TOOL_TIP_COLORS.secondary}
//           labelPlacement="outside"
//           label="Time"
//           placeholder="Select Time"
//           defaultItems={times.map(time => ({ value: time, label: time }))}
//           selectedKey={med.time}
//           onSelectionChange={(key) => updateMedication(index, "time", key as string)}
//           // className="mt-6"
//         >
//           {(item) => (
//             <AutocompleteItem 
//               key={item.value}
//               variant="shadow"
//               color={TOOL_TIP_COLORS.secondary}
//             >
//               {item.label}
//             </AutocompleteItem>
//           )}
//         </Autocomplete>
//       </div>

//       <Input
//         type="text"
//         variant="bordered"
//         color={TOOL_TIP_COLORS.secondary}
//         label="Medication Name"
//         labelPlacement="outside"
//         placeholder="Enter medication name"
//         value={med.name}
//         onChange={(e) => updateMedication(index, "name", e.target.value)}
//         className="col-span-5 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//       />

//       <Input
//         type="text"
//         variant="bordered"
//         color={TOOL_TIP_COLORS.secondary}
//         label="Note"
//         labelPlacement="outside"
//         placeholder="Note (optional)"
//         value={med.note}
//         onChange={(e) => updateMedication(index, "note", e.target.value)}
//         className="col-span-4 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//       />
//     </div>
//   ))}
//   <Button onPress={addMedication} className="mt-4 " color={TOOL_TIP_COLORS.secondary}>
//     + Add Medication
//   </Button>
// </div>

//         <div className="flex items-center space-x-4">
//           <Checkbox

//             color={TOOL_TIP_COLORS.secondary}
//             isSelected={enableSharingWithPatient}
//             onValueChange={setEnableSharingWithPatient}
//             classNames={{
//               base: "rounded-[7px]",
//               wrapper: "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
//               label: "text-sm font-medium text-dark dark:text-white"
//             }}
//           >
//             Enable Sharing With Patient
//           </Checkbox>

//           <Checkbox
//             color={TOOL_TIP_COLORS.secondary}
//             isSelected={isSharedWithPatient}
//             onValueChange={setIsSharedWithPatient}
//             classNames={{
//               base: "rounded-[7px]",
//               wrapper: "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
//               label: "text-sm font-medium text-dark dark:text-white"
//             }}
//           // isDisabled={!enableSharingWithPatient}
//           >
//             Share With Patient
//           </Checkbox>
//         </div>


//         <div className="">
//           <label className="block text-sm font-medium text-dark dark:text-white">
//             Report Name
//           </label>
//           <Input
//             variant="bordered"
//             type="text"
//             // labelPlacement="outside"
//             // label=" Report Name"
//             color={TOOL_TIP_COLORS.secondary}
//             value={reportName}
//             onChange={(e) => setReportName(e.target.value)}
//             placeholder="Enter report name (e.g. Jetha Lal, Diabetes report, test 1)"
//             className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//           />
//         </div>


//         <div>
//           <label className="block text-sm font-medium text-dark dark:text-white">Follow-Up Required</label>
//           <RadioGroup
//             orientation="horizontal"
//             value={followUpRequired}
//             onChange={(event) => setFollowUpRequired(event.target.value as "yes" | "no")}
//             className="mt-1 text-dark dark:text-white"
//           >
//             <Radio value="yes" color={TOOL_TIP_COLORS.secondary} >Yes</Radio>
//             <Radio value="no" color={TOOL_TIP_COLORS.secondary}>No</Radio>
//           </RadioGroup>

//           {followUpRequired === "yes" && (
//             <div className="mt-4 space-y-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-dark dark:text-white">
//                     Follow-Up Date
//                   </label>
//                   <Input
//                     type="date"
//                     value={followUpDate}
//                     variant="bordered"
//                     color={TOOL_TIP_COLORS.secondary}
//                     onChange={(e) => setFollowUpDate(e.target.value)}
//                     className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-dark dark:text-white">
//                     Follow-Up Note
//                   </label>
//                   <Textarea
//                     variant="bordered"
//                     color={TOOL_TIP_COLORS.secondary}
//                     placeholder="Enter additional notes for follow-up..."
//                     className="w-full h-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <Button
//           color={TOOL_TIP_COLORS.secondary}
//           className={` w-full rounded-[7px] p-[10px] font-medium hover:bg-opacity-90   bg-purple-500 text-white   `}
//           onPress={openPreviewModal}

//         >
//           Preview Report
//         </Button>

//         <Modal
//           isOpen={isPreviewModalOpen}
//           onOpenChange={setIsPreviewModalOpen}
//           size="5xl"
//           scrollBehavior="inside"
//           className="max-h-[90vh] overflow-y-auto"
//         >
//           <ModalContent>
//             {(onClose) => (
//               <>
//                 <ModalHeader className="flex flex-col gap-1">
//                   <h1 className="text-2xl font-bold">Report Preview</h1>
//                 </ModalHeader>
//                 <ModalBody>
//                   <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">
//                     <div className="border-b pb-4">
//                       <h2 className="text-xl font-semibold">Report Details</h2>
//                       <div className="grid grid-cols-2 gap-4 mt-2">
//                         <div>
//                           <p className="text-sm text-gray-500">Report ID</p>
//                           <p className="font-medium">MED-2023-07-15-001</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Patient</p>
//                           <p className="font-medium">{selectedPatient || "N/A"}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Patient ID</p>
//                           <p className="font-medium">P-10042387</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Date Generated</p>
//                           <p className="font-medium">{new Date().toLocaleDateString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Report Type</p>
//                           <p className="font-medium">{reportType || "N/A"}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500">Attending Physician</p>
//                           <p className="font-medium">{selectedDoctor || "N/A"}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex space-x-4 border-b pb-4">
//                       <Button variant="light" className="text-blue-600">Full Preview</Button>
//                       <Button variant="light" className="text-blue-600">Edit Report</Button>
//                       <Button variant="light" className="text-blue-600">Share Report</Button>
//                     </div>

//                     <div>
//                       <h2 className="text-xl font-semibold mb-2">Medical Health Assessment</h2>
//                       <p className="italic mb-4">Comprehensive Check-up Report</p>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-medium mb-2">Patient Information</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-sm text-gray-500">Name</p>
//                             <p className="font-medium">{selectedPatient || "N/A"}</p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Age</p>
//                             <p className="font-medium">42 years</p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Gender</p>
//                             <p className="font-medium">Female</p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Date of Birth</p>
//                             <p className="font-medium">April 15, 1981</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-medium mb-2">Vital Signs</h3>
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full border">
//                             <thead>
//                               <tr className="bg-gray-100 dark:bg-gray-700">
//                                 <th className="border px-4 py-2">Blood Pressure</th>
//                                 <th className="border px-4 py-2">Heart Rate</th>
//                                 <th className="border px-4 py-2">Temperature</th>
//                                 <th className="border px-4 py-2">Respiratory Rate</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               <tr>
//                                 <td className="border px-4 py-2 text-center">120/80 mmHg</td>
//                                 <td className="border px-4 py-2 text-center">72 bpm</td>
//                                 <td className="border px-4 py-2 text-center">98.6 °F</td>
//                                 <td className="border px-4 py-2 text-center">16 rpm</td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-medium mb-2">Observations</h3>
//                         <p className="whitespace-pre-line">
//                           {observations || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
//                         </p>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
//                         <p className="whitespace-pre-line">
//                           {additionalNotes || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
//                         </p>
//                       </div>

//                       {medications.length > 0 && (
//                         <div className="mb-6">
//                           <h3 className="text-lg font-medium mb-2">Prescribed Medications</h3>
//                           <ul className="list-disc pl-5 space-y-1">
//                             {medications.map((med, index) => (
//                               <li key={index}>
//                                 <strong>{med.name || "Unnamed medication"}</strong> ({med.time || "No time specified"}) - {med.note || "No notes"}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       <div className="flex justify-between items-center border-t pt-4">
//                         <span className="text-sm italic">Report prepared by: {selectedDoctor || "N/A"}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </ModalBody>
//                 <ModalFooter>
//                   <Button color="primary" onPress={onClose}>
//                     Close
//                   </Button>
//                   <Button color={TOOL_TIP_COLORS.secondary} className={`rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white   `}>
//                     Save and Generate Report
//                   </Button>
//                 </ModalFooter>
//               </>
//             )}
//           </ModalContent>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default AppointmentForm;

"use client";

import {
  Button,
  Input,
  Textarea,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  RadioGroup,
  Radio,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Spinner,
  Checkbox,
  Autocomplete,
  AutocompleteItem
} from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { GLOBAL_TAB_NAVIGATOR_ACTIVE, TOOL_TIP_COLORS } from "@/constants";
interface Appointment {
  id: string;
  name: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  dateTime: string;
  startDateTime: string;
  endDateTime: string;
  json: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  dob: string;
  age: number;
  gender: string;
  address: string;
}

interface Doctor {
  id: string;
  name: string;
}

const BASE_URL = "http://127.0.0.1:3037/DocPOC/v1";

const AppointmentForm = () => {
  // Form state (unchanged)
  const [reportName, setReportName] = useState("");
  const [enableSharingWithPatient, setEnableSharingWithPatient] = useState(true);
  const [isSharedWithPatient, setIsSharedWithPatient] = useState(true);
  const [appointmentMode, setAppointmentMode] = useState<"appointment" | "manual">("appointment");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [observations, setObservations] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [medications, setMedications] = useState<{ time: string; name: string; note: string }[]>([]);
  const [followUpRequired, setFollowUpRequired] = useState<"yes" | "no">("no");
  const [followUpDate, setFollowUpDate] = useState<string>("");
  const [followUpNotes, setFollowUpNotes] = useState<string>("");
  const [reportType, setReportType] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vital Signs state (unchanged)
  const [vitals, setVitals] = useState({
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6 °F",
    respiratoryRate: "16 rpm"
  });

  // Patient details state (unchanged)
  const [patientDetails, setPatientDetails] = useState<Patient>({
    id: "",
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    dob: "",
    age: 0,
    gender: "",
    address: ""
  });

  // Data fetching state (unchanged)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [patientPage, setPatientPage] = useState(1);
  const [doctorPage, setDoctorPage] = useState(1);
  const [hasMoreAppointments, setHasMoreAppointments] = useState(true);
  const [hasMorePatients, setHasMorePatients] = useState(true);
  const [hasMoreDoctors, setHasMoreDoctors] = useState(true);

  // Constants (unchanged)
  const times = ["Morning", "Afternoon", "Evening", "Night"];
  const reportTypes = ["Normal", "Serious", "Critical"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];

  const getAuthToken = () => {
    return localStorage.getItem("docPocAuth_token") || "";
  };

  // Data fetching functions (unchanged)
  const fetchAppointments = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
      const response = await fetch(
        `${BASE_URL}/appointment/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      if (page === 1) {
        setAppointments(data.rows);
      } else {
        setAppointments((prev) => [...prev, ...data.rows]);
      }
      setHasMoreAppointments(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPatients = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
      const response = await fetch(
        `${BASE_URL}/patient/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      if (page === 1) {
        setPatients(data.rows);
      } else {
        setPatients((prev) => [...prev, ...data.rows]);
      }
      setHasMorePatients(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add this new function to fetch patient details by ID
  const fetchPatientDetails = useCallback(async (patientId: string) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `${BASE_URL}/patient/${patientId}`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient details");
      }

      const data = await response.json();
      setPatientDetails(data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the patient selection handler
  const handlePatientSelect = async (patientId: string) => {
    setSelectedPatient(patientId);
    await fetchPatientDetails(patientId);
  };

  const fetchDoctors = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = "6f65293d-e932-4372-a60e-880d8f05f430";
      const response = await fetch(
        `${BASE_URL}/user/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      if (page === 1) {
        setDoctors(data.rows);
      } else {
        setDoctors((prev) => [...prev, ...data.rows]);
      }
      setHasMoreDoctors(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(1);
    fetchPatients(1);
    fetchDoctors(1);
  }, [fetchAppointments, fetchPatients, fetchDoctors]);

  // Form handlers (unchanged)
  const addMedication = () => {
    setMedications([...medications, { time: "", name: "", note: "" }]);
  };

  const updateMedication = (index: number, field: "time" | "name" | "note", value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const handleVitalsChange = (field: keyof typeof vitals, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const openPreviewModal = async () => {
    if (selectedPatient) {
      await fetchPatientDetails(selectedPatient);
    }
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  // Data for dropdowns/autocomplete (unchanged)
  const appointmentItems = appointments.map(appointment => ({
    id: appointment.id,
    label: `${appointment.name} with ${appointment.doctorName} on ${new Date(appointment.dateTime).toLocaleDateString()}`
  }));

  const patientItems = patients.map(patient => ({
    id: patient.id,
    label: patient.name
  }));

  const doctorItems = doctors.map(doctor => ({
    id: doctor.id,
    label: doctor.name
  }));

  const reportTypeItems = reportTypes.map(type => ({
    id: type,
    label: type
  }));

  const timeItems = times.map(time => ({
    id: time,
    label: time
  }));

  const bloodGroupItems = bloodGroups.map(group => ({
    id: group,
    label: group
  }));

  const genderItems = genders.map(gender => ({
    id: gender,
    label: gender
  }));

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? dateString 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
        const header = document.querySelector("header");
        if (isPreviewModalOpen) {
          header?.classList.remove("z-999");
          header?.classList.add("z-0");
        } else {
          header?.classList.remove("z-0");
          header?.classList.add("z-999");
        }
      }, [isPreviewModalOpen]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100 dark:bg-gray-dark text-black dark:text-white">
      <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-4 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">Appointment Report Form</h1>

        {/* Mode selection - made responsive */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
          <Button
             style={{
              margin: 5,
              backgroundColor:
              appointmentMode === "appointment" ? GLOBAL_TAB_NAVIGATOR_ACTIVE : "",
            }}
            className={`rounded-[7px] py-2 px-4 ${appointmentMode === "appointment"
              ? ""
              : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              
            onPress={() => setAppointmentMode("appointment")}
          >
            Generate Using Appointment
          </Button>
          <Button
           style={{
            margin: 5,
            backgroundColor:
            appointmentMode === "manual" ? GLOBAL_TAB_NAVIGATOR_ACTIVE : "",
          }}
            className={`rounded-[7px] py-2 px-4 ${appointmentMode === "manual"
              ? ""
              : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
               
            onPress={() => setAppointmentMode("manual")}
          >
            Manual Report
          </Button>
        </div>

        {/* Form fields - made responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointmentMode === "appointment" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-dark dark:text-white">
                Select Appointment
              </label>
              <Autocomplete
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                labelPlacement="outside"
                placeholder="Select Appointment"
                defaultItems={appointmentItems}
                selectedKey={selectedAppointment || ""}
                onSelectionChange={async (key) => {
                  const appointment = appointments.find(a => a.id === key);
                  if (appointment) {
                    setSelectedAppointment(key as string);
                    setSelectedPatient(appointment.patientId);
                    setSelectedDoctor(appointment.doctorId);
                    await fetchPatientDetails(appointment.patientId);
                  }
                }}
                className="w-full"
              >
                {(item) => (
                  <AutocompleteItem key={item.id} textValue={item.label}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          )}

          {/* Report Type Autocomplete */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-dark dark:text-white">
              Report Type
            </label>
            <Autocomplete
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              labelPlacement="outside"
              placeholder="Select Report Type"
              defaultItems={reportTypeItems}
              selectedKey={reportType || ""}
              onSelectionChange={(key) => setReportType(key as string)}
              className="w-full"
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.label}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        {/* Patient and Doctor Autocompletes - made responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Patient
            </label>
            <Autocomplete
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              labelPlacement="outside"
              placeholder="Select Patient"
              defaultItems={patientItems}
              selectedKey={selectedPatient || ""}
              onSelectionChange={(key) => handlePatientSelect(key as string)}
              className="w-full"
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.label}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          {/* Doctor Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Doctor
            </label>
            <Autocomplete
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              labelPlacement="outside"
              placeholder="Select Doctor"
              defaultItems={doctorItems}
              selectedKey={selectedDoctor || ""}
              onSelectionChange={(key) => setSelectedDoctor(key as string)}
              className="w-full"
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.label}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        {/* Vital Signs Section - made responsive */}
        <div className="border border-stroke dark:border-dark-3 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Vital Signs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Blood Pressure"
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              value={vitals.bloodPressure}
              onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)}
              placeholder="e.g. 120/80 mmHg"
              className="w-full"
            />
            <Input
              label="Heart Rate"
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              value={vitals.heartRate}
              onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
              placeholder="e.g. 72 bpm"
              className="w-full"
            />
            <Input
              label="Temperature"
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              value={vitals.temperature}
              onChange={(e) => handleVitalsChange("temperature", e.target.value)}
              placeholder="e.g. 98.6 °F"
              className="w-full"
            />
            <Input
              label="Respiratory Rate"
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              value={vitals.respiratoryRate}
              onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)}
              placeholder="e.g. 16 rpm"
              className="w-full"
            />
          </div>
        </div>

        {/* Observations and Notes - made responsive */}
        <div>
          <Textarea
            value={observations}
            color={TOOL_TIP_COLORS.secondary}
            labelPlacement="outside"
            variant="bordered"
            label="Observations"
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Enter observations..."
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        <div>
          <Textarea
            value={additionalNotes}
            color={TOOL_TIP_COLORS.secondary}
            labelPlacement="outside"
            variant="bordered"
            label="Additional Notes"
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter additional notes (Optional)"
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Medications - made responsive */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">Medications</label>
          {medications.map((med, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center mt-2">
              <div className="sm:col-span-3">
                <Autocomplete
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  label="Time"
                  placeholder="Select Time"
                  defaultItems={timeItems}
                  selectedKey={med.time}
                  onSelectionChange={(key) => updateMedication(index, "time", key as string)}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              <div className="sm:col-span-5">
                <Input
                  type="text"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Medication Name"
                  labelPlacement="outside"
                  placeholder="Enter medication name"
                  value={med.name}
                  onChange={(e) => updateMedication(index, "name", e.target.value)}
                  className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  type="text"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Note"
                  labelPlacement="outside"
                  placeholder="Note (optional)"
                  value={med.note}
                  onChange={(e) => updateMedication(index, "note", e.target.value)}
                  className="w-full  rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>
            </div>
          ))}
          <Button onPress={addMedication} className="mt-4" color={TOOL_TIP_COLORS.secondary}>
            + Add Medication
          </Button>
        </div>

        {/* Sharing options - made responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Checkbox
            color={TOOL_TIP_COLORS.secondary}
            isSelected={enableSharingWithPatient}
            onValueChange={setEnableSharingWithPatient}
            classNames={{
              base: "rounded-[7px]",
              wrapper: "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
              label: "text-sm font-medium text-dark dark:text-white"
            }}
          >
            Enable Sharing With Patient
          </Checkbox>

          <Checkbox
            color={TOOL_TIP_COLORS.secondary}
            isSelected={isSharedWithPatient}
            onValueChange={setIsSharedWithPatient}
            classNames={{
              base: "rounded-[7px]",
              wrapper: "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
              label: "text-sm font-medium text-dark dark:text-white"
            }}
          >
            Share With Patient
          </Checkbox>
        </div>

        {/* Report Name - made responsive */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">
            Report Name
          </label>
          <Input
            variant="bordered"
            type="text"
            color={TOOL_TIP_COLORS.secondary}
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name (e.g. Jetha Lal, Diabetes report, test 1)"
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Follow-up section - made responsive */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">Follow-Up Required</label>
          <RadioGroup
            orientation="horizontal"
            value={followUpRequired}
            onChange={(event) => setFollowUpRequired(event.target.value as "yes" | "no")}
            className="mt-1 text-dark dark:text-white"
          >
            <Radio value="yes" color={TOOL_TIP_COLORS.secondary}>Yes</Radio>
            <Radio value="no" color={TOOL_TIP_COLORS.secondary}>No</Radio>
          </RadioGroup>

          {followUpRequired === "yes" && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Follow-Up Date
                  </label>
                  <Input
                    type="date"
                    value={followUpDate}
                    variant="bordered"
                    color={TOOL_TIP_COLORS.secondary}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-dark dark:text-white">
                    Follow-Up Note
                  </label>
                  <Textarea
                    variant="bordered"
                    color={TOOL_TIP_COLORS.secondary}
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Enter additional notes for follow-up..."
                    className="w-full h-6 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview button - made responsive */}
        <Button
          color={TOOL_TIP_COLORS.secondary}
          className="w-full rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white"
          onPress={openPreviewModal}
        >
          Preview Report
        </Button>

        {/* Preview Modal - made responsive */}
        <Modal
          isOpen={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          size="5xl"
          scrollBehavior="inside"
          className="max-h-[90vh] overflow-y-auto"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h1 className="text-xl md:text-2xl font-bold">Report Preview</h1>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="border-b pb-4">
                      <h2 className="text-lg md:text-xl font-semibold">Report Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Report ID</p>
                          <p className="font-medium">MED-{new Date().getFullYear()}-{(new Date().getMonth() + 1).toString().padStart(2, '0')}-{new Date().getDate().toString().padStart(2, '0')}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient</p>
                          <p className="font-medium">{patientDetails.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient ID</p>
                          <p className="font-medium">{patientDetails.id ? `${patientDetails.id}` : "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date Generated</p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Report Type</p>
                          <p className="font-medium">{reportType || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Attending Physician</p>
                          <p className="font-medium">{selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.name || "N/A" : "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold mb-2">Medical Health Assessment</h2>
                      <p className="italic mb-4">Comprehensive Check-up Report</p>

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Patient Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{patientDetails.name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">{patientDetails.age ?? "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{patientDetails.gender || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Blood Group</p>
                            <p className="font-medium">{patientDetails.bloodGroup || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium">{formatDate(patientDetails.dob)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{patientDetails.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{patientDetails.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{patientDetails.address || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Vital Signs</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">Blood Pressure</th>
                                <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">Heart Rate</th>
                                <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">Temperature</th>
                                <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">Respiratory Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">{vitals.bloodPressure}</td>
                                <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">{vitals.heartRate}</td>
                                <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">{vitals.temperature}</td>
                                <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">{vitals.respiratoryRate}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Observations</h3>
                        <p className="whitespace-pre-line text-sm md:text-base">
                          {observations || "No observations provided"}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Additional Notes</h3>
                        <p className="whitespace-pre-line text-sm md:text-base">
                          {additionalNotes || "No additional notes provided"}
                        </p>
                      </div>

                      {medications.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base md:text-lg font-medium mb-2">Prescribed Medications</h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                            {medications.map((med, index) => (
                              <li key={index}>
                                <strong>{med.name || "Unnamed medication"}</strong> ({med.time || "No time specified"}) - {med.note || "No notes"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {followUpRequired === "yes" && (
                        <div className="mb-6">
                          <h3 className="text-base md:text-lg font-medium mb-2">Follow-Up Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Follow-Up Date</p>
                              <p className="font-medium">{followUpDate || "Not specified"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Follow-Up Notes</p>
                              <p className="font-medium">{followUpNotes || "No notes provided"}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t pt-4">
                        <span className="text-sm italic">Report prepared by: {selectedDoctor ? doctors.find(d => d.id === selectedDoctor)?.name || "N/A" : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button 
                    color={TOOL_TIP_COLORS.secondary} 
                    className="order-2 sm:order-1 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                  >
                    Save and Generate Report
                  </Button>
                  <Button 
                    color={TOOL_TIP_COLORS.secondary} 
                    variant="light" 
                    onPress={onClose}
                    className="order-1 sm:order-2 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                  >
                    Continue Editing
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default AppointmentForm;
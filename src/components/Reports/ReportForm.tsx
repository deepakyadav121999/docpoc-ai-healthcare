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
} from "@nextui-org/react";
import { useState, useEffect } from "react";

const AppointmentForm = () => {
  const [appointmentMode, setAppointmentMode] = useState<"appointment" | "manual">("appointment");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [observations, setObservations] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [medications, setMedications] = useState<{ time: string; name: string; note: string }[]>([]);
  const [followUpRequired, setFollowUpRequired] = useState<"yes" | "no">("no");
  const [followUpDate, setFollowUpDate] = useState<string>("");
  const [reportType, setReportType] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const appointments = [
    { id: "1", patientName: "Sarah Johnson", doctorName: "Dr. Smith", date: "2025-04-10" },
    { id: "2", patientName: "John Doe", doctorName: "Dr. Taylor", date: "2025-04-12" },
  ];

  const patients = ["Sarah Johnson", "John Doe", "Michael Lee"];
  const doctors = ["Dr. Smith", "Dr. Taylor", "Dr. Williams"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];
  const reportTypes = ["Normal", "Serious", "Critical"];

  const addMedication = () => {
    setMedications([...medications, { time: "", name: "", note: "" }]);
  };

  const updateMedication = (index: number, field: "time" | "name" | "note", value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

useEffect(() => {
    const header = document.querySelector("header");
    if (isPreviewModalOpen) {
      header?.classList.remove("z-999");
      header?.classList.add("z-0");
    }
    // else if(isNotificationOpen) {
    //     header?.classList.remove("z-999");
    //   header?.classList.add("z-0");
    // }
    else {
      header?.classList.remove("z-0");
      header?.classList.add("z-999");
    }
  }, [isPreviewModalOpen]);

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-dark text-black dark:text-white">
      <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-8 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-dark dark:text-white">Appointment Report Form</h1>

        {/* Mode Selection */}
        <div className="flex space-x-4 justify-center">
          <Button
            className={`rounded-[7px] py-2 px-4 ${
              appointmentMode === "appointment"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onPress={() => setAppointmentMode("appointment")}
          >
            Generate Using Appointment
          </Button>
          <Button
            className={`rounded-[7px] py-2 px-4 ${
              appointmentMode === "manual"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onPress={() => setAppointmentMode("manual")}
          >
            Manual Report
          </Button>
        </div>

        {/* Appointment Mode */}
        {appointmentMode === "appointment" && (
          <div className="space-y-4">
            {/* Select Appointment */}
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Appointment
            </label>
            <Dropdown>
              <DropdownTrigger>
                <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
                  {selectedAppointment
                    ? `Appointment ID: ${selectedAppointment}`
                    : "Select Appointment"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => {
                  const appointment = appointments.find((a) => a.id === key);
                  setSelectedAppointment(key as string);
                  setSelectedPatient(appointment?.patientName || "");
                  setSelectedDoctor(appointment?.doctorName || "");
                }}
              >
                {appointments.map((appointment) => (
                  <DropdownItem key={appointment.id}>
                    {appointment.patientName} with {appointment.doctorName} on {appointment.date}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}


{/* Report Type Dropdown */}
<div>
  <label className="block text-sm font-medium text-dark dark:text-white">Report Type</label>
  <Dropdown>
    <DropdownTrigger>
      <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
        {reportType || "Select Report Type"}
      </Button>
    </DropdownTrigger>
    <DropdownMenu
      onAction={(key) => setReportType(key as string)}
      className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3 w-full"
      style={{
        minWidth: "100%", // Ensures the menu matches the button width
        left: "0", // Aligns dropdown with the button
      }}
    >
      {reportTypes.map((type) => (
        <DropdownItem
          key={type}
          className="w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {type}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
</div>

        {/* Patient and Doctor Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Patient */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Patient
            </label>
            <Dropdown>
              <DropdownTrigger>
                <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
                  {selectedPatient || "Select Patient"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSelectedPatient(key as string)}
                className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
              >
                {patients.map((patient) => (
                  <DropdownItem key={patient}>{patient}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Select Doctor */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Doctor
            </label>
            <Dropdown>
              <DropdownTrigger>
                <Button className="w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
                  {selectedDoctor || "Select Doctor"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSelectedDoctor(key as string)}
                className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
              >
                {doctors.map((doctor) => (
                  <DropdownItem key={doctor}>{doctor}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">Observations</label>
          <Textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Enter observations..."
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">Additional Notes</label>
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter additional notes..."
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Medications */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">Medications</label>
          {medications.map((med, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center mt-2">
              {/* Time Dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button className="col-span-3 w-full rounded-[7px] bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700">
                    {med.time || "Select Time"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => updateMedication(index, "time", key as string)}
                  className="rounded-[7px] border border-stroke bg-white dark:bg-gray-dark dark:border-dark-3"
                >
                  {times.map((time) => (
                    <DropdownItem key={time}>{time}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Medication Name */}
              <Input
                type="text"
                placeholder="Medication Name"
                value={med.name}
                onChange={(e) => updateMedication(index, "name", e.target.value)}
                className="col-span-5 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
              />

              {/* Optional Note */}
              <Input
                type="text"
                placeholder="Note (optional)"
                value={med.note}
                onChange={(e) => updateMedication(index, "note", e.target.value)}
                className="col-span-4 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
              />
            </div>
          ))}
          <Button onPress={addMedication} className="mt-4 text-indigo-600">
            + Add Medication
          </Button>
        </div>

        


      {/* Follow-Up */}
{/* Follow-Up */}
<div>
  <label className="block text-sm font-medium text-dark dark:text-white">Follow-Up Required</label>
  <RadioGroup
    orientation="horizontal"
    value={followUpRequired}
    onChange={(event) => setFollowUpRequired(event.target.value as "yes" | "no")}
    className="mt-1 text-dark dark:text-white"
  >
    <Radio value="yes">Yes</Radio>
    <Radio value="no">No</Radio>
  </RadioGroup>

  {/* Conditionally render Date and Note fields when "Yes" is selected */}
  {followUpRequired === "yes" && (
    <div className="mt-4 space-y-4">
      {/* Flex Container for Date and Note */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Date Field */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-dark dark:text-white">
            Follow-Up Date
          </label>
          <Input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Note Field */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-dark dark:text-white">
            Follow-Up Note
          </label>
          <Textarea
            placeholder="Enter additional notes for follow-up..."
            className="w-full h-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>
      </div>
    </div>
  )}
</div>



        {/* Preview Button */}
        <Button
          className="w-full rounded-[7px] bg-indigo-600 text-white hover:bg-indigo-700"
          onPress={openPreviewModal}
        >
          Preview Report
        </Button>

     
        {/* Preview Modal */}
<Modal 
  isOpen={isPreviewModalOpen} 
  onOpenChange={setIsPreviewModalOpen}
  size="5xl" // Makes the modal larger
  scrollBehavior="inside" 
  className="max-h-[90vh] overflow-y-auto"
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Report Preview</h1>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">
            {/* Report Header */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold">Report Details</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Report ID</p>
                  <p className="font-medium">MED-2023-07-15-001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium">{selectedPatient || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="font-medium">P-10042387</p>
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
                  <p className="font-medium">{selectedDoctor || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 border-b pb-4">
              <Button variant="light" className="text-blue-600">Full Preview</Button>
              {/* <Button variant="light" className="text-blue-600">Download Report</Button> */}
              <Button variant="light" className="text-blue-600">Edit Report</Button>
              <Button variant="light" className="text-blue-600">Share Report</Button>
            </div>

            {/* Medical Assessment */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Medical Health Assessment</h2>
              <p className="italic mb-4">Comprehensive Check-up Report</p>

              {/* Patient Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedPatient || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">42 years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">Female</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">April 15, 1981</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Vital Signs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border px-4 py-2">Blood Pressure</th>
                        <th className="border px-4 py-2">Heart Rate</th>
                        <th className="border px-4 py-2">Temperature</th>
                        <th className="border px-4 py-2">Respiratory Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2 text-center">120/80 mmHg</td>
                        <td className="border px-4 py-2 text-center">72 bpm</td>
                        <td className="border px-4 py-2 text-center">98.6 °F</td>
                        <td className="border px-4 py-2 text-center">16 rpm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinical Findings */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {/* Clinical Findings */}
                  Observations
                  </h3>
                <p className="whitespace-pre-line">
                  {observations || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
                </p>
              </div>


              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                 Additional Notes
                  </h3>
                <p className="whitespace-pre-line">
                  {additionalNotes || "Patient presents with occasional headaches and mild fatigue. Physical examination reveals normal cardiovascular, respiratory, and neurological functions. No significant abnormalities detected during the examination."}
                </p>
              </div>

              {/* Medications */}
              {medications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Prescribed Medications</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {medications.map((med, index) => (
                      <li key={index}>
                        <strong>{med.name || "Unnamed medication"}</strong> ({med.time || "No time specified"}) - {med.note || "No notes"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center border-t pt-4">
                {/* <span className="text-sm text-gray-500">( Page 1 of 3 )</span> */}
                <span className="text-sm italic">Report prepared by: {selectedDoctor || "N/A"}</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
          <Button color="success" className="text-white">
            Save and Generate Report
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


"use client";

import {
  Button,
  Input,
  Textarea,
  // Dropdown,
  // DropdownItem,
  // DropdownMenu,
  // DropdownTrigger,
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
  AutocompleteItem,
  useDisclosure,
  Switch,
} from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { GLOBAL_TAB_NAVIGATOR_ACTIVE, TOOL_TIP_COLORS } from "@/constants";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ShareLinkModal from "../common/Modal/ShareLinkModal";

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
interface Medication {
  time: string;
  name: string;
  note: string;
  quantity: number;
  days: number;
}

interface VitalSigns {
  bloodPressure: {
    systolic: string;
    diastolic: string;
    enabled: boolean;
  };
  heartRate: {
    value: string;
    enabled: boolean;
  };
  temperature: {
    value: string;
    enabled: boolean;
  };
  respiratoryRate: {
    value: string;
    enabled: boolean;
  };
}

const API_URL = process.env.API_URL;
// const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;
const BASE_URL = API_URL;

const AppointmentForm = () => {
  // Form state (unchanged)
  const profile = useSelector((state: RootState) => state.profile.data);

  // const [reportName, setReportName] = useState("");
  const [enableSharingWithPatient] = useState(true);
  const [isSharedWithPatient, setIsSharedWithPatient] = useState(true);
  const [appointmentMode, setAppointmentMode] = useState<
    "appointment" | "manual"
  >("appointment");
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null,
  );
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [observations, setObservations] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  // const [medications, setMedications] = useState<{ time: string; name: string; note: string }[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [followUpRequired, setFollowUpRequired] = useState<"yes" | "no">("no");
  const [followUpDate, setFollowUpDate] = useState<string>("");
  const [followUpNotes, setFollowUpNotes] = useState<string>("");
  // const [reportType, setReportType] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveReportLoading, setSaveReportLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const [shareLink, setShareLink] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: { systolic: "0", diastolic: "0", enabled: false },
    heartRate: { value: "0", enabled: false },
    temperature: { value: "0.0", enabled: false },
    respiratoryRate: { value: "0", enabled: false },
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
    address: "",
  });

  // Data fetching state (unchanged)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // Constants (unchanged)
  const times = ["Morning", "Afternoon", "Evening", "Night"];
  // const reportTypes = ["Normal", "Serious", "Critical"];
  // const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  // const genders = ["Male", "Female", "Other"];

  const CHARACTER_LIMITS = {
    followUpNotes: 70,
    medicationNote: 70,
  };

  const toggleVitalField = (field: keyof typeof vitals) => {
    setVitals((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        enabled: !prev[field].enabled,
        ...(field === "bloodPressure"
          ? {
              systolic: "0",
              diastolic: "0",
            }
          : {
              value: field === "temperature" ? "0.0" : "0",
            }),
      },
    }));
  };
  const handleVitalChange = (
    field: "heartRate" | "temperature" | "respiratoryRate",
    value: string,
  ) => {
    // Different validation for different fields
    let isValid = false;

    if (field === "temperature") {
      // Allow numbers with optional decimal point
      isValid = /^\d*\.?\d*$/.test(value);
    } else {
      // Only allow whole numbers
      isValid = /^\d*$/.test(value);
    }

    if (isValid) {
      setVitals((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
        },
      }));
    }
  };
  const handleBloodPressureChange = (
    part: "systolic" | "diastolic",
    value: string,
  ) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setVitals((prev) => ({
        ...prev,
        bloodPressure: {
          ...prev.bloodPressure,
          [part]: value,
        },
      }));
    }
  };

  const handleSaveReport = async () => {
    try {
      setIsLoading(true);
      setSaveReportLoading(true);
      const token = getAuthToken();

      if (!selectedPatient || !selectedDoctor) {
        setModalMessage({
          success: "",
          error: "Please select both patient and doctor",
        });
        onOpen();
        return;
      }
      const patient = patients.find((p) => p.id === selectedPatient);
      const doctor = doctors.find((d) => d.id === selectedDoctor);
      const branchId = profile?.branchId;
      const reportData = {
        name: "abc",
        patientId: selectedPatient,
        branchId: branchId,
        patient: {
          id: patient?.id,
          name: patient?.name,
          phone: patient?.phone,
          email: patient?.email,
          bloodGroup: patient?.bloodGroup,
          dob: patient?.dob,
          age: patient?.age,
          gender: patient?.gender,
          address: patient?.address,
        },
        doctor: {
          id: doctor?.id,
          name: doctor?.name,
        },
        appointmentId: selectedAppointment,
        reportType: "MEDICAL_REPORT",
        // name: reportName,
        // vitals,

        // vitals: {
        //   ...(vitals.bloodPressure.enabled && {
        //     bloodPressure: vitals.bloodPressure.value,
        //   }),
        //   ...(vitals.heartRate.enabled && {
        //     heartRate: vitals.heartRate.value,
        //   }),
        //   ...(vitals.temperature.enabled && {
        //     temperature: vitals.temperature.value,
        //   }),
        //   ...(vitals.respiratoryRate.enabled && {
        //     respiratoryRate: vitals.respiratoryRate.value,
        //   }),
        // },

        vitals: {
          ...(vitals.bloodPressure.enabled && {
            bloodPressure: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg`,
          }),
          ...(vitals.heartRate.enabled && {
            heartRate: `${vitals.heartRate.value} bpm`,
          }),
          ...(vitals.temperature.enabled && {
            temperature: `${vitals.temperature.value} °F`,
          }),
          ...(vitals.respiratoryRate.enabled && {
            respiratoryRate: `${vitals.respiratoryRate.value} rpm`,
          }),
        },

        observations,
        additionalNotes,
        medications: JSON.stringify(medications),
        followUpRequired,
        followUpDate: followUpRequired === "yes" ? followUpDate : undefined,
        followUpNotes: followUpRequired === "yes" ? followUpNotes : undefined,
        enableSharingWithPatient,
        isSharedWithPatient,
        reportDate: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const result = await response.json();

      const documentUrl = JSON.parse(result.documentUrl).url;

      window.open(documentUrl, "_blank");

      // setModalMessage({
      //   success: "Report saved successfully!",
      //   error: "",
      // });

      if (enableSharingWithPatient) {
        setShareLink(documentUrl);
        setIsShareModalOpen(true);
      } else {
        setModalMessage({
          success: "Report saved successfully!",
          error: "",
        });
        onOpen();
      }
      closePreviewModal();

      // onOpen();
      // closePreviewModal();
    } catch (error) {
      console.error("Error saving report:", error);
      setModalMessage({
        success: "",
        error: "Error saving report. Please try again.",
      });
      onOpen();
      // alert("Error saving report. Please try again.");
    } finally {
      setIsLoading(false);
      setSaveReportLoading(false);
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("docPocAuth_token") || "";
  };

  // Data fetching functions (unchanged)
  const fetchAppointments = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/appointment/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
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
      // setHasMoreAppointments(data.rows.length === 10);
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
      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/patient/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
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
      // setHasMorePatients(data.rows.length === 10);
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
      const response = await fetch(`${BASE_URL}/patient/${patientId}`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

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
      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/user/list/${branchId}?page=${page}&pageSize=10`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
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
      // setHasMoreDoctors(data.rows.length === 10);
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
  // const addMedication = () => {
  //   setMedications([...medications, { time: "", name: "", note: "" }]);
  // };

  const addMedication = () => {
    setMedications([
      ...medications,
      { time: "", name: "", note: "", quantity: 1, days: 1 },
    ]);
  };

  // const updateMedication = (index: number, field: "time" | "name" | "note", value: string) => {
  //   const updatedMedications = [...medications];
  //   updatedMedications[index][field] = value;
  //   setMedications(updatedMedications);
  // };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: Medication[keyof Medication],
  ) => {
    setMedications((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  // const handleVitalsChange = (field: keyof typeof vitals, value: string) => {
  //   setVitals(prev => ({ ...prev, [field]: value }));
  // };

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
  const appointmentItems = appointments.map((appointment) => ({
    id: appointment.id,
    label: `${appointment.name} with ${appointment.doctorName} on ${new Date(appointment.dateTime).toLocaleDateString()}`,
  }));

  const patientItems = patients.map((patient) => ({
    id: patient.id,
    label: patient.name,
  }));

  const doctorItems = doctors.map((doctor) => ({
    id: doctor.id,
    label: doctor.name,
  }));

  // const reportTypeItems = reportTypes.map((type) => ({
  //   id: type,
  //   label: type,
  // }));

  const timeItems = times.map((time) => ({
    id: time,
    label: time,
  }));

  // const bloodGroupItems = bloodGroups.map((group) => ({
  //   id: group,
  //   label: group,
  // }));

  // const genderItems = genders.map((gender) => ({
  //   id: gender,
  //   label: gender,
  // }));

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return dateString;
    }
  };

  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
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
    <div className="min-h-screen p-4 md:p-8  text-black dark:text-white ">
      <style jsx global>{`
        .nextui-input,
        .nextui-input-wrapper input,
        .nextui-textarea,
        .nextui-textarea-wrapper textarea,
        .nextui-select-wrapper select {
          font-size: 16px !important;
          touch-action: manipulation;
        }
        .nextui-time-input-input {
          font-size: 16px !important;
        }
        .nextui-autocomplete-input {
          font-size: 16px !important;
        }

        /* Disable text size adjustment */
        html {
          -webkit-text-size-adjust: 100%;
        }

        /* Container styles */
        .appointment-container {
          max-width: 100vw;
          overflow-x: hidden;
          padding: 0 1rem;
        }

        /* Form container */
        .form-card {
          border-radius: 15px;
          border: 1px solid var(--stroke-color);
          background: white;
          box-shadow: var(--shadow-1);
          max-width: 100%;
          overflow: hidden;
        }

        /* Input group styles */

        /* Time inputs container */
        .time-inputs-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Full width inputs */
        .full-width-input {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* NextUI component overrides */
        .nextui-input-wrapper,
        .nextui-autocomplete-wrapper,
        .nextui-time-input-wrapper {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* iOS specific fixes */
        @supports (-webkit-touch-callout: none) {
          input,
          textarea {
            -webkit-user-select: auto !important;
            font-size: 16px !important;
            min-height: auto !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-4 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
          Appointment Report Form
        </h1>

        {/* Mode selection - made responsive */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            style={{
              margin: 5,
              backgroundColor:
                appointmentMode === "appointment"
                  ? GLOBAL_TAB_NAVIGATOR_ACTIVE
                  : "",
            }}
            className={`rounded-[7px] py-2 px-4 ${
              appointmentMode === "appointment"
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
            className={`rounded-[7px] py-2 px-4 ${
              appointmentMode === "manual"
                ? ""
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onPress={() => setAppointmentMode("manual")}
          >
            Manual Report
          </Button>
        </div>

        {/* Form fields - made responsive */}
        <div className="grid grid-cols-1  gap-4">
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
                  const appointment = appointments.find((a) => a.id === key);
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
          {/* <div className="space-y-4">
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
          </div> */}
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
        {/* <div className="border border-stroke dark:border-dark-3 rounded-lg p-4">
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
        </div> */}

        {/* <div className="border border-stroke dark:border-dark-3 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Vital Signs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leave fields disabled to exclude from report
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={` border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.bloodPressure.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Blood Pressure</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.bloodPressure.enabled}
                  onValueChange={() => toggleVitalField("bloodPressure")}
                />
              </div>
              <Input
                label=""
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                value={vitals.bloodPressure.value}
                onChange={(e) =>
                  handleVitalsChange("bloodPressure", e.target.value)
                }
                placeholder="e.g. 120/80 mmHg"
                className="w-full"
                isDisabled={!vitals.bloodPressure.enabled}
              />
            </div>

            <div
              className={` border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.heartRate.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Heart Rate</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.heartRate.enabled}
                  onValueChange={() => toggleVitalField("heartRate")}
                />
              </div>
              <Input
                label=""
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                value={vitals.heartRate.value}
                onChange={(e) =>
                  handleVitalsChange("heartRate", e.target.value)
                }
                placeholder="e.g. 72 bpm"
                className="w-full"
                isDisabled={!vitals.heartRate.enabled}
              />
            </div>

            <div
              className={`border border-stroke dark:border-dark-3  p-3 rounded-lg ${vitals.temperature.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Temperature</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.temperature.enabled}
                  onValueChange={() => toggleVitalField("temperature")}
                />
              </div>
              <Input
                label=""
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                value={vitals.temperature.value}
                onChange={(e) =>
                  handleVitalsChange("temperature", e.target.value)
                }
                placeholder="e.g. 98.6 °F"
                className="w-full"
                isDisabled={!vitals.temperature.enabled}
              />
            </div>

            <div
              className={`border border-stroke dark:border-dark-3  p-3 rounded-lg ${vitals.respiratoryRate.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Respiratory Rate</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.respiratoryRate.enabled}
                  onValueChange={() => toggleVitalField("respiratoryRate")}
                />
              </div>
              <Input
                label=""
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                value={vitals.respiratoryRate.value}
                onChange={(e) =>
                  handleVitalsChange("respiratoryRate", e.target.value)
                }
                placeholder="e.g. 16 rpm"
                className="w-full"
                isDisabled={!vitals.respiratoryRate.enabled}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"></p>
        </div> */}

        {/* // Update the JSX for vital signs section */}
        <div className="border border-stroke dark:border-dark-3 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Vital Signs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leave fields disabled to exclude from report
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Pressure */}
            <div
              className={`border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.bloodPressure.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Blood Pressure</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.bloodPressure.enabled}
                  onValueChange={() => toggleVitalField("bloodPressure")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  label=""
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  value={vitals.bloodPressure.systolic}
                  onChange={(e) =>
                    handleBloodPressureChange("systolic", e.target.value)
                  }
                  placeholder="120"
                  className="w-20"
                  isDisabled={!vitals.bloodPressure.enabled}
                />
                <span>/</span>
                <Input
                  label=""
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  value={vitals.bloodPressure.diastolic}
                  onChange={(e) =>
                    handleBloodPressureChange("diastolic", e.target.value)
                  }
                  placeholder="80"
                  className="w-20"
                  isDisabled={!vitals.bloodPressure.enabled}
                />
                <span className="ml-2">mmHg</span>
              </div>
            </div>

            {/* Heart Rate */}
            <div
              className={`border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.heartRate.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Heart Rate</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.heartRate.enabled}
                  onValueChange={() => toggleVitalField("heartRate")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  label=""
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  value={vitals.heartRate.value}
                  onChange={(e) =>
                    handleVitalChange("heartRate", e.target.value)
                  }
                  placeholder="72"
                  className="w-20"
                  isDisabled={!vitals.heartRate.enabled}
                />
                <span>bpm</span>
              </div>
            </div>

            {/* Temperature */}
            <div
              className={`border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.temperature.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Temperature</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.temperature.enabled}
                  onValueChange={() => toggleVitalField("temperature")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  label=""
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  value={vitals.temperature.value}
                  onChange={(e) =>
                    handleVitalChange("temperature", e.target.value)
                  }
                  placeholder="98.6"
                  className="w-20"
                  isDisabled={!vitals.temperature.enabled}
                />
                <span>°F</span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div
              className={`border border-stroke dark:border-dark-3 p-3 rounded-lg ${vitals.respiratoryRate.enabled ? "" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Respiratory Rate</span>
                <Switch
                  size="sm"
                  color={TOOL_TIP_COLORS.secondary}
                  isSelected={vitals.respiratoryRate.enabled}
                  onValueChange={() => toggleVitalField("respiratoryRate")}
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  label=""
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  value={vitals.respiratoryRate.value}
                  onChange={(e) =>
                    handleVitalChange("respiratoryRate", e.target.value)
                  }
                  placeholder="16"
                  className="w-20"
                  isDisabled={!vitals.respiratoryRate.enabled}
                />
                <span>rpm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observations and Notes - made responsive  */}
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
        {/* <div>
          <label className="block text-sm font-medium text-dark dark:text-white">
            Medications
          </label>
          {medications.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center mt-2"
            >
              <div className="sm:col-span-2">
                <Autocomplete
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  label="Time"
                  placeholder="Select Time"
                  defaultItems={timeItems}
                  selectedKey={med.time}
                  onSelectionChange={(key) =>
                    updateMedication(index, "time", key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              <div className="sm:col-span-4">
                <Input
                  type="text"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Medication Name"
                  labelPlacement="outside"
                  placeholder="Enter medication name"
                  value={med.name}
                  onChange={(e) =>
                    updateMedication(index, "name", e.target.value)
                  }
                  className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>
           
              <div className="sm:col-span-2">
                <Input
                  type="number"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Quantity"
                  labelPlacement="outside"
                  value={med.quantity.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value;

                    // Allow empty input during typing
                    if (inputValue === "") {
                      updateMedication(index, "quantity", 0); // Temporary 0 (will validate on blur)
                      return;
                    }

                    const newValue = parseInt(inputValue);

                    // Only update if valid number and ≥1
                    if (!isNaN(newValue) && newValue >= 1) {
                      updateMedication(index, "quantity", newValue);
                    }
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (!target.value || parseInt(target.value) < 1) {
                      updateMedication(index, "quantity", 1);
                    }
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.select();
                  }}
                  min="1"
                  className="w-full"
                />
              </div>
           
              <div className="sm:col-span-1">
                <Input
                  type="number"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Days"
                  labelPlacement="outside"
                  value={med.days.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      updateMedication(index, "days", 0);
                      return;
                    }
                    const newValue = parseInt(inputValue);
                    if (!isNaN(newValue)) {
                      updateMedication(index, "days", Math.max(1, newValue));
                    }
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (!target.value || parseInt(target.value) < 1) {
                      updateMedication(index, "days", 1);
                    }
                  }}
                  min="1"
                  className="w-full"
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
                  // onChange={(e) => updateMedication(index, "note", e.target.value)}
                  onChange={(e) => {
                    if (
                      e.target.value.length <= CHARACTER_LIMITS.medicationNote
                    ) {
                      updateMedication(index, "note", e.target.value);
                    }
                  }}
                  maxLength={CHARACTER_LIMITS.medicationNote}
                  className="w-full  rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>
              <div className="sm:col-span-2 flex justify-center pt-6">
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  aria-label="Delete medication"
                  onClick={() => {
                    const updatedMedications = [...medications];
                    updatedMedications.splice(index, 1);
                    setMedications(updatedMedications);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
          <Button
            onPress={addMedication}
            className="mt-4"
            color={TOOL_TIP_COLORS.secondary}
          >
            + Add Medication
          </Button>
        </div> */}

        {/* Medications Section - Optimized Layout */}

        {/* Medications Section - Optimized Layout */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-dark dark:text-white">
            Medications
          </label>

          <div className="overflow-x-auto">
            {medications.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Medication Name</th>
                    <th className="pb-2 w-20">Quantity</th>
                    <th className="pb-2 w-20">Days</th>
                    <th className="pb-2">Note</th>
                    <th className="pb-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {medications.map((med, index) => (
                    <tr key={index} className="align-top">
                      {/* Time */}
                      <td className="pr-2 py-2">
                        <Autocomplete
                          variant="bordered"
                          color={TOOL_TIP_COLORS.secondary}
                          placeholder="Select"
                          defaultItems={timeItems}
                          selectedKey={med.time}
                          onSelectionChange={(key) =>
                            updateMedication(index, "time", key as string)
                          }
                          size="sm"
                          className="min-w-[100px]"
                        >
                          {(item) => (
                            <AutocompleteItem key={item.id}>
                              {item.label}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      </td>

                      {/* Medication Name */}
                      <td className="pr-2 py-2">
                        <Input
                          type="text"
                          variant="bordered"
                          color={TOOL_TIP_COLORS.secondary}
                          placeholder="Enter name"
                          value={med.name}
                          onChange={(e) =>
                            updateMedication(index, "name", e.target.value)
                          }
                          size="sm"
                        />
                      </td>

                      {/* Quantity */}
                      <td className="pr-2 py-2">
                        <Input
                          type="number"
                          variant="bordered"
                          color={TOOL_TIP_COLORS.secondary}
                          value={med.quantity.toString()}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= 0)
                              updateMedication(index, "quantity", val);
                          }}
                          min="1"
                          size="sm"
                          className="w-full"
                        />
                      </td>

                      {/* Days */}
                      <td className="pr-2 py-2">
                        <Input
                          type="number"
                          variant="bordered"
                          color={TOOL_TIP_COLORS.secondary}
                          value={med.days.toString()}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= 0) updateMedication(index, "days", val);
                          }}
                          min="1"
                          size="sm"
                          className="w-full"
                        />
                      </td>

                      {/* Note */}
                      <td className="pr-2 py-2">
                        <Input
                          type="text"
                          variant="bordered"
                          color={TOOL_TIP_COLORS.secondary}
                          placeholder="Note (optional)"
                          value={med.note}
                          onChange={(e) => {
                            if (
                              e.target.value.length <=
                              CHARACTER_LIMITS.medicationNote
                            ) {
                              updateMedication(index, "note", e.target.value);
                            }
                          }}
                          size="sm"
                        />
                      </td>

                      {/* Delete Button */}
                      <td className="py-2">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          aria-label="Delete medication"
                          size="sm"
                          onClick={() => {
                            const updated = [...medications];
                            updated.splice(index, 1);
                            setMedications(updated);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                No medications added yet
              </div>
            )}
          </div>

          <Button
            onPress={addMedication}
            className="mt-2"
            color={TOOL_TIP_COLORS.secondary}
            size="sm"
            startContent={<span>+</span>}
          >
            Add Medication
          </Button>
        </div>

        {/* Sharing options - made responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* <Checkbox
            color={TOOL_TIP_COLORS.secondary}
            isSelected={enableSharingWithPatient}
            onValueChange={setEnableSharingWithPatient}
            classNames={{
              base: "rounded-[7px]",
              wrapper:
                "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
              label: "text-sm font-medium text-dark dark:text-white",
            }}
          >
            Enable Sharing With Patient
          </Checkbox> */}

          <Checkbox
            color={TOOL_TIP_COLORS.secondary}
            isSelected={isSharedWithPatient}
            onValueChange={setIsSharedWithPatient}
            classNames={{
              base: "rounded-[7px]",
              wrapper:
                "rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3",
              label: "text-sm font-medium text-dark dark:text-white",
            }}
          >
            Share With Patient
          </Checkbox>
        </div>

        {/* Report Name - made responsive */}
        {/* <div>
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
        </div> */}

        {/* Follow-up section - made responsive */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">
            Follow-Up Required
          </label>
          <RadioGroup
            orientation="horizontal"
            value={followUpRequired}
            onChange={(event) =>
              setFollowUpRequired(event.target.value as "yes" | "no")
            }
            className="mt-1 text-dark dark:text-white"
          >
            <Radio value="yes" color={TOOL_TIP_COLORS.secondary}>
              Yes
            </Radio>
            <Radio value="no" color={TOOL_TIP_COLORS.secondary}>
              No
            </Radio>
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
                    // onChange={(e) => setFollowUpNotes(e.target.value)}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= CHARACTER_LIMITS.followUpNotes
                      ) {
                        setFollowUpNotes(e.target.value);
                      }
                    }}
                    placeholder="Enter additional notes for follow-up..."
                    className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                    minRows={3}
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
                  <h1 className="text-xl md:text-2xl font-bold">
                    Report Preview
                  </h1>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="border-b pb-4">
                      <h2 className="text-lg md:text-xl font-semibold">
                        Report Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Report ID</p>
                          <p className="font-medium">
                            MED-{new Date().getFullYear()}-
                            {(new Date().getMonth() + 1)
                              .toString()
                              .padStart(2, "0")}
                            -{new Date().getDate().toString().padStart(2, "0")}-
                            {Math.floor(Math.random() * 1000)
                              .toString()
                              .padStart(3, "0")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient</p>
                          <p className="font-medium">
                            {patientDetails.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient ID</p>
                          <p className="font-medium">
                            {patientDetails.id ? `${patientDetails.id}` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Date Generated
                          </p>
                          <p className="font-medium">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Report Type</p>
                          <p className="font-medium">{"N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Attending Physician
                          </p>
                          <p className="font-medium">
                            {selectedDoctor
                              ? doctors.find((d) => d.id === selectedDoctor)
                                  ?.name || "N/A"
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold mb-2">
                        Medical Health Assessment
                      </h2>
                      <p className="italic mb-4">
                        Comprehensive Check-up Report
                      </p>

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Patient Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">
                              {patientDetails.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">
                              {patientDetails.age ?? "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">
                              {patientDetails.gender || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Blood Group</p>
                            <p className="font-medium">
                              {patientDetails.bloodGroup || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of Birth
                            </p>
                            <p className="font-medium">
                              {formatDate(patientDetails.dob)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">
                              {patientDetails.phone || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              {patientDetails.email || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                              {patientDetails.address || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="mb-6">
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
                      </div> */}

                      {/* In the preview modal's vital signs section */}
                      {/* <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Vital Signs
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                {vitals.bloodPressure.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Blood Pressure
                                  </th>
                                )}
                                {vitals.heartRate.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Heart Rate
                                  </th>
                                )}
                                {vitals.temperature.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Temperature
                                  </th>
                                )}
                                {vitals.respiratoryRate.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Respiratory Rate
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {vitals.bloodPressure.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {vitals.bloodPressure.value}
                                  </td>
                                )}
                                {vitals.heartRate.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {vitals.heartRate.value}
                                  </td>
                                )}
                                {vitals.temperature.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {vitals.temperature.value}
                                  </td>
                                )}
                                {vitals.respiratoryRate.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {vitals.respiratoryRate.value}
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div> */}
                      {/* In the preview modal's vital signs section */}
                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Vital Signs
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                {vitals.bloodPressure.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Blood Pressure
                                  </th>
                                )}
                                {vitals.heartRate.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Heart Rate
                                  </th>
                                )}
                                {vitals.temperature.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Temperature
                                  </th>
                                )}
                                {vitals.respiratoryRate.enabled && (
                                  <th className="border px-2 py-1 md:px-4 md:py-2 text-sm md:text-base">
                                    Respiratory Rate
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {vitals.bloodPressure.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg`}
                                  </td>
                                )}
                                {vitals.heartRate.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {`${vitals.heartRate.value} bpm`}
                                  </td>
                                )}
                                {vitals.temperature.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {`${vitals.temperature.value} °F`}
                                  </td>
                                )}
                                {vitals.respiratoryRate.enabled && (
                                  <td className="border px-2 py-1 md:px-4 md:py-2 text-center text-sm md:text-base">
                                    {`${vitals.respiratoryRate.value} rpm`}
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Observations</h3>
                        <p className="whitespace-pre-line text-sm md:text-base">
                          {observations || "No observations provided"}
                        </p>
                      </div> */}

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Observations
                        </h3>
                        <div className="p-3   ">
                          <p className="whitespace-pre-line text-sm md:text-base break-words overflow-auto max-h-40">
                            {observations || "No observations provided"}
                          </p>
                        </div>
                      </div>

                      {/* <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">Additional Notes</h3>
                        <p className="whitespace-pre-line text-sm md:text-base">
                          {additionalNotes || "No additional notes provided"}
                        </p>
                      </div> */}

                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Additional Notes
                        </h3>
                        <div className="p-3">
                          <p className="whitespace-pre-line text-sm md:text-base break-words overflow-auto max-h-40">
                            {additionalNotes || "No additional notes provided"}
                          </p>
                        </div>
                      </div>

                      {medications.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base md:text-lg font-medium mb-2">
                            Prescribed Medications
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                            {medications.map((med, index) => (
                              // <li key={index}>
                              //   <strong>{med.name || "Unnamed medication"}</strong> ({med.time || "No time specified"}) - {med.note || "No notes"}
                              // </li>

                              <li key={index}>
                                <strong>
                                  {med.quantity} x{" "}
                                  {med.name || "Unnamed medication"}
                                </strong>{" "}
                                ({med.time || "No time specified"}) - {med.days}{" "}
                                day(s) - {med.note || "No notes"}
                                {/* {med.note || "No notes"} */}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {followUpRequired === "yes" && (
                        <div className="mb-6">
                          <h3 className="text-base md:text-lg font-medium mb-2">
                            Follow-Up Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Follow-Up Date
                              </p>
                              <p className="font-medium">
                                {followUpDate || "Not specified"}
                              </p>
                            </div>
                            {/* <div>
                              <p className="text-sm text-gray-500">Follow-Up Notes</p>
                              <p className="font-medium">{followUpNotes || "No notes provided"}</p>
                            </div> */}

                            <div>
                              <p className="text-sm text-gray-500">
                                Follow-Up Notes
                              </p>
                              <div className="p-3 ">
                                <p className="whitespace-pre-line text-sm md:text-base break-words">
                                  {followUpNotes || "No notes provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t pt-4">
                        <span className="text-sm italic">
                          Report prepared by:{" "}
                          {selectedDoctor
                            ? doctors.find((d) => d.id === selectedDoctor)
                                ?.name || "N/A"
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button
                    color={TOOL_TIP_COLORS.secondary}
                    className="order-2 sm:order-1 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                    onPress={handleSaveReport}
                  >
                    {`${saveReportLoading ? `Generating Report... ` : "Save and Generate Report"}`}
                    <p>
                      {saveReportLoading && <Spinner size="sm" color="white" />}
                    </p>
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

      <EnhancedModal
        isOpen={isOpen}
        loading={isLoading}
        modalMessage={modalMessage}
        onClose={handleModalClose}
      />
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        link={shareLink}
      />
    </div>
  );
};

export default AppointmentForm;

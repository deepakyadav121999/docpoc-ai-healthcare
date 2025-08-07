"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  // Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  TimeInput,
  useDisclosure,
} from "@nextui-org/react";
// Removed unused imports since we're using CustomAppointmentDatePicker
import CustomAppointmentDatePicker from "../CustomComponent/CustomAppointmentDatePicker";

import { useEffect, useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddNewPatient from "../Patient/AddNewPatient";

interface AutocompleteItem {
  value: string;
  label: string;
  description?: string;
  dob?: string;
  workingHours: string;
}
interface ModalMessage {
  success?: string;
  error?: string;
}
interface AddUsersProps {
  onUsersAdded: () => void;
  onClose?: () => void;
  onMessage: (message: ModalMessage) => void;
}
const API_URL = process.env.API_URL;
const AddAppointment: React.FC<AddUsersProps> = ({
  onUsersAdded,
  onClose,
  onMessage,
}) => {
  const profile = useSelector((state: RootState) => state.profile.data);

  // const [edit, setEdit] = useState(true);
  const edit = true;
  // const [patientList, setPatientList] = useState<AutocompleteItem[]>([]);
  const [patientList, setPatientList] = useState<AutocompleteItem[]>([
    {
      label: "Create New Patient...",
      value: "create-new-patient",
      description: "Click to add a new patient",
      dob: "",
      workingHours: "",
    },
  ]);
  const [doctorList, setDoctorList] = useState<AutocompleteItem[]>([]);
  const [appointmentTypeList, setAppointmentTypeList] = useState<
    AutocompleteItem[]
  >([]);
  const { isOpen, onOpen, onClose: internalClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const [appointmentStatusList, setAppointmentStatusList] = useState<
    AutocompleteItem[]
  >([]);
  const [savingData, setSavingData] = useState(false);
  // const [warningMessage, setWarningMessage] = useState("");
  const [timeWarning, setTimeWarning] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    doctorId: string;
    patientId: string;
    type: string;
    dateTime: string;
    startDateTime: Date | string;
    endDateTime: Date | string;
    code: string;
    json: string;
    status: string;
  }>({
    name: "",
    doctorId: "",
    patientId: "",
    type: "",
    dateTime: "",
    startDateTime: "",
    endDateTime: "",
    code: "ST-ID/15",
    json: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [dateTimeErrors, setDateTimeErrors] = useState({
    pastDate: false,
    pastTime: false,
  });

  // Loading states for individual components
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [appointmentTypesLoading, setAppointmentTypesLoading] = useState(false);
  const [appointmentStatusLoading, setAppointmentStatusLoading] =
    useState(false);

  // Pagination states for patients
  const [patientPage, setPatientPage] = useState(1);
  const [patientPageSize] = useState(20);
  const [hasMorePatients, setHasMorePatients] = useState(true);
  const [allPatients, setAllPatients] = useState<AutocompleteItem[]>([]);
  // function extractTime(dateTime: string): string {
  //   const date = new Date(dateTime);
  //   let hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const amPm = hours >= 12 ? "PM" : "AM";

  //   // Convert to 12-hour format
  //   hours = hours % 12 || 12;

  //   // Add leading zero to minutes if needed
  //   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  //   return `${hours}:${formattedMinutes} ${amPm}`;
  // }

  const validateDateTime = () => {
    // const now = new Date();
    const errors = {
      pastDate: false,
      pastTime: false,
    };

    // NEW VALIDATION: Validate date - allow today and future, block only past
    if (formData.dateTime) {
      // Parse the YYYY-MM-DD format safely
      const [year, month, day] = formData.dateTime
        .split("-")
        .map((num) => parseInt(num, 10));
      const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
      const todayDate = new Date();

      // Reset hours to ensure date-only comparison
      selectedDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);

      const isPastDate = selectedDate < todayDate;

      console.log("NEW VALIDATION - validateDateTime:", {
        formDataDateTime: formData.dateTime,
        selectedDate: selectedDate.toDateString(),
        todayDate: todayDate.toDateString(),
        isPastDate,
        rule: "Block only past dates, allow today and future",
      });

      errors.pastDate = isPastDate;
    }

    // NEW VALIDATION: Time validation - block only past times on today
    if (formData.startDateTime && formData.dateTime) {
      // Parse the YYYY-MM-DD format safely
      const [year, month, day] = formData.dateTime
        .split("-")
        .map((num) => parseInt(num, 10));
      const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
      const todayDate = new Date();

      // Reset hours to ensure date-only comparison
      selectedDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);

      const isToday = selectedDate.getTime() === todayDate.getTime();

      console.log("NEW VALIDATION - Time check:", {
        isToday,
        selectedDate: selectedDate.toDateString(),
        todayDate: todayDate.toDateString(),
        startDateTime: formData.startDateTime,
      });

      if (isToday) {
        const startTime = new Date(formData.startDateTime);
        const currentTime = new Date();

        // Convert to minutes for easy comparison
        const currentTotalMinutes =
          currentTime.getHours() * 60 + currentTime.getMinutes();
        const startTotalMinutes =
          startTime.getHours() * 60 + startTime.getMinutes();

        console.log("NEW VALIDATION - Time comparison:", {
          currentTime: currentTime.toLocaleTimeString(),
          startTime: startTime.toLocaleTimeString(),
          currentTotalMinutes,
          startTotalMinutes,
          isPastTime: startTotalMinutes <= currentTotalMinutes,
          rule: "Block only past times on today, allow future times",
        });

        // Block only past times on today
        if (startTotalMinutes <= currentTotalMinutes) {
          errors.pastTime = true;
        }

        // Also validate end time
        if (formData.endDateTime) {
          const endTime = new Date(formData.endDateTime);
          const endTotalMinutes =
            endTime.getHours() * 60 + endTime.getMinutes();

          // Block past end times on today
          if (endTotalMinutes <= currentTotalMinutes) {
            errors.pastTime = true;
          }

          // Ensure end time is after start time
          if (endTotalMinutes <= startTotalMinutes) {
            setTimeWarning("End time must be after start time");
          } else {
            setTimeWarning("");
          }
        }
      }
    }

    setDateTimeErrors(errors);
    return !errors.pastDate && !errors.pastTime;
  };
  // const handleDateChange = (date: string) => {
  //   setFormData({ ...formData, dateTime: date });
  // };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setFormData({ ...formData, dateTime: "" });
      setDateTimeErrors((prev) => ({ ...prev, pastDate: false }));
      return;
    }

    console.log("DEBUG - handleDateChange input:", {
      originalDate: date,
      dateString: date.toDateString(),
      dateISO: date.toISOString(),
    });

    // NEW VALIDATION: Allow today and future dates, block only past dates
    const selectedDateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayDateOnly = new Date();
    todayDateOnly.setHours(0, 0, 0, 0);
    selectedDateOnly.setHours(0, 0, 0, 0);

    const isPastDate = selectedDateOnly < todayDateOnly;

    console.log("NEW VALIDATION - AddAppointment date check:", {
      selectedDate: selectedDateOnly.toDateString(),
      todayDate: todayDateOnly.toDateString(),
      selectedTime: selectedDateOnly.getTime(),
      todayTime: todayDateOnly.getTime(),
      isPastDate,
      rule: "Block only past dates, allow today and future",
    });

    if (isPastDate) {
      setDateTimeErrors((prev) => ({ ...prev, pastDate: true }));
    } else {
      setDateTimeErrors((prev) => ({ ...prev, pastDate: false }));
    }

    // Store date as YYYY-MM-DD format (timezone-safe)
    const year = selectedDateOnly.getFullYear();
    const month = String(selectedDateOnly.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDateOnly.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFormData({ ...formData, dateTime: formattedDate });

    console.log("DEBUG - Stored dateTime:", formattedDate);
  };

  const generateDateTime = (baseDate: string, time: Time) => {
    const currentDate = new Date(baseDate); // Use the current date
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      time && time.hour,
      time && time.minute,
      0,
    ); // Convert to ISO format
  };

  // const handleTimeChange = (
  //   time: Time,
  //   field: "startDateTime" | "endDateTime",
  // ) => {
  //   if (!formData.dateTime) {
  //     setModalMessage({
  //       success: "",
  //       error: "Please select a date before setting the time.",
  //     });
  //     onOpen();
  //     return;
  //   }

  //   const isoTime = generateDateTime(formData.dateTime, time); // Combine selected date with time
  //   setFormData({ ...formData, [field]: isoTime });
  // };

  //   const handleTimeChange = (time: Time, field: "startDateTime" | "endDateTime") => {
  //   if (!formData.dateTime) {
  //     setModalMessage({
  //       success: "",
  //       error: "Please select a date before setting the time.",
  //     });
  //     onOpen();
  //     return;
  //   }

  //   const isoTime = generateDateTime(formData.dateTime, time);
  //   const now = new Date();

  //   // Check if selected date is today and time is in past
  //   const selectedDate = new Date(formData.dateTime);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   if (selectedDate.getTime() === today.getTime() && isoTime < now) {
  //     setDateTimeErrors(prev => ({ ...prev, pastTime: true }));
  //   } else {
  //     setDateTimeErrors(prev => ({ ...prev, pastTime: false }));
  //   }

  //   setFormData({ ...formData, [field]: isoTime });
  // };

  const handleTimeChange = (
    time: Time,
    field: "startDateTime" | "endDateTime",
  ) => {
    if (!formData.dateTime) {
      setModalMessage({
        success: "",
        error: "Please select a date before setting the time.",
      });
      onOpen();
      return;
    }

    const isoTime = generateDateTime(formData.dateTime, time);

    // Parse the YYYY-MM-DD format safely
    const [year, month, day] = formData.dateTime
      .split("-")
      .map((num) => parseInt(num, 10));
    const selectedDate = new Date(year, month - 1, day); // month is 0-indexed
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // Reset hours to ensure date-only comparison
    selectedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    // Check if selected date is today
    const isToday = selectedDate.getTime() === todayDate.getTime();

    console.log("DEBUG - handleTimeChange:", {
      field,
      time: `${time.hour}:${time.minute}`,
      isToday,
      selectedDate: selectedDate.toDateString(),
      todayDate: todayDate.toDateString(),
    });

    // NEW VALIDATION: For start time, block only past times on today
    if (field === "startDateTime") {
      if (isToday) {
        const currentTime = new Date();
        const currentTotalMinutes =
          currentTime.getHours() * 60 + currentTime.getMinutes();
        const selectedTotalMinutes = time.hour * 60 + time.minute;

        console.log("NEW VALIDATION - Start time check:", {
          currentTime: currentTime.toLocaleTimeString(),
          selectedTime: `${time.hour}:${time.minute}`,
          currentTotalMinutes,
          selectedTotalMinutes,
          isPastTime: selectedTotalMinutes <= currentTotalMinutes,
          rule: "Block only past times on today",
        });

        // Block only past times on today
        if (selectedTotalMinutes <= currentTotalMinutes) {
          setDateTimeErrors((prev) => ({ ...prev, pastTime: true }));
        } else {
          setDateTimeErrors((prev) => ({ ...prev, pastTime: false }));
        }
      } else {
        // Future dates: allow any time
        setDateTimeErrors((prev) => ({ ...prev, pastTime: false }));
      }
    }
    // NEW VALIDATION: For end time, check start time relationship and past time on today
    else if (field === "endDateTime") {
      const startTime = new Date(formData.startDateTime);
      const startTotalMinutes =
        startTime.getHours() * 60 + startTime.getMinutes();
      const endTotalMinutes = time.hour * 60 + time.minute;

      if (endTotalMinutes <= startTotalMinutes) {
        setTimeWarning("End time must be after start time");
      } else {
        setTimeWarning("");

        if (isToday) {
          const currentTime = new Date();
          const currentTotalMinutes =
            currentTime.getHours() * 60 + currentTime.getMinutes();

          console.log("NEW VALIDATION - End time check:", {
            currentTime: currentTime.toLocaleTimeString(),
            endTime: `${time.hour}:${time.minute}`,
            currentTotalMinutes,
            endTotalMinutes,
            isPastTime: endTotalMinutes <= currentTotalMinutes,
            rule: "Block only past times on today",
          });

          // Block only past times on today
          if (endTotalMinutes <= currentTotalMinutes) {
            setDateTimeErrors((prev) => ({ ...prev, pastTime: true }));
          } else {
            setDateTimeErrors((prev) => ({ ...prev, pastTime: false }));
          }
        } else {
          // Future dates: allow any time
          setDateTimeErrors((prev) => ({ ...prev, pastTime: false }));
        }
      }
    }

    setFormData({ ...formData, [field]: isoTime });
  };

  // const handlePatientSelection = (patientId: string) => {
  //   const selectedPatient = patientList.find(
  //     (patient) => patient.value === patientId,
  //   );
  //   if (selectedPatient) {
  //     setFormData({
  //       ...formData,
  //       patientId,
  //       name: selectedPatient.label,
  //       json: JSON.stringify({
  //         dob: selectedPatient.dob,
  //         email: selectedPatient.description?.split(" | ")[1] || "",
  //       }),
  //     });
  //   }
  // };
  //  const handlePatientSelection = (patientId: string) => {
  //   if (patientId === "create-new-patient") {
  //     setShowAddPatientModal(true);
  //     return;
  //   }

  //   const selectedPatient = patientList.find(
  //     (patient) => patient.value === patientId,
  //   );
  //   if (selectedPatient) {
  //     setFormData({
  //       ...formData,
  //       patientId,
  //       name: selectedPatient.label,
  //       json: JSON.stringify({
  //         dob: selectedPatient.dob,
  //         email: selectedPatient.description?.split(" | ")[1] || "",
  //       }),
  //     });
  //   }
  // };

  const handlePatientSelection = (patientId: string) => {
    if (patientId === "create-new-patient") {
      setShowAddPatientModal(true);
      return;
    }

    const selectedPatient = patientList.find(
      (patient) => patient.value === patientId,
    );
    if (selectedPatient) {
      setFormData({
        ...formData,
        patientId,
        name: selectedPatient.label,
        json: JSON.stringify({
          dob: selectedPatient.dob,
          email: selectedPatient.description?.split(" | ")[1] || "",
        }),
      });
    }
  };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    internalClose();
    if (onClose) {
      onClose();
    }
  };

  function isWithinWorkingHours(
    startTime: Date,
    endTime: Date,
    workingHours: string,
  ): boolean {
    try {
      const [startStr, endStr] = workingHours.split(" - "); // Split into start and end times

      if (!startStr || !endStr) {
        throw new Error("Invalid workingHours format");
      }

      const startOfWork = parseTimeStringToDate(startStr, startTime);
      const endOfWork = parseTimeStringToDate(endStr, endTime);

      // Check if the appointment time is within working hours
      return startTime >= startOfWork && endTime <= endOfWork;
    } catch (error) {
      console.error("Error parsing or validating working hours:", error);
      return false; // Return false on error
    }
  }

  // Helper function to parse time strings like "9:00 AM" into Date objects
  function parseTimeStringToDate(timeStr: string, baseDate: Date): Date {
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i; // Match time format (HH:MM AM/PM)
    const match = timeStr.match(timeRegex);

    if (!match) {
      throw new Error(`Invalid time string: ${timeStr}`);
    }

    const [, hourStr, minuteStr, period] = match; // Destructure regex match groups
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Convert to 24-hour format
    const adjustedHour =
      period.toUpperCase() === "PM" && hour !== 12
        ? hour + 12
        : period.toUpperCase() === "AM" && hour === 12
          ? 0
          : hour;

    const date = new Date(baseDate);
    date.setHours(adjustedHour, minute, 0, 0); // Set hours, minutes, and seconds
    return date;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingData(true);
    const { startDateTime, endDateTime, doctorId } = formData;

    // Find the selected doctor from the doctorList
    const selectedDoctor = doctorList.find(
      (doctor) => doctor.value === doctorId,
    );

    if (!validateDateTime()) {
      if (dateTimeErrors.pastDate) {
        setModalMessage({
          success: "",
          error:
            "Cannot book appointment on past dates. Please select today or a future date.",
        });
      } else if (dateTimeErrors.pastTime) {
        setModalMessage({
          success: "",
          error:
            "Cannot book appointment at past times for today. Please select a future time.",
        });
      }
      setSavingData(false);
      setLoading(false);
      onOpen();
      return;
    }
    if (selectedDoctor) {
      const workingHours = selectedDoctor.workingHours;

      if (
        workingHours &&
        !isWithinWorkingHours(
          new Date(startDateTime),
          new Date(endDateTime),
          workingHours,
        )
      ) {
        // Set warning message instead of blocking the appointment
        // setWarningMessage(
        //   "Warning: The selected appointment time is outside the doctor's working hours.",
        // );
      } else {
        // Clear the warning message if the time is within working hours
        // setWarningMessage("");
      }
    }

    const missingFields: string[] = [];
    for (const key in formData) {
      if (!formData[key as keyof typeof formData] && key !== "branchId") {
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }

    if (missingFields.length > 0) {
      setModalMessage({
        success: "",
        error: `The following fields are required: ${missingFields.join(", ")}`,
      });
      onOpen();
      setSavingData(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("docPocAuth_token");

    if (!token) {
      setModalMessage({
        success: "",
        error: "No access token found. Please log in again.",
      });
      setLoading(false);
      setSavingData(false);
      onOpen();
      return;
    }

    console.log("Token:", token);

    try {
      const token = localStorage.getItem("docPocAuth_token");
      // const userId = profile?.id;
      const fetchedBranchId = profile?.branchId;

      const payload = {
        ...formData,
        branchId: fetchedBranchId,
      };
      const response = await axios.post(`${API_URL}/appointment`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Appointment Created:", response.data);
      setModalMessage({
        success: "Appointment created successfully!",
        error: "",
      });
      onOpen();
      onUsersAdded();
      //          setTimeout(() => {
      //   if (onClose) onClose(); // Close main modal after 3s
      // }, 3000);

      onMessage({ success: "Appointment created successfully!" });

      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (error: any) {
      setSavingData(false);
      setLoading(false);
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message,
      );

      let errorMessage = "An unknown error occurred.";

      if (error.response?.data) {
        const errorData = error.response.data;

        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message
            .map((msg: any) => msg.message) // Access the `message` property from each object
            .join(", ");
        } else if (typeof errorData.message === "string") {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }

      setModalMessage({
        success: "",
        error: `Error creating appointment: ${errorMessage}`,
      });

      onOpen();
    }
    setLoading(false);
    setSavingData(false);
  };

  const handleTypeSelection = (typeId: string) => {
    setFormData({ ...formData, type: typeId });
  };
  const handleStatusSelection = (statusId: string) => {
    setFormData({ ...formData, status: statusId });
  };

  const fetchAppointmentTypes = async () => {
    setAppointmentTypesLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;

      const appointmentTypeEndpoint = `${API_URL}/appointment/types/${fetchedBranchId}`;
      const response = await axios.get(appointmentTypeEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.data || response.data.length === 0) {
        throw new Error("No appointment types found.");
      }
      const transformedTypes: AutocompleteItem[] = response.data.map(
        (type: any) => ({
          label: type.name,
          value: type.id,
        }),
      );
      setAppointmentTypeList(transformedTypes);
    } catch (error) {
      console.error("Error fetching appointment types:", error);
    } finally {
      setAppointmentTypesLoading(false);
    }
  };

  const fetchAppointmentStatus = async () => {
    setAppointmentStatusLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;

      const appointmentStatusEndpoint = `${API_URL}/appointment/status/${fetchedBranchId}`;
      const response = await axios.get(appointmentStatusEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const transformedStatus: AutocompleteItem[] = response.data.map(
        (type: any) => ({
          label: type.status,
          value: type.id,
        }),
      );
      setAppointmentStatusList(transformedStatus);
    } catch (error) {
      console.error("Error fetching appointment status:", error);
    } finally {
      setAppointmentStatusLoading(false);
    }
  };

  const fetchPatients = async (page = 1, append = false) => {
    setPatientsLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;

      const patientsendpoint = `${API_URL}/patient/list/${fetchedBranchId}`;
      const params: any = {
        page,
        pageSize: 10000,
        notificationStatus: [
          "Whatsapp notifications paused",
          "SMS notifications paused",
        ],
      };

      const response = await axios.get(patientsendpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const transformedPatients: AutocompleteItem[] = response.data.rows.map(
        (patient: any) => ({
          label: patient.name,
          value: patient.id,
          description: `${patient.phone} | ${patient.email}`,
          dob: patient.dob,
        }),
      );

      if (append) {
        setAllPatients((prev) => [...prev, ...transformedPatients]);
        setPatientList((prev) => [
          prev[0], // Keep "Create New Patient" option
          ...allPatients,
          ...transformedPatients,
        ]);
      } else {
        setAllPatients(transformedPatients);
        setPatientList([
          {
            label: "Create New Patient...",
            value: "create-new-patient",
            description: "Click to add a new patient",
            dob: "",
            workingHours: "",
          },
          ...transformedPatients,
        ]);
      }

      // Check if there are more patients
      setHasMorePatients(response.data.rows.length === patientPageSize);
      setPatientPage(page);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setDoctorsLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;

      const doctorsEndpoint = `${API_URL}/user/list/${fetchedBranchId}`;
      const params: any = {
        page: 1,
        pageSize: 100,
      };

      const response = await axios.get(doctorsEndpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const allUsers = response.data.rows;
      const doctors = allUsers.filter((user: any) => {
        try {
          const userJson = JSON.parse(user.json);
          return (
            userJson.designation &&
            (userJson.designation.toLowerCase() === "doctor" ||
              userJson.designation === "Doctor")
          );
        } catch (err) {
          console.error("Error parsing JSON for user:", user, err);
          return false;
        }
      });

      const transformedDoctors: AutocompleteItem[] = doctors.map(
        (doctor: any) => {
          try {
            const doctorJson = JSON.parse(doctor.json || "{}");
            return {
              label: doctor.name,
              value: doctor.id,
              description: `${doctor.phone} | ${doctor.email}`,
              workingHours: doctorJson.workingHours || "Not Available",
            };
          } catch (err) {
            console.error("Error parsing doctor JSON for working hours:", err);
            return {
              label: doctor.name,
              value: doctor.id,
              description: `${doctor.phone} | ${doctor.email}`,
              workingHours: "Not Available",
            };
          }
        },
      );
      setDoctorList(transformedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentTypes();
    fetchAppointmentStatus();
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.dateTime) {
      // Don't set default times - let user select manually
      setFormData((prevFormData) => ({
        ...prevFormData,
        startDateTime: "",
        endDateTime: "",
      }));
    }
  }, [formData.dateTime]);

  // Real-time validation effect - updates every minute to prevent past appointments
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.dateTime || formData.startDateTime || formData.endDateTime) {
        console.log("DEBUG - Real-time validation check");
        validateDateTime();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [formData.dateTime, formData.startDateTime, formData.endDateTime]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      // Only modify z-index when modal is open

      header.classList.remove("z-999");
      header.classList.add("z-0");
    }
  }, [isOpen]);

  const minDate = new Date(); // Today
  const maxDate = new Date();
  maxDate.setMonth(minDate.getMonth() + 1);

  // Function to check if the selected times are within the doctor's working hours
  const validateWorkingHours = () => {
    const { startDateTime, endDateTime, doctorId } = formData;
    const selectedDoctor = doctorList.find(
      (doctor) => doctor.value === doctorId,
    );

    if (selectedDoctor) {
      const workingHours = selectedDoctor.workingHours;
      if (
        workingHours &&
        !isWithinWorkingHours(
          new Date(startDateTime),
          new Date(endDateTime),
          workingHours,
        )
      ) {
        setTimeWarning(
          "The selected appointment time is outside the doctor's working hours.",
        );
      } else {
        setTimeWarning("");
      }
    }
  };

  // Effect hook to validate working hours when doctor or time changes
  useEffect(() => {
    if (formData.doctorId && formData.startDateTime && formData.endDateTime) {
      validateWorkingHours();
    }
  }, [formData.doctorId, formData.startDateTime, formData.endDateTime]);

  //   const handleNewPatientCreated = () => {
  //   setShowAddPatientModal(false);
  //   fetchAppointmentTypes(); // This will refetch patients including the new one
  //   setModalMessage({
  //     success: "Patient created successfully! Now select the new patient from the dropdown.",
  //     error: "",
  //   });
  //   onOpen();
  // };
  const handleNewPatientCreated = () => {
    setShowAddPatientModal(false);
    // Refresh patient list when new patient is created
    fetchPatients(1, false);
  };

  // Remove parseDate function as it's no longer needed with CustomAppointmentDatePicker
  return (
    <div className="grid grid-cols-1 gap-9">
      {/* Removed overlay - just disable fields during creation */}
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

      <div className="flex flex-col w-full ">
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
             <div>
              <Switch
                defaultSelected
                color="secondary"
                onClick={() => setEdit(!edit)}
                isSelected={edit}
              >
                Edit
              </Switch>
            </div> 
          </div> */}
          <form onSubmit={handleSubmit}>
            {/* {warningMessage && (
              <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">
                {warningMessage}
              </div>
            )} */}
            <div className="p-2.5 sm:4.5">
              {/* <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"></div> */}
              {/* <div className="flex flex-col w-full"></div> */}
              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                <div className="w-full xl:flex-1">
                  <CustomAppointmentDatePicker
                    label="Appointment Date"
                    labelPlacement="outside"
                    variant="bordered"
                    color="secondary"
                    isRequired={false}
                    disabled={!edit || savingData}
                    placeholder="DD/MM/YYYY"
                    value={
                      formData.dateTime ? new Date(formData.dateTime) : null
                    }
                    onChange={handleDateChange}
                    isInvalid={dateTimeErrors.pastDate}
                    errorMessage={
                      dateTimeErrors.pastDate
                        ? "Cannot select past dates. Today and future dates are allowed."
                        : ""
                    }
                    onValidationChange={(isValid, errorMessage) => {
                      console.log(
                        "NEW VALIDATION - onValidationChange called:",
                        { isValid, errorMessage },
                      );
                      if (!isValid && errorMessage.includes("past")) {
                        setDateTimeErrors((prev) => ({
                          ...prev,
                          pastDate: true,
                        }));
                      } else {
                        setDateTimeErrors((prev) => ({
                          ...prev,
                          pastDate: false,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                {timeWarning && (
                  <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">
                    <p className=" text-xs sm:text-sm md:text-lg">
                      {" "}
                      {timeWarning}
                    </p>
                  </div>
                )}
                {formData.dateTime && !dateTimeErrors.pastDate && (
                  <div className="text-blue-600 px-6.5 py-2 bg-blue-100 border-l-4 border-blue-500">
                    <p className="text-xs sm:text-sm md:text-lg">
                      💡 Tip: For todays appointments, please select a time at
                      least 1 minute in the future from the current time.
                    </p>
                  </div>
                )}
              </div>
              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                <TimeInput
                  classNames={{
                    input: [
                      "text-black", // Light mode text color
                      "dark:text-white", // Dark mode text color
                    ],
                    inputWrapper: [
                      "group-data-[has-value=true]:text-black", // Light mode with value
                      "dark:group-data-[has-value=true]:text-white", // Dark mode with value
                    ],
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit || savingData}
                  onChange={(time) =>
                    handleTimeChange(time as any, "startDateTime")
                  }
                  isInvalid={dateTimeErrors.pastTime}
                  errorMessage={
                    dateTimeErrors.pastTime
                      ? "Cannot select past times for today. Please select a future time."
                      : ""
                  }
                />
                <TimeInput
                  classNames={{
                    input: [
                      "text-black", // Light mode text color
                      "dark:text-white", // Dark mode text color
                    ],
                    inputWrapper: [
                      "group-data-[has-value=true]:text-black", // Light mode with value
                      "dark:group-data-[has-value=true]:text-white", // Dark mode with value
                    ],
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit || savingData}
                  onChange={(time) =>
                    handleTimeChange(time as any, "endDateTime")
                  }
                />
                {/* {timeWarning && (
                   <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">{timeWarning}</div>
                )} */}
              </div>
              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                <Textarea
                  classNames={{
                    input: [
                      "text-black", // Light mode text color
                      "dark:text-white", // Dark mode text color
                    ],
                    inputWrapper: [
                      "group-data-[has-value=true]:text-black", // Light mode with value
                      "dark:group-data-[has-value=true]:text-white", // Dark mode with value
                    ],
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  isInvalid={false}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Remarks"
                  placeholder="Enter Remarks"
                  defaultValue=""
                  errorMessage="The remarks should be at max 255 characters long."
                  isDisabled={!edit || savingData}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      json: `{"remarks":"${e.target.value}"}`,
                    })
                  }
                />
              </div>
              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit || savingData}
                  defaultItems={appointmentTypeList}
                  label="Select Appointment Type"
                  placeholder={
                    appointmentTypesLoading
                      ? "Loading..."
                      : "Search Appointment Type"
                  }
                  isLoading={appointmentTypesLoading}
                  onSelectionChange={(key) =>
                    handleTypeSelection(key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit || savingData}
                  defaultItems={appointmentStatusList}
                  label="Select Appointment Status"
                  placeholder={
                    appointmentStatusLoading
                      ? "Loading..."
                      : "Search Appointment Status"
                  }
                  isLoading={appointmentStatusLoading}
                  onSelectionChange={(key) =>
                    handleStatusSelection(key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div
                className="mb-4 sm:mb-1.5 md:mb-2.5 lg:mb-3 flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row"
                // style={{ marginTop: 20 }}
              >
                {/* <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={patientList}
                  label="Select Patient"
                  placeholder="Search a Patient"
                  onSelectionChange={(key) =>
                    handlePatientSelection(key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete> */}

                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit || savingData}
                  defaultItems={patientList}
                  label="Select Patient"
                  placeholder={
                    patientsLoading ? "Loading..." : "Search a Patient"
                  }
                  isLoading={patientsLoading}
                  onSelectionChange={(key) =>
                    handlePatientSelection(key as string)
                  }
                  onLoadMore={() => {
                    if (hasMorePatients && !patientsLoading) {
                      fetchPatients(patientPage + 1, true);
                    }
                  }}
                  defaultFilter={(textValue, inputValue) => {
                    // Always show "Create New Patient" option regardless of search
                    if (textValue === "Create New Patient...") {
                      return true;
                    }
                    // Filter other patients based on search input
                    return textValue
                      .toLowerCase()
                      .includes(inputValue.toLowerCase());
                  }}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.value}
                      variant="shadow"
                      color={
                        item.value === "create-new-patient"
                          ? "primary"
                          : TOOL_TIP_COLORS.secondary
                      }
                      className={
                        item.value === "create-new-patient" ? "font-bold" : ""
                      }
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit || savingData}
                  defaultItems={doctorList}
                  label="Select Doctor"
                  placeholder={
                    doctorsLoading ? "Loading..." : "Search a Doctor"
                  }
                  isLoading={doctorsLoading}
                  onSelectionChange={(key) =>
                    setFormData({ ...formData, doctorId: key as string })
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {/* {item.label}-{item.workingHours} */}
                      {`${item.label} - ${item.workingHours}`}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div
                className="flex flex-col w-full mb-4 sm:mb-2"
                style={{ marginTop: 20 }}
              >
                {timeWarning && (
                  <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">
                    <p className=" text-xs sm:text-sm md:text-lg  ">
                      {" "}
                      {timeWarning}
                    </p>
                  </div>
                )}
              </div>

              <div
                className="flex flex-col w-full mb-4 sm:mb-2"
                // style={{ marginTop: 20 }}
              >
                <label>
                  Mark uncheck if no notification has to be sent for
                  appointment.
                </label>
                <Checkbox
                  color={TOOL_TIP_COLORS.secondary}
                  defaultSelected={true}
                  isDisabled={!edit || savingData}
                >
                  All appointments get notified to the patient by default.
                </Checkbox>
              </div>
            </div>
            <div className="flex justify-center mt-4 mb-4 sm:mb-2">
              <button
                type="submit"
                // onPress={onOpen}
                // isDisabled={!edit || loading}
                // color={TOOL_TIP_COLORS.secondary}
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90 text-white  bg-purple-500  "
                style={{ minWidth: 230, marginBottom: 20 }}
                disabled={savingData}
              >
                {savingData ? "Creating Appointment..." : "Create Appointment"}
              </button>

              <EnhancedModal
                isOpen={isOpen}
                loading={loading}
                modalMessage={modalMessage}
                onClose={handleModalClose}
              />
            </div>
          </form>
        </div>
      </div>
      <div>
        <style>
          {" "}
          {`
        /* Base styling for the button */
        .responsive-button {
          min-height: 55px;
          font-size: 1rem;
          padding: 0.8rem 1.5rem;
        }

        /* Adjustments for smaller screens */
        @media (max-width: 768px) {
          .responsive-button {
            font-size: 0.9rem; /* Smaller font size */
            padding: 0.7rem 1.2rem; /* Reduced padding */
            min-height: 50px; /* Smaller height */
          }
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh; /* Adjust as needed */
  overflow-y: auto;
  width: 97%; /* Adjust as needed */
  max-width: 800px; /* Adjust as needed */
  // background: white;
  border-radius: 15px;
  padding-top:10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);-
}

/* Ensure the modal is scrollable */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  overflow-y: auto;
}
        }

        @media (max-width: 480px) {
          .responsive-button {
            font-size: 0.7rem; /* Further reduce font size */
            padding: 0.5rem 0.9rem; /* Further reduce padding */
            min-height: 40px; /* Smaller height */
          } 
        }



      `}
        </style>
        <Modal
          isOpen={showAddPatientModal}
          onClose={() => setShowAddPatientModal(false)}
          style={{
            maxWidth: 800,
            maxHeight: 600,
            overflowY: "scroll",
            marginTop: "10%",
          }}
          className="max-w-[95%] sm:max-w-[800px] mx-auto debug-border"
          classNames={{
            backdrop:
              "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-50",
          }}
        >
          <ModalContent className="modal-content">
            <ModalHeader>Create New Patient</ModalHeader>
            <ModalBody>
              <AddNewPatient onPatientAdded={handleNewPatientCreated} />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => setShowAddPatientModal(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
export default AddAppointment;

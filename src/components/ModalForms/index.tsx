"use client";
import { Spinner } from "@nextui-org/react";
import CustomAppointmentDatePicker from "../CustomComponent/CustomAppointmentDatePicker";
import CustomDatePicker from "../CustomComponent/CustomDatePicker";
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  Image,
  // Dropdown,
  // DropdownItem,
  // DropdownTrigger,
  Button,
  // DropdownMenu,
  Input,
  TimeInput,
  AutocompleteItem,
  Autocomplete,
  Textarea,
} from "@nextui-org/react";
import {
  GLOBAL_ACTION_ICON_COLOR,
  GLOBAL_DANGER_COLOR,
  // GLOBAL_ICON_COLOR,
  GLOBAL_ICON_COLOR_WHITE,
  GLOBAL_SUCCESS_COLOR,
  MODAL_TYPES,
  TOOL_TIP_COLORS,
  // USER_ICONS,
} from "@/constants";
import StyledButton from "../common/Button/StyledButton";
import {
  // ZonedDateTime,
  // getLocalTimeZone,
  // now,
  parseTime,
  // today,
} from "@internationalized/date";

// import ToolTip from "../Tooltip";
// import { VerticalDotsIcon } from "../CalenderBox/VerticalDotsIcon";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import IconButton from "../Buttons/IconButton";

import { VisitHistoryTable } from "../Patient/VisitHistoryTable";
// import AddAppointment from "../CalenderBox/AddAppointment";
import axios from "axios";
import { Time } from "@internationalized/date";
import { useDropzone } from "react-dropzone";
// import { parseDate } from "@internationalized/date";
// import DocumentList from "../Patient/DocumentList";
import Cropper, { Area } from "react-easy-crop";

type FileWithPreview = File & { preview?: string };

// const PlaceholderImage = () => (
//   <svg width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
//     <rect width="100%" height="100%" fill="#e0e0e0" />
//     <text
//       x="50%"
//       y="50%"
//       alignmentBaseline="middle"
//       textAnchor="middle"
//       fontSize="20"
//       fill="#666"
//     >
//       No Image Available
//     </text>
//   </svg>
// );
interface AutocompleteItem {
  value: string;
  label: string;
  description?: string;
  dob?: string;
}

const API_URL = process.env.API_URL;
const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;

// const MAX_FILE_SIZE_MB = 5;

interface VisitData {
  date: string;
  doctor: string;
  report: string;
}
export default function ModalForm(props: {
  type: string;
  userId: string;
  onDataChange: (data: any) => void;
  onProfilePhotoChange: (file: any) => void;
  onFilesChange: (files: any, fileNames?: any) => void;
}) {
  // console.log("aws url is" + AWS_URL)
  const [editVisitTime, setEditVisitTime] = useState(false);
  const [editSelectedDoctor, setEditDoctor] = useState(false);

  const [editSelectedPatientBloodGroup, setEditPatientBloodGroup] =
    useState(false);
  const [editSelectedPatientStatus, setEditPatientStatus] = useState(false);
  const [editSelectedPatientEmail, setEditPatientEmail] = useState(false);
  const [editSelectedPatientPhone, setEditPatientPhone] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [editSelectedEmployee, setEditEmployee] = useState(false);
  const [editSelectedEmployeePhone, setEditEmployeePhone] = useState(false);
  const [editSelectedEmployeeEmail, setEditEmployeeEmail] = useState(false);
  const [editSelectedEmployeeDesignation, setEditEmployeeDesignation] =
    useState(false);
  const [editSelectedEmployeeShiftTime, setEditEmployeeShiftTime] =
    useState(false);
  // const [editSelectedEmployeeJoiningDate] = useState(false);
  const [editSelectedEmployeeDOB, setEditEmployeeDOB] = useState(false);

  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeeShiftStartTime, setEmployeeShiftStartTime] =
    useState<Time | null>(null);
  const [employeeShiftEndTime, setEmployeeShiftEndTime] = useState<Time | null>(
    null,
  );
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const designations = [
    { label: "Doctor", value: "doctor" },
    { label: "Nurse", value: "nurse" },
    { label: "Staff", value: "staff" },
    { label: "Admin", value: "admin" },
  ];
  const [employeePhone, setEmployeePhone] = useState("");
  const [emloyeeBranch, setEmployeeBranch] = useState("");
  const [employeeShiftTime, setEmployeeShiftTime] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState("");
  const [employeePhoto, setEmployeePhoto] = useState("");
  const [employeeGender, setEmployeeGender] = useState(" ");
  const [employeeBio, setEmployeeBio] = useState();

  const [editSelectedPatient, setEditPatient] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientBloodGroup, setPatientBloodGroup] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [patientPhoto, setPatientPhoto] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  // const [patientPhotoLoading, setPatientPhotoLoading] = useState(false);
  const [patientDocument, setPatientDocument] = useState<VisitData[]>([]); // Initialize as an array
  const [patientCode, setPatientCode] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientAge, setPatientAge] = useState("");

  // const [appointmentId, setAppointmentId] = useState("");
  // const [reportType, setReportType] = useState("");
  // const [description, setDescription] = useState("");
  // const [isSharedWithPatient, setIsSharedWithPatient] = useState(false);
  // const [amount, setAmount] = useState("");

  // Example lists for dropdowns
  // const appointmentList = [
  //   { key: "a1234567-89ab-cdef-0123-456789abcdef", label: "Appointment 1" },
  //   { key: "b2345678-90bc-def0-1234-567890abcdef", label: "Appointment 2" },
  //   // Add more appointments as needed
  // ];
  // const reportTypeList = [
  //   { key: "INVOICE", label: "Invoice" },
  //   { key: "REPORT", label: "Report" },
  //   // Add more report types as needed
  // ];
  // const [loading, setLoading] = useState<boolean>(true);
  const [lastVisit, setLastVisit] = useState<string>("N/A");

  const [lastAppointedDoctor, setLastAppointedDoctor] = useState<string>("N/A");
  // const [lastVisit, setLastvisit] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const [branchId, setBranchId] = useState("");
  const [patientDob, setPatientDob] = useState("");
  // const [gender, setGender] = useState("");
  // const [selectedDate, setSelectedDate] = useState(now(getLocalTimeZone()));
  // const [selectedDoctor, setSelectedDoctor] = useState("Dr. Salunkey");

  const [loading, setLoading] = useState(false);

  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  // const [appointmentPatientId, setAppointmentPatientId] = useState("");

  const [appointmentBranch, setAppointmentBranch] = useState("");
  const [appointmentName, setAppointmentName] = useState("");
  const [doctorList, setDoctorList] = useState<AutocompleteItem[]>([]);

  const [doctorId, setDoctorId] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  // const [startDateTimeDisp, setStartDateTimeDisp] = useState<string>("");
  // const [endDateTime, setEndDateTime] = useState<string>("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [editAppointmentDate, setEditAppointmentDate] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(appointmentDate));
  //   const [shiftStartTime, setShiftStartTime] = useState<Time>(new Time(7, 38));  // Default time
  // const [shiftEndTime, setShiftEndTime] = useState<Time>(new Time(8, 45));
  // Default time
  const [shiftStartTime, setShiftStartTime] = useState<Time | null>(null);
  const [shiftEndTime, setShiftEndTime] = useState<Time | null>(null);

  const [editSelectedPatientDob, setEditSelectedPatientDob] = useState(false);
  const [editSelectedPatientAddress, setEditSelectedPatientAddress] =
    useState(false);
  // const [editSelectedPatientAllergies, setEditSelectedPatientAllergies] =
  //   useState(false);

  const [patientPhoneError, setPatientPhoneError] = useState("");
  const [employeePhoneError, setEmployeePhoneError] = useState("");

  // Convert ISO string to Date object
  const parseAppointmentDate = (dateString: string) => {
    return dateString ? new Date(dateString) : new Date();
  };

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Update date while preserving time
  const updateDatePreservingTime = (
    newDate: Date,
    originalDateTime: string,
  ) => {
    if (!originalDateTime) return newDate.toISOString();

    const original = new Date(originalDateTime);
    const updated = new Date(newDate);

    // Preserve the original time components
    updated.setHours(original.getHours());
    updated.setMinutes(original.getMinutes());
    updated.setSeconds(original.getSeconds());

    return updated.toISOString();
  };
  useEffect(() => {
    if (appointmentDate) {
      setTempDate(parseAppointmentDate(appointmentDate));
    }
  }, [appointmentDate]);

  const formatDateToDDMMYYYY = (dateTimeString: string): string => {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to validate and format field values
  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    // Handle empty objects
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return "N/A";
    }

    // Handle JSON strings that might be empty objects
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "object" && Object.keys(parsed).length === 0) {
          return "N/A";
        }
      } catch (err) {
        console.log(err);

        // If it's not valid JSON, continue with the original value
      }
    }

    return String(value);
  };

  // Helper function to format allergies from JSON
  // const formatAllergies = (jsonString: string): string => {
  //   if (!jsonString) return "N/A";

  //   try {
  //     const parsed = JSON.parse(jsonString);
  //     if (
  //       parsed.allergies &&
  //       Array.isArray(parsed.allergies) &&
  //       parsed.allergies.length > 0
  //     ) {
  //       return parsed.allergies.join(", ");
  //     }
  //     return "N/A";
  //   } catch (e) {
  //     return "N/A";
  //   }
  // };

  function extractTimeDisplay(datetimeStr: string): string {
    // Parse the ISO 8601 string into a Date object
    const date = new Date(datetimeStr);

    // Extract the UTC hours, minutes, and seconds
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Apply the offset (e.g., +6:30)
    const offsetHours = 6;
    const offsetMinutes = 30;
    hours -= 1;
    // Apply offset to minutes
    minutes += offsetMinutes;
    if (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    // Apply offset to hours
    hours += offsetHours;
    if (hours >= 24) {
      hours -= 24; // Handle overflow to the next day
    }

    // Format the time components to always display two digits
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const handleTimeChange = (key: "start" | "end", value: string) => {
    const [hour, minute] = value.split(":").map(Number); // Parse hour and minute
    const period = hour >= 12 ? "PM" : "AM"; // Determine AM/PM
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;

    const [start, end] = (employeeShiftTime || "").split(" - "); // Split the current working hours
    let newShiftTime = "";

    if (key === "start") {
      newShiftTime = `${formattedTime} - ${end || ""}`;
    } else {
      newShiftTime = `${start || ""} - ${formattedTime}`;
    }

    setEmployeeShiftTime(newShiftTime); // Update the state variable
  };

  const combineDateWithTime = (
    existingDateTime: string,
    newTime: Time,
  ): string => {
    const date = new Date(existingDateTime); // Get the existing date
    date.setHours(newTime.hour, newTime.minute, 0, 0); // Set new time, keep milliseconds as zero
    return date.toISOString(); // Convert to ISO string
  };

  const handleTimeChangeAppointment = (
    time: Time,
    field: "startDateTime" | "endDateTime",
  ) => {
    if (field === "startDateTime") {
      const updatedStartDateTime = combineDateWithTime(startDateTime, time);

      setStartDateTime(updatedStartDateTime);
    } else {
      const updatedEndDateTime = combineDateWithTime(endDateTime, time);
      setEndDateTime(updatedEndDateTime);
    }
  };

  const fetchPatientById = async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/patient/${userId}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPatientName(response.data.name);
      setPatientPhone(response.data.phone);
      setPatientBloodGroup(response.data.bloodGroup);
      setPatientEmail(response.data.email);
      setPatientStatus(response.data.status);
      setProfilePhoto(response.data.displayPicture);
      setPatientPhoto(response.data.displayPicture);
      // setLastvisit(response.data.lastVisit)
      setNotificationStatus(response.data.notificationStatus);
      setBranchId(response.data.branchId);
      setPatientDob(response.data.dob);
      // setGender(response.data.gender);
      setPatientId(response.data.id);
      setPatientGender(response.data.gender);
      setPatientCode(response.data.code);
      setPatientAddress(response.data.address);
      setPatientAge(response.data.age?.toString() || "");

      const uploadedDocuments = Object.entries(
        JSON.parse(response.data.documents || "{}"),
      ).map(([key, value]) => {
        let parsedValue;
        try {
          parsedValue = typeof value === "string" ? JSON.parse(value) : value;
        } catch {
          parsedValue = value;
        }
        let url = "";
        if (parsedValue.url && typeof parsedValue.url === "string") {
          url = parsedValue.url;
        } else if (
          parsedValue.report &&
          typeof parsedValue.report === "string" &&
          parsedValue.report.startsWith("http")
        ) {
          url = parsedValue.report;
        }
        const name = parsedValue.name || parsedValue.doctor || key;
        // Only return the fields you need
        // Format date as DD/MM/YYYY, even if already in that format
        let formattedDate = "N/A";
        if (parsedValue.date) {
          if (/\d{2}\/\d{2}\/\d{4}/.test(parsedValue.date)) {
            formattedDate = parsedValue.date;
          } else {
            formattedDate = formatDateToDDMMYYYY(parsedValue.date);
          }
        }
        return {
          name,
          date: formattedDate,
          url,
          doctor: "",
          report: "",
        };
      });
      setPatientDocument(uploadedDocuments);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastVisitData = async (userId: string) => {
    const token = localStorage.getItem("docPocAuth_token");
    const endpoint = `${API_URL}/appointment/visits/patient/${userId}`;

    try {
      setLoading(true);
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const visits = response.data;

      if (visits.length > 1) {
        // Get the second-to-last visit
        const lastVisitData = visits[1];
        setLastVisit(formatDateToDDMMYYYY(lastVisitData.dateTime)); // Format the date
        setLastAppointedDoctor(lastVisitData.doctorName); // Extract doctorName
      } else {
        // If only one or no visit is available, show default values
        setLastVisit("N/A");
        setLastAppointedDoctor("N/A");
      }
    } catch (error) {
      console.error("Error fetching last visit data:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertTo24HourFormat = (time: string): string => {
    const [hoursMinutes, modifier] = time.split(" "); // Split "9:00 AM" into ["9:00", "AM"]
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = hoursMinutes.split(":").map(Number); // Split "9:00" into [9, 00]

    if (modifier === "PM" && hours !== 12) {
      hours += 12; // Convert PM hours (e.g., "2 PM" -> 14)
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0; // Convert midnight ("12 AM" -> "00:00")
    }

    // Format the time as "HH:MM" (24-hour format)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const fetchUsers = async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/user/${userId}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const users = response.data;
      const parsedJson = JSON.parse(users.json);
      // Update state
      setEmployeeName(users.name);
      setEmployeeEmail(users.email);
      setEmployeePhone(users.phone);
      setEmployeeDOB(parsedJson.dob);
      setEmployeeDesignation(parsedJson.designation);
      setEmployeeShiftTime(parsedJson.workingHours);
      setEmployeeJoiningDate(users.createdAt);
      setEmployeeBranch(users.branchId);
      setEmployeePhoto(users.profilePicture);
      setProfilePhoto(users.profilePicture);
      // setEmployeeId(users.id);
      setEmployeeGender(users.gender);
      // setEmployeeJson(users?.json)
      console.log(users);

      const workingHours = parsedJson.workingHours; // e.g., "9:00 AM - 9:00 PM"
      const bio = parsedJson?.bio;
      if (bio) {
        setEmployeeBio(bio);
      }
      if (workingHours) {
        const [startTime, endTime] = workingHours.split(" - "); // Split into start and end times

        const formattedStartTime = convertTo24HourFormat(startTime);
        const formattedEndTime = convertTo24HourFormat(endTime);

        // Update the state variables with the extracted values
        setEmployeeShiftStartTime(parseTime(formattedStartTime)); // Trim any extra whitespace
        setEmployeeShiftEndTime(parseTime(formattedEndTime));

        // console.log(`time is   ${parseTime(formattedStartTime)}`)
      }
    } catch (err) {
      console.error("Failed to fetch users.", err);
    } finally {
      setLoading(false);
    }
  };

  // interface Time {
  //   hour: number;
  //   minute: number;
  // }
  // function extractTimeAsObject(dateTime: string): Time {
  //   const date = new Date(dateTime);

  //   return {
  //     hour: date.getHours(),
  //     minute: date.getMinutes(),
  //   };
  // }

  function extractTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${amPm}`;
  }
  // const extractDate = (dateTimeString: string): string => {
  //   const date = dateTimeString;
  //   return date.split("T")[0];
  // };
  // const extractDate = (dateTimeString: string | undefined): string => {
  //   if (!dateTimeString) {
  //     console.error("Invalid dateTimeString provided to extractDate:", dateTimeString);
  //     return "N/A"; // Fallback value if dateTimeString is undefined or null
  //   }
  //   return dateTimeString.split("T")[0]; // Extract the date portion
  // };
  const extractDate = (dateTimeString: string | undefined): string => {
    if (!dateTimeString) {
      console.error(
        "Invalid dateTimeString provided to extractDate:",
        dateTimeString,
      );
      return "N/A"; // Fallback value if dateTimeString is undefined or null
    }

    const [year, month, day] = dateTimeString.split("T")[0].split("-"); // Extract year, month, and day
    return `${day}/${month}/${year}`; // Rearrange into dd/mm/yyyy format
  };

  const fetchDoctors = async (branchId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/user/list/${branchId}`;
      const params: any = {};
      params.page = 1;
      params.pageSize = 50;
      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const transformedDoctors: AutocompleteItem[] = response.data.rows.map(
        (doctor: any) => ({
          label: doctor.name,
          value: doctor.id,
          description: `${doctor.phone} | ${doctor.email}`,
        }),
      );
      setDoctorList(transformedDoctors);
    } catch (err) {
      // setError("Failed to fetch patients.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/appointment/${userId}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const appointment = response.data;
      setAppointmentDateTime(appointment.startDateTime);
      // setAppointmentPatientId(appointment.patientId);
      setAppointmentBranch(appointment.branchId);

      // fetchUsers(appointment.doctorId);

      setDoctorId(appointment.doctorId);
      // fetchDoctors(appointment.branchId);
      setAppointmentName(appointment.name);
      setStartDateTime(appointment.startDateTime);
      setEndDateTime(appointment.endDateTime);
      setAppointmentDate(appointment.dateTime);
      setPatientId(appointment.patientId);

      // await fetchPatientById(users.patientId)
      setPatientPhoto(appointment.patient?.displayPicture);
      setPatientGender(appointment.patient?.gender);
      setPatientId(appointment.patient?.id);
      // const startTimeObject = extractTimeAsObject(users.startDateTime);
      setEmployeeName(appointment.doctor?.name);
      setAppointmentType(appointment?.type);
      // const endTimeObject = extractTimeAsObject(users.endDateTime);
      // setShiftStartTime(startTimeObject)

      // setShiftEndTime(endTimeObject)

      const startTimeObject = extractTimeDisplay(appointment.startDateTime);
      console.log(parseTime(startTimeObject));
      const endTimeObject = extractTimeDisplay(appointment.endDateTime);

      setShiftStartTime(
        appointment.startDateTime ? parseTime(startTimeObject) : null,
      );
      // setStartDateTimeDisp(startTimeObject);

      setShiftEndTime(
        appointment.endDateTime ? parseTime(endTimeObject) : null,
      );
      console.log(`time is ${parseTime(startTimeObject)}`);

      setAppointment(appointment);
    } catch (err) {
      console.error("Failed to fetch appointment.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      props.type === MODAL_TYPES.VIEW_PATIENT ||
      props.type === MODAL_TYPES.EDIT_PATIENT ||
      props.type === MODAL_TYPES.DELETE_PATIENT
    ) {
      fetchPatientById(props.userId);
      fetchLastVisitData(props.userId);
    } else if (
      props.type === MODAL_TYPES.VIEW_EMPLOYEE ||
      props.type === MODAL_TYPES.EDIT_EMPLOYEE ||
      props.type === MODAL_TYPES.DELETE_EMPLOYEE
    ) {
      fetchUsers(props.userId);
    } else if (
      props.type === MODAL_TYPES.VIEW_APPOINTMENT ||
      props.type === MODAL_TYPES.EDIT_APPOINTMENT ||
      props.type === MODAL_TYPES.DELETE_APPOINTMENT
    ) {
      fetchAppointments(props.userId);
    }
  }, [props.type, props.userId]);

  const editTime = () => {
    setEditVisitTime(!editVisitTime);
  };
  const editDoctor = () => {
    if (!editSelectedDoctor) {
      fetchDoctors(appointmentBranch); // Use the appointment's branch ID
    }

    setEditDoctor(!editSelectedDoctor);
  };

  const editName = () => {
    setPatientName(patientName);
    setEditPatient(!editSelectedPatient);
  };
  const editStatus = () => {
    setPatientStatus(patientStatus);
    setEditPatientStatus(!editSelectedPatientStatus);
  };

  const editEmail = () => {
    setPatientEmail(patientEmail);
    setEditPatientEmail(!editSelectedPatientEmail);
  };

  const editPhone = () => {
    setPatientPhone(patientPhone);
    setEditPatientPhone(!editSelectedPatientPhone);
  };

  const [editSelectedEmployeeGender, setEditSelectedEmployeeGender] =
    useState(false);

  const editEmployeeGender = () => {
    setEmployeeGender(employeeGender);
    setEditSelectedEmployeeGender(!editSelectedEmployeeGender);
  };

  useEffect(() => {
    if (props.type === MODAL_TYPES.EDIT_PATIENT) {
      const updatedData = {
        branchId: branchId,
        name: patientName,
        phone: patientPhone,
        email: patientEmail,
        bloodGroup: patientBloodGroup,
        status: patientStatus,
        notificationStatus: notificationStatus,
        dob: patientDob,
        gender: patientGender,
        dp: patientPhoto,
        document: patientDocument,
        address: patientAddress,
      };

      props.onDataChange(updatedData);
    } else if (props.type === MODAL_TYPES.EDIT_EMPLOYEE) {
      const updatedData = {
        branchId: emloyeeBranch,
        name: employeeName,
        phone: employeePhone,
        gender: employeeGender,
        email: employeeEmail,
        dp: employeePhoto,
        json: JSON.stringify({
          dob: employeeDOB,
          designation: employeeDesignation,
          workingHours: employeeShiftTime,
          bio: employeeBio,
        }),
      };
      props.onDataChange(updatedData);
    } else if (props.type === MODAL_TYPES.EDIT_APPOINTMENT) {
      const updatedData = {
        name: appointmentName,
        branchId: appointmentBranch,
        doctorId: doctorId,
        // patientId: appointmentPatientId,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        type: appointmentType,
      };
      props.onDataChange(updatedData);
    }
  }, [
    branchId,
    patientName,
    patientPhone,
    patientEmail,
    patientBloodGroup,
    patientStatus,
    notificationStatus,
    patientDob,
    patientDocument,
    patientGender,
    patientAddress,

    emloyeeBranch,
    employeeName,
    employeePhone,
    employeeEmail,
    employeeDOB,
    employeeGender,
    employeeDesignation,
    employeeBio,
    employeeShiftTime,
    appointmentName,
    appointmentBranch,
    doctorId,
    // appointmentPatientId,
    startDateTime,
    endDateTime,
  ]);

  const editBloodGroup = () => {
    setEditPatientBloodGroup(!editSelectedPatientBloodGroup);
  };

  // const handleDateChange = (newDate: ZonedDateTime) => {
  //   // setSelectedDate(newDate);
  // };

  const editEmployeeName = () => {
    setEmployeeName(employeeName);
    setEditEmployee(!editSelectedEmployee);
  };

  const editEmployeeEmail = () => {
    setEmployeeEmail(employeeEmail);
    setEditEmployeeEmail(!editSelectedEmployeeEmail);
  };

  const editEmployeePhone = () => {
    setEmployeePhone(employeePhone);
    setEditEmployeePhone(!editSelectedEmployeePhone);
  };

  const editEmployeeDesignation = () => {
    setEmployeeDesignation(employeeDesignation);
    setEditEmployeeDesignation(!editSelectedEmployeeDesignation);
  };

  const editEmployeeShiftTime = () => {
    setEmployeeShiftTime(employeeShiftTime);
    setEditEmployeeShiftTime(!editSelectedEmployeeShiftTime);
  };

  // const editEmployeeJoiningDate = (newDate: DateValue) => {
  //   // setEmployeeJoiningDate(newDate);
  // };

  // const editEmployeeTime = () => {
  //   setEditEmployeeJoiningDate(!editSelectedEmployeeJoiningDate);
  // };

  // const editEmployeeDOB = () => {
  //   setEmployeeDOB(employeeDOB);
  // };

  const editEmployeeDobTime = () => {
    setEditEmployeeDOB(!editSelectedEmployeeDOB);
  };

  // const handleProfilePhotoChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfilePhoto(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);

  //     // setSelectedFile(file)
  //     props.onProfilePhotoChange(file);
  //   }
  // };
  const [editSelectedPatientGender, setEditSelectedPatientGender] =
    useState(false);

  // const editGender = () => {
  //   setEditSelectedPatientGender(!editSelectedPatientGender);
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files ? Array.from(event.target.files) : [];
  //   const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

  //   if (validFiles.length !== files.length) {
  //     alert('Some files were too large and were not selected.');
  //   }

  //   // Concatenate new valid files with existing selected files
  //   setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
  //   props.onFilesChange([...selectedFiles, ...validFiles]);
  // };

  // const handleRemoveFile = (fileToRemove: File) => {
  //   setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  // };

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  // Add state to track custom file names
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});

  // Update on file selection
  const onDrop = (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      }
      return file;
    });
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    // Set default names (file name without extension)
    const newNames: { [key: string]: string } = {};
    filesWithPreview.forEach((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      newNames[file.name] = baseName;
    });
    setFileNames((prev) => ({ ...prev, ...newNames }));
    props.onFilesChange([...selectedFiles, ...filesWithPreview], {
      ...fileNames,
      ...newNames,
    });
  };

  // Update file name in state
  const handleFileNameChange = (fileName: string, newName: string) => {
    setFileNames((prev) => ({ ...prev, [fileName]: newName }));
  };

  // Remove file and its name
  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
    setFileNames((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: undefined, // Accept any file type
    multiple: true,
  });

  const formatDateOne = (isoString: string): string => {
    // Convert the ISO string to a Date object
    const date = new Date(isoString);
    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // const doctorsList = [
  //   {
  //     key: "1",
  //     label: "Dr. Avinash D",
  //   },
  //   {
  //     key: "2",
  //     label: "Dr. Ashika B",
  //   },
  //   {
  //     key: "3",
  //     label: "Asst Dr. Varinder",
  //   },
  //   {
  //     key: "4",
  //     label: "Dr. Asif Khan",
  //   },
  // ]; // Example doctors list

  const bloodGroupList = [
    {
      key: "1",
      label: "O+",
    },
    {
      key: "2",
      label: "B+",
    },
    {
      key: "3",
      label: "B-",
    },
    {
      key: "4",
      label: "AB+",
    },
  ];
  const statusGroupList = [
    {
      key: "1",
      label: "Active",
    },
    {
      key: "2",
      label: "Inactive",
    },
    {
      key: "3",
      label: "Blacklisted",
    },
  ];
  const [showLastVisit, setShowLastVisit] = useState(false);
  const [viewMode, setViewMode] = useState("history");

  // Add cropping state and helpers at the top of the component
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState<string | null>(null);
  // const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [croppedPhotoUrl, setCroppedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createImageElement = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = document.createElement("img");
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImageElement(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      // Show error modal or message
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // Show error modal or message
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setTempPhotoUrl(previewUrl);
    // setPhotoFile(file);
    setShowCropper(true);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels || !tempPhotoUrl) return;
    const croppedBlob = await getCroppedImg(tempPhotoUrl, croppedAreaPixels);
    if (croppedBlob) {
      const fileName = `profile-${Date.now()}.jpg`;
      const croppedFile = new File([croppedBlob], fileName, {
        type: "image/jpeg",
      });
      // setPhotoFile(croppedFile);
      const url = URL.createObjectURL(croppedBlob);
      setCroppedPhotoUrl(url);
      setShowCropper(false);
      props.onProfilePhotoChange(croppedFile);
      setProfilePhoto(url);
    }
  };

  const [appointment, setAppointment] = useState<any>(null);

  if (props.type === MODAL_TYPES.VIEW_APPOINTMENT) {
    return (
      <div>
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
          html {
            -webkit-text-size-adjust: 100%;
          }
        `}</style>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80 z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[99%] sm:max-w-[700px] mx-auto"
          shadow="sm"
        >
          <CardBody>
            <div className="relative overflow-hidden">
              <div
                className={`flex transition-transform duration-500 ease-in-out ${
                  showLastVisit ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                {/* Main Appointment View */}
                <div className="flex-shrink-0 w-full">
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                    <div className="relative col-span-6 md:col-span-4">
                      <Image
                        alt="Patient photo"
                        className="object-cover"
                        height={200}
                        shadow="md"
                        src={
                          appointment?.patient?.displayPicture
                            ? appointment.patient.displayPicture
                            : appointment?.patient?.gender === "Male"
                              ? `${AWS_URL}/docpoc-images/user-male.jpg`
                              : `${AWS_URL}/docpoc-images/user-female.jpg`
                        }
                        width="100%"
                      />
                    </div>
                    <div className="flex flex-col col-span-6 md:col-span-8 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground/90">
                          Appointment Details
                        </h3>
                        <StyledButton
                          label={"Follow-up"}
                          clickEvent={() => setShowLastVisit(true)}
                        />
                      </div>
                      <div className="space-y-3">
                        {/* Patient Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="user" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Patient Name: </strong>
                                {appointment?.patient?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Appointment Code */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="icard" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Appointment Code: </strong>
                                {appointment?.code || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Doctor Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="doctor" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Doctor: </strong>
                                {appointment?.doctor?.name ||
                                  appointment?.doctorName ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Appointment Type */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="calendar" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Type: </strong>
                                {appointment?.visitType?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Date */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="calendar" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Date: </strong>
                                {appointment?.dateTime
                                  ? extractDate(appointment.dateTime)
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Time */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-5 flex items-center justify-center">
                              <SVGIconProvider iconName="clock" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0 mt-[-6px]">
                              <p className="break-words">
                                <strong>Time: </strong>
                                {appointment?.startDateTime &&
                                appointment?.endDateTime
                                  ? `${extractTime(appointment.startDateTime)} - ${extractTime(appointment.endDateTime)}`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Patient Phone */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="phone" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0 mt-[-5px]">
                              <p className="break-words">
                                <strong>Phone: </strong>
                                {appointment?.patient?.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Patient Gender */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="user" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0 mt-[-5px]">
                              <p className="break-words">
                                <strong>Gender: </strong>
                                {appointment?.patient?.gender || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Branch Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="address" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0 mt-[-5px]">
                              <p className="break-words">
                                <strong>Branch: </strong>
                                {appointment?.branch?.hospital?.name ||
                                  appointment?.branch?.name ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous Visits View */}
                <div className="flex-shrink-0 w-full">
                  <div className="w-full">
                    <h3 className="font-semibold text-foreground/90 text-center mb-6">
                      Previous Visits
                    </h3>
                    <div className="flex flex-col center">
                      {showLastVisit &&
                        (Array.isArray(patientDocument) &&
                        patientDocument.length > 0 ? (
                          <VisitHistoryTable
                            patientId={appointment?.patient?.id || patientId}
                            viewMode={viewMode}
                            uploadedDocuments={patientDocument}
                          />
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No previous visits found.
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                      <StyledButton
                        label="Close"
                        clickEvent={() => setShowLastVisit(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_APPOINTMENT) {
    return (
      <div>
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
          .nextui-date-picker-input,
          textarea,
          .nextui-textarea {
            font-size: 16px !important;
            min-height: 44px !important;
            touch-action: manipulation;
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
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80   z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          // isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto "
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
              <div className="col-span-6 md:col-span-4">
                <Image
                  alt="Patient photo"
                  className="object-cover"
                  height={200}
                  shadow="md"
                  src={
                    patientPhoto
                      ? patientPhoto
                      : patientGender
                        ? patientGender == "Male"
                          ? `${AWS_URL}/docpoc-images/user-male.jpg`
                          : `${AWS_URL}/docpoc-images/user-female.jpg`
                        : `${AWS_URL}/docpoc-images/user-male.jpg`
                  }
                  width="100%"
                />
              </div>

              <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground/90 text-lg md:text-xl">
                    Edit Appointment Details
                  </h3>
                  {/* <StyledButton label={"Follow-up"} /> */}
                </div>

                <div className="space-y-3">
                  {/* Time Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div
                      className={`flex ${editVisitTime ? "flex-col sm:flex-row items-start sm:items-center" : "items-center"} w-full`}
                    >
                      <div className="ml-[-5px]">
                        <SVGIconProvider iconName="clock" />
                      </div>
                      <div className="ml-1 w-full">
                        {!editVisitTime && (
                          <p>
                            <strong>Visiting Time: </strong>
                            {extractTime(startDateTime)} -{" "}
                            {extractTime(endDateTime)}
                          </p>
                        )}
                        {editVisitTime && (
                          <>
                            <p>
                              <strong>Visiting Time:</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full mt-1 mb-2 gap-2">
                              <TimeInput
                                color={TOOL_TIP_COLORS.secondary}
                                label="From"
                                labelPlacement="outside"
                                variant="bordered"
                                value={shiftStartTime}
                                onChange={(time) => {
                                  handleTimeChangeAppointment(
                                    time,
                                    "startDateTime",
                                  );
                                  setShiftStartTime(time);
                                }}
                                startContent={
                                  <SVGIconProvider iconName="clock" />
                                }
                                className="w-full text-xs"
                              />
                              <TimeInput
                                color={TOOL_TIP_COLORS.secondary}
                                label="To"
                                labelPlacement="outside"
                                variant="bordered"
                                value={shiftEndTime}
                                onChange={(time) => {
                                  setShiftEndTime(time);
                                  handleTimeChangeAppointment(
                                    time,
                                    "endDateTime",
                                  );
                                }}
                                startContent={
                                  <SVGIconProvider iconName="clock" />
                                }
                                className="w-full text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        className={`flex items-center ml-2 ${editVisitTime ? "self-start sm:self-center" : ""}`}
                      >
                        {!editVisitTime && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editTime}
                          />
                        )}
                        {editVisitTime && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editTime}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Date Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="ml-[-5px] flex items-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editAppointmentDate && (
                          <p>
                            <strong>Date: </strong>
                            {formatDisplayDate(tempDate)}
                          </p>
                        )}
                        {editAppointmentDate && (
                          <CustomAppointmentDatePicker
                            label="Appointment Date"
                            labelPlacement="outside"
                            variant="bordered"
                            color="secondary"
                            isRequired={false}
                            disabled={false}
                            value={tempDate}
                            onChange={(date) => {
                              if (date) {
                                setTempDate(date);
                              }
                            }}
                            placeholder="DD/MM/YYYY"
                          />
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editAppointmentDate ? (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={() => setEditAppointmentDate(true)}
                          />
                        ) : (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={() => {
                              const newAppointmentDate = tempDate.toISOString();
                              setAppointmentDate(newAppointmentDate);
                              setStartDateTime(
                                updateDatePreservingTime(
                                  tempDate,
                                  startDateTime,
                                ),
                              );
                              setEndDateTime(
                                updateDatePreservingTime(tempDate, endDateTime),
                              );
                              setEditAppointmentDate(false);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Doctor Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="ml-[-5px] flex items-center">
                        <SVGIconProvider iconName="doctor" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedDoctor && (
                          <p>
                            <strong>Appointed Doctor: </strong> {employeeName}
                          </p>
                        )}
                        {editSelectedDoctor && (
                          <Autocomplete
                            color={TOOL_TIP_COLORS.secondary}
                            labelPlacement="outside"
                            variant="bordered"
                            isDisabled={!editSelectedDoctor}
                            defaultInputValue={employeeName}
                            defaultItems={doctorList}
                            label="Select Doctor"
                            placeholder="Search a Doctor"
                            onSelectionChange={(key) => {
                              const selectedDoctor = doctorList.find(
                                (doc) => doc.value === key,
                              );
                              setDoctorId(key as string);
                              setEmployeeName(selectedDoctor?.label || "");
                            }}
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
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedDoctor && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editDoctor}
                          />
                        )}
                        {editSelectedDoctor && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editDoctor}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Follow-up Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="ml-[-5px] flex items-center">
                        <SVGIconProvider iconName="followup" />
                      </div>
                      <div className="ml-2 w-full">
                        <p>
                          <strong>Follow-up: </strong> Yes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_APPOINTMENT) {
    return (
      <div>
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
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80 z-50">
              <Spinner />
            </div>
          )}
        </div>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this appointment?
        </h2>

        <div className="flex flex-col space-y-4 mt-4">
          <div className="space-y-3">
            {/* Patient Name */}
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SVGIconProvider iconName="user" />
              </div>
              <div className="ml-2 flex-1 min-w-0 mt-[-10px]">
                <p className="break-words">
                  <strong>Patient Name: </strong>
                  {appointment?.patient?.name || appointmentName || "N/A"}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SVGIconProvider iconName="clock" />
              </div>
              <div className="ml-2 flex-1 min-w-0 mt-[-10px]">
                <p className="break-words">
                  <strong>Visit Time: </strong>
                  {extractTime(appointmentDateTime)}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SVGIconProvider iconName="calendar" />
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <p className="break-words">
                  <strong>Date: </strong>
                  {extractDate(appointmentDateTime)}
                </p>
              </div>
            </div>

            {/* Doctor */}
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SVGIconProvider iconName="doctor" />
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <p className="break-words">
                  <strong>Appointed Doctor: </strong>
                  {employeeName}
                </p>
              </div>
            </div>

            {/* Follow-up */}
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <SVGIconProvider iconName="followup" />
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <p className="break-words">
                  <strong>Follow-up: </strong>
                  Yes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // const [showLastVisit, setShowLastVisit] = useState(false);

  if (props.type === MODAL_TYPES.VIEW_PATIENT) {
    return (
      <div>
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
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80   z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          // isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[99%]  sm:max-w-[800px] mx-auto"
          shadow="sm"
        >
          <CardBody>
            <div className="relative overflow-hidden">
              <div
                className={`flex transition-transform duration-500 ease-in-out ${
                  showLastVisit ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                <div className="flex-shrink-0 w-full">
                  {/* patient details */}
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                    <div className="relative col-span-6 md:col-span-4">
                      <Image
                        alt="Patient photo"
                        className="object-cover"
                        height={200}
                        shadow="md"
                        src={
                          profilePhoto
                            ? profilePhoto
                            : patientGender
                              ? patientGender === "Male"
                                ? `${AWS_URL}/docpoc-images/user-male.jpg`
                                : `${AWS_URL}/docpoc-images/user-female.jpg`
                              : `${AWS_URL}/docpoc-images/user-male.jpg`
                        }
                        width="100%"
                      />
                    </div>

                    <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground/90">
                          Patient Details
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {/* Patient Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="user" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Patient Name: </strong>
                                {formatFieldValue(patientName)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Patient Code (read-only, label + value) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="icard" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Patient Code: </strong>
                                {formatFieldValue(patientCode)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="phone" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Phone: </strong>
                                {formatFieldValue(patientPhone)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="email" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Email: </strong>
                                {patientEmail ? patientEmail : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Blood Group */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="blood-drop" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Blood Group: </strong>
                                {formatFieldValue(patientBloodGroup)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Age */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="birthday" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Age: </strong>
                                {formatFieldValue(patientAge)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="calendar" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Date of Birth: </strong>
                                {formatFieldValue(
                                  patientDob
                                    ? formatDateToDDMMYYYY(patientDob)
                                    : "",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="user" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Gender: </strong>
                                {formatFieldValue(patientGender)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="address" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Address: </strong>
                                {formatFieldValue(patientAddress)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-start w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="calendar" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Status: </strong>
                                {formatFieldValue(patientStatus)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Last Visit (read-only, label + value) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="clock" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Last Visit: </strong>
                                {formatFieldValue(lastVisit)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Last Appointed Doctor (read-only, label + value) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                              <SVGIconProvider iconName="doctor" />
                            </div>
                            <div className="ml-2 flex-1 min-w-0">
                              <p className="break-words">
                                <strong>Last Appointed Doctor: </strong>
                                {formatFieldValue(lastAppointedDoctor)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* <div className="flex items-center"> 
                        <Accordion variant="splitted">
                      <AccordionItem
                        key="1"
                        aria-label="Previous visits"
                        title="Previous visits"
                      >
                        <VisitHistoryTable patientId={patientId} />
                      </AccordionItem>
                    </Accordion>
                        <p
                            onClick={setShowLastVisit(true)}
                            className="text-sm sm:text-medium ml-2 underline cursor-pointer"
                          >
                            <strong>See last visit</strong>
                          </p>
                         
                        </div> */}

                        <div className="flex items-center">
                          <p
                            onClick={() => {
                              // fetchLastVisitData(props.userId)
                              setShowLastVisit(true);
                              setViewMode("history");
                            }}
                            className="text-sm sm:text-medium ml-2 underline cursor-pointer"
                          >
                            <strong>See Previous Visits</strong>
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p
                            onClick={() => {
                              // fetchLastVisitData(props.userId)
                              setShowLastVisit(true);
                              setViewMode("documents");
                            }}
                            className="text-sm sm:text-medium ml-2 underline cursor-pointer"
                          >
                            <strong>See Uploaded Documents</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full">
                  <div className="w-full">
                    {/* <h3 className="font-semibold text-foreground/90 text-center mb-6">
                      Previous Visits
                    </h3> */}
                    <h3 className="font-semibold text-foreground/90 text-center mb-6">
                      {viewMode === "history"
                        ? "Previous Visits"
                        : "Uploaded Documents"}
                    </h3>

                    <div className="flex flex-col center">
                      {showLastVisit && (
                        <VisitHistoryTable
                          patientId={patientId}
                          viewMode={
                            viewMode === "documents" ? "documents" : viewMode
                          }
                          uploadedDocuments={patientDocument}
                        />
                      )}
                    </div>

                    <div className="flex justify-end mt-6">
                      <StyledButton
                        label="Close"
                        clickEvent={() => setShowLastVisit(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_PATIENT) {
    return (
      <div>
        {showCropper && tempPhotoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">
                Crop your profile picture
              </h3>
              <div className="relative h-64 w-full">
                <Cropper
                  image={tempPhotoUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm mb-2">Zoom:</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  color="danger"
                  onPress={() => {
                    setShowCropper(false);
                    setTempPhotoUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  variant="light"
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveCroppedImage}>
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}
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
          html {
            -webkit-text-size-adjust: 100%;
          }
          /* Manual mobile/iPhone responsive styles for DatePicker and Textarea */
          .nextui-date-picker-input,
          textarea,
          .nextui-textarea {
            font-size: 16px !important;
            min-height: 44px !important;
            touch-action: manipulation;
          }
        `}</style>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80 z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
              <div className="relative col-span-6 md:col-span-4">
                <div className="relative flex justify-center items-center w-[160px] h-[160px] mx-auto sm:w-[160px] sm:h-[160px] md:w-[160px] md:h-[160px]">
                  <Image
                    src={
                      croppedPhotoUrl || profilePhoto
                        ? profilePhoto
                        : patientGender
                          ? patientGender === "Male"
                            ? `${AWS_URL}/docpoc-images/user-male.jpg`
                            : `${AWS_URL}/docpoc-images/user-female.jpg`
                          : `${AWS_URL}/docpoc-images/user-male.jpg`
                    }
                    width={160}
                    height={160}
                    className="rounded-full object-cover w-[160px] h-[160px] sm:w-[160px] sm:h-[160px] md:w-[160px] md:h-[160px]"
                    alt="profile"
                  />
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 w-9 h-9 sm:w-8 sm:h-8 cursor-pointer z-10 transition duration-200"
                  >
                    <SVGIconProvider
                      iconName="camera"
                      color={GLOBAL_ICON_COLOR_WHITE}
                    />
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={handlePhotoChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground/90">
                    Patient Details
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* Patient Name (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        {!editSelectedPatient && (
                          <p className="break-words">
                            <strong>Name: </strong>
                            {patientName}
                          </p>
                        )}
                        {editSelectedPatient && (
                          <>
                            <p className="mb-1">
                              <strong>Name:</strong>
                            </p>
                            <Input
                              type="text"
                              placeholder="Patient name.."
                              labelPlacement="outside"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                            />
                          </>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {!editSelectedPatient && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editName}
                          />
                        )}
                        {editSelectedPatient && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editName}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Patient Code (read-only) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="icard" />
                      </div>
                      <p className="break-words ml-2">
                        <strong>Patient Code: </strong>
                      </p>
                      <div className="ml-2 flex-1 min-w-0">
                        <Input
                          type="text"
                          value={formatFieldValue(patientCode)}
                          labelPlacement="outside"
                          disabled
                          className="w-full text-xs"
                          aria-label="Patient Code"
                          startContent={null}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Phone (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="phone" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedPatientPhone && (
                          <p>
                            <strong>Phone: </strong> {patientPhone}
                          </p>
                        )}
                        {editSelectedPatientPhone && (
                          <>
                            <p>
                              <strong>Phone:</strong>
                            </p>
                            <div className="flex items-center w-full mt-1 mb-2">
                              <Input
                                type="text"
                                placeholder="Patient phone.."
                                labelPlacement="outside"
                                value={patientPhone}
                                maxLength={10}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  setPatientPhone(value);
                                  if (value.length !== 10) {
                                    setPatientPhoneError(
                                      "Phone number must be 10 digits",
                                    );
                                  } else {
                                    setPatientPhoneError("");
                                  }
                                }}
                                className="w-full text-xs"
                                isInvalid={!!patientPhoneError}
                                errorMessage={patientPhoneError}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedPatientPhone && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editPhone}
                          />
                        )}
                        {editSelectedPatientPhone && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editPhone}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="email" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedPatientEmail &&
                          (patientEmail && patientEmail.trim() !== "" ? (
                            <p>
                              <strong>Email: </strong> {patientEmail}
                            </p>
                          ) : (
                            <div className="flex items-center">
                              <strong className="mr-1">Email:</strong>
                              <Input
                                type="text"
                                value="N/A"
                                labelPlacement="outside"
                                disabled
                                className="w-full text-xs"
                              />
                            </div>
                          ))}
                        {editSelectedPatientEmail && (
                          <>
                            <p>
                              <strong>Email:</strong>
                            </p>
                            <div className="flex items-center w-full mt-1 mb-2">
                              <Input
                                type="email"
                                placeholder="Patient email.."
                                labelPlacement="outside"
                                value={patientEmail}
                                onChange={(e) =>
                                  setPatientEmail(e.target.value)
                                }
                                className="w-full text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedPatientEmail && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editEmail}
                          />
                        )}
                        {editSelectedPatientEmail && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editEmail}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Blood Group (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="blood-drop" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedPatientBloodGroup && (
                          <p>
                            <strong>Blood Group: </strong>{" "}
                            {patientBloodGroup === null ||
                            patientBloodGroup === "" ||
                            patientBloodGroup === "{}"
                              ? "N/A"
                              : patientBloodGroup}
                          </p>
                        )}
                        {editSelectedPatientBloodGroup && (
                          <>
                            <p>
                              <strong>Blood Group:</strong>
                            </p>
                            <div className="flex items-center w-full mt-1 mb-2">
                              <Autocomplete
                                color={TOOL_TIP_COLORS.secondary}
                                isDisabled={!editSelectedPatientBloodGroup}
                                labelPlacement="outside"
                                variant="bordered"
                                size="sm"
                                defaultItems={bloodGroupList.map((bg) => ({
                                  label: bg.label,
                                  value: bg.label,
                                }))}
                                label="Select Blood Group"
                                placeholder={
                                  patientBloodGroup || "Select Blood Group"
                                }
                                className="w-full text-xs min-w-[80px]"
                                onSelectionChange={(key) => {
                                  setPatientBloodGroup(key as string);
                                }}
                              >
                                {({ label, value }) => (
                                  <AutocompleteItem
                                    key={value}
                                    variant="shadow"
                                    color={TOOL_TIP_COLORS.secondary}
                                    className="text-xs"
                                  >
                                    {label}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedPatientBloodGroup && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editBloodGroup}
                          />
                        )}
                        {editSelectedPatientBloodGroup && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editBloodGroup}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Date of Birth (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        {!editSelectedPatientDob && (
                          <p className="break-words">
                            <strong>Date of Birth: </strong>
                            {patientDob
                              ? formatDateToDDMMYYYY(patientDob)
                              : "N/A"}
                          </p>
                        )}
                        {editSelectedPatientDob && (
                          <>
                            <p className="mb-1">
                              <strong>Date of Birth:</strong>
                            </p>
                            <CustomDatePicker
                              placeholder="DD/MM/YYYY"
                              value={patientDob ? new Date(patientDob) : null}
                              onChange={(date) => {
                                if (date) {
                                  // Create date in local timezone to avoid timezone issues
                                  const year = date.getFullYear();
                                  const month = String(
                                    date.getMonth() + 1,
                                  ).padStart(2, "0");
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0",
                                  );
                                  const formattedDate = `${year}-${month}-${day}`;
                                  setPatientDob(formattedDate);
                                } else {
                                  setPatientDob("");
                                }
                              }}
                              maxDate={new Date()}
                              className="w-full"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {!editSelectedPatientDob && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={() => setEditSelectedPatientDob(true)}
                          />
                        )}
                        {editSelectedPatientDob && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={() => setEditSelectedPatientDob(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Gender (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedPatientGender && (
                          <p>
                            <strong>Gender: </strong> {patientGender}
                          </p>
                        )}
                        {editSelectedPatientGender && (
                          <>
                            <p>
                              <strong>Gender:</strong>
                            </p>
                            <div className="flex items-center w-full mt-1 mb-2">
                              <Autocomplete
                                color={TOOL_TIP_COLORS.secondary}
                                isDisabled={!editSelectedPatientGender}
                                labelPlacement="outside"
                                variant="bordered"
                                size="sm"
                                defaultItems={[
                                  { label: "Male", value: "Male" },
                                  { label: "Female", value: "Female" },
                                  { label: "Other", value: "Other" },
                                ]}
                                label="Select Gender"
                                placeholder={patientGender || "Select Gender"}
                                className="w-full text-xs min-w-[80px]"
                                onSelectionChange={(key) => {
                                  const selected = key as string;
                                  setPatientGender(selected || "");
                                }}
                              >
                                {({ label, value }) => (
                                  <AutocompleteItem
                                    key={value}
                                    variant="shadow"
                                    color={TOOL_TIP_COLORS.secondary}
                                    className="text-xs"
                                  >
                                    {label}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedPatientGender && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={() =>
                              setEditSelectedPatientGender(true)
                            }
                          />
                        )}
                        {editSelectedPatientGender && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={() =>
                              setEditSelectedPatientGender(false)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Address (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="address" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        {!editSelectedPatientAddress && (
                          <p className="break-words">
                            <strong>Address: </strong>
                            {patientAddress}
                          </p>
                        )}
                        {editSelectedPatientAddress && (
                          <>
                            <p className="mb-1">
                              <strong>Address:</strong>
                            </p>
                            <Textarea
                              id="patient-address"
                              label="Address"
                              labelPlacement="outside"
                              placeholder="Enter patient address..."
                              value={patientAddress}
                              onChange={(e) =>
                                setPatientAddress(e.target.value)
                              }
                              minRows={2}
                              maxRows={5}
                              className="w-full text-xs"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {!editSelectedPatientAddress && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={() =>
                              setEditSelectedPatientAddress(true)
                            }
                          />
                        )}
                        {editSelectedPatientAddress && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={() =>
                              setEditSelectedPatientAddress(false)
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status (editable) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 w-full">
                        {!editSelectedPatientStatus && (
                          <p>
                            <strong>Status: </strong> {patientStatus}
                          </p>
                        )}
                        {editSelectedPatientStatus && (
                          <>
                            <p>
                              <strong>Status:</strong>
                            </p>
                            <div className="flex items-center w-full mt-1 mb-2">
                              <Autocomplete
                                color={TOOL_TIP_COLORS.secondary}
                                isDisabled={!editSelectedPatientStatus}
                                labelPlacement="outside"
                                variant="bordered"
                                size="sm"
                                defaultItems={statusGroupList.map((st) => ({
                                  label: st.label,
                                  value: st.label,
                                }))}
                                label="Select Status"
                                placeholder={patientStatus || "Select Status"}
                                className="w-full text-xs min-w-[80px]"
                                onSelectionChange={(key) => {
                                  setPatientStatus(key as string);
                                }}
                              >
                                {({ label, value }) => (
                                  <AutocompleteItem
                                    key={value}
                                    variant="shadow"
                                    color={TOOL_TIP_COLORS.secondary}
                                    className="text-xs"
                                  >
                                    {label}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        {!editSelectedPatientStatus && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editStatus}
                          />
                        )}
                        {editSelectedPatientStatus && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editStatus}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Last Visit (read-only) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="clock" />
                      </div>
                      <p className="break-words ml-2">
                        <strong>Last Visit: </strong>
                      </p>
                      <div className="ml-2 flex-1 min-w-0">
                        <Input
                          type="text"
                          value={formatFieldValue(lastVisit)}
                          labelPlacement="outside"
                          disabled
                          className="w-full text-xs"
                          aria-label="Last Visit"
                          startContent={null}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Last Appointed Doctor (read-only) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="doctor" />
                      </div>
                      <p className="break-words ml-2">
                        <strong> Last Appointed Doctor: </strong>
                      </p>
                      <div className="ml-2 flex-1 min-w-0">
                        <Input
                          type="text"
                          value={formatFieldValue(lastAppointedDoctor)}
                          labelPlacement="outside"
                          disabled
                          className="w-full text-xs"
                          aria-label="Last Appointed Doctor"
                          startContent={null}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Email (editable) */}

                  {/* File upload and preview section remains unchanged */}
                  <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-400 bg-gray-100 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5">
                    {/* File Preview Section */}
                    <div className="flex flex-wrap gap-4">
                      {files.map((file) => {
                        // const fileExtension = file.name.split(".").pop();
                        // const trimmedFileName =
                        //   file.name.length > 8
                        //     ? file.name.substring(0, 7) + "." + fileExtension
                        //     : file.name + "." + fileExtension;
                        return (
                          <div
                            key={file.name}
                            className="relative flex flex-col items-center justify-center w-[100px] h-[100px] border border-gray-100 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-default-100 text-center shadow-md"
                          >
                            {/* Remove Button*/}
                            <button
                              onClick={() => removeFile(file.name)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              X
                            </button>
                            {/* preview for image files */}
                            {file.type.startsWith("image/") && file.preview && (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-10 object-cover rounded-md"
                              />
                            )}
                            {!file.type.startsWith("image/") && (
                              <div className="flex flex-col items-center">
                                <SVGIconProvider iconName="document" />
                              </div>
                            )}
                            {/* Editable file name input */}
                            <input
                              type="text"
                              className="mt-2 text-xs border rounded px-1 py-0.5 w-full text-center border-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={fileNames[file.name] || ""}
                              onChange={(e) =>
                                handleFileNameChange(file.name, e.target.value)
                              }
                              maxLength={32}
                              placeholder="Document name"
                            />
                          </div>
                        );
                      })}
                    </div>
                    {/* Drag-and-Drop Area */}
                    <div
                      {...getRootProps()}
                      className={`mt-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 sm:p-8 bg-gray-50 hover:border-primary dark:bg-dark-2 dark:border-dark-3 dark:hover:border-primary`}
                    >
                      <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-gray-300 bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <SVGIconProvider
                          iconName="upload"
                          color={GLOBAL_ACTION_ICON_COLOR}
                        />
                      </span>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-green-600 mt-4">
                          Drop the files here...
                        </p>
                      ) : (
                        <p className="text-gray-600 mt-4 text-sm sm:text-base">
                          Drag & drop some files here, or click to select files
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_PATIENT) {
    return (
      <div>
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
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-background/80 dark:bg-default-100/80   z-50">
              <Spinner />
            </div>
          )}
        </div>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this patient?
        </h2>
        <Card
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[99%]  sm:max-w-[800px] mx-auto mt-4"
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
              <div className="relative col-span-6 md:col-span-4">
                <Image
                  alt="Patient photo"
                  className="object-cover"
                  height={200}
                  shadow="md"
                  src={
                    profilePhoto
                      ? profilePhoto
                      : patientGender
                        ? patientGender === "Male"
                          ? `${AWS_URL}/docpoc-images/user-male.jpg`
                          : `${AWS_URL}/docpoc-images/user-female.jpg`
                        : `${AWS_URL}/docpoc-images/user-male.jpg`
                  }
                  width="100%"
                />
              </div>
              <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground/90">
                    Patient Details
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* Patient Name */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Patient Name: </strong>
                          {formatFieldValue(patientName)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Patient Code */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="icard" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Patient Code: </strong>
                          {formatFieldValue(patientCode)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="phone" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Phone: </strong>
                          {formatFieldValue(patientPhone)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="email" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Email: </strong>
                          {patientEmail ? patientEmail : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Blood Group */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="blood-drop" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Blood Group: </strong>
                          {formatFieldValue(patientBloodGroup)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Age */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="birthday" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Age: </strong>
                          {formatFieldValue(patientAge)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Date of Birth: </strong>
                          {formatFieldValue(
                            patientDob ? formatDateToDDMMYYYY(patientDob) : "",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Gender: </strong>
                          {formatFieldValue(patientGender)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="address" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Address: </strong>
                          {formatFieldValue(patientAddress)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Status: </strong>
                          {formatFieldValue(patientStatus)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Last Visit */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="clock" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Last Visit: </strong>
                          {formatFieldValue(lastVisit)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Last Appointed Doctor */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <SVGIconProvider iconName="doctor" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Last Appointed Doctor: </strong>
                          {formatFieldValue(lastAppointedDoctor)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (props.type === MODAL_TYPES.VIEW_EMPLOYEE) {
    return (
      <div>
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
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center   z-50 bg-background/80 dark:bg-default-100/80 ">
            <Spinner size="lg" />
          </div>
        ) : (
          <Card
            // isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                <div className="relative col-span-6 md:col-span-4">
                  <Image
                    alt="Patient photo"
                    className="object-cover"
                    height={200}
                    shadow="md"
                    // src={employeePhoto ? employeePhoto : employeeGender == "Male" ? `https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/user-male.jpg` : "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/user-female.jpg"}

                    src={
                      profilePhoto
                        ? profilePhoto
                        : employeeGender
                          ? employeeGender === "Male"
                            ? `${AWS_URL}/docpoc-images/user-male.jpg`
                            : `${AWS_URL}/docpoc-images/user-female.jpg`
                          : `${AWS_URL}/docpoc-images/user-male.jpg`
                    }
                    width="100%"
                  />
                </div>

                <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground/90">
                      Employee Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Name */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Name: </strong>
                          {employeeName}
                        </p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="email" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Email: </strong>
                          {employeeEmail}
                        </p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="phone" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Phone: </strong>+91- {employeePhone}
                        </p>
                      </div>
                    </div>
                    {/* Gender */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="user" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Gender: </strong>
                          {employeeGender}
                        </p>
                      </div>
                    </div>
                    {/* Designation */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="icard" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Designation: </strong>
                          {employeeDesignation}
                        </p>
                      </div>
                    </div>
                    {/* Working Hours */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="clock" />
                      </div>
                      <div className="ml-1 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Working Hours: </strong>
                          {employeeShiftTime}
                        </p>
                      </div>
                    </div>
                    {/* Joined On */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="calendar" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Joined On: </strong>{" "}
                          {formatDateOne(employeeJoiningDate)}
                        </p>
                      </div>
                    </div>
                    {/* Access Type */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-10px] mt-1 flex items-center">
                        <SVGIconProvider iconName="key" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Access Type: </strong>Super-Admin
                        </p>
                      </div>
                    </div>
                    {/* Date Of Birth */}
                    <div className="flex items-center w-full mb-2">
                      <div className="ml-[-5px] mt-1 flex items-center">
                        <SVGIconProvider iconName="birthday" />
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                        <p className="break-words">
                          <strong>Date Of Birth: </strong>
                          {employeeDOB}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_EMPLOYEE) {
    return (
      <div>
        {showCropper && tempPhotoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">
                Crop your profile picture
              </h3>
              <div className="relative h-64 w-full">
                <Cropper
                  image={tempPhotoUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm mb-2">Zoom:</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  color="danger"
                  onPress={() => {
                    setShowCropper(false);
                    setTempPhotoUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  variant="light"
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveCroppedImage}>
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}

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
          .nextui-date-picker-input {
            font-size: 16px !important;
            touch-action: manipulation;
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
          /* Add missing mobile/iOS styles for DatePicker and Textarea */
          .nextui-date-picker-input {
            font-size: 16px !important;
            touch-action: manipulation;
            min-height: 44px !important;
          }
          .nextui-textarea {
            font-size: 16px !important;
            touch-action: manipulation;
            min-height: 44px !important;
          }
        `}</style>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center  z-50 bg-background/80 dark:bg-default-100/80 ">
            <Spinner size="lg" />
          </div>
        ) : (
          <Card
            // isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                <div className="col-span-6 md:col-span-4">
                  <div className="relative flex justify-center items-center w-[160px] h-[160px] mx-auto sm:w-[160px] sm:h-[160px] md:w-[160px] md:h-[160px]">
                    <Image
                      src={
                        croppedPhotoUrl ||
                        profilePhoto ||
                        (employeeGender === "Male"
                          ? `${AWS_URL}/docpoc-images/user-male.jpg`
                          : `${AWS_URL}/docpoc-images/user-female.jpg`)
                      }
                      width={160}
                      height={160}
                      className="rounded-full object-cover w-[160px] h-[160px] sm:w-[160px] sm:h-[160px] md:w-[160px] md:h-[160px]"
                      alt="profile"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 w-9 h-9 sm:w-8 sm:h-8 cursor-pointer z-10 transition duration-200"
                    >
                      <SVGIconProvider
                        iconName="camera"
                        color={GLOBAL_ICON_COLOR_WHITE}
                      />
                      <input
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        className="sr-only"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground/90">
                      Employee Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="user" />
                        </div>
                        <div className="ml-2 w-full">
                          {!editSelectedEmployee && (
                            <p>
                              <strong>Name: </strong> {employeeName}
                            </p>
                          )}
                          {editSelectedEmployee && (
                            <>
                              <p>
                                <strong>Name:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <Input
                                  type="text"
                                  placeholder="Patient name.."
                                  labelPlacement="outside"
                                  value={employeeName}
                                  onChange={(e) =>
                                    setEmployeeName(e.target.value)
                                  }
                                  className="w-full text-xs"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center ml-2">
                          {!editSelectedEmployee && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeName}
                            />
                          )}
                          {editSelectedEmployee && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeName}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-start w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="email" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          {!editSelectedEmployeeEmail && (
                            <p className="break-words">
                              <strong>Email: </strong> {employeeEmail}
                            </p>
                          )}
                          {editSelectedEmployeeEmail && (
                            <>
                              <p>
                                <strong>Email:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <Input
                                  type="email"
                                  placeholder="Employee email.."
                                  labelPlacement="outside"
                                  value={employeeEmail}
                                  onChange={(e) =>
                                    setEmployeeEmail(e.target.value)
                                  }
                                  className="w-full text-xs"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-start ml-2 flex-shrink-0">
                          {!editSelectedEmployeeEmail && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeEmail}
                            />
                          )}
                          {editSelectedEmployeeEmail && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeEmail}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="phone" />
                        </div>
                        <div className="ml-2 w-full">
                          {!editSelectedEmployeePhone && (
                            <p>
                              <strong>Phone: </strong> {employeePhone}
                            </p>
                          )}
                          {editSelectedEmployeePhone && (
                            <>
                              <p>
                                <strong>Phone:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <Input
                                  type="text"
                                  placeholder="Employee phone.."
                                  labelPlacement="outside"
                                  value={employeePhone}
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      "",
                                    );
                                    setEmployeePhone(value);
                                    if (value.length !== 10) {
                                      setEmployeePhoneError(
                                        "Phone number must be 10 digits",
                                      );
                                    } else {
                                      setEmployeePhoneError("");
                                    }
                                  }}
                                  className="w-full text-xs"
                                  isInvalid={!!employeePhoneError}
                                  errorMessage={employeePhoneError}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center ml-2">
                          {!editSelectedEmployeePhone && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeePhone}
                            />
                          )}
                          {editSelectedEmployeePhone && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeePhone}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex items-center">
                      <div style={{ marginLeft: -5 }}>
                        <SVGIconProvider iconName="user" />
                      </div>

                      {!editSelectedEmployeeGender && (
                        <p className="text-sm sm:text-medium ml-2">
                          <strong>Gender: </strong> {employeeGender}
                        </p>
                      )}

                      {editSelectedEmployeeGender && (
                        <>
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Gender:</strong>
                          </p>
                          <div
                            className="flex items-center"
                            style={{ marginLeft: 10 }}
                          >
                            <Autocomplete
                              color={TOOL_TIP_COLORS.secondary}
                              isDisabled={!editSelectedEmployeeGender}
                              labelPlacement="outside"
                              variant="bordered"
                              defaultItems={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                              ]} // Gender options
                              label="Select Gender"
                              placeholder={employeeGender || "Select Gender"}
                              onSelectionChange={(key) => {
                                const selected = key as string; // Cast 'key' to a string
                                setEmployeeGender(selected || "");
                              }}
                            >
                              {({ label, value }) => (
                                <AutocompleteItem
                                  key={value}
                                  variant="shadow"
                                  color={TOOL_TIP_COLORS.secondary}
                                >
                                  {label}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                          </div>
                        </>
                      )}

                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        {!editSelectedEmployeeGender && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editEmployeeGender}
                          />
                        )}
                        {editSelectedEmployeeGender && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editEmployeeGender}
                          />
                        )}
                      </div>
                    </div> */}

                    {/* Gender */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="user" />
                        </div>
                        <div className="ml-2 w-full">
                          {!editSelectedEmployeeGender && (
                            <p>
                              <strong>Gender: </strong> {employeeGender}
                            </p>
                          )}
                          {editSelectedEmployeeGender && (
                            <>
                              <p>
                                <strong>Gender:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <Autocomplete
                                  color={TOOL_TIP_COLORS.secondary}
                                  isDisabled={!editSelectedEmployeeGender}
                                  labelPlacement="outside"
                                  variant="bordered"
                                  size="sm"
                                  defaultItems={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                    { label: "Other", value: "Other" },
                                  ]}
                                  label="Select Gender"
                                  placeholder={
                                    employeeGender || "Select Gender"
                                  }
                                  className="w-full text-xs min-w-[80px]"
                                  onSelectionChange={(key) => {
                                    const selected = key as string;
                                    setEmployeeGender(selected || "");
                                  }}
                                >
                                  {({ label, value }) => (
                                    <AutocompleteItem
                                      key={value}
                                      variant="shadow"
                                      color={TOOL_TIP_COLORS.secondary}
                                      className="text-xs"
                                    >
                                      {label}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center ml-2">
                          {!editSelectedEmployeeGender && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeGender}
                            />
                          )}
                          {editSelectedEmployeeGender && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeGender}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex items-center">
                    
                      <div style={{ marginLeft: -5 }}>
                        <SVGIconProvider iconName="doctor" />
                      </div>

                      {!editSelectedEmployeeDesignation && (
                        <p className="text-sm sm:text-medium ml-2">
                          <strong>Designation: </strong> {employeeDesignation}
                        </p>
                      )}
                      {editSelectedEmployeeDesignation && (
                        <>
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Designation:</strong>
                          </p>
                          <div
                            className="flex items-center"
                            style={{ marginLeft: 10 }}
                          >
                           
                            <Autocomplete
                              color={TOOL_TIP_COLORS.secondary}
                              isDisabled={!editSelectedEmployeeDesignation}
                              labelPlacement="outside"
                              variant="bordered"
                              defaultItems={designations} 
                              label="Select Designation"
                              placeholder={
                                employeeDesignation || "Search Designation"
                              }
                           
                              onSelectionChange={(key) => {
                                const selected = designations.find(
                                  (designation) => designation.value === key,
                                );
                              
                                setEmployeeDesignation(selected?.label || "");
                              
                              }}
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={item.value}
                                  variant="shadow"
                                  color={TOOL_TIP_COLORS.secondary}
                                >
                                  {item.label}{" "}
                               
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                          </div>
                        </>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        {!editSelectedEmployeeDesignation && (
                          <IconButton
                            iconName="edit"
                            color={GLOBAL_DANGER_COLOR}
                            clickEvent={editEmployeeDesignation}
                          />
                        )}
                        {editSelectedEmployeeDesignation && (
                          <IconButton
                            iconName="followup"
                            color={GLOBAL_SUCCESS_COLOR}
                            clickEvent={editEmployeeDesignation}
                          />
                        )}
                      </div>
                    </div> */}

                    {/* Designation */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="doctor" />
                        </div>
                        <div className="ml-2 w-full">
                          {!editSelectedEmployeeDesignation && (
                            <p>
                              <strong>Designation: </strong>{" "}
                              {employeeDesignation}
                            </p>
                          )}
                          {editSelectedEmployeeDesignation && (
                            <>
                              <p>
                                <strong>Designation:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <Autocomplete
                                  color={TOOL_TIP_COLORS.secondary}
                                  isDisabled={!editSelectedEmployeeDesignation}
                                  labelPlacement="outside"
                                  variant="bordered"
                                  defaultItems={designations}
                                  label="Select Designation"
                                  placeholder={
                                    employeeDesignation || "Search Designation"
                                  }
                                  className="w-full text-xs"
                                  onSelectionChange={(key) => {
                                    const selected = designations.find(
                                      (designation) =>
                                        designation.value === key,
                                    );
                                    setEmployeeDesignation(
                                      selected?.label || "",
                                    );
                                  }}
                                >
                                  {(item) => (
                                    <AutocompleteItem
                                      key={item.value}
                                      variant="shadow"
                                      color={TOOL_TIP_COLORS.secondary}
                                      className="text-xs"
                                    >
                                      {item.label}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center ml-2">
                          {!editSelectedEmployeeDesignation && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeDesignation}
                            />
                          )}
                          {editSelectedEmployeeDesignation && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeDesignation}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div
                        className={`flex ${editSelectedEmployeeShiftTime ? "flex-col sm:flex-row items-start sm:items-center" : "items-center"} w-full`}
                      >
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="clock" />
                        </div>

                        <div className="ml-1 w-full">
                          {!editSelectedEmployeeShiftTime && (
                            <p>
                              <strong>Working Hours: </strong>{" "}
                              {employeeShiftTime}
                            </p>
                          )}
                          {editSelectedEmployeeShiftTime && (
                            <>
                              <p>
                                <strong>Working Hours:</strong>
                              </p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full mt-1 mb-2 gap-2">
                                <TimeInput
                                  color={TOOL_TIP_COLORS.secondary}
                                  label="From"
                                  labelPlacement="outside"
                                  variant="bordered"
                                  value={employeeShiftStartTime}
                                  startContent={
                                    <SVGIconProvider iconName="clock" />
                                  }
                                  onChange={(e) => {
                                    handleTimeChange("start", e.toString());
                                    setEmployeeShiftStartTime(e);
                                  }}
                                  isDisabled={!editSelectedEmployeeShiftTime}
                                  className="w-full text-xs"
                                />
                                <TimeInput
                                  color={TOOL_TIP_COLORS.secondary}
                                  label="To"
                                  labelPlacement="outside"
                                  variant="bordered"
                                  value={employeeShiftEndTime}
                                  startContent={
                                    <SVGIconProvider iconName="clock" />
                                  }
                                  onChange={(e) => {
                                    handleTimeChange("end", e.toString());
                                    setEmployeeShiftEndTime(e);
                                  }}
                                  isDisabled={!editSelectedEmployeeShiftTime}
                                  className="w-full text-xs"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className={`flex items-center ml-2 ${editSelectedEmployeeShiftTime ? "self-start sm:self-center" : ""}`}
                        >
                          {!editSelectedEmployeeShiftTime && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeShiftTime}
                            />
                          )}
                          {editSelectedEmployeeShiftTime && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeShiftTime}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Date Of Birth */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div
                        className={`flex ${editSelectedEmployeeDOB ? "flex-col sm:flex-row items-start sm:items-center" : "items-center"} w-full`}
                      >
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="birthday" />
                        </div>
                        <div className="ml-2 w-full">
                          {!editSelectedEmployeeDOB && (
                            <p>
                              <strong>Date Of Birth: </strong> {employeeDOB}
                            </p>
                          )}
                          {editSelectedEmployeeDOB && (
                            <>
                              <p>
                                <strong>Date Of Birth:</strong>
                              </p>
                              <div className="flex items-center w-full mt-1 mb-2">
                                <CustomDatePicker
                                  placeholder="DD/MM/YYYY"
                                  value={
                                    employeeDOB ? new Date(employeeDOB) : null
                                  }
                                  onChange={(date) => {
                                    if (date) {
                                      // Create date in local timezone to avoid timezone issues
                                      const year = date.getFullYear();
                                      const month = String(
                                        date.getMonth() + 1,
                                      ).padStart(2, "0");
                                      const day = String(
                                        date.getDate(),
                                      ).padStart(2, "0");
                                      const formattedDate = `${year}-${month}-${day}`;
                                      setEmployeeDOB(formattedDate);
                                    } else {
                                      setEmployeeDOB("");
                                    }
                                  }}
                                  maxDate={new Date()}
                                  className="w-full"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className={`flex items-center ml-2 ${editSelectedEmployeeDOB ? "self-start sm:self-center" : ""}`}
                        >
                          {!editSelectedEmployeeDOB && (
                            <IconButton
                              iconName="edit"
                              color={GLOBAL_DANGER_COLOR}
                              clickEvent={editEmployeeDobTime}
                            />
                          )}
                          {editSelectedEmployeeDOB && (
                            <IconButton
                              iconName="followup"
                              color={GLOBAL_SUCCESS_COLOR}
                              clickEvent={editEmployeeDobTime}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Joined On */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px]">
                          <SVGIconProvider iconName="calendar" />
                        </div>
                        <div className="ml-2 w-full">
                          <p>
                            <strong>Joined On: </strong>{" "}
                            {formatDateOne(employeeJoiningDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Access Type */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-10px]">
                          <SVGIconProvider iconName="key" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Access Type: </strong>Super-Admin
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_EMPLOYEE) {
    return (
      <div>
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
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this employee?
        </h2>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center   z-50 bg-background/80 dark:bg-default-100/80 ">
            <Spinner size="lg" />
          </div>
        ) : (
          <Card
            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto mt-4"
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                <div className="relative col-span-6 md:col-span-4">
                  <Image
                    alt="Employee photo"
                    className="object-cover"
                    height={200}
                    shadow="md"
                    src={
                      profilePhoto
                        ? profilePhoto
                        : employeeGender
                          ? employeeGender === "Male"
                            ? `${AWS_URL}/docpoc-images/user-male.jpg`
                            : `${AWS_URL}/docpoc-images/user-female.jpg`
                          : `${AWS_URL}/docpoc-images/user-male.jpg`
                    }
                    width="100%"
                  />
                </div>
                <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground/90">
                      Employee Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {/* Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="user" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Name: </strong>
                            {employeeName}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="email" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Email: </strong>
                            {employeeEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="phone" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Phone: </strong>+91- {employeePhone}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Gender */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="user" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Gender: </strong>
                            {employeeGender}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Designation */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="icard" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Designation: </strong>
                            {employeeDesignation}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Working Hours */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="clock" />
                        </div>
                        <div className="ml-1 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Working Hours: </strong>
                            {employeeShiftTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Joined On */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="calendar" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Joined On: </strong>{" "}
                            {formatDateOne(employeeJoiningDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Access Type */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-10px] mt-1">
                          <SVGIconProvider iconName="key" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Access Type: </strong>Super-Admin
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Date Of Birth */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-base w-full mb-2">
                      <div className="flex items-center w-full">
                        <div className="ml-[-5px] mt-1">
                          <SVGIconProvider iconName="birthday" />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="break-words">
                            <strong>Date Of Birth: </strong>
                            {employeeDOB}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
    // if (props.type == MODAL_TYPES.ADD_APPOINTMENT) {
    //   return (
    //     <>
    //       <AddAppointment onUsersAdded={() => {}} />
    //     </>
    //   );
    // }
  }

  return null;
}

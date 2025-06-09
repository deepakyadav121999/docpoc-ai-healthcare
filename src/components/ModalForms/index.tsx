"use client";
import { Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Image,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Button,
  DropdownMenu,
  Input,
  TimeInput,
  AutocompleteItem,
  Autocomplete,
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
} from "@internationalized/date";

// import ToolTip from "../Tooltip";
// import { VerticalDotsIcon } from "../CalenderBox/VerticalDotsIcon";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import IconButton from "../Buttons/IconButton";

import { VisitHistoryTable } from "../Patient/VisitHistoryTable";
import AddAppointment from "../CalenderBox/AddAppointment";
import axios from "axios";
import { Time } from "@internationalized/date";
import { useDropzone } from "react-dropzone";
// import DocumentList from "../Patient/DocumentList";

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
  onFilesChange: (files: any) => void;
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
  const [editSelectedEmployeeJoiningDate] = useState(false);
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

  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  //   const [shiftStartTime, setShiftStartTime] = useState<Time>(new Time(7, 38));  // Default time
  // const [shiftEndTime, setShiftEndTime] = useState<Time>(new Time(8, 45));
  // Default time
  const [shiftStartTime, setShiftStartTime] = useState<Time | null>(null);
  const [shiftEndTime, setShiftEndTime] = useState<Time | null>(null);

  const formatDateToDDMMYYYY = (dateTimeString: string): string => {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const [appointmentDate, setAppointmentDate] = useState("");

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
      // const uploadedDocuments = Object.entries(
      //   JSON.parse(response.data.documents)
      // ).map(([key, value]) => ({
      //   date: "N/A",
      //   doctor: key, // Use the document key as the document name
      //   report: String(value), // Ensure the report is a string
      // }));

      // setPatientDocument(uploadedDocuments)

      const uploadedDocuments = Object.entries(
        JSON.parse(response.data.documents || "{}"), // Handle empty documents gracefully
      ).map(([key, value]) => {
        try {
          const parsedValue = JSON.parse(String(value));

          // Parse the JSON string of the document

          // Format the date
          const formattedDate = parsedValue.date
            ? formatDateToDDMMYYYY(parsedValue.date) // Format the date if available
            : "N/A";
          return {
            date: formattedDate, // Use the date if available, otherwise default to "N/A"
            doctor: key, // Use the document key as the document name
            report: parsedValue.url || "N/A", // Use the URL if available
          };
        } catch (error) {
          console.error(`Error parsing document ${key}:`, error);
          return {
            date: "N/A",
            doctor: key, // Use the document key as the document name
            report: String(value) || "N/A", // Use the raw value if parsing fails
          };
        }
      });

      // Set the documents to the state
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

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      // setSelectedFile(file)
      props.onProfilePhotoChange(file);
    }
  };
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

  // Handle files when dropped or selected
  const onDrop = (acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return Object.assign(file, {
          preview: URL.createObjectURL(file), // Generate preview for images
        });
      }
      return file; // No preview for other file types
    });

    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    props.onFilesChange([...selectedFiles, ...filesWithPreview]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: undefined, // Accept any file type
    multiple: true,
  });

  // Remove a specific file
  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
  };

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
  if (props.type === MODAL_TYPES.VIEW_APPOINTMENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[99%] sm:max-w-[610px] mx-auto"
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
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
                    <div className="relative col-span-6 md:col-span-4">
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

                    <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
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
                        <div className="flex items-center">
                          <div style={{ marginLeft: -5 }}>
                            <SVGIconProvider iconName="doctor" />
                          </div>
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Patient Name: </strong> {appointmentName}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="clock" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Visiting Time: </strong>{" "}
                            {extractTime(startDateTime)}-
                            {extractTime(endDateTime)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="calendar" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Date: </strong>
                            {extractDate(appointmentDate)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div style={{ marginLeft: -5 }}>
                            <SVGIconProvider iconName="doctor" />
                          </div>
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Appointed Doctor: </strong> {employeeName}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="followup" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Follow-up: </strong> Yes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full">
                  <div className="w-full">
                    <h3 className="font-semibold text-foreground/90 text-center mb-6">
                      Previous Visits
                    </h3>

                    <div className="flex flex-col center">
                      {showLastVisit && (
                        <VisitHistoryTable
                          patientId={patientId}
                          viewMode={"history"}
                          uploadedDocuments={[]}
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
      </>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_APPOINTMENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          // isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[700px] mx-auto "
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-8 items-center justify-center">
              <div className="relative col-span-6 md:col-span-4">
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="clock" />
                    {!editVisitTime && (
                      <p className="text-sm sm:text-medium ml-1">
                        <strong>Visiting Time: </strong>{" "}
                        {/* {extractTime(startDateTime)} */}
                        {extractTime(startDateTime)}-{extractTime(endDateTime)}
                      </p>
                    )}

                    {editVisitTime && (
                      <div
                        className="  flex gap-4.5 xl:flex-row"
                        style={{ marginTop: 20 }}
                      >
                        <TimeInput
                          color={TOOL_TIP_COLORS.secondary}
                          label="From"
                          labelPlacement="outside"
                          variant="bordered"
                          // defaultValue={new Time(7, 38)}
                          value={shiftStartTime}
                          onChange={(time) => {
                            handleTimeChangeAppointment(time, "startDateTime");
                            setShiftStartTime(time);
                          }}
                        />
                        <TimeInput
                          color={TOOL_TIP_COLORS.secondary}
                          label="To"
                          labelPlacement="outside"
                          variant="bordered"
                          // defaultValue={new Time(8, 45)}
                          value={shiftEndTime}
                          onChange={(time) => {
                            setShiftEndTime(time);
                            handleTimeChangeAppointment(time, "endDateTime");
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="calendar" />
                    <p className=" text-sm sm:text-medium ml-2">
                      <strong>Date: </strong>
                      {extractDate(appointmentDate)}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div style={{ marginLeft: -5 }}>
                      <SVGIconProvider iconName="doctor" />
                    </div>
                    {!editSelectedDoctor && (
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Appointed Doctor: </strong> {employeeName}
                      </p>
                    )}
                    {editSelectedDoctor && (
                      <>
                        <p className="text-sm sm:text-medium ml-2">
                          <strong>Appointed Doctor: </strong>
                        </p>
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
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
                        </div>
                      </>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="followup" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Follow-up: </strong> Yes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_APPOINTMENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
              <Spinner />
            </div>
          )}
        </div>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this appointment?
        </h2>

        <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <SVGIconProvider iconName="clock" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>Visit Time: </strong> {extractTime(appointmentDateTime)}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="calendar" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>Date: </strong> {extractDate(appointmentDateTime)}
              </p>
            </div>
            <div className="flex items-center">
              <div style={{ marginLeft: -5 }}>
                <SVGIconProvider iconName="doctor" />
              </div>
              <p className="text-sm sm:text-medium ml-2">
                <strong>Appointed Doctor: </strong> {employeeName}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="followup" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>Follow-up: </strong> Yes
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
  // const [showLastVisit, setShowLastVisit] = useState(false);

  if (props.type === MODAL_TYPES.VIEW_PATIENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
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
                        <div className="flex items-center">
                          <SVGIconProvider iconName="user" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Patient Name: </strong>
                            {patientName}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="clock" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Last Visit: </strong>
                            {lastVisit}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="calendar" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Status: </strong> {patientStatus}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <SVGIconProvider iconName="user" />
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Gender: </strong> {patientGender}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <div style={{ marginLeft: -5 }}>
                            <SVGIconProvider iconName="doctor" />
                          </div>
                          <p className="text-sm sm:text-medium ml-2">
                            <strong>Last Appointed Doctor: </strong>{" "}
                            {lastAppointedDoctor}
                          </p>
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
                          viewMode={viewMode}
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
      </>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_PATIENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
              <Spinner />
            </div>
          )}
        </div>
        <Card
          // isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
              <div className="relative col-span-6 md:col-span-4">
                <div>
                  <div className="relative drop-shadow-2">
                    <Image
                      src={
                        profilePhoto
                          ? profilePhoto
                          : patientGender
                            ? patientGender === "Male"
                              ? `${AWS_URL}/docpoc-images/user-male.jpg`
                              : `${AWS_URL}/docpoc-images/user-female.jpg`
                            : `${AWS_URL}/docpoc-images/user-male.jpg`
                      }
                      width={160}
                      height={160}
                      className="overflow-hidden rounded-full"
                      alt="profile"
                    />
                  </div>

                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-1 sm:right-16"
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
                      onChange={handleProfilePhotoChange}
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="user" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Name: </strong>
                      {!editSelectedPatient && patientName}
                    </p>
                    {editSelectedPatient && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Input
                          type="text"
                          placeholder="Patient name.."
                          labelPlacement="outside"
                          value={patientName}
                          onChange={(e) => {
                            setPatientName(e.target.value);
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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

                  <div className="flex items-center">
                    <SVGIconProvider iconName="blood-drop" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Status: </strong>
                      {!editSelectedPatientStatus && patientStatus}
                    </p>
                    {editSelectedPatientStatus && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered">{patientStatus}</Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Dynamic Actions"
                            items={statusGroupList}
                            onAction={(key) => {
                              setPatientStatus(
                                statusGroupList.find((item) => item.key === key)
                                  ?.label ?? patientStatus,
                              );
                            }}
                          >
                            {(item) => (
                              <DropdownItem
                                key={item.key}
                                color={
                                  item.key === "delete" ? "danger" : "default"
                                }
                                className={
                                  item.key === "delete" ? "text-danger" : ""
                                }
                              >
                                {item.label}
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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

                  <div className="flex items-center">
                    <SVGIconProvider iconName="email" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Email: </strong>
                      {!editSelectedPatientEmail && patientEmail}
                    </p>
                    {editSelectedPatientEmail && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Input
                          type="email"
                          placeholder="Patient email.."
                          labelPlacement="outside"
                          value={patientEmail}
                          onChange={(e) => {
                            setPatientEmail(e.target.value);
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="blood-drop" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Blood Group: </strong>
                      {!editSelectedPatientBloodGroup && patientBloodGroup}
                    </p>
                    {editSelectedPatientBloodGroup && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered">
                              {patientBloodGroup}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Dynamic Actions"
                            items={bloodGroupList}
                            onAction={(key) => {
                              setPatientBloodGroup(
                                bloodGroupList.find((item) => item.key === key)
                                  ?.label ?? patientBloodGroup,
                              );
                            }}
                          >
                            {(item) => (
                              <DropdownItem
                                key={item.key}
                                color={
                                  item.key === "delete" ? "danger" : "default"
                                }
                                className={
                                  item.key === "delete" ? "text-danger" : ""
                                }
                              >
                                {item.label}
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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
                  <div className="flex items-center">
                    <SVGIconProvider iconName="phone" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Phone: </strong>
                      {!editSelectedPatientPhone && patientPhone}
                    </p>
                    {editSelectedPatientPhone && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Input
                          type="text"
                          placeholder="Patient Phone.."
                          labelPlacement="outside"
                          value={patientPhone}
                          onChange={(e) => {
                            setPatientPhone(e.target.value);
                          }}
                        />
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
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

                  <div className="flex items-center">
                    <SVGIconProvider iconName="user" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Gender: </strong>
                      {!editSelectedPatientGender && patientGender}
                    </p>
                    {editSelectedPatientGender && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered">{patientGender}</Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Select Gender"
                            items={[
                              { key: "Male", label: "Male" },
                              { key: "Female", label: "Female" },
                              { key: "Other", label: "Other" },
                            ]}
                            onAction={(key) => setPatientGender(key.toString())}
                          >
                            {(item) => (
                              <DropdownItem key={item.key}>
                                {item.label}
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      {!editSelectedPatientGender ? (
                        <IconButton
                          iconName="edit"
                          color={GLOBAL_DANGER_COLOR}
                          clickEvent={() => setEditSelectedPatientGender(true)}
                        />
                      ) : (
                        <IconButton
                          iconName="followup"
                          color={GLOBAL_SUCCESS_COLOR}
                          clickEvent={() => setEditSelectedPatientGender(false)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-400 bg-gray-100 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5">
                    {/* File Preview Section */}
                    <div className="flex flex-wrap gap-4">
                      {files.map((file) => {
                        const fileExtension = file.name.split(".").pop();

                        // const displayName = `${Date.now()}-${Math.floor(performance.now())}.${fileExtension}`;

                        const trimmedFileName =
                          file.name.length > 8
                            ? file.name.substring(0, 7) + "." + fileExtension // Trim to 12 characters + "..."
                            : file.name + "." + fileExtension;
                        return (
                          <div
                            key={file.name}
                            className="relative flex items-center justify-center w-[80px] h-[80px] border rounded-lg p-3 bg-white text-center shadow-md"
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
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}

                            {!file.type.startsWith("image/") && (
                              <div className="flex flex-col items-center">
                                <SVGIconProvider iconName="document" />
                                <span className="truncate text-xs  sm:text-sm max-w-full mt-2 text-gray-600 overflow-hidden whitespace-nowrap">
                                  {/* {file.name} */}
                                  {trimmedFileName}
                                </span>
                              </div>
                            )}
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
      </>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_PATIENT) {
    return (
      <>
        <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
              <Spinner />
            </div>
          )}
        </div>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this patient?
        </h2>

        <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <SVGIconProvider iconName="clock" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>Name: </strong> {patientName}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="calendar" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>email: </strong>
                {patientEmail}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="phone" />
              <p className="text-sm sm:text-medium ml-2">
                <strong>phone: </strong> {patientPhone}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (props.type === MODAL_TYPES.VIEW_EMPLOYEE) {
    return (
      <>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
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
                    <div className="flex items-center">
                      <SVGIconProvider iconName="user" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Name: </strong>
                        {employeeName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="email" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>email: </strong>
                        {employeeEmail}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="phone" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Phone: </strong>+91- {employeePhone}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <SVGIconProvider iconName="user" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Gender: </strong>
                        {employeeGender}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <SVGIconProvider iconName="icard" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Designation: </strong>
                        {employeeDesignation}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="clock" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Working Hours: </strong>
                        {employeeShiftTime}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="calendar" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Joined On: </strong>{" "}
                        {extractDate(employeeJoiningDate)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div style={{ marginLeft: -5 }}>
                        <SVGIconProvider iconName="key" />
                      </div>
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Access Type: </strong>Super-Admin
                      </p>
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="birthday" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Date Of Birth: {employeeDOB}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_EMPLOYEE) {
    return (
      <>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
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
                  <div>
                    <div className="relative drop-shadow-2">
                      <Image
                        // src={profilePhoto ? profilePhoto : employeeGender == "Male" ? "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/user-male.jpg" : "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/user-female.jpg"}

                        src={
                          profilePhoto
                            ? profilePhoto
                            : employeeGender
                              ? employeeGender === "Male"
                                ? `${AWS_URL}/docpoc-images/user-male.jpg`
                                : `${AWS_URL}/docpoc-images/user-female.jpg`
                              : `${AWS_URL}/docpoc-images/user-male.jpg`
                        }
                        width={160}
                        height={160}
                        className="overflow-hidden rounded-full"
                        alt="profile"
                      />
                    </div>

                    <label
                      htmlFor="profilePhoto"
                      className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-1 sm:right-5"
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
                        // onChange={handleProfilePhotoChange}
                        onChange={handleProfilePhotoChange}
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
                    <div className="flex items-center">
                      <SVGIconProvider iconName="user" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Name: </strong>
                        {!editSelectedEmployee && employeeName}
                      </p>
                      {editSelectedEmployee && (
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
                          <Input
                            type="text"
                            placeholder="Patient name.."
                            labelPlacement="outside"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
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

                    <div className="flex items-center">
                      <SVGIconProvider iconName="email" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Email: </strong>
                        {!editSelectedEmployeeEmail && employeeEmail}
                      </p>
                      {editSelectedEmployeeEmail && (
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
                          <Input
                            type="email"
                            placeholder="Employee email.."
                            labelPlacement="outside"
                            value={employeeEmail}
                            onChange={(e) => setEmployeeEmail(e.target.value)}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
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
                    <div className="flex items-center">
                      <SVGIconProvider iconName="phone" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Phone: </strong>
                        {!editSelectedEmployeePhone && employeePhone}
                      </p>
                      {editSelectedEmployeePhone && (
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
                          <Input
                            type="text"
                            placeholder="Employee phone.."
                            labelPlacement="outside"
                            value={employeePhone}
                            onChange={(e) => setEmployeePhone(e.target.value)}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
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

                    <div className="flex items-center">
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
                    </div>

                    <div className="flex items-center">
                      {/* <div style={{ marginLeft: -5 }}>
                      <SVGIconProvider iconName="icard" />
                      </div>
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Designation: </strong>
                        {employeeDesignation}
                      </p> */}

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
                            {/* <Input
                            type="text"
                            placeholder="Employee designation.."
                            labelPlacement="outside"
                            value={employeeDesignation}
                            onChange={(e) => setEmployeeDesignation(e.target.value)}
                          /> */}

                            <Autocomplete
                              color={TOOL_TIP_COLORS.secondary}
                              isDisabled={!editSelectedEmployeeDesignation}
                              labelPlacement="outside"
                              variant="bordered"
                              defaultItems={designations} // Use the designations array as items
                              label="Select Designation"
                              placeholder={
                                employeeDesignation || "Search Designation"
                              }
                              // selectedKeys={[selectedDesignation]}
                              onSelectionChange={(key) => {
                                const selected = designations.find(
                                  (designation) => designation.value === key,
                                );
                                // setTempDesignation(selected?.label || "");
                                setEmployeeDesignation(selected?.label || "");
                                // Temporarily set the designation
                              }}
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={item.value}
                                  variant="shadow"
                                  color={TOOL_TIP_COLORS.secondary}
                                >
                                  {item.label}{" "}
                                  {/* Display the label for each item */}
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
                    </div>
                    <div className="flex items-center">
                      <SVGIconProvider iconName="clock" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Working Hours: </strong>
                        {!editSelectedEmployeeShiftTime && employeeShiftTime}
                      </p>
                      {editSelectedEmployeeShiftTime && (
                        <div className="flex items-center">
                          <TimeInput
                            color={TOOL_TIP_COLORS.secondary}
                            label="From"
                            labelPlacement="outside"
                            variant="bordered"
                            value={employeeShiftStartTime}
                            startContent={<SVGIconProvider iconName="clock" />}
                            onChange={(e) => {
                              handleTimeChange("start", e.toString());
                              setEmployeeShiftStartTime(e);
                            }}
                            isDisabled={!editSelectedEmployeeShiftTime}
                          />

                          <div
                            className="flex items-center"
                            style={{ marginLeft: 10 }}
                          >
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
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
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

                    <div className="flex items-center">
                      <SVGIconProvider iconName="calendar" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Joined On: </strong>{" "}
                      </p>
                      {!editSelectedEmployeeJoiningDate && (
                        <p className="text-sm sm:text-medium ml-2">
                          {formatDateOne(employeeJoiningDate)}
                        </p>
                      )}

                      {editSelectedEmployeeJoiningDate && (
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
                          {/* <DatePicker
                                       showMonthAndYearPickers
                                       label="Joining Date"
                                       className="max-w-[284px]"
                                       onChange={editEmployeeJoiningDate}
                                       style={{ marginLeft: 0 }}
                                     /> */}
                        </div>
                      )}
                      {/* <div className="flex items-center" style={{ marginLeft: 10 }}>
                                   {!editSelectedEmployeeJoiningDate && (
                                     <IconButton
                                       iconName="edit"
                                       color={GLOBAL_DANGER_COLOR}
                                       clickEvent={editEmployeeTime}
                                     />
                                   )}
                                   {editSelectedEmployeeJoiningDate && (
                                     <IconButton
                                       iconName="followup"
                                       color={GLOBAL_SUCCESS_COLOR}
                                       clickEvent={editEmployeeTime}
                                     />
                                   )}
                                 </div> */}
                    </div>
                    <div className="flex items-center">
                      <div style={{ marginLeft: -5 }}>
                        <SVGIconProvider iconName="key" />
                      </div>
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Access Type: </strong>Super-Admin
                      </p>
                    </div>

                    <div className="flex items-center">
                      <SVGIconProvider iconName="birthday" />
                      <p className="text-sm sm:text-medium ml-2">
                        <strong>Date Of Birth: </strong>{" "}
                      </p>
                      {!editSelectedEmployeeDOB && (
                        <p className="text-sm sm:text-medium ml-2">
                          {employeeDOB}
                        </p>
                      )}

                      {editSelectedEmployeeDOB && (
                        <div
                          className="flex items-center"
                          style={{ marginLeft: 10 }}
                        >
                          <Input
                            type="date"
                            variant="bordered"
                            value={employeeDOB}
                            onChange={(e) => setEmployeeDOB(e.target.value)}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
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
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_EMPLOYEE) {
    return (
      <>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this employee?
        </h2>
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground/90">
                Employee Details
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <SVGIconProvider iconName="user" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Name: </strong>
                  {employeeName}
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="email" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>email: </strong>
                  {employeeEmail}
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="phone" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Phone: </strong>+91- {employeePhone}
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="icard" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Designation: </strong>
                  {employeeDesignation}
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="clock" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Working Hours: </strong>
                  {employeeShiftTime}
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="calendar" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Joined On: </strong>{" "}
                  {formatDateOne(employeeJoiningDate)}
                </p>
              </div>
              <div className="flex items-center">
                <div style={{ marginLeft: -5 }}>
                  <SVGIconProvider iconName="key" />
                </div>
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Access Type: </strong>Super-Admin
                </p>
              </div>
              <div className="flex items-center">
                <SVGIconProvider iconName="birthday" />
                <p className="text-sm sm:text-medium ml-2">
                  <strong>Date Of Birth: </strong> {employeeDOB}
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
    if (props.type == MODAL_TYPES.ADD_APPOINTMENT) {
      return (
        <>
          <AddAppointment onUsersAdded={() => {}} />
        </>
      );
    }
  }
  return null;
}

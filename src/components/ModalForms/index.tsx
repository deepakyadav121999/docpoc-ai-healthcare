"use client";
import { Spinner, user } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  DatePicker,
  Image,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Button,
  DropdownMenu,
  Accordion,
  AccordionItem,
  Table,
  Pagination,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  getKeyValue,
  TableCell,
  Input,
  TimeInput,
  DateValue,
  AutocompleteItem,
  Autocomplete,
} from "@nextui-org/react";
import {
  GLOBAL_ACTION_ICON_COLOR,
  GLOBAL_DANGER_COLOR,
  GLOBAL_ICON_COLOR,
  GLOBAL_ICON_COLOR_WHITE,
  GLOBAL_SUCCESS_COLOR,
  MODAL_TYPES,
  TOOL_TIP_COLORS,
  USER_ICONS,
} from "@/constants";
import StyledButton from "../common/Button/StyledButton";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseTime,
} from "@internationalized/date";

import ToolTip from "../Tooltip";
import { VerticalDotsIcon } from "../CalenderBox/VerticalDotsIcon";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import IconButton from "../Buttons/IconButton";
import { VisitHistoryTable } from "./VisitHistoryTable";
import AddAppointment from "../CalenderBox/AddAppointment";
import axios from "axios";
import { Time } from "@internationalized/date";

const PlaceholderImage = () => (
  <svg width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#e0e0e0" />
    <text
      x="50%"
      y="50%"
      alignmentBaseline="middle"
      textAnchor="middle"
      fontSize="20"
      fill="#666"
    >
      No Image Available
    </text>
  </svg>
);
interface AutocompleteItem {
  value: string;
  label: string;
  description?: string;
  dob?: string;
}

const API_URL = process.env.API_URL;
export default function ModalForm(props: {
  type: string;
  userId: string;
  onDataChange: (data: any) => void;
}) {
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
  const [editSelectedEmployeeJoiningDate, setEditEmployeeJoiningDate] =
    useState(false);
  const [editSelectedEmployeeDOB, setEditEmployeeDOB] = useState(false);

  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeeShiftStartTime, setEmployeeShiftStartTime] =
    useState<Time | null>(null);
  const [employeeShiftEndTime, setEmployeeShiftEndTime] = useState<Time | null>(
    null,
  );

  const designations = [
    { label: "Doctor", value: "doctor" },
    { label: "Nurse", value: "nurse" },
    { label: "Staff", value: "staff" },
  ];

  // State to track selected designation and employee name
  const [selectedDesignation, setSelectedDesignation] =
    useState<string>(employeeDesignation);

  const [tempDesignation, setTempDesignation] = useState(employeeDesignation);
  const[employeeId, setEmployeeId] = useState("")
  const [employeePhone, setEmployeePhone] = useState("");
  const [emloyeeBranch, setEmployeeBranch] = useState("");
  const [employeeShiftTime, setEmployeeShiftTime] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState("");
  const[employeePhoto, setEmployeePhoto]= useState("")
  const[employeePhotoLoading, setEmployeePhotoLoading] = useState(false)
  const [editSelectedPatient, setEditPatient] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientBloodGroup, setPatientBloodGroup] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const[patientPhoto,setPatientPhoto] =useState("")
  const[patientGender, setPatientGender] =useState("")
  const [profilePhoto, setProfilePhoto] = useState("");
  // const [loading, setLoading] = useState<boolean>(true);
  const [lastVisit, setLastVisit] = useState<string>("N/A");
  const [lastAppointedDoctor, setLastAppointedDoctor] = useState<string>("N/A");
  // const [lastVisit, setLastvisit] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const [branchId, setBranchId] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDate, setSelectedDate] = useState(now(getLocalTimeZone()));
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Salunkey");
  const [loading, setLoading] = useState(false);

  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [appointmentPatientId, setAppointmentPatientId] = useState("");

  const [appointmentBranch, setAppointmentBranch] = useState("");
  const [appointmentName, setAppointmentName] = useState("");
  const [doctorList, setDoctorList] = useState<AutocompleteItem[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [startDateTimeDisp, setStartDateTimeDisp] = useState<string>("");
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
      setPatientPhoto(response.data.displayPicture)
      // setLastvisit(response.data.lastVisit)
      setNotificationStatus(response.data.notificationStatus);
      setBranchId(response.data.branchId);
      setPatientDob(response.data.dob);
      setGender(response.data.gender);
      setPatientId(response.data.id);
      setPatientGender(response.data.gender)
    } catch (err) {
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
      setEmployeePhoto(users.profilePicture)
      setEmployeeId(users.id)
      console.log(users);

      const workingHours = parsedJson.workingHours; // e.g., "9:00 AM - 9:00 PM"

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

      const users = response.data;
      setAppointmentDateTime(users.startDateTime);
      setAppointmentPatientId(users.patientId);
      setAppointmentBranch(users.branchId);
      fetchUsers(users.doctorId);
      setDoctorId(users.doctorId);
      fetchDoctors(users.branchId);
      setAppointmentName(users.name);
      setStartDateTime(users.startDateTime);
      setEndDateTime(users.endDateTime);
      setAppointmentDate(users.dateTime);
      setPatientId(users.patientId);
      // const startTimeObject = extractTimeAsObject(users.startDateTime);

      // const endTimeObject = extractTimeAsObject(users.endDateTime);
      // setShiftStartTime(startTimeObject)

      // setShiftEndTime(endTimeObject)

      const startTimeObject = extractTimeDisplay(users.startDateTime);
      console.log(parseTime(startTimeObject));
      const endTimeObject = extractTimeDisplay(users.endDateTime);

      setShiftStartTime(
        users.startDateTime ? parseTime(startTimeObject) : null,
      );
      setStartDateTimeDisp(startTimeObject);

      setShiftEndTime(users.endDateTime ? parseTime(endTimeObject) : null);
      console.log(`time is ${parseTime(startTimeObject)}`);
    } catch (err) {
      console.error("Failed to fetch users.", err);
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
        gender: gender,
        displayPicture: patientPhoto
      };

      props.onDataChange(updatedData);
    } else if (props.type === MODAL_TYPES.EDIT_EMPLOYEE) {
      const updatedData = {
        branchId: emloyeeBranch,
        name: employeeName,
        phone: employeePhone,
        email: employeeEmail,
        profilePicture:employeePhoto,
        json: JSON.stringify({
          dob: employeeDOB,
          designation: employeeDesignation,
          workingHours: employeeShiftTime,
        }),
      };
      props.onDataChange(updatedData);
    } else if (props.type === MODAL_TYPES.EDIT_APPOINTMENT) {
      const updatedData = {
        name: appointmentName,
        branchId: appointmentBranch,
        doctorId: doctorId,
        patientId: appointmentPatientId,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        type: "0151308b-6419-437b-9b41-53c7de566724",
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
    patientPhoto,
    gender,
    emloyeeBranch,
    employeeName,
    employeePhone,
    employeeEmail,
    employeeDOB,
    employeeDesignation,
    employeeShiftTime,
    employeePhoto,
    appointmentName,
    appointmentBranch,
    doctorId,
    appointmentPatientId,
    startDateTime,
    endDateTime,
  ]);

  const editBloodGroup = () => {
    setEditPatientBloodGroup(!editSelectedPatientBloodGroup);
  };

  const handleDateChange = (newDate: ZonedDateTime) => {
    setSelectedDate(newDate);
  };

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

  const editEmployeeJoiningDate = (newDate: DateValue) => {
    // setEmployeeJoiningDate(newDate);
  };

  const editEmployeeTime = () => {
    setEditEmployeeJoiningDate(!editSelectedEmployeeJoiningDate);
  };

  const editEmployeeDOB = () => {
    setEmployeeDOB(employeeDOB);
  };

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
    }
  };

  const handleProfilePhotoChangeEmployee = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (!file) return; // Exit if no file is selected
  
    setEmployeePhotoLoading(true); // Set loading state while the upload is happening
  
    // Construct the folder name based on the user's name and ID
    const sanitizedUsername = employeeName.replace(/\s+/g, "").toLowerCase().slice(0, 9);
    const folderName = `${sanitizedUsername}${employeeId.slice(-6)}`;
    // const uniqueFileName = `${Date.now()}${file.name}`;
  
    try {
      // Create a FormData object to send the file and additional metadata
      const data = new FormData();
      data.append("file", file);
      data.append("folder", folderName);
      data.append("contentDisposition", "inline");
  
      // Upload the file to the S3 bucket via the API
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://u7b8g2ifb9.execute-api.ap-south-1.amazonaws.com/dev/file-upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
  
      const response = await axios.request(config); // Call the API
  
      // If the file is uploaded successfully, construct the file URL
      if (response.data) {
        const fileUrl = `https://docpoc-assets.s3.ap-south-1.amazonaws.com/${folderName}/${file.name}`;
        console.log("File uploaded successfully:", fileUrl);
  
        // Update the state variable with the new photo URL
        setEmployeePhoto(fileUrl);
      }
    } catch (error) {
      console.error("Error uploading the photo:", error);
      alert("Failed to upload the photo. Please try again.");
    } finally {
      setEmployeePhotoLoading(false); // Reset the loading state
    }
  };

  const handleProfilePhotoChangePatient= async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (!file) return; // Exit if no file is selected
  
    setEmployeePhotoLoading(true); // Set loading state while the upload is happening
  
    // Construct the folder name based on the user's name and ID
    const sanitizedUsername = patientName.replace(/\s+/g, "").toLowerCase().slice(0, 9);
    const folderName = `${sanitizedUsername}${patientId.slice(-6)}`;
    // const uniqueFileName = `${Date.now()}${file.name}`;
  
    try {
      // Create a FormData object to send the file and additional metadata
      const data = new FormData();
      data.append("file", file);
      data.append("folder", folderName);
      data.append("contentDisposition", "inline");
  
      // Upload the file to the S3 bucket via the API
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://u7b8g2ifb9.execute-api.ap-south-1.amazonaws.com/dev/file-upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
  
      const response = await axios.request(config); // Call the API
  
      // If the file is uploaded successfully, construct the file URL
      if (response.data) {
        const fileUrl = `https://docpoc-assets.s3.ap-south-1.amazonaws.com/${folderName}/${file.name}`;
        console.log("File uploaded successfully:", fileUrl);
  
        // Update the state variable with the new photo URL
        setPatientPhoto(fileUrl);
      }
    } catch (error) {
      console.error("Error uploading the photo:", error);
      alert("Failed to upload the photo. Please try again.");
    } finally {
      setEmployeePhotoLoading(false); // Reset the loading state
    }
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

  const doctorsList = [
    {
      key: "1",
      label: "Dr. Avinash D",
    },
    {
      key: "2",
      label: "Dr. Ashika B",
    },
    {
      key: "3",
      label: "Asst Dr. Varinder",
    },
    {
      key: "4",
      label: "Dr. Asif Khan",
    },
  ]; // Example doctors list

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
      label: "Blaclisted",
    },
  ];

  // const extractDate = (dateTimeString: string): string => {
  //   if (!dateTimeString) {
  //     return "N/A"; // Fallback value
  //   }
  //   return dateTimeString.split("T")[0]; // Extract the date portion
  // };

  // const extractTime = (dateTimeString: string): string => {
  //   if (!dateTimeString) {
  //     return "N/A"; // Fallback value
  //   }
  //   return dateTimeString.split("T")[1]?.split(".")[0]; // Extract the time portion
  // };

  if (props.type === MODAL_TYPES.VIEW_APPOINTMENT) {
    const [showLastVisit, setShowLastVisit] = useState(false);
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
                        src={USER_ICONS.FEMALE_USER}
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
                      <VisitHistoryTable patientId={patientId} />
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

    // return (
    //   <>
    //     <div>
    //       {loading && (
    //         <div className="absolute inset-0 flex justify-center items-center bg-gray-900 z-50">
    //           <Spinner />
    //         </div>
    //       )}
    //     </div>
    //     <Card
    //       isBlurred
    //       className="border-none bg-background/60 dark:bg-default-100/50 w-full max-w-7xl mx-auto"
    //       shadow="sm"
    //     >
    //       <CardBody>

    //         {!showLastVisit ? (

    //           <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
    //             <div className="relative col-span-6 md:col-span-4">
    //               <Image
    //                 alt="Patient photo"
    //                 className="object-cover"
    //                 height={200}
    //                 shadow="md"
    //                 src={USER_ICONS.FEMALE_USER}
    //                 width="100%"
    //               />
    //             </div>

    //             <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
    //               <div className="flex justify-between items-center">
    //                 <h3 className="font-semibold text-foreground/90">
    //                   Appointment Details
    //                 </h3>
    //                 <StyledButton
    //                   label="Follow-Up"

    //                 />
    //               </div>

    //               <div className="space-y-3">
    //               <div className="flex items-center">
    //                   <div style={{ marginLeft: -5 }}>
    //                     <SVGIconProvider iconName="doctor" />
    //                   </div>
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong>Patient Name: </strong> {appointmentName}
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <SVGIconProvider iconName="clock" />
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong>Visiting Time: </strong>{" "}
    //                     {extractTime(startDateTime)}-{extractTime(endDateTime)}
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <SVGIconProvider iconName="calendar" />
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong>Date: </strong>
    //                     {extractDate(appointmentDate)}
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <div style={{ marginLeft: -5 }}>
    //                     <SVGIconProvider iconName="doctor" />
    //                   </div>
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong>Appointed Doctor: </strong> {employeeName}
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <SVGIconProvider iconName="followup" />
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong>Follow-up: </strong> Yes
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center">
    //                   {/* <SVGIconProvider iconName="followup" /> */}
    //                   <p className="text-sm sm:text-medium ml-2">
    //                     <strong onClick={handleViewLastVisit} className="underline cursor-pointer">See last visit</strong>
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //         ) : (
    //           // Patient Last Visit Details in Table

    //           <div className="w-full animate-fade-in">
    //             <h3 className="font-semibold text-foreground/90 text-center mb-6">
    //               Patient Last Visits
    //             </h3>

    //             {isFetchingLastVisit ? (
    //               <div className="flex justify-center items-center">
    //                 <Spinner />
    //               </div>
    //             ) : lastVisitData.length > 0 ? (
    //               <div className="overflow-x-auto">
    //                 <table className="w-full table-auto border-collapse border border-gray-300">
    //                   <thead>
    //                     <tr className="">
    //                       <th className="px-4 py-2 border border-gray-300 text-left">
    //                         Date
    //                       </th>
    //                       <th className="px-4 py-2 border border-gray-300 text-left">
    //                         Start Time
    //                       </th>
    //                       <th className="px-4 py-2 border border-gray-300 text-left">
    //                         End Time
    //                       </th>
    //                       <th className="px-4 py-2 border border-gray-300 text-left">
    //                        Appointed Doctor
    //                       </th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {lastVisitData.map((visit) => (
    //                       <tr key={visit.id}>
    //                         <td className="px-4 py-2 border border-gray-300">
    //                           {extractDate(visit.dateTime)}
    //                         </td>
    //                         <td className="px-4 py-2 border border-gray-300">
    //                           {extractTime(visit.startDateTime)}
    //                         </td>
    //                         <td className="px-4 py-2 border border-gray-300">
    //                           {extractTime(visit.endDateTime)}
    //                         </td>
    //                         <td className="px-4 py-2 border border-gray-300">
    //                          {visit.doctorName}
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             ) : (
    //               <p className="text-sm sm:text-medium text-red-500 text-center">
    //                 No data available for the last visits.
    //               </p>
    //             )}

    //             <div className="flex justify-end mt-6">
    //               <StyledButton
    //                 label="Close"
    //                 clickEvent={handleCloseLastVisit}

    //               />
    //             </div>
    //           </div>

    //         )}
    //       </CardBody>
    //     </Card>
    //   </>
    // );
    // return (
    //   <>
    //     <div>
    //       {loading && (
    //         <div className="absolute inset-0 flex justify-center items-center bg-gray-900 z-50">
    //           <Spinner />
    //         </div>
    //       )}
    //     </div>
    //     <Card
    //       isBlurred
    //       className="border-none bg-background/60 dark:bg-default-100/50 w-full max-w-7xl mx-auto"
    //       shadow="sm"
    //     >
    //       <CardBody>
    //         <div className="relative overflow-hidden">
    //           {/* Container for Sliding Views */}
    //           <div
    //             className={`flex transition-transform duration-500 ease-in-out ${
    //               showLastVisit ? '-translate-x-full' : 'translate-x-0'
    //             }`}
    //           >
    //             {/* Appointment Details */}
    //             <div className="flex-shrink-0 w-full">
    //               <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
    //                 <div className="relative col-span-6 md:col-span-4">
    //                   <Image
    //                     alt="Patient photo"
    //                     className="object-cover"
    //                     height={200}
    //                     shadow="md"
    //                     src={USER_ICONS.FEMALE_USER}
    //                     width="100%"
    //                   />
    //                 </div>

    //                 <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
    //                   <div className="flex justify-between items-center">
    //                     <h3 className="font-semibold text-foreground/90">
    //                       Appointment Details
    //                     </h3>
    //                     <StyledButton label="Follow-Up" />
    //                   </div>

    //                   <div className="space-y-3">
    //                     <div className="flex items-center">
    //                       <div style={{ marginLeft: -5 }}>
    //                         <SVGIconProvider iconName="doctor" />
    //                       </div>
    //                       <p className="text-sm sm:text-medium ml-2">
    //                         <strong>Patient Name: </strong> {appointmentName}
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center">
    //                       <SVGIconProvider iconName="clock" />
    //                       <p className="text-sm sm:text-medium ml-2">
    //                         <strong>Visiting Time: </strong>
    //                         {extractTime(startDateTime)}-{extractTime(endDateTime)}
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center">
    //                       <SVGIconProvider iconName="calendar" />
    //                       <p className="text-sm sm:text-medium ml-2">
    //                         <strong>Date: </strong>
    //                         {extractDate(appointmentDate)}
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center">
    //                       <div style={{ marginLeft: -5 }}>
    //                         <SVGIconProvider iconName="doctor" />
    //                       </div>
    //                       <p className="text-sm sm:text-medium ml-2">
    //                         <strong>Appointed Doctor: </strong> {employeeName}
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center">
    //                       <SVGIconProvider iconName="followup" />
    //                       <p className="text-sm sm:text-medium ml-2">
    //                         <strong>Follow-up: </strong> Yes
    //                       </p>
    //                     </div>
    //                     <div className="flex items-center">
    //                       <p
    //                         onClick={handleViewLastVisit}
    //                         className="text-sm sm:text-medium ml-2 underline cursor-pointer"
    //                       >
    //                         <strong>See last visit</strong>
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Patient Last Visit */}
    //             <div className="flex-shrink-0 w-full">
    //               <div className="w-full">
    //                 <h3 className="font-semibold text-foreground/90 text-center mb-6">
    //                   Patient Last Visits
    //                 </h3>

    //                 {isFetchingLastVisit ? (
    //                   <div className="flex justify-center items-center">
    //                     <Spinner />
    //                   </div>
    //                 ) : lastVisitData.length > 0 ? (
    //                   <div className="overflow-x-auto">
    //                     <table className="w-full table-auto border-collapse border border-gray-300">
    //                       <thead>
    //                         <tr>
    //                           <th className="px-4 py-2 border border-gray-300 text-left">
    //                             Date
    //                           </th>
    //                           <th className="px-4 py-2 border border-gray-300 text-left">
    //                             Start Time
    //                           </th>
    //                           <th className="px-4 py-2 border border-gray-300 text-left">
    //                             End Time
    //                           </th>
    //                           <th className="px-4 py-2 border border-gray-300 text-left">
    //                             Appointed Doctor
    //                           </th>
    //                         </tr>
    //                       </thead>
    //                       <tbody>
    //                         {lastVisitData.map((visit) => (
    //                           <tr key={visit.id}>
    //                             <td className="px-4 py-2 border border-gray-300">
    //                               {extractDate(visit.dateTime)}
    //                             </td>
    //                             <td className="px-4 py-2 border border-gray-300">
    //                               {extractTime(visit.startDateTime)}
    //                             </td>
    //                             <td className="px-4 py-2 border border-gray-300">
    //                               {extractTime(visit.endDateTime)}
    //                             </td>
    //                             <td className="px-4 py-2 border border-gray-300">
    //                               {visit.doctorName}
    //                             </td>
    //                           </tr>
    //                         ))}
    //                       </tbody>
    //                     </table>
    //                   </div>
    //                 ) : (
    //                   <p className="text-sm sm:text-medium text-red-500 text-center">
    //                     No data available for the last visits.
    //                   </p>
    //                 )}

    //                 <div className="flex justify-end mt-6">
    //                   <StyledButton label="Close" clickEvent={handleCloseLastVisit} />
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </CardBody>
    //     </Card>
    //   </>
    // );
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
                  src={USER_ICONS.MALE_USER}
                  width="100%"
                />
              </div>

              <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-foreground/90 text-lg md:text-xl">
                    Edit Appointment Details
                  </h3>
                  <StyledButton label={"Follow-up"} />
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

  if (props.type === MODAL_TYPES.VIEW_PATIENT) {
    const [showLastVisit, setShowLastVisit] = useState(false);
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
                        // src={USER_ICONS.MALE_USER}
                        src={patientPhoto?patientPhoto:patientGender=="Male"?USER_ICONS.MALE_USER:USER_ICONS.FEMALE_USER}
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
                          <SVGIconProvider iconName="clock" />
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
                            onClick={() => setShowLastVisit(true)}
                            className="text-sm sm:text-medium ml-2 underline cursor-pointer"
                          >
                            <strong>See Previous Visits</strong>
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

                    {/* Show VisitHistoryTable */}
                    <div className="flex flex-col center">
                      <VisitHistoryTable patientId={patientId} />
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
                       src={patientPhoto?patientPhoto:patientGender=="Male"?USER_ICONS.MALE_USER:USER_ICONS.FEMALE_USER}
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
                      onChange={handleProfilePhotoChangePatient}
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
                    <SVGIconProvider iconName="clock" />
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
                  {/* <div className="flex items-center">
                    <SVGIconProvider iconName="calendar" />
                    <p className="text-sm sm:text-medium ml-2">
                      <strong>Status: </strong>{" "}
                      {!editSelectedPatientStatus && patientStatus}
                    </p>
                    
                    {editSelectedPatientStatus && (
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Input
                          type="text"
                          placeholder="Patient status.."
                          labelPlacement="outside"
                          value={patientStatus}
                          onChange={(e) => {
                            setPatientStatus(e.target.value)

                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  </div> */}

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
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
                  >
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <SVGIconProvider
                          iconName="upload"
                          color={GLOBAL_ACTION_ICON_COLOR}
                        />
                      </span>
                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop any relevant document(s) of patient.
                      </p>
                      <p className="mt-1 text-body-xs">
                        PDF, DOC, PNG, JPG (max, 800 X 800px)
                      </p>
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
                    src={employeePhoto?employeePhoto:USER_ICONS.MALE_USER}
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
                        <strong>Joined On: </strong> 27th Jan, 2021
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
                         src={employeePhoto?employeePhoto:USER_ICONS.MALE_USER}
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
                        onChange={handleProfilePhotoChangeEmployee}
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
                                setTempDesignation(selected?.label || "");
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

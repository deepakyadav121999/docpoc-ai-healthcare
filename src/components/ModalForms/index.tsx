"use client";
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
  Time,
  ZonedDateTime,
  getLocalTimeZone,
  now,
} from "@internationalized/date";
import ToolTip from "../Tooltip";
import { VerticalDotsIcon } from "../CalenderBox/VerticalDotsIcon";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import IconButton from "../Buttons/IconButton";
import { VisitHistoryTable } from "./VisitHistoryTable";
import AddAppointment from "../CalenderBox/AddAppointment";
import axios from "axios";
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

export default function ModalForm(props: { type: string, patientId:string,  onPatientUpdate: (updatedPatient: any) => void }) {
  const [editVisitTime, setEditVisitTime] = useState(false);
  const [editSelectedDoctor, setEditDoctor] = useState(false);
 
  const [editSelectedPatientBloodGroup, setEditPatientBloodGroup] =
    useState(false);
  const [editSelectedPatientStatus, setEditPatientStatus] = useState(false);
  const [editSelectedPatientEmail, setEditPatientEmail] = useState(false);
  const [editSelectedPatientPhone, setEditPatientPhone] = useState(false);
  const [employeeName, setEmployeeName] = useState("Sikha Kumari");
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
  const [employeeEmail, setEmployeeEmail] = useState("gulli@gmail.com");
  const [employeeDesignation, setEmployeeDesignation] = useState("Nurse");
  const [employeePhone, setEmployeePhone] = useState("+91 8763039387");
  const [employeeShiftTime, setEmployeeShiftTime] = useState(
    "08:30 AM - 06:00 PM"
  );
  const [employeeDOB, setEmployeeDOB] = useState(now(getLocalTimeZone()));
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState(
    now(getLocalTimeZone())
  );
  const [editSelectedPatient, setEditPatient] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientBloodGroup, setPatientBloodGroup] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
   const [patientStatus, setPatientStatus] = useState("");
   const [profilePhoto, setProfilePhoto] = useState("");
   const[lastVisit,setLastvisit] =useState("")


  const [selectedDate, setSelectedDate] = useState(now(getLocalTimeZone()));
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Salunkey");

 

  
  const fetchPatientById = async (patientId: string) => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `http://127.0.0.1:3037/DocPOC/v1/patient/${patientId}`;
  
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  

      
      setPatientName(response.data.name)
      setPatientPhone(response.data.phone)
      setPatientBloodGroup(response.data.bloodGroup)
      setPatientEmail(response.data.email)
      setPatientStatus(response.data.status)
      setProfilePhoto(response.data.displayPicture)
      setLastvisit(response.data.lastVisit)
    } catch (err) {
      // setError("Failed to fetch patient.");
    } finally {
      // setLoading(false);
    }
  };
useEffect(()=>{
  fetchPatientById(props.patientId)
},[])


  const editTime = () => {
    setEditVisitTime(!editVisitTime);
  };
  const editDoctor = () => {
    setEditDoctor(!editSelectedDoctor);
  };

  const editName = () => {
    // setPatientName("Rekha Pandey");
    setEditPatient(!editSelectedPatient);
  };
  const editStatus = () => {
    setPatientStatus("Inactive");
    setEditPatientStatus(!editSelectedPatientStatus);
  };

  const editEmail = () => {
    // setPatientEmail("test@gmail.com");
    setEditPatientEmail(!editSelectedPatientEmail);
  };

  const editPhone = () => {
    // setPatientPhone("+91 8276536576");
    setEditPatientPhone(!editSelectedPatientPhone);
  };

  const editBloodGroup = () => {
    setEditPatientBloodGroup(!editSelectedPatientBloodGroup);
  };

  const handleDateChange = (newDate: ZonedDateTime) => {
    setSelectedDate(newDate);
    // setEditVisitTime(false);
  };

  const editEmployeeName = () => {
    setEmployeeName("Rekha Pandey");
    setEditEmployee(!editSelectedEmployee);
  };

  const editEmployeeEmail = () => {
    setEmployeeEmail("test@gmail.com");
    setEditEmployeeEmail(!editSelectedEmployeeEmail);
  };

  const editEmployeePhone = () => {
    setEmployeePhone("+91 8276536576");
    setEditEmployeePhone(!editSelectedEmployeePhone);
  };

  const editEmployeeDesignation = () => {
    setEmployeeDesignation("Doctor (ENT Specialist)");
    setEditEmployeeDesignation(!editSelectedEmployeeDesignation);
  };

  const editEmployeeShiftTime = () => {
    setEmployeeShiftTime(employeeShiftTime);
    setEditEmployeeShiftTime(!editSelectedEmployeeShiftTime);
  };

  const editEmployeeJoiningDate = (newDate: DateValue) => {
    setEmployeeJoiningDate(newDate);
  };

  const editEmployeeTime = () => {
    setEditEmployeeJoiningDate(!editSelectedEmployeeJoiningDate);
  };

  const editEmployeeDOB = (newDate: DateValue) => {
    setEmployeeDOB(newDate);
  };

  const editEmployeeDobTime = () => {
    setEditEmployeeDOB(!editSelectedEmployeeDOB);
  };

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
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

  const formatDate = (date: ZonedDateTime) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(date.year, date.month - 1, date.day)
    );
  };

  const formatTime = (date: ZonedDateTime) => {
    const hours = date.hour;
    const minutes = date.minute;
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
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
  ]; // Example doctors list

  if (props.type === MODAL_TYPES.VIEW_APPOINTMENT) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] mx-auto"
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
                src={USER_ICONS.FEMALE_USER}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground/90">
                  Appointment Details
                </h3>
                <StyledButton label={"Follow-up"} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <SVGIconProvider iconName="clock" />
                  <p className="text-medium ml-2">
                    <strong>Visiting Time: </strong> 10:30 AM
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="calendar" />
                  <p className="text-medium ml-2">
                    <strong>Date: </strong> June 15, 2024
                  </p>
                </div>
                <div className="flex items-center">
                  <div style={{ marginLeft: -5 }}>
                    <SVGIconProvider iconName="doctor" />
                  </div>
                  <p className="text-medium ml-2">
                    <strong>Appointed Doctor: </strong> Dr. Jane Smith
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="followup" />
                  <p className="text-medium ml-2">
                    <strong>Follow-up: </strong> Yes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_APPOINTMENT) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[700px] mx-auto"
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
                src={USER_ICONS.MALE_USER}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground/90">
                  Edit Appointment Details
                </h3>
                <StyledButton label={"Follow-up"} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <SVGIconProvider iconName="clock" />
                  {!editVisitTime && (
                    <p className="text-medium ml-2">
                      <strong>Visiting Time: </strong>{" "}
                      {formatTime(selectedDate)}
                    </p>
                  )}

                  {editVisitTime && (
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      <DatePicker
                        label="Event Date"
                        variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        defaultValue={selectedDate}
                        onChange={handleDateChange}
                        style={{ marginLeft: 0 }}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
                    <strong>Date: </strong> {formatDate(selectedDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <div style={{ marginLeft: -5 }}>
                    <SVGIconProvider iconName="doctor" />
                  </div>
                  {!editSelectedDoctor && (
                    <p className="text-medium ml-2">
                      <strong>Appointed Doctor: </strong> {selectedDoctor}
                    </p>
                  )}
                  {editSelectedDoctor && (
                    <>
                      <p className="text-medium ml-2">
                        <strong>Appointed Doctor: </strong>
                      </p>
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered">{selectedDoctor}</Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Dynamic Actions"
                            items={doctorsList}
                            onAction={(key) =>
                              setSelectedDoctor(
                                doctorsList.find((item) => item.key === key)
                                  ?.label ?? selectedDoctor
                              )
                            }
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
                    </>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
                    <strong>Follow-up: </strong> Yes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (props.type === MODAL_TYPES.DELETE_APPOINTMENT) {
    return (
      <>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this appointment?
        </h2>

        <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <SVGIconProvider iconName="clock" />
              <p className="text-medium ml-2">
                <strong>Visit Time: </strong> 10:30 AM
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="calendar" />
              <p className="text-medium ml-2">
                <strong>Date: </strong> June 15, 2024
              </p>
            </div>
            <div className="flex items-center">
              <div style={{ marginLeft: -5 }}>
                <SVGIconProvider iconName="doctor" />
              </div>
              <p className="text-medium ml-2">
                <strong>Appointed Doctor: </strong> Dr. Jane Smith
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="followup" />
              <p className="text-medium ml-2">
                <strong>Follow-up: </strong> Yes
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (props.type === MODAL_TYPES.VIEW_PATIENT) {
    return (
      <Card
        isBlurred
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
                src={profilePhoto}
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
                  <p className="text-medium ml-2">
                    <strong>Patient Name: </strong>{patientName}
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="clock" />
                  <p className="text-medium ml-2">
                    <strong>Last Visit: </strong>{lastVisit}
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="calendar" />
                  <p className="text-medium ml-2">
                    <strong>Status: </strong> {patientStatus}
                  </p>
                </div>
                <div className="flex items-center">
                  <div style={{ marginLeft: -5 }}>
                    <SVGIconProvider iconName="doctor" />
                  </div>
                  <p className="text-medium ml-2">
                    <strong>Last Appointed Doctor: </strong>Dr. Jane Smith
                  </p>
                </div>
                <div className="flex items-center">
                  <Accordion variant="splitted">
                    <AccordionItem
                      key="1"
                      aria-label="Previous visits"
                      title="Previous visits"
                    >
                      <VisitHistoryTable />
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_PATIENT) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <div>
                <div className="relative drop-shadow-2">
                  <Image
                    src={profilePhoto}
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
                  <SVGIconProvider iconName="clock" />
                  <p className="text-medium ml-2">
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
                        onChange={(e)=>setPatientName(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <SVGIconProvider iconName="calendar" />
                  <p className="text-medium ml-2">
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
                        onChange={(e)=>setPatientStatus(e.target.value)}
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
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="email" />
                  <p className="text-medium ml-2">
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
                        onChange={(e)=>setPatientEmail(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
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
                          onAction={(key) =>
                            setPatientBloodGroup(
                              bloodGroupList.find((item) => item.key === key)
                                ?.label ?? patientBloodGroup
                            )
                          }
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
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
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
                        onChange={(e)=>setPatientPhone(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
    );
  }

  if (props.type === MODAL_TYPES.DELETE_PATIENT) {
    return (
      <>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this patient?
        </h2>

        <div className="flex flex-col col-span-6 md:col-span-8 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <SVGIconProvider iconName="clock" />
              <p className="text-medium ml-2">
                <strong>Name: </strong> {patientName}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="calendar" />
              <p className="text-medium ml-2">
                <strong>email: </strong>{patientEmail}
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="phone" />
              <p className="text-medium ml-2">
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
      <Card
        isBlurred
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
                src={USER_ICONS.FEMALE_USER}
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
                  <p className="text-medium ml-2">
                    <strong>Name: </strong>Binu Bhagat
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="email" />
                  <p className="text-medium ml-2">
                    <strong>email: </strong>binu@browser.com
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="phone" />
                  <p className="text-medium ml-2">
                    <strong>Phone: </strong>+91- 8263765543
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="icard" />
                  <p className="text-medium ml-2">
                    <strong>Designation: </strong>Nurse
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="clock" />
                  <p className="text-medium ml-2">
                    <strong>Working Hours: </strong>8:30 AM - 6:00 PM
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="calendar" />
                  <p className="text-medium ml-2">
                    <strong>Joined On: </strong> 27th Jan, 2021
                  </p>
                </div>
                <div className="flex items-center">
                  <div style={{ marginLeft: -5 }}>
                    <SVGIconProvider iconName="key" />
                  </div>
                  <p className="text-medium ml-2">
                    <strong>Access Type: </strong>Super-Admin
                  </p>
                </div>
                <div className="flex items-center">
                  <SVGIconProvider iconName="birthday" />
                  <p className="text-medium ml-2">
                    <strong>Date Of Birth: </strong> 27th Jan, 1991
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (props.type === MODAL_TYPES.EDIT_EMPLOYEE) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px] mx-auto"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-8 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <div>
                <div className="relative drop-shadow-2">
                  <Image
                    src={profilePhoto}
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
                  <p className="text-medium ml-2">
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
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
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
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
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
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <SVGIconProvider iconName="icard" />
                  <p className="text-medium ml-2">
                    <strong>Designation: </strong>
                    {!editSelectedEmployeeDesignation && employeeDesignation}
                  </p>
                  {editSelectedEmployeeDesignation && (
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      <Input
                        type="text"
                        placeholder="Employee designation.."
                        labelPlacement="outside"
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
                    <strong>Working Hours: </strong>
                    {!editSelectedEmployeeShiftTime && employeeShiftTime}
                  </p>
                  {editSelectedEmployeeShiftTime && (
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      <TimeInput
                        defaultValue={new Time(11, 45)}
                        label="Start"
                      />
                      <div
                        className="flex items-center"
                        style={{ marginLeft: 10 }}
                      >
                        <TimeInput
                          defaultValue={new Time(20, 45)}
                          label="End"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  <p className="text-medium ml-2">
                    <strong>Joined On: </strong>{" "}
                  </p>
                  {!editSelectedEmployeeJoiningDate && (
                    <p className="text-medium ml-2">
                      {formatDate(employeeJoiningDate)}
                    </p>
                  )}

                  {editSelectedEmployeeJoiningDate && (
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      <DatePicker
                        showMonthAndYearPickers
                        label="Joining Date"
                        className="max-w-[284px]"
                        onChange={editEmployeeJoiningDate}
                        style={{ marginLeft: 0 }}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
                  </div>
                </div>
                <div className="flex items-center">
                  <div style={{ marginLeft: -5 }}>
                    <SVGIconProvider iconName="key" />
                  </div>
                  <p className="text-medium ml-2">
                    <strong>Access Type: </strong>Super-Admin
                  </p>
                </div>

                <div className="flex items-center">
                  <SVGIconProvider iconName="birthday" />
                  <p className="text-medium ml-2">
                    <strong>Date Of Birth: </strong>{" "}
                  </p>
                  {!editSelectedEmployeeDOB && (
                    <p className="text-medium ml-2">
                      {formatDate(employeeDOB)}
                    </p>
                  )}

                  {editSelectedEmployeeDOB && (
                    <div
                      className="flex items-center"
                      style={{ marginLeft: 10 }}
                    >
                      <DatePicker
                        showMonthAndYearPickers
                        label="Date Of Birth"
                        className="max-w-[284px]"
                        onChange={editEmployeeDOB}
                        style={{ marginLeft: 0 }}
                      />
                    </div>
                  )}
                  <div className="flex items-center" style={{ marginLeft: 10 }}>
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
    );
  }

  if (props.type === MODAL_TYPES.DELETE_EMPLOYEE) {
    return (
      <>
        <h2 style={{ color: GLOBAL_DANGER_COLOR }}>
          Are you sure you want to delete this employee?
        </h2>

        <div className="flex flex-col col-span-6 md:col-span-8 space-y=4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground/90">
              Employee Details
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <SVGIconProvider iconName="user" />
              <p className="text-medium ml-2">
                <strong>Name: </strong>Binu Bhagat
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="email" />
              <p className="text-medium ml-2">
                <strong>email: </strong>binu@browser.com
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="phone" />
              <p className="text-medium ml-2">
                <strong>Phone: </strong>+91- 8263765543
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="icard" />
              <p className="text-medium ml-2">
                <strong>Designation: </strong>Nurse
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="clock" />
              <p className="text-medium ml-2">
                <strong>Working Hours: </strong>8:30 AM - 6:00 PM
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="calendar" />
              <p className="text-medium ml-2">
                <strong>Joined On: </strong> 27th Jan, 2021
              </p>
            </div>
            <div className="flex items-center">
              <div style={{ marginLeft: -5 }}>
                <SVGIconProvider iconName="key" />
              </div>
              <p className="text-medium ml-2">
                <strong>Access Type: </strong>Super-Admin
              </p>
            </div>
            <div className="flex items-center">
              <SVGIconProvider iconName="birthday" />
              <p className="text-medium ml-2">
                <strong>Date Of Birth: </strong> 27th Jan, 1991
              </p>
            </div>
          </div>
        </div>
      </>
    );
    if(props.type == MODAL_TYPES.ADD_APPOINTMENT){
      return (<><AddAppointment /></>);
    }
  }
  return null;
}

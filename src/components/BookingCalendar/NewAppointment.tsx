"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Input,
  Textarea,
  TimeInput,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AutocompleteItem {
  value: string;
  label: string;
  description?: string;
  dob?: string;
  workingHours: string;
}
interface NewAppointmentProps {
  onUsersAdded: () => void;
  startDateTime: string; // ISO string for start time
  endDateTime: string; // ISO string for end time
  date: any; // ISO string for the selected date
}

const API_URL = process.env.API_URL;
const NewAppointment: React.FC<NewAppointmentProps> = ({
  onUsersAdded,
  startDateTime,
  endDateTime,
  date,
}) => {
  // const [edit, setEdit] = useState(true);
  const edit = true;
  const [patientList, setPatientList] = useState<AutocompleteItem[]>([]);
  const [doctorList, setDoctorList] = useState<AutocompleteItem[]>([]);
  const [appointmentTypeList, setAppointmentTypeList] = useState<
    AutocompleteItem[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const [appointmentStatusList, setAppointmentStatusList] = useState<
    AutocompleteItem[]
  >([]);
  // const [savingData, setSavingData] = useState(false);

  const inputDate = new Date(date);
  const correctedDate = new Date(
    inputDate.getTime() - inputDate.getTimezoneOffset() * 60000,
  );
  // Format as ISO
  const dateTime = correctedDate.toISOString().split("T")[0];
  const profile = useSelector((state: RootState) => state.profile.data);
  const [timeWarning, setTimeWarning] = useState("");
  // console.log(startDateTime)

  // const [formData, setFormData] = useState<{
  //   name: string;
  //   doctorId: string;
  //   patientId: string;
  //   type: string;
  //   dateTime: string;
  //   startDateTime: Date | string;
  //   endDateTime: Date | string;
  //   code: string;
  //   json: string;
  // }>({
  //   name: "",
  //   doctorId: "",
  //   patientId: "",
  //   type: "",
  //   dateTime: "",
  //   startDateTime: "",
  //   endDateTime: "",
  //   code: "ST-ID/15",
  //   json: "",
  // });

  const [formData, setFormData] = useState({
    name: "",
    doctorId: "",
    patientId: "",
    type: "",
    dateTime, // Pre-filled with the prop value
    startDateTime, // Pre-filled with the prop value
    endDateTime, // Pre-filled with the prop value
    code: "ST-ID/15",
    json: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

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

    const isoTime = generateDateTime(formData.dateTime, time); // Combine selected date with time
    setFormData({ ...formData, [field]: isoTime });
  };

  const handlePatientSelection = (patientId: string) => {
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
    onClose();
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
    // setSavingData(true);

    const { startDateTime, endDateTime, doctorId } = formData;

    // Find the selected doctor from the doctorList
    const selectedDoctor = doctorList.find(
      (doctor) => doctor.value === doctorId,
    );

    if (selectedDoctor) {
      const workingHours = selectedDoctor.workingHours;

      // Validate the working hours
      if (
        workingHours &&
        !isWithinWorkingHours(
          new Date(startDateTime),
          new Date(endDateTime),
          workingHours,
        )
      ) {
        // setModalMessage({
        //   success: "",
        //   error:
        //     "The selected appointment time is outside the doctor's working hours. Please choose a different time.",
        // });
        // onOpen();
        // setSavingData(false);
        // return;
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
      // setSavingData(false);
      onOpen();
      return;
    }

    console.log("Token:", token);

    try {
      const token = localStorage.getItem("docPocAuth_token");

      // Parse the JSON string if it exists
      // const parsedUserProfile = userProfile ? JSON.parse(userProfile) : null;

      // Extract the branchId from the user profile
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
    } catch (error: any) {
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message,
      );
      setModalMessage({
        success: "",
        error: `Error creating appointment: ${error.response?.data?.message || "Unknown error"}`,
      });
      onOpen();
    }
    setLoading(false);
    // setSavingData(false);
  };

  const handleTypeSelection = (typeId: string) => {
    setFormData({ ...formData, type: typeId });
  };
  const handleStatusSelection = (statusId: string) => {
    setFormData({ ...formData, status: statusId });
  };

  const fetchAppointmentTypes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const fetchedBranchId = profile?.branchId;
      // Step 3: Fetch Appointment Types
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

      // Step 4: Fetch Appointment Status
      const appointmentStatusEndpoint = `${API_URL}/appointment/status/${fetchedBranchId}`;
      const response2 = await axios.get(appointmentStatusEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const transformedStatus: AutocompleteItem[] = response2.data.map(
        (type: any) => ({
          label: type.status,
          value: type.id,
        }),
      );
      setAppointmentStatusList(transformedStatus);

      // Step 5: Fetch Patients
      const patientsendpoint = `${API_URL}/patient/list/${fetchedBranchId}`;
      const params: any = {};
      params.page = 1;
      params.pageSize = 50;
      params.from = "2021-12-04T03:32:25.812Z";
      params.to = "2024-12-11T03:32:25.815Z";
      params.notificationStatus = [
        "Whatsapp notifications paused",
        "SMS notifications paused",
      ];
      const response3 = await axios.get(patientsendpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response3.data.rows)
      const transformedPatients: AutocompleteItem[] = response3.data.rows.map(
        (patient: any) => ({
          label: patient.name,
          value: patient.id,
          description: `${patient.phone} | ${patient.email}`,
          dob: patient.dob, // Include DOB
        }),
      );
      setPatientList(transformedPatients);

      // Step 6: Fetch  Doctors
      const doctorsEndpoint = `${API_URL}/user/list/${fetchedBranchId}`;

      // const params: any = {};

      params.page = 1;
      params.pageSize = 50;
      // params.from = '2024-12-04T03:32:25.812Z';
      // params.to = '2024-12-11T03:32:25.815Z';

      const response4 = await axios.get(doctorsEndpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const allUsers = response4.data.rows;

      // Filter and transform only doctors
      const doctors = allUsers.filter((user: any) => {
        try {
          const userJson = JSON.parse(user.json);
          return userJson.designation === "Doctor"; // Check if designation is "Doctor"
        } catch (err) {
          console.error("Error parsing JSON for user:", user, err);
          return false;
        }
      });

      // const transformedDoctors: AutocompleteItem[] = doctors.map((doctor: any) => ({
      //   label: doctor.name,
      //   value: doctor.id,
      //   description: `${doctor.phone} | ${doctor.email}`,
      // }));
      // setDoctorList(transformedDoctors)
      // setUsers(response.data.rows || response.data);
      // setTotalUsers(response.data.count || response.data.length);

      const transformedDoctors: AutocompleteItem[] = doctors.map(
        (doctor: any) => {
          try {
            const doctorJson = JSON.parse(doctor.json || "{}"); // Parse the `json` string into an object
            return {
              label: doctor.name,
              value: doctor.id,
              description: `${doctor.phone} | ${doctor.email}`,
              workingHours: doctorJson.workingHours || "Not Available", // Extract `workingHours` or fallback
            };
          } catch (err) {
            console.error("Error parsing doctor JSON for working hours:", err);
            return {
              label: doctor.name,
              value: doctor.id,
              description: `${doctor.phone} | ${doctor.email}`,
              workingHours: "Not Available", // Fallback if JSON parsing fails
            };
          }
        },
      );
      setDoctorList(transformedDoctors);
    } catch (error) {
      console.error("Error fetching appointment types:", error || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchDoctors()
    // fetchPatients()
    fetchAppointmentTypes();
  }, []);

  // useEffect(() => {
  //   if (formData.dateTime) {
  //     const defaultStartTime = generateDateTime(formData.dateTime, new Time(8, 30));
  //     const defaultEndTime = generateDateTime(formData.dateTime, new Time(9));
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       startDateTime: defaultStartTime,
  //       endDateTime: defaultEndTime,
  //     }));
  //   }
  // }, [formData.dateTime]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dateTime,
      startDateTime,
      endDateTime,
    }));
  }, [dateTime, startDateTime, endDateTime]);

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

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, dateTime: date });
  };

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
  return (
    <div className="  grid grid-cols-1 gap-9  ">
      <div className="flex flex-col w-full ">
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
            {/* <div>
              <Switch
                defaultSelected
                color="secondary"
                onClick={() => setEdit(!edit)}
                isSelected={edit}
              >
                Edit
              </Switch>
            </div> */}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"></div>
              <div className="flex flex-col w-full"></div>
              <div
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Input
                  label="Appointment Date"
                  labelPlacement="outside"
                  autoFocus={false}
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  isDisabled={!edit}
                  type="date"
                  value={formData.dateTime}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>

              <div
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  autoFocus={false}
                  // defaultValue={new Time(8, 30)}
                  defaultValue={
                    formData.startDateTime
                      ? new Time(
                          new Date(formData.startDateTime).getHours(),
                          new Date(formData.startDateTime).getMinutes(),
                        )
                      : new Time(8, 30)
                  }
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleTimeChange(time, "startDateTime")}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment End Time"
                  autoFocus={false}
                  labelPlacement="outside"
                  variant="bordered"
                  // defaultValue={new Time(9)}
                  defaultValue={
                    formData.endDateTime
                      ? new Time(
                          new Date(formData.endDateTime).getHours(),
                          new Date(formData.endDateTime).getMinutes(),
                        )
                      : new Time(9, 0)
                  }
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleTimeChange(time, "endDateTime")}
                />
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                {timeWarning && (
                  <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">
                    {timeWarning}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 20 }}>
                <Textarea
                  color={TOOL_TIP_COLORS.secondary}
                  isInvalid={false}
                  autoFocus={false}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Remarks"
                  defaultValue="Patient is having chronic neck pain."
                  errorMessage="The address should be at max 255 characters long."
                  isDisabled={!edit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      json: `{"remarks":"${e.target.value}"}`,
                    })
                  }
                />
              </div>
              <div
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  autoFocus={false}
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={appointmentTypeList}
                  label="Select Appointment Type"
                  placeholder="Search Appointment Type"
                  onSelectionChange={(key) =>
                    handleTypeSelection(key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      autoFocus={false}
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
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Autocomplete
                  autoFocus={false}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={appointmentStatusList}
                  label="Select Appointment Status"
                  placeholder="Search Appointment Status"
                  onSelectionChange={(key) =>
                    handleStatusSelection(key as string)
                  }
                >
                  {(item) => (
                    <AutocompleteItem
                      autoFocus={false}
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
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Autocomplete
                  autoFocus={false}
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
                      autoFocus={false}
                      key={item.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Autocomplete
                  autoFocus={false}
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={doctorList}
                  label="Select Doctor"
                  placeholder="Search a Doctor"
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
                      {`${item.label} - ${item.workingHours}`}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                {timeWarning && (
                  <div className="text-yellow-600 px-6.5 py-2 bg-yellow-100 border-l-4 border-yellow-500">
                    {timeWarning}
                  </div>
                )}
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <label>
                  Mark uncheck if no notification has to be sent for
                  appointment.
                </label>
                <Checkbox
                  color={TOOL_TIP_COLORS.secondary}
                  defaultSelected={true}
                  isDisabled={!edit}
                >
                  All appointments get notified to the patient by default.
                </Checkbox>
              </div>
            </div>
            <div className="flex justify-center mt-4 ">
              <button
                type="submit"
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90 text-white  bg-purple-500 "
                style={{ minWidth: 290, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
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
    </div>
  );
};

export default NewAppointment;

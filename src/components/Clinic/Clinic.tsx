"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Switch,
  Textarea,
  TimeInput,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import { IndianStatesList } from "@/constants/IndiaStates";
import { medicalDepartments } from "@/constants/MedicalDepartments";
import EnhancedModal from "../common/Modal/EnhancedModal";
import axios from "axios";
import { parseTime } from "@internationalized/date";
const API_URL = process.env.API_URL;
const Clinic = () => {
  const [edit, setEdit] = useState(false);
  const [isMultipleBranch, setIsMultipleBranch] = useState(false);
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [workingDays] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [hospitalId, setHospitalId] = useState("")
  const [shiftStartTime, setShiftStartTime] = useState<Time | null>(null);
  const [shiftEndTime, setShiftEndTime] = useState<Time | null>(null);

  const [selectedStateKey, setSelectedStateKey] = useState<string | null>(null);

  const [clinicDetails, setClinicDetails] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    pincode: "",
    address: "",
    shiftStart: "",
    shiftEnd: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setClinicDetails({ ...clinicDetails, [field]: value });
  };
  const handleWorkingDaysChange = (values: string[]) => {
    setSelectedWorkingDays(values);
  };

  const handleDepartmentsChange = (values: string[]) => {
    setSelectedDepartments(values);
  };


  const locationDetact = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setDetectedLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error obtaining geolocation:", error);
          // alert("Failed to detect location. Please enable location services.");
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.error("Error detecting location or creating hospital:", error);
      // alert("An error occurred while detecting location.");
    }
  }
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
  };
  const flipEdit = () => {
    setEdit(!edit);
  };
  const fetchHospitalDetails = async () => {
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const response = await axios.get(`${API_URL}/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log(data)

      if (data.length > 0) {
        const hospital = data[0];
        const parsedJson = hospital.json ? JSON.parse(hospital.json) : {};

        setHospitalId(hospital.id);
        setClinicDetails({
          name: hospital.name,
          phone: hospital.phone,
          email: hospital.email,
          state: parsedJson.state || "",
          pincode: parsedJson.pincode || "",
          address: parsedJson.address || "",
          shiftStart: parsedJson.shiftStart || "",
          shiftEnd: parsedJson.shiftEnd || "",
        });
        setSelectedWorkingDays(parsedJson.workingDays || []);
        setSelectedDepartments(parsedJson.departments || []);
        setIsMultipleBranch(parsedJson.multipleBranch || false);
        setDetectedLocation(parsedJson.googleLocation || "");
        setShiftStartTime(parsedJson.shiftStart ? parseTime(parsedJson.shiftStart) : null);
        setShiftEndTime(parsedJson.shiftEnd ? parseTime(parsedJson.shiftEnd) : null);

        setHospitalId(hospital.id)
        const fetchedStateKey = IndianStatesList.find(
          (item) => item.label === parsedJson.state
        )?.value;

        setSelectedStateKey(fetchedStateKey || null);

      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const errors: Record<string, string> = {};

    if (!clinicDetails.name.trim()) {

      errors.name = "Clinic/Hospital name is required.";
    }
    if (!clinicDetails.phone.trim()) errors.phone = "Contact number is required.";
    if (!/^\d{10}$/.test(clinicDetails.phone.trim())) errors.phone = "Contact number must be a valid 10-digit number.";
    if (!clinicDetails.email.trim()) errors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(clinicDetails.email.trim())) errors.email = "Email is not valid.";
    if (!clinicDetails.state.trim()) errors.state = "State is required.";
    if (!clinicDetails.pincode.trim()) errors.pincode = "Pincode is required.";
    if (!/^\d{6}$/.test(clinicDetails.pincode.trim())) errors.pincode = "Pincode must be a valid 6-digit number.";
    if (!clinicDetails.address.trim()) errors.address = "Visiting address is required.";
    if (!shiftStartTime) errors.shiftStart = "Shift start time is required.";
    if (!shiftEndTime) errors.shiftEnd = "Shift end time is required.";
    if (selectedWorkingDays.length === 0) errors.workingDays = "At least one working day must be selected.";
    if (selectedDepartments.length === 0) errors.departments = "At least one department must be selected.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors); // Set the errors in state for further use
      setLoading(false);

      // Build the modal message for displaying required fields
      const errorMessage = Object.entries(errors)
        .map(([field, message]) => `- ${message}`)
        .join("\n");

      setModalMessage({
        success: "",
        error: `Please address the following issues:\n${errorMessage}`,
      });

      onOpen(); // Open the modal to show the errors
      return;
    }

    setErrors({});

    try {
      const hospitalData = {
        name: clinicDetails.name,
        phone: clinicDetails.phone,
        email: clinicDetails.email,
        ninId: "NA1092KU872882",
        json: JSON.stringify({
          state: clinicDetails.state,
          pincode: clinicDetails.pincode,
          address: clinicDetails.address,
          shiftStart: clinicDetails.shiftStart,
          shiftEnd: clinicDetails.shiftEnd,
          workingDays: selectedWorkingDays,
          multipleBranch: isMultipleBranch,
          googleLocation: detectedLocation,
          departments: selectedDepartments,
        }),
      };
      const token = localStorage.getItem("docPocAuth_token");

      const requestData = {
        id: hospitalId,
        ...hospitalData,
      };

      if (hospitalId) {
        await axios.patch(`${API_URL}/hospital`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setModalMessage({
          success: "Hospital details updated successfully",
          error: "",
        });
        onOpen()
      }

      else {
        const response = await axios.post(`${API_URL}/hospital`, hospitalData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const { id } = response.data;
        setHospitalId(id);

        const branchData = {
          hospitalId: id,
          name: detectedLocation,
          phone: clinicDetails.phone,
          email: clinicDetails.email,
          ninId: "NA1092KU872882",
          json: JSON.stringify({
            state: clinicDetails.state,
            pincode: clinicDetails.pincode,
            address: clinicDetails.address,
            shiftStart: clinicDetails.shiftStart,
            shiftEnd: clinicDetails.shiftEnd,
            workingDays: selectedWorkingDays,
            departments: selectedDepartments,
            multipleBranch: isMultipleBranch,
            googleLocation: detectedLocation
          }),
        };
        await axios.post(`${API_URL}/hospital/branch`, branchData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setModalMessage({
          success: "Hospital created successfully",
          error: ``,
        });
        onOpen()
      }

    } catch (error: any) {
      console.error("Error creating branch:", error);
      // alert("Failed to create branch.");
      setModalMessage({
        success: "",
        error: `Error creating branch: ${error.message}`,
      });
      onOpen()
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchHospitalDetails()
  }, [])


  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-9  m-1 sm:m-2">
      <div className="flex flex-col w-full">
        {/* <!-- Contact Form --> */}
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-3 py-2  sm:px-6.5 sm:py-4 dark:border-dark-3 flex flex-row gap-4 sm:gap-9">
            <h3 className="font-semibold text-dark dark:text-white">
              Clinic/Hospital Details
            </h3>
            <div>
              <Switch
                checked={isMultipleBranch}
                onChange={() => setIsMultipleBranch(!isMultipleBranch)}
                size="lg"
                color="secondary"
                // isDisabled={!edit}
                onClick={flipEdit}
              >
                Edit
              </Switch>
            </div>
          </div>
          <form onSubmit={handleSaveChanges}>
            <div className=" p-3 sm:p-6.5">
              <div className=" mb-2.5 sm:mb-4.5 flex flex-col gap-2  sm:gap-4.5 xl:flex-row">
                <Input
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Clinic/Hospital Name"
                  color={TOOL_TIP_COLORS.secondary}
                  value={clinicDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  isDisabled={!edit}
                // errorMessage={errors.name}
                />
                <Input
                  key="inside"
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Contact Number"
                  color={TOOL_TIP_COLORS.secondary}
                  maxLength={15}
                  value={clinicDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  isDisabled={!edit}
                />
                <Input
                  key="inside"
                  variant="bordered"
                  type="email"
                  labelPlacement="outside"
                  label="Email"
                  color={TOOL_TIP_COLORS.secondary}
                  value={clinicDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isDisabled={!edit}
                />
              </div>
              <div className="flex flex-col w-full">
                <CheckboxGroup
                  label="Select working days"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  value={selectedWorkingDays}
                  onChange={handleWorkingDaysChange}
                  isDisabled={!edit}
                >
                  {workingDays.map((day) => (
                    <Checkbox key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
              <div
                className="mb-2.5 sm:mb-4.5 flex flex-col gap-2 sm:gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  value={shiftStartTime}
                  // defaultValue={new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  // onChange={(time) => handleInputChange("shiftStart", time.toString())}
                  onChange={(time) => {
                    setShiftStartTime(time); // Update the Time state
                    handleInputChange("shiftStart", time.toString()); // Update clinicDetails state
                  }}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  value={shiftEndTime}
                  // defaultValue={new Time(6, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => {
                    setShiftEndTime(time); // Update the Time state
                    handleInputChange("shiftEnd", time.toString()); // Update clinicDetails state
                  }}
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <Textarea
                  isDisabled={!edit}
                  color={TOOL_TIP_COLORS.secondary}
                  isInvalid={false}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Visiting Address"
                  errorMessage="The address should be at max 255 characters long."
                  value={clinicDetails.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div
                className="mb-2 sm:mb-4.5 flex flex-col gap-2 sm:gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  selectedKey={selectedStateKey}
                  // defaultSelectedKey="karnataka"
                  defaultItems={IndianStatesList}
                  label="Select State"
                  placeholder="Search a state"
                  onSelectionChange={(key) => {
                    const selectedState = IndianStatesList.find((item) => item.value === key);
                    handleInputChange("state", selectedState?.label || "");
                    setSelectedStateKey(key ? key as string : null);
                  }}
                >
                  {(IndianStatesList) => (
                    <AutocompleteItem
                      key={IndianStatesList.value}
                      variant="shadow"
                      color={TOOL_TIP_COLORS.secondary}
                    >
                      {IndianStatesList.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Input
                  key="inside"
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Enter Pincode"
                  color={TOOL_TIP_COLORS.secondary}
                  maxLength={6}
                  value={clinicDetails.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  isDisabled={!edit}
                />
              </div>
              <div className="flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row" style={{ marginTop: 20 }}>
                <Input
                  key="location"
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Detected Location"
                  value={detectedLocation}
                  isReadOnly
                  color={TOOL_TIP_COLORS.secondary}
                  isDisabled={!edit}
                />

                <button
                  color="secondary"
                  onClick={locationDetact}
                  type="button"
                  style={{ marginTop: 20 }}
                  disabled={!edit}
                  className={`rounded-[7px] p-[10px] font-medium hover:bg-opacity-90  ${edit ? "bg-purple-500 text-white" : " bg-purple-500 text-white opacity-50 cursor-not-allowed "} `}
                >
                  Detect Location
                </button>
              </div>
              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <CheckboxGroup
                  label="Select Eligible Departments"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  value={selectedDepartments}
                  onChange={handleDepartmentsChange}
                  isDisabled={!edit}
                >
                  {medicalDepartments.map((department) => (
                    <Checkbox key={department.value} value={department.value}>
                      {department.label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <label>
                  Leave unchecked if appointments from your website needs admin(s)
                  action to confirm booking.
                </label>
                <Checkbox color={TOOL_TIP_COLORS.secondary}
                  isDisabled={!edit}
                >

                  All appointments gets confirmed by default.
                </Checkbox>
              </div>
            </div>

            <div className="flex justify-center mt-2 sm:mt-4">
              <button
                type="submit"
                disabled={!edit}
                // isDisabled={!edit}
                color={TOOL_TIP_COLORS.secondary}
                className={`rounded-[7px] p-[10px] font-medium hover:bg-opacity-90  ${edit ? "bg-purple-500 text-white" : " bg-purple-500 text-white opacity-50 cursor-not-allowed "} `}
                style={{ minWidth: 290, marginBottom: 20 }}
              // onPress={onOpen}
              >
                Save Changes
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

export default Clinic;

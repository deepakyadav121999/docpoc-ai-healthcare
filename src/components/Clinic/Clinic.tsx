"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  CheckboxGroup,
  Input,
  Switch,
  Textarea,
  TimeInput,
  useDisclosure,
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

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  // fetchProfile,
  updateAccessToken,
} from "../../store/slices/profileSlice";

const API_URL = process.env.API_URL;
interface PincodeValidationResponse {
  PostOffice: any;
  state: string;
  district: string;
  pincode: string;
  status: "Success" | "Error";
}

const Clinic = () => {
  const profile = useSelector((state: RootState) => state.profile.data);
  const dispatch = useDispatch<AppDispatch>();

  console.log("redux", profile);
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
    "sunday",
  ]);
  // const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [hospitalId, setHospitalId] = useState("");
  const [shiftStartTime, setShiftStartTime] = useState<Time | null>(null);
  const [shiftEndTime, setShiftEndTime] = useState<Time | null>(null);

  const [selectedStateKey, setSelectedStateKey] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  //  const [userupdated, setuserupdated] = useState("abc")
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
  const [isHospitalAvailable, setIsHospitalAvailable] = useState(false);
  const [userId, setUserId] = useState("");
  // const [autocompleteValue, setAutocompleteValue] = useState("");
  const [pincodeError, setPincodeError] = useState<string>("");
  const [isValidatingPincode, setIsValidatingPincode] =
    useState<boolean>(false);
  const [isPincodeValid, setIsPincodeValid] = useState<boolean>(false);
  // Function to validate pincode against selected state
  const validatePincode = async (pincode: string, state: string) => {
    if (!pincode || !state) {
      setIsPincodeValid(false);
      return false;
    } // Skip validation if empty

    setIsValidatingPincode(true);
    setPincodeError("");

    try {
      // Use a pincode API service (example using Postalpincode.in)
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data: PincodeValidationResponse[] = await response.json();

      if (data[0]?.status === "Error") {
        setPincodeError("Invalid pincode");
        setIsPincodeValid(false);
        return false;
      }

      const pincodeState = data[0]?.PostOffice?.[0]?.State;
      if (!pincodeState) {
        setPincodeError("Could not verify pincode");
        setIsPincodeValid(false);
        return false;
      }

      // Check if pincode state matches selected state
      const selectedStateObj = IndianStatesList.find(
        (item) => item.label === state,
      );
      const isValid =
        pincodeState.toLowerCase() === selectedStateObj?.label.toLowerCase();

      if (!isValid) {
        setPincodeError(`Pincode belongs to ${pincodeState}, not ${state}`);
      }

      setIsPincodeValid(isValid);
      return isValid;
    } catch (error) {
      console.error("Pincode validation error:", error);
      setPincodeError("Error validating pincode");
      return false;
    } finally {
      setIsValidatingPincode(false);
    }
  };

  const handleInputChange = async (field: string, value: string) => {
    // if (field === "state") {
    //   const selectedState = IndianStatesList.find(
    //     (item) => item.label === value,
    //   );
    //   setSelectedStateKey(selectedState?.value || null);
    // }
    if (field === "state") {
      const selectedState = IndianStatesList.find(
        (item) => item.label === value,
      );
      setSelectedStateKey(selectedState?.value || null);

      // Validate pincode when state changes
      if (clinicDetails.pincode) {
        await validatePincode(clinicDetails.pincode, value);
      }
    }
    if (field === "pincode") {
      // Only allow numeric input
      const numericValue = value.replace(/\D/g, "");
      setClinicDetails({ ...clinicDetails, [field]: numericValue });

      // Validate pincode if state is selected
      if (numericValue.length === 6 && clinicDetails.state) {
        await validatePincode(numericValue, clinicDetails.state);
      } else if (numericValue.length === 6 && !clinicDetails.state) {
        setPincodeError("Please select state first");
      } else {
        setPincodeError("");
      }
    } else {
      setClinicDetails({ ...clinicDetails, [field]: value });
    }

    // setClinicDetails({ ...clinicDetails, [field]: value });
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
        { enableHighAccuracy: true },
      );
    } catch (error) {
      console.error("Error detecting location or creating hospital:", error);
      // alert("An error occurred while detecting location.");
    }
  };

  const handleModalClose = () => {
    // dispatch(fetchProfile());
    if (modalMessage.success == "Hospital created successfully") {
      dispatch(updateAccessToken(accessToken));
    }

    setModalMessage({ success: "", error: "" });
    onClose();
  };
  const flipEdit = () => {
    setEdit(!edit);
  };
  const fetchHospitalDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");

      const branch = profile.branchId;
      setUserId(profile.id);

      if (!branch) {
        setIsHospitalAvailable(false);
        setEdit(true); // Enable editing if no hospital/branch exists
        setIsMultipleBranch(true);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/hospital/find/${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);

      if (data) {
        setIsHospitalAvailable(true);
        setLoading(false);
        const hospital = data;
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
        setShiftStartTime(
          parsedJson.shiftStart ? parseTime(parsedJson.shiftStart) : null,
        );
        setShiftEndTime(
          parsedJson.shiftEnd ? parseTime(parsedJson.shiftEnd) : null,
        );

        setHospitalId(hospital.id);
        const fetchedStateKey = IndianStatesList.find(
          (item) => item.label === parsedJson.state,
        )?.value;

        setSelectedStateKey(fetchedStateKey || null);
        setEdit(false);
        setIsMultipleBranch(false);
      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      setLoading(false);
    }

    setLoading(false);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (clinicDetails.state && clinicDetails.pincode) {
      const isValid = await validatePincode(
        clinicDetails.pincode,
        clinicDetails.state,
      );
      if (!isValid) {
        setLoading(false);
        setModalMessage({
          success: "",
          error: "Please correct the pincode/state mismatch before saving",
        });
        onOpen();
        return;
      }
    }

    const errors: Record<string, string> = {};
    if (!selectedStateKey || !clinicDetails.state.trim()) {
      errors.state = "Please select a state from the dropdown";
    }
    if (!clinicDetails.name.trim()) {
      errors.name = "Clinic/Hospital name is required.";
    }

    if (!clinicDetails.phone.trim())
      errors.phone = "Contact number is required.";
    if (!/^\d{10}$/.test(clinicDetails.phone.trim()))
      errors.phone = "Contact number must be a valid 10-digit number.";
    if (!clinicDetails.email.trim()) errors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(clinicDetails.email.trim()))
      errors.email = "Email is not valid.";
    // if (!clinicDetails.state.trim()) errors.state = "State is required.";
    if (!clinicDetails.pincode.trim()) errors.pincode = "Pincode is required.";
    if (!/^\d{6}$/.test(clinicDetails.pincode.trim()))
      errors.pincode = "Pincode must be a valid 6-digit number.";
    if (!clinicDetails.address.trim())
      errors.address = "Visiting address is required.";
    if (!shiftStartTime) errors.shiftStart = "Shift start time is required.";
    if (!shiftEndTime) errors.shiftEnd = "Shift end time is required.";
    if (selectedWorkingDays.length === 0)
      errors.workingDays = "At least one working day must be selected.";
    if (selectedDepartments.length === 0)
      errors.departments = "At least one department must be selected.";

    if (Object.keys(errors).length > 0) {
      // setErrors(errors); // Set the errors in state for further use
      setLoading(false);

      // Build the modal message for displaying required fields
      const errorMessage = Object.entries(errors)
        .map(([message]) => `- ${message}`)
        .join("\n");

      setModalMessage({
        success: "",
        error: `Please address the following issues:\n${errorMessage}`,
      });

      onOpen(); // Open the modal to show the errors
      return;
    }

    // setErrors({});

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
        onOpen();
      } else {
        const response = await axios.post(`${API_URL}/hospital`, hospitalData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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
            googleLocation: detectedLocation,
          }),
        };

        const branchdetails = await axios.post(
          `${API_URL}/hospital/branch`,
          branchData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setIsHospitalAvailable(true);
        setModalMessage({
          success: "Hospital created successfully",
          error: ``,
        });
        onOpen();

        const fetchedBranchId = branchdetails.data?.id;
        const userEndpoint = `${API_URL}/user`;

        const userres = await axios.patch(
          userEndpoint,
          {
            id: userId,
            branchId: fetchedBranchId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const newAccessToken = userres.data.access_token;

        if (newAccessToken) {
          // Dispatch the updateAccessToken thunk

          setAccessToken(newAccessToken);
        }

        // await Promise.all(
        //   appointmentStatuses.map((status) =>
        //     axios.post(
        //       `${API_URL}/appointment/status`,
        //       {
        //         status: status.status, // Here we're accessing the status property
        //         branchId: fetchedBranchId,
        //         json: status.json,
        //       },
        //       {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //           "Content-Type": "application/json",
        //         },
        //       },
        //     ),
        //   ),
        // );

        // await Promise.all(
        //   appointmentTypes.map((type) =>
        //     axios.post(
        //       `${API_URL}/appointment/types`,
        //       {
        //         name: type.name,
        //         branchId: fetchedBranchId,
        //         json: type.json,
        //       },
        //       {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //           "Content-Type": "application/json",
        //         },
        //       },
        //     ),
        //   ),
        // );
        // console.log("Profile updated successfully:", response.data);
      }
    } catch (error: any) {
      // console.error("Error creating branch:", error);
      // // alert("Failed to create branch.");
      // setModalMessage({
      //   success: "",
      //   error: `Error creating branch: ${error.message}`,
      // });
      console.error("Error creating branch:", error);

      // Handle duplicate email error specifically
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.[0]?.path === "email" &&
        error.response?.data?.message?.[0]?.message === "email must be unique"
      ) {
        setModalMessage({
          success: "",
          error:
            "This email is already registered. Please use a different email address.",
        });
      } else {
        setModalMessage({
          success: "",
          error: `Error creating branch: ${error.message}`,
        });
      }
      onOpen(); // Show the modal for any error
      setLoading(false);
      // onOpen();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHospitalDetails();
  }, []);

  useEffect(() => {
    const header = document.querySelector("header");

    if (header) {
      // Only modify z-index when modal is open
      if (isOpen) {
        header.classList.remove("z-999");
        header.classList.add("z-0");
      } else {
        header.classList.remove("z-0");
        header.classList.add("z-999");
      }
    }
  }, [isOpen]);

  console.log("Selected State Key:", selectedStateKey);
  console.log("Clinic Details State:", clinicDetails.state);

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-9  m-1 sm:m-2">
      <div className="flex flex-col w-full">
        {/* <!-- Contact Form --> */}

        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-3 py-2  sm:px-6.5 sm:py-4 dark:border-dark-3 flex flex-row gap-4 sm:gap-9">
            {/* {
  loading? <div></div> : <div> {!isHospitalAvailable&& (
    <p className="text-red-500 font-semibold">
      Please create a clinic/hospital first.
    </p>
  )}</div>
 
} */}

            <h3 className="font-semibold text-dark dark:text-white">
              Clinic/Hospital Details
            </h3>
            {/* <div>
              <Switch
                isSelected={isMultipleBranch}
              

                onChange={() => setIsMultipleBranch(!isMultipleBranch)}
                size="lg"
                color="secondary"
                // isDisabled={!edit}
                onClick={flipEdit}
              >
                Edit
              </Switch>
            </div> */}

            <div className="border-b border-stroke px-3 py-2 sm:px-6.5 sm:py-4 dark:border-dark-3 flex flex-col sm:flex-row gap-2 sm:gap-9 items-center justify-between">
              <div className="flex items-center">
                <Switch
                  isSelected={isMultipleBranch}
                  onChange={() => setIsMultipleBranch(!isMultipleBranch)}
                  size="lg"
                  color="secondary"
                  onClick={flipEdit}
                >
                  Edit
                </Switch>
              </div>

              <div className="flex items-center">
                {!isHospitalAvailable && !loading && (
                  <p className="text-red-500 font-semibold text-sm sm:text-base text-center sm:text-left">
                    Please create a clinic/hospital first.
                  </p>
                )}
              </div>
            </div>
          </div>
          <form onSubmit={handleSaveChanges}>
            <div className=" p-3 sm:p-6.5">
              <div className=" mb-2.5 sm:mb-4.5 flex flex-col gap-2  sm:gap-4.5 xl:flex-row">
                <Input
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
                  key="clinic-phone"
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
                  key="clinic-email"
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
                  isDisabled={!edit}
                  selectedKey={selectedStateKey}
                  // defaultSelectedKey="karnataka"
                  defaultItems={IndianStatesList}
                  label="Select State"
                  placeholder="Search a state"
                  onSelectionChange={(key) => {
                    const selectedState = IndianStatesList.find(
                      (item) => item.value === key,
                    );

                    handleInputChange("state", selectedState?.label || "");
                    setSelectedStateKey(key ? (key as string) : null);
                  }}
                  // onSelectionChange={(key) => {
                  //   const selectedState = IndianStatesList.find(item => item.value === key);
                  //   if (selectedState) {
                  //     // Update both state values in a single synchronous operation
                  //     setClinicDetails(prev => ({
                  //       ...prev,
                  //       state: selectedState.label
                  //     }));
                  //     setSelectedStateKey(key as string);
                  //   }
                  // }}
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
                {/* <Autocomplete
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
                  isDisabled={!edit}
                  selectedKey={selectedStateKey}
                  inputValue={autocompleteValue}
                  defaultItems={IndianStatesList}
                  label="Select State"
                  placeholder="Search a state"
                  onSelectionChange={(key) => {
                    const selectedState = IndianStatesList.find(
                      (item) => item.value === key,
                    );
                    if (selectedState) {
                      // Update both state values in a single synchronous operation
                      setClinicDetails((prev) => ({
                        ...prev,
                        state: selectedState.label,
                      }));
                      setSelectedStateKey(key as string);
                      setAutocompleteValue(selectedState.label);
                    } else {
                      setClinicDetails((prev) => ({ ...prev, state: "" }));
                      setSelectedStateKey(null);
                      setAutocompleteValue("");
                    }
                  }}
                  onInputChange={(value) => {
                    setAutocompleteValue(value);
                    if (!value) {
                      setClinicDetails((prev) => ({ ...prev, state: "" }));
                      setSelectedStateKey(null);
                    }
                  }}
                >
                  {(state) => (
                    <AutocompleteItem key={state.value} textValue={state.label}>
                      {state.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete> */}

                <Input
                  classNames={{
                    input: [
                      "text-black", // Light mode text color
                      "dark:text-white", // Dark mode text color
                    ],
                    // inputWrapper: [
                    //   "group-data-[has-value=true]:text-black", // Light mode with value
                    //   "dark:group-data-[has-value=true]:text-white", // Dark mode with value
                    // ],
                    inputWrapper: [
                      // Base styles
                      "border-2",
                      // Normal state
                      "group-data-[has-value=true]:text-black",
                      "dark:group-data-[has-value=true]:text-white",
                      // Invalid state (red border)
                      pincodeError ? "border-danger" : "border-default",
                      // Valid state (green border)
                      clinicDetails.pincode.length === 6 && isPincodeValid
                        ? "border-success"
                        : "",
                    ],
                  }}
                  key="clinic-pincode"
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Enter Pincode"
                  // color={TOOL_TIP_COLORS.secondary}
                  color={
                    pincodeError
                      ? "danger"
                      : clinicDetails.pincode.length === 6 && isPincodeValid
                        ? "success"
                        : TOOL_TIP_COLORS.secondary
                  }
                  maxLength={6}
                  errorMessage={pincodeError}
                  value={clinicDetails.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  isDisabled={!edit}
                  description={
                    isValidatingPincode
                      ? "Validating pincode..."
                      : clinicDetails.pincode.length === 6 && isPincodeValid
                        ? "✓ Pincode matches selected state"
                        : clinicDetails.pincode.length === 6
                          ? "Please verify pincode matches state"
                          : "Enter 6-digit pincode"
                  }
                />
              </div>
              <div
                className="flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <Input
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
                  // style={{ marginTop: 20 }}
                  disabled={!edit}
                  className={`rounded-[7px] p-[10px] font-medium hover:bg-opacity-90  ${edit ? "bg-purple-500 text-white" : " bg-purple-500 text-white opacity-50 cursor-not-allowed "} `}
                  style={{ minWidth: 200, marginBottom: 20, marginTop: 20 }}
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
                  Leave unchecked if appointments from your website needs
                  admin(s) action to confirm booking.
                </label>
                <Checkbox color={TOOL_TIP_COLORS.secondary} isDisabled={!edit}>
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
                style={{ minWidth: 280, marginBottom: 20 }}
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

// const profileEndpoint = `${API_URL}/auth/profile`;
// const profileResponse = await axios.get(profileEndpoint,{
//  headers:{
//    Authorization: `Bearer ${token}`,
//    "Content-Type": "application/json",
//  },
// })

//  const branch = profileResponse.data?.branchId
// const  userd = profileResponse.data?.id;

// setUserId(userd)

// //  localStorage.removeItem('profile', JSON.stringify(profileResponse.data))

//  localStorage.setItem("profile", JSON.stringify(profileResponse.data))

// const userProfile = localStorage.getItem("profile");

// // Parse the JSON string if it exists
// const parsedUserProfile = userProfile ? JSON.parse(userProfile) : null;

// // Extract the branchId from the user profile
// const branch = parsedUserProfile?.branchId;
// setUserId(parsedUserProfile?.id)

// setuserupdated("hello")
// const response1 = await axios.get(`${API_URL}/auth/profile`, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
// });

// const profile = response1.data;
// localStorage.removeItem("profile"), JSON.stringify(profile)
// localStorage.setItem("profile", JSON.stringify(profile)); // Store profile in localStorage
// console.log("Fetched profile:", profile);

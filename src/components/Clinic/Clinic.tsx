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



  // const [selectedDepartments] = useState([
  //   "orthopedics",
  //   "dental",
  //   "ent",
  //   "pediatrics",
  // ]);

  // const flipEdit = () => {
  //   // setEdit(!edit);
  // };

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
  // const handleDetectLocation = async () => {
  //   try {
  //     locationDetact()
  //     const hospitalData = {
  //       name: clinicDetails.name,
  //       phone: clinicDetails.phone,
  //       email: clinicDetails.email,
  //       ninId: "NA1092KU872882",
  //       json: JSON.stringify({
  //         state: clinicDetails.state,
  //         pincode: clinicDetails.pincode,
  //         address: clinicDetails.address,
  //         shiftStart: clinicDetails.shiftStart,
  //         shiftEnd: clinicDetails.shiftEnd,
  //         workingDays: selectedWorkingDays,
  //         multipleBranch: isMultipleBranch,
  //         googleLocation: detectedLocation
  //       }),
  //     };
  //     const token = localStorage.getItem("docPocAuth_token");
  //     const response = await axios.post(`${API_URL}/hospital`, hospitalData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const { id } = response.data;
  //     setHospitalId(id);

  //     // alert("Hospital created successfully");

  //   } catch (error) {
  //     console.error("Error creating hospital:", error);
  //     // alert("Failed to create hospital.");
  //   }
  // };
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

      if (data.length>0) {
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
      }

      else{
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
      }
      
      // const token = localStorage.getItem("docPocAuth_token");
     
      // alert("Branch created successfully!");
    } catch (error) {
      console.error("Error creating branch:", error);
      // alert("Failed to create branch.");
      setModalMessage({
        success: "",
        error: `Error creating branch: ${error}`,
      });
    }
    setLoading(false)
  };

 useEffect(()=>{
fetchHospitalDetails()
 },[])


  return (
    <div className="grid grid-cols-1 gap-9 m-2">
      <div className="flex flex-col w-full">
        {/* <!-- Contact Form --> */}
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
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
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <Input
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Clinic/Hospital Name"
                  color={TOOL_TIP_COLORS.secondary}
                  value={clinicDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  isDisabled={!edit}
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
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  // value={shiftStartTime}
                  // defaultValue={new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleInputChange("shiftStart", time.toString())}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  // value={shiftEndTime}
                  // defaultValue={new Time(6, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleInputChange("shiftEnd", time.toString())}
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
                  // defaultValue="H No.123 Panchayat Bhawan, Phulera Gram Panchayat, 965244"
                  errorMessage="The address should be at max 255 characters long."
                  value={clinicDetails.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
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
                    setSelectedStateKey(key ? key as string:null);
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
              <div className="flex flex-col gap-4.5 xl:flex-row" style={{ marginTop: 20 }}>
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

                <Button
                  color="secondary"
                  onClick={locationDetact}
                  type="button"
                  style={{ marginTop: 20 }}
                  isDisabled={!edit}
                >
                  Detect Location
                </Button>
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

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                isDisabled={!edit}
                color={TOOL_TIP_COLORS.secondary}
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90"
                style={{ minWidth: 300, marginBottom: 20 }}
                onPress={onOpen}
              >
                Save Changes
              </Button>

              {/* <Modal isOpen={isOpen} onClose={handleModalClose}>
                <ModalContent>
                  <ModalHeader>{loading ?(<div className="flex justify-center">
                      
                      </div>):  modalMessage.success ? <p className="text-green-600">Success</p> : <p className="text-red-600">Error</p>}</ModalHeader>
                  <ModalBody>
                    {loading ? (
                      <div className="flex justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : modalMessage.success ? (
                      <p className="text-green-600">{modalMessage.success}</p>
                    ) : (
                      <p className="text-red-600">{modalMessage.error}</p>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    {!loading && (
                      <Button color="primary" onPress={handleModalClose}>
                        Ok
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal> */}

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

"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
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
import { useEffect, useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import EnhancedModal from "../common/Modal/EnhancedModal";

interface AutocompleteItem {
  value: string;
  label: string;
  description?: string;
  dob?: string;
}
interface AddUsersProps {
  onUsersAdded: () => void;

}
const API_URL = process.env.API_URL;
const AddAppointment: React.FC<AddUsersProps> = ({ onUsersAdded }) => {
  const [edit, setEdit] = useState(true);
  const [patientList, setPatientList] = useState<AutocompleteItem[]>([]);
  const [doctorList, setDoctorList] = useState<AutocompleteItem[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });



  const [formData, setFormData] = useState({
    name: "",
    doctorId: "",
    patientId: "",
    type: "0151308b-6419-437b-9b41-53c7de566724",
    startDateTime: "",
    endDateTime: "",
    code: "ST-ID/15",
    json: '',
  });
  const [loading, setLoading] = useState(false);

  function extractTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${amPm}`;
  }

  const generateDateTime = (time: Time) => {
    const currentDate = new Date(); // Use the current date
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      time && time.hour,
      time && time.minute,
      0
    ).toISOString(); // Convert to ISO format
  };
  const handleTimeChange = (time: Time, field: "startDateTime" | "endDateTime") => {
    const isoTime = generateDateTime(time);
    setFormData({ ...formData, [field]: isoTime });
  };

  const handlePatientSelection = (patientId: string) => {
    const selectedPatient = patientList.find((patient) => patient.value === patientId);
    if (selectedPatient) {
      setFormData({
        ...formData,
        patientId,
        name: selectedPatient.label,
        json: JSON.stringify({
          dob: selectedPatient.dob,
          email: selectedPatient.description?.split(" | ")[1] || ""
        }),
      });
    }
  };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingFields: string[] = [];
    for (const key in formData) {
      if (
        !formData[key as keyof typeof formData] &&
        key !== "branchId"
      ) {
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

      setModalMessage({ success: "", error: "No access token found. Please log in again." });
      setLoading(false);
      onOpen();
      return;
    }

    console.log("Token:", token);

    try {

      const token = localStorage.getItem("docPocAuth_token");

      const hospitalEndpoint = `${API_URL}/hospital`;
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      const branchEndpoint = `${API_URL}/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;
      const payload = {
        ...formData,
        branchId: fetchedBranchId
      }
      const response = await axios.post(
        `${API_URL}/appointment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Appointment Created:", response.data);
      setModalMessage({ success: "Appointment created successfully!", error: "" });

      onUsersAdded();
    } catch (error: any) {
      console.error("Error creating appointment:", error.response?.data || error.message);
      setModalMessage({
        success: "",
        error: `Error creating appointment: ${error.response?.data?.message || "Unknown error"}`,
      });


    }
    setLoading(false)
  };
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");

      const hospitalEndpoint = `${API_URL}/hospital`;
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      const branchEndpoint = `${API_URL}/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;

      const endpoint = `${API_URL}/patient/list/${fetchedBranchId}`;


      const params: any = {};

      params.page = 1;
      params.pageSize = 50;
      params.from = '2024-12-04T03:32:25.812Z';
      params.to = '2024-12-11T03:32:25.815Z';
      params.notificationStatus = ['Whatsapp notifications paused', 'SMS notifications paused'];


      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.rows)
      const transformedPatients: AutocompleteItem[] = response.data.rows.map((patient: any) => ({
        label: patient.name,
        value: patient.id,
        description: `${patient.phone} | ${patient.email}`,
        dob: patient.dob, // Include DOB
      }));
      setPatientList(transformedPatients);
      // setTotalPatient(response.data.count || response.data.length);

    } catch (err) {
      // setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const hospitalEndpoint = `${API_URL}/hospital`;
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      const branchEndpoint = `${API_URL}/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;


      const endpoint = `${API_URL}/user/list/${fetchedBranchId}`;


      const params: any = {};

      params.page = 1;
      params.pageSize = 50;
      params.from = '2024-12-04T03:32:25.812Z';
      params.to = '2024-12-11T03:32:25.815Z';



      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const transformedDoctors: AutocompleteItem[] = response.data.rows.map((doctor: any) => ({
        label: doctor.name,
        value: doctor.id,
        description: `${doctor.phone} | ${doctor.email}`,
      }));
      setDoctorList(transformedDoctors)
      // setUsers(response.data.rows || response.data);
      // setTotalUsers(response.data.count || response.data.length);

    } catch (err) {
      // setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchDoctors()
    fetchPatients()
  }, [])

  useEffect(() => {
    const defaultStartTime = generateDateTime(new Time(7, 38)); // Default start time
    const defaultEndTime = generateDateTime(new Time(8, 45)); // Default end time
    setFormData((prevFormData) => ({
      ...prevFormData,
      startDateTime: defaultStartTime,
      endDateTime: defaultEndTime,
    }));
  }, []);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      // Only modify z-index when modal is open

      header.classList.remove("z-999");
      header.classList.add("z-0");

    }
  }, [isOpen]);

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
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row" style={{ marginTop: 20 }}>
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultValue={new Time(7, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleTimeChange(time, "startDateTime")}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultValue={new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                  onChange={(time) => handleTimeChange(time, "endDateTime")}
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <Textarea
                  color={TOOL_TIP_COLORS.secondary}
                  isInvalid={false}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Remarks"
                  defaultValue="Patient is having chronic neck pain."
                  errorMessage="The address should be at max 255 characters long."
                  isDisabled={!edit}
                  onChange={(e) => setFormData({ ...formData, json: `{"remarks":"${e.target.value}"}` })}
                />
              </div>
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row" style={{ marginTop: 20 }}>
                <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={patientList}
                  label="Select Patient"
                  placeholder="Search a Patient"
                  onSelectionChange={(key) => handlePatientSelection(key as string)}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} variant="shadow" color={TOOL_TIP_COLORS.secondary}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  defaultItems={doctorList}
                  label="Select Doctor"
                  placeholder="Search a Doctor"
                  onSelectionChange={(key) => setFormData({ ...formData, doctorId: key as string })}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} variant="shadow" color={TOOL_TIP_COLORS.secondary}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <label>
                  Mark uncheck if no notification has to be sent for appointment.
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
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                onPress={onOpen}
                isDisabled={!edit || loading}
                color={TOOL_TIP_COLORS.secondary}
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90"
                style={{ minWidth: 300, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
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

export default AddAppointment;

















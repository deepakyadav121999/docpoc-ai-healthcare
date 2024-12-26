"use client";
import {

  Checkbox,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Spinner
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from "@nextui-org/react";
interface AddPatientProps {
  onPatientAdded: () => void;
}
const API_URL = process.env.API_URL;

const AddPatient: React.FC<AddPatientProps> = ({ onPatientAdded }) => {

  const [edit, setEdit] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",

    bloodGroup: "",
    dob: "",
    gender: "",
    address: "",
    isActive: true,
    json: '{"allergies":["Peanut","Dust"]}',
    documents: '{"insurance":"ABC123","report":"xyz-report.pdf"}',
    lastVisit: "2024-01-15T08:30:00.000Z",
    status: "Active",
    notificationStatus: '{"allergies":["Peanut","Dust"]}',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // const [size, setSize] = useState('md');
  // const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "full"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setmessage] = useState('')
  const [errmessage, seterrmessage] = useState('')
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  const handleOpen = () => {
    setmessage('')
    onClose()
  }
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    const missingFields: string[] = [];

    for (const key in formData) {
      if (!formData[key as keyof typeof formData] && key !== "branchId" && key !== "isActive") {
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }

    if (missingFields.length > 0) {
      setModalMessage({
        success: "",
        error: `The following fields are required: ${missingFields.join(", ")}`,
      });
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {

      setModalMessage({ success: "", error: "No access token found. Please log in again." });
      setLoading(false);
      return;
    }
      
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
     
      const payload ={
        ...formData,
        branchId:fetchedBranchId
       }
      const response = await axios.post(
        `${API_URL}/patient`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

     
      setModalMessage({ success: "Patient added successfully!", error: "" });
      setFormData({
        name: "",
        phone: "",
        email: "",
        bloodGroup: "",
        dob: "",
        gender: "",
        address: "",
        isActive: true,
        json: '{"allergies":["Peanut","Dust"]}',
        documents: '{"insurance":"ABC123","report":"xyz-report.pdf"}',
        lastVisit: "2024-01-15T08:30:00.000Z",
        status: "Active",
        notificationStatus: '{"allergies":["Peanut","Dust"]}',
      });
      onPatientAdded()
    } catch (error: any) {

      setModalMessage({
        success: "",
        error: `Error adding Patient: ${error.response?.data?.message || "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col w-full">
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">

              <div className="mb-4.5 flex flex-col gap-4.5">
                <Input
                  label="Patient Name"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.name}
                  onChange={(e) => {
                    if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                      setFormData({ ...formData, name: e.target.value });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent numeric and special character key presses
                    if (
                      !/^[a-zA-Z\s]$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  isDisabled={!edit}
                />

                <Autocomplete
                  label="Gender"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Gender"
                  defaultItems={[{ label: "Male" }, { label: "Female" }, { label: "Other" }]}
                  onSelectionChange={(key) => setFormData({ ...formData, gender: key as string })}
                  isDisabled={!edit}
                >
                  {(item) => <AutocompleteItem key={item.label}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Input
                  label="Phone"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.phone}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormData({ ...formData, phone: e.target.value });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent non-numeric key presses except backspace, delete, and arrow keys
                    if (
                      !/^\d$/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={10}
                  isDisabled={!edit}
                />
                <Input
                  label="Email"

                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={(e) => {
                    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    // if (!emailRegex.test(e.target.value)) {
                    //   setErrors((prev) => [...prev, "Please enter a valid email address."]);
                    // }
                  }}
                  isDisabled={!edit}
                />

              </div>

              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <Autocomplete
                  label="Blood Group"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Blood Group"
                  defaultItems={[{ label: "A+" }, { label: "O+" }, { label: "B+" }, { label: "AB+" }]}
                  onSelectionChange={(key) => setFormData({ ...formData, bloodGroup: key as string })}
                  isDisabled={!edit}
                >
                  {(item) => <AutocompleteItem key={item.label}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Input
                  label="Date of Birth"
                  type="date"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  isDisabled={!edit}
                />
              </div>


              <Textarea
                label="Address"
                labelPlacement="outside"
                variant="bordered"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                isDisabled={!edit}
              />

              <div className="flex justify-center mt-4">
                <Checkbox
                  isSelected={formData.isActive}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value, status: value ? "Active" : "Inactive" })
                  }
                  isDisabled={!edit}
                >
                  Active Status
                </Checkbox>
              </div>


              {errors.length > 0 && (
                <div className="text-red-500 mt-4">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>


            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                isDisabled={!edit || loading}
                color={TOOL_TIP_COLORS.secondary}
                onPress={onOpen}
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90"
                style={{ minWidth: 300, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>

              <Modal isOpen={isOpen} onClose={handleModalClose}>
                <ModalContent>
                  <ModalHeader>{
                    loading ? (
                      <div className="flex justify-center">
              
                      </div>):
                  modalMessage.success?<p className="text-green-600">Success</p>: <p className="text-red-600">Error</p>}</ModalHeader>
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
              </Modal>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;

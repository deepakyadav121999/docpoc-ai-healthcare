"use client";
import {
  Checkbox,
  Input,
  // Textarea,
  Autocomplete,
  AutocompleteItem,
  // Spinner,
  TimeInput,
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { useDisclosure } from "@nextui-org/react";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "@nextui-org/react";
import { SVGIconProvider } from "@/constants/svgIconProvider";
// import { Time } from "@internationalized/date";
import { useEffect } from "react";
import { today } from "@internationalized/date";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
interface ModalMessage {
  success?: string;
  error?: string;
}
interface AddUsersProps {
  onUsersAdded: () => void;
  onClose?: () => void;
  onMessage: (message: ModalMessage) => void;
}
const API_URL = process.env.API_URL;
const AddUsers: React.FC<AddUsersProps> = ({
  onUsersAdded,
  onClose,
  onMessage,
}) => {
  const profile = useSelector((state: RootState) => state.profile.data);
  // const [edit, setEdit] = useState(true);
  const edit = true;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",

    json: JSON.stringify({
      dob: "",
      designation: "",
      workingHours: "",
    }),
    userName: "",
    password: "defaultPassword123",
    gender: "",
  });

  // const [errors, setErrors] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [accessTypes, setAccessTypes] = useState({
    setAppointments: true,
    editDoctor: true,
    editCreatePatients: true,
    editCreateStaffs: true,
    editCreateReminders: true,
    editCreatePayments: true,
  });
  const { isOpen, onOpen, onClose: internalClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });

  const handleJsonUpdate = (key: string, value: string) => {
    const updatedJson = JSON.parse(formData.json);
    updatedJson[key] = value;
    setFormData((prev) => ({
      ...prev,
      json: JSON.stringify(updatedJson),
    }));
  };

  const handleAccessChange = (
    key: keyof typeof accessTypes,
    value: boolean,
  ) => {
    setAccessTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    internalClose();
  };
  const handleDobChange = (value: string) => {
    const updatedJson = JSON.parse(formData.json);
    updatedJson.dob = value; // Update the dob field in the JSON object
    setFormData({
      ...formData,
      json: JSON.stringify(updatedJson), // Convert back to JSON string
    });
  };

  // const convertTo12HourFormat = (time: string): string => {
  //   const [hours, minutes] = time.split(":").map(Number);
  //   const period = hours >= 12 ? "PM" : "AM";
  //   const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  //   return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  // };

  const handleTimeChange = (key: "start" | "end", value: string) => {
    const [hour, minute] = value.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;

    const updatedWorkingHours = JSON.parse(formData.json).workingHours || "";

    let newWorkingHours = "";
    if (key === "start") {
      newWorkingHours = `${formattedTime} - ${
        updatedWorkingHours.split(" - ")[1] || ""
      }`;
    } else {
      newWorkingHours = `${
        updatedWorkingHours.split(" - ")[0] || ""
      } - ${formattedTime}`;
    }

    handleJsonUpdate("workingHours", newWorkingHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields: string[] = [];
    for (const key in formData) {
      if (
        !formData[key as keyof typeof formData] &&
        key !== "branchId" &&
        key !== "email" &&
        key !== "userName"
      ) {
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }
    const jsonFields = JSON.parse(formData.json);
    if (!jsonFields.dob) {
      missingFields.push("Date of Birth");
    }
    if (!jsonFields.designation) {
      missingFields.push("Designation");
    }
    if (!jsonFields.workingHours || jsonFields.workingHours.trim() === " - ") {
      missingFields.push("Working Hours");
    }
    if (!formData.gender) {
      missingFields.push("Gender");
    }

    // Validate phone number length
    if (formData.phone && formData.phone.length !== 10) {
      setModalMessage({
        success: "",
        error: "Phone number must be exactly 10 digits.",
      });
      onOpen();
      return;
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
      onOpen();
      return;
    }
    try {
      // const token = localStorage.getItem("docPocAuth_token");

      const fetchedBranchId = profile?.branchId;

      const finalEmail = formData.email
        ? formData.email
        : `${formData.phone}@docpoc.placeholder`;

      const payload = {
        ...formData,
        userName: formData.phone,
        email: finalEmail,
        branchId: fetchedBranchId,
        accessType: JSON.stringify(accessTypes),
      };

      await axios.post(`${API_URL}/user`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setModalMessage({ success: "User added successfully!", error: "" });
      onOpen();
      setFormData({
        name: "",
        phone: "",
        email: "",

        json: JSON.stringify({
          dob: "",
          designation: "",
          workingHours: "",
        }),
        userName: "",
        password: "",
        gender: "",
      });
      setAccessTypes({
        setAppointments: false,
        editDoctor: false,
        editCreatePatients: false,
        editCreateStaffs: false,
        editCreateReminders: false,
        editCreatePayments: false,
      });
      onUsersAdded();
      onMessage({ success: "User  created successfully!" });

      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        // Extract and display the error message from the response
        const apiErrorMessage =
          error.response.data.message &&
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0].message
            : error.response.data.message || "Unknown error occurred";

        setModalMessage({
          success: "",
          error: apiErrorMessage,
        });
        onOpen();
      } else {
        // Handle network errors or unexpected errors
        setModalMessage({
          success: "",
          error: error.message || "An unexpected error occurred.",
        });
        onOpen();
      }
    } finally {
      setLoading(false);
      onOpen();
    }
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      // Only modify z-index when modal is open
      header.classList.remove("z-999");
      header.classList.add("z-0");
    }
  }, [isOpen]);

  return (
    <div className="grid grid-cols-1 gap-9">
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
      `}</style>
      <div className="flex flex-col w-full">
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <form onSubmit={handleSubmit}>
            <div className="p-2.5 sm:p-4.5">
              <div className="mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5">
                <Input
                  label="Name"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Name"
                  value={formData.name}
                  color={TOOL_TIP_COLORS.secondary}
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
                  maxLength={70}
                />

                {/* <Autocomplete
                  label="User Type"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select User Type"
                  defaultItems={[{ label: "SUPER_ADMIN" }]}
                  onSelectionChange={(key) => setFormData({ ...formData, userType: key as string })}
                  isDisabled={!edit}
                >
                  {(item) => <AutocompleteItem key={item.label}>{item.label}</AutocompleteItem>}
                </Autocomplete> */}
                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  label="Designation"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Designation"
                  defaultItems={[
                    { label: "Admin" },
                    { label: "Doctor" },
                    { label: "Staff" },
                    { label: "Nurse" },
                  ]}
                  onSelectionChange={(key) =>
                    handleJsonUpdate("designation", key as string)
                  }
                  isDisabled={!edit}
                  color={TOOL_TIP_COLORS.secondary}
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className="flex gap-2 flex-wrap">
                  <TimeInput
                    color={TOOL_TIP_COLORS.secondary}
                    label="From (Working Hours)"
                    labelPlacement="outside"
                    variant="bordered"
                    // defaultValue={new Time(8, 45)}
                    startContent={<SVGIconProvider iconName="clock" />}
                    onChange={(e) => handleTimeChange("start", e.toString())}
                    isDisabled={!edit}
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
                  />
                  <TimeInput
                    color={TOOL_TIP_COLORS.secondary}
                    label="To (Working Hours)"
                    labelPlacement="outside"
                    variant="bordered"
                    // defaultValue={new Time(6, 45)}
                    startContent={<SVGIconProvider iconName="clock" />}
                    onChange={(e) => handleTimeChange("end", e.toString())}
                    isDisabled={!edit}
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
                  />
                </div>

                <Input
                  label="Phone"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Phone"
                  value={formData.phone}
                  color={TOOL_TIP_COLORS.secondary}
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
                />
                <Input
                  label="Email"
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  placeholder="Email(Optional)"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={() => {}}
                  isDisabled={!edit}
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
                  maxLength={80}
                />
              </div>

              <div className="mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row">
                <DatePicker
                  color={TOOL_TIP_COLORS.secondary}
                  label="Date of Birth"
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  maxValue={today("UTC")}
                  showMonthAndYearPickers
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
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
                      handleDobChange(formattedDate);
                    }
                  }}
                />
              </div>
              <div className="mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5">
                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  label="Gender"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select Gender"
                  defaultItems={[
                    { label: "Male" },
                    { label: "Female" },
                    { label: "Other" },
                  ]}
                  onSelectionChange={(key) =>
                    setFormData({ ...formData, gender: key as string })
                  }
                  isDisabled={!edit}
                  color={TOOL_TIP_COLORS.secondary}
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              {/* <div className="mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5">
                // username 
                <Input
                  label="Username"
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  onBlur={() => {}}
                  isDisabled={!edit}
                />
              </div>  */}

              {/* password  */}
              {/* <div className="mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row">
                <Input
                  color={TOOL_TIP_COLORS.secondary}
                  label="Password"
                  type="password"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  isDisabled={!edit}
                />
              </div> */}

              <div className="mb-4.5 flex ">
                <p className="text-sm font-medium mb-2">Access Types:</p>
                <div className="flex  gap-2 flex-wrap">
                  <Checkbox
                    isSelected={accessTypes.setAppointments}
                    onValueChange={(value) =>
                      handleAccessChange("setAppointments", value)
                    }
                  >
                    Set Appointments
                  </Checkbox>
                  <Checkbox
                    isSelected={accessTypes.editDoctor}
                    onValueChange={(value) =>
                      handleAccessChange("editDoctor", value)
                    }
                  >
                    Edit Doctor
                  </Checkbox>
                  <Checkbox
                    isSelected={accessTypes.editCreatePatients}
                    onValueChange={(value) =>
                      handleAccessChange("editCreatePatients", value)
                    }
                  >
                    Edit/Create Patients
                  </Checkbox>
                  <Checkbox
                    isSelected={accessTypes.editCreateStaffs}
                    onValueChange={(value) =>
                      handleAccessChange("editCreateStaffs", value)
                    }
                  >
                    Edit/Create Staffs
                  </Checkbox>
                  <Checkbox
                    isSelected={accessTypes.editCreateReminders}
                    onValueChange={(value) =>
                      handleAccessChange("editCreateReminders", value)
                    }
                  >
                    Edit/Create Reminders
                  </Checkbox>
                  <Checkbox
                    isSelected={accessTypes.editCreatePayments}
                    onValueChange={(value) =>
                      handleAccessChange("editCreatePayments", value)
                    }
                  >
                    Edit/Create Payments
                  </Checkbox>
                </div>
              </div>
              {/* {errors.length > 0 && (
                <div className="text-red-500 mt-4">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )} */}
            </div>

            <div className="flex justify-center mt-4">
              {/* <Button
                type="submit"
                isDisabled={!edit || loading}
                color={TOOL_TIP_COLORS.secondary}
                onPress={onOpen}
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90"
                style={{ minWidth: 300, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button> */}

              <button
                type="submit"
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90 text-white  bg-purple-500 "
                style={{ minWidth: 250, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

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

export default AddUsers;

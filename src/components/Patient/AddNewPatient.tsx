"use client";
import {
  Checkbox,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Button,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { useDisclosure } from "@nextui-org/react";
import CustomDatePicker from "../CustomComponent/CustomDatePicker";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { TOOL_TIP_COLORS } from "@/constants";
// import { parseDate, today } from "@internationalized/date";

interface AddPatientProps {
  onPatientAdded: () => void;
}
const API_URL = process.env.API_URL;

const AddNewPatient: React.FC<AddPatientProps> = ({ onPatientAdded }) => {
  const [edit] = useState(true);
  const profile = useSelector((state: RootState) => state.profile.data);
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
    documents: "{}",

    status: "Active",
    notificationStatus: '{"allergies":["Peanut","Dust"]}',
  });

  const [errors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // const [size, setSize] = useState('md');
  // const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "full"];
  const { isOpen, onOpen, onClose: internalClose } = useDisclosure();
  // const [message, setmessage] = useState("");
  // const [errmessage, seterrmessage] = useState("");
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });
  // Fetch fresh user details by ID to decide gating
  const [userDetailJson, setUserDetailJson] = useState<any>({});
  const [userDetailLoading, setUserDetailLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!profile?.id) return;
      try {
        const token = localStorage.getItem("docPocAuth_token");
        const endpoint = `${API_URL}/user/${profile.id}`;
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const parsed = res?.data?.json ? JSON.parse(res.data.json) : {};
        setUserDetailJson(parsed);
      } catch (e) {
        console.log(e);
        setUserDetailJson({});
      } finally {
        setUserDetailLoading(false);
      }
    };
    fetchUserDetail();
  }, [profile?.id]);

  const hasAadhar = Boolean(userDetailJson?.documents?.aadharPan?.documentUrl);
  const hasCertificate = Boolean(
    userDetailJson?.documents?.certificate?.documentUrl,
  );
  const isAadharVerified = Boolean(
    userDetailJson?.documents?.aadharPan?.documentVerified,
  );
  const isCertificateVerified = Boolean(
    userDetailJson?.documents?.certificate?.documentVerified,
  );
  const isDocsVerified = isAadharVerified && isCertificateVerified;

  // Determine warning message
  let warningMessage: string | null = null;
  if (!userDetailLoading) {
    if (!hasAadhar && !hasCertificate) {
      warningMessage =
        "Please submit your documents (Aadhar/PAN & valid medical degree) to start creating patient.";
    } else if (!hasAadhar) {
      warningMessage =
        "Please submit your documents (Aadhar/PAN) to start creating patient.";
    } else if (!hasCertificate) {
      warningMessage =
        "Please submit your documents (valid medical degree) to start creating patient.";
    } else if (!isDocsVerified) {
      warningMessage =
        "Your documents are under process. Until then, please complete clinic and employee setup. Note: patient creation requires document verification.";
    }
  }
  const shouldDisable = userDetailLoading || Boolean(warningMessage);
  // const handleOpen = () => {
  //   setmessage("");
  //   onClose();
  // };
  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    internalClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shouldDisable) {
      return;
    }
    const missingFields: string[] = [];

    // for (const key in formData) {
    //   if (
    //     !formData[key as keyof typeof formData] &&
    //     key !== "branchId" &&
    //     key !== "isActive"
    //   ) {
    //     missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
    //   }
    // }

    // if (missingFields.length > 0) {
    //   setModalMessage({
    //     success: "",
    //     error: `The following fields are required: ${missingFields.join(", ")}`,
    //   });
    //   onOpen();
    //   return;
    // }
    const requiredFields = ["name", "phone", "gender", "dob"];

    requiredFields.forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    });

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
        error: `Please fill in the required fields: ${missingFields.join(", ")}`,
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
      onOpen();
      setLoading(false);
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const fetchedBranchId = tokenPayload.branchId;

      if (!fetchedBranchId) {
        setModalMessage({
          success: "",
          error:
            "Unable to identify your clinic location/ branch ID. Please contact support.",
        });
        onOpen();
        setLoading(false);
        return;
      }

      // const payload = {
      //   ...formData,
      //   branchId: fetchedBranchId,
      // };

      const payload = {
        branchId: fetchedBranchId,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        isActive: formData.isActive,
        json: formData.json,
        documents: formData.documents,
        // lastVisit: formData.lastVisit,
        status: formData.status,
        notificationStatus: formData.notificationStatus,
        ...(formData.email ? { email: formData.email } : {}),
        ...(formData.bloodGroup ? { bloodGroup: formData.bloodGroup } : {}),
      };

      await axios.post(`${API_URL}/patient`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setModalMessage({ success: "Patient added successfully!", error: "" });
      onOpen();

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
        documents: "{}",

        status: "Active",
        notificationStatus: '{"allergies":["Peanut","Dust"]}',
      });
      onPatientAdded();
    } catch (error: any) {
      if (error.response) {
        // // Extract and display the error message from the response
        // const apiErrorMessage =
        //   error.response.data.message &&
        //   Array.isArray(error.response.data.message)
        //     ? error.response.data.message[0].message
        //     : error.response.data.message || "Unknown error occurred";

        // setModalMessage({
        //   success: "",
        //   error: apiErrorMessage,
        // });

        let errorMessage = "";

        if (error.response) {
          // Handle phone number already registered
          if (
            error.response.data.message &&
            Array.isArray(error.response.data.message)
          ) {
            const errorItem = error.response.data.message.find(
              (item: any) => item.validatorKey === "not_unique",
            );

            if (errorItem) {
              if (errorItem.path === "phone") {
                errorMessage =
                  "This phone number is already registered. Please use a different number.";
              } else if (errorItem.path === "email") {
                errorMessage =
                  "This email address is already registered. Please use a different email.";
              } else {
                // For other unique violations, show the original message
                errorMessage =
                  errorItem.message ||
                  "This information is already registered. Please check your details.";
              }
            } else {
              // If no not_unique error, show the first error message from API
              errorMessage =
                typeof error.response.data.message === "string"
                  ? error.response.data.message
                  : error.response.data.message[0]?.message ||
                    "Failed to register patient.";
            }
          } else if (typeof error.response.data.message === "string") {
            // For string error messages from API
            errorMessage = error.response.data.message;
          } else {
            // Fallback for other API errors
            errorMessage =
              "Failed to register patient. Please check your information and try again.";
          }
        } else if (error.message) {
          // Handle network errors
          errorMessage = error.message;
        } else {
          // Generic error fallback
          errorMessage = "An unexpected error occurred. Please try again.";
        }

        setModalMessage({
          success: "",
          error: errorMessage,
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
    <div className="grid grid-cols-1 gap-6 sm:gap-9">
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
          min-height: 44px !important;
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
        {!userDetailLoading && warningMessage && (
          <div className="mb-2 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
            {warningMessage}
          </div>
        )}
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card ">
          <form onSubmit={handleSubmit}>
            <div className=" p-2.5 sm:p-4.5">
              <div className=" mb-2.5 sm:mb-4.5 flex flex-col gap-2.5  sm:gap-4.5">
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
                  label="Patient Name"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Patient Name"
                  color={TOOL_TIP_COLORS.secondary}
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
                  isDisabled={!edit || shouldDisable || loading}
                />

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
                  color={TOOL_TIP_COLORS.secondary}
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
                  isDisabled={!edit || shouldDisable || loading}
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
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
                  label="Phone"
                  labelPlacement="outside"
                  placeholder="Phone"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
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
                  isDisabled={!edit || shouldDisable || loading}
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
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Email  (Optional)"
                  color={TOOL_TIP_COLORS.secondary}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={() => {
                    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    // if (!emailRegex.test(e.target.value)) {
                    //   setErrors((prev) => [...prev, "Please enter a valid email address."]);
                    // }
                  }}
                  isDisabled={!edit || shouldDisable || loading}
                />
              </div>

              <div className=" mb-2.5 sm:mb-4.5 flex flex-col gap-2.5 sm:gap-4.5 xl:flex-row">
                <Autocomplete
                  className="[&_.nextui-autocomplete-selector-button]:text-black 
             [&_.nextui-autocomplete-selector-button]:dark:text-white
             [&_[data-has-value=true]]:text-black
             [&_[data-has-value=true]]:dark:text-white"
                  classNames={{
                    selectorButton: "!text-black dark:!text-white",
                    listbox: "text-black dark:text-white",
                  }}
                  label="Blood Group"
                  labelPlacement="outside"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  placeholder="Select Blood Group  (Optional)"
                  defaultItems={[
                    { label: "A+" },
                    { label: "O+" },
                    { label: "B+" },
                    { label: "AB+" },
                  ]}
                  onSelectionChange={(key) =>
                    setFormData({ ...formData, bloodGroup: key as string })
                  }
                  isDisabled={!edit || shouldDisable || loading}
                >
                  {(item) => (
                    <AutocompleteItem key={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {/* Date of Birth - use Custom DatePicker */}
                <div className="w-full">
                  <label className="block text-sm font-small text-purple-500  mb-0.5">
                    Date of Birth
                  </label>
                  <CustomDatePicker
                    value={formData.dob ? new Date(formData.dob) : null}
                    onChange={(date) => {
                      if (!date) return;
                      // Check if date is not in the future
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      if (date > today) {
                        return;
                      }
                      // Format as YYYY-MM-DD
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      setFormData({ ...formData, dob: `${yyyy}-${mm}-${dd}` });
                    }}
                    maxDate={new Date()}
                    placeholder="Select Date of Birth"
                    className="w-full hover:border-purple-600 focus:border-purple-600"
                    disabled={shouldDisable || loading}
                  />
                </div>
              </div>

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
                label="Address"
                labelPlacement="outside"
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                placeholder="Address (Optional)
                "
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                isDisabled={!edit || shouldDisable || loading}
              />

              <div className="flex justify-center mt-2 sm:mt-4">
                <Checkbox
                  isSelected={formData.isActive}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      isActive: value,
                      status: value ? "Active" : "Inactive",
                    })
                  }
                  isDisabled={!edit || shouldDisable || loading}
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

            <div className="flex justify-center mt-2 sm:mt-4 ">
              <Button
                type="submit"
                isDisabled={shouldDisable || loading}
                color={TOOL_TIP_COLORS.secondary}
                // onPress={onOpen}
                // className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90 text-white  bg-purple-500 "
                style={{ minWidth: 250, marginBottom: 20 }}
                // disabled={shouldDisable || loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>

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

export default AddNewPatient;

// import React from "react";

// const PaymentEntry = () => {
//   return (
//     <div>
//       <p>Add Entry</p>
//     </div>
//   );
// };

// export default PaymentEntry;
"use client";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Spinner,
  Autocomplete,
  AutocompleteItem,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useState, useEffect, useCallback } from "react";
import { GLOBAL_TAB_NAVIGATOR_ACTIVE, TOOL_TIP_COLORS } from "@/constants";
import EnhancedModal from "../common/Modal/EnhancedModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Appointment {
  id: string;
  name: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  dateTime: string;
  startDateTime: string;
  endDateTime: string;
  json: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  dob: string;
  age: number;
  gender: string;
  address: string;
}

interface Doctor {
  id: string;
  name: string;
}

interface PaymentItem {
  description: string;
  amount: number;
  rate: number;
  quantity: number;
}

const API_URL = process.env.API_URL;
const BASE_URL = API_URL;

const PaymentEntry = () => {
  const profile = useSelector((state: RootState) => state.profile.data);

  // Form state
  const [paymentMode, setPaymentMode] = useState<"appointment" | "manual">(
    "appointment",
  );
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null,
  );
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([
    { description: "", amount: 0, rate: 0, quantity: 1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savePaymentLoading, setSavePaymentLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMessage, setModalMessage] = useState({ success: "", error: "" });

  // Patient details state
  const [patientDetails, setPatientDetails] = useState<Patient>({
    id: "",
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    dob: "",
    age: 0,
    gender: "",
    address: "",
  });

  // Data fetching state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  // const [appointmentPage, setAppointmentPage] = useState(1);
  // const [patientPage, setPatientPage] = useState(1);
  // const [doctorPage, setDoctorPage] = useState(1);
  // const [hasMoreAppointments, setHasMoreAppointments] = useState(true);
  // const [hasMorePatients, setHasMorePatients] = useState(true);
  // const [hasMoreDoctors, setHasMoreDoctors] = useState(true);

  // Constants
  const paymentMethods = [
    "cash",
    "credit card",
    "debit card",
    "bank transfer",
    "upi",
    "other",
  ];
  // const serviceTypes = [
  //   "consultation",
  //   "procedure",
  //   "medication",
  //   "test",
  //   "other",
  // ];

  const getAuthToken = () => {
    return localStorage.getItem("docPocAuth_token") || "";
  };

  // Calculate totals
  const subtotal = paymentItems.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0,
  );
  const total = subtotal - discountAmount + taxAmount;

  // Data fetching functions
  const fetchAppointments = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/appointment/list/${branchId}?page=${page}&pageSize=100`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      if (page === 1) {
        setAppointments(data.rows);
      } else {
        setAppointments((prev) => [...prev, ...data.rows]);
      }
      // setHasMoreAppointments(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPatients = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/patient/list/${branchId}?page=${page}&pageSize=100`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      if (page === 1) {
        setPatients(data.rows);
      } else {
        setPatients((prev) => [...prev, ...data.rows]);
      }
      // setHasMorePatients(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPatientDetails = useCallback(async (patientId: string) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/patient/${patientId}`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient details");
      }

      const data = await response.json();
      setPatientDetails(data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePatientSelect = async (patientId: string) => {
    setSelectedPatient(patientId);
    await fetchPatientDetails(patientId);
  };

  const fetchDoctors = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const branchId = profile?.branchId;
      const response = await fetch(
        `${BASE_URL}/user/list/${branchId}?page=${page}&pageSize=100`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      if (page === 1) {
        setDoctors(data.rows);
      } else {
        setDoctors((prev) => [...prev, ...data.rows]);
      }
      // setHasMoreDoctors(data.rows.length === 10);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(1);
    fetchPatients(1);
    fetchDoctors(1);
  }, [fetchAppointments, fetchPatients, fetchDoctors]);

  // Form handlers
  const addPaymentItem = () => {
    setPaymentItems([
      ...paymentItems,
      { description: "", amount: 0, quantity: 1, rate: 0 },
    ]);
  };

  const updatePaymentItem = (
    index: number,
    field: keyof PaymentItem,
    value: PaymentItem[keyof PaymentItem],
  ) => {
    setPaymentItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        ...(field === "amount" ? { rate: Number(value) } : {}),
      };
      return updated;
    });
  };

  const removePaymentItem = (index: number) => {
    setPaymentItems((prev) => prev.filter((_, i) => i !== index));
  };

  const openPreviewModal = async () => {
    if (selectedPatient) {
      await fetchPatientDetails(selectedPatient);
    }
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const paymentMethodMapping = {
    cash: "CASH",
    "credit card": "CARD",
    "debit card": "CARD",
    "bank transfer": "NET_BANKING",
    upi: "UPI",
    other: "OTHER",
  };
  const backendPaymentMethod =
    paymentMethodMapping[paymentMethod as keyof typeof paymentMethodMapping] ||
    "OTHER";

  const handleSavePayment = async () => {
    try {
      setIsLoading(true);
      setSavePaymentLoading(true);
      const token = getAuthToken();

      if (!selectedPatient) {
        setModalMessage({
          success: "",
          error: "Please select a patient",
        });
        onOpen();
        return;
      }

      if (paymentItems.some((item) => !item.description || item.amount <= 0)) {
        setModalMessage({
          success: "",
          error:
            "Please ensure all payment items have a description and positive amount",
        });
        onOpen();
        return;
      }

      const paymentData = {
        patientId: selectedPatient,
        branchId: profile?.branchId,
        appointmentId: selectedAppointment,
        doctorId: selectedDoctor,
        paymentMethod: backendPaymentMethod,
        items: paymentItems,
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        amount: total,
        notes: paymentNotes,
        paymentDate: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      const result = await response.json();

      let receiptUrl = "";
      try {
        const receiptData = JSON.parse(result.receiptUrl || "{}");
        receiptUrl = receiptData.url;
      } catch (e) {
        console.error("Error parsing receipt URL:", e);
      }

      window.open(receiptUrl, "_blank");

      setModalMessage({
        success: "Payment recorded successfully!",
        error: "",
      });
      onOpen();
      closePreviewModal();
    } catch (error: any) {
      console.error("Error saving payment:", error);

      // setModalMessage({
      //   success: "",
      //   error: "Error saving payment. Please try again.",
      // });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error saving payment. Please try again";

      setModalMessage({
        success: "",
        error: errorMessage,
      });
      onOpen();
    } finally {
      setIsLoading(false);
      setSavePaymentLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalMessage({ success: "", error: "" });
    onClose();
  };

  // Data for dropdowns/autocomplete
  const appointmentItems = appointments.map((appointment) => ({
    id: appointment.id,
    label: `${appointment.name} with ${appointment.doctorName} on ${new Date(appointment.dateTime).toLocaleDateString()}`,
  }));

  const patientItems = patients.map((patient) => ({
    id: patient.id,
    label: patient.name,
  }));

  const doctorItems = doctors.map((doctor) => ({
    id: doctor.id,
    label: doctor.name,
  }));

  const paymentMethodItems = paymentMethods.map((method) => ({
    id: method,
    label: method.charAt(0).toUpperCase() + method.slice(1),
  }));

  // const serviceTypeItems = serviceTypes.map((type) => ({
  //   id: type,
  //   label: type.charAt(0).toUpperCase() + type.slice(1),
  // }));

  // const formatDate = (dateString: string) => {
  //   if (!dateString) return "N/A";
  //   try {
  //     const date = new Date(dateString);
  //     return isNaN(date.getTime())
  //       ? dateString
  //       : date.toLocaleDateString("en-US", {
  //           year: "numeric",
  //           month: "long",
  //           day: "numeric",
  //         });
  //   } catch {
  //     return dateString;
  //   }
  // };

  useEffect(() => {
    const header = document.querySelector("header");
    if (isPreviewModalOpen) {
      header?.classList.remove("z-999");
      header?.classList.add("z-0");
    } else {
      header?.classList.remove("z-0");
      header?.classList.add("z-999");
    }
  }, [isPreviewModalOpen]);

  return (
    <div className="min-h-screen p-4 md:p-8 text-black dark:text-white">
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
      <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-4 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white">
          Payment Entry Form
        </h1>

        {/* Mode selection */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            style={{
              margin: 5,
              backgroundColor:
                paymentMode === "appointment"
                  ? GLOBAL_TAB_NAVIGATOR_ACTIVE
                  : "",
            }}
            className={`rounded-[7px] py-2 px-4 ${
              paymentMode === "appointment"
                ? ""
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onPress={() => setPaymentMode("appointment")}
          >
            Payment for Appointment
          </Button>
          <Button
            style={{
              margin: 5,
              backgroundColor:
                paymentMode === "manual" ? GLOBAL_TAB_NAVIGATOR_ACTIVE : "",
            }}
            className={`rounded-[7px] py-2 px-4 ${
              paymentMode === "manual"
                ? ""
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
            onPress={() => setPaymentMode("manual")}
          >
            Manual Payment Entry
          </Button>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 gap-4">
          {paymentMode === "appointment" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-dark dark:text-white">
                Select Appointment
              </label>
              <Autocomplete
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                labelPlacement="outside"
                placeholder="Select Appointment"
                defaultItems={appointmentItems}
                selectedKey={selectedAppointment || ""}
                onSelectionChange={async (key) => {
                  const appointment = appointments.find((a) => a.id === key);
                  if (appointment) {
                    setSelectedAppointment(key as string);
                    setSelectedPatient(appointment.patientId);
                    setSelectedDoctor(appointment.doctorId);
                    await fetchPatientDetails(appointment.patientId);
                  }
                }}
                className="w-full"
              >
                {(item) => (
                  <AutocompleteItem key={item.id} textValue={item.label}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          )}
        </div>

        {/* Patient and Doctor Autocompletes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Patient
            </label>
            <Autocomplete
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              labelPlacement="outside"
              placeholder="Select Patient"
              defaultItems={patientItems}
              selectedKey={selectedPatient || ""}
              onSelectionChange={(key) => handlePatientSelect(key as string)}
              className="w-full"
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.label}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          {/* Doctor Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white">
              Select Doctor
            </label>
            <Autocomplete
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              labelPlacement="outside"
              placeholder="Select Doctor"
              defaultItems={doctorItems}
              selectedKey={selectedDoctor || ""}
              onSelectionChange={(key) => setSelectedDoctor(key as string)}
              className="w-full"
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.label}>
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">
            Payment Method
          </label>
          <Select
            variant="bordered"
            color={TOOL_TIP_COLORS.secondary}
            labelPlacement="outside"
            placeholder="Select Payment Method"
            selectedKeys={[paymentMethod]}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full"
          >
            {paymentMethodItems.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Payment Items */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white">
            Payment Items
          </label>
          {paymentItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center mt-2"
            >
              <div className="sm:col-span-5">
                <Input
                  type="text"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) =>
                    updatePaymentItem(index, "description", e.target.value)
                  }
                  className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  type="number"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Quantity"
                  labelPlacement="outside"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity.toString()}
                  onChange={(e) =>
                    updatePaymentItem(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>

              <div className="sm:col-span-3">
                <Input
                  type="number"
                  variant="bordered"
                  color={TOOL_TIP_COLORS.secondary}
                  label="Amount"
                  labelPlacement="outside"
                  placeholder="Amount"
                  min="0"
                  value={item.amount.toString()}
                  onChange={(e) =>
                    updatePaymentItem(
                      index,
                      "amount",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                />
              </div>

              <div className="sm:col-span-2 flex items-end h-full">
                {paymentItems.length > 1 && (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => removePaymentItem(index)}
                    className="h-[56px] w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            onPress={addPaymentItem}
            className="mt-4"
            color={TOOL_TIP_COLORS.secondary}
          >
            + Add Payment Item
          </Button>
        </div>

        {/* Payment Summary */}
        <div className="border border-stroke dark:border-dark-3 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                label="Discount"
                labelPlacement="outside"
                placeholder="Discount amount"
                min="0"
                value={discountAmount.toString()}
                onChange={(e) =>
                  setDiscountAmount(parseFloat(e.target.value) || 0)
                }
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="number"
                variant="bordered"
                color={TOOL_TIP_COLORS.secondary}
                label="Tax"
                labelPlacement="outside"
                placeholder="Tax amount"
                min="0"
                value={taxAmount.toString()}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Discount:</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tax:</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Textarea
            value={paymentNotes}
            color={TOOL_TIP_COLORS.secondary}
            labelPlacement="outside"
            variant="bordered"
            label="Payment Notes"
            onChange={(e) => setPaymentNotes(e.target.value)}
            placeholder="Enter any additional notes about the payment..."
            className="w-full mt-1 rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
          />
        </div>

        {/* Preview button */}
        <Button
          color={TOOL_TIP_COLORS.secondary}
          className="w-full rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white"
          onPress={openPreviewModal}
        >
          Preview Payment
        </Button>

        {/* Preview Modal */}
        <Modal
          isOpen={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          size="5xl"
          scrollBehavior="inside"
          className="max-h-[90vh] overflow-y-auto"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h1 className="text-xl md:text-2xl font-bold">
                    Payment Preview
                  </h1>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="border-b pb-4">
                      <h2 className="text-lg md:text-xl font-semibold">
                        Payment Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Payment ID</p>
                          <p className="font-medium">
                            PAY-{new Date().getFullYear()}-
                            {(new Date().getMonth() + 1)
                              .toString()
                              .padStart(2, "0")}
                            -
                            {Math.floor(Math.random() * 1000)
                              .toString()
                              .padStart(3, "0")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient</p>
                          <p className="font-medium">
                            {patientDetails.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Patient ID</p>
                          <p className="font-medium">
                            {patientDetails.id ? `${patientDetails.id}` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Payment Method
                          </p>
                          <p className="font-medium">
                            {paymentMethod.charAt(0).toUpperCase() +
                              paymentMethod.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Attending Doctor
                          </p>
                          <p className="font-medium">
                            {selectedDoctor
                              ? doctors.find((d) => d.id === selectedDoctor)
                                  ?.name || "N/A"
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold mb-2">
                        Payment Items
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="border px-4 py-2 text-left">
                                Description
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Quantity
                              </th>
                              <th className="border px-4 py-2 text-right">
                                Amount
                              </th>
                              <th className="border px-4 py-2 text-right">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentItems.map((item, index) => (
                              <tr key={index}>
                                <td className="border px-4 py-2">
                                  {item.description || "N/A"}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                  {item.quantity}
                                </td>
                                <td className="border px-4 py-2 text-right">
                                  ₹{item.amount.toFixed(2)}
                                </td>
                                <td className="border px-4 py-2 text-right">
                                  ₹{(item.amount * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td
                                className="border px-4 py-2 text-right font-bold"
                                colSpan={3}
                              >
                                Subtotal:
                              </td>
                              <td className="border px-4 py-2 text-right font-bold">
                                ₹{subtotal.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="border px-4 py-2 text-right font-bold"
                                colSpan={3}
                              >
                                Discount:
                              </td>
                              <td className="border px-4 py-2 text-right font-bold">
                                -₹{discountAmount.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="border px-4 py-2 text-right font-bold"
                                colSpan={3}
                              >
                                Tax:
                              </td>
                              <td className="border px-4 py-2 text-right font-bold">
                                ₹{taxAmount.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                className="border px-4 py-2 text-right font-bold"
                                colSpan={3}
                              >
                                Total:
                              </td>
                              <td className="border px-4 py-2 text-right font-bold">
                                ₹{total.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {paymentNotes && (
                      <div className="mb-6">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                          Payment Notes
                        </h3>
                        <div className="p-3">
                          <p className="whitespace-pre-line text-sm md:text-base break-words overflow-auto max-h-40">
                            {paymentNotes}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="text-sm italic">
                        Payment recorded by: {profile?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button
                    color={TOOL_TIP_COLORS.secondary}
                    className="order-2 sm:order-1 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                    onPress={handleSavePayment}
                  >
                    {`${savePaymentLoading ? `Processing Payment... ` : "Save Payment"}`}
                    <p>
                      {savePaymentLoading && (
                        <Spinner size="sm" color="white" />
                      )}
                    </p>
                  </Button>
                  <Button
                    color={TOOL_TIP_COLORS.secondary}
                    variant="light"
                    onPress={onClose}
                    className="order-1 sm:order-2 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                  >
                    Continue Editing
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      <EnhancedModal
        isOpen={isOpen}
        loading={isLoading}
        modalMessage={modalMessage}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default PaymentEntry;

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
import ShareLinkModal from "../common/Modal/ShareLinkModal";
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
  code: string;
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
  serviceType?: string;
}

interface MedicineItem {
  name: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
}

interface TaxInfo {
  id: string;
  countryName: string;
  countryCode: string;
  countryIso2: string;
  taxType: string;
  taxName: string;
  taxRate: number;
  applicability: string;
  minAmount: number | null;
  maxAmount: number | null;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  description: string;
  priority: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Hospital {
  id: string;
  name: string;
  phone: string;
  email: string;
  ninId: string;
  json: string;
  code: string;
  createdAt: string;
  updatedAt: string;
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
    { description: "", amount: 0, rate: 0, quantity: 1, serviceType: "" },
  ]);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([]);
  const [selectedMedicineName, setSelectedMedicineName] = useState<string>("");
  const [newMedicineQuantity, setNewMedicineQuantity] = useState<number>(1);
  const [newMedicinePrice, setNewMedicinePrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [selectedTaxIds, setSelectedTaxIds] = useState<string[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savePaymentLoading, setSavePaymentLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    code: "",
  });

  // Data fetching state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [taxes, setTaxes] = useState<TaxInfo[]>([]);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  // Constants
  const paymentMethods = [
    "cash",
    "credit card",
    "debit card",
    "bank transfer",
    "upi",
    "other",
  ];

  const serviceTypes = [
    "General Consultation",
    "Specialist Consultation",
    "Follow-up Consultation",
    "Emergency Consultation",
    "Health Checkup",
    "Laboratory Tests",
    "X-Ray",
    "ECG",
    "Ultrasound",
    "Surgery",
    "Dental Treatment",
    "Physiotherapy",
    "Vaccination",
    "Medicine",
    "Other",
  ];

  // Medicine suggestions for autocomplete
  // const medicineSuggestions = [
  //   "Paracetamol 500mg",
  //   "Amoxicillin 250mg",
  //   "Ibuprofen 400mg",
  //   "Omeprazole 20mg",
  //   "Cetirizine 10mg",
  //   "Metformin 500mg",
  //   "Amlodipine 5mg",
  //   "Atorvastatin 10mg",
  //   "Losartan 50mg",
  //   "Metoprolol 25mg",
  //   "Aspirin 100mg",
  //   "Vitamin D3 1000IU",
  //   "Calcium Carbonate 500mg",
  //   "Iron Sulfate 325mg",
  //   "Folic Acid 5mg",
  //   "Azithromycin 250mg",
  //   "Ciprofloxacin 500mg",
  //   "Doxycycline 100mg",
  //   "Clarithromycin 250mg",
  //   "Levofloxacin 500mg",
  // ];

  // const serviceTypeItems = serviceTypes.map((service) => ({
  //   id: service,
  //   label: service,
  // }));

  const getAuthToken = () => {
    return localStorage.getItem("docPocAuth_token") || "";
  };

  // Calculate totals
  const medicineSubtotal = medicineItems.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const serviceSubtotal = paymentItems.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0,
  );

  const subtotal = medicineSubtotal + serviceSubtotal;

  const discountAmount = (subtotal * discountPercentage) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;

  const selectedTaxes = taxes.filter((tax) => selectedTaxIds.includes(tax.id));
  const taxAmount = selectedTaxes.reduce(
    (total, tax) => total + (subtotalAfterDiscount * tax.taxRate) / 100,
    0,
  );
  const total = subtotalAfterDiscount + taxAmount;

  // Data fetching functions
  const fetchHospital = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/hospital`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hospital");
      }

      const data = await response.json();
      // Get the latest hospital (most recent by createdAt)
      if (data && data.length > 0) {
        const latestHospital = data.reduce(
          (latest: Hospital, current: Hospital) => {
            return new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest;
          },
        );
        setHospital(latestHospital);
      }
    } catch (error) {
      console.error("Error fetching hospital:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTaxes = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/tax/country/IND`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch taxes");
      }

      const data = await response.json();
      setTaxes(data.filter((tax: TaxInfo) => tax.isActive));
    } catch (error) {
      console.error("Error fetching taxes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    fetchTaxes();
    fetchHospital();
  }, [
    fetchAppointments,
    fetchPatients,
    fetchDoctors,
    fetchTaxes,
    fetchHospital,
  ]);

  // Form handlers
  const addPaymentItem = () => {
    setPaymentItems([
      ...paymentItems,
      { description: "", amount: 0, quantity: 1, rate: 0, serviceType: "" },
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

  const addMedicineItem = (
    medicineName: string,
    quantity: number,
    pricePerUnit: number,
  ) => {
    if (medicineName?.trim()) {
      const newMedicine: MedicineItem = {
        name: medicineName.trim(),
        quantity: quantity,
        pricePerUnit: pricePerUnit,
        totalAmount: quantity * pricePerUnit,
      };
      setMedicineItems((prev) => [...prev, newMedicine]);
    }
  };

  const removeMedicineItem = (index: number) => {
    setMedicineItems((prev) => prev.filter((_, i) => i !== index));
  };

  // const updateMedicineItem = (
  //   index: number,
  //   field: keyof MedicineItem,
  //   value: any,
  // ) => {
  //   setMedicineItems((prev) => {
  //     const updated = [...prev];
  //     updated[index] = {
  //       ...updated[index],
  //       [field]: value,
  //       ...(field === "quantity" || field === "pricePerUnit"
  //         ? {
  //             totalAmount:
  //               (field === "quantity" ? value : updated[index].quantity) *
  //               (field === "pricePerUnit"
  //                 ? value
  //                 : updated[index].pricePerUnit),
  //           }
  //         : {}),
  //     };
  //     return updated;
  //   });
  // };

  const handleServiceTypeChange = (index: number, serviceType: string) => {
    setPaymentItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        serviceType,
        description: serviceType,
      };
      return updated;
    });
  };

  const openPreviewModal = async () => {
    try {
      setPreviewLoading(true);
      if (selectedPatient) {
        await fetchPatientDetails(selectedPatient);
      }
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error("Error loading preview:", error);
    } finally {
      setPreviewLoading(false);
    }
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

  const clearForm = () => {
    setSelectedAppointment(null);
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setPaymentItems([
      { description: "", amount: 0, rate: 0, quantity: 1, serviceType: "" },
    ]);
    setMedicineItems([]);
    setSelectedMedicineName("");
    setNewMedicineQuantity(1);
    setNewMedicinePrice(0);
    setPaymentMethod("cash");
    setPaymentNotes("");
    setDiscountPercentage(0);
    setSelectedTaxIds([]);
  };

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

      // Check if there are any payment items or medicine items
      const hasPaymentItems = paymentItems.some(
        (item) => item.serviceType && item.serviceType !== "",
      );
      const hasMedicineItems = medicineItems.length > 0;

      if (!hasPaymentItems && !hasMedicineItems) {
        setModalMessage({
          success: "",
          error: "Please add at least one payment item or medicine",
        });
        onOpen();
        return;
      }

      // Validate payment items (non-medicine services)
      const invalidPaymentItems = paymentItems.filter(
        (item) =>
          item.serviceType &&
          item.serviceType !== "Medicine" &&
          (!item.serviceType || item.amount <= 0),
      );

      if (invalidPaymentItems.length > 0) {
        setModalMessage({
          success: "",
          error:
            "Please ensure all payment items have a service type and positive amount",
        });
        onOpen();
        return;
      }

      // Validate medicine items
      const invalidMedicineItems = medicineItems.filter(
        (item) => !item.name || item.quantity <= 0 || item.pricePerUnit <= 0,
      );

      if (invalidMedicineItems.length > 0) {
        setModalMessage({
          success: "",
          error:
            "Please ensure all medicine items have a name, positive quantity, and positive price",
        });
        onOpen();
        return;
      }

      // Check if tax is selected
      if (selectedTaxIds.length === 0) {
        setModalMessage({
          success: "",
          error: "Please select at least one tax",
        });
        onOpen();
        return;
      }

      const paymentData = {
        patientId: selectedPatient,
        branchId: profile?.branchId,
        appointmentId: selectedAppointment,
        doctorId: selectedDoctor,
        hospitalId: hospital?.id,
        taxIds: selectedTaxIds,
        paymentMethod: backendPaymentMethod,
        items: paymentItems
          .filter((item) => item.serviceType && item.serviceType !== "Medicine")
          .map((item) => ({
            description: item.description || item.serviceType,
            amount: item.amount,
            rate: item.rate,
            quantity: item.quantity,
            serviceType: item.serviceType,
            totalAmount: item.amount * item.quantity,
          })),
        medicines: medicineItems,
        subtotal,
        discountPercentage,
        discountAmount,
        taxAmount,
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

      if (receiptUrl) {
        setShareLink(receiptUrl);
        setIsShareModalOpen(true);
      }

      setModalMessage({
        success: "Payment recorded successfully!",
        error: "",
      });
      onOpen();
      closePreviewModal();
      clearForm(); // Clear the form after successful payment
    } catch (error: any) {
      console.error("Error saving payment:", error);

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

  const parseHospitalJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing hospital JSON:", error);
      return {};
    }
  };

  const hospitalDetails = hospital ? parseHospitalJson(hospital.json) : {};

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

  const serviceTypeItems = serviceTypes.map((service) => ({
    id: service,
    label: service,
  }));

  const taxItems = taxes.map((tax) => ({
    id: tax.id,
    label: `${tax.taxName} (${tax.taxRate}%)`,
    taxRate: tax.taxRate,
  }));

  // Parse hospital JSON data
  // const getHospitalDetails = () => {
  //   if (!hospital) return null;
  //   try {
  //     const hospitalData = JSON.parse(hospital.json);
  //     return {
  //       name: hospital.name,
  //       phone: hospital.phone,
  //       email: hospital.email,
  //       address: hospitalData.address,
  //       pincode: hospitalData.pincode,
  //       state: hospitalData.state,
  //       code: hospital.code,
  //     };
  //   } catch (error) {
  //     console.error("Error parsing hospital data:", error);
  //     return null;
  //   }
  // };

  // const hospitalDetails = getHospitalDetails();

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

        /* Receipt styles */
        .receipt-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .receipt-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .receipt-body {
          padding: 2rem;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .receipt-table th,
        .receipt-table td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }

        .receipt-table th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .receipt-total {
          border-top: 2px solid #e5e7eb;
          margin-top: 1rem;
          padding-top: 1rem;
        }

        .receipt-footer {
          background-color: #f9fafb;
          padding: 1rem 2rem;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
      <div className="max-w-4xl mx-auto rounded-[15px] border border-stroke bg-white dark:bg-gray-dark shadow-1 dark:border-dark-3 dark:shadow-card p-4 md:p-8 space-y-4 md:space-y-6">
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
              className="space-y-4 mt-4 p-4 border border-gray-200 dark:border-dark-3 rounded-lg bg-white dark:bg-gray-dark"
            >
              {/* Service Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Select
                    variant="bordered"
                    color={TOOL_TIP_COLORS.secondary}
                    label="Service Type"
                    labelPlacement="outside"
                    placeholder="Select service type"
                    selectedKeys={item.serviceType ? [item.serviceType] : []}
                    onChange={(e) =>
                      handleServiceTypeChange(index, e.target.value)
                    }
                    isDisabled={item.serviceType !== ""} // Lock after selection
                    className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                  >
                    {serviceTypeItems.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {item.serviceType && (
                    <p className="text-xs text-gray-500 mt-1">
                      Service type locked. Add new item to change.
                    </p>
                  )}
                </div>

                {/* Amount - Only show for non-medicine services */}
                {item.serviceType && item.serviceType !== "Medicine" && (
                  <div className="md:col-span-5">
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
                )}

                {/* Remove button */}
                <div
                  className={`${item.serviceType && item.serviceType !== "Medicine" ? "md:col-span-3" : "md:col-span-8"} flex items-center gap-2`}
                >
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => removePaymentItem(index)}
                    className="h-[56px] px-3 rounded-[7px]"
                    isIconOnly
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Medicine Names Section - Only show for Medicine service */}
              {item.serviceType === "Medicine" && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <label className="block text-sm font-medium text-dark dark:text-white">
                      Medicine Management
                    </label>
                  </div>

                  {/* Medicine Input Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 border border-stroke dark:border-dark-3 rounded-lg bg-white dark:bg-gray-dark">
                    <div className="sm:col-span-2 lg:col-span-2">
                      <Input
                        type="text"
                        variant="bordered"
                        color={TOOL_TIP_COLORS.secondary}
                        label="Medicine Name"
                        labelPlacement="outside"
                        placeholder="Enter medicine name"
                        className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                        value={selectedMedicineName}
                        onChange={(e) =>
                          setSelectedMedicineName(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        variant="bordered"
                        color={TOOL_TIP_COLORS.secondary}
                        label="Quantity"
                        labelPlacement="outside"
                        placeholder="Enter quantity (e.g., 10)"
                        min="1"
                        value={newMedicineQuantity.toString()}
                        onChange={(e) =>
                          setNewMedicineQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        variant="bordered"
                        color={TOOL_TIP_COLORS.secondary}
                        label="Price per Unit"
                        labelPlacement="outside"
                        placeholder="Enter price (e.g., 5.50)"
                        min="0"
                        step="0.01"
                        value={newMedicinePrice.toString()}
                        onChange={(e) =>
                          setNewMedicinePrice(parseFloat(e.target.value) || 0)
                        }
                        className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                      />
                    </div>

                    <div className="flex gap-2 items-end">
                      <Button
                        color={TOOL_TIP_COLORS.secondary}
                        className="flex-1 rounded-[7px] font-medium"
                        onPress={() => {
                          if (
                            selectedMedicineName?.trim() &&
                            newMedicinePrice > 0
                          ) {
                            addMedicineItem(
                              selectedMedicineName,
                              newMedicineQuantity,
                              newMedicinePrice,
                            );
                            setSelectedMedicineName("");
                            setNewMedicineQuantity(1);
                            setNewMedicinePrice(0);
                          }
                        }}
                        isDisabled={
                          !selectedMedicineName?.trim() || newMedicinePrice <= 0
                        }
                      >
                        <span className="hidden sm:inline">Add Medicine</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </div>
                  </div>

                  {/* Medicine List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-dark dark:text-white flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${medicineItems.length > 0 ? "bg-green-500" : "bg-gray-400"}`}
                      ></span>
                      Added Medicines ({medicineItems.length})
                    </h4>

                    {medicineItems.length === 0 && (
                      <div className="text-center py-6 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          No medicines added yet. Use the form above to add
                          medicines.
                        </div>
                      </div>
                    )}

                    {medicineItems.length > 0 && (
                      <div className="overflow-x-auto rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full min-w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-stroke dark:border-dark-3">
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Medicine
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Price/Unit
                              </th>
                              <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {medicineItems.map((medicine, medIndex) => (
                              <tr
                                key={medIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                  {medicine.name}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                                  {medicine.quantity}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                                  ₹{medicine.pricePerUnit.toFixed(2)}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                                  ₹{medicine.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <Button
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                    onPress={() => removeMedicineItem(medIndex)}
                                    isIconOnly
                                    className="min-w-0"
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50 dark:bg-gray-700 border-t border-stroke dark:border-dark-3">
                              <td
                                colSpan={3}
                                className="px-3 py-3 text-sm font-semibold text-right text-gray-900 dark:text-gray-100"
                              >
                                Medicine Subtotal:
                              </td>
                              <td className="px-3 py-3 text-sm font-bold text-right text-blue-600 dark:text-blue-400">
                                ₹{medicineSubtotal.toFixed(2)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Description for non-medicine services */}
              {item.serviceType && item.serviceType !== "Medicine" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Service Description
                  </label>
                  <Input
                    type="text"
                    variant="bordered"
                    color={TOOL_TIP_COLORS.secondary}
                    placeholder={`Enter ${item.serviceType.toLowerCase()} details`}
                    value={item.description}
                    onChange={(e) =>
                      updatePaymentItem(index, "description", e.target.value)
                    }
                    className="w-full rounded-[7px] bg-white dark:bg-gray-dark border-stroke dark:border-dark-3"
                  />
                </div>
              )}
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
            <Input
              type="number"
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              label="Discount (%)"
              labelPlacement="outside"
              placeholder="Discount percentage"
              min="0"
              max="100"
              value={discountPercentage.toString()}
              onChange={(e) =>
                setDiscountPercentage(parseFloat(e.target.value) || 0)
              }
              className="w-full"
            />
            <Select
              variant="bordered"
              color={TOOL_TIP_COLORS.secondary}
              label="Select Taxes *"
              labelPlacement="outside"
              placeholder="Select Taxes (Required)"
              selectedKeys={selectedTaxIds}
              onSelectionChange={(keys) =>
                setSelectedTaxIds(Array.from(keys) as string[])
              }
              selectionMode="multiple"
              className="w-full"
            >
              {taxItems.map((tax) => (
                <SelectItem key={tax.id} value={tax.id}>
                  {tax.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                Discount ({discountPercentage}%):
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Subtotal after discount:</span>
              <span>₹{subtotalAfterDiscount.toFixed(2)}</span>
            </div>
            {selectedTaxes.length > 0 && (
              <div className="space-y-1">
                {selectedTaxes.map((tax) => (
                  <div key={tax.id} className="flex justify-between">
                    <span className="font-medium">
                      {tax.taxName} ({tax.taxRate}%):
                    </span>
                    <span>
                      ₹
                      {((subtotalAfterDiscount * tax.taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-1">
                  <span className="font-medium">Total Tax:</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
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
          isDisabled={previewLoading}
        >
          {previewLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" color="white" />
              <span>Loading Preview...</span>
            </div>
          ) : (
            "Preview Payment"
          )}
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
                  <div className="space-y-6 text-left p-4 bg-white dark:bg-gray-800 rounded-lg w-full">
                    {/* Hospital Header - Just Added */}
                    {hospital && (
                      <div className="text-center border-b-2 border-blue-600 pb-4 mb-4">
                        <h2 className="text-xl font-bold  mb-2">
                          {hospital.name}
                        </h2>
                        <div className="text-gray-600 dark:text-white space-y-1 text-sm">
                          <p>{hospitalDetails.address || "Hospital Address"}</p>
                          <p>Pincode: {hospitalDetails.pincode || "N/A"}</p>
                          <p>
                            Phone: {hospital.phone} | Email: {hospital.email}
                          </p>
                          {/* <p className="font-medium">Hospital Code: {hospital.code}</p> */}
                        </div>
                      </div>
                    )}

                    <div className="border-b pb-4">
                      <h2 className="text-lg md:text-xl font-semibold">
                        Payment Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Payment ID</p>
                          <p className="font-medium">Not Generated</p>
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
                            {patientDetails.code
                              ? `${patientDetails.code}`
                              : "N/A"}
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
                        <div>
                          <p className="text-sm text-gray-500">Taxes Applied</p>
                          <p className="font-medium">
                            {selectedTaxes.length > 0
                              ? selectedTaxes
                                  .map(
                                    (tax) => `${tax.taxName} (${tax.taxRate}%)`,
                                  )
                                  .join(", ")
                              : "No tax selected"}
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
                            {/* Service Items */}
                            {paymentItems
                              .filter((item) => item.serviceType !== "Medicine")
                              .map((item, index) => (
                                <tr key={`service-${index}`}>
                                  <td className="border px-4 py-2">
                                    <div>
                                      <div className="font-medium">
                                        {item.serviceType ||
                                          item.description ||
                                          "N/A"}
                                      </div>
                                      {item.serviceType &&
                                        item.serviceType !== "Medicine" &&
                                        item.description && (
                                          <div className="text-sm text-gray-600 mt-1">
                                            {item.description}
                                          </div>
                                        )}
                                    </div>
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

                            {/* Medicine Items */}
                            {medicineItems.map((medicine, index) => (
                              <tr key={`medicine-${index}`}>
                                <td className="border px-4 py-2">
                                  <div className="font-medium ">
                                    {medicine.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Medicine
                                  </div>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                  {medicine.quantity}
                                </td>
                                <td className="border px-4 py-2 text-right">
                                  ₹{medicine.pricePerUnit.toFixed(2)}
                                </td>
                                <td className="border px-4 py-2 text-right">
                                  ₹{medicine.totalAmount.toFixed(2)}
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
                                Discount ({discountPercentage}%):
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
                                Subtotal after discount:
                              </td>
                              <td className="border px-4 py-2 text-right font-bold">
                                ₹{subtotalAfterDiscount.toFixed(2)}
                              </td>
                            </tr>
                            {selectedTaxes.length > 0 && (
                              <>
                                {selectedTaxes.map((tax) => (
                                  <tr key={tax.id}>
                                    <td
                                      className="border px-4 py-2 text-right font-bold"
                                      colSpan={3}
                                    >
                                      {tax.taxName} ({tax.taxRate}%):
                                    </td>
                                    <td className="border px-4 py-2 text-right font-bold">
                                      ₹
                                      {(
                                        (subtotalAfterDiscount * tax.taxRate) /
                                        100
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    className="border px-4 py-2 text-right font-bold"
                                    colSpan={3}
                                  >
                                    Total Tax:
                                  </td>
                                  <td className="border px-4 py-2 text-right font-bold">
                                    ₹{taxAmount.toFixed(2)}
                                  </td>
                                </tr>
                              </>
                            )}
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
                    isDisabled={savePaymentLoading || isLoading}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {savePaymentLoading ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        "Save Payment"
                      )}
                    </div>
                  </Button>
                  <Button
                    color={TOOL_TIP_COLORS.secondary}
                    variant="light"
                    onPress={onClose}
                    className="order-1 sm:order-2 rounded-[7px] p-[10px] font-medium hover:bg-opacity-90 bg-purple-500 text-white w-full sm:w-auto"
                    isDisabled={savePaymentLoading || isLoading}
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
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        link={shareLink}
      />
    </div>
  );
};

export default PaymentEntry;

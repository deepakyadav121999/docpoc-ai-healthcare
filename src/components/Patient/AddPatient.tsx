"use client";
import {
  Button,
  Checkbox,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
interface AddPatientProps {
  onPatientAdded: () => void; 
}

const AddPatient: React.FC<AddPatientProps> = ({ onPatientAdded }) => {

  const [edit, setEdit] = useState(true);
  const [formData, setFormData] = useState({
    branchId: "12a1c77b-39ed-47e6-b6aa-0081db2c1469",
    name: "",
    phone: "",
    email: "",
    displayPicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrUABrI0sYfGIk3rDpqPhosYWG11vkchK1LA&s",
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


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingFields: string[] = [];
  
    for (const key in formData) {
      if (!formData[key as keyof typeof formData] && key !== "branchId") {
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }
  
    if (missingFields.length > 0) {
      alert(`The following fields are required: ${missingFields.join(", ")}`);
      return;
    }
  
    setLoading(true);
  
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      alert("No access token found. Please log in again.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:3037/DocPOC/v1/patient",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Patient added successfully!");
      setFormData({
        branchId: "12a1c77b-39ed-47e6-b6aa-0081db2c1469",
        name: "",
        phone: "",
        email: "",
        displayPicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6EJJftxVumOjPQin95gRbhNzs4Kas4Kisg&s",
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
      alert(`Error adding patient: ${error.response?.data?.message || "Unknown error"}`);
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  isDisabled={!edit}
                />
                <Input
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
                className="rounded-[7px] p-[13px] font-medium hover:bg-opacity-90"
                style={{ minWidth: 300, marginBottom: 20 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;

"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import { IndianStatesList } from "@/constants/IndiaStates";

const AddAppointment = () => {
  const [edit, setEdit] = useState(true);
  const [formData, setFormData] = useState({
    name: "XYZ Dental Clinic",
    doctorId: "",
    patientId: "",
    branchId: "",
    visitType: "",
    startDateTime: "",
    endDateTime: "",
    code: "ST-ID/15",
    json: '{"dob":"28th Jan, 1996."}',
  });
  const [loading, setLoading] = useState(false);

  const handleTimeChange = (time: Time, field: "startDateTime" | "endDateTime") => {
    const isoTime = `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}:00`;
    setFormData({ ...formData, [field]: isoTime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const token = localStorage.getItem("docPocAuth_token");
  
    if (!token) {
      alert("No access token found. Please log in again.");
      setLoading(false);
      return;
    }
  
    console.log("Token:", token); 
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:3037/DocPOC/v1/appointment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Appointment Created:", response.data);
      alert("Appointment created successfully!");
    } catch (error: any) {
      console.error("Error creating appointment:", error.response?.data || error.message);
      alert(`Error creating appointment: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  

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
                  defaultValue={new Time(7, 38)}
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
                  defaultItems={IndianStatesList}
                  label="Select Patient"
                  placeholder="Search a Patient"
                  onSelectionChange={(key) => setFormData({ ...formData, patientId: key as string })}
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
                  defaultItems={IndianStatesList}
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

export default AddAppointment;

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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import { IndianStatesList } from "@/constants/IndiaStates";
import { medicalDepartments } from "@/constants/MedicalDepartments";

// Interface for clinic data
interface ClinicData {
  contactNumber: string;
  email: string;
  workingDays: string[];
  shiftStartTime: Time;
  shiftEndTime: Time;
  address: string;
  state: string;
  pincode: string;
  departments: string[];
  autoConfirmAppointments: boolean;
}

const General = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);

  // Fallback data (current hardcoded values)
  const defaultClinicData: ClinicData = {
    contactNumber: "+91-7866350926",
    email: "mera-clinic@docpoc.app",
    workingDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    shiftStartTime: new Time(8, 45),
    shiftEndTime: new Time(18, 45),
    address: "H No.123 Panchayat Bhawan, Phulera Gram Panchayat, 965244",
    state: "karnataka",
    pincode: "560037",
    departments: ["orthopedics", "dental", "ent", "pediatrics"],
    autoConfirmAppointments: false,
  };

  // Function to fetch clinic data
  const fetchClinicData = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      // Clear previous data on retry
      if (isRetry) {
        setClinicData(null);
      }

      // TODO: Replace with actual API call
      // For now, simulate API call with timeout
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 100% failure for testing - change to < 0.1 for 10% failure
          const shouldFail = Math.random() < 1.0; // 100% chance of failure for testing
          if (shouldFail) {
            reject(new Error("Network error"));
          } else {
            resolve(defaultClinicData);
          }
        }, 1000);
      });

      setClinicData(defaultClinicData);
    } catch (err: any) {
      console.error("Error fetching clinic data:", err);

      // Determine error message based on error type
      let errorMessage = "Something went wrong. Please refresh to try again.";

      if (
        err?.code === "NETWORK_ERROR" ||
        err?.message?.includes("network") ||
        err?.message?.includes("Network")
      ) {
        errorMessage =
          "Network error. Please check your connection and refresh.";
      } else if (
        err?.code === "ECONNRESET" ||
        err?.message?.includes("ECONNRESET")
      ) {
        errorMessage = "Connection was reset. Please refresh to try again.";
      } else if (err?.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and refresh.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please refresh to try again.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      }

      setError(errorMessage);
      // Don't set clinic data to null on error - this prevents empty forms
      // setClinicData will remain null, which will trigger the error UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicData();
  }, []);

  const flipEdit = () => {
    setEdit(!edit);
  };
  // Show error state - ALWAYS show error UI if there's an error
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-9 m-2">
        <div className="flex flex-col w-full">
          <div className="rounded-[15px] border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Unable to Load Clinic Details
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => fetchClinicData(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-9 m-2">
        <div className="flex flex-col w-full">
          <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="p-6.5 space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show the form if we have clinic data (success state)
  if (!clinicData) {
    return (
      <div className="grid grid-cols-1 gap-9 m-2">
        <div className="flex flex-col w-full">
          <div className="rounded-[15px] border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  No Clinic Data Found
                </h3>
                <p className="text-red-600 dark:text-red-300 mb-4">
                  Please create a clinic/hospital first or refresh to try again.
                </p>
                <button
                  onClick={() => fetchClinicData(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                defaultSelected
                color="secondary"
                onClick={flipEdit}
                isSelected={edit}
              >
                Edit
              </Switch>
            </div>
          </div>
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <Input
                  key="inside"
                  variant="bordered"
                  type="text"
                  labelPlacement="outside"
                  label="Contact Number"
                  color={TOOL_TIP_COLORS.secondary}
                  maxLength={15}
                  defaultValue={clinicData?.contactNumber || ""}
                  isDisabled={!edit}
                />
                <Input
                  key="inside"
                  variant="bordered"
                  type="email"
                  labelPlacement="outside"
                  label="Email"
                  isDisabled={!edit}
                  defaultValue={clinicData?.email || ""}
                  color={TOOL_TIP_COLORS.secondary}
                />
              </div>
              <div className="flex flex-col w-full">
                <CheckboxGroup
                  label="Select working days"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  defaultValue={clinicData?.workingDays || []}
                  isDisabled={!edit}
                >
                  <Checkbox value="monday">Monday</Checkbox>
                  <Checkbox value="tuesday">Tuesday</Checkbox>
                  <Checkbox value="wednesday">Wednesday</Checkbox>
                  <Checkbox value="thursday">Thursday</Checkbox>
                  <Checkbox value="friday">Friday</Checkbox>
                  <Checkbox value="saturday">Saturday</Checkbox>
                  <Checkbox value="sunday">Sunday</Checkbox>
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
                  defaultValue={clinicData?.shiftStartTime || new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultValue={clinicData?.shiftEndTime || new Time(18, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                />
              </div>
              <div style={{ marginTop: 20 }}>
                <Textarea
                  color={TOOL_TIP_COLORS.secondary}
                  isInvalid={false}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Visiting Address"
                  defaultValue={clinicData?.address || ""}
                  errorMessage="The address should be at max 255 characters long."
                  isDisabled={!edit}
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
                  defaultSelectedKey={clinicData?.state || "karnataka"}
                  defaultItems={IndianStatesList}
                  label="Select State"
                  placeholder="Search a state"
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
                  defaultValue={clinicData?.pincode || ""}
                  isDisabled={!edit}
                />
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <CheckboxGroup
                  label="Select Eligible Departments"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  defaultValue={clinicData?.departments || []}
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
                <Checkbox
                  color={TOOL_TIP_COLORS.secondary}
                  isDisabled={!edit}
                  defaultSelected={clinicData?.autoConfirmAppointments || false}
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
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default General;

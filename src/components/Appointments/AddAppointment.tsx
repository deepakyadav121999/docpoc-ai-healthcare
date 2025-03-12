"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  // CheckboxGroup,
  // Input,
  // Switch,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { useState } from "react";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import { IndianStatesList } from "@/constants/IndiaStates";
// import { medicalDepartments } from "@/constants/MedicalDepartments";

const AddAppointment = () => {
  const [edit, setEdit] = useState(true);
  // const [workingDays] = useState([
  //   "monday",
  //   "tuesday",
  //   "wednesday",
  //   "thursday",
  //   "friday",
  //   "saturday",
  // ]);

  // const [selectedDepartments] = useState([
  //   "orthopedics",
  //   "dental",
  //   "ent",
  //   "pediatrics",
  // ]);

  // const flipEdit = () => {
  //   setEdit(!edit);
  // };
  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col w-full">
        {/* <!-- Contact Form --> */}
        <div className="rounded-[15px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row gap-9">
            {/* <div>
              <Switch
                defaultSelected
                color="secondary"
                onClick={flipEdit}
                isSelected={edit}
              >
                Edit
              </Switch>
            </div> */}
          </div>
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"></div>
              <div className="flex flex-col w-full"></div>
              <div
                className="mb-4.5 flex flex-col gap-4.5 xl:flex-row"
                style={{ marginTop: 20 }}
              >
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment Start Time"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultValue={new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Appointment End Time"
                  labelPlacement="outside"
                  variant="bordered"
                  defaultValue={new Time(6, 45)}
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
                  label="Remakrks"
                  defaultValue="Patient is having chronic neck pain."
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
                  defaultSelectedKey="Patient 1"
                  defaultItems={IndianStatesList}
                  label="Select Patient"
                  placeholder="Search a Patient"
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
                <Autocomplete
                  color={TOOL_TIP_COLORS.secondary}
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={!edit}
                  // defaultSelectedKey="Doctor 1"
                  defaultItems={IndianStatesList}
                  label="Select Doctor"
                  placeholder="Search a Doctor"
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
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <label>
                  Mark uncheck if no notification has to be sent for
                  appointment.
                </label>
                <Checkbox
                  color={TOOL_TIP_COLORS.secondary}
                  defaultSelected={true}
                  isDisabled={!edit}
                >
                  All appointments gets notified to the patient by default.
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

export default AddAppointment;

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
import { useState } from "react";
import { TOOL_TIP_COLORS } from "@/constants";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Time } from "@internationalized/date";
import React from "react";
import { IndianStatesList } from "@/constants/IndiaStates";
import { medicalDepartments } from "@/constants/MedicalDepartments";

const General = () => {
  const [edit, setEdit] = useState(false);
  const [workingDays] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]);

  const [selectedDepartments] = useState([
    "orthopedics",
    "dental",
    "ent",
    "pediatrics",
  ]);

  const flipEdit = () => {
    setEdit(!edit);
  };
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
                  defaultValue="+91-7866350926"
                  isDisabled={!edit}
                />
                <Input
                  key="inside"
                  variant="bordered"
                  type="email"
                  labelPlacement="outside"
                  label="Email"
                  isDisabled={!edit}
                  defaultValue="mera-clinic@docpoc.app"
                  color={TOOL_TIP_COLORS.secondary}
                />
              </div>
              <div className="flex flex-col w-full">
                <CheckboxGroup
                  label="Select working days"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  defaultValue={workingDays}
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
                  defaultValue={new Time(8, 45)}
                  startContent={<SVGIconProvider iconName="clock" />}
                  isDisabled={!edit}
                />
                <TimeInput
                  color={TOOL_TIP_COLORS.secondary}
                  label="Shift End Time"
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
                  label="Visiting Address"
                  defaultValue="H No.123 Panchayat Bhawan, Phulera Gram Panchayat, 965244"
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
                  defaultSelectedKey="karnataka"
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
                  defaultValue="560037"
                  isDisabled={!edit}
                />
              </div>

              <div className="flex flex-col w-full" style={{ marginTop: 20 }}>
                <CheckboxGroup
                  label="Select Eligible Departments"
                  orientation="horizontal"
                  color={TOOL_TIP_COLORS.secondary}
                  defaultValue={selectedDepartments}
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
                  Leave unchecked if appointments from your website needs admin(s)
                  action to confirm booking.
                </label>
                <Checkbox color={TOOL_TIP_COLORS.secondary} isDisabled={!edit}>
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

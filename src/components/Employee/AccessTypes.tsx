import React from "react";
import { CheckboxGroup, Checkbox, Textarea } from "@nextui-org/react";
import ButtonDefault from "../Buttons/ButtonDefault";
import StyledButton from "../common/Button/StyledButton";

export default function UserAccessTypes(props: { note?: string }) {
  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full">
        {props.note && (
          <Textarea
            isReadOnly
            label="Requested access"
            variant="bordered"
            labelPlacement="inside"
            placeholder="Enter your description"
            defaultValue={props.note}
          />
        )}
        <CheckboxGroup
          label="Select access"
          orientation="horizontal"
          color="secondary"
          defaultValue={["edit-create-appointments", "edit-create-payments"]}
        >
          <Checkbox value="edit-create-appointments">
            Edit/Create Appointments
          </Checkbox>
          <Checkbox value="edit-create-payments">Edit/Create Payments</Checkbox>
          <Checkbox value="edit-create-reminders">
            Edit/Create Reminders
          </Checkbox>
          <Checkbox value="edit-create-staffs">Edit/Create Staffs</Checkbox>
          <Checkbox value="edit-create-patients">Edit/Create Patients</Checkbox>
        </CheckboxGroup>
      </div>
      <div style={{ marginTop: 10 }}>
        <StyledButton label={"Save"} type={"submit"} style={{ width: "10%" }} />
      </div>
    </div>
  );
}

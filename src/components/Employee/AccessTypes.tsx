import React, { useEffect, useState } from "react";
import { CheckboxGroup, Checkbox, Button } from "@nextui-org/react";
import StyledButton from "../common/Button/StyledButton";

interface Employee {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  email: string;

  json: string;
  accessType: string; // JSON string
}

interface UserAccessTypesProps {
  user: Employee; // Use Employee interface instead of User
  onSubmit: (updatedUser: Employee) => void;
}

export default function UserAccessTypes({
  user,
  onSubmit,
}: UserAccessTypesProps) {
  const [accessKeys, setAccessKeys] = useState<string[]>([]);
  const [accessData, setAccessData] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const parsedAccessType = JSON.parse(user.accessType);
      setAccessData(parsedAccessType);
      setAccessKeys(
        Object.keys(parsedAccessType).filter((key) => parsedAccessType[key]),
      );
    } catch (error) {
      console.error("Error parsing accessType:", error);
    }
  }, [user.accessType]);

  const handleSave = () => {
    const updatedAccessType = { ...accessData };
    Object.keys(updatedAccessType).forEach(
      (key) => (updatedAccessType[key] = accessKeys.includes(key)),
    );

    const updatedUser = {
      ...user,
      accessType: JSON.stringify(updatedAccessType),
    };

    onSubmit(updatedUser); // Send updated user object to parent
  };

  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full">
        <CheckboxGroup
          label="Select access"
          orientation="horizontal"
          color="secondary"
          value={accessKeys}
          onChange={(selected) => setAccessKeys(selected as string[])}
        >
          <Checkbox value="setAppointments">Edit/Create Appointments</Checkbox>
          {/* <Checkbox value="messagePatient">Message Patient</Checkbox> */}
          <Checkbox value="editDoctor">Edit Doctor</Checkbox>
          <Checkbox value="editCreatePatients">Edit/Create Patients</Checkbox>
          <Checkbox value="editCreateStaffs">Edit/Create Staffs</Checkbox>
          <Checkbox value="editCreateReminders">Edit/Create Reminders</Checkbox>
          <Checkbox value="editCreatePayments">Edit/Create Payments</Checkbox>
        </CheckboxGroup>
      </div>
      <div style={{ marginTop: 10 }}>
        {/* <StyledButton
          label="Save"
          type="submit"
          style={{ width: "10%" }}
          onClick={handleSave}
        /> */}
        <Button color="primary" type="submit" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

{
  /* <div className="flex flex-col w-full">
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
 </div> */
}

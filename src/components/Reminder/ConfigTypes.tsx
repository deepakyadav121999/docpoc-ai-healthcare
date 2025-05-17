// import React from "react";
// import {
//   CheckboxGroup,
//   Checkbox,
//   Textarea,
//   TableRow,
//   Switch,
//   Input,
//   Divider,
// } from "@nextui-org/react";
// import StyledButton from "../common/Button/StyledButton";
// import { TOOL_TIP_COLORS } from "@/constants";

// export default function ConfigTypes(props: {
//   note?: string;
//   buttons?: string[];
// }) {
//   return (
//     <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
//       <div className="flex flex-col w-full">
//         {props.note && (
//           <Textarea
//             isReadOnly
//             label="Requested access"
//             variant="bordered"
//             labelPlacement="inside"
//             placeholder="Enter your description"
//             defaultValue={props.note}
//           />
//         )}
//         <CheckboxGroup
//           label="Enable notification for:"
//           orientation="horizontal"
//           color="secondary"
//           defaultValue={["edit-create-appointments", "edit-create-payments"]}
//         >
//           {props.buttons &&
//             props.buttons.map((item) => (
//               <Checkbox value="edit-create-appointments">{item}</Checkbox>
//             ))}
//         </CheckboxGroup>
//       </div>
//       <Divider style={{ marginTop: 10 }} />
//       <div className="flex flex-col w-full" style={{ marginTop: 10 }}>
//         <div className="flex flex-col w-full">
//           <Switch defaultSelected={false} color="secondary">
//             Enable for all patients{" "}
//           </Switch>
//         </div>
//         <div className="flex flex-col w-full" style={{ marginTop: 10 }}>
//           <p>
//             or enable notification for all patients above a certain age by
//             entring age.{" "}
//           </p>
//         </div>
//         <div
//           className="flex flex-col w-full"
//           style={{ maxWidth: 300, marginTop: 10 }}
//         >
//           <Input
//             key="inside"
//             type="number"
//             labelPlacement="inside"
//             placeholder="Enter patient age"
//             color={TOOL_TIP_COLORS.secondary}
//           />
//         </div>
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <StyledButton label={"Save"} type={"submit"} style={{ width: "10%" }} />
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  CheckboxGroup,
  Checkbox,
  Textarea,
  Switch,
  Input,
  Divider,
} from "@nextui-org/react";
import StyledButton from "../common/Button/StyledButton";
import { TOOL_TIP_COLORS } from "@/constants";

export default function ConfigTypes(props: {
  note?: string;
  buttons?: string[];
}) {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [enableForAll, setEnableForAll] = useState<boolean>(false);
  const [age, setAge] = useState<string>("");

  const handleCheckboxChange = (values: string[]) => {
    setSelectedNotifications(values);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setEnableForAll(checked);
    if (checked) {
      setAge(""); // Clear age input when enabling for all patients
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

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
          label="Enable notification for:"
          orientation="horizontal"
          color="secondary"
          value={selectedNotifications}
          onChange={handleCheckboxChange}
        >
          {props.buttons &&
            props.buttons.map((item) => (
              <Checkbox key={item} value={item}>
                {item}
              </Checkbox>
            ))}
        </CheckboxGroup>
      </div>
      <Divider style={{ marginTop: 10 }} />
      <div className="flex flex-col w-full" style={{ marginTop: 10 }}>
        <div className="flex flex-col w-full">
          <Switch
            checked={enableForAll}
            onChange={handleSwitchChange}
            color="secondary"
          >
            Enable for all patients
          </Switch>
        </div>
        <div className="flex flex-col w-full" style={{ marginTop: 10 }}>
          <p>
            or enable notification for all patients above a certain age by
            entering age.
          </p>
        </div>
        <div
          className="flex flex-col w-full"
          style={{ maxWidth: 300, marginTop: 10 }}
        >
          <Input
            key="inside"
            type="number"
            labelPlacement="inside"
            placeholder="Enter patient age"
            color={TOOL_TIP_COLORS.secondary}
            value={age}
            onChange={handleAgeChange}
            disabled={enableForAll} // Disable age input if enabling for all
          />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <StyledButton label={"Save"} type={"submit"} style={{ width: "10%" }} />
      </div>
    </div>
  );
}

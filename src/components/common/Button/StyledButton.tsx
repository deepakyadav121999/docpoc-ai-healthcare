import React from "react";
import { Button } from "@nextui-org/react";

type ButtonType = "button" | "submit" | "reset";

export default function StyledButton(props: { label: string; clickEvent?: any; loading?: boolean; type?: ButtonType; style?: any }) {
  return (
    <Button
      style={{width: props.style?.width}}
      type={props.type}
      onClick={props.clickEvent}
      radius="full"
      isLoading={props.loading}
      className="bg-gradient-to-tr from-indigo-400 to-violet-500 text-white shadow-lg"
    >
      {props.label}
    </Button>
  );
}

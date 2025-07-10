import React from "react";
import { Button } from "@nextui-org/react";

type ButtonType = "button" | "submit" | "reset";
type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export default function StyledButton(props: {
  label: string;
  clickEvent?: any;
  loading?: boolean;
  type?: ButtonType;
  style?: any;
  disabled?: boolean;
  color?: ButtonColor;
  className?: string;
}) {
  return (
    <Button
      style={{ width: props.style?.width }}
      type={props.type}
      onClick={props.clickEvent}
      radius="full"
      isLoading={props.loading}
      isDisabled={props.disabled}
      color={props.color || "primary"}
      className={`${
        !props.color
          ? "bg-gradient-to-tr from-indigo-400 to-violet-500 text-white shadow-lg"
          : ""
      } ${props.className || ""}`}
    >
      {props.label}
    </Button>
  );
}

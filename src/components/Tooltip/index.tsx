import React from "react";
import { Tooltip, Button } from "@nextui-org/react";
import { TOOL_TIP_COLORS } from "@/constants";

export default function ToolTip(props: {
  label: string;
  color: TOOL_TIP_COLORS;
  clickEvent?: any;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip
        key={props.color}
        color={props.color}
        content={props.color}
        className="capitalize"
      >
        <Button
          style={{ maxWidth: 15, maxHeight: 15 }}
          variant="flat"
          color={props.color}
          onClick={props.clickEvent}
          className="capitalize"
        >
          {props.label}
        </Button>
      </Tooltip>
    </div>
  );
}

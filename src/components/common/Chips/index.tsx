import React from "react";
import {Chip} from "@nextui-org/react";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { CHIPS_COLORS, GLOBAL_SUCCESS_COLOR } from "@/constants";

export default function ChipElement(props:{label:string, hasIcon?: boolean, iconName?:string, type:CHIPS_COLORS}) {
  return (
    <div className="flex gap-4">
      <Chip
        startContent={<SVGIconProvider color={GLOBAL_SUCCESS_COLOR} iconName={props.iconName ?? ''} />}
        variant="faded"
        color={props.type}
      >
        {props.label}
      </Chip>
    </div>
  );
}

import React from "react";
import { Code } from "@nextui-org/react";
import { TOOL_TIP_COLORS } from "@/constants";

export default function HighlightedText(props: {
  color: TOOL_TIP_COLORS;
  text: string;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <Code color={props.color}>{props.text}</Code>
    </div>
  );
}

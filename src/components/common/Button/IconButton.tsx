import React from "react";
import { Button } from "@nextui-org/react";
import { SVGIconProvider } from "@/constants/svgIconProvider";
export default function EditIconButton(props: { clickEvent: any }) {
  return (
    <div className="flex gap-4 items-center">
      <Button
        style={{ maxWidth: 20, maxHeight: 20 }}
        isIconOnly
        color="warning"
        variant="faded"
        aria-label="Take a photo"
        onClick={props.clickEvent}
      >
        <SVGIconProvider iconName="edit" />
      </Button>
    </div>
  );
}
